/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package vn.quyetnd.plugin.gcm;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;
import vn.quyetnguyen.plugin.system.SystemPlugin;

public class RegistrationIntentService extends IntentService {
    private static final String TAG = "RegIntentService";
    
    public RegistrationIntentService() {
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        try {
        	String senderId = GcmPlugin.getInstance().getSenderId();
            InstanceID instanceID = InstanceID.getInstance(this);
            String token = instanceID.getToken(senderId, GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
            
            sendToken(token);
           
                       
            Log.i(TAG, "GCM Registration Token: " + token);
        } catch (Exception e) {
            Log.d(TAG, "Failed to complete token refresh", e);
        }
    }
    
    private void sendToken(final String token){
		String android_id = GcmPlugin.getInstance().getAndroidId();    	
		SystemPlugin.getInstance().onRegisterNotificationSuccess(android_id, token);
		
    }    
}
