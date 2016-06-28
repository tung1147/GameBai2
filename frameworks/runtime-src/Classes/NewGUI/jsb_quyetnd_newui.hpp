#include "base/ccConfig.h"
#ifndef __quyetnd_newui_h__
#define __quyetnd_newui_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_quyetnd_TableView_class;
extern JSObject *jsb_quyetnd_TableView_prototype;

bool js_quyetnd_newui_TableView_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_quyetnd_newui_TableView_finalize(JSContext *cx, JSObject *obj);
void js_register_quyetnd_newui_TableView(JSContext *cx, JS::HandleObject global);
void register_all_quyetnd_newui(JSContext* cx, JS::HandleObject obj);
bool js_quyetnd_newui_TableView_removeAllChildren(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_removeChild(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_size(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_jumpToBottom(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_getMarginBottom(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_setDirection(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_jumpToTop(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_runMoveEffect(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_initWithSize(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_setPadding(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_removeAllItems(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_insertItem(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_getMarginTop(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_removeAllChildrenWithCleanup(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_getMarginRight(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_setMargin(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_getItem(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_removeItem(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_setAnimationHandler(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_pushItem(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_getMarginLeft(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_jumpToLeft(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_forceRefreshView(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_refreshView(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_jumpToRight(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_TableView_TableView(JSContext *cx, uint32_t argc, jsval *vp);


/**/
extern JSClass  *jsb_quyetnd_EditBox_class;
extern JSObject *jsb_quyetnd_EditBox_prototype;

bool js_quyetnd_newui_EditBox_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_quyetnd_newui_EditBox_finalize(JSContext *cx, JSObject *obj);
void js_register_quyetnd_newui_EditBox(JSContext *cx, JS::HandleObject global);
bool js_quyetnd_newui_EditBox_initWithSize(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_EditBox_setBackgoundMargin(JSContext *cx, uint32_t argc, jsval *vp);
bool js_quyetnd_newui_EditBox_EditBox(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __quyetnd_newui_h__
