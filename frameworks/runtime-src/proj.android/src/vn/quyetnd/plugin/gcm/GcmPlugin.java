package vn.quyetnd.plugin.gcm;

import android.app.Activity;
import android.content.Intent;
import android.provider.Settings.Secure;

public class GcmPlugin {
	static GcmPlugin instance = null;
	private GcmPlugin(){
		
	}
	
	public static GcmPlugin getInstance(){
		if(instance == null){
			instance = new GcmPlugin();
		}
		return instance;
	}
	
	private Activity activity = null;
	private String senderId = null;
	private String bundleId = null;
	private String urlCallback = null;
	private String androidId = null;
	private String androidPackage = null;
	
	public void initGcm(Activity activity, String senderId, String bundleId, String urlCallback){
		this.activity = activity;
		this.senderId = senderId;
		this.bundleId = bundleId;
		this.urlCallback = urlCallback;
		
		androidId = Secure.getString(activity.getContentResolver(), Secure.ANDROID_ID); 
		androidPackage = activity.getApplicationContext().getPackageName();
		
		Intent intent = new Intent(activity, RegistrationIntentService.class);
		activity.startService(intent);
	}

	public String getBundleId() {
		return bundleId;
	}

	public void setBundleId(String bundleId) {
		this.bundleId = bundleId;
	}

	public String getSenderId() {
		return senderId;
	}

	public String getUrlCallback() {
		return urlCallback;
	}

	public String getAndroidId() {
		return androidId;
	}

	public Activity getActivity() {
		return activity;
	}

	public String getAndroidPackage() {
		return androidPackage;
	}
}
