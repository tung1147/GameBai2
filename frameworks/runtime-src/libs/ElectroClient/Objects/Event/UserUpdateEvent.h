/*
 * UserUpdateEvent.h
 *
 *  Created on: Feb 24, 2016
 *      Author: Quyet Nguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_USERUPDATEEVENT_H_
#define ELECTROCLIENT_OBJECTS_USERUPDATEEVENT_H_
#include "BaseEvent.h"
#include "UserVariable.h"

namespace es {
	class UserUpdateEvent : public BaseEvent{
	int32_t zoneId;
	int32_t roomId;
	//::es::ThriftUserUpdateAction::type action;
	std::string userName;
	std::vector<UserVariable*>  userVariables;
	bool sendingVideo;
	std::string videoStreamName;
public:
	UserUpdateEvent();
	virtual ~UserUpdateEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_USERUPDATEEVENT_H_ */
