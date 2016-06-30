#include "base/ccConfig.h"
#ifndef __quyetnd_facebook_plugin_h__
#define __quyetnd_facebook_plugin_h__

#include "jsapi.h"
#include "jsfriendapi.h"
#include <string>

void js_register_quyetnd_facebook_plugin(JSContext *cx, JS::HandleObject global);
void register_all_quyetnd_facebook_plugin(JSContext* cx, JS::HandleObject obj);

void jsb_quyetnd_facebook_plugin_login(JSContext *cx, uint32_t argc, jsval *vp);


#endif // __quyetnd_facebook_plugin_h__
