/*
 * RoomVariable.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "RoomVariable.h"
#include "thrift/ThriftRoomVariable_types.h"

namespace es {

RoomVariable::RoomVariable() {
	// TODO Auto-generated constructor stub
	value = 0;
	persistent = false;
	name = "";
	locked = false;
}

RoomVariable::~RoomVariable() {
	// TODO Auto-generated destructor stub
	if (value){
		delete value;
		value = 0;
	}
}

void RoomVariable::initFromThrift(void* thrift){
	auto obj = (ThriftRoomVariable*)thrift;

	this->persistent = obj->persistent;
	this->name = obj->name;
	this->locked = obj->locked;
	if (obj->__isset.value){
		value = new EsObject();
		value->initFromFlattenedEsObject(&obj->value);
	}
}

void RoomVariable::toThrift(void* thrift){
	auto obj = (ThriftRoomVariable*)thrift;
	obj->__set_persistent(persistent);
	obj->__set_name(name);
	obj->__set_locked(locked);

	if (value){
		value->writeToFlattenedEsObject(&obj->value);
		obj->__isset.value = true;
	}
}


} /* namespace es */
