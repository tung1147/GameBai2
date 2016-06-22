/*
 * LogoutRequest.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "LogoutRequest.h"

#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"

#include "thrift/ThriftLogOutRequest_types.h"

namespace es {

LogoutRequest::LogoutRequest() {
	// TODO Auto-generated constructor stub
	messageType = es::type::LogOutRequest;

	dropConnection = false;
	dropAllConnections = false;
}

LogoutRequest::~LogoutRequest() {
	// TODO Auto-generated destructor stub
}

bool LogoutRequest::initWithBytes(const char* bytes, int len){
	return true;
}

void LogoutRequest::getBytes(std::vector<char> &buffer){
	BaseMessage::getBytes(buffer);
	
	ThriftLogOutRequest thriftObj;
	thriftObj.__set_dropAllConnections(dropAllConnections);
	thriftObj.__set_dropConnection(dropConnection);

	apache::thrift::transport::TMemoryBuffer transport;
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);
	thriftObj.write(&protocol);

	uint8_t* dataPtr;
	uint32_t len;
	transport.getBuffer(&dataPtr, &len);
	buffer.insert(buffer.end(), dataPtr, dataPtr + len);
}

void LogoutRequest::printDebug(){

}

} /* namespace es */
