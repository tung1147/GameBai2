package vn.quyetnguyen.plugin.system;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.telephony.SmsMessage;
import android.util.Log;
import android.widget.Toast;

public class SMSReceiver extends BroadcastReceiver{
	private static final String SMS_BUNDLE = "pdus";
	private static final String TAG = "SMSReceiver";
	private static final int SMS_PERMISSION_REQUEST_CODE = 120;
	
	@Override
	public void onReceive(Context context, Intent intent) {
		// TODO Auto-generated method stub
		Log.d(TAG, "onReceive: "+intent.toString());
		
		Bundle intentExtras = intent.getExtras();
        if (intentExtras != null) {
        	Object[] sms = (Object[]) intentExtras.get(SMS_BUNDLE);	 
             for (int i = 0; i < sms.length; ++i) {
            	 SmsMessage smsMessage = null;
            	 if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            		 String format = intentExtras.getString("format");
                	 smsMessage = SmsMessage.createFromPdu((byte[]) sms[i], format);
                 }
                 else {
                	 smsMessage = SmsMessage.createFromPdu((byte[]) sms[i]);
                 }            
                 
            	 recvSmsHandler(context, smsMessage);             
             }	
        }
	}
	
	private void recvSmsHandler(Context context, SmsMessage smsMessage){
		String smsMessageStr = "";
		
		String smsBody = smsMessage.getMessageBody().toString();
        String address = smsMessage.getOriginatingAddress();
        
        smsMessageStr += "SMS From: " + address + "\n";
        smsMessageStr += smsBody + "\n";
        
        Log.d(TAG, "recv: "+smsMessageStr);
        Toast t = Toast.makeText(context, smsMessageStr, Toast.LENGTH_SHORT);
        t.show();
	}
	
	public static boolean checkPermission(Context context){
		int smsPermission = ContextCompat.checkSelfPermission(context, android.Manifest.permission.RECEIVE_SMS);
		if(smsPermission == PackageManager.PERMISSION_GRANTED){
			return true;
		}
		return false;
	}
	
	public static void requestPermission(Activity activity){
		 ActivityCompat.requestPermissions(activity, 
				 new String[]{android.Manifest.permission.READ_CONTACTS},
				 SMS_PERMISSION_REQUEST_CODE);
	}
}
