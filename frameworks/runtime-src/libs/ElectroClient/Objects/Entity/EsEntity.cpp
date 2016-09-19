/*
 * EsEntity.cpp
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#include "EsEntity.h"
#include "../thrift/ThriftFlattenedEsObject_types.h"
#include "../thrift/ThriftFlattenedEsObjectRO_types.h"
#include <iostream>
#include "../../ElectroLogger.h"
#include "EsObject.h"
#include "EsPrimitive.h"
#include "EsArray.h"

namespace es {

EsEntity* __create_object(const rapidjson::Value& value);
EsEntity* __create_array(const rapidjson::Value& value);
EsEntity* __create_primitive(const rapidjson::Value& value);
EsEntity* __create_string(const rapidjson::Value& value);

EsEntity* __create_entity(const rapidjson::Value& value){
	if (value.IsObject()){
		return __create_object(value);
	}
	else if (value.IsArray()){
		return __create_array(value);
	}
	else if (value.IsNumber()){
		return __create_primitive(value);
	}
	else if (value.IsString()){
		return __create_string(value);
	}
	return 0;
}

EsEntity* __create_object(const rapidjson::Value& value){
	auto obj = new EsObject();
	for (auto it = value.MemberBegin(); it != value.MemberEnd(); it++){
		auto entity = __create_entity(it->value);
		if (entity){
			std::string key(it->name.GetString());
			obj->setEsEntity(key, entity);
		}
	}
	return obj;
}

EsEntity* __create_array(const rapidjson::Value& value){
	int bool_flag = 1 << 0;
	int int_flag = 1 << 1;
	int float_flag = 1 << 2;
	int string_flag = 1 << 3;
	int object_flag = 1 << 4;
	int flag = bool_flag | int_flag | float_flag | string_flag | object_flag;

	for (int i = 0; i < value.Size(); i++){
		if (flag == 0){
			break;
		}
		if (value.IsBool()){
			flag = flag & bool_flag;
		}
		else if (value.IsInt() || value.IsInt64() || value.IsUint() || value.IsUint64()){
			flag = flag & int_flag;
		}
		else if (value.IsDouble()){
			flag = flag & float_flag;
		}
		else if (value.IsString()){
			flag = flag & string_flag;
		}
		else if (value.IsObject()){
			flag = flag & object_flag;
		}
	}

	if (flag > 0){
		auto arr = new EsArray();

		if (flag & bool_flag){
			arr->type = es::EsObjectIndicatorType::EsObjectType_BoolArray;
			for (int i = 0; i < value.Size(); i++){
				auto item = new EsPrimitive();
				item->setBool(value[i].GetBool());
				arr->addEntity(item);
			}
		}
		else if (flag & int_flag){
			arr->type = es::EsObjectIndicatorType::EsObjectType_IntegerArray;
			for (int i = 0; i < value.Size(); i++){
				auto item = new EsPrimitive();
				item->setInt(value[i].GetInt());
				arr->addEntity(item);
			}
		}
		else if (flag & float_flag){
			arr->type = es::EsObjectIndicatorType::EsObjectType_FloatArray;
			for (int i = 0; i < value.Size(); i++){
				auto item = new EsPrimitive();
				item->setFloat(value[i].GetDouble());
				arr->addEntity(item);
			}
		}
		else if (flag & string_flag){
			arr->type = es::EsObjectIndicatorType::EsObjectType_StringArray;
			for (int i = 0; i < value.Size(); i++){
				auto item = new EsString();
				item->setString(value[i].GetString());
				arr->addEntity(item);
			}
		}
		else if (flag & object_flag){
			arr->type = es::EsObjectIndicatorType::EsObjectType_EsObjectArray;
			for (int i = 0; i < value.Size(); i++){
				auto item = __create_object(value[i]);
				arr->addEntity(item);
			}
		}

		return arr;
	}
	es::log("array format not support");
	return 0;
}

EsEntity* __create_primitive(const rapidjson::Value& value){
	auto entity = new EsPrimitive();
	if (value.IsBool()){
		entity->setBool(value.GetBool());
	}
	else if (value.IsInt() | value.IsUint() | value.IsInt64() | value.IsUint64()){
		entity->setInt(value.GetInt());
	}
	else if (value.IsDouble()){
		entity->setFloat(value.GetDouble());
	}
	return entity;
}

EsEntity* __create_string(const rapidjson::Value& value){
	auto obj = new EsString();
	obj->setString(value.GetString());
	return obj;
}

/****/

EsEntity::EsEntity() {
// TODO Auto-generated constructor stub
//mData
}

EsEntity::~EsEntity() {
// TODO Auto-generated destructor stub
	rapidjson::Document doc;
	
}

void EsEntity::writeToBuffer(EsMessageWriter* writer){

}

void EsEntity::readFromBuffer(EsMessageReader* reader){

}

void EsEntity::toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator){

}

void EsEntity::initFromFlattenedEsObject(void* esObject){
	auto obj = (ThriftFlattenedEsObject*)esObject;
	auto data = obj->encodedEntries;
	EsMessageReader reader((char*)data.data(), data.size());
	this->readFromBuffer(&reader);
}

void EsEntity::initFromFlattenedEsObjectRO(void* esObject){
	auto obj = (ThriftFlattenedEsObjectRO*)esObject;
	auto data = obj->encodedEntries;
	EsMessageReader reader((char*)data.data(), data.size());
	this->readFromBuffer(&reader);
}

void EsEntity::writeToFlattenedEsObject(void* esObject){
	es::EsMessageWriter writer;
	this->writeToBuffer(&writer);
	auto buffer = writer.getBuffer();

	auto thrift = (es::ThriftFlattenedEsObject*) esObject;
	thrift->encodedEntries.insert(thrift->encodedEntries.end(), buffer.begin(),
		buffer.end());
	thrift->__isset.encodedEntries = true;
}

void EsEntity::writeToFlattenedEsObjectRO(void* obj) {
	es::EsMessageWriter writer;
	this->writeToBuffer(&writer);
	auto buffer = writer.getBuffer();

	auto thrift = (es::ThriftFlattenedEsObjectRO*) obj;
	thrift->encodedEntries.insert(thrift->encodedEntries.end(), buffer.begin(),
		buffer.end());
	thrift->__isset.encodedEntries = true;
}

void EsEntity::printPadding(std::ostream &outStream, int padding){
	for (int i = 0; i < padding; i++) {
#if defined(ANDROID)
		outStream << "  ";
#else
		outStream << "\t";
#endif	
	}
}

void EsEntity::printDebug(){
	std::ostringstream outStream;
	this->printDebugToBuffer(outStream, 0);
	es::log_to_console(outStream.str().c_str());
}

void EsEntity::printDebugToBuffer(std::ostringstream &outStream, int padding){

}

EsEntity* EsEntity::createFromJson(const rapidjson::Value& value){
	return __create_entity(value);
}
   
} /* namespace es */
