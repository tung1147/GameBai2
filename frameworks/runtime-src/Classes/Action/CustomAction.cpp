/*
 * CustomAction.cpp
 *
 *  Created on: Jun 30, 2016
 *      Author: Quyet Nguyen
 */

#include "CustomAction.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "jsb_quyetnd_action.hpp"

namespace quyetnd {

CustomAction::CustomAction() {
	// TODO Auto-generated constructor stub
	//log("CustomAction");

	_onStop = false;
	_onUpdate = false;
	_onStartWithTarget = false;
}

CustomAction::~CustomAction() {
	// TODO Auto-generated destructor stub
	//log("~CustomAction");
}

void CustomAction::initCustomAction(){
	auto sc = ScriptingCore::getInstance();
	auto _cx = sc->getGlobalContext();
	auto _global = sc->getGlobalObject();
	js_proxy_t * p = jsb_get_native_proxy(this);
	if (p){
		JSAutoCompartment ac(_cx, _global);
		JS::RootedObject jstarget(_cx, p->obj);
		JS::RootedValue value(_cx);
		bool ok = JS_GetProperty(_cx, jstarget, "onStop", &value);
		if (ok && !value.isNullOrUndefined()){
			_onStop = true;
		}

		ok = JS_GetProperty(_cx, jstarget, "onUpdate", &value);
		if (ok && !value.isNullOrUndefined()){
			_onUpdate = true;
		}

		ok = JS_GetProperty(_cx, jstarget, "onStartWithTarget", &value);
		if (ok && !value.isNullOrUndefined()){
			_onStartWithTarget = true;
		}

		sc->resumeSchedulesAndActions(p);
	}
}

void CustomAction::stop(){
	ActionInterval::stop();

	//log("stop");

	if (_onStop){
		auto sc = ScriptingCore::getInstance();
		js_proxy_t * p = jsb_get_native_proxy(this);
		if (p){
			jsval dataVal = INT_TO_JSVAL(0);
			auto ret = sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onStop", 0, &dataVal);
		}
	}
}

void CustomAction::update(float time){
	//log("update");
	if (_onUpdate){
		auto sc = ScriptingCore::getInstance();;
		js_proxy_t * p = jsb_get_native_proxy(this);
		if (p){
			jsval dataVal = DOUBLE_TO_JSVAL(time);
			auto ret = sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onUpdate", 1, &dataVal);
		}
	}
}

void CustomAction::startWithTarget(Node *target){
	ActionInterval::startWithTarget(target);
//	log("startWithTarget");
	if (_onStartWithTarget){
		auto sc = ScriptingCore::getInstance();	
		js_proxy_t * p = jsb_get_native_proxy(this);
		js_proxy_t * pTarget = jsb_get_native_proxy(target);
		if (p && pTarget){	
			jsval dataVal = OBJECT_TO_JSVAL(pTarget->obj);
			auto ret = sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onStartWithTarget", 1, &dataVal);
		}
	}
}


} /* namespace quyetnd */
