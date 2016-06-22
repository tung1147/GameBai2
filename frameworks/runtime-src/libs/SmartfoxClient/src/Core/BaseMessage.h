/*
 * BaseMessage.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_CORE_BASEMESSAGE_H_
#define SFSCLIENT_CORE_BASEMESSAGE_H_
#include "RequestType.h"
#include "../Entities/SFSEntity.h"
#include "../Entities/SFSObject.h"
#include "../Entities/SFSArray.h"
#include "../Socket/NetworkCore.h"

#define SFS_CONTROLLER_ID "c"
#define SFS_ACTION_ID "a"
#define SFS_PARAM_ID "p"

namespace SFS {

class BaseMessage : public SocketData{
protected:
	char _header;

	int targetControler;
	int messageType;
	Entity::SFSObject* contents;
public:
	BaseMessage();
	virtual ~BaseMessage();

	virtual void toByteArray(std::vector<char> &bytes);
};

} /* namespace SFS */

#endif /* SFSCLIENT_CORE_BASEMESSAGE_H_ */
