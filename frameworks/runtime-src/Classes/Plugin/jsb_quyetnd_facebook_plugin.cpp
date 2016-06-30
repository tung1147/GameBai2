#include "cocos2d.h"
#include "FacebookPlugin.h"
#include "jsb_quyetnd_facebook_plugin.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
USING_NS_CC;

JSClass  *jsb_quyetnd_facebook_plugin_class = 0;
JSObject *jsb_quyetnd_facebook_plugin_prototype = 0;
JSObject *jsb_quyetnd_facebook_plugin_ns_object = 0;
JSObject *jsb_quyetnd_facebook_plugin_target = 0;

bool jsb_quyetnd_facebook_plugin_setJSTarget(JSContext *cx, uint32_t argc, jsval *vp){
	if (argc == 1){
		JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
		jsb_quyetnd_facebook_plugin_target = args.get(0).toObjectOrNull();
		return true;
	}
	return false;
}

bool jsb_quyetnd_facebook_plugin_login(JSContext *cx, uint32_t argc, jsval *vp){
	if (argc == 0){
		JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
		quyetnd::FacebookPlugin::getInstance()->showLogin();
		args.rval().setUndefined();
		return true;
	}
	return false;
}

void jsb_quyetnd_facebook_on_login(int returnCode, const std::string& userId, const std::string& accessToken){
	if (jsb_quyetnd_facebook_plugin_target){
		ScriptingCore* sc = ScriptingCore::getInstance();
		if (sc){
			jsval dataVal[] = {
				dataVal[0] = INT_TO_JSVAL(returnCode),
				dataVal[1] = std_string_to_jsval(sc->getGlobalContext(), userId),
				dataVal[2] = std_string_to_jsval(sc->getGlobalContext(), accessToken)
			};
			sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsb_quyetnd_facebook_plugin_target), "onLoginFinished", 3, dataVal);
		}
	}
}

bool js_quyetnd_facebook_plugin_constructor(JSContext *cx, uint32_t argc, jsval *vp){
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject parent(cx, jsb_quyetnd_facebook_plugin_ns_object);
	JS::RootedObject proto(cx, jsb_quyetnd_facebook_plugin_prototype);
	JS::RootedObject jsObj(cx, JS_NewObject(cx, jsb_quyetnd_facebook_plugin_class, proto, parent));
	args.rval().set(OBJECT_TO_JSVAL(jsObj));
	return true;
}

void js_quyetnd_facebook_plugin_finalize(JSFreeOp *fop, JSObject *obj){

}

void js_register_quyetnd_facebook_plugin(JSContext *cx, JS::HandleObject global) {
	jsb_quyetnd_facebook_plugin_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_quyetnd_facebook_plugin_class->name = "FacebookPlugin";
	jsb_quyetnd_facebook_plugin_class->addProperty = JS_PropertyStub;
	jsb_quyetnd_facebook_plugin_class->delProperty = JS_DeletePropertyStub;
	jsb_quyetnd_facebook_plugin_class->getProperty = JS_PropertyStub;
	jsb_quyetnd_facebook_plugin_class->setProperty = JS_StrictPropertyStub;
	jsb_quyetnd_facebook_plugin_class->enumerate = JS_EnumerateStub;
	jsb_quyetnd_facebook_plugin_class->resolve = JS_ResolveStub;
	jsb_quyetnd_facebook_plugin_class->convert = JS_ConvertStub;
	jsb_quyetnd_facebook_plugin_class->finalize = js_quyetnd_facebook_plugin_finalize;
	jsb_quyetnd_facebook_plugin_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
		JS_FN("showLogin", jsb_quyetnd_facebook_plugin_login, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setTarget", jsb_quyetnd_facebook_plugin_setJSTarget, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
	
    JSFunctionSpec *st_funcs = NULL;
    jsb_quyetnd_facebook_plugin_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
		jsb_quyetnd_facebook_plugin_class,
		js_quyetnd_facebook_plugin_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);
}

void register_all_quyetnd_facebook_plugin(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "quyetnd", &ns);
	jsb_quyetnd_facebook_plugin_prototype = ns;
	js_register_quyetnd_facebook_plugin(cx, ns);
}

