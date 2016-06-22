/*
 * EventManager.cpp
 *
 *  Created on: Jun 1, 2016
 *      Author: Quyet Nguyen
 */

#include "EventManager.h"
#include "../Core/RequestType.h"
#include <functional>

#include "ExtensionEvent.h"
#include "LoginEvent.h"
#include "JoinRoomEvent.h"

namespace SFS {
namespace Event{
	static std::map<int, std::function<BaseEvent*()>> s_event_handler = {
		{ MessageType::CallExtension, [](){return new ExtensionEvent(); } },
		{ MessageType::Login, [](){return new LoginEvent(); } },
		{ MessageType::JoinRoom, [](){return new JoinRoomEvent(); } },
	};


BaseEvent* EventManager::createWithSFSObject(SFS::Entity::SFSObject* object){
	BaseEvent* pret = 0;

	int messageType = object->getShort(SFS_ACTION_ID);
	auto it = s_event_handler.find(messageType);
	if (it != s_event_handler.end()){
		pret = it->second();
	}
	else{
		pret = new BaseEvent();
	}
	
	pret->initWithSFSObject(object);
	return pret;
}

}
} /* namespace SFS */
