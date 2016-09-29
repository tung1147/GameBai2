/*
 * JoinRoomEvent.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "JoinRoomEvent.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftJoinRoomEvent_types.h"
#include "../../ElectroLogger.h"

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


	//int zoneId;
	//int roomId;
	//std::string roomName;
	//std::string roomDescription;
	//bool hasPassword;
	//bool hidden;
	//int capacity;
	//std::vector<UserListEntry*> users;
	//std::vector<RoomVariable*> roomVariables;
	//std::vector<std::string> pluginHandles;

	//to json
	rapidjson::Document doc;
	doc.SetObject();
	doc.AddMember("messageType", messageType, doc.GetAllocator());
	doc.AddMember("zoneId", zoneId, doc.GetAllocator());
	doc.AddMember("roomName", roomName, doc.GetAllocator());
	doc.AddMember("roomDescription", roomDescription, doc.GetAllocator());
	doc.AddMember("hasPassword", hasPassword, doc.GetAllocator());
	doc.AddMember("hidden", hidden, doc.GetAllocator());
	doc.AddMember("capacity", capacity, doc.GetAllocator());

	rapidjson::Value usersValue(rapidjson::kArrayType);
	for (int i = 0; i < users.size(); i++){
		rapidjson::Value childValue;
		users[i]->toJson(childValue, doc.GetAllocator());
		usersValue.PushBack(childValue, doc.GetAllocator());
	}
	doc.AddMember("users", usersValue, doc.GetAllocator());

	rapidjson::Value roomVariables_value(rapidjson::kArrayType);
	for (int i = 0; i < roomVariables.size(); i++){
		rapidjson::Value childValue;
		roomVariables[i]->toJson(childValue, doc.GetAllocator());
		roomVariables_value.PushBack(childValue, doc.GetAllocator());
	}
	doc.AddMember("roomVariables", roomVariables_value, doc.GetAllocator());

	rapidjson::Value pluginHandles_value(rapidjson::kArrayType);
	for (int i = 0; i < pluginHandles.size(); i++){
		roomVariables_value.PushBack(rapidjson::Value(pluginHandles[i], doc.GetAllocator()), doc.GetAllocator());
	}
	doc.AddMember("pluginHandles", pluginHandles_value, doc.GetAllocator());

	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	doc.Accept(writer);
	jsonData = buffer.GetString();

	return true;
}

void JoinRoomEvent::printDebug(){
#ifdef ES_LOGGER
	es::log("zoneId: %d", zoneId);
	es::log("roomId: %d", roomId);
	es::log("roomName: %s", roomName.c_str());
	es::log("roomDescription: %s", roomDescription.c_str());
	es::log("capacity: %d", capacity);
#endif
}

} /* namespace es */
