/*
 * BaseRequest.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_BASEREQUEST_H_
#define SFSCLIENT_REQUEST_BASEREQUEST_H_

#include "../Core/BaseMessage.h"
namespace SFS {
namespace Request{

class BaseRequest : public BaseMessage{
public:
	BaseRequest();
	virtual ~BaseRequest();
	virtual void printDebug();

	virtual void toByteArray(std::vector<char> &bytes);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_BASEREQUEST_H_ */
