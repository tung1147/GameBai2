/*
 * LoginEvent.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_EVENT_LOGINEVENT_H_
#define SFSCLIENT_EVENT_LOGINEVENT_H_
#include "BaseEvent.h"

namespace SFS {
namespace Event{

class LoginEvent : public BaseEvent{
public:
	bool isSuccess;
	int errorCode;
public:
	LoginEvent();
	virtual ~LoginEvent();

//	virtual void printDebug();
	virtual void initWithSFSObject(SFS::Entity::SFSObject* object);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_EVENT_LOGINEVENT_H_ */
