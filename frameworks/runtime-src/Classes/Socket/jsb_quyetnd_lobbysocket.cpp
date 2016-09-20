#include "jsb_quyetnd_lobbysocket.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "LobbyClient.h"

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
JSClass  *jsb_quyetnd_LobbyClient_class;
JSObject *jsb_quyetnd_LobbyClient_prototype;

bool js_quyetnd_lobbysocket_LobbyClient_send(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::LobbyClient* cobj = (quyetnd::LobbyClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_lobbysocket_LobbyClient_send : Invalid Native Object");
    if (argc == 1) {
     //   const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); //arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_lobbysocket_LobbyClient_send : Error processing arguments");
		cobj->send(arg0_tmp);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_lobbysocket_LobbyClient_send : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_quyetnd_lobbysocket_LobbyClient_connect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::LobbyClient* cobj = (quyetnd::LobbyClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_lobbysocket_LobbyClient_connect : Invalid Native Object");
    if (argc == 2) {
       // const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); //arg0 = arg0_tmp.c_str();
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_lobbysocket_LobbyClient_connect : Error processing arguments");
		cobj->connect(arg0_tmp, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_lobbysocket_LobbyClient_connect : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_quyetnd_lobbysocket_LobbyClient_close(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::LobbyClient* cobj = (quyetnd::LobbyClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_lobbysocket_LobbyClient_close : Invalid Native Object");
    if (argc == 0) {
        cobj->close();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_lobbysocket_LobbyClient_close : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_quyetnd_lobbysocket_LobbyClient_getStatus(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::LobbyClient* cobj = (quyetnd::LobbyClient *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_lobbysocket_LobbyClient_getStatus : Invalid Native Object");
	if (argc == 0) {
		int status = cobj->getStatus();
		args.rval().setInt32(status);
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_lobbysocket_LobbyClient_getStatus : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}

bool js_quyetnd_lobbysocket_LobbyClient_initClientWithType(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::LobbyClient* cobj = (quyetnd::LobbyClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_lobbysocket_LobbyClient_initClientWithType : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_lobbysocket_LobbyClient_initClientWithType : Error processing arguments");
        cobj->initClientWithType(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_lobbysocket_LobbyClient_initClientWithType : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_quyetnd_lobbysocket_LobbyClient_setPingTimeInterval(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::LobbyClient* cobj = (quyetnd::LobbyClient *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_lobbysocket_LobbyClient_setPingTimeInterval : Invalid Native Object");
	if (argc == 1) {
		double arg0 = 0;
		ok &= JS::ToNumber(cx, args.get(0), &arg0) && !std::isnan(arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_lobbysocket_LobbyClient_setPingTimeInterval : Error processing arguments");
		cobj->setPingTimeInterval(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_lobbysocket_LobbyClient_setPingTimeInterval : wrong number of arguments: %d, was expecting %d", argc, 1);
	return false;
}

bool js_quyetnd_lobbysocket_LobbyClient_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    quyetnd::LobbyClient* cobj = new (std::nothrow) quyetnd::LobbyClient();

    js_type_class_t *typeClass = js_get_type_from_native<quyetnd::LobbyClient>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_create_weak_jsobject(cx, cobj, typeClass, "quyetnd::LobbyClient"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}
static bool js_quyetnd_lobbysocket_LobbyClient_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    quyetnd::LobbyClient *nobj = new (std::nothrow) quyetnd::LobbyClient();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    AddNamedObjectRoot(cx, &p->obj, "quyetnd::LobbyClient");
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    args.rval().setUndefined();
    return true;
}


void js_quyetnd_LobbyClient_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (LobbyClient)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedObject jsobj(cx, obj);
    jsproxy = jsb_get_js_proxy(jsobj);
    if (jsproxy) {
        quyetnd::LobbyClient *nobj = static_cast<quyetnd::LobbyClient *>(jsproxy->ptr);
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        if (nobj) {
            jsb_remove_proxy(nproxy, jsproxy);
            delete nobj;
        }
        else
            jsb_remove_proxy(nullptr, jsproxy);
    }
}
    
void js_register_quyetnd_lobbysocket_LobbyClient(JSContext *cx, JS::HandleObject global) {
    jsb_quyetnd_LobbyClient_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_quyetnd_LobbyClient_class->name = "LobbyClient";
    jsb_quyetnd_LobbyClient_class->addProperty = JS_PropertyStub;
    jsb_quyetnd_LobbyClient_class->delProperty = JS_DeletePropertyStub;
    jsb_quyetnd_LobbyClient_class->getProperty = JS_PropertyStub;
    jsb_quyetnd_LobbyClient_class->setProperty = JS_StrictPropertyStub;
    jsb_quyetnd_LobbyClient_class->enumerate = JS_EnumerateStub;
    jsb_quyetnd_LobbyClient_class->resolve = JS_ResolveStub;
    jsb_quyetnd_LobbyClient_class->convert = JS_ConvertStub;
    jsb_quyetnd_LobbyClient_class->finalize = js_quyetnd_LobbyClient_finalize;
    jsb_quyetnd_LobbyClient_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("send", js_quyetnd_lobbysocket_LobbyClient_send, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("connect", js_quyetnd_lobbysocket_LobbyClient_connect, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("close", js_quyetnd_lobbysocket_LobbyClient_close, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getStatus", js_quyetnd_lobbysocket_LobbyClient_getStatus, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initClientWithType", js_quyetnd_lobbysocket_LobbyClient_initClientWithType, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_quyetnd_lobbysocket_LobbyClient_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    jsb_quyetnd_LobbyClient_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_quyetnd_LobbyClient_class,
        js_quyetnd_lobbysocket_LobbyClient_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_quyetnd_LobbyClient_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "LobbyClient"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<quyetnd::LobbyClient>(cx, jsb_quyetnd_LobbyClient_class, proto, JS::NullPtr());
    anonEvaluate(cx, global, "(function () { socket.LobbyClient.extend = cc.Class.extend; })()");
}

void register_all_quyetnd_lobbysocket(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "socket", &ns);

    js_register_quyetnd_lobbysocket_LobbyClient(cx, ns);
}

