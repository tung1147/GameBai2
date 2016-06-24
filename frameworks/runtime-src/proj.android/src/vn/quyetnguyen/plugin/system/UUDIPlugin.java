package vn.quyetnguyen.plugin.system;

import java.io.File;
import java.util.UUID;
import java.util.regex.Pattern;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.app.Activity;
import android.os.Build;
import android.os.Environment;
import android.util.Patterns;

public class UUDIPlugin {
	static UUDIPlugin instance = null;
	private UUDIPlugin(){
	
	}
	
	public static UUDIPlugin getInstance(){
		if(instance == null){
			instance = new UUDIPlugin();
		}
		return instance;
	}
	
	private Activity activity;
	
	public void initWithActivity(Activity activity){
		this.activity = activity;
	}
	
	public String getExternalStoragePath(String fileName){
		File sdCard = Environment.getExternalStorageDirectory();
		if(sdCard != null){
			File filePath = new File(sdCard, fileName);		
			if(!filePath.getParentFile().exists()){
				filePath.getParentFile().mkdirs();
			}
			return filePath.getAbsolutePath();
		}
		return "";
	}
	
	public String getAndroidPackage(){
		if(activity != null){
			return activity.getApplicationContext().getPackageName();
		}
		return "";
	}
	
	public String getGoogleAccount(){
		if(activity != null){
			Pattern emailPattern = Patterns.EMAIL_ADDRESS;
			Account[] accounts = AccountManager.get(activity).getAccounts();
			for (Account account : accounts) {
			    if (emailPattern.matcher(account.name).matches()) {
			        return account.name;
			    }
			}
		}
		return "";
	}
	
	
	 /**
     * Return pseudo unique ID
     * @return ID
     */
    public String getPsuedoUniqueID(String appKeys){
        // If all else fails, if the user does have lower than API 9 (lower
        // than Gingerbread), has reset their phone or 'Secure.ANDROID_ID'
        // returns 'null', then simply the ID returned will be solely based
        // off their Android device information. This is where the collisions
        // can happen.
        // Thanks http://www.pocketmagic.net/?p=1662!
        // Try not to use DISPLAY, HOST or ID - these items could change.
        // If there are collisions, there will be overlapping data
        String m_szDevIDShort = "35" +
                (Build.BOARD.length() % 10)
                + (Build.BRAND.length() % 10)
                + (Build.CPU_ABI.length() % 10)
                + (Build.DEVICE.length() % 10)
                + (Build.MANUFACTURER.length() % 10)
                + (Build.MODEL.length() % 10)
                + (Build.PRODUCT.length() % 10);

        // Thanks to @Roman SL!
        // http://stackoverflow.com/a/4789483/950427
        // Only devices with API >= 9 have android.os.Build.SERIAL
        // http://developer.android.com/reference/android/os/Build.html#SERIAL
        // If a user upgrades software or roots their phone, there will be a duplicate entry
        String serial = null;
        try
        {
            serial = android.os.Build.class.getField("SERIAL").get(null).toString();

            // Go ahead and return the serial for api => 9
            return new UUID(m_szDevIDShort.hashCode(), serial.hashCode()).toString();
        }
        catch (Exception e)
        {
            // String needs to be initialized
            serial = "serial"; // some value
        }

        // Thanks @Joe!
        // http://stackoverflow.com/a/2853253/950427
        // Finally, combine the values we have found by using the UUID class to create a unique identifier
        return new UUID(m_szDevIDShort.hashCode(), serial.hashCode()).toString();
    }
    
    /**/
	private static String jniGetExternalStoragePath(String fileName){
		return UUDIPlugin.getInstance().getExternalStoragePath(fileName);
	}
	
	private static String jniGetAndroidPackage(){
		return UUDIPlugin.getInstance().getAndroidPackage();
	}
	
	private static String jniGetGoogleAccount(){
		return UUDIPlugin.getInstance().getGoogleAccount();
	}
	
	private static String jniGetPsuedoUniqueID(String appKeys){
		return UUDIPlugin.getInstance().getPsuedoUniqueID(appKeys);
	}
}
