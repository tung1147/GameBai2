/*
 * UserListEntry.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "UserListEntry.h"
#include "../thrift/ThriftUserListEntry_types.h"

namespace es{

UserListEntry::UserListEntry() {
	// TODO Auto-generated constructor stub
	userName = "";
	sendingVideo = false;
	videoStreamName = "";
	roomOperator = false;;
}

UserListEntry::~UserListEntry() {
	// TODO Auto-generated destructor stub
	for (int i = 0; i < userVariables.size();i++){
		delete userVariables[i];
	}
	userVariables.clear();
}

void UserListEntry::toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator){
	value.SetObject();
	value.AddMember("userName", userName, allocator);
	value.AddMember("sendingVideo", sendingVideo, allocator);
	value.AddMember("videoStreamName", videoStreamName, allocator);
	value.AddMember("roomOperator", roomOperator, allocator);

	rapidjson::Value userVariables_value(rapidjson::kArrayType);
	for (int i = 0; i < userVariables.size(); i++){
		rapidjson::Value childValue;
		userVariables[i]->toJson(childValue, allocator);
		userVariables_value.PushBack(childValue, allocator);
	}
	value.AddMember("roomOperator", userVariables_value, allocator);
}

void UserListEntry::initFromThrift(void* thrift){
	auto obj = (ThriftUserListEntry*)thrift;
	this->userName = obj->userName;
	this->sendingVideo = obj->sendingVideo;
	this->videoStreamName = obj->videoStreamName;
	this->roomOperator = obj->roomOperator;

	if (obj->__isset.userVariables){
		for (int i = 0; i < obj->userVariables.size(); i++){
			UserVariable* user_var = new UserVariable();
			user_var->initFromThrift(&obj->userVariables[i]);
			this->userVariables.push_back(user_var);
		}
	}
}

void UserListEntry::toThrift(void* thrift){
	auto obj = (ThriftUserListEntry*)thrift;

	obj->__set_userName(userName);
	obj->__set_sendingVideo(sendingVideo);
	obj->__set_videoStreamName(videoStreamName);
	obj->__set_roomOperator(roomOperator);

	if (userVariables.size() > 0){
		for (int i = 0; i < userVariables.size(); i++){
			ThriftUserVariable user_var;
			userVariables[i]->toThrift(&user_var);
			obj->userVariables.push_back(user_var);
		}

		obj->__isset.userVariables = true;
	}
}

}


