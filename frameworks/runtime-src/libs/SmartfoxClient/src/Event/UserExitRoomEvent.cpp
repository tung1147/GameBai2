/*
 * UserExitRoomEvent.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "UserExitRoomEvent.h"
#include "../Core/SystemManager.h"

namespace SFS {
namespace Event{

UserExitRoomEvent::UserExitRoomEvent() {
	// TODO Auto-generated constructor stub
	userId = -1; 
}

UserExitRoomEvent::~UserExitRoomEvent() {
	// TODO Auto-generated destructor stub
}

void UserExitRoomEvent::initWithSFSObject(SFS::Entity::SFSObject* object){
	BaseEvent::initWithSFSObject(object);

	userId = contents->getInt("u", -1);
	int me = SystemManager::getInstance()->getUserId();
	if (userId == me){
		int roomId = contents->getInt("r", -1);
		SystemManager::getInstance()->removeRoom(roomId);
	}
}

}
} /* namespace SFS */
