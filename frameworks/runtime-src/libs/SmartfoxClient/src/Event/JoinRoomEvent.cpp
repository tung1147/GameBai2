/*
 * JoinRoomEvent.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "JoinRoomEvent.h"
#include "../Core/SystemManager.h"

namespace SFS {
namespace Event{

JoinRoomEvent::JoinRoomEvent() {
	// TODO Auto-generated constructor stub
	isSuccess = false;
	errorCode = -1;
	roomId = -1;
	roomName = "";
}

JoinRoomEvent::~JoinRoomEvent() {
	// TODO Auto-generated destructor stub
}

void JoinRoomEvent::initWithSFSObject(SFS::Entity::SFSObject* object){
	BaseEvent::initWithSFSObject(object);

	BaseEvent::initWithSFSObject(object);

	if (contents->isExistKey("ec")){ //join room ok
		isSuccess = false;
		errorCode = contents->getShort("ec");
	}
	else{
		isSuccess = true;
		auto roomObj = contents->getSFSArray("r");
		roomId = roomObj->getInt(0);
		roomName = roomObj->getString(1);
		SystemManager::getInstance()->addRoom(roomId);
	}
}

}
} /* namespace SFS */
