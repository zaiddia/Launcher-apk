package com.cy.launcher;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

/** Acceso a notificaciones: permite leer la música activa y contar las notificaciones. */
public class MediaListener extends NotificationListenerService {
    static volatile MediaListener instance;

    @Override public void onListenerConnected() { instance = this; changed(); }
    @Override public void onListenerDisconnected() { instance = null; }
    @Override public void onNotificationPosted(StatusBarNotification sbn) { changed(); }
    @Override public void onNotificationRemoved(StatusBarNotification sbn) { changed(); }

    private void changed() { MainActivity a = MainActivity.act; if (a != null) a.notifChanged(); }

    /** Notificaciones visibles (descartables, sin las persistentes ni las propias). -1 si no hay acceso. */
    static int count(String self) {
        MediaListener l = instance;
        if (l == null) return -1;
        try {
            StatusBarNotification[] a = l.getActiveNotifications();
            if (a == null) return 0;
            int n = 0;
            for (StatusBarNotification s : a) {
                if (s.isOngoing() || !s.isClearable() || self.equals(s.getPackageName())) continue;
                if ((s.getNotification().flags & android.app.Notification.FLAG_GROUP_SUMMARY) != 0) continue;
                n++;
            }
            return n;
        } catch (Exception e) { return -1; }
    }
}
