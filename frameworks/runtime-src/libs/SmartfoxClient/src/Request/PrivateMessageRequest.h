/*
 * PrivateMessageRequest.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_PRIVATEMESSAGEREQUEST_H_
#define SFSCLIENT_REQUEST_PRIVATEMESSAGEREQUEST_H_
#include "BaseRequest.h"

namespace SFS {
namespace Request{

class PrivateMessageRequest : public BaseRequest{
protected:
	SFS::Entity::SFSObject* params;
public:
	int recipientId;
	std::string message;
	
public:
	PrivateMessageRequest();
	virtual ~PrivateMessageRequest();
	virtual void setParams(SFS::Entity::SFSObject* params);

	virtual void toByteArray(std::vector<char> &bytes);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_PRIVATEMESSAGEREQUEST_H_ */
