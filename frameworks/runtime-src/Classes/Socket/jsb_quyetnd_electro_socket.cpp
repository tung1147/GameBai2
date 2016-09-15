#include "jsb_quyetnd_sfssocket.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "ElectroClient.h"

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
JSClass  *jsb_quyetnd_ElectroClient_class;
JSObject *jsb_quyetnd_ElectroClient_prototype;

bool js_quyetnd_electro_socket_ElectroClient_connect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::ElectroClient* cobj = (quyetnd::ElectroClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_electro_socket_ElectroClient_connect : Invalid Native Object");
    if (argc == 2) {
      //  const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); //arg0 = arg0_tmp.c_str();
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_electro_socket_ElectroClient_connect : Error processing arguments");
		cobj->connect(arg0_tmp, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_electro_socket_ElectroClient_connect : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_quyetnd_electro_socket_ElectroClient_close(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::ElectroClient* cobj = (quyetnd::ElectroClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_electro_socket_ElectroClient_close : Invalid Native Object");
    if (argc == 0) {
        cobj->close();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_electro_socket_ElectroClient_close : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_quyetnd_electro_socket_ElectroClient_getStatus(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::ElectroClient* cobj = (quyetnd::ElectroClient *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_electro_socket_ElectroClient_getStatus : Invalid Native Object");
	if (argc == 0) {
		int status = cobj->getStatus();
		args.rval().setInt32(status);
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_electro_socket_ElectroClient_getStatus : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}

bool js_quyetnd_electro_socket_ElectroClient_setPingTimeInterval(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	bool ok = true;
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	quyetnd::ElectroClient* cobj = (quyetnd::ElectroClient *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_quyetnd_electro_socket_ElectroClient_setPingTimeInterval : Invalid Native Object");
	if (argc == 1) {
		double arg0 = 0;
		ok &= JS::ToNumber(cx, args.get(0), &arg0) && !std::isnan(arg0);
		JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_electro_socket_ElectroClient_setPingTimeInterval : Error processing arguments");
		cobj->setPingInterval(arg0);
		args.rval().setUndefined();
		return true;
	}

	JS_ReportError(cx, "js_quyetnd_electro_socket_ElectroClient_setPingTimeInterval : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}

bool js_quyetnd_electro_socket_ElectroClient_send(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    quyetnd::ElectroClient* cobj = (quyetnd::ElectroClient *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_quyetnd_electro_socket_ElectroClient_send : Invalid Native Object");
    if (argc == 1) {
        std::string arg1_tmp; 
		ok &= jsval_to_std_string(cx, args.get(0), &arg1_tmp);
        JSB_PRECONDITION2(ok, cx, false, "js_quyetnd_electro_socket_ElectroClient_send : Error processing arguments");
		cobj->send(arg1_tmp);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_quyetnd_electro_socket_ElectroClient_send : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_quyetnd_electro_socket_ElectroClient_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    quyetnd::ElectroClient* cobj = new (std::nothrow) quyetnd::ElectroClient();

    js_type_class_t *typeClass = js_get_type_from_native<quyetnd::ElectroClient>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_create_weak_jsobject(cx, cobj, typeClass, "quyetnd::ElectroClient"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}
static bool js_quyetnd_electro_socket_ElectroClient_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    quyetnd::ElectroClient *nobj = new (std::nothrow) quyetnd::ElectroClient();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    AddNamedObjectRoot(cx, &p->obj, "quyetnd::ElectroClient");
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    args.rval().setUndefined();
    return true;
}


void js_quyetnd_ElectroClient_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (ElectroClient)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedObject jsobj(cx, obj);
    jsproxy = jsb_get_js_proxy(jsobj);
    if (jsproxy) {
        quyetnd::ElectroClient *nobj = static_cast<quyetnd::ElectroClient *>(jsproxy->ptr);
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        if (nobj) {
            jsb_remove_proxy(nproxy, jsproxy);
            delete nobj;
        }
        else
            jsb_remove_proxy(nullptr, jsproxy);
    }
}
    
void js_register_quyetnd_sfssocket_ElectroClient(JSContext *cx, JS::HandleObject global) {
    jsb_quyetnd_ElectroClient_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_quyetnd_ElectroClient_class->name = "ElectroClient";
    jsb_quyetnd_ElectroClient_class->addProperty = JS_PropertyStub;
    jsb_quyetnd_ElectroClient_class->delProperty = JS_DeletePropertyStub;
    jsb_quyetnd_ElectroClient_class->getProperty = JS_PropertyStub;
    jsb_quyetnd_ElectroClient_class->setProperty = JS_StrictPropertyStub;
    jsb_quyetnd_ElectroClient_class->enumerate = JS_EnumerateStub;
    jsb_quyetnd_ElectroClient_class->resolve = JS_ResolveStub;
    jsb_quyetnd_ElectroClient_class->convert = JS_ConvertStub;
    jsb_quyetnd_ElectroClient_class->finalize = js_quyetnd_ElectroClient_finalize;
    jsb_quyetnd_ElectroClient_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("connect", js_quyetnd_electro_socket_ElectroClient_connect, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("close", js_quyetnd_electro_socket_ElectroClient_close, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getStatus", js_quyetnd_electro_socket_ElectroClient_getStatus, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("send", js_quyetnd_electro_socket_ElectroClient_send, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setPingTimeInterval", js_quyetnd_electro_socket_ElectroClient_setPingTimeInterval, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_quyetnd_electro_socket_ElectroClient_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    jsb_quyetnd_ElectroClient_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_quyetnd_ElectroClient_class,
        js_quyetnd_electro_socket_ElectroClient_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_quyetnd_ElectroClient_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "ElectroClient"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<quyetnd::ElectroClient>(cx, jsb_quyetnd_ElectroClient_class, proto, JS::NullPtr());
    anonEvaluate(cx, global, "(function () { socket.ElectroClient.extend = cc.Class.extend; })()");
}

void register_all_quyetnd_electro_socket(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "socket", &ns);

    js_register_quyetnd_sfssocket_ElectroClient(cx, ns);
}

