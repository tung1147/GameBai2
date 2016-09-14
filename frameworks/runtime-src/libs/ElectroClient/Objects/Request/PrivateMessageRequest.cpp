/*
 * PrivateMessageRequest.cpp
 *
 *  Created on: Feb 5, 2016
 *      Author: Quyet Nguyen
 */

#include "PrivateMessageRequest.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftPrivateMessageRequest_types.h"

namespace es {

PrivateMessageRequest::PrivateMessageRequest() {
	// TODO Auto-generated constructor stub
	messageType = es::type::PrivateMessageRequest;

	esObject = 0;
	message = "";
}

PrivateMessageRequest::~PrivateMessageRequest() {
	// TODO Auto-generated destructor stub
	if (esObject){
		delete esObject;
		esObject = 0;
	}
}

bool PrivateMessageRequest::initWithBytes(const char* bytes, int len){
	return false;
}

void PrivateMessageRequest::getBytes(std::vector<char> &buffer){
	BaseMessage::getBytes(buffer);

	ThriftPrivateMessageRequest thriftObj;
	thriftObj.__set_message(this->message);
	if (userNames.size() > 0){
		for (int i = 0; i < userNames.size(); i++){
			thriftObj.userNames.push_back(userNames[i]);
		}
		thriftObj.__isset.userNames = true;
	}

	if (esObject){
		esObject->writeToFlattenedEsObject(&thriftObj.esObject);
	}

	apache::thrift::transport::TMemoryBuffer transport;
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);
	thriftObj.write(&protocol);

	uint8_t* dataPtr;
	uint32_t len;
	transport.getBuffer(&dataPtr, &len);
	buffer.insert(buffer.end(), dataPtr, dataPtr + len);
}

void PrivateMessageRequest::printDebug(){

}

} /* namespace es */
