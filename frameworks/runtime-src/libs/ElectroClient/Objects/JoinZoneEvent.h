/*
 * JoinZoneEvent.h
 *
 *  Created on: Feb 24, 2016
 *      Author: Quyet Nguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_JOINZONEEVENT_H_
#define ELECTROCLIENT_OBJECTS_JOINZONEEVENT_H_

#include "BaseMessage.h"

namespace es {

class JoinZoneEvent : public BaseMessage{
public:
	JoinZoneEvent();
	virtual ~JoinZoneEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_JOINZONEEVENT_H_ */
