/*
 * MessageJSON.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "MessageJSON.h"
#include "MessageType.h"
#include "../Logger/SFSLogger.h"
#include <functional>

namespace SFS {

SFS::Entity::SFSEntity* GenericMessageHandler(const rapidjson::Value& jsonValue){
	SFS::Entity::SFSObject* content = new SFS::Entity::SFSObject();
	content->autoRelease();
	content->setByte("t", jsonValue["t"].GetInt());
	content->setInt("r", jsonValue["r"].GetInt());
	content->setInt("u", jsonValue["u"].GetInt());
	content->setString("m", jsonValue["m"].GetString());
	if (jsonValue.HasMember("p")){
		content->setItem("p", SFS::Entity::__SFS_createObjectFromJSON(jsonValue["p"]));
	}
	return content;
}

static std::map<int, std::function<SFS::Entity::SFSEntity*(const rapidjson::Value&)>> s_json_handler;
static bool _json_handler_ready = false;
static void _init_json_handler(){
	s_json_handler.insert(std::make_pair(SFS::MessageType::GenericMessage, GenericMessageHandler));
}

MessageJSON::MessageJSON(){
	if (!_json_handler_ready){
		_init_json_handler();
		_json_handler_ready = false;
	}

	jsonContent = "";
}

MessageJSON::~MessageJSON(){

}

void MessageJSON::writeToBuffer(SFS::StreamWriter* writer){
	if (!contents){
		auto it = s_json_handler.find(this->messageType);
		if (it != s_json_handler.end()){
			rapidjson::Document doc;
			bool b = doc.Parse<0>(jsonContent.c_str()).HasParseError();
			if (!b){
				auto c = (SFS::Entity::SFSObject*)it->second(doc);
				this->setContents(c);
			}
			else{
#ifdef SFS_LOGGER
				SFS::log("error parse json");
#endif
			}
			
		}
		else{
			auto c = (SFS::Entity::SFSObject*)SFS::Entity::SFSEntity::createFromJSON(jsonContent);
			this->setContents(c);
		}

	}
	BaseMessage::writeToBuffer(writer);
}

void MessageJSON::printDebug(){
	if (!contents){
		auto c = (SFS::Entity::SFSObject*)SFS::Entity::SFSEntity::createFromJSON(jsonContent);
		this->setContents(c);
	}
	BaseMessage::printDebug();
}

void MessageJSON::setContents(Entity::SFSObject* _contents){
	BaseMessage::setContents(_contents);
	if (jsonContent == ""){
		jsonContent = contents->toJSON();
	}
}

const std::string& MessageJSON::getContentJSON(){
	return jsonContent;
}

void MessageJSON::setContentJSON(const std::string& json){
	jsonContent = json;
}

} /* namespace SFS */
