#include "jsb_quyetnd_sfssocket.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "SmartfoxClient.h"

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
JSClass  *jsb_quyetnd_SmartfoxClient_class;
JSObject *jsb_quyetnd_SmartfoxClient_prototype;

bool js_quyetnd_sfssocket_SmartfoxClient_connect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::SmartfoxClient* cobj = (quyetnd::SmartfoxClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_sfssocket_SmartfoxClient_connect : Invalid Native Object");
    if (argc == 2) {
      //  const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); //arg0 = arg0_tmp.c_str();
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_sfssocket_SmartfoxClient_connect : Error processing arguments");
		cobj->connect(arg0_tmp, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_sfssocket_SmartfoxClient_connect : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_quyetnd_sfssocket_SmartfoxClient_close(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::SmartfoxClient* cobj = (quyetnd::SmartfoxClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_sfssocket_SmartfoxClient_close : Invalid Native Object");
    if (argc == 0) {
        cobj->close();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_sfssocket_SmartfoxClient_close : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_quyetnd_sfssocket_SmartfoxClient_getStatus(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::SmartfoxClient* cobj = (quyetnd::SmartfoxClient *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_sfssocket_SmartfoxClient_getStatus : Invalid Native Object");
	if (argc == 0) {
		int status = cobj->getStatus();
		args.rval().setInt32(status);
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_sfssocket_SmartfoxClient_getStatus : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}

bool js_quyetnd_sfssocket_SmartfoxClient_send(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::SmartfoxClient* cobj = (quyetnd::SmartfoxClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_sfssocket_SmartfoxClient_send : Invalid Native Object");
    if (argc == 2) {
        int arg0 = 0;
        //const char* arg1 = nullptr;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp);// arg1 = arg1_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_sfssocket_SmartfoxClient_send : Error processing arguments");
		cobj->send(arg0, arg1_tmp);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_sfssocket_SmartfoxClient_send : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_quyetnd_sfssocket_SmartfoxClient_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    quyetnd::SmartfoxClient* cobj = new (std::nothrow) quyetnd::SmartfoxClient();

    js_type_class_t *typeClass = js_get_type_from_native<quyetnd::SmartfoxClient>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_create_weak_jsobject(cx, cobj, typeClass, "quyetnd::SmartfoxClient"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}
static bool js_quyetnd_sfssocket_SmartfoxClient_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    quyetnd::SmartfoxClient *nobj = new (std::nothrow) quyetnd::SmartfoxClient();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    AddNamedObjectRoot(cx, &p->obj, "quyetnd::SmartfoxClient");
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    args.rval().setUndefined();
    return true;
}


void js_quyetnd_SmartfoxClient_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (SmartfoxClient)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedObject jsobj(cx, obj);
    jsproxy = jsb_get_js_proxy(jsobj);
    if (jsproxy) {
        quyetnd::SmartfoxClient *nobj = static_cast<quyetnd::SmartfoxClient *>(jsproxy->ptr);
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        if (nobj) {
            jsb_remove_proxy(nproxy, jsproxy);
            delete nobj;
        }
        else
            jsb_remove_proxy(nullptr, jsproxy);
    }
}
    
void js_register_quyetnd_sfssocket_SmartfoxClient(JSContext *cx, JS::HandleObject global) {
    jsb_quyetnd_SmartfoxClient_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_quyetnd_SmartfoxClient_class->name = "SmartfoxClient";
    jsb_quyetnd_SmartfoxClient_class->addProperty = JS_PropertyStub;
    jsb_quyetnd_SmartfoxClient_class->delProperty = JS_DeletePropertyStub;
    jsb_quyetnd_SmartfoxClient_class->getProperty = JS_PropertyStub;
    jsb_quyetnd_SmartfoxClient_class->setProperty = JS_StrictPropertyStub;
    jsb_quyetnd_SmartfoxClient_class->enumerate = JS_EnumerateStub;
    jsb_quyetnd_SmartfoxClient_class->resolve = JS_ResolveStub;
    jsb_quyetnd_SmartfoxClient_class->convert = JS_ConvertStub;
    jsb_quyetnd_SmartfoxClient_class->finalize = js_quyetnd_SmartfoxClient_finalize;
    jsb_quyetnd_SmartfoxClient_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("connect", js_quyetnd_sfssocket_SmartfoxClient_connect, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("close", js_quyetnd_sfssocket_SmartfoxClient_close, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getStatus", js_quyetnd_sfssocket_SmartfoxClient_getStatus, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("send", js_quyetnd_sfssocket_SmartfoxClient_send, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_quyetnd_sfssocket_SmartfoxClient_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    jsb_quyetnd_SmartfoxClient_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_quyetnd_SmartfoxClient_class,
        js_quyetnd_sfssocket_SmartfoxClient_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_quyetnd_SmartfoxClient_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "SmartfoxClient"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<quyetnd::SmartfoxClient>(cx, jsb_quyetnd_SmartfoxClient_class, proto, JS::NullPtr());
    anonEvaluate(cx, global, "(function () { socket.SmartfoxClient.extend = cc.Class.extend; })()");
}

void register_all_quyetnd_sfssocket(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "socket", &ns);

    js_register_quyetnd_sfssocket_SmartfoxClient(cx, ns);
}

