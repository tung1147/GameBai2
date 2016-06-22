/*
 * EventManager.h
 *
 *  Created on: Jun 1, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_EVENT_EVENTMANAGER_H_
#define SFSCLIENT_EVENT_EVENTMANAGER_H_
#include "BaseEvent.h"
#include "../Entities/SFSObject.h"

namespace SFS {
namespace Event{

class EventManager {
public:
	static BaseEvent* createWithSFSObject(SFS::Entity::SFSObject* object);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_EVENT_EVENTMANAGER_H_ */
