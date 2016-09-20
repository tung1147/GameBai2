/*
 * PublicMessageEvent.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_PUBLICMESSAGEEVENT_H_
#define ELECTROCLIENT_OBJECTS_PUBLICMESSAGEEVENT_H_
#include "BaseEvent.h"

namespace es {

class PublicMessageEvent : public BaseEvent{
public:

	std::string message;
	std::string userName;
	int zoneId;
	int roomId;
	EsObject* esObject;
public:
	PublicMessageEvent();
	virtual ~PublicMessageEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_PUBLICMESSAGEEVENT_H_ */
