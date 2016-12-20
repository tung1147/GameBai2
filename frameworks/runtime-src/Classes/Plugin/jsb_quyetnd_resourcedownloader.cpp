#include "jsb_quyetnd_resourcedownloader.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "ResourcesDownloader.h"


bool jsb_quyetnd_resourcesdownloader_loadTexture(JSContext *cx, uint32_t argc, jsval *vp){
	if (argc == 2){
		std::string url;		
		JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
		bool ok = jsval_to_std_string(cx, args[0], &url);
		JSB_PRECONDITION2(ok, cx, false, "jsb_quyetnd_resourcesdownloader_loadTexture : Error processing arguments");

		if (ok){
			std::function<void(Texture2D*)> arg3 = nullptr;
			if (JS_TypeOfValue(cx, args.get(1)) == JSTYPE_FUNCTION){
				JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
				std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(1), args.thisv()));
				auto lambda = [=](Texture2D* texture) -> void {
					JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
						jsval largv[1];
					if (texture){
						largv[0] = OBJECT_TO_JSVAL(js_get_or_create_jsobject<cocos2d::Texture2D>(cx, texture));
					}
					else{
						largv[0].setNull();
					}
					
					JS::RootedValue rval(cx);
					bool succeed = func->invoke(1, &largv[0], &rval);
					if (!succeed && JS_IsExceptionPending(cx)) {
						JS_ReportPendingException(cx);
					}
				};
				arg3 = lambda;
			}
			quyetnd::ResourcesDownloader::getInstance()->loadTexture(url, arg3);
			return true;
		}
		
	}
	return false;
}

void register_all_quyetnd_resourcesloader(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "quyetnd", &ns);
	
	//object
	JS::RootedObject object_ns(cx);
	get_or_create_js_obj(cx, ns, "ResourcesDownloader", &object_ns);


	//cocos2d::Texture2D* tex; 
	//auto jsval = OBJECT_TO_JSVAL(js_get_or_create_jsobject<cocos2d::Texture2D>(cx, (cocos2d::Texture2D*)tex));

	//method
	JS_DefineFunction(cx, object_ns, "loadTexture", jsb_quyetnd_resourcesdownloader_loadTexture, 2, JSPROP_READONLY | JSPROP_PERMANENT);
}

