#include "jsb_quyetnd_newui.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "NewTableView.h"
#include "NewTextInput.h"
#include "NewTextField.h"
#include "NewWidget.h"
#include "ListViewWithAdapter.h"

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS_ReportError(cx, "Constructor for the requested class is not available, please refer to the API reference.");
    return false;
}

static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    return false;
}

static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().setBoolean(true);
    return true;
}
JSClass  *jsb_quyetnd_TableView_class;
JSObject *jsb_quyetnd_TableView_prototype;

bool js_quyetnd_newui_TableView_removeAllChildren(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_removeAllChildren : Invalid Native Object");
    if (argc == 0) {
        cobj->removeAllChildren();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_removeAllChildren : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_removeChild(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_removeChild : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_removeChild : Error processing arguments");
        cobj->removeChild(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        bool arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        arg1 = JS::ToBoolean(args.get(1));
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_removeChild : Error processing arguments");
        cobj->removeChild(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_removeChild : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_newui_TableView_size(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_size : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->size();
        jsval jsret = JSVAL_NULL;
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_size : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_jumpToBottom(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_jumpToBottom : Invalid Native Object");
    if (argc == 0) {
        cobj->jumpToBottom();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_jumpToBottom : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_getMarginBottom(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_getMarginBottom : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getMarginBottom();
        jsval jsret = JSVAL_NULL;
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_getMarginBottom : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_setDirection(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_setDirection : Invalid Native Object");
    if (argc == 1) {
        cocos2d::ui::ScrollView::Direction arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_setDirection : Error processing arguments");
        cobj->setDirection(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_setDirection : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_newui_TableView_jumpToTop(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_jumpToTop : Invalid Native Object");
    if (argc == 0) {
        cobj->jumpToTop();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_jumpToTop : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_runMoveEffect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_runMoveEffect : Invalid Native Object");
    if (argc == 3) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_runMoveEffect : Error processing arguments");
        cobj->runMoveEffect(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_runMoveEffect : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_quyetnd_newui_TableView_initWithSize(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_initWithSize : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Size arg0;
        int arg1 = 0;
        ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_initWithSize : Error processing arguments");
        cobj->initWithSize(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_initWithSize : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_quyetnd_newui_TableView_setPadding(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_setPadding : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_setPadding : Error processing arguments");
        cobj->setPadding(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_setPadding : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_newui_TableView_removeAllItems(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_removeAllItems : Invalid Native Object");
    if (argc == 0) {
        cobj->removeAllItems();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_removeAllItems : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_insertItem(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_insertItem : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        int arg1 = 0;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_insertItem : Error processing arguments");
        cobj->insertItem(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_insertItem : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_quyetnd_newui_TableView_getMarginTop(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_getMarginTop : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getMarginTop();
        jsval jsret = JSVAL_NULL;
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_getMarginTop : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_removeAllChildrenWithCleanup(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_removeAllChildrenWithCleanup : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_removeAllChildrenWithCleanup : Error processing arguments");
        cobj->removeAllChildrenWithCleanup(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_removeAllChildrenWithCleanup : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_newui_TableView_getMarginRight(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_getMarginRight : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getMarginRight();
        jsval jsret = JSVAL_NULL;
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_getMarginRight : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_setMargin(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_setMargin : Invalid Native Object");
    if (argc == 4) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        double arg3 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_setMargin : Error processing arguments");
        cobj->setMargin(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_setMargin : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_quyetnd_newui_TableView_getItem(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_getItem : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_getItem : Error processing arguments");
        cocos2d::Node* ret = cobj->getItem(arg0);
        jsval jsret = JSVAL_NULL;
        if (ret) {
            jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<cocos2d::Node>(cx, (cocos2d::Node*)ret));
        } else {
            jsret = JSVAL_NULL;
        };
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_getItem : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_newui_TableView_removeItem(JSContext *cx, uint32_t argc, jsval *vp)
{
    bool ok = true;
    quyetnd::TableView* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_removeItem : Invalid Native Object");
    do {
        if (argc == 1) {
            int arg0 = 0;
            ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
            if (!ok) { ok = true; break; }
            cobj->removeItem(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        if (argc == 1) {
            cocos2d::Node* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(tmpObj);
                arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cobj->removeItem(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_quyetnd_newui_TableView_removeItem : wrong number of arguments");
    return false;
}
bool js_quyetnd_newui_TableView_setAnimationHandler(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_setAnimationHandler : Invalid Native Object");
    if (argc == 1) {
        std::function<void (int, cocos2d::Node *)> arg0;
        do {
		    if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(0), args.thisv()));
		        auto lambda = [=](int larg0, cocos2d::Node* larg1) -> void {
		            JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
		            jsval largv[2];
		            largv[0] = int32_to_jsval(cx, larg0);
		            if (larg1) {
		            largv[1] = OBJECT_TO_JSVAL(js_get_or_create_jsobject<cocos2d::Node>(cx, (cocos2d::Node*)larg1));
		        } else {
		            largv[1] = JSVAL_NULL;
		        };
		            JS::RootedValue rval(cx);
		            bool succeed = func->invoke(2, &largv[0], &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                JS_ReportPendingException(cx);
		            }
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_setAnimationHandler : Error processing arguments");
        cobj->setAnimationHandler(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_setAnimationHandler : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_newui_TableView_pushItem(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_pushItem : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TableView_pushItem : Error processing arguments");
        cobj->pushItem(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_pushItem : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_newui_TableView_getMarginLeft(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_getMarginLeft : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getMarginLeft();
        jsval jsret = JSVAL_NULL;
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_getMarginLeft : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_jumpToLeft(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_jumpToLeft : Invalid Native Object");
    if (argc == 0) {
        cobj->jumpToLeft();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_jumpToLeft : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_forceRefreshView(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_forceRefreshView : Invalid Native Object");
    if (argc == 0) {
        cobj->forceRefreshView();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_forceRefreshView : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_newui_TableView_refreshView(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_refreshView : Invalid Native Object");
    if (argc == 0) {
        cobj->refreshView();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_refreshView : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_quyetnd_newui_TableView_jumpToRight(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_newui_TableView_jumpToRight : Invalid Native Object");
    if (argc == 0) {
        cobj->jumpToRight();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_newui_TableView_jumpToRight : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_quyetnd_newui_TableView_setReverse(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TableView* cobj = (quyetnd::TableView *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TableView_setReverse : Invalid Native Object");
	if (argc == 1) {
		bool reverse = JS::ToBoolean(args.get(0));;
		cobj->setReverse(reverse);

		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TableView_setReverse : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}

bool js_quyetnd_newui_TableView_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    quyetnd::TableView* cobj = new (std::nothrow) quyetnd::TableView();

    js_type_class_t *typeClass = js_get_type_from_native<quyetnd::TableView>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "quyetnd::TableView"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}
static bool js_quyetnd_newui_TableView_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    quyetnd::TableView *nobj = new (std::nothrow) quyetnd::TableView();
    auto newproxy = jsb_new_proxy(nobj, obj);
    jsb_ref_init(cx, &newproxy->obj, nobj, "quyetnd::TableView");
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    args.rval().setUndefined();
    return true;
}


extern JSObject *jsb_cocos2d_ui_ScrollView_prototype;

    
void js_register_quyetnd_newui_TableView(JSContext *cx, JS::HandleObject global) {
    jsb_quyetnd_TableView_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_quyetnd_TableView_class->name = "TableView";
    jsb_quyetnd_TableView_class->addProperty = JS_PropertyStub;
    jsb_quyetnd_TableView_class->delProperty = JS_DeletePropertyStub;
    jsb_quyetnd_TableView_class->getProperty = JS_PropertyStub;
    jsb_quyetnd_TableView_class->setProperty = JS_StrictPropertyStub;
    jsb_quyetnd_TableView_class->enumerate = JS_EnumerateStub;
    jsb_quyetnd_TableView_class->resolve = JS_ResolveStub;
    jsb_quyetnd_TableView_class->convert = JS_ConvertStub;
    jsb_quyetnd_TableView_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("removeAllChildren", js_quyetnd_newui_TableView_removeAllChildren, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeChild", js_quyetnd_newui_TableView_removeChild, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("size", js_quyetnd_newui_TableView_size, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("jumpToBottom", js_quyetnd_newui_TableView_jumpToBottom, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMarginBottom", js_quyetnd_newui_TableView_getMarginBottom, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDirection", js_quyetnd_newui_TableView_setDirection, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("jumpToTop", js_quyetnd_newui_TableView_jumpToTop, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("runMoveEffect", js_quyetnd_newui_TableView_runMoveEffect, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithSize", js_quyetnd_newui_TableView_initWithSize, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setPadding", js_quyetnd_newui_TableView_setPadding, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeAllItems", js_quyetnd_newui_TableView_removeAllItems, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("insertItem", js_quyetnd_newui_TableView_insertItem, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMarginTop", js_quyetnd_newui_TableView_getMarginTop, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeAllChildrenWithCleanup", js_quyetnd_newui_TableView_removeAllChildrenWithCleanup, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMarginRight", js_quyetnd_newui_TableView_getMarginRight, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMargin", js_quyetnd_newui_TableView_setMargin, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getItem", js_quyetnd_newui_TableView_getItem, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeItem", js_quyetnd_newui_TableView_removeItem, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setAnimationHandler", js_quyetnd_newui_TableView_setAnimationHandler, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushItem", js_quyetnd_newui_TableView_pushItem, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMarginLeft", js_quyetnd_newui_TableView_getMarginLeft, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("jumpToLeft", js_quyetnd_newui_TableView_jumpToLeft, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("forceRefreshView", js_quyetnd_newui_TableView_forceRefreshView, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("refreshView", js_quyetnd_newui_TableView_refreshView, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("jumpToRight", js_quyetnd_newui_TableView_jumpToRight, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setReverse", js_quyetnd_newui_TableView_setReverse, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_quyetnd_newui_TableView_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),

        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    JS::RootedObject parent_proto(cx, jsb_cocos2d_ui_ScrollView_prototype);
    jsb_quyetnd_TableView_prototype = JS_InitClass(
        cx, global,
        parent_proto,
        jsb_quyetnd_TableView_class,
        js_quyetnd_newui_TableView_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_quyetnd_TableView_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "TableView"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<quyetnd::TableView>(cx, jsb_quyetnd_TableView_class, proto, parent_proto);
    anonEvaluate(cx, global, "(function () { newui.TableView.extend = cc.Class.extend; })()");
}

void register_all_quyetnd_newui(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "newui", &ns);

    js_register_quyetnd_newui_TableView(cx, ns);
	js_register_quyetnd_newui_EditBox(cx, ns);
	js_register_quyetnd_newui_TextField(cx, ns);	
	js_register_quyetnd_newui_Widget(cx, ns);
	js_register_quyetnd_newui_ListViewWithAdaptor(cx, ns);
}

/****/
JSClass  *jsb_quyetnd_EditBox_class;
JSObject *jsb_quyetnd_EditBox_prototype;

bool js_quyetnd_newui_EditBox_initWithSize(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::EditBox* cobj = (quyetnd::EditBox *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_EditBox_initWithSize : Invalid Native Object");
	if (argc == 1) {
		cocos2d::Size arg0;
		ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_EditBox_initWithSize : Error processing arguments");
		bool ret = cobj->initWithSize(arg0);
		jsval jsret = JSVAL_NULL;
		jsret = BOOLEAN_TO_JSVAL(ret);
		args.rval().set(jsret);
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_EditBox_initWithSize : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}
bool js_quyetnd_newui_EditBox_setBackgoundMargin(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::EditBox* cobj = (quyetnd::EditBox *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_EditBox_setBackgoundMargin : Invalid Native Object");
	if (argc == 4) {
		double arg0 = 0;
		double arg1 = 0;
		double arg2 = 0;
		double arg3 = 0;
		ok &= JS::ToNumber(cx, args.get(0), &arg0) && !std::isnan(arg0);
		ok &= JS::ToNumber(cx, args.get(1), &arg1) && !std::isnan(arg1);
		ok &= JS::ToNumber(cx, args.get(2), &arg2) && !std::isnan(arg2);
		ok &= JS::ToNumber(cx, args.get(3), &arg3) && !std::isnan(arg3);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_EditBox_setBackgoundMargin : Error processing arguments");
		cobj->setBackgoundMargin(arg0, arg1, arg2, arg3);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_EditBox_setBackgoundMargin : wrong number of arguments: %d, was expecting %d", argc, 4);
	return false;
}
bool js_quyetnd_newui_EditBox_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	quyetnd::EditBox* cobj = new (std::nothrow) quyetnd::EditBox();

	js_type_class_t *typeClass = js_get_type_from_native<quyetnd::EditBox>(cobj);

	// link the native object with the javascript object
	JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "quyetnd::EditBox"));
	args.rval().set(OBJECT_TO_JSVAL(jsobj));
	if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
	return true;
}
static bool js_quyetnd_newui_EditBox_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	quyetnd::EditBox *nobj = new (std::nothrow) quyetnd::EditBox();
	auto newproxy = jsb_new_proxy(nobj, obj);
	jsb_ref_init(cx, &newproxy->obj, nobj, "quyetnd::EditBox");
	bool isFound = false;
	if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
	args.rval().setUndefined();
	return true;
}


extern JSObject *jsb_cocos2d_ui_EditBox_prototype;


void js_register_quyetnd_newui_EditBox(JSContext *cx, JS::HandleObject global) {
	jsb_quyetnd_EditBox_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_quyetnd_EditBox_class->name = "EditBox";
	jsb_quyetnd_EditBox_class->addProperty = JS_PropertyStub;
	jsb_quyetnd_EditBox_class->delProperty = JS_DeletePropertyStub;
	jsb_quyetnd_EditBox_class->getProperty = JS_PropertyStub;
	jsb_quyetnd_EditBox_class->setProperty = JS_StrictPropertyStub;
	jsb_quyetnd_EditBox_class->enumerate = JS_EnumerateStub;
	jsb_quyetnd_EditBox_class->resolve = JS_ResolveStub;
	jsb_quyetnd_EditBox_class->convert = JS_ConvertStub;
	jsb_quyetnd_EditBox_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	static JSPropertySpec properties[] = {
		JS_PS_END
	};

	static JSFunctionSpec funcs[] = {
		JS_FN("initWithSize", js_quyetnd_newui_EditBox_initWithSize, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setBackgoundMargin", js_quyetnd_newui_EditBox_setBackgoundMargin, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("ctor", js_quyetnd_newui_EditBox_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	JSFunctionSpec *st_funcs = NULL;

	JS::RootedObject parent_proto(cx, jsb_cocos2d_ui_EditBox_prototype);
	jsb_quyetnd_EditBox_prototype = JS_InitClass(
		cx, global,
		parent_proto,
		jsb_quyetnd_EditBox_class,
		js_quyetnd_newui_EditBox_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);

	JS::RootedObject proto(cx, jsb_quyetnd_EditBox_prototype);
	JS::RootedValue className(cx, std_string_to_jsval(cx, "EditBox"));
	JS_SetProperty(cx, proto, "_className", className);
	JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
	JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
	// add the proto and JSClass to the type->js info hash table
	jsb_register_class<quyetnd::EditBox>(cx, jsb_quyetnd_EditBox_class, proto, parent_proto);
	anonEvaluate(cx, global, "(function () { newui.EditBox.extend = cc.Class.extend; })()");
}

/****/

JSClass  *jsb_quyetnd_TextField_class;
JSObject *jsb_quyetnd_TextField_prototype;

bool js_quyetnd_newui_TextField_setPasswordEnable(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setPasswordEnable : Invalid Native Object");
	if (argc == 1) {
		bool arg0;
		arg0 = JS::ToBoolean(args.get(0));
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_setPasswordEnable : Error processing arguments");
		cobj->setPasswordEnable(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setPasswordEnable : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}
bool js_quyetnd_newui_TextField_setText(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setText : Invalid Native Object");
	if (argc == 1) {
		std::string arg0;
		ok &= jsval_to_std_string(cx, args.get(0), &arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_setText : Error processing arguments");
		cobj->setText(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setText : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_newui_TextField_setReturnCallback(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setReturnCallback : Invalid Native Object");
	if (argc == 1) {
		std::function<bool(quyetnd::TextField *)> arg0;
		do {
			if (JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
			{
				JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
				std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(0), args.thisv()));
				auto lambda = [=](quyetnd::TextField* larg0) -> bool {
					JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
						jsval largv[1];
					if (larg0) {
						largv[0] = OBJECT_TO_JSVAL(js_get_or_create_jsobject<quyetnd::TextField>(cx, (quyetnd::TextField*)larg0));
					}
					else {
						largv[0] = JSVAL_NULL;
					};
					JS::RootedValue rval(cx);
					bool succeed = func->invoke(1, &largv[0], &rval);
					if (!succeed && JS_IsExceptionPending(cx)) {
						JS_ReportPendingException(cx);
					}
					
					if (rval.isNullOrUndefined()){
						return false;
					}
					else{
						bool ret;
						ret = JS::ToBoolean(rval);
						return ret;
					}
					return false;
				};
				arg0 = lambda;
			}
			else
			{
				arg0 = nullptr;
			}
		} while (0)
			;
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_setReturnCallback : Error processing arguments");
		cobj->setReturnCallback(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setReturnCallback : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_newui_TextField_setFocusListener(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setFocusListener : Invalid Native Object");
	if (argc == 1) {
		std::function<void(bool)> arg0;
		do {
			if (JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
			{
				JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
				std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(0), args.thisv()));
				auto lambda = [=](bool larg0) -> void {
					JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
						jsval largv[1];
					largv[0] = BOOLEAN_TO_JSVAL(larg0);
					JS::RootedValue rval(cx);
					bool succeed = func->invoke(1, &largv[0], &rval);
					if (!succeed && JS_IsExceptionPending(cx)) {
						JS_ReportPendingException(cx);
					}
				};
				arg0 = lambda;
			}
			else{
				arg0 = nullptr;
			}
		} while (0);

		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_setFocusListener : Error processing arguments");
		cobj->setFocusListener(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setFocusListener : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_newui_TextField_setTextChangeListener(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setTextChangeListener : Invalid Native Object");
	if (argc == 1) {
		std::function<bool(int, const std::string&)> arg0;
		do {
			if (JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION){
				JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
				std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(0), args.thisv()));
				auto lambda = [=](int type, const std::string& newString) -> bool {
					JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
					JS::RootedValue rval(cx);

					jsval largv[2];
					largv[0] = int32_to_jsval(cx, type);
					largv[1] = std_string_to_jsval(cx, newString);
					bool succeed = func->invoke(2, &largv[0], &rval);

					if (!succeed && JS_IsExceptionPending(cx)) {
						JS_ReportPendingException(cx);
					}
					if (rval.isNullOrUndefined()){
						return false;
					}
					else{
						bool ret;
						ret = JS::ToBoolean(rval);
						return ret;
					}
					return false;
				};
				arg0 = lambda;
			}
			else{
				arg0 = nullptr;
			}
		} while (0);

		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_setTextChangeListener : Error processing arguments");
		cobj->setTextChangeListener(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setTextChangeListener : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_newui_TextField_getText(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_getText : Invalid Native Object");
	if (argc == 0) {
		const std::string& ret = cobj->getText();
		jsval jsret = JSVAL_NULL;
		jsret = std_string_to_jsval(cx, ret);
		args.rval().set(jsret);
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_getText : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
bool js_quyetnd_newui_TextField_initWithBMFont(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_initWithBMFont : Invalid Native Object");
	if (argc == 2) {
		cocos2d::Size arg0;
		std::string arg1;
		ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
		ok &= jsval_to_std_string(cx, args.get(1), &arg1);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_initWithBMFont : Error processing arguments");
		cobj->initWithBMFont(arg0, arg1);
		args.rval().setUndefined();
		return true;
	}
	if (argc == 3) {
		cocos2d::Size arg0;
		std::string arg1;
		std::string arg2;
		ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
		ok &= jsval_to_std_string(cx, args.get(1), &arg1);
		ok &= jsval_to_std_string(cx, args.get(2), &arg2);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_initWithBMFont : Error processing arguments");
		cobj->initWithBMFont(arg0, arg1, arg2);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_initWithBMFont : wrong number of arguments: %d, was expecting %d", argc, 2);
	return false;
}
bool js_quyetnd_newui_TextField_setMaxLength(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setMaxLength : Invalid Native Object");
	if (argc == 1) {
		int arg0 = 0;
		ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_setMaxLength : Error processing arguments");
		cobj->setMaxLength(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setMaxLength : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}
bool js_quyetnd_newui_TextField_setPlaceHolder(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setPlaceHolder : Invalid Native Object");
	if (argc == 1) {
		std::string arg0;
		ok &= jsval_to_std_string(cx, args.get(0), &arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_setPlaceHolder : Error processing arguments");
		cobj->setPlaceHolder(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setPlaceHolder : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}
bool js_quyetnd_newui_TextField_initWithTTFFont(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_initWithTTFFont : Invalid Native Object");
	if (argc == 3) {
		cocos2d::Size arg0;
		std::string arg1;
		double arg2 = 0;
		ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
		ok &= jsval_to_std_string(cx, args.get(1), &arg1);
		ok &= JS::ToNumber(cx, args.get(2), &arg2) && !std::isnan(arg2);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_initWithTTFFont : Error processing arguments");
		cobj->initWithTTFFont(arg0, arg1, arg2);
		args.rval().setUndefined();
		return true;
	}
	if (argc == 4) {
		cocos2d::Size arg0;
		std::string arg1;
		double arg2 = 0;
		std::string arg3;
		ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
		ok &= jsval_to_std_string(cx, args.get(1), &arg1);
		ok &= JS::ToNumber(cx, args.get(2), &arg2) && !std::isnan(arg2);
		ok &= jsval_to_std_string(cx, args.get(3), &arg3);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_initWithTTFFont : Error processing arguments");
		cobj->initWithTTFFont(arg0, arg1, arg2, arg3);
		args.rval().setUndefined();
		return true;
	}
	if (argc == 5) {
		cocos2d::Size arg0;
		std::string arg1;
		double arg2 = 0;
		std::string arg3;
		double arg4 = 0;
		ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
		ok &= jsval_to_std_string(cx, args.get(1), &arg1);
		ok &= JS::ToNumber(cx, args.get(2), &arg2) && !std::isnan(arg2);
		ok &= jsval_to_std_string(cx, args.get(3), &arg3);
		ok &= JS::ToNumber(cx, args.get(4), &arg4) && !std::isnan(arg4);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_initWithTTFFont : Error processing arguments");
		cobj->initWithTTFFont(arg0, arg1, arg2, arg3, arg4);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_initWithTTFFont : wrong number of arguments: %d, was expecting %d", argc, 3);
	return false;
}
bool js_quyetnd_newui_TextField_initWithSize(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_initWithSize : Invalid Native Object");
	if (argc == 1) {
		cocos2d::Size arg0;
		ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_initWithSize : Error processing arguments");
		cobj->initWithSize(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_initWithSize : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_newui_TextField_showKeyboard(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_showKeyboard : Invalid Native Object");
	if (argc == 0) {
		cobj->showKeyboard();
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_showKeyboard : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_newui_TextField_hideKeyboard(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_hideKeyboard : Invalid Native Object");
	if (argc == 0) {
		cobj->hideKeyboard();
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_hideKeyboard : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_newui_TextField_setAlignment(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setAlignment : Invalid Native Object");
	if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_TextField_setAlignment : Error processing arguments");
		cobj->setAlignment(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setAlignment : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_newui_TextField_setEnable(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::TextField* cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setEnable : Invalid Native Object");
	if (argc == 1) {
		bool arg0 = JS::ToBoolean(args.get(0));
		cobj->setEnable(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setEnable : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_newui_TextField_setPlaceHolderColor(JSContext *cx, uint32_t argc, jsval *vp)
{
	bool ok = true;
	quyetnd::TextField* cobj = nullptr;

	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx);
	obj.set(args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : nullptr);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setPlaceHolderColor : Invalid Native Object");
	do {
		if (argc == 1) {
			cocos2d::Color4B arg0;
			ok &= jsval_to_cccolor4b(cx, args.get(0), &arg0);
			if (!ok) { ok = true; break; }
			cobj->setPlaceHolderColor(arg0);
			args.rval().setUndefined();
			return true;
		}
	} while (0);

	do {
		if (argc == 1) {
			cocos2d::Color3B arg0;
			ok &= jsval_to_cccolor3b(cx, args.get(0), &arg0);
			if (!ok) { ok = true; break; }
			cobj->setPlaceHolderColor(arg0);
			args.rval().setUndefined();
			return true;
		}
	} while (0);

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setPlaceHolderColor : wrong number of arguments");
	return false;
}

bool js_quyetnd_newui_TextField_setTextColor(JSContext *cx, uint32_t argc, jsval *vp)
{
	bool ok = true;
	quyetnd::TextField* cobj = nullptr;

	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx);
	obj.set(args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	cobj = (quyetnd::TextField *)(proxy ? proxy->ptr : nullptr);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_TextField_setTextColor : Invalid Native Object");
	do {
		if (argc == 1) {
			cocos2d::Color4B arg0;
			ok &= jsval_to_cccolor4b(cx, args.get(0), &arg0);
			if (!ok) { ok = true; break; }
			cobj->setTextColor(arg0);
			args.rval().setUndefined();
			return true;
		}
	} while (0);

	do {
		if (argc == 1) {
			cocos2d::Color3B arg0;
			ok &= jsval_to_cccolor3b(cx, args.get(0), &arg0);
			if (!ok) { ok = true; break; }
			cobj->setTextColor(arg0);
			args.rval().setUndefined();
			return true;
		}
	} while (0);

	JS_ReportError(cx, "js_quyetnd_newui_TextField_setTextColor : wrong number of arguments");
	return false;
}
bool js_quyetnd_newui_TextField_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	quyetnd::TextField* cobj = new (std::nothrow) quyetnd::TextField();

	js_type_class_t *typeClass = js_get_type_from_native<quyetnd::TextField>(cobj);

	// link the native object with the javascript object
	JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "quyetnd::TextField"));
	args.rval().set(OBJECT_TO_JSVAL(jsobj));
	if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
	return true;
}
static bool js_quyetnd_newui_TextField_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	quyetnd::TextField *nobj = new (std::nothrow) quyetnd::TextField();
	auto newproxy = jsb_new_proxy(nobj, obj);
	jsb_ref_init(cx, &newproxy->obj, nobj, "quyetnd::TextField");
	bool isFound = false;
	if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
	args.rval().setUndefined();
	return true;
}


extern JSObject *jsb_cocos2d_Node_prototype;


void js_register_quyetnd_newui_TextField(JSContext *cx, JS::HandleObject global) {
	jsb_quyetnd_TextField_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_quyetnd_TextField_class->name = "TextField";
	jsb_quyetnd_TextField_class->addProperty = JS_PropertyStub;
	jsb_quyetnd_TextField_class->delProperty = JS_DeletePropertyStub;
	jsb_quyetnd_TextField_class->getProperty = JS_PropertyStub;
	jsb_quyetnd_TextField_class->setProperty = JS_StrictPropertyStub;
	jsb_quyetnd_TextField_class->enumerate = JS_EnumerateStub;
	jsb_quyetnd_TextField_class->resolve = JS_ResolveStub;
	jsb_quyetnd_TextField_class->convert = JS_ConvertStub;
	jsb_quyetnd_TextField_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	static JSPropertySpec properties[] = {
		JS_PS_END
	};

	static JSFunctionSpec funcs[] = {
		JS_FN("setPasswordEnable", js_quyetnd_newui_TextField_setPasswordEnable, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setText", js_quyetnd_newui_TextField_setText, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setReturnCallback", js_quyetnd_newui_TextField_setReturnCallback, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setFocusListener", js_quyetnd_newui_TextField_setFocusListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setTextChangeListener", js_quyetnd_newui_TextField_setTextChangeListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getText", js_quyetnd_newui_TextField_getText, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("initWithBMFont", js_quyetnd_newui_TextField_initWithBMFont, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setMaxLength", js_quyetnd_newui_TextField_setMaxLength, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setPlaceHolder", js_quyetnd_newui_TextField_setPlaceHolder, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("initWithTTFFont", js_quyetnd_newui_TextField_initWithTTFFont, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("initWithSize", js_quyetnd_newui_TextField_initWithSize, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setPlaceHolderColor", js_quyetnd_newui_TextField_setPlaceHolderColor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setTextColor", js_quyetnd_newui_TextField_setTextColor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("showKeyboard", js_quyetnd_newui_TextField_showKeyboard, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("hideKeyboard", js_quyetnd_newui_TextField_hideKeyboard, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setAlignment", js_quyetnd_newui_TextField_setAlignment, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setEnable", js_quyetnd_newui_TextField_setEnable, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("ctor", js_quyetnd_newui_TextField_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	JSFunctionSpec *st_funcs = NULL;

	JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype);
	jsb_quyetnd_TextField_prototype = JS_InitClass(
		cx, global,
		parent_proto,
		jsb_quyetnd_TextField_class,
		js_quyetnd_newui_TextField_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);

	JS::RootedObject proto(cx, jsb_quyetnd_TextField_prototype);
	JS::RootedValue className(cx, std_string_to_jsval(cx, "TextField"));
	JS_SetProperty(cx, proto, "_className", className);
	JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
	JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
	// add the proto and JSClass to the type->js info hash table
	jsb_register_class<quyetnd::TextField>(cx, jsb_quyetnd_TextField_class, proto, parent_proto);
	anonEvaluate(cx, global, "(function () { newui.TextField.extend = cc.Class.extend; })()");
}

/*****/

JSClass  *jsb_quyetnd_Widget_class;
JSObject *jsb_quyetnd_Widget_prototype;

bool js_quyetnd_newui_Widget_setVirtualRendererSize(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::Widget* cobj = (quyetnd::Widget *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_Widget_setVirtualRendererSize : Invalid Native Object");
	if (argc == 1) {
		cocos2d::Size arg0;
		ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_Widget_setVirtualRendererSize : Error processing arguments");
		cobj->setVirtualRendererSize(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_Widget_setVirtualRendererSize : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}
bool js_quyetnd_newui_Widget_getVirtualRendererSize(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::Widget* cobj = (quyetnd::Widget *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_Widget_getVirtualRendererSize : Invalid Native Object");
	if (argc == 0) {
		cocos2d::Size ret = cobj->getVirtualRendererSize();
		jsval jsret = JSVAL_NULL;
		jsret = ccsize_to_jsval(cx, ret);
		args.rval().set(jsret);
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_Widget_getVirtualRendererSize : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
bool js_quyetnd_newui_Widget_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	quyetnd::Widget* cobj = new (std::nothrow) quyetnd::Widget();

	js_type_class_t *typeClass = js_get_type_from_native<quyetnd::Widget>(cobj);

	// link the native object with the javascript object
	JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "quyetnd::Widget"));
	args.rval().set(OBJECT_TO_JSVAL(jsobj));
	if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
	return true;
}
static bool js_quyetnd_newui_Widget_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	quyetnd::Widget *nobj = new (std::nothrow) quyetnd::Widget();
	auto newproxy = jsb_new_proxy(nobj, obj);
	jsb_ref_init(cx, &newproxy->obj, nobj, "quyetnd::Widget");
	bool isFound = false;
	if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
	args.rval().setUndefined();
	return true;
}


extern JSObject *jsb_cocos2d_ui_Widget_prototype;


void js_register_quyetnd_newui_Widget(JSContext *cx, JS::HandleObject global) {
	jsb_quyetnd_Widget_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_quyetnd_Widget_class->name = "Widget";
	jsb_quyetnd_Widget_class->addProperty = JS_PropertyStub;
	jsb_quyetnd_Widget_class->delProperty = JS_DeletePropertyStub;
	jsb_quyetnd_Widget_class->getProperty = JS_PropertyStub;
	jsb_quyetnd_Widget_class->setProperty = JS_StrictPropertyStub;
	jsb_quyetnd_Widget_class->enumerate = JS_EnumerateStub;
	jsb_quyetnd_Widget_class->resolve = JS_ResolveStub;
	jsb_quyetnd_Widget_class->convert = JS_ConvertStub;
	jsb_quyetnd_Widget_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	static JSPropertySpec properties[] = {
		JS_PS_END
	};

	static JSFunctionSpec funcs[] = {
		JS_FN("setVirtualRendererSize", js_quyetnd_newui_Widget_setVirtualRendererSize, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getVirtualRendererSize", js_quyetnd_newui_Widget_getVirtualRendererSize, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("ctor", js_quyetnd_newui_Widget_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	JSFunctionSpec *st_funcs = NULL;

	JS::RootedObject parent_proto(cx, jsb_cocos2d_ui_Widget_prototype);
	jsb_quyetnd_Widget_prototype = JS_InitClass(
		cx, global,
		parent_proto,
		jsb_quyetnd_Widget_class,
		js_quyetnd_newui_Widget_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);

	JS::RootedObject proto(cx, jsb_quyetnd_Widget_prototype);
	JS::RootedValue className(cx, std_string_to_jsval(cx, "Widget"));
	JS_SetProperty(cx, proto, "_className", className);
	JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
	JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
	// add the proto and JSClass to the type->js info hash table
	jsb_register_class<quyetnd::Widget>(cx, jsb_quyetnd_Widget_class, proto, parent_proto);
	anonEvaluate(cx, global, "(function () { newui.Widget.extend = cc.Class.extend; })()");
}

//**

JSClass  *jsb_quyetnd_ListViewWithAdaptor_class;
JSObject *jsb_quyetnd_ListViewWithAdaptor_prototype;

bool js_quyetnd_newui_ListViewWithAdaptor_setItemAdaptor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::ListViewWithAdaptor* cobj = (quyetnd::ListViewWithAdaptor *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setItemAdaptor : Invalid Native Object");
	if (argc == 1) {
		std::function<void(int, cocos2d::Node *)> arg0;
		do {
			if (JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
			{
				JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
				std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(0), args.thisv()));
				auto lambda = [=](int larg0, cocos2d::Node* larg1) -> void {
					JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
						jsval largv[2];
					largv[0] = int32_to_jsval(cx, larg0);
					if (larg1) {
						largv[1] = OBJECT_TO_JSVAL(js_get_or_create_jsobject<cocos2d::Node>(cx, (cocos2d::Node*)larg1));
					}
					else {
						largv[1] = JSVAL_NULL;
					};
					JS::RootedValue rval(cx);
					bool succeed = func->invoke(2, &largv[0], &rval);
					if (!succeed && JS_IsExceptionPending(cx)) {
						JS_ReportPendingException(cx);
					}
				};
				arg0 = lambda;
			}
			else
			{
				arg0 = nullptr;
			}
		} while (0)
			;
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setItemAdaptor : Error processing arguments");
		cobj->setItemAdaptor(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_ListViewWithAdaptor_setItemAdaptor : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}
bool js_quyetnd_newui_ListViewWithAdaptor_refreshView(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::ListViewWithAdaptor* cobj = (quyetnd::ListViewWithAdaptor *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_refreshView : Invalid Native Object");
	if (argc == 0) {
		cobj->refreshView();
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_ListViewWithAdaptor_refreshView : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
bool js_quyetnd_newui_ListViewWithAdaptor_setMargin(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::ListViewWithAdaptor* cobj = (quyetnd::ListViewWithAdaptor *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setMargin : Invalid Native Object");
	if (argc == 4) {
		double arg0 = 0;
		double arg1 = 0;
		double arg2 = 0;
		double arg3 = 0;
		ok &= JS::ToNumber(cx, args.get(0), &arg0) && !std::isnan(arg0);
		ok &= JS::ToNumber(cx, args.get(1), &arg1) && !std::isnan(arg1);
		ok &= JS::ToNumber(cx, args.get(2), &arg2) && !std::isnan(arg2);
		ok &= JS::ToNumber(cx, args.get(3), &arg3) && !std::isnan(arg3);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setMargin : Error processing arguments");
		cobj->setMargin(arg0, arg1, arg2, arg3);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_ListViewWithAdaptor_setMargin : wrong number of arguments: %d, was expecting %d", argc, 4);
	return false;
}
bool js_quyetnd_newui_ListViewWithAdaptor_setCreateItemCallback(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::ListViewWithAdaptor* cobj = (quyetnd::ListViewWithAdaptor *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setCreateItemCallback : Invalid Native Object");
	if (argc == 1) {
		std::function<cocos2d::Node *()> arg0;
		do {
			if (JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
			{
				JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
				std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(0), args.thisv()));
				auto lambda = [=]() -> cocos2d::Node* {
					JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
						JS::RootedValue rval(cx);
					bool succeed = func->invoke(0, nullptr, &rval);
					if (!succeed && JS_IsExceptionPending(cx)) {
						JS_ReportPendingException(cx);
					}
					cocos2d::Node* ret = nullptr;
					do {
						if (rval.isNull()) { ret = nullptr; break; }
						if (!rval.isObject()) {break; }
						js_proxy_t *jsProxy;
						JS::RootedObject tmpObj(cx, rval.toObjectOrNull());
						jsProxy = jsb_get_js_proxy(tmpObj);
						ret = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
//						JSB_PRECONDITION2(ret, cx, false, "Invalid Native Object");
					} while (0);
					return ret;
				};
				arg0 = lambda;
			}
			else
			{
				arg0 = nullptr;
			}
		} while (0)
			;
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setCreateItemCallback : Error processing arguments");
		cobj->setCreateItemCallback(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_ListViewWithAdaptor_setCreateItemCallback : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}
bool js_quyetnd_newui_ListViewWithAdaptor_setSizeCallback(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::ListViewWithAdaptor* cobj = (quyetnd::ListViewWithAdaptor *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setSizeCallback : Invalid Native Object");
	if (argc == 1) {
		std::function<int()> arg0;
		do {
			if (JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
			{
				JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
				std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(0), args.thisv()));
				auto lambda = [=]() -> int {
					JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
						JS::RootedValue rval(cx);
					bool succeed = func->invoke(0, nullptr, &rval);
					if (!succeed && JS_IsExceptionPending(cx)) {
						JS_ReportPendingException(cx);
					}
					int ret;
					jsval_to_int32(cx, rval, (int32_t *)&ret);
					return ret;
				};
				arg0 = lambda;
			}
			else
			{
				arg0 = nullptr;
			}
		} while (0)
			;
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setSizeCallback : Error processing arguments");
		cobj->setSizeCallback(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_ListViewWithAdaptor_setSizeCallback : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}
bool js_quyetnd_newui_ListViewWithAdaptor_setPadding(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::ListViewWithAdaptor* cobj = (quyetnd::ListViewWithAdaptor *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setPadding : Invalid Native Object");
	if (argc == 1) {
		double arg0 = 0;
		ok &= JS::ToNumber(cx, args.get(0), &arg0) && !std::isnan(arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_setPadding : Error processing arguments");
		cobj->setPadding(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_ListViewWithAdaptor_setPadding : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}
bool js_quyetnd_newui_ListViewWithAdaptor_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	quyetnd::ListViewWithAdaptor* cobj = new (std::nothrow) quyetnd::ListViewWithAdaptor();

	js_type_class_t *typeClass = js_get_type_from_native<quyetnd::ListViewWithAdaptor>(cobj);

	// link the native object with the javascript object
	JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "quyetnd::ListViewWithAdaptor"));
	args.rval().set(OBJECT_TO_JSVAL(jsobj));
	if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
	return true;
}
static bool js_quyetnd_newui_ListViewWithAdaptor_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	quyetnd::ListViewWithAdaptor *nobj = new (std::nothrow) quyetnd::ListViewWithAdaptor();
	auto newproxy = jsb_new_proxy(nobj, obj);
	jsb_ref_init(cx, &newproxy->obj, nobj, "quyetnd::ListViewWithAdaptor");
	bool isFound = false;
	if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
	args.rval().setUndefined();
	return true;
}

bool js_quyetnd_newui_ListViewWithAdaptor_initWithSize(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::ListViewWithAdaptor* cobj = (quyetnd::ListViewWithAdaptor *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_initWithSize : Invalid Native Object");
	if (argc == 1) {
		cocos2d::Size arg0;
		ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_newui_ListViewWithAdaptor_initWithSize : Error processing arguments");
		cobj->initWithSize(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_newui_ListViewWithAdaptor_initWithSize : wrong number of arguments: %d, was expecting %d", argc, 2);
	return false;
}


extern JSObject *jsb_cocos2d_ui_ScrollView_prototype;


void js_register_quyetnd_newui_ListViewWithAdaptor(JSContext *cx, JS::HandleObject global) {
	jsb_quyetnd_ListViewWithAdaptor_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_quyetnd_ListViewWithAdaptor_class->name = "ListViewWithAdaptor";
	jsb_quyetnd_ListViewWithAdaptor_class->addProperty = JS_PropertyStub;
	jsb_quyetnd_ListViewWithAdaptor_class->delProperty = JS_DeletePropertyStub;
	jsb_quyetnd_ListViewWithAdaptor_class->getProperty = JS_PropertyStub;
	jsb_quyetnd_ListViewWithAdaptor_class->setProperty = JS_StrictPropertyStub;
	jsb_quyetnd_ListViewWithAdaptor_class->enumerate = JS_EnumerateStub;
	jsb_quyetnd_ListViewWithAdaptor_class->resolve = JS_ResolveStub;
	jsb_quyetnd_ListViewWithAdaptor_class->convert = JS_ConvertStub;
	jsb_quyetnd_ListViewWithAdaptor_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	static JSPropertySpec properties[] = {
		JS_PS_END
	};

	static JSFunctionSpec funcs[] = {
		JS_FN("setItemAdaptor", js_quyetnd_newui_ListViewWithAdaptor_setItemAdaptor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("refreshView", js_quyetnd_newui_ListViewWithAdaptor_refreshView, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setMargin", js_quyetnd_newui_ListViewWithAdaptor_setMargin, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setCreateItemCallback", js_quyetnd_newui_ListViewWithAdaptor_setCreateItemCallback, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setSizeCallback", js_quyetnd_newui_ListViewWithAdaptor_setSizeCallback, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setPadding", js_quyetnd_newui_ListViewWithAdaptor_setPadding, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("initWithSize", js_quyetnd_newui_ListViewWithAdaptor_initWithSize, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("ctor", js_quyetnd_newui_ListViewWithAdaptor_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	JSFunctionSpec *st_funcs = NULL;

	JS::RootedObject parent_proto(cx, jsb_cocos2d_ui_ScrollView_prototype);
	jsb_quyetnd_ListViewWithAdaptor_prototype = JS_InitClass(
		cx, global,
		parent_proto,
		jsb_quyetnd_ListViewWithAdaptor_class,
		js_quyetnd_newui_ListViewWithAdaptor_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);

	JS::RootedObject proto(cx, jsb_quyetnd_ListViewWithAdaptor_prototype);
	JS::RootedValue className(cx, std_string_to_jsval(cx, "ListViewWithAdaptor"));
	JS_SetProperty(cx, proto, "_className", className);
	JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
	JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
	// add the proto and JSClass to the type->js info hash table
	jsb_register_class<quyetnd::ListViewWithAdaptor>(cx, jsb_quyetnd_ListViewWithAdaptor_class, proto, parent_proto);
	anonEvaluate(cx, global, "(function () { newui.ListViewWithAdaptor.extend = cc.Class.extend; })()");
}
