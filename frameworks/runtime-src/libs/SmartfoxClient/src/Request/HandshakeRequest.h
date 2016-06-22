/*
 * HandshakeRequest.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_HANDSHAKEREQUEST_H_
#define SFSCLIENT_REQUEST_HANDSHAKEREQUEST_H_
#include "BaseRequest.h"

namespace SFS {
namespace Request{

class HandshakeRequest : public BaseRequest{
public:
	std::string version;
	std::string client;
	std::string reconnectionToken;
public:
	HandshakeRequest();
	virtual ~HandshakeRequest();

	virtual void toByteArray(std::vector<char> &bytes);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_HANDSHAKEREQUEST_H_ */
