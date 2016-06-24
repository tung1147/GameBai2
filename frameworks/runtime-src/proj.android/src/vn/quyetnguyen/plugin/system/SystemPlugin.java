package vn.quyetnguyen.plugin.system;

import java.util.regex.Pattern;

import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.Manifest;
import android.accounts.Account;
import android.accounts.AccountManager;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Rect;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Vibrator;
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
			int permission = ContextCompat.checkSelfPermission(activity,  Manifest.permission.VIBRATE);
			if(permission == PackageManager.PERMISSION_GRANTED){
				 Vibrator v = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
				 v.vibrate(VIBRATOR_TIME);
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
				Intent intent = new Intent(Intent.ACTION_CALL);
	
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
	
	private static final long VIBRATOR_TIME = 100;
	
	private native void nativeWindowsVisibleChange(int bottom ,int left, int top, int right);
}
