#include "base/ccConfig.h"
#ifndef __quyetnd_sfssocket_h__
#define __quyetnd_sfssocket_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_quyetnd_SmartfoxClient_class;
extern JSObject *jsb_quyetnd_SmartfoxClient_prototype;

bool js_quyetnd_sfssocket_SmartfoxClient_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_quyetnd_sfssocket_SmartfoxClient_finalize(JSContext *cx, JSObject *obj);
void js_register_quyetnd_sfssocket_SmartfoxClient(JSContext *cx, JS::HandleObject global);
void register_all_quyetnd_sfssocket(JSContext* cx, JS::HandleObject obj);
bool js_quyetnd_sfssocket_SmartfoxClient_connect(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_sfssocket_SmartfoxClient_close(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_sfssocket_SmartfoxClient_getStatus(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_sfssocket_SmartfoxClient_send(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_sfssocket_SmartfoxClient_SmartfoxClient(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __quyetnd_sfssocket_h__
