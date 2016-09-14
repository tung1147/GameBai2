/*
 * UserVariable.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "UserVariable.h"
#include "../thrift/ThriftUserVariable_types.h"

namespace es{
UserVariable::UserVariable() {
	// TODO Auto-generated constructor stub
	name = "";
	value = 0;
}

UserVariable::~UserVariable() {
	// TODO Auto-generated destructor stub
	if (value){
		delete value;
		value = 0;
	}
}

void UserVariable::toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator){
	value.SetObject();
	value.AddMember("name", name, allocator);

	if (this->value){
		rapidjson::Value esObj;
		this->value->toJson(esObj, allocator);
		value.AddMember("value", esObj, allocator);
	}
}

void UserVariable::initFromThrift(void* thrift){
	auto obj = (ThriftUserVariable*)thrift;
	if (obj->__isset.name){
		name = obj->name;
	}

	if (obj->__isset.value){
		value = new EsObject();
		value->initFromFlattenedEsObject(&obj->value);
	}
}

void UserVariable::toThrift(void* thrift){
	auto obj = (ThriftUserVariable*)thrift;
	if (value){
		obj->__set_name(name);

		value->writeToFlattenedEsObject(&obj->value);
		obj->__isset.value = true;
	}
}

}
