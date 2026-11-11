package com.cy.launcher;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.HapticFeedbackConstants;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityWindowInfo;
import android.widget.FrameLayout;

import java.util.ArrayList;
import java.util.List;

/**
 * Gestos de navegación propios del launcher.
 *
 * HyperOS apaga sus gestos de pantalla completa cuando el launcher no es el de Xiaomi.
 * Este servicio pone zonas táctiles sobre los bordes (incluida la barra de botones) y
 * convierte los deslizamientos en acciones del sistema:
 *   - Borde izquierdo/derecho hacia adentro  -> Atrás (con flecha que sigue al dedo)
 *   - Desde abajo hacia arriba               -> Inicio
 *   - Hacia arriba y mantener                -> Apps recientes
 *   - De lado sobre la barra inferior        -> App anterior
 *   - Toque sobre la barra (modo cubrir)     -> el botón que está debajo
 */
public class GestureService extends AccessibilityService {

    static final String PREFS = "gestures";
    static GestureService instance;

    private WindowManager wm;
    private final List<View> views = new ArrayList<>();
    private final List<View> edges = new ArrayList<>();
    private final Handler handler = new Handler(Looper.getMainLooper());
    private ArrowView arrow;
    private WindowManager.LayoutParams arrowLp;
    private int imeTop = -1;

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        instance = this;
        wm = (WindowManager) getSystemService(WINDOW_SERVICE);
        try {
            AccessibilityServiceInfo info = getServiceInfo();
            info.flags |= AccessibilityServiceInfo.FLAG_RETRIEVE_INTERACTIVE_WINDOWS;
            info.eventTypes |= AccessibilityEvent.TYPE_WINDOWS_CHANGED;
            setServiceInfo(info);
        } catch (Exception ignored) { }
        build();
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event.getEventType() != AccessibilityEvent.TYPE_WINDOWS_CHANGED
                && event.getEventType() != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return;
        int top = -1;
        try {
            for (AccessibilityWindowInfo w : getWindows()) {
                if (w.getType() == AccessibilityWindowInfo.TYPE_INPUT_METHOD) {
                    Rect r = new Rect();
                    w.getBoundsInScreen(r);
                    top = r.top;
                }
            }
        } catch (Exception ignored) { }
        if (top != imeTop) {
            imeTop = top;
            layoutEdges();
        }
    }

    @Override
    public void onInterrupt() { }

    @Override
    public boolean onUnbind(Intent intent) {
        clear();
        instance = null;
        return super.onUnbind(intent);
    }

    @Override
    public void onDestroy() {
        clear();
        instance = null;
        super.onDestroy();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        build();
    }

    static void reload() {
        GestureService s = instance;
        if (s != null) s.handler.post(s::build);
    }

    static boolean action(int globalAction) {
        GestureService s = instance;
        return s != null && s.performGlobalAction(globalAction);
    }

    private int dp(float v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }

    private SharedPreferences prefs() {
        return getSharedPreferences(PREFS, MODE_PRIVATE);
    }

    private int navBarHeight() {
        int id = getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        return id > 0 ? getResources().getDimensionPixelSize(id) : dp(48);
    }

    private boolean buttonsVisible() {
        return Settings.Global.getInt(getContentResolver(), "force_fsg_nav_bar", 0) == 0;
    }

    private void clear() {
        if (wm == null) return;
        for (View v : views) {
            try { wm.removeView(v); } catch (Exception ignored) { }
        }
        views.clear();
        edges.clear();
        arrow = null;
    }

    private WindowManager.LayoutParams params(int w, int h, int gravity, boolean touchable) {
        int flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
                | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
                | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
        if (!touchable) flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams(w, h,
                WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY, flags, PixelFormat.TRANSLUCENT);
        lp.gravity = gravity;
        if (Build.VERSION.SDK_INT >= 28) {
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }
        if (Build.VERSION.SDK_INT >= 30) {
            lp.setFitInsetsTypes(0);
            lp.setFitInsetsIgnoringVisibility(true);
        }
        return lp;
    }

    private void add(View v, WindowManager.LayoutParams lp) {
        try {
            wm.addView(v, lp);
            views.add(v);
        } catch (Exception ignored) { }
    }

    private void haptic(View v, int type) {
        v.performHapticFeedback(type, HapticFeedbackConstants.FLAG_IGNORE_VIEW_SETTING);
    }

    private void build() {
        clear();
        if (wm == null) return;
        SharedPreferences p = prefs();
        if (!p.getBoolean("enabled", true)) return;
        float sens = p.getFloat("sens", 1f);

        if (p.getBoolean("back", true)) {
            if (p.getBoolean("arrow", true)) {
                arrow = new ArrowView(this);
                arrowLp = params(dp(64), dp(64), Gravity.TOP | Gravity.START, false);
                arrow.setVisibility(View.INVISIBLE);
                add(arrow, arrowLp);
            }
            String side = p.getString("side", "both");
            int w = dp(14 * sens);
            if (!"right".equals(side)) addEdge(w, true);
            if (!"left".equals(side)) addEdge(w, false);
            layoutEdges();
        }
        if (p.getBoolean("home", true)) addBottom(p, sens);
    }

    /** Coloca las zonas laterales evitando el teclado y la parte de abajo. */
    private void layoutEdges() {
        if (wm == null || edges.isEmpty()) return;
        DisplayMetrics dm = getResources().getDisplayMetrics();
        int screenH = dm.heightPixels + navBarHeight();
        int top = Math.round(screenH * 0.14f);
        int bottomLimit = imeTop > 0 ? imeTop - dp(8) : screenH - navBarHeight() - dp(70);
        int h = Math.max(dp(120), bottomLimit - top);
        for (View e : edges) {
            WindowManager.LayoutParams lp = (WindowManager.LayoutParams) e.getLayoutParams();
            if (lp == null) continue;
            lp.y = top;
            lp.height = h;
            try { wm.updateViewLayout(e, lp); } catch (Exception ignored) { }
        }
    }

    private void showArrow(boolean left, float y, float progress) {
        if (arrow == null) return;
        DisplayMetrics dm = getResources().getDisplayMetrics();
        int size = dp(64);
        arrow.left = left;
        arrow.progress = progress;
        arrowLp.x = left ? Math.round(-size * 0.5f + size * 0.55f * Math.min(1f, progress)) : 0;
        if (!left) arrowLp.x = Math.round(dm.widthPixels - size * 0.5f - size * 0.55f * Math.min(1f, progress));
        arrowLp.y = Math.round(y - size / 2f);
        arrow.setVisibility(View.VISIBLE);
        arrow.invalidate();
        try { wm.updateViewLayout(arrow, arrowLp); } catch (Exception ignored) { }
    }

    private void hideArrow() {
        if (arrow != null) arrow.setVisibility(View.INVISIBLE);
    }

    private void addEdge(int w, boolean left) {
        View v = new View(this);
        v.setOnTouchListener(new View.OnTouchListener() {
            float sx, sy;
            boolean armed;

            @Override
            public boolean onTouch(View view, MotionEvent e) {
                switch (e.getActionMasked()) {
                    case MotionEvent.ACTION_DOWN:
                        sx = e.getRawX();
                        sy = e.getRawY();
                        armed = false;
                        return true;
                    case MotionEvent.ACTION_MOVE: {
                        float dx = (e.getRawX() - sx) * (left ? 1 : -1);
                        float prog = Math.max(0f, dx / dp(56));
                        if (dx > dp(6)) showArrow(left, e.getRawY(), prog);
                        boolean now = dx > dp(56);
                        if (now != armed) {
                            armed = now;
                            if (armed) haptic(view, HapticFeedbackConstants.VIRTUAL_KEY);
                        }
                        return true;
                    }
                    case MotionEvent.ACTION_UP:
                        hideArrow();
                        if (armed && Math.abs(e.getRawY() - sy) < dp(160)) performGlobalAction(GLOBAL_ACTION_BACK);
                        armed = false;
                        return true;
                    default:
                        hideArrow();
                        armed = false;
                        return true;
                }
            }
        });
        WindowManager.LayoutParams lp = params(w, dp(300), (left ? Gravity.START : Gravity.END) | Gravity.TOP, true);
        add(v, lp);
        edges.add(v);
    }

    private void addBottom(SharedPreferences p, float sens) {
        boolean buttons = buttonsVisible();
        String mode = p.getString("mode", "cover");           // cover | transparent | above
        boolean overBar = buttons && !"above".equals(mode);
        boolean opaque = overBar && "cover".equals(mode);
        boolean white = "white".equals(p.getString("bar", "black"));
        boolean showPill = p.getBoolean("pill", true);
        boolean quick = p.getBoolean("quick", true);
        final String order = p.getString("order", "rhb");      // r=recientes h=inicio b=atrás (izq -> der)
        final int navH = navBarHeight();

        int height = overBar ? navH : dp(20 * sens);
        FrameLayout root = new FrameLayout(this);
        if (opaque) root.setBackgroundColor(white ? 0xFFF4F4F4 : 0xFF000000);

        View pill = null;
        if (showPill) {
            pill = new View(this);
            GradientDrawable g = new GradientDrawable();
            g.setColor(opaque ? (white ? 0xFF1A1A1A : 0xFFEDEDED) : 0xC0A0A0A0);
            g.setCornerRadius(dp(3));
            pill.setBackground(g);
            FrameLayout.LayoutParams pl = new FrameLayout.LayoutParams(
                    Math.round(getResources().getDisplayMetrics().widthPixels * 0.34f), dp(5),
                    Gravity.CENTER_HORIZONTAL | (overBar ? Gravity.CENTER_VERTICAL : Gravity.BOTTOM));
            if (!overBar) pl.bottomMargin = dp(7);
            root.addView(pill, pl);
        }
        final View pillView = pill;
        final int screenH = getResources().getDisplayMetrics().heightPixels;
        final int screenW = getResources().getDisplayMetrics().widthPixels;

        root.setOnTouchListener(new View.OnTouchListener() {
            float sx, sy, lx, ly;
            long t0;
            boolean armed, holdRecents, moved;
            final Runnable hold = () -> {
                if (armed) {
                    holdRecents = true;
                    haptic(root, HapticFeedbackConstants.LONG_PRESS);
                }
            };

            private void pillTo(float ty, float sc) {
                if (pillView != null) pillView.animate().translationY(ty).scaleX(sc).setDuration(110).start();
            }

            @Override
            public boolean onTouch(View view, MotionEvent e) {
                switch (e.getActionMasked()) {
                    case MotionEvent.ACTION_DOWN:
                        sx = lx = e.getRawX();
                        sy = ly = e.getRawY();
                        t0 = System.currentTimeMillis();
                        armed = holdRecents = moved = false;
                        pillTo(0, 1.12f);
                        return true;
                    case MotionEvent.ACTION_MOVE: {
                        float up = sy - e.getRawY();
                        if (Math.hypot(e.getRawX() - sx, e.getRawY() - sy) > dp(10)) moved = true;
                        if (pillView != null) pillView.setTranslationY(-Math.min(dp(14), Math.max(0, up) * 0.25f));
                        if (!armed && up > dp(34)) {
                            armed = true;
                            haptic(view, HapticFeedbackConstants.VIRTUAL_KEY);
                        }
                        if (Math.hypot(e.getRawX() - lx, e.getRawY() - ly) > dp(6)) {
                            lx = e.getRawX();
                            ly = e.getRawY();
                            handler.removeCallbacks(hold);
                            if (armed && !holdRecents) handler.postDelayed(hold, 260);
                        }
                        return true;
                    }
                    case MotionEvent.ACTION_UP: {
                        handler.removeCallbacks(hold);
                        pillTo(0, 1f);
                        float dx = e.getRawX() - sx, up = sy - e.getRawY();
                        if (!moved && overBar && System.currentTimeMillis() - t0 < 500) {
                            // toque normal sobre la barra: el botón que está debajo
                            int third = Math.min(2, (int) (e.getRawX() / (screenW / 3f)));
                            char c = order.length() == 3 ? order.charAt(third) : 'h';
                            haptic(view, HapticFeedbackConstants.VIRTUAL_KEY);
                            performGlobalAction(c == 'b' ? GLOBAL_ACTION_BACK : c == 'r' ? GLOBAL_ACTION_RECENTS : GLOBAL_ACTION_HOME);
                        } else if (quick && Math.abs(dx) > dp(90) && Math.abs(dx) > up * 1.5f) {
                            haptic(view, HapticFeedbackConstants.VIRTUAL_KEY);
                            performGlobalAction(GLOBAL_ACTION_RECENTS);
                            handler.postDelayed(() -> performGlobalAction(GLOBAL_ACTION_RECENTS), 320);
                        } else if (holdRecents || up > screenH * 0.36f) {
                            performGlobalAction(GLOBAL_ACTION_RECENTS);
                        } else if (armed) {
                            performGlobalAction(GLOBAL_ACTION_HOME);
                        }
                        armed = holdRecents = false;
                        return true;
                    }
                    default:
                        handler.removeCallbacks(hold);
                        pillTo(0, 1f);
                        armed = holdRecents = false;
                        return true;
                }
            }
        });
        WindowManager.LayoutParams lp = params(WindowManager.LayoutParams.MATCH_PARENT, height, Gravity.BOTTOM, true);
        add(root, lp);
    }

    /** Burbuja con flecha que aparece al deslizar desde un borde. */
    static class ArrowView extends View {
        boolean left = true;
        float progress = 0f;
        private final Paint bg = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint fg = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Path path = new Path();

        ArrowView(Context c) {
            super(c);
            bg.setColor(0xE6202020);
            fg.setColor(0xFFFFFFFF);
            fg.setStyle(Paint.Style.STROKE);
            fg.setStrokeCap(Paint.Cap.ROUND);
            fg.setStrokeJoin(Paint.Join.ROUND);
        }

        @Override
        protected void onDraw(Canvas c) {
            float p = Math.min(1f, progress);
            float w = getWidth(), h = getHeight(), cx = w / 2f, cy = h / 2f;
            float r = (w / 2f) * (0.55f + 0.35f * p);
            bg.setAlpha(Math.round(90 + 140 * p));
            c.drawCircle(cx, cy, r, bg);
            fg.setStrokeWidth(w * 0.07f);
            fg.setAlpha(Math.round(120 + 135 * p));
            float a = r * 0.38f;
            path.reset();
            if (left) {
                path.moveTo(cx + a * 0.45f, cy - a);
                path.lineTo(cx - a * 0.55f, cy);
                path.lineTo(cx + a * 0.45f, cy + a);
            } else {
                path.moveTo(cx - a * 0.45f, cy - a);
                path.lineTo(cx + a * 0.55f, cy);
                path.lineTo(cx - a * 0.45f, cy + a);
            }
            c.drawPath(path, fg);
        }
    }
}
