/*
 * PublicMessageRequest.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "PublicMessageRequest.h"

#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"

#include "thrift/ThriftPublicMessageRequest_types.h"

namespace es {

PublicMessageRequest::PublicMessageRequest() {
	// TODO Auto-generated constructor stub
	messageType = es::type::PublicMessageRequest;

	zoneId = -1;
	roomId = -1;
	message = "";
	esObject = 0;
}

PublicMessageRequest::~PublicMessageRequest() {
	// TODO Auto-generated destructor stub
	if (esObject){
		delete esObject;
		esObject = 0;
	}
}

bool PublicMessageRequest::initWithBytes(const char* bytes, int len){
	return true;
}

void PublicMessageRequest::getBytes(std::vector<char> &buffer){
	BaseMessage::getBytes(buffer);

	ThriftPublicMessageRequest thriftObj;
	thriftObj.__set_roomId(roomId);
	thriftObj.__set_zoneId(zoneId);
	thriftObj.__set_message(message);
	if (esObject){
		esObject->writeToFlattenedEsObject(&thriftObj.esObject);
		thriftObj.__isset.esObject = true;
	}

	apache::thrift::transport::TMemoryBuffer transport;
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);
	thriftObj.write(&protocol);

	uint8_t* dataPtr;
	uint32_t len;
	transport.getBuffer(&dataPtr, &len);
	buffer.insert(buffer.end(), dataPtr, dataPtr + len);
}

void PublicMessageRequest::printDebug(){

}

} /* namespace es */
