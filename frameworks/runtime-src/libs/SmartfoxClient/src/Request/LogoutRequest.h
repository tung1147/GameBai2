/*
 * LogoutRequest.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_LOGOUTREQUEST_H_
#define SFSCLIENT_REQUEST_LOGOUTREQUEST_H_
#include "BaseRequest.h"

namespace SFS {
namespace Request{

class LogoutRequest : public BaseRequest{
public:
	LogoutRequest();
	virtual ~LogoutRequest();
	virtual void toByteArray(std::vector<char> &bytes);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_LOGOUTREQUEST_H_ */
