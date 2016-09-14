/*
 * RoomListEntry.cpp
 *
 *  Created on: Feb 24, 2016
 *      Author: Quyet Nguyen
 */

#include "RoomListEntry.h"

namespace es {

RoomListEntry::RoomListEntry() {
	// TODO Auto-generated constructor stub
	roomId = -1;
	zoneId = -1;
	roomName = "";
	userCount = -1;
	roomDescription = "";
	capacity = -1;
	hasPassword = false;
}

RoomListEntry::~RoomListEntry() {
	// TODO Auto-generated destructor stub
}

void RoomListEntry::toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator){
	value.SetObject();
	value.AddMember("roomId", roomId, allocator);
	value.AddMember("zoneId", zoneId, allocator);
	value.AddMember("roomName", roomName, allocator);
	value.AddMember("userCount", userCount, allocator);
	value.AddMember("roomDescription", roomDescription, allocator);
	value.AddMember("capacity", capacity, allocator);
	value.AddMember("hasPassword", hasPassword, allocator);
}

void RoomListEntry::initFromThrift(void* data){

}

} /* namespace es */
