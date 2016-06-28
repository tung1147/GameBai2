#include "jsb_quyetnd_newui.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "NewTableView.h"
#include "NewTextInput.h"

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