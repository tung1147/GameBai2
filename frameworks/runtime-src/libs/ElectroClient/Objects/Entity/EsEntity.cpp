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

namespace es {

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

void EsEntity::printDebug(){
	std::ostringstream outStream;
	this->printDebugToBuffer(outStream, 0);
	es::log_to_console(outStream.str().c_str());
}

void EsEntity::printDebugToBuffer(std::ostringstream &outStream, int padding){

}

   
} /* namespace es */
