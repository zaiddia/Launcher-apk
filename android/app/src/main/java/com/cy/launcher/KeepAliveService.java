package com.cy.launcher;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;

/**
 * Mantiene vivo el proceso del launcher para que HyperOS no lo cierre
 * (así no se recarga al volver a Inicio). Notificación mínima, sin trabajo en segundo plano.
 */
public class KeepAliveService extends Service {
    static volatile boolean running = false;
    private static final String CH = "keepalive";

    static void start(Context c) {
        try {
            Intent i = new Intent(c, KeepAliveService.class);
            if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(i); else c.startService(i);
        } catch (Exception ignored) { }
    }
    static void stop(Context c) { try { c.stopService(new Intent(c, KeepAliveService.class)); } catch (Exception ignored) { } }
    static boolean wanted(Context c) { return c.getSharedPreferences("aura", MODE_PRIVATE).getBoolean("keepalive", false); }
    static void setWanted(Context c, boolean on) { c.getSharedPreferences("aura", MODE_PRIVATE).edit().putBoolean("keepalive", on).apply(); }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 26 && nm.getNotificationChannel(CH) == null) {
            NotificationChannel ch = new NotificationChannel(CH, getString(R.string.app_name) + " · activo", NotificationManager.IMPORTANCE_MIN);
            ch.setShowBadge(false); ch.setSound(null, null); ch.enableVibration(false);
            nm.createNotificationChannel(ch);
        }
        Intent open = new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent pi = PendingIntent.getActivity(this, 0, open, PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(this, CH) : new Notification.Builder(this);
        b.setSmallIcon(R.mipmap.ic_launcher).setContentTitle(getString(R.string.app_name))
         .setContentText("Activo para abrir al instante").setOngoing(true).setContentIntent(pi).setShowWhen(false);
        if (Build.VERSION.SDK_INT < 26) b.setPriority(Notification.PRIORITY_MIN);
        try {
            if (Build.VERSION.SDK_INT >= 34) startForeground(7, b.build(), ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
            else startForeground(7, b.build());
            running = true;
        } catch (Exception e) { stopSelf(); }
        return START_STICKY;
    }

    @Override public void onDestroy() { running = false; super.onDestroy(); }
    @Override public IBinder onBind(Intent intent) { return null; }
}
