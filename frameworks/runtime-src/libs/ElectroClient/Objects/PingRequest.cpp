/*
 * PingRequest.cpp
 *
 *  Created on: Jan 29, 2016
 *      Author: QuyetNguyen
 */

#include "PingRequest.h"
#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"
//#include "cocos2d.h"

#include "thrift/ThriftPingRequest_types.h"


namespace es {

PingRequest::PingRequest() {
	// TODO Auto-generated constructor stub
	messageType = es::type::PingRequest;
    
	globalResponseRequested = false;
	sessionKey = -1;
	pingRequestId = -1;

	globalResponseRequested_set = false;
	sessionKey_set = false;
	pingRequestId_set = false;
}

PingRequest::~PingRequest() {
	// TODO Auto-generated destructor stub
}

bool PingRequest::initWithBytes(const char* bytes, int len){

	return true;
}

void PingRequest::getBytes(std::vector<char> &buffer){
	BaseMessage::getBytes(buffer);

	ThriftPingRequest thriftObj;
	if (globalResponseRequested_set){
		thriftObj.__set_globalResponseRequested(globalResponseRequested);
	}
	
	if (sessionKey_set){
		thriftObj.__set_pingRequestId(pingRequestId);
	}
	
	if (pingRequestId_set){
		thriftObj.__set_sessionKey(sessionKey);
	}	

	apache::thrift::transport::TMemoryBuffer transport;
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);
	thriftObj.write(&protocol);

	uint8_t* dataPtr;
	uint32_t len;
	transport.getBuffer(&dataPtr, &len);
	buffer.insert(buffer.end(), dataPtr, dataPtr + len);
}

void PingRequest::printDebug(){

}

} /* namespace es */
