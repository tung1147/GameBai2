/*
 * ServerKickUserEvent.cpp
 *
 *  Created on: Jan 28, 2016
 *      Author: QuyetNguyen
 */

#include "ServerKickUserEvent.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftServerKickUserEvent_types.h"

namespace es {

ServerKickUserEvent::ServerKickUserEvent() {
	// TODO Auto-generated constructor stub
	es::type::ServerKickUserEvent;
	esObject = 0;
}

ServerKickUserEvent::~ServerKickUserEvent() {
	// TODO Auto-generated destructor stub
	if (esObject){
		delete esObject;
		esObject = 0;
	}
}

bool ServerKickUserEvent::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftServerKickUserEvent thriftObj;
	thriftObj.read(&protocol);

	this->error = thriftObj.error;
	if (thriftObj.__isset.esObject){
		esObject = new EsObject();
		esObject->initFromFlattenedEsObjectRO(&thriftObj.esObject);
	}

	//to json
	rapidjson::Document doc;
	doc.SetObject();
	doc.AddMember("messageType", messageType, doc.GetAllocator());
	doc.AddMember("error", error, doc.GetAllocator());
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

void ServerKickUserEvent::getBytes(std::vector<char> &buffer){

}

void ServerKickUserEvent::printDebug(){

}

} /* namespace es */
