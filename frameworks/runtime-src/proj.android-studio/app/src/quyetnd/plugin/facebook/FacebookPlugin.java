package quyetnd.plugin.facebook;

import java.util.Arrays;

import org.json.JSONObject;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.Profile;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.puppet.gamebai2.R;

import android.app.Activity;
import android.content.Intent;
import android.opengl.GLSurfaceView;
import android.os.Bundle;

public class FacebookPlugin {
	private static FacebookPlugin instance = null;
	private FacebookPlugin(){
		
	}
	
	public static FacebookPlugin getInstance(){
		if(instance == null){
			instance = new FacebookPlugin();
		}
		
		return instance;
	}
	
	/**/
	Activity mActivity = null;
	GLSurfaceView gameSurfaceView = null;
	CallbackManager callbackLogin= null;
	String appIdTracking = null;
	String appIdLogin = null;
	
	/*event*/
	public void init(Activity activity, GLSurfaceView gameSurfaceView){
		mActivity = activity;
		this.gameSurfaceView = gameSurfaceView;
		appIdLogin = mActivity.getString(R.string.facebook_app_id_login);
		appIdTracking = mActivity.getString(R.string.facebook_app_id);
		
		callbackLogin = CallbackManager.Factory.create();
		FacebookSdk.sdkInitialize(mActivity);
		
		LoginManager.getInstance().registerCallback(callbackLogin, new FacebookCallback<LoginResult>() {
			@Override
			public void onSuccess(LoginResult loginResult) {				
				AccessToken accessToken = AccessToken.getCurrentAccessToken();
				if(accessToken != null){
					accessToken.getUserId();
					onLoginFinished(0, accessToken.getUserId(), accessToken.getToken());
				}
				else{
					onLoginFinished(2, "", "");
				}
			}
			
			@Override
			public void onCancel() {			  
				onLoginFinished(-1, "", "");
			}
			
			@Override
			public void onError(FacebookException exception) {			   
				onLoginFinished(1, "", "");
			}
    	});
	}
	
	public void onStart() {	

	}


	public void onPause() {
		AppEventsLogger.deactivateApp(mActivity.getApplication(), appIdTracking);
	}

	public void onResume() {
		AppEventsLogger.activateApp(mActivity.getApplication(), appIdTracking);
	}

	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		if(callbackLogin != null){
			callbackLogin.onActivityResult(requestCode, resultCode, data);
		}
	}
	

	public void onDestroy() {	
	
	}

	public void onStop() {		

	}
	
	public void login(){
		if(mActivity != null){
			if(appIdLogin != null){
				FacebookSdk.setApplicationId(appIdLogin);
			}
			mActivity.runOnUiThread(new Runnable() {			
				@Override
				public void run() {
					// TODO Auto-generated method stub
					//if logined
					AccessToken accessToken = AccessToken.getCurrentAccessToken();
					if(accessToken != null){
						onLoginFinished(0, accessToken.getUserId(), accessToken.getToken());						
						requestMe();
					}
					else{
						LoginManager.getInstance().logInWithReadPermissions(mActivity, Arrays.asList("public_profile"));
					}
				}
			});
		}
	}
	
	private void requestMe(){
		AccessToken accessToken = AccessToken.getCurrentAccessToken();
		GraphRequest request = GraphRequest.newMeRequest(accessToken,
		        new GraphRequest.GraphJSONObjectCallback() {
		            @Override
		            public void onCompleted(JSONObject object, GraphResponse response) {
		                // Application code
		            }
		        });
		Bundle parameters = new Bundle();
		parameters.putString("fields", "id,name");
		request.setParameters(parameters);
		request.executeAsync();
	}
	
	public void logout(){
		LoginManager.getInstance().logOut();
	}
	
	private void onLoginFinished(final int returnCode, final String userId, final String accessToken){
		if(gameSurfaceView != null){
			gameSurfaceView.queueEvent(new Runnable() {
				
				@Override
				public void run() {
					// TODO Auto-generated method stub
					nativeOnLoginFinished(returnCode, userId, accessToken);
				}
			});
		}
	}
	
	private static void jniLogin(){
		FacebookPlugin.getInstance().login();
	}
	
	private static void jniLogout(){
		FacebookPlugin.getInstance().logout();
	}
	
	private native void nativeOnLoginFinished(int returnCode, String userId, String accessToken);
}
