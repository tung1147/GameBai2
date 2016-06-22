/*
 * PingRequest.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_PINGREQUEST_H_
#define SFSCLIENT_REQUEST_PINGREQUEST_H_
#include "BaseRequest.h"
namespace SFS {
namespace Request{

class PingRequest : public BaseRequest{
public:

public:
	PingRequest();
	virtual ~PingRequest();
	virtual void toByteArray(std::vector<char> &bytes);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_PINGREQUEST_H_ */
