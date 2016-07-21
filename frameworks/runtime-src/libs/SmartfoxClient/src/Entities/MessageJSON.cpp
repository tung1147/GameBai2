/*
 * MessageJSON.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "MessageJSON.h"

namespace SFS {

MessageJSON::MessageJSON(){
	jsonContent = "";
}

MessageJSON::~MessageJSON(){

}

void MessageJSON::writeToBuffer(SFS::StreamWriter* writer){
	if (!contents){
		auto c = (SFS::Entity::SFSObject*)SFS::Entity::SFSEntity::createFromJSON(jsonContent);
		this->setContents(c);
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

void MessageJSON::setContents(Entity::SFSObject* c){
	BaseMessage::setContents(contents);
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
