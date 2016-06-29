/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2014 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager;
import quyetnd.plugin.facebook.FacebookPlugin;
import vn.quyetnd.plugin.gcm.GcmPlugin;
import vn.quyetnguyen.android.billing.AndroidBilling;
import vn.quyetnguyen.plugin.system.SystemPlugin;
import vn.quyetnguyen.plugin.system.UUDIPlugin;

public class AppActivity extends Cocos2dxActivity {

	 @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        return glSurfaceView;
    }
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
					
		SystemPlugin.getInstance().init(this);
		UUDIPlugin.getInstance().initWithActivity(this);
		FacebookPlugin.getInstance().init(this, Cocos2dxGLSurfaceView.getInstance());		
		GcmPlugin.getInstance().initGcm(this, PluginConfig.GCM_SENDER_ID, PluginConfig.GCM_BUNDLEID, PluginConfig.GCM_URL);
        AndroidBilling.getInstance().initBilling(this, Cocos2dxGLSurfaceView.getInstance(), PluginConfig.IAP_base64PublicKey); 	
	}
	   
    @Override
	protected void onStart() {	
		super.onStart();
		FacebookPlugin.getInstance().onStart();
	}

	@Override
	protected void onPause() {
		super.onPause();
		FacebookPlugin.getInstance().onPause();
	}

	@Override
	protected void onResume() {
		super.onResume();
		FacebookPlugin.getInstance().onResume();
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if(!AndroidBilling.getInstance().onActivityResult(requestCode, resultCode, data)){
			super.onActivityResult(requestCode, resultCode, data);
			FacebookPlugin.getInstance().onActivityResult(requestCode, resultCode, data);
		}	
	}
	
	@Override
	protected void onDestroy() {		
		FacebookPlugin.getInstance().onDestroy();
		AndroidBilling.getInstance().onDestroy();
		super.onDestroy();
	}

	@Override
	protected void onStop() {		
		FacebookPlugin.getInstance().onStop();
		super.onStop();
	}
}
