package vn.quyetnguyen.plugin.system;

import android.app.Activity;
import android.content.Intent;
import android.opengl.GLSurfaceView;
import android.os.Bundle;

public interface IExtension {
	public void onLoaded(Activity activity, GLSurfaceView gameSurfaceView);
	public void onStart();
	public void onPostCreate(Bundle savedInstanceState);
	public void onPostResume();
	public void onRestart();
	public void onRestoreInstanceState(Bundle savedInstanceState);
	public void onSaveInstanceState(Bundle outState);
	public void onPause();
	public void onResume();
	public void onActivityResult(int requestCode, int resultCode, Intent data);
	public void onDestroy();
	public void onStop();
}
