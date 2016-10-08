package vn.quyetnguyen.plugin.system;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetManager;
import android.opengl.GLSurfaceView;
import android.os.Bundle;
import android.util.Log;
import dalvik.system.DexClassLoader;
import dalvik.system.DexFile;

public class ExtensionLoader {
	private static ExtensionLoader instance = null;
	GLSurfaceView gameSurfaceView;
	private ExtensionLoader(){
		extensions = new ArrayList<IExtension>();
	}
	public static ExtensionLoader getInstance(){
		if(instance == null){
			instance = new ExtensionLoader();
		}
		return instance;
	}
	
	private Activity activity = null;
	private List<IExtension> extensions;
	private static final String TAG = "ExtensionLoader";
	public void init(Activity activity, GLSurfaceView gameSurfaceView){
		this.activity = activity;
		this.gameSurfaceView = gameSurfaceView;
	}

	public void addExtension(IExtension extension){
		extensions.add(extension);
		extension.onLoaded(activity, gameSurfaceView);
	}
	
	private void copyAsset(String jarPath){
		AssetManager assetManager = activity.getAssets();
		try {
			InputStream input =  assetManager.open("res/" + jarPath);
			
			File filesDir = activity.getFilesDir();
			File outputFile = new File(filesDir, jarPath);
			outputFile.getParentFile().mkdirs();
			outputFile.createNewFile();		
			OutputStream outStream = new FileOutputStream(outputFile);
			
			byte[] buffer = new byte[1024];
			int nRead;
			while((nRead = input.read(buffer)) != -1){
				outStream.write(buffer, 0, nRead);
			}
			outStream.close();
			input.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void loadExtension(String jarPath){
		Log.i(TAG, "Load jar: "+jarPath);
		try {
			DexFile dx = DexFile.loadDex(jarPath, File.createTempFile("opt", "dex", activity.getCacheDir()).getPath(), 0);
			
			List<Class<?>> extClassList = new ArrayList<Class<?>>();
			for(Enumeration<String> classNames = dx.entries(); classNames.hasMoreElements();) {
		        String classStr = classNames.nextElement();
		        Class<?> clazz = dx.loadClass(classStr, activity.getClassLoader());
		        if(IExtension.class.isAssignableFrom(clazz)){		        	
		        	extClassList.add(clazz);
		        }		     
		        Log.i(TAG, "Load class: " + classStr);
		    }
			for(int i=0;i<extClassList.size();i++){
				Class<?> clazz = extClassList.get(i);
				IExtension extension = (IExtension)clazz.newInstance();
				this.addExtension(extension);
				Log.i(TAG, "Load extension: " + clazz.toString());
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public String callJSFunction(final String jsFunc, final String param){
//		Log.d(TAG, "callJSFunction: " +jsFunc);
//		return "";
		return nativeCallJSFunc(jsFunc, param);
	}
	
	public void onStart() {	
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onStart();
		}
	}
	
	public void onPostCreate(Bundle savedInstanceState) {
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onPostCreate(savedInstanceState);
		}
	}
	
	public void onPostResume() {
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onPostResume();
		}
	}

	public void onRestart() {
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onRestart();
		}
	}
	
	public void onRestoreInstanceState(Bundle savedInstanceState) {
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onRestoreInstanceState(savedInstanceState);
		}
	}

	
	public void onSaveInstanceState(Bundle outState) {
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onSaveInstanceState(outState);
		}
	}

	public void onPause() {
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onPause();
		}
	}

	public void onResume() {
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onResume();
		}
	}

	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onActivityResult(requestCode, resultCode, data);
		}
	}
	
	public void onDestroy() {		
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onDestroy();
		}
	}

	public void onStop() {		
		for(int i=0;i<extensions.size();i++){
			extensions.get(i).onStop();
		}
	}
	
	public static void jniLoadExtension(String jarPath){
		ExtensionLoader.getInstance().loadExtension(jarPath);
	}
	private native String nativeCallJSFunc(final String jsFunc, final String param);
}
