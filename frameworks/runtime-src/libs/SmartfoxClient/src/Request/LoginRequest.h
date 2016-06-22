/*
 * LoginRequest.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_LOGINREQUEST_H_
#define SFSCLIENT_REQUEST_LOGINREQUEST_H_
#include "BaseRequest.h"
namespace SFS {
namespace Request{

class LoginRequest : public BaseRequest{
protected:
	SFS::Entity::SFSObject* param;
public:
	std::string zoneName;
	std::string userName;
	std::string password;
public:
	LoginRequest();
	virtual ~LoginRequest();
	virtual void setParams(SFS::Entity::SFSObject* param);

	virtual void toByteArray(std::vector<char> &bytes);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_LOGINREQUEST_H_ */
