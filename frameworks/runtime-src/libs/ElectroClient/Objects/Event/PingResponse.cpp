/*
 * PingResponse.cpp
 *
 *  Created on: Jan 29, 2016
 *      Author: QuyetNguyen
 */

#include "PingResponse.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftPingResponse_types.h"

namespace es {

PingResponse::PingResponse() {
	// TODO Auto-generated constructor stub
	messageType = es::type::PingResponse;
	globalResponseRequested = false;
	pingRequestId = -1;
}

PingResponse::~PingResponse() {
	// TODO Auto-generated destructor stub
}

bool PingResponse::initWithBytes(const char* bytes, int len){

	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftPingResponse thriftObj;
	thriftObj.read(&protocol);

	if (thriftObj.__isset.globalResponseRequested){
		this->globalResponseRequested = thriftObj.globalResponseRequested;
	}
	
	if (thriftObj.__isset.pingRequestId){
		this->pingRequestId = thriftObj.pingRequestId;
	}

	//to json

	rapidjson::Document doc;
	doc.SetObject();
	doc.AddMember("messageType", messageType, doc.GetAllocator());
	doc.AddMember("globalResponseRequested", globalResponseRequested, doc.GetAllocator());
	doc.AddMember("pingRequestId", pingRequestId, doc.GetAllocator());

	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	doc.Accept(writer);
	jsonData = buffer.GetString();

	return true;
}

void PingResponse::printDebug(){

}

} /* namespace es */
