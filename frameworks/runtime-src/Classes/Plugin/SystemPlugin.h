/*
 * SystemPlugin.h
 *
 *  Created on: Feb 3, 2016
 *      Author: QuyetNguyen
 */

#ifndef PLUGIN_SYSTEMPLUGIN_H_
#define PLUGIN_SYSTEMPLUGIN_H_
#include <string>
#include <vector>
#include "cocos2d.h"
USING_NS_CC;

namespace quyetnd {
class SystemPlugin;
class SoftKeyboardDelegate{
	//friend SystemPlugin;
public:
	SoftKeyboardDelegate();
	virtual ~SoftKeyboardDelegate();
	virtual void onSoftKeyboardShow(float keyboardHeight);
	virtual void onSoftKeyboardHide();
};

class SystemPlugin {
	friend SoftKeyboardDelegate;
private:
	std::vector<SoftKeyboardDelegate*> _keyboardDelegate;
	void addSoftKeyboardDelegate(SoftKeyboardDelegate* delegate);
	void removeSoftKeyboardDelegate(SoftKeyboardDelegate* delegate);
public:
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	void android_onWindowsVisibleChange(int bottom ,int left, int top, int right);
#endif
public:
	SystemPlugin();
	virtual ~SystemPlugin();

    std::string getDeviceUUID(std::string nameKeyChain = "" );
    void initStore(const std::vector<std::string>& listProduct);
    void buyItem(const std::string& item);
    std::string getVersionName();
    std::string getPackageName();
    void callSupport(const std::string& numberSupport);
	void enableMipmapTexture(const std::string& textureName);

	void onBuyItemFinished(int returnCode, const std::string& signature, const std::string& json);
	void onBuyItemFinished(int returnCode, const std::string& recept);
    void onRegisterNotificationSuccess(const std::string& uid, const std::string& token);

    std::string callJSFunction(const std::string& methodName, const std::string& params);
	void callStaticVoidMethod(const std::string& className, const std::string& methodName, const std::string& params);
	std::string callStaticStringMethod(const std::string& className, const std::string& methodName, const std::string& params);

    void androidLoadExtension(const std::string& jarPath);
	bool androidCheckPermission(const std::string& permission);
	void androidRequestPermission(const std::vector<std::string>& permission, int requestCode = 1234);
	void androidOnActivityResult(int requestCode, int returnCode, const std::string& jsonData);

	void exitApp();

	/* ecnrypt*/
	std::vector<char> dataEncrypt(const char* key, const char* data, int dataSize);
	std::vector<char> dataDecrypt(const char* key, const char* data, int dataSize);
	std::string dataEncryptBase64(const char* key, const std::string& plainText);
	std::string dataDecryptBase64(const char* key, const std::string& encryptText);
	std::string URLEncode(const std::string& data);
	std::string URLDecode(const std::string& data);

	std::string md5(const std::string& raw);
	std::string sha1(const std::string& raw);

	static SystemPlugin* getInstance();
};

} /* namespace quyetnd */

#endif /* PLUGIN_SYSTEMPLUGIN_H_ */
