/*
 * ExtensionRequest.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_EXTENSIONREQUEST_H_
#define SFSCLIENT_REQUEST_EXTENSIONREQUEST_H_
#include "BaseRequest.h"

namespace SFS {
namespace Request{

class ExtensionRequest : public BaseRequest{
protected:
	SFS::Entity::SFSObject* params;
public:
	int roomId;
	std::string cmd;
public:
	ExtensionRequest();
	virtual ~ExtensionRequest();
	virtual void setParams(SFS::Entity::SFSObject* params);

	virtual void toByteArray(std::vector<char> &bytes);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_EXTENSIONREQUEST_H_ */
