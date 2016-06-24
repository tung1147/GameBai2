/*
 * BaseMessage.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "BaseMessage.h"
#include "../Logger/SFSLogger.h"
#include "MessageType.h"

namespace SFS {

BaseMessage::BaseMessage() {
	// TODO Auto-generated constructor stub
	targetControler = 0;
	messageType = 0;
	contents = 0;
}

BaseMessage::~BaseMessage() {
	// TODO Auto-generated destructor stub
	if (contents){
		contents->release();
		contents = 0;
	}
}

void BaseMessage::writeToBuffer(SFS::StreamWriter* writer){
	if (messageType == MessageType::CallExtension){
		targetControler = 1;
	}

	SFS::Entity::SFSObject obj;
	obj.setByte(SFS_CONTROLLER_ID, targetControler);
	obj.setShort(SFS_ACTION_ID, messageType);
	if (contents && contents->size() > 0){
		obj.setSFSObject(SFS_PARAM_ID, contents);
	}
	obj.writeToBuffer(writer);
	writer->WriteHeader();
}

void BaseMessage::printDebug(){
	SFS::log("TargetControler = [%d]", targetControler);
	SFS::log("Type = [%s]", _request_type_name(messageType));
	if (contents){
		SFS::log("Content : ");
		std::ostringstream stream;
		contents->printDebug(stream, 0);
		SFS::log_to_console(stream.str().c_str());
		SFS::log_to_console("\n");
	}
}

void BaseMessage::setContents(Entity::SFSObject* obj){
	if (contents){
		contents->release();
		contents = 0;
	}
	contents = obj;
	if (contents){
		contents->retain();
	}
}

Entity::SFSObject* BaseMessage::getContents(){
	return contents;
}

} /* namespace SFS */
