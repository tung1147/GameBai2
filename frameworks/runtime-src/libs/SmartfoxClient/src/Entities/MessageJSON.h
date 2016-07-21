/*
 * MessageJSON.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_CORE_MESSAGE_JSON_H_
#define SFSCLIENT_CORE_MESSAGE_JSON_H_
#include "BaseMessage.h"
#include <string>

namespace SFS {
class MessageJSON : public BaseMessage{
	std::string jsonContent;
public:
	MessageJSON();
	virtual ~MessageJSON();

	virtual void writeToBuffer(SFS::StreamWriter* writer);
	virtual void printDebug();
	virtual void setContents(Entity::SFSObject* contents);

	const std::string& getContentJSON();
	void setContentJSON(const std::string& json);
};

} /* namespace SFS */

#endif /* SFSCLIENT_CORE_MESSAGE_JSON_H_ */
