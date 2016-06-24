/*
 * BaseMessage.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_CORE_BASEMESSAGE_H_
#define SFSCLIENT_CORE_BASEMESSAGE_H_
#include "../Entities/SFSEntity.h"
#include "../Entities/SFSObject.h"
#include "../Entities/SFSArray.h"

#define SFS_CONTROLLER_ID "c"
#define SFS_ACTION_ID "a"
#define SFS_PARAM_ID "p"

namespace SFS {

class BaseMessage : public SFSRef{
protected :
	Entity::SFSObject* contents;
public:
	int targetControler;
	int messageType;
public:
	BaseMessage();
	virtual ~BaseMessage();
	void writeToBuffer(SFS::StreamWriter* writer);
	virtual void printDebug();

	void setContents(Entity::SFSObject* contents);
	Entity::SFSObject* getContents();	
};

} /* namespace SFS */

#endif /* SFSCLIENT_CORE_BASEMESSAGE_H_ */
