package com.cy.launcher;

import android.Manifest;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ContentUris;
import android.database.Cursor;
import android.media.AudioManager;
import android.media.MediaMetadata;
import android.media.session.MediaController;
import android.media.session.MediaSessionManager;
import android.media.session.PlaybackState;
import android.os.SystemClock;
import android.provider.AlarmClock;
import android.provider.CalendarContract;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.StatFs;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.Window;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileReader;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/assets/index.html";
    private static final int REQ_FILE = 11;
    private static final int REQ_LOC = 12;
    private static final int REQ_CAL = 13;
    private String artKey = "";
    private String artData = "";

    private WebView web;
    private ValueCallback<Uri[]> fileCallback;
    private GeolocationPermissions.Callback geoCallback;
    private String geoOrigin;
    private final Map<String, String> iconCache = new HashMap<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        w.setStatusBarColor(0xFF0F0F10);
        w.setNavigationBarColor(0xFF0F0F10);

        web = new WebView(this);
        web.setBackgroundColor(0xFF0F0F10);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setGeolocationEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        s.setTextZoom(100);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (HOST.equals(u.getHost())) return false;
                openExternal(u.toString());
                return true;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent i = params.createIntent();
                if (params.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) {
                    i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                }
                try {
                    startActivityForResult(i, REQ_FILE);
                } catch (ActivityNotFoundException e) {
                    fileCallback = null;
                    return false;
                }
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                if (hasLocation()) {
                    callback.invoke(origin, true, false);
                } else {
                    geoCallback = callback;
                    geoOrigin = origin;
                    requestPermissions(new String[]{
                            Manifest.permission.ACCESS_COARSE_LOCATION,
                            Manifest.permission.ACCESS_FINE_LOCATION}, REQ_LOC);
                }
            }
        });

        web.addJavascriptInterface(new Bridge(), "Android");
        web.loadUrl(START_URL);
    }

    private boolean hasLocation() {
        return checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode == REQ_CAL) {
            js("window.onCalendarPermission&&window.onCalendarPermission()");
        }
        if (requestCode == REQ_LOC && geoCallback != null) {
            geoCallback.invoke(geoOrigin, hasLocation(), false);
            geoCallback = null;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_FILE || fileCallback == null) return;
        Uri[] out = null;
        if (resultCode == RESULT_OK && data != null) {
            ClipData clip = data.getClipData();
            if (clip != null && clip.getItemCount() > 0) {
                out = new Uri[clip.getItemCount()];
                for (int i = 0; i < out.length; i++) out[i] = clip.getItemAt(i).getUri();
            } else if (data.getData() != null) {
                out = new Uri[]{data.getData()};
            }
        }
        fileCallback.onReceiveValue(out);
        fileCallback = null;
    }

    @Override
    public void onBackPressed() {
        // Un launcher no se cierra con "atrás": cerramos paneles o volvemos a Inicio.
        js("window.onAndroidBack&&window.onAndroidBack()");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (Intent.ACTION_MAIN.equals(intent.getAction())) {
            js("window.onAndroidHome&&window.onAndroidHome()");
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        js("window.onAndroidResume&&window.onAndroidResume()");
    }

    private void js(String code) {
        if (web != null) web.evaluateJavascript(code, null);
    }

    private void openExternal(String url) {
        try {
            Intent i;
            if (url.startsWith("intent:")) {
                i = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                i.addCategory(Intent.CATEGORY_BROWSABLE);
                i.setComponent(null);
                i.setSelector(null);
            } else {
                i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            }
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try {
                startActivity(i);
            } catch (ActivityNotFoundException e) {
                String fb = i.getStringExtra("browser_fallback_url");
                if (fb != null) {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(fb)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
                }
            }
        } catch (Exception ignored) {
        }
    }

    private static String sysProp(String key) {
        try {
            Class<?> c = Class.forName("android.os.SystemProperties");
            Method m = c.getMethod("get", String.class);
            Object v = m.invoke(null, key);
            return v == null ? "" : v.toString().trim();
        } catch (Exception e) {
            return "";
        }
    }

    private MediaController activeController() {
        try {
            MediaSessionManager m = (MediaSessionManager) getSystemService(Context.MEDIA_SESSION_SERVICE);
            List<MediaController> list = m.getActiveSessions(new ComponentName(this, MediaListener.class));
            if (list == null || list.isEmpty()) return null;
            for (MediaController c : list) {
                PlaybackState st = c.getPlaybackState();
                if (st != null && st.getState() == PlaybackState.STATE_PLAYING) return c;
            }
            return list.get(0);
        } catch (Exception e) {
            return null; // sin acceso a notificaciones
        }
    }

    private String bitmapToDataUrl(Bitmap src, int max) {
        int w = src.getWidth(), h = src.getHeight();
        float k = Math.min(1f, (float) max / Math.max(w, h));
        Bitmap b = k < 1f ? Bitmap.createScaledBitmap(src, Math.round(w * k), Math.round(h * k), true) : src;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        b.compress(Bitmap.CompressFormat.JPEG, 85, out);
        return "data:image/jpeg;base64," + Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP);
    }

    private String drawableToDataUrl(Drawable d) {
        int size = 112;
        Bitmap bmp = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(bmp);
        d.setBounds(0, 0, size, size);
        d.draw(c);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, out);
        bmp.recycle();
        return "data:image/png;base64," + Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP);
    }

    /** Funciones que la interfaz web puede llamar como window.Android.xxx() */
    private class Bridge {

        @JavascriptInterface
        public String getApps() {
            JSONArray arr = new JSONArray();
            try {
                PackageManager pm = getPackageManager();
                Intent main = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER);
                List<ResolveInfo> list = pm.queryIntentActivities(main, 0);
                List<String[]> items = new ArrayList<>();
                for (ResolveInfo r : list) {
                    String pkg = r.activityInfo.packageName;
                    if (pkg.equals(getPackageName())) continue;
                    String label = String.valueOf(r.loadLabel(pm));
                    boolean dup = false;
                    for (String[] it : items) if (it[1].equals(pkg)) { dup = true; break; }
                    if (!dup) items.add(new String[]{label, pkg});
                }
                Collections.sort(items, (a, b) -> a[0].compareToIgnoreCase(b[0]));
                for (String[] it : items) {
                    JSONObject o = new JSONObject();
                    o.put("l", it[0]);
                    o.put("p", it[1]);
                    arr.put(o);
                }
            } catch (Exception ignored) {
            }
            return arr.toString();
        }

        @JavascriptInterface
        public String appIcon(String pkg) {
            synchronized (iconCache) {
                if (iconCache.containsKey(pkg)) return iconCache.get(pkg);
            }
            String url = "";
            try {
                url = drawableToDataUrl(getPackageManager().getApplicationIcon(pkg));
            } catch (Exception ignored) {
            }
            synchronized (iconCache) {
                iconCache.put(pkg, url);
            }
            return url;
        }

        @JavascriptInterface
        public boolean launch(String pkg) {
            try {
                Intent i = getPackageManager().getLaunchIntentForPackage(pkg);
                if (i == null) return false;
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
                runOnUiThread(() -> {
                    try { startActivity(i); } catch (Exception ignored) { }
                });
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public void openUrl(String url) {
            runOnUiThread(() -> openExternal(url));
        }

        @JavascriptInterface
        public void openCamera() {
            runOnUiThread(() -> {
                try {
                    startActivity(new Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
                } catch (Exception e) {
                    try {
                        startActivity(new Intent(MediaStore.ACTION_IMAGE_CAPTURE).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
                    } catch (Exception ignored) { }
                }
            });
        }

        @JavascriptInterface
        public void openSettings() {
            runOnUiThread(() -> {
                try { startActivity(new Intent(Settings.ACTION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); } catch (Exception ignored) { }
            });
        }

        @JavascriptInterface
        public void openAppInfo(String pkg) {
            runOnUiThread(() -> {
                try {
                    startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + pkg))
                            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
                } catch (Exception ignored) { }
            });
        }

        @JavascriptInterface
        public void setDefaultLauncher() {
            runOnUiThread(() -> {
                try {
                    startActivity(new Intent(Settings.ACTION_HOME_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
                } catch (Exception e) {
                    try { startActivity(new Intent(Settings.ACTION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); } catch (Exception ignored) { }
                }
            });
        }

        @JavascriptInterface
        public boolean isDefaultLauncher() {
            try {
                Intent home = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME);
                ResolveInfo r = getPackageManager().resolveActivity(home, PackageManager.MATCH_DEFAULT_ONLY);
                return r != null && r.activityInfo != null && getPackageName().equals(r.activityInfo.packageName);
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public void setNavColor(String hex) {
            runOnUiThread(() -> {
                try {
                    int c = Color.parseColor(hex);
                    Window w = getWindow();
                    w.setNavigationBarColor(c);
                    double lum = (0.2126 * Color.red(c) + 0.7152 * Color.green(c) + 0.0722 * Color.blue(c)) / 255.0;
                    View d = w.getDecorView();
                    int flags = d.getSystemUiVisibility();
                    if (lum > 0.45) flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                    else flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                    d.setSystemUiVisibility(flags);
                } catch (Exception ignored) { }
            });
        }

        @JavascriptInterface
        public String deviceInfo() {
            JSONObject o = new JSONObject();
            try {
                String market = sysProp("ro.product.marketname");
                if (market.isEmpty()) market = sysProp("ro.product.vendor.marketname");
                String model = market.isEmpty() ? (Build.MANUFACTURER + " " + Build.MODEL) : market;
                o.put("model", model);
                o.put("code", Build.MODEL);
                o.put("android", Build.VERSION.RELEASE);
                o.put("sdk", Build.VERSION.SDK_INT);
                String os = sysProp("ro.mi.os.version.name");
                if (!os.isEmpty()) {
                    os = os.startsWith("OS") ? "HyperOS " + os.substring(2) : "HyperOS " + os;
                } else {
                    String miui = sysProp("ro.miui.ui.version.name");
                    if (!miui.isEmpty()) os = "MIUI " + miui.replace("V", "");
                }
                o.put("os", os);
                String soc = "";
                if (Build.VERSION.SDK_INT >= 31) soc = Build.SOC_MODEL;
                if (soc == null || soc.isEmpty() || "unknown".equalsIgnoreCase(soc)) soc = Build.HARDWARE;
                o.put("soc", soc);
                o.put("cores", Runtime.getRuntime().availableProcessors());

                ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
                ActivityManager.MemoryInfo mi = new ActivityManager.MemoryInfo();
                am.getMemoryInfo(mi);
                o.put("ramTotal", mi.totalMem);
                o.put("ramAvail", mi.availMem);

                StatFs st = new StatFs(Environment.getDataDirectory().getPath());
                o.put("stoTotal", st.getTotalBytes());
                o.put("stoFree", st.getAvailableBytes());

                DisplayMetrics dm = new DisplayMetrics();
                getWindowManager().getDefaultDisplay().getRealMetrics(dm);
                o.put("w", Math.min(dm.widthPixels, dm.heightPixels));
                o.put("h", Math.max(dm.widthPixels, dm.heightPixels));
            } catch (Exception ignored) {
            }
            return o.toString();
        }

        @JavascriptInterface
        public void setBars(String status, String nav) {
            runOnUiThread(() -> {
                try {
                    Window w = getWindow();
                    int s = Color.parseColor(status), n = Color.parseColor(nav);
                    w.setStatusBarColor(s);
                    w.setNavigationBarColor(n);
                    View d = w.getDecorView();
                    int f = d.getSystemUiVisibility();
                    double ls = (0.2126 * Color.red(s) + 0.7152 * Color.green(s) + 0.0722 * Color.blue(s)) / 255.0;
                    double ln = (0.2126 * Color.red(n) + 0.7152 * Color.green(n) + 0.0722 * Color.blue(n)) / 255.0;
                    f = ls > 0.6 ? (f | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR) : (f & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
                    f = ln > 0.45 ? (f | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR) : (f & ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
                    d.setSystemUiVisibility(f);
                } catch (Exception ignored) { }
            });
        }

        @JavascriptInterface
        public void openClock() {
            runOnUiThread(() -> {
                try { startActivity(new Intent(AlarmClock.ACTION_SHOW_ALARMS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); } catch (Exception ignored) { }
            });
        }

        @JavascriptInterface
        public int cpuFreq() {
            int max = -1;
            int n = Runtime.getRuntime().availableProcessors();
            for (int i = 0; i < n; i++) {
                try (BufferedReader r = new BufferedReader(new FileReader("/sys/devices/system/cpu/cpu" + i + "/cpufreq/scaling_cur_freq"))) {
                    int khz = Integer.parseInt(r.readLine().trim());
                    max = Math.max(max, khz / 1000);
                } catch (Exception ignored) { }
            }
            return max; // MHz, -1 si el sistema no lo permite
        }

        /* ---------- Música del sistema (Spotify, YouTube Music, etc.) ---------- */
        @JavascriptInterface
        public boolean hasMediaAccess() {
            String f = Settings.Secure.getString(getContentResolver(), "enabled_notification_listeners");
            return f != null && f.contains(getPackageName());
        }

        @JavascriptInterface
        public void requestMediaAccess() {
            runOnUiThread(() -> {
                try { startActivity(new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); } catch (Exception ignored) { }
            });
        }

        @JavascriptInterface
        public String nowPlaying() {
            JSONObject o = new JSONObject();
            try {
                MediaController c = activeController();
                if (c == null) return "{}";
                MediaMetadata md = c.getMetadata();
                if (md == null) return "{}";
                String title = md.getString(MediaMetadata.METADATA_KEY_TITLE);
                String artist = md.getString(MediaMetadata.METADATA_KEY_ARTIST);
                if (artist == null) artist = md.getString(MediaMetadata.METADATA_KEY_ALBUM_ARTIST);
                String album = md.getString(MediaMetadata.METADATA_KEY_ALBUM);
                PlaybackState st = c.getPlaybackState();
                boolean playing = st != null && st.getState() == PlaybackState.STATE_PLAYING;
                long pos = 0;
                if (st != null) {
                    pos = st.getPosition();
                    if (playing && st.getLastPositionUpdateTime() > 0) {
                        pos += (long) ((SystemClock.elapsedRealtime() - st.getLastPositionUpdateTime()) * st.getPlaybackSpeed());
                    }
                }
                o.put("title", title == null ? "" : title);
                o.put("artist", artist == null ? "" : artist);
                o.put("album", album == null ? "" : album);
                o.put("pkg", c.getPackageName());
                o.put("playing", playing);
                o.put("pos", pos);
                o.put("dur", md.getLong(MediaMetadata.METADATA_KEY_DURATION));
                Bitmap art = md.getBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART);
                if (art == null) art = md.getBitmap(MediaMetadata.METADATA_KEY_ART);
                if (art == null) art = md.getBitmap(MediaMetadata.METADATA_KEY_DISPLAY_ICON);
                String key = art == null ? "" : (title + "|" + artist + "|" + art.getWidth() + "x" + art.getHeight());
                if (!key.equals(artKey)) {
                    artKey = key;
                    artData = art == null ? "" : bitmapToDataUrl(art, 512);
                }
                o.put("artKey", artKey);
            } catch (Exception e) {
                return "{}";
            }
            return o.toString();
        }

        @JavascriptInterface
        public String nowPlayingArt() {
            return artData;
        }

        @JavascriptInterface
        public void mediaCmd(String cmd, double arg) {
            runOnUiThread(() -> {
                MediaController c = activeController();
                if (c == null) return;
                MediaController.TransportControls t = c.getTransportControls();
                PlaybackState st = c.getPlaybackState();
                boolean playing = st != null && st.getState() == PlaybackState.STATE_PLAYING;
                switch (cmd) {
                    case "toggle": if (playing) t.pause(); else t.play(); break;
                    case "play": t.play(); break;
                    case "pause": t.pause(); break;
                    case "next": t.skipToNext(); break;
                    case "prev": t.skipToPrevious(); break;
                    case "seek": t.seekTo((long) arg); break;
                    default: break;
                }
            });
        }

        @JavascriptInterface
        public void volume(int dir) {
            runOnUiThread(() -> {
                AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
                am.adjustStreamVolume(AudioManager.STREAM_MUSIC, dir > 0 ? AudioManager.ADJUST_RAISE : AudioManager.ADJUST_LOWER, AudioManager.FLAG_SHOW_UI);
            });
        }

        /* ---------- Calendario del celular ---------- */
        @JavascriptInterface
        public boolean hasCalendar() {
            return checkSelfPermission(Manifest.permission.READ_CALENDAR) == PackageManager.PERMISSION_GRANTED;
        }

        @JavascriptInterface
        public void requestCalendar() {
            runOnUiThread(() -> requestPermissions(new String[]{Manifest.permission.READ_CALENDAR}, REQ_CAL));
        }

        @JavascriptInterface
        public String calendarEvents(int days) {
            JSONArray arr = new JSONArray();
            if (!hasCalendar()) return arr.toString();
            long now = System.currentTimeMillis() - 86400000L;
            Uri.Builder b = CalendarContract.Instances.CONTENT_URI.buildUpon();
            ContentUris.appendId(b, now);
            ContentUris.appendId(b, now + days * 86400000L);
            String[] cols = {CalendarContract.Instances.EVENT_ID, CalendarContract.Instances.TITLE,
                    CalendarContract.Instances.BEGIN, CalendarContract.Instances.END, CalendarContract.Instances.ALL_DAY};
            try (Cursor c = getContentResolver().query(b.build(), cols, null, null, CalendarContract.Instances.BEGIN + " ASC")) {
                int n = 0;
                while (c != null && c.moveToNext() && n++ < 60) {
                    JSONObject o = new JSONObject();
                    o.put("id", c.getLong(0));
                    o.put("t", c.getString(1));
                    o.put("b", c.getLong(2));
                    o.put("e", c.getLong(3));
                    o.put("a", c.getInt(4) == 1);
                    arr.put(o);
                }
            } catch (Exception ignored) { }
            return arr.toString();
        }

        @JavascriptInterface
        public String battery() {
            JSONObject o = new JSONObject();
            try {
                Intent b = registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
                int level = b != null ? b.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) : -1;
                int scale = b != null ? b.getIntExtra(BatteryManager.EXTRA_SCALE, 100) : 100;
                int status = b != null ? b.getIntExtra(BatteryManager.EXTRA_STATUS, -1) : -1;
                o.put("level", level >= 0 ? Math.round(level * 100f / scale) : 0);
                o.put("charging", status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL);
                int temp = b != null ? b.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1) : -1;
                if (temp > 0) o.put("temp", temp / 10.0);
                if (Build.VERSION.SDK_INT >= 28) {
                    BatteryManager bm = (BatteryManager) getSystemService(Context.BATTERY_SERVICE);
                    o.put("chargeLeft", bm.computeChargeTimeRemaining());
                }
            } catch (Exception ignored) {
            }
            return o.toString();
        }
    }
}
