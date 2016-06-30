#include "base/ccConfig.h"
#ifndef __quyetnd_lobbysocket_h__
#define __quyetnd_lobbysocket_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_quyetnd_LobbyClient_class;
extern JSObject *jsb_quyetnd_LobbyClient_prototype;

bool js_quyetnd_lobbysocket_LobbyClient_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_quyetnd_lobbysocket_LobbyClient_finalize(JSContext *cx, JSObject *obj);
void js_register_quyetnd_lobbysocket_LobbyClient(JSContext *cx, JS::HandleObject global);
void register_all_quyetnd_lobbysocket(JSContext* cx, JS::HandleObject obj);
bool js_quyetnd_lobbysocket_LobbyClient_send(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_lobbysocket_LobbyClient_connect(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_lobbysocket_LobbyClient_close(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_lobbysocket_LobbyClient_getStatus(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_lobbysocket_LobbyClient_initClientWithType(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_lobbysocket_LobbyClient_LobbyClient(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __quyetnd_lobbysocket_h__
