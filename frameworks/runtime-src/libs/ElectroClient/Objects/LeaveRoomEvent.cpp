/*
 * LeaveRoomEvent.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "LeaveRoomEvent.h"

#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"

#include "thrift/ThriftLeaveRoomEvent_types.h"

namespace es {

LeaveRoomEvent::LeaveRoomEvent() {
	// TODO Auto-generated constructor stub
	messageType = es::type::LeaveRoomEvent;

	zoneId = -1;
	roomId = -1;
}

LeaveRoomEvent::~LeaveRoomEvent() {
	// TODO Auto-generated destructor stub
}

bool LeaveRoomEvent::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftLeaveRoomEvent thriftObj;
	thriftObj.read(&protocol);

	this->roomId = thriftObj.roomId;
	this->zoneId = thriftObj.zoneId;

	return true;
}

void LeaveRoomEvent::printDebug(){

}

} /* namespace es */
