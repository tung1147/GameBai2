#include "jsb_quyetnd_action.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "ActionNumber.h"
#include "ActionShake2D.h"

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
JSClass  *jsb_quyetnd_ActionNumberCount_class;
JSObject *jsb_quyetnd_ActionNumberCount_prototype;

bool js_quyetnd_action_ActionNumberCount_startWithTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::ActionNumberCount* cobj = (quyetnd::ActionNumberCount *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_action_ActionNumberCount_startWithTarget : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_action_ActionNumberCount_startWithTarget : Error processing arguments");
        cobj->startWithTarget(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_action_ActionNumberCount_startWithTarget : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_action_ActionNumberCount_initWithCount(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::ActionNumberCount* cobj = (quyetnd::ActionNumberCount *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_action_ActionNumberCount_initWithCount : Invalid Native Object");
    if (argc == 3) {
        double arg0 = 0;
        int arg1 = 0;
        int arg2 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_action_ActionNumberCount_initWithCount : Error processing arguments");
        cobj->initWithCount(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_action_ActionNumberCount_initWithCount : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_quyetnd_action_ActionNumberCount_setFormatType(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::ActionNumberCount* cobj = (quyetnd::ActionNumberCount *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_action_ActionNumberCount_setFormatType : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_action_ActionNumberCount_setFormatType : Error processing arguments");
        cobj->setFormatType(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_action_ActionNumberCount_setFormatType : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_action_ActionNumberCount_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    quyetnd::ActionNumberCount* cobj = new (std::nothrow) quyetnd::ActionNumberCount();

    js_type_class_t *typeClass = js_get_type_from_native<quyetnd::ActionNumberCount>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "quyetnd::ActionNumberCount"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}
static bool js_quyetnd_action_ActionNumberCount_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    quyetnd::ActionNumberCount *nobj = new (std::nothrow) quyetnd::ActionNumberCount();
    auto newproxy = jsb_new_proxy(nobj, obj);
    jsb_ref_init(cx, &newproxy->obj, nobj, "quyetnd::ActionNumberCount");
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    args.rval().setUndefined();
    return true;
}


extern JSObject *jsb_cocos2d_ActionInterval_prototype;

    
void js_register_quyetnd_action_ActionNumberCount(JSContext *cx, JS::HandleObject global) {
    jsb_quyetnd_ActionNumberCount_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_quyetnd_ActionNumberCount_class->name = "ActionNumberCount";
    jsb_quyetnd_ActionNumberCount_class->addProperty = JS_PropertyStub;
    jsb_quyetnd_ActionNumberCount_class->delProperty = JS_DeletePropertyStub;
    jsb_quyetnd_ActionNumberCount_class->getProperty = JS_PropertyStub;
    jsb_quyetnd_ActionNumberCount_class->setProperty = JS_StrictPropertyStub;
    jsb_quyetnd_ActionNumberCount_class->enumerate = JS_EnumerateStub;
    jsb_quyetnd_ActionNumberCount_class->resolve = JS_ResolveStub;
    jsb_quyetnd_ActionNumberCount_class->convert = JS_ConvertStub;
    jsb_quyetnd_ActionNumberCount_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("startWithTarget", js_quyetnd_action_ActionNumberCount_startWithTarget, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithCount", js_quyetnd_action_ActionNumberCount_initWithCount, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setFormatType", js_quyetnd_action_ActionNumberCount_setFormatType, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_quyetnd_action_ActionNumberCount_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    JS::RootedObject parent_proto(cx, jsb_cocos2d_ActionInterval_prototype);
    jsb_quyetnd_ActionNumberCount_prototype = JS_InitClass(
        cx, global,
        parent_proto,
        jsb_quyetnd_ActionNumberCount_class,
        js_quyetnd_action_ActionNumberCount_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_quyetnd_ActionNumberCount_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "ActionNumberCount"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<quyetnd::ActionNumberCount>(cx, jsb_quyetnd_ActionNumberCount_class, proto, parent_proto);
    anonEvaluate(cx, global, "(function () { cc.ActionNumberCount.extend = cc.Class.extend; })()");
}

JSClass  *jsb_quyetnd_ActionShake2D_class;
JSObject *jsb_quyetnd_ActionShake2D_prototype;

bool js_quyetnd_action_ActionShake2D_startWithTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::ActionShake2D* cobj = (quyetnd::ActionShake2D *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_action_ActionShake2D_startWithTarget : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_action_ActionShake2D_startWithTarget : Error processing arguments");
        cobj->startWithTarget(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_action_ActionShake2D_startWithTarget : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_action_ActionShake2D_stop(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::ActionShake2D* cobj = (quyetnd::ActionShake2D *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_action_ActionShake2D_stop : Invalid Native Object");
    if (argc == 0) {
        cobj->stop();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_action_ActionShake2D_stop : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_quyetnd_action_ActionShake2D_initWithDuration(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::ActionShake2D* cobj = (quyetnd::ActionShake2D *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_action_ActionShake2D_initWithDuration : Invalid Native Object");
    if (argc == 2) {
        double arg0 = 0;
        cocos2d::Point arg1;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= jsval_to_ccpoint(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_action_ActionShake2D_initWithDuration : Error processing arguments");
        cobj->initWithDuration(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_action_ActionShake2D_initWithDuration : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_quyetnd_action_ActionShake2D_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    quyetnd::ActionShake2D* cobj = new (std::nothrow) quyetnd::ActionShake2D();

    js_type_class_t *typeClass = js_get_type_from_native<quyetnd::ActionShake2D>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "quyetnd::ActionShake2D"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}
static bool js_quyetnd_action_ActionShake2D_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    quyetnd::ActionShake2D *nobj = new (std::nothrow) quyetnd::ActionShake2D();
    auto newproxy = jsb_new_proxy(nobj, obj);
    jsb_ref_init(cx, &newproxy->obj, nobj, "quyetnd::ActionShake2D");
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    args.rval().setUndefined();
    return true;
}


extern JSObject *jsb_cocos2d_ActionInterval_prototype;

    
void js_register_quyetnd_action_ActionShake2D(JSContext *cx, JS::HandleObject global) {
    jsb_quyetnd_ActionShake2D_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_quyetnd_ActionShake2D_class->name = "ActionShake2D";
    jsb_quyetnd_ActionShake2D_class->addProperty = JS_PropertyStub;
    jsb_quyetnd_ActionShake2D_class->delProperty = JS_DeletePropertyStub;
    jsb_quyetnd_ActionShake2D_class->getProperty = JS_PropertyStub;
    jsb_quyetnd_ActionShake2D_class->setProperty = JS_StrictPropertyStub;
    jsb_quyetnd_ActionShake2D_class->enumerate = JS_EnumerateStub;
    jsb_quyetnd_ActionShake2D_class->resolve = JS_ResolveStub;
    jsb_quyetnd_ActionShake2D_class->convert = JS_ConvertStub;
    jsb_quyetnd_ActionShake2D_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("startWithTarget", js_quyetnd_action_ActionShake2D_startWithTarget, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stop", js_quyetnd_action_ActionShake2D_stop, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithDuration", js_quyetnd_action_ActionShake2D_initWithDuration, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_quyetnd_action_ActionShake2D_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    JS::RootedObject parent_proto(cx, jsb_cocos2d_ActionInterval_prototype);
    jsb_quyetnd_ActionShake2D_prototype = JS_InitClass(
        cx, global,
        parent_proto,
        jsb_quyetnd_ActionShake2D_class,
        js_quyetnd_action_ActionShake2D_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_quyetnd_ActionShake2D_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "ActionShake2D"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<quyetnd::ActionShake2D>(cx, jsb_quyetnd_ActionShake2D_class, proto, parent_proto);
    anonEvaluate(cx, global, "(function () { cc.ActionShake2D.extend = cc.Class.extend; })()");
}

void register_all_quyetnd_action(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "cc", &ns);

    js_register_quyetnd_action_ActionShake2D(cx, ns);
    js_register_quyetnd_action_ActionNumberCount(cx, ns);
}

