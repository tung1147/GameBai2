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

	void onBuyItemFinished(int returnCode, const std::string& signature, const std::string& json);
	void onBuyItemFinished(int returnCode, const std::string& recept);
    void onRegisterNotificationSuccess(const std::string& uid, const std::string& token);

	static SystemPlugin* getInstance();
};

} /* namespace quyetnd */

#endif /* PLUGIN_SYSTEMPLUGIN_H_ */
