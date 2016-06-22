/*
 * BaseEvent.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_EVENT_BASEEVENT_H_
#define SFSCLIENT_EVENT_BASEEVENT_H_
#include "../Core/BaseMessage.h"

namespace SFS {
namespace Event{

class BaseEvent : public BaseMessage{
protected:
	virtual void printDebugContent();
public:
	BaseEvent();
	virtual ~BaseEvent();

	int getType();
	SFS::Entity::SFSObject* getParam();

	virtual void printDebug();
	virtual void initWithSFSObject(SFS::Entity::SFSObject* object);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_EVENT_BASEEVENT_H_ */
