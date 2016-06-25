/*
 * FacebookPlugin.cpp
 *
 *  Created on: Feb 3, 2016
 *      Author: QuyetNguyen
 */

#include "FacebookPlugin.h"
#include "cocos2d.h"
USING_NS_CC;

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "jni/JniHelper.h"
extern "C"{
	void jniLogin(){
		JniMethodInfo t;

        if (JniHelper::getStaticMethodInfo(t, "quyetnd/plugin/facebook/FacebookPlugin", "jniLogin", "()V")) {
            t.env->CallStaticVoidMethod(t.classID, t.methodID);
            t.env->DeleteLocalRef(t.classID);
        }
	}

	void jniLogout(){
		JniMethodInfo t;

        if (JniHelper::getStaticMethodInfo(t, "quyetnd/plugin/facebook/FacebookPlugin", "jniLogout", "()V")) {
            t.env->CallStaticVoidMethod(t.classID, t.methodID);
            t.env->DeleteLocalRef(t.classID);
        }
	}

	JNIEXPORT void JNICALL Java_quyetnd_plugin_facebook_FacebookPlugin_nativeOnLoginFinished(JNIEnv*  env, jobject thiz, jint returnCode, jstring userId, jstring token) {
		std::string _userId = JniHelper::jstring2string(userId);
		std::string _token = JniHelper::jstring2string(token);

		quyetnd::FacebookPlugin::getInstance()->onLoginFinished(returnCode, _userId, _token);
	}
}
#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#include "FacebookPlugin_iOS_link.h"
void _objc_to_c_fbLogin_finished(int returnCode, const char* userId, const char* accessToken){
    quyetnd::FacebookPlugin::getInstance()->onLoginFinished(returnCode, std::string(userId), std::string(accessToken));
}
#endif



namespace quyetnd {

static FacebookPlugin* s_FacebookPlugin = 0;
FacebookPlugin* FacebookPlugin::getInstance(){
	if(!s_FacebookPlugin){
		s_FacebookPlugin = new FacebookPlugin();
	}
	return s_FacebookPlugin;
}

FacebookPlugin::FacebookPlugin() {
	// TODO Auto-generated constructor stub

}

FacebookPlugin::~FacebookPlugin() {
	// TODO Auto-generated destructor stub
}

void FacebookPlugin::showLogin(){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	jniLogin();
#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    _c_to_objc_showLogin();
#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_WINRT
	this->onLoginFinished(1, "", "");
#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_WIN32
	this->onLoginFinished(1, "", "");
#endif
}

void FacebookPlugin::onLoginFinished(int returnCode, const std::string& userId, const std::string& accessToken){
	log("returnCode : %d", returnCode);

//	GlobalMessageDict dict;
//	dict.setInt("returnCode", returnCode);
//	dict.setString("userId", userId);
//	dict.setString("accessToken", accessToken);
//
//	GlobalMessageSystem::getInstance()->onEvent(GLOBAL_MESSAGE_FB_LOGIN, &dict);
}

} /* namespace quyetnd */
