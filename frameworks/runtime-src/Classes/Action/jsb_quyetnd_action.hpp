#include "base/ccConfig.h"
#ifndef __quyetnd_action_h__
#define __quyetnd_action_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_quyetnd_ActionNumberCount_class;
extern JSObject *jsb_quyetnd_ActionNumberCount_prototype;

bool js_quyetnd_action_ActionNumberCount_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_quyetnd_action_ActionNumberCount_finalize(JSContext *cx, JSObject *obj);
void js_register_quyetnd_action_ActionNumberCount(JSContext *cx, JS::HandleObject global);
void register_all_quyetnd_action(JSContext* cx, JS::HandleObject obj);
bool js_quyetnd_action_ActionNumberCount_startWithTarget(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_action_ActionNumberCount_initWithCount(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_action_ActionNumberCount_setFormatType(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_action_ActionNumberCount_ActionNumberCount(JSContext *cx, uint32_t argc, jsval *vp);

extern JSClass  *jsb_quyetnd_ActionShake2D_class;
extern JSObject *jsb_quyetnd_ActionShake2D_prototype;

bool js_quyetnd_action_ActionShake2D_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_quyetnd_action_ActionShake2D_finalize(JSContext *cx, JSObject *obj);
void js_register_quyetnd_action_ActionShake2D(JSContext *cx, JS::HandleObject global);
void register_all_quyetnd_action(JSContext* cx, JS::HandleObject obj);
bool js_quyetnd_action_ActionShake2D_startWithTarget(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_action_ActionShake2D_stop(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_action_ActionShake2D_initWithDuration(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_action_ActionShake2D_ActionShake2D(JSContext *cx, uint32_t argc, jsval *vp);


extern JSClass  *jsb_quyetnd_CustomAction_class;
extern JSObject *jsb_quyetnd_CustomAction_prototype;

bool js_quyetnd_action_CustomAction_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_quyetnd_action_CustomAction_finalize(JSContext *cx, JSObject *obj);
void js_register_quyetnd_action_CustomAction(JSContext *cx, JS::HandleObject global);
bool js_quyetnd_action_CustomAction_initCustomAction(JSContext *cx, uint32_t argc, jsval *vp);
//bool js_quyetnd_action_CustomAction_startWithTarget(JSContext *cx, uint32_t argc, jsval *vp);
//bool js_quyetnd_action_CustomAction_update(JSContext *cx, uint32_t argc, jsval *vp);
//bool js_quyetnd_action_CustomAction_stop(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __quyetnd_action_h__
