/*
 * PrivateMessageEvent.cpp
 *
 *  Created on: Feb 5, 2016
 *      Author: Quyet Nguyen
 */

#include "PrivateMessageEvent.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftPrivateMessageEvent_types.h"

namespace es {

PrivateMessageEvent::PrivateMessageEvent() {
	// TODO Auto-generated constructor stub
	esObject = 0;
}

PrivateMessageEvent::~PrivateMessageEvent() {
	// TODO Auto-generated destructor stub
	if (esObject){
		delete esObject;
		esObject = 0;
	}
}

bool PrivateMessageEvent::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftPrivateMessageEvent thriftObj;
	thriftObj.read(&protocol);

	this->userName = thriftObj.userName;
	this->message = thriftObj.message;
	if (thriftObj.__isset.esObject){
		esObject = new EsObject();
		esObject->initFromFlattenedEsObject(&thriftObj.esObject);
	}

	//to json
	rapidjson::Document doc;
	doc.SetObject();
	doc.AddMember("messageType", messageType, doc.GetAllocator());
	doc.AddMember("userName", userName, doc.GetAllocator());
	doc.AddMember("message", message, doc.GetAllocator());
	if (esObject){
		rapidjson::Value esObj;
		esObject->toJson(esObj, doc.GetAllocator());
		doc.AddMember("esObject", esObj, doc.GetAllocator());
	}

	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	doc.Accept(writer);
	jsonData = buffer.GetString();

	return true;
}

void PrivateMessageEvent::printDebug(){

}

} /* namespace es */
