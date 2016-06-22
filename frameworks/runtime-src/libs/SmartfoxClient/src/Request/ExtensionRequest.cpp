/*
 * ExtensionRequest.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "ExtensionRequest.h"

namespace SFS {
namespace Request{

ExtensionRequest::ExtensionRequest() {
	// TODO Auto-generated constructor stub
	messageType = MessageType::CallExtension;

	roomId = -1;
	cmd = "";
	params = 0;
}

ExtensionRequest::~ExtensionRequest() {
	// TODO Auto-generated destructor stub
	if (params){
		params->release();
		params = 0;
	}
}

void ExtensionRequest::setParams(SFS::Entity::SFSObject* obj){
	if (params){
		params->release();
		params = 0;
	}

	params = obj;
	if (params){
		params->retain();
	}
}

void ExtensionRequest::toByteArray(std::vector<char> &bytes){
	contents->setString("c", cmd);
	contents->setInt("r", roomId);
	if (params){
		contents->setSFSObject("p", params);
	}

	BaseRequest::toByteArray(bytes);
}

}
} /* namespace SFS */
