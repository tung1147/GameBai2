/*
 * ZoneUpdateEvent.cpp
 *
 *  Created on: Feb 24, 2016
 *      Author: Quyet Nguyen
 */

#include "ZoneUpdateEvent.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftZoneUpdateEvent_types.h"

namespace es {

ZoneUpdateEvent::ZoneUpdateEvent() {
	// TODO Auto-generated constructor stub
	zoneId = 0;
	roomId = 0;
	roomCount = 0;
	roomListEntry = 0;
}

ZoneUpdateEvent::~ZoneUpdateEvent() {
	// TODO Auto-generated destructor stub
	if (roomListEntry){
		delete roomListEntry;
		roomListEntry = 0;
	}
}

bool ZoneUpdateEvent::initWithBytes(const char* bytes, int len){

	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftZoneUpdateEvent thriftObj;
	thriftObj.read(&protocol);

	zoneId = thriftObj.zoneId;
	roomId = thriftObj.roomId;
	roomCount = thriftObj.roomCount;
	action = (es::type::ZoneUpdateAction)thriftObj.action;
	if (thriftObj.__isset.roomListEntry){
		roomListEntry = new RoomListEntry();
		roomListEntry->initFromThrift(&thriftObj.roomListEntry);
	}

	//to json
	rapidjson::Document doc;
	doc.SetObject();
	doc.AddMember("messageType", messageType, doc.GetAllocator());
	doc.AddMember("zoneId", zoneId, doc.GetAllocator());
	doc.AddMember("action", action, doc.GetAllocator());
	doc.AddMember("roomId", roomId, doc.GetAllocator());
	doc.AddMember("roomCount", roomCount, doc.GetAllocator());
	
	if (roomListEntry){
		rapidjson::Value roomListEntry_value;
		roomListEntry->toJson(roomListEntry_value, doc.GetAllocator());
		doc.AddMember("roomListEntry", roomListEntry_value, doc.GetAllocator());
	}
	
	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	doc.Accept(writer);
	jsonData = buffer.GetString();

	return true;
}

void ZoneUpdateEvent::getBytes(std::vector<char> &buffer){

}

void ZoneUpdateEvent::printDebug(){

}

} /* namespace es */
