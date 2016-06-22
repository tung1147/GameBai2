/*
 * BaseEvent.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "BaseEvent.h"
#include "../Logger/SFSLogger.h"
#include "../Core/RequestType.h"

namespace SFS {
namespace Event{

BaseEvent::BaseEvent() {
	// TODO Auto-generated constructor stub

}

BaseEvent::~BaseEvent() {
	// TODO Auto-generated destructor stub
}

void BaseEvent::printDebugContent(){
#ifdef SFS_PRINT_DEBUG
	SFS::log("param:");
	if (contents){
		std::ostringstream outStream;
		contents->printDebug(outStream, 0);
		SFS::log_to_console(outStream.str().c_str());
	}
#endif
}

void BaseEvent::printDebug(){
#ifdef SFS_PRINT_DEBUG
	SFS::log("RECV [%s]", _request_type_name(messageType));
//	this->printDebugContent();
#endif
}

int BaseEvent::getType(){
	return messageType;
}

SFS::Entity::SFSObject* BaseEvent::getParam(){
	return contents;
}

void BaseEvent::initWithSFSObject(SFS::Entity::SFSObject* object){
	targetControler = object->getByte(SFS_CONTROLLER_ID);
	messageType = object->getShort(SFS_ACTION_ID);
	contents = object->getSFSObject(SFS_PARAM_ID);
	if (contents){
		contents->retain();
	}
}

}
} /* namespace SFS */
