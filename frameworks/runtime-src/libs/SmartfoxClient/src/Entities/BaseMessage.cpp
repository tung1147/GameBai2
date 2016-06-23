/*
 * BaseMessage.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "BaseMessage.h"

namespace SFS {

BaseMessage::BaseMessage() {
	// TODO Auto-generated constructor stub
	_header = 0x00;
	targetControler = 0;
	messageType = 0;
	contents = 0;
	data = 0;
}

BaseMessage::~BaseMessage() {
	// TODO Auto-generated destructor stub
	if (data){
		data->release();
		data = 0;
	}
}

std::string BaseMessage::toJSON(){
	return data->toJSON();
}

void BaseMessage::initFromJSON(const std::string& json){
	data = (SFS::Entity::SFSObject*)SFS::Entity::SFSEntity::createFromJSON(json);
}

} /* namespace SFS */
