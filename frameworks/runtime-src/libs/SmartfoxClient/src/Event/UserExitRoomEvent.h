/*
 * UserExitRoomEvent.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_EVENT_USEREXITROOMEVENT_H_
#define SFSCLIENT_EVENT_USEREXITROOMEVENT_H_
#include "BaseEvent.h"

namespace SFS {
namespace Event{

class UserExitRoomEvent : public BaseEvent{
public:
	int userId;
public:
	UserExitRoomEvent();
	virtual ~UserExitRoomEvent();

	virtual void initWithSFSObject(SFS::Entity::SFSObject* object);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_EVENT_USEREXITROOMEVENT_H_ */
