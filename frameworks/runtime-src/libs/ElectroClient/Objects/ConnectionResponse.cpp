/*
 * ConnectionResponse.cpp
 *
 *  Created on: Jan 20, 2016
 *      Author: QuyetNguyen
 */

#include "ConnectionResponse.h"
#include "thrift/ThriftConnectionResponse_types.h"

#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"

namespace es {

ConnectionResponse::ConnectionResponse() {
	// TODO Auto-generated constructor stub
	messageType = es::type::ConnectionResponse;

	successful = false;
	hashId = 0;
	error = 0;
	serverVersion = "";
}

ConnectionResponse::~ConnectionResponse() {

}

bool ConnectionResponse::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftConnectionResponse thriftObj;
	thriftObj.read(&protocol);

	this->successful = thriftObj.successful;
	this->hashId = thriftObj.hashId;
	this->error = thriftObj.error;
	this->serverVersion = thriftObj.serverVersion;
	protocolConfiguration.messageCompressionThreshold = thriftObj.protocolConfiguration.messageCompressionThreshold;

	return true;
}

void ConnectionResponse::getBytes(std::vector<char> &buffer){

}

} /* namespace es */
