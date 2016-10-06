package vn.quyetnguyen.plugin.system;

import java.util.regex.Pattern;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import com.google.firebase.iid.FirebaseInstanceId;
import com.puppet.gamebai2.R;
//import com.puppet.gamebai.R;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.app.Activity;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Rect;
import android.media.RingtoneManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Vibrator;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.ContextCompat;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;

public class SystemPlugin {
	static SystemPlugin instance = null;
	private static final String TAG = "SystemPlugin";
	private SystemPlugin(){
		
	}
	
	public static SystemPlugin getInstance(){
		if(instance == null){
			instance = new SystemPlugin();
		}
		return instance;
	}
	
	private Activity activity = null;
	private View rootLayout;
	
	public void init(Activity activity){
		this.activity = activity;
		final Window windows = activity.getWindow();
		rootLayout = windows.getDecorView().findViewById(android.R.id.content);	
		this.initViewVisibleListener();
	}
	
	private Rect rootViewRect;
	
	public int getKeyboardHeight(){
		DisplayMetrics metrics = new DisplayMetrics();
		activity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
		
    	Rect r = new Rect();
    	rootLayout.getWindowVisibleDisplayFrame(r);  
    	
    	Log.d(TAG, "getKeyboardHeight: " + metrics.heightPixels + " - " + r.bottom);
    	return (metrics.heightPixels - r.bottom);
	}
	
	private void initViewVisibleListener(){		
		rootViewRect = new Rect();
		rootLayout.getWindowVisibleDisplayFrame(rootViewRect);
		rootLayout.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                // TODO Auto-generated method stub
            	Rect r = new Rect();
            	rootLayout.getWindowVisibleDisplayFrame(r);  
            	onViewVisibleChange(r);
            }
        });
	}
	private void onViewVisibleChange(Rect viewRect){
		if(viewRect.width() > viewRect.height()){
			if(viewRect.top != 0){
				return;
			}
			if(viewRect.left != 0){
				return;
			}
			
			if(!rootViewRect.equals(viewRect)){
				rootViewRect = viewRect;
				Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
				
					@Override
					public void run() {
						// TODO Auto-generated method stub
						nativeWindowsVisibleChange(rootViewRect.bottom, rootViewRect.left, rootViewRect.top, rootViewRect.right);
//						Log.d(TAG, "view visible: bottom:"+rootViewRect.bottom +
//								" - top:"+rootViewRect.top +
//								" - left:"+rootViewRect.left +
//								" - right:"+rootViewRect.right);
					}
				});
			}
		}
	}
	
	public void vibrator(){
		if(activity != null){
			if(this.checkPermission(android.Manifest.permission.VIBRATE)){
				Vibrator v = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
				if(v != null){
					v.vibrate(VIBRATOR_TIME);
				}			
			}
		}
	}
	
	public Rect getRootLayoutRect(){
    	Rect r = new Rect();
    	rootLayout.getWindowVisibleDisplayFrame(r);  
    	return r;
	}
	
	public String getMainAccount(){
		if(activity != null){
			Pattern emailPattern = Patterns.EMAIL_ADDRESS; // API level 8+
			Account[] accounts = AccountManager.get(activity).getAccounts();
			for (Account account : accounts) {
			    if (emailPattern.matcher(account.name).matches()) {
			        return account.name;
			    }
			}
		}
		
		return "";
	}
	
	public void callSupport(final String numberSup){
		activity.runOnUiThread(new Runnable() {	
			@Override
			public void run() {
				// TODO Auto-generated method stub
				Intent intent = new Intent(Intent.ACTION_VIEW);
				//Intent intent = new Intent(Intent.ACTION_CALL);
				intent.setData(Uri.parse("tel:" + numberSup));
				activity.startActivity(intent);
			}
		});
	
	}
	
	public String getVersionName(){		
		try {
			PackageManager manager = activity.getApplicationContext().getPackageManager();
			PackageInfo info = manager.getPackageInfo(activity.getApplicationContext().getPackageName(), 0);
			return info.versionName;
		} catch (NameNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return "";
	}
		
	public boolean checkNetworkConnection(){
		if(activity != null){
			ConnectivityManager conMgr = (ConnectivityManager)activity.getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo netInfo = conMgr.getActiveNetworkInfo();
			if(netInfo != null){
				if(netInfo.isConnected()){
					return true;
				}
			}
		}
		return false;
	}
	public String getAndroidPackage(){
		if(activity != null){
			return activity.getApplicationContext().getPackageName();
		}
		return "";
	}
	
	/**/
	/** fix getAccoutn android-23 **/
	/**/
	private static final int LOGIN_PERMISSION_REQUEST = 101;
	private static final int CALL_PERMISSION_REQUEST = 102;
	public boolean checkLoginPermission(boolean isRequest){
		if(activity != null){
			String[] permission = null;
			if(android.os.Build.VERSION.SDK_INT < 16){
				permission = new String[]{android.Manifest.permission.GET_ACCOUNTS,
						android.Manifest.permission.WRITE_EXTERNAL_STORAGE };
			}
			else{
				permission = new String[]{android.Manifest.permission.GET_ACCOUNTS,
						android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
						android.Manifest.permission.READ_EXTERNAL_STORAGE};
			}
			
			if(!checkPermission(permission)){
				if(isRequest){
					this.requestPermission(permission, LOGIN_PERMISSION_REQUEST);
				}				
				return false;
			}
			return true;
		}
		return false;
	}
	
//	public boolean checkCallPermission(boolean isRequest){
//		if(activity != null){
//			if(!checkPermission(android.Manifest.permission.CALL_PHONE)){
//				if(isRequest){
//					this.requestPermission(android.Manifest.permission.CALL_PHONE, CALL_PERMISSION_REQUEST);
//				}			
//				return false;
//			}
//			return true;
//		}
//		return false;
//	}
	
	public boolean checkPermission(String permission){
		if(activity != null){
			int flag = ContextCompat.checkSelfPermission(activity , permission);
	        return (flag == PackageManager.PERMISSION_GRANTED);
		}
		return false;
	}	
	public boolean checkPermission(String[] permission){
		if(activity != null){
			for(int i=0;i<permission.length;i++){
				if(!checkPermission(permission[i])){
					return false;
				}
			}
		}
		return true;
	}	
	public void requestPermission(String permission, int requestCode){
		requestPermission(new String[]{permission}, requestCode);
	}	
	public void requestPermission(String[] permission, int requestCode){
		if(activity != null){
			ActivityCompat.requestPermissions(activity, permission, requestCode);
		}
	}
	public void requestPermissionThreadSafe(final String[] permission, final int requestCode){
		if(activity != null){
			activity.runOnUiThread(new Runnable() {
				
				@Override
				public void run() {
					// TODO Auto-generated method stub
					for(int i =0;i<permission.length;i++){
						Log.d(TAG, "permission: "+permission[i]);
					}
					ActivityCompat.requestPermissions(activity, permission, requestCode);
				}
			});		
		}
	}
	public void onActivityResult(final int requestCode, final int resultCode, Intent data){
//		String jsonData = "";
//		if(data != null){
//			Bundle bundle = data.getExtras();
//			if(bundle != null){
//				JSONObject json = new JSONObject();
//				Set<String> keys = bundle.keySet();
//				for (String key : keys) {
//				    try {
//				        // json.put(key, bundle.get(key)); see edit below
//				    	Object obj = JSONObject.wrap(bundle.get(key));
//				    	if(obj != null){
//				    		json.put(key, obj);
//				    	}			        
//				    } catch(JSONException e) {
//				        //Handle exception here
//				    	jsonData = "";
//				    }
//				}			
//				jsonData = json.toString();
//			}
//		}
//		
//		final String intenJson = jsonData;
//		GLSurfaceView gameView = Cocos2dxGLSurfaceView.getInstance();
//		gameView.queueEvent(new Runnable() {			
//			@Override
//			public void run() {
//				// TODO Auto-generated method stub
//				nativeOnActivityResult(requestCode, resultCode, intenJson);
//			}
//		});
				
	}
	
	public void onRegisterNotificationSuccess(final String deviceId, final String token){
		Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {			
			@Override
			public void run() {
				// TODO Auto-generated method stub
				nativeOnRegisterNotificationSuccess(deviceId, token);
			}
		});
	}
	
	public String getFCMToken(){
		String token = FirebaseInstanceId.getInstance().getToken();
		if(token != null){
			return token;
		}
		return "";
	}
	
	public void pushNotification(String title, String message){
      Intent intent = new Intent(activity, AppActivity.class);
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
      PendingIntent pendingIntent = PendingIntent.getActivity(activity, 0, intent, PendingIntent.FLAG_ONE_SHOT);

      Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
      NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(activity)
			  .setSmallIcon(R.mipmap.ic_launcher)
              .setContentTitle(title)
              .setContentText(message)
              .setStyle(new NotificationCompat.BigTextStyle().bigText(title))
              .setStyle(new NotificationCompat.BigTextStyle().bigText(message))          
              .setAutoCancel(true)
              .setSound(defaultSoundUri)
              .setContentIntent(pendingIntent);
      NotificationManager notificationManager = (NotificationManager) activity.getSystemService(Context.NOTIFICATION_SERVICE);
      notificationManager.notify(0, notificationBuilder.build());
	}
	
	/****/
	private static void jniVibrator(){
		SystemPlugin.getInstance().vibrator();
	}
	
	private static String jniGetMainAccount(){
		return SystemPlugin.getInstance().getMainAccount();
	}
	
	private static String jniGetVersionName(){
		return SystemPlugin.getInstance().getVersionName();
	}
	
	private static boolean jniCheckNetworkConnection(){
		return SystemPlugin.getInstance().checkNetworkConnection();
	}
	
	private static int jniGetKeyboardHeight(){
		return SystemPlugin.getInstance().getKeyboardHeight();
	}
	private static String jniGetAndroidPackage(){
		return SystemPlugin.getInstance().getAndroidPackage();
	}
	private static void jniPhoneSupport(String phoneNumber){
		SystemPlugin.getInstance().callSupport(phoneNumber);
	}
	private static boolean jniCheckPermission(String permission){
		return SystemPlugin.getInstance().checkPermission(permission);
	}
	private static void jniRequestPermission(String[] permission, int requestCode){	
		String[] per = new String[]{android.Manifest.permission.SEND_SMS};
		
		SystemPlugin.getInstance().requestPermissionThreadSafe(per , requestCode);
	}
	
	private static String jniGetFCMToken(){
		return SystemPlugin.getInstance().getFCMToken();
	}

	private static final long VIBRATOR_TIME = 100;
	
	private native void nativeWindowsVisibleChange(int bottom ,int left, int top, int right);
	private native void nativeOnRegisterNotificationSuccess(String deviceId, String token);
	private native void nativeOnActivityResult(int requestCode, int returnCode, String data);
}
