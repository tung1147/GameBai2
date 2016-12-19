#include "jsb_quyetnd_resourcedownloader.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "ResourcesDownloader.h"


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

}

