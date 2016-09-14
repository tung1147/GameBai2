/*
 * UserEvictedFromRoomEvent.cpp
 *
 *  Created on: Feb 4, 2016
 *      Author: Quyet Nguyen
 */

#include "UserEvictedFromRoomEvent.h"
#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftUserEvictedFromRoomEvent_types.h"

namespace es {

UserEvictedFromRoomEvent::UserEvictedFromRoomEvent() {
	// TODO Auto-generated constructor stub

}

UserEvictedFromRoomEvent::~UserEvictedFromRoomEvent() {
	// TODO Auto-generated destructor stub
}

bool UserEvictedFromRoomEvent::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftUserEvictedFromRoomEvent thriftObj;
	thriftObj.read(&protocol);

	this->zoneId = thriftObj.zoneId;
	this->roomId = thriftObj.roomId;
	this->userName = thriftObj.userName;
	this->reason = thriftObj.reason;
	this->ban = thriftObj.ban;
	this->duration = thriftObj.duration;

	//
	//to json
	rapidjson::Document doc;
	doc.SetObject();
	doc.AddMember("messageType", messageType, doc.GetAllocator());
	doc.AddMember("zoneId", zoneId, doc.GetAllocator());
	doc.AddMember("roomId", roomId, doc.GetAllocator());
	doc.AddMember("userName", userName, doc.GetAllocator());
	doc.AddMember("reason", reason, doc.GetAllocator());
	doc.AddMember("ban", ban, doc.GetAllocator());
	doc.AddMember("duration", duration, doc.GetAllocator());

	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	doc.Accept(writer);
	jsonData = buffer.GetString();

	return true;
}

void UserEvictedFromRoomEvent::getBytes(std::vector<char> &buffer){

}

void UserEvictedFromRoomEvent::printDebug(){

}

} /* namespace es */
