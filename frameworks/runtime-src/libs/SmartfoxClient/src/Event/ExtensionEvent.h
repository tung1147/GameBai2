/*
 * ExtensionEvent.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_EVENT_EXTENSIONEVENT_H_
#define SFSCLIENT_EVENT_EXTENSIONEVENT_H_
#include "BaseEvent.h"

namespace SFS {
namespace Event{

class ExtensionEvent : public BaseEvent{
public:
	std::string cmd;
public:
	ExtensionEvent();
	virtual ~ExtensionEvent();
	virtual void printDebug();

	virtual void initWithSFSObject(SFS::Entity::SFSObject* object);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_EVENT_EXTENSIONEVENT_H_ */
