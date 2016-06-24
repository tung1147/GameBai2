#include "base/ccConfig.h"
#ifndef __quyetnd_systemplugin_h__
#define __quyetnd_systemplugin_h__

#include "jsapi.h"
#include "jsfriendapi.h"
#include <string>

void js_register_quyetnd_systemplugin(JSContext *cx, JS::HandleObject global);
void register_all_quyetnd_systemplugin(JSContext* cx, JS::HandleObject obj);

void jsb_quyetnd_onBuyItemFinished_Android(int returnCode, const std::string& signature, const std::string& json);
void jsb_quyetnd_onBuyItemFinished_iOS(int returnCode, const std::string& signature);

#endif // __quyetnd_systemplugin_h__
