/*
 * PluginMessageEvent.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_PLUGINMESSAGEEVENT_H_
#define ELECTROCLIENT_OBJECTS_PLUGINMESSAGEEVENT_H_
#include "BaseMessage.h"
#include "EsObject.h"

namespace es {

class PluginMessageEvent : public BaseMessage{
public:
	std::string pluginName;
	bool sentToRoom;
	int32_t destinationZoneId;
	int32_t destinationRoomId;
	bool roomLevelPlugin;
	int32_t originZoneId;
	int32_t originRoomId;
	EsObject* parameters;
public:
	PluginMessageEvent();
	virtual ~PluginMessageEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);

	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_PLUGINMESSAGEEVENT_H_ */
