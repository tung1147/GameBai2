package vn.quyetnd.plugin.fcm;

import com.google.firebase.messaging.RemoteMessage;

import android.app.Notification;
import android.util.Log;
import vn.quyetnguyen.plugin.system.SystemPlugin;

public class FirebaseMessagingService extends com.google.firebase.messaging.FirebaseMessagingService {
    private static final String TAG = "FirebaseMessaging";
    
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.i(TAG, "From: " + remoteMessage.getFrom());
        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.i(TAG, "Message data payload: " + remoteMessage.getData());
        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
        	Log.i(TAG, "Message Notification Title: " + remoteMessage.getNotification().getTitle());
            Log.i(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }
               
        String title = remoteMessage.getNotification().getTitle();
        String message = remoteMessage.getNotification().getBody();      
        SystemPlugin.getInstance().pushNotification(title, message);
    }
}
