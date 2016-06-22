/*
 * JoinRoomEvent.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "JoinRoomEvent.h"

#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"

#include "thrift/ThriftJoinRoomEvent_types.h"

namespace es {

JoinRoomEvent::JoinRoomEvent() {
	// TODO Auto-generated constructor stub
	messageType = es::type::MessageType::JoinRoomEvent;

	zoneId = -1;
	roomId = -1;
	roomName = "";
	roomDescription = "";
	hasPassword = false;
	hidden = false;
	capacity = -1;
}

JoinRoomEvent::~JoinRoomEvent() {
	// TODO Auto-generated destructor stub
	for (int i = 0; i < users.size(); i++){
		delete users[i];
	}
	users.clear();

	for (int i = 0; i < roomVariables.size(); i++){
		delete roomVariables[i];
	}
	roomVariables.clear();
}

bool JoinRoomEvent::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftJoinRoomEvent thriftObj;
	thriftObj.read(&protocol);

	this->zoneId = thriftObj.zoneId;
	this->roomId = thriftObj.roomId;
	this->roomName = thriftObj.roomName;
	this->roomDescription = thriftObj.roomDescription;
	this->hasPassword = thriftObj.hasPassword;
	this->hidden = thriftObj.hidden;
	this->capacity = thriftObj.capacity;

	if (thriftObj.__isset.users){
		for (int i = 0; i < thriftObj.users.size(); i++){
			UserListEntry* _user = new UserListEntry();
			_user->initFromThrift(&thriftObj.users[i]);
			this->users.push_back(_user);
		}
	}

	if (thriftObj.__isset.roomVariables){
		for (int i = 0; i < thriftObj.roomVariables.size(); i++){
			RoomVariable* room = new RoomVariable();
			room->initFromThrift(&thriftObj.roomVariables[i]);
			this->roomVariables.push_back(room);
		}
	}

	return true;
}

void JoinRoomEvent::printDebug(){

}

} /* namespace es */
