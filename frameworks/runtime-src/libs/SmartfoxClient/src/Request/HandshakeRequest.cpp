/*
 * HandshakeRequest.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "HandshakeRequest.h"

namespace SFS {
namespace Request{

HandshakeRequest::HandshakeRequest() {
	// TODO Auto-generated constructor stub
	messageType = MessageType::Handshake;

	version = "";
	client = "";
	reconnectionToken = "";
}

HandshakeRequest::~HandshakeRequest() {
	// TODO Auto-generated destructor stub
}

void HandshakeRequest::toByteArray(std::vector<char> &bytes){
	contents->setString("api", client);
	contents->setString("cl", version);
	contents->setBool("bin", true);
	if (reconnectionToken != ""){
		contents->setString("rt", reconnectionToken);
	}

	BaseRequest::toByteArray(bytes);
}

}
} /* namespace SFS */
