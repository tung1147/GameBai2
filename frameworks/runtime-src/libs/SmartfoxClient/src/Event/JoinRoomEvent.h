/*
 * JoinRoomEvent.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_EVENT_JOINROOMEVENT_H_
#define SFSCLIENT_EVENT_JOINROOMEVENT_H_
#include "BaseEvent.h"

namespace SFS {
namespace Event{

class JoinRoomEvent : public BaseEvent{
public:
	bool isSuccess;
	int errorCode;
	int roomId;
	std::string roomName;
public:
	JoinRoomEvent();
	virtual ~JoinRoomEvent();
	virtual void initWithSFSObject(SFS::Entity::SFSObject* object);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_EVENT_JOINROOMEVENT_H_ */
