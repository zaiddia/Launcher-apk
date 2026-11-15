package com.cy.launcher;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Al encender (o actualizar la app) vuelve a activar el servicio persistente si el usuario lo pidió. */
public class BootReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context c, Intent i) {
        if (KeepAliveService.wanted(c)) KeepAliveService.start(c);
    }
}
