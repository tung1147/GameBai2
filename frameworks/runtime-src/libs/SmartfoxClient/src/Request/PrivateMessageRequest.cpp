/*
 * PrivateMessageRequest.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "PrivateMessageRequest.h"

namespace SFS {
namespace Request{

PrivateMessageRequest::PrivateMessageRequest() {
	// TODO Auto-generated constructor stub
	messageType = MessageType::PrivateMessage;

	recipientId = -1;
	message = "";
	params = 0;
}

PrivateMessageRequest::~PrivateMessageRequest() {
	// TODO Auto-generated destructor stub
	if (params){
		params->release();
		params = 0;
	}
}

void PrivateMessageRequest::setParams(SFS::Entity::SFSObject* obj){
	if (params){
		params->release();
		params = 0;
	}

	params = obj;
	if (params){
		params->retain();
	}
}

void PrivateMessageRequest::toByteArray(std::vector<char> &bytes){
	contents->setByte("t", 1); // messagetype private
	contents->setInt("rc", recipientId);
	contents->setString("m", message);
	if (params){
		contents->setSFSObject("p", params);
	}

	BaseRequest::toByteArray(bytes);
}

}
} /* namespace SFS */
