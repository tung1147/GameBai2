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
#include "jsapi.h"
#include "jsfriendapi.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include <locale>
#include "crypt_aes.h"
#include "base64.h"
#include "base/ccUTF8.h"
#include "network/HttpClient.h"
#include <curl/curl.h>
#include "../GameLaucher/GameLaucher.h"

#ifdef WINRT
#include <codecvt>
#endif

USING_NS_CC;

static const char HEX_CHAR[17] = "0123456789ABCDEF";
inline bool _isxdigit(char c){
	if ('0' <= c && c <= '9'){
		return true;
	}
	if ('a' <= c && c <= 'f'){
		return true;
	}
	if ('A' <= c && c <= 'F'){
		return true;
	}

	return false;
}

char _charxtoint(char c){
	if ('0' <= c && c <= '9'){
		return (c - '0');
	}
	if ('a' <= c && c <= 'f'){
		return (c - 'a' + 10);
	}

	return (c - 'A' + 10);
}

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "UUIDEncrypt.h"
#include "jni/JniHelper.h"
extern "C"{

	JNIEXPORT jstring JNICALL Java_vn_quyetnguyen_plugin_system_ExtensionLoader_nativeCallJSFunc(JNIEnv*  env, jobject thiz, jstring methodName, jstring param){
		std::string _methodName = JniHelper::jstring2string(methodName);
		std::string _param = JniHelper::jstring2string(param);
		std::string strRet = quyetnd::SystemPlugin::getInstance()->callJSFunction(_methodName, _param);
		jstring jstrBuf = env->NewStringUTF(strRet.c_str());
		return jstrBuf;
	}

	JNIEXPORT void JNICALL Java_vn_quyetnguyen_android_billing_AndroidBilling_nativeOnFinished(JNIEnv*  env, jobject thiz, jint returnCode, jstring purchaseSignature, jstring purchaseJson){
		std::string signature = JniHelper::jstring2string(purchaseSignature);
		std::string json = JniHelper::jstring2string(purchaseJson);
		quyetnd::SystemPlugin::getInstance()->onBuyItemFinished(returnCode, signature, json);
	}

	JNIEXPORT void JNICALL Java_vn_quyetnguyen_plugin_system_SystemPlugin_nativeWindowsVisibleChange(JNIEnv*  env, jobject thiz, jint bottom ,jint left, jint top, jint right) {
		quyetnd::SystemPlugin::getInstance()->android_onWindowsVisibleChange(bottom,left,top,right);
	}

	JNIEXPORT void JNICALL Java_vn_quyetnguyen_plugin_system_SystemPlugin_nativeOnRegisterNotificationSuccess(JNIEnv*  env, jobject thiz, jstring deviceId, jstring token){
		std::string _deviceId = JniHelper::jstring2string(deviceId);
		std::string _token = JniHelper::jstring2string(token);
		quyetnd::SystemPlugin::getInstance()->onRegisterNotificationSuccess(_deviceId, _token);
	}

	JNIEXPORT void JNICALL Java_vn_quyetnguyen_plugin_system_SystemPlugin_nativeOnActivityResult(JNIEnv*  env, jobject thiz, jint requestCode, jint returnCode, jstring jsonData){
			std::string _jsonData = JniHelper::jstring2string(jsonData);
			quyetnd::SystemPlugin::getInstance()->androidOnActivityResult((int)requestCode, (int)returnCode, _jsonData);
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

	std::string getFCMToken(){
		JniMethodInfo sMethod;
		bool bRet = JniHelper::getStaticMethodInfo(sMethod,"vn/quyetnguyen/plugin/system/SystemPlugin","jniGetFCMToken","()Ljava/lang/String;");
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

	bool jniShowSMS(const std::string& smsNumber, const std::string& smsContent){
		JniMethodInfo method;
		bool bRet = JniHelper::getStaticMethodInfo(method,"vn/quyetnguyen/plugin/system/SystemPlugin","jniShowSMS","(Ljava/lang/String;Ljava/lang/String;)Z");
		if(bRet){
			jstring _smsNumber = method.env->NewStringUTF(smsNumber.data());
			jstring _smsContent = method.env->NewStringUTF(smsContent.data());

			jboolean b = method.env->CallStaticBooleanMethod(method.classID, method.methodID, _smsNumber, _smsContent);

			method.env->DeleteLocalRef(method.classID);
			method.env->DeleteLocalRef(_smsNumber);
			method.env->DeleteLocalRef(_smsContent);

			return (b == JNI_TRUE);
		}
		return false;
	}

	void jniLoadExtension(const std::string& jarPath){
		JniMethodInfo method;
		bool bRet = JniHelper::getStaticMethodInfo(method,"vn/quyetnguyen/plugin/system/ExtensionLoader","jniLoadExtension","(Ljava/lang/String;)V");
		if(bRet){
			jstring _jarPath = method.env->NewStringUTF(jarPath.c_str());
			method.env->CallStaticVoidMethod(method.classID, method.methodID, _jarPath);
			method.env->DeleteLocalRef(method.classID);
			method.env->DeleteLocalRef(_jarPath);
		}
	}

	bool jniCheckPerrmission(const std::string& permission){
		JniMethodInfo method;
		bool bRet = JniHelper::getStaticMethodInfo(method,"vn/quyetnguyen/plugin/system/SystemPlugin","jniCheckPermission","(Ljava/lang/String;)Z");
		if(bRet){
			jstring _permission = method.env->NewStringUTF(permission.c_str());
			jboolean b = method.env->CallStaticBooleanMethod(method.classID, method.methodID, _permission);
			method.env->DeleteLocalRef(method.classID);
			method.env->DeleteLocalRef(_permission);

			return (b == JNI_TRUE);
		}
		return false;
	}

	void jniRequestPermission(const std::vector<std::string>& permission, int requestCode){
		JniMethodInfo method;
		bool bRet = JniHelper::getStaticMethodInfo(method,"vn/quyetnguyen/plugin/system/SystemPlugin","jniRequestPermission","([Ljava/lang/String;I)V");
		if(bRet){
			auto env = method.env;
			int n = permission.size();
			jobjectArray arr =  env->NewObjectArray(n, env->FindClass("java/lang/String"), env->NewStringUTF(""));
			for(int i=0;i<n;i++){
				env->SetObjectArrayElement(arr, i, env->NewStringUTF(permission[i].c_str()));
			}

			env->CallStaticVoidMethod(method.classID, method.methodID, arr, requestCode);
			env->DeleteLocalRef(method.classID);
			env->DeleteLocalRef(arr);
		}
	}

	void jniCallStaticVoidMethod(const std::string& className, const std::string& methodName, const std::string& params){
		JniMethodInfo method;
		bool bRet = JniHelper::getStaticMethodInfo(method, className.c_str(), methodName.c_str(),"(Ljava/lang/String;)V");
		if(bRet){
			jstring _params = method.env->NewStringUTF(params.c_str());
			method.env->CallStaticVoidMethod(method.classID, method.methodID, _params);
			method.env->DeleteLocalRef(method.classID);
			method.env->DeleteLocalRef(_params);
		}
	}

	std::string jniCallStaticStringMethod(const std::string& className, const std::string& methodName, const std::string& params){
		JniMethodInfo method;
		bool bRet = JniHelper::getStaticMethodInfo(method, className.c_str(), methodName.c_str(),"(Ljava/lang/String;)Ljava/lang/String;");
		if(bRet){
			jstring _params = method.env->NewStringUTF(params.c_str());
			jstring strRet = (jstring)method.env->CallStaticObjectMethod(method.classID, method.methodID, _params);
			method.env->DeleteLocalRef(method.classID);
			method.env->DeleteLocalRef(_params);

			std::string str = JniHelper::jstring2string(strRet);
			return str;
		}
		return "";
	}
}

#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#include "iOS_native_linker.h"
void objC_to_c_buyInAppSuccess(int returnCode, const char*  token){
    CCLOG("ios inapp token %s",token);
    quyetnd::SystemPlugin::getInstance()->onBuyItemFinished(returnCode, std::string(token));
}

void objC_to_c_registedNotificationSuccess(const char* uid, const char* token){
    quyetnd::SystemPlugin::getInstance()->onRegisterNotificationSuccess(uid, token);
}
#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_MAC
#include "MacOS_native_linker.h"
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

bool __stringify_callback(const jschar *buf, uint32_t len, void *data){
	auto buffer = (std::vector<jschar>*)data;
	buffer->insert(buffer->end(), buf, buf + len);
	return true;
}

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
	c_to_objC_initStore(listProduct);
#else
#endif
}

void SystemPlugin::buyItem(const std::string& item){
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
	 c_to_objC_buyItem(item);
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
    return c_to_objC_getVersion();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    return c_to_objC_getVersion();
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
    return c_to_objC_getBundle();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    return c_to_objC_getBundle();
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
    c_to_objC_callSupport(numberSupport.c_str());
        
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
        
#else
       
#endif
}

bool SystemPlugin::showSMS(const std::string& smsNumber, const std::string& smsContent){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	return jniShowSMS(smsNumber, smsContent);
#elif CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    return c_to_objC_showSMS(smsNumber.c_str(), smsContent.c_str());
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
    return false;
#else
	return false;
#endif
}

std::vector<std::string> SystemPlugin::getCarrierName(){
	std::vector<std::string> pret;
	return pret;
}

void SystemPlugin::enableMipmapTexture(const std::string& textureName){
	Texture2D* texture = Director::getInstance()->getTextureCache()->getTextureForKey(textureName);
	if (texture){
		texture->generateMipmap();
		texture->setAntiAliasTexParameters();
		texture->setTexParameters({ GL_LINEAR_MIPMAP_LINEAR, GL_LINEAR, GL_CLAMP_TO_EDGE, GL_CLAMP_TO_EDGE });
	}
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

std::string SystemPlugin::callJSFunction(const std::string& methodName, const std::string& params){
	auto sc = ScriptingCore::getInstance();
	auto cx = sc->getGlobalContext();
	auto rootObject = sc->getGlobalObject();
	JSAutoCompartment ac(cx, rootObject);

	jsval dataVal[2] = {
		std_string_to_jsval(cx, methodName),
		std_string_to_jsval(cx, params)
	};
	JS::RootedValue retval(cx);
	auto ret = sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(rootObject), "nativeCallJSFunction", 2, dataVal, &retval);
	if (ret){
		if (retval.isNullOrUndefined()){
			return "null";
		}
		else if (retval.isString()){
			std::string stringReturn;
			jsval_to_std_string(cx, retval, &stringReturn);
			return stringReturn;
		}
		else{
			return "null";
		}
	}
	return "null";
}

void SystemPlugin::callStaticVoidMethod(const std::string& className, const std::string& methodName, const std::string& params){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	jniCallStaticVoidMethod(className, methodName, params);
#endif
}

std::string SystemPlugin::callStaticStringMethod(const std::string& className, const std::string& methodName, const std::string& params){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	return jniCallStaticStringMethod(className, methodName, params);
#else
	return "";
#endif
}

void SystemPlugin::androidLoadExtension(const std::string& jarPath){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	jniLoadExtension(jarPath);
#endif
}

bool SystemPlugin::androidCheckPermission(const std::string& permission){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	return jniCheckPerrmission(permission);
#else
	return false;
#endif
}

void SystemPlugin::androidOnActivityResult(int requestCode, int returnCode, const std::string& jsonData){
	CCLOG("%d - %d - %s", requestCode, returnCode, jsonData.c_str());
}

void SystemPlugin::androidRequestPermission(const std::vector<std::string>& permission, int requestCode){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	jniRequestPermission(permission, requestCode);
#endif
}

void SystemPlugin::onBuyItemFinished(int returnCode, const std::string& signature, const std::string& json){
	jsb_quyetnd_onBuyItemFinished_Android(returnCode, signature, json);
}

void SystemPlugin::onBuyItemFinished(int returnCode, const std::string& signature){
	jsb_quyetnd_onBuyItemFinished_iOS(returnCode, signature);
}
    
void SystemPlugin::onRegisterNotificationSuccess(const std::string& uid, const std::string& token){
	//log("%s -- %s",uid.c_str(), token.c_str());
	UserDefault::getInstance()->setStringForKey("PushNotification", token);
	jsb_quyetnd_onRegisterNotificationSuccess(uid, token);
}

std::string SystemPlugin::getSystemPushNotification(){
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	return getFCMToken();
#elif CC_TARGET_PLATFORM == CC_PLATFORM_IOS
	return UserDefault::getInstance()->getStringForKey("PushNotification", "");
#else
	return "";
#endif
}

/***/
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
static float _window_ratioX;
static float _window_ratioY;
static bool _window_ratio_init = true;

void SystemPlugin::android_onWindowsVisibleChange(int bottom ,int left, int top, int right){
	if(_window_ratio_init){
	    auto glView = Director::getInstance()->getOpenGLView();
	    if(!glView){
	        return;
	    }
		Size frameSize = glView->getFrameSize();
		Size winSize = Director::getInstance()->getWinSize();
		_window_ratioX = winSize.width / frameSize.width;
		_window_ratioY = winSize.height / frameSize.height;
		_window_ratio_init = false;
	}

	/* convert to gl */
	Point p1(left * _window_ratioX, bottom * _window_ratioY);
	Point left_bottom = Director::getInstance()->convertToGL(p1);
	if(left_bottom.y > 700.0f){
		return;
	}
	if(left_bottom.y > 100.0f){
		//show
		Size winSize = Director::getInstance()->getWinSize();
		IMEKeyboardNotificationInfo info;
		info.begin.setRect(0,0, winSize.width, winSize.height);
		info.end.setRect(0,0,winSize.width, left_bottom.y);
		info.duration = 0.25f;
		IMEDispatcher::sharedDispatcher()->dispatchKeyboardWillShow(info);
	}
	else{
		//hide
		IMEKeyboardNotificationInfo info;
		info.duration = 0.0f;
		IMEDispatcher::sharedDispatcher()->dispatchKeyboardWillHide(info);
	}
}
#endif

#define AES_BLOCK_SIZE_BIT 128
#define AES_BLOCK_SIZE_BYTE 16

std::vector<char> SystemPlugin::dataEncrypt(const char* key, const char* data, int dataSize){
	std::vector<char> retData;

	//create init vector
	uint8_t ivBuffer[AES_BLOCK_SIZE_BYTE];
	for (int i = 0; i<AES_BLOCK_SIZE_BYTE; i++){
		ivBuffer[i] = (uint8_t)rand();
		retData.push_back((char)ivBuffer[i]);
	}

	//add padding
	std::vector<char> dataBuffer(data, data + dataSize);
	int padding = AES_BLOCK_SIZE_BYTE - (dataSize%AES_BLOCK_SIZE_BYTE);
	for (int i = 0; i<padding; i++){
		dataBuffer.push_back(padding);
	}

	//encrypt
	aes_ks_t secretKey;
	aes_setks_encrypt((const uint8_t*)key, AES_BLOCK_SIZE_BIT, &secretKey);
	int outputSize = dataBuffer.size();
	int blockSize = outputSize / AES_BLOCK_SIZE_BYTE;
	uint8_t* outputBuffer = new uint8_t[outputSize];
	aes_cbc_encrypt((const uint8_t*)dataBuffer.data(), outputBuffer, ivBuffer, blockSize, &secretKey);
	retData.insert(retData.end(), outputBuffer, outputBuffer + outputSize);

	delete[] outputBuffer;
	return retData;
}

std::vector<char> SystemPlugin::dataDecrypt(const char* key, const char* data, int dataSize){
	std::vector<char> retData;
	if (dataSize == 0 || dataSize % AES_BLOCK_SIZE_BYTE){
		return retData;
	}

	//read iv
	uint8_t ivBuffer[AES_BLOCK_SIZE_BYTE];
	memcpy(ivBuffer, data, AES_BLOCK_SIZE_BYTE);

	//decrypt
	int encyrptSize = dataSize - AES_BLOCK_SIZE_BYTE;
	int blockSize = encyrptSize / AES_BLOCK_SIZE_BYTE;
	aes_ks_t secretKey;
	aes_setks_decrypt((const uint8_t*)key, AES_BLOCK_SIZE_BIT, &secretKey);
	uint8_t* outputBuffer = new uint8_t[encyrptSize];
	aes_cbc_decrypt((const uint8_t*)(data + AES_BLOCK_SIZE_BYTE), outputBuffer, ivBuffer, blockSize, &secretKey);

	//remove padding
	uint8_t lastByte = outputBuffer[encyrptSize - 1];
	int flag = 1;
	for (int i = encyrptSize - 2; i >= 0; i--){
		if (outputBuffer[i] == lastByte){
			flag++;
		}
		else{
			break;
		}
	}
	if (flag == lastByte){
		encyrptSize -= flag;
	}
	
	retData.insert(retData.end(), outputBuffer, outputBuffer + encyrptSize);
	delete[] outputBuffer;
	return retData;
}

std::string SystemPlugin::dataEncryptBase64(const char* key, const std::string& plainText){
	std::vector<char> buffer = this->dataEncrypt(key, plainText.data(), plainText.size());
	return base64_encode((const unsigned char*)buffer.data(), (unsigned int)buffer.size());;
}

std::string SystemPlugin::dataDecryptBase64(const char* key, const std::string& encryptText){
	std::string bytesData = base64_decode(encryptText);
	std::vector<char> buffer = this->dataDecrypt(key, bytesData.data(), bytesData.size());
	return std::string(buffer.data(), buffer.size());
}

std::string SystemPlugin::URLEncode(const std::string& data){
	std::string pRet = "";

	for (int i = 0; i<data.size(); i++){
		if (('0' <= data[i] && data[i] <= '9') ||
			('a' <= data[i] && data[i] <= 'z') ||
			('A' <= data[i] && data[i] <= 'Z') ||
			(data[i] == '-' || data[i] == '_' || data[i] == '.' || data[i] == '~')){
			pRet.append(&data[i], 1);
		}
		else{
			//to hext
			pRet.append("%");
			char dig1 = (data[i] & 0xF0) >> 4;
			char dig2 = (data[i] & 0x0F);
			pRet.append(&HEX_CHAR[dig1], 1);
			pRet.append(&HEX_CHAR[dig2], 1);
		}
	}

	return pRet;
}

std::string SystemPlugin::URLDecode(const std::string& data){
	std::string pRet = "";
	char dig1, dig2;

	for (int i = 0; i<data.size();){
		if (data[i] == '%'){
			dig1 = data[i + 1];
			dig2 = data[i + 2];
			if (_isxdigit(dig1) && _isxdigit(dig2)){
				dig1 = _charxtoint(dig1);
				dig2 = _charxtoint(dig2);
				pRet.append(16 * dig1 + dig2, 1);
			}
		}
		else{
			i++;
		}
	}

	return pRet;
}

std::string SystemPlugin::md5(const std::string& raw){
	return "";
}

std::string SystemPlugin::sha1(const std::string& raw){
	return "";
}

void SystemPlugin::addSoftKeyboardDelegate(SoftKeyboardDelegate* delegate){
	_keyboardDelegate.push_back(delegate);
}

void SystemPlugin::removeSoftKeyboardDelegate(SoftKeyboardDelegate* delegate){
	_keyboardDelegate.erase(std::remove(_keyboardDelegate.begin(), _keyboardDelegate.end(), delegate));
}

void SystemPlugin::startLaucher(){
	GameLaucher::getInstance()->run();
}

bool SystemPlugin::checkFileValidate(const std::string& file){
	return GameLaucher::getInstance()->checkFileValidate(file);
}

void SystemPlugin::exitApp(){
	Director::getInstance()->end();
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS) || (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
	exit(0);
#endif
}

size_t s_download_save_file_method(void *ptr, size_t size, size_t nmemb, FILE *fp){
	size_t written = fwrite(ptr, size, nmemb, fp);
	return written;
}

void s_download_file_thread(const std::string url, const std::string savePath, std::function<void(int)> finishedCallback){
	CURL *curl;
	curl = curl_easy_init();
	if (curl != NULL) {
		FILE *fp;
		fp = fopen(savePath.c_str(), "wb");
		if (fp != NULL) {
			curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
			curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, true);
			curl_easy_setopt(curl, CURLOPT_AUTOREFERER, true);
			curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 10);
			curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_TIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, true);
			curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, s_download_save_file_method);
			curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
			CURLcode res = curl_easy_perform(curl);
			long responseCode;
			CURLcode code = curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &responseCode);
			curl_easy_cleanup(curl);

			fclose(fp);
			if (res == CURLE_OK) {
				if (code == CURLE_OK && responseCode >= 200 && responseCode <= 300){
					CCLOG("download file OK : %s", url.c_str());
					if (finishedCallback){
						Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
							finishedCallback(0);
						});
					}
					return;
				}
				else{
					CCLOG("download file network error[%d]: %s", res, curl_easy_strerror(code));
					if (finishedCallback){
						Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
							finishedCallback(1);
						});
					}
				}
			}
			else{				
				
				CCLOG("download file network error[%d]: %s", res, url.c_str());
				if (finishedCallback){
					Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
						finishedCallback(1);
					});
				}
				return;
			}
		}
		else{
			CCLOG("download file network error: %s [cannot open filePath: %s]", url.c_str(), savePath.c_str());
			if (finishedCallback){
				Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
					finishedCallback(2);
				});
			}
			return;
		}
	}
	CCLOG("download file network error: %s [cannot init curl]", url.c_str());
	if (finishedCallback){
		Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
			finishedCallback(3);
		});
	}
	return;
}

void SystemPlugin::downloadFileAsync(const std::string& url, const std::string& savePath, std::function<void(int)> finishedCallback){
	std::string saveFilePath = savePath;
	if (!FileUtils::getInstance()->isAbsolutePath(saveFilePath)){
		saveFilePath = FileUtils::getInstance()->getWritablePath() + saveFilePath;
	}
	CCLOG("download to: %s", saveFilePath.c_str());
	size_t n = saveFilePath.find_last_of("/");
	std::string parentFolder = saveFilePath.substr(0, n);
	if (!FileUtils::getInstance()->isDirectoryExist(parentFolder)){
		FileUtils::getInstance()->createDirectory(parentFolder);
	}
	std::thread downloadThread(s_download_file_thread, url, saveFilePath, finishedCallback);
	downloadThread.detach();
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
