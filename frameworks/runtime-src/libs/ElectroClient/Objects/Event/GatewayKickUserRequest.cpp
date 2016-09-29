/*
 * GatewayKickUserRequest.cpp
 *
 *  Created on: Jan 28, 2016
 *      Author: QuyetNguyen
 */

#include "GatewayKickUserRequest.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftGatewayKickUserRequest_types.h"
#include "../../ElectroLogger.h"

namespace es {

GatewayKickUserRequest::GatewayKickUserRequest() {
	// TODO Auto-generated constructor stub
	messageType = es::type::MessageType::GatewayKickUserRequest;
	esObject = 0;
}

GatewayKickUserRequest::~GatewayKickUserRequest() {
	// TODO Auto-generated destructor stub
	if (esObject){
		delete esObject;
		esObject = 0;
	}
}

bool GatewayKickUserRequest::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftGatewayKickUserRequest thriftObj;
	int xfer = thriftObj.read(&protocol);

	this->clientId = thriftObj.clientId;
	this->error = thriftObj.error;
	if (thriftObj.__isset.esObject){
		esObject = new EsObject();
		esObject->initFromFlattenedEsObjectRO(&thriftObj.esObject);
	}

	//to json
	rapidjson::Document doc;
	doc.SetObject();
	doc.AddMember("messageType", messageType, doc.GetAllocator());
	doc.AddMember("clientId", clientId, doc.GetAllocator());
	doc.AddMember("error", error, doc.GetAllocator());
	if (esObject){
		rapidjson::Value value;
		esObject->toJson(value, doc.GetAllocator());
		doc.AddMember("esObject", value, doc.GetAllocator());
	}

	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	doc.Accept(writer);
	jsonData = buffer.GetString();

	return true;
}

void GatewayKickUserRequest::getBytes(std::vector<char> &buffer){
#ifdef ES_LOGGER
	es::log("clientId : %d", clientId);
	es::log("error : %d", error);
#endif
}

void GatewayKickUserRequest::printDebug(){

}

} /* namespace es */
