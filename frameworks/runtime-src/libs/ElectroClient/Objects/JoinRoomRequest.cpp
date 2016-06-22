/*
 * JoinRoomRequest.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "JoinRoomRequest.h"

#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"

#include "thrift/ThriftJoinRoomRequest_types.h"

namespace es {

JoinRoomRequest::JoinRoomRequest() {
	// TODO Auto-generated constructor stub
	messageType = es::type::JoinRoomRequest;

	zoneName = "";
	roomName = "";
	zoneId = -1;
	roomId = -1;
	password = "";
	receivingRoomListUpdates = true;
	receivingRoomAttributeUpdates = true;
	receivingRoomVariableUpdates = true;
	receivingUserListUpdates = true;
	receivingUserVariableUpdates = true;
	receivingVideoEvents = true;
}

JoinRoomRequest::~JoinRoomRequest() {
	// TODO Auto-generated destructor stub
}

bool JoinRoomRequest::initWithBytes(const char* bytes, int len){
	return true;
}

void JoinRoomRequest::getBytes(std::vector<char> &buffer){
	BaseMessage::getBytes(buffer);

	ThriftJoinRoomRequest thriftObj;

	if (zoneName != ""){
		thriftObj.__set_zoneName(zoneName);
	}

	if (roomName != ""){
		thriftObj.__set_roomName(roomName);
	}

	if (password != ""){
		thriftObj.__set_password(password);
	}

	thriftObj.__set_zoneId(zoneId);
	thriftObj.__set_roomId(roomId);

	thriftObj.__set_receivingRoomListUpdates(receivingRoomListUpdates);
	thriftObj.__set_receivingRoomAttributeUpdates(receivingRoomAttributeUpdates);
	thriftObj.__set_receivingRoomVariableUpdates(receivingRoomVariableUpdates);
	thriftObj.__set_receivingUserListUpdates(receivingUserListUpdates);
	thriftObj.__set_receivingUserVariableUpdates(receivingUserVariableUpdates);
	thriftObj.__set_receivingVideoEvents(receivingVideoEvents);

	apache::thrift::transport::TMemoryBuffer transport;
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);
	thriftObj.write(&protocol);
	uint8_t* dataPtr;
	uint32_t len;
	transport.getBuffer(&dataPtr, &len);
	buffer.insert(buffer.end(), dataPtr, dataPtr + len);
}

void JoinRoomRequest::printDebug(){

}

} /* namespace es */
