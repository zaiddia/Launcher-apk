package com.cy.launcher;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.PixelFormat;
import android.graphics.drawable.GradientDrawable;
import android.os.Handler;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.HapticFeedbackConstants;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;
import android.widget.FrameLayout;

import java.util.ArrayList;
import java.util.List;

/**
 * Gestos de navegación propios del launcher.
 *
 * HyperOS desactiva sus gestos de pantalla completa cuando el launcher no es el de Xiaomi,
 * así que este servicio dibuja zonas invisibles en los bordes de la pantalla (sobre cualquier app)
 * y convierte los deslizamientos en las acciones del sistema:
 *   - Deslizar desde el borde izquierdo/derecho  -> Atrás
 *   - Deslizar hacia arriba desde abajo           -> Inicio
 *   - Deslizar hacia arriba y mantener            -> Apps recientes
 *   - Deslizar de lado sobre la barra de abajo    -> App anterior
 */
public class GestureService extends AccessibilityService {

    static final String PREFS = "gestures";
    static GestureService instance;

    private WindowManager wm;
    private final List<View> views = new ArrayList<>();
    private final Handler handler = new Handler(Looper.getMainLooper());

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        instance = this;
        wm = (WindowManager) getSystemService(WINDOW_SERVICE);
        build();
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) { }

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

    /** Llamado desde la app cuando cambian los ajustes. */
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

    private void clear() {
        if (wm == null) return;
        for (View v : views) {
            try { wm.removeView(v); } catch (Exception ignored) { }
        }
        views.clear();
    }

    private WindowManager.LayoutParams params(int w, int h, int gravity) {
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams(
                w, h,
                WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                        | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
                        | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                PixelFormat.TRANSLUCENT);
        lp.gravity = gravity;
        return lp;
    }

    private void build() {
        clear();
        if (wm == null) return;
        SharedPreferences p = getSharedPreferences(PREFS, MODE_PRIVATE);
        if (!p.getBoolean("enabled", true)) return;
        float sens = p.getFloat("sens", 1f);
        DisplayMetrics dm = getResources().getDisplayMetrics();

        if (p.getBoolean("back", true)) {
            String side = p.getString("side", "both");
            int h = Math.round(dm.heightPixels * 0.72f);
            int w = dp(16 * sens);
            if (!"right".equals(side)) addEdge(w, h, true);
            if (!"left".equals(side)) addEdge(w, h, false);
        }
        if (p.getBoolean("home", true)) {
            addBottom(dp(18 * sens), p.getBoolean("pill", true), p.getBoolean("quick", true));
        }
    }

    private void addEdge(int w, int h, boolean left) {
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
                        boolean now = dx > dp(44);
                        if (now != armed) {
                            armed = now;
                            if (armed) view.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);
                        }
                        return true;
                    }
                    case MotionEvent.ACTION_UP:
                        if (armed && Math.abs(e.getRawY() - sy) < dp(140)) {
                            performGlobalAction(GLOBAL_ACTION_BACK);
                        }
                        armed = false;
                        return true;
                    default:
                        armed = false;
                        return true;
                }
            }
        });
        WindowManager.LayoutParams lp = params(w, h, (left ? Gravity.START : Gravity.END) | Gravity.CENTER_VERTICAL);
        try {
            wm.addView(v, lp);
            views.add(v);
        } catch (Exception ignored) { }
    }

    private void addBottom(int h, boolean showPill, boolean quickSwitch) {
        FrameLayout root = new FrameLayout(this);
        View pill = null;
        if (showPill) {
            pill = new View(this);
            GradientDrawable g = new GradientDrawable();
            g.setColor(0xB0909090);
            g.setCornerRadius(dp(3));
            pill.setBackground(g);
            FrameLayout.LayoutParams pl = new FrameLayout.LayoutParams(
                    Math.round(getResources().getDisplayMetrics().widthPixels * 0.34f), dp(4.5f),
                    Gravity.CENTER_HORIZONTAL | Gravity.BOTTOM);
            pl.bottomMargin = dp(6);
            root.addView(pill, pl);
        }
        final View pillView = pill;
        final int screenH = getResources().getDisplayMetrics().heightPixels;

        root.setOnTouchListener(new View.OnTouchListener() {
            float sx, sy, lx, ly;
            boolean armed, holdRecents;
            final Runnable hold = () -> {
                if (armed) {
                    holdRecents = true;
                    root.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
                }
            };

            @Override
            public boolean onTouch(View view, MotionEvent e) {
                switch (e.getActionMasked()) {
                    case MotionEvent.ACTION_DOWN:
                        sx = lx = e.getRawX();
                        sy = ly = e.getRawY();
                        armed = holdRecents = false;
                        if (pillView != null) pillView.animate().scaleX(1.15f).setDuration(120).start();
                        return true;
                    case MotionEvent.ACTION_MOVE: {
                        float up = sy - e.getRawY();
                        if (!armed && up > dp(36)) {
                            armed = true;
                            view.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);
                        }
                        // si el dedo se queda quieto un momento después de subir -> recientes
                        if (Math.hypot(e.getRawX() - lx, e.getRawY() - ly) > dp(6)) {
                            lx = e.getRawX();
                            ly = e.getRawY();
                            handler.removeCallbacks(hold);
                            if (armed && !holdRecents) handler.postDelayed(hold, 280);
                        }
                        return true;
                    }
                    case MotionEvent.ACTION_UP: {
                        handler.removeCallbacks(hold);
                        if (pillView != null) pillView.animate().scaleX(1f).setDuration(150).start();
                        float dx = e.getRawX() - sx, up = sy - e.getRawY();
                        if (quickSwitch && Math.abs(dx) > dp(90) && Math.abs(dx) > up * 1.5f) {
                            // app anterior: abrir recientes dos veces seguidas
                            performGlobalAction(GLOBAL_ACTION_RECENTS);
                            handler.postDelayed(() -> performGlobalAction(GLOBAL_ACTION_RECENTS), 300);
                        } else if (holdRecents || up > screenH * 0.38f) {
                            performGlobalAction(GLOBAL_ACTION_RECENTS);
                        } else if (armed) {
                            performGlobalAction(GLOBAL_ACTION_HOME);
                        }
                        armed = holdRecents = false;
                        return true;
                    }
                    default:
                        handler.removeCallbacks(hold);
                        if (pillView != null) pillView.animate().scaleX(1f).setDuration(150).start();
                        armed = holdRecents = false;
                        return true;
                }
            }
        });
        int height = Math.max(h, showPill ? dp(18) : h);
        WindowManager.LayoutParams lp = params(WindowManager.LayoutParams.MATCH_PARENT, height, Gravity.BOTTOM);
        try {
            wm.addView(root, lp);
            views.add(root);
        } catch (Exception ignored) { }
    }
}
