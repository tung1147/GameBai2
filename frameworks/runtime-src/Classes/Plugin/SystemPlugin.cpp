/*
 * SystemPlugin.cpp
 *
 *  Created on: Feb 3, 2016
 *      Author: QuyetNguyen
 */

#include "SystemPlugin.h"
#include "cocos2d.h"
#include <json/rapidjson.h>
#include <json/document.h>
#include <iostream>
#include <fstream>
#include "jsb_quyetnd_systemplugin.hpp"
USING_NS_CC;

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "UUIDEncrypt.h"
#include "jni/JniHelper.h"
extern "C"{

JNIEXPORT void JNICALL Java_vn_quyetnguyen_android_billing_AndroidBilling_nativeOnFinished(JNIEnv*  env, jobject thiz, jint returnCode, jstring purchaseSignature, jstring purchaseJson){
	std::string signature = JniHelper::jstring2string(purchaseSignature);
	std::string json = JniHelper::jstring2string(purchaseJson);
	quyetnd::SystemPlugin::getInstance()->onBuyItemFinished(returnCode, signature, json);
}

JNIEXPORT void JNICALL Java_vn_quyetnguyen_plugin_system_SystemPlugin_nativeWindowsVisibleChange(JNIEnv*  env, jobject thiz, jint bottom ,jint left, jint top, jint right) {
	quyetnd::SystemPlugin::getInstance()->android_onWindowsVisibleChange(bottom,left,top,right);
}

bool jniRequestBuyItem(const std::string& itemId){
	JniMethodInfo method;
	bool bRet = JniHelper::getStaticMethodInfo(method,"vn/quyetnguyen/android/billing/AndroidBilling","jniBuyItem","(Ljava/lang/String;Z)V");
	if(bRet){
		jstring _itemId = method.env->NewStringUTF(itemId.data());

		method.env->CallStaticVoidMethod(method.classID, method.methodID, _itemId, JNI_TRUE);

		method.env->DeleteLocalRef(method.classID);
		method.env->DeleteLocalRef(_itemId);

		return true;
	}

	return false;
}


std::string _getAndroidPackage(){
	JniMethodInfo sMethod;
	bool bRet = JniHelper::getStaticMethodInfo(sMethod,"vn/quyetnguyen/plugin/system/SystemPlugin","jniGetAndroidPackage","()Ljava/lang/String;");
	if(bRet){
		jstring jstr = (jstring) sMethod.env->CallStaticObjectMethod(sMethod.classID, sMethod.methodID);
		std::string pStr = JniHelper::jstring2string(jstr);
		sMethod.env->DeleteLocalRef(sMethod.classID);
		sMethod.env->DeleteLocalRef(jstr);
		return pStr;
	}
	return "";
}

std::string jniGetVersionName(){
	JniMethodInfo sMethod;
	bool bRet = JniHelper::getStaticMethodInfo(sMethod,"vn/quyetnguyen/plugin/system/SystemPlugin","jniGetVersionName","()Ljava/lang/String;");
	if(bRet){
		jstring jstr = (jstring) sMethod.env->CallStaticObjectMethod(sMethod.classID, sMethod.methodID);
		std::string pStr = JniHelper::jstring2string(jstr);
		sMethod.env->DeleteLocalRef(sMethod.classID);
		sMethod.env->DeleteLocalRef(jstr);
		return pStr;
	}
	return "";
}

void jniCallSupport(const std::string& numberPhone){
	JniMethodInfo method;
		bool bRet = JniHelper::getStaticMethodInfo(method,"vn/quyetnguyen/plugin/system/SystemPlugin","jniPhoneSupport","(Ljava/lang/String;)V");
		if(bRet){
			jstring _numberPhone = method.env->NewStringUTF(numberPhone.data());

			method.env->CallStaticVoidMethod(method.classID, method.methodID, _numberPhone);

			method.env->DeleteLocalRef(method.classID);
			method.env->DeleteLocalRef(_numberPhone);

		}
}

}

#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
//#include "IOS_SystemPlugin.h"

#include "cMediate.h"

void obj_to_c(bool a){
    log("call backk");
}

void obj_to_c_buyAppSuccess(int returnCode, std::string recept)
{
    log("ios inapp recept %s",recept.c_str());
   quyetnd::SystemPlugin::getInstance()->onBuyItemFinished(returnCode, recept);
    
}

void obj_to_c_registerNotificationSuccess(const char* uid, const char* token){
    quyetnd::SystemPlugin::getInstance()->onRegisterNotificationSuccess(uid, token);
}

#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
std::vector<unsigned char> _winrt_getData(::Windows::Storage::Streams::IBuffer^ buf)
{
	auto reader = ::Windows::Storage::Streams::DataReader::FromBuffer(buf);
	std::vector<unsigned char> data(reader->UnconsumedBufferLength);
	if (!data.empty())
		reader->ReadBytes(::Platform::ArrayReference<unsigned char>(&data[0], data.size()));
	return data;
}

std::string _winrt_ByteArrayToHex(const std::vector<unsigned char>& buffer){
	std::string imei = "";

	char stringBuffer[10];
	for (int i = 0; i < buffer.size(); i++){
		sprintf(stringBuffer, "%02X", buffer[i]);

		imei += std::string(stringBuffer);
	}
	return imei;
}

std::string _winrt_getVersionName(){
	//::Windows.ApplicationModel.Package.Current
	::Windows::ApplicationModel::Package^ currentPackage = ::Windows::ApplicationModel::Package::Current;
	::Windows::ApplicationModel::PackageVersion version = currentPackage->Id->Version;

	char stringBuffer[20];
	sprintf(stringBuffer, "%hu.%hu.%hu", version.Major, version.Minor, version.Build);
	return std::string(stringBuffer);
}

inline std::string _wstring_to_string(const std::wstring& wstring){
	auto wideData = wstring.c_str();
	int bufferSize = WideCharToMultiByte(CP_UTF8, 0, wideData, -1, nullptr, 0, NULL, NULL);
	auto utf8 = std::make_unique<char[]>(bufferSize);
	if (0 == WideCharToMultiByte(CP_UTF8, 0, wideData, -1, utf8.get(), bufferSize, NULL, NULL))
		throw std::exception("Can't convert string to UTF8");
	return std::string(utf8.get());
}

std::string _winrt_getPackageName(){
	::Windows::ApplicationModel::PackageId^ packageId = ::Windows::ApplicationModel::Package::Current->Id;
	std::wstring wstr(packageId->Name->Data());
	return _wstring_to_string(wstr);
}

#endif

namespace quyetnd {

static SystemPlugin* s_SystemPlugin = 0;

SystemPlugin* SystemPlugin::getInstance(){
	if(!s_SystemPlugin){
		s_SystemPlugin = new SystemPlugin();
	}
	return s_SystemPlugin;
}

SystemPlugin::SystemPlugin() {
	// TODO Auto-generated constructor stub
}

SystemPlugin::~SystemPlugin() {
	// TODO Auto-generated destructor stub
}

void SystemPlugin::initStore(const std::vector<std::string>& listProduct){
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
	c_to_objCinitStore(listProduct);
#else
#endif
}

void SystemPlugin::buyItem(const std::string& item){
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
	 c_to_objBuyItem(item);
#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	 jniRequestBuyItem(item);
#endif
	 //log("buyItem: %s", item.c_str());
}
    
std::string SystemPlugin::getVersionName(){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	return jniGetVersionName();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    return c_to_obj_getVersion();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
	return _winrt_getVersionName();
#else
	return "1.0.0";
#endif
}

std::string SystemPlugin::getPackageName(){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	return _getAndroidPackage();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    return c_to_obj_getBundle();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
	return _winrt_getPackageName();
#else
	return "com.gamebaivip.doithuongthat";
#endif
}
    
void SystemPlugin::callSupport(const std::string& numberSupport)
    {
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
        jniCallSupport(numberSupport);
#elif CC_TARGET_PLATFORM == CC_PLATFORM_IOS
        c_to_objCCallSupport(numberSupport.c_str());
        
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
        
#else
       
#endif
    }
    
std::string SystemPlugin::getDeviceUUID(std::string nameKeyChain){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	return UUIDEncrypt::getInstance()->getUUID();

#elif CC_TARGET_PLATFORM == CC_PLATFORM_IOS
   
    const char* uuidMe= c_to_objC_getUUID(nameKeyChain.c_str());
    if(uuidMe==0)
    {
        c_to_objC_setKeyChainUser(nameKeyChain.c_str());
        uuidMe= c_to_objC_getUUID(nameKeyChain.c_str());
    }
	return uuidMe;

#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
	auto hardwareToken = Windows::System::Profile::HardwareIdentification::GetPackageSpecificToken(nullptr);
	std::vector<unsigned char> buffer = _winrt_getData(hardwareToken->Id);
	return _winrt_ByteArrayToHex(buffer);

//	return "imei";
#else
	return "imei";
#endif
}
    
void SystemPlugin::onBuyItemFinished(int returnCode, const std::string& signature, const std::string& json){
	jsb_quyetnd_onBuyItemFinished_Android(returnCode, signature, json);
}

void SystemPlugin::onBuyItemFinished(int returnCode, const std::string& signature){
	jsb_quyetnd_onBuyItemFinished_iOS(returnCode, signature);
}
    
void SystemPlugin::onRegisterNotificationSuccess(const std::string& uid, const std::string& token){
        
}

/***/
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
static float _window_ratioX;
static float _window_ratioY;
static bool _window_ratio_init = true;

void SystemPlugin::android_onWindowsVisibleChange(int bottom ,int left, int top, int right){
	if(_window_ratio_init){
		Size frameSize = Director::getInstance()->getOpenGLView()->getFrameSize();
		Size winSize = Director::getInstance()->getWinSize();
		_window_ratioX = winSize.width / frameSize.width;
		_window_ratioY = winSize.height / frameSize.height;
		_window_ratio_init = false;
	}

	/* convert to gl */
	Point p1(left * _window_ratioX, bottom * _window_ratioY);
	Point left_bottom = Director::getInstance()->convertToGL(p1);
	if(left_bottom.y > 100.0f){
		//show
		for(int i=0;i<_keyboardDelegate.size();i++){
			_keyboardDelegate[i]->onSoftKeyboardShow(left_bottom.y);
		}
	}
	else{
		//hide
		for(int i=0;i<_keyboardDelegate.size();i++){
			_keyboardDelegate[i]->onSoftKeyboardHide();
		}
	}
}
#endif

void SystemPlugin::addSoftKeyboardDelegate(SoftKeyboardDelegate* delegate){
	_keyboardDelegate.push_back(delegate);
}

void SystemPlugin::removeSoftKeyboardDelegate(SoftKeyboardDelegate* delegate){
	_keyboardDelegate.erase(std::remove(_keyboardDelegate.begin(), _keyboardDelegate.end(), delegate));
}

/****/
SoftKeyboardDelegate::SoftKeyboardDelegate(){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	SystemPlugin::getInstance()->addSoftKeyboardDelegate(this);
#endif
}

SoftKeyboardDelegate::~SoftKeyboardDelegate(){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	SystemPlugin::getInstance()->removeSoftKeyboardDelegate(this);
#endif
}

void SoftKeyboardDelegate::onSoftKeyboardShow(float keyboardHeight){

}

void SoftKeyboardDelegate::onSoftKeyboardHide(){

}


} /* namespace quyetnd */