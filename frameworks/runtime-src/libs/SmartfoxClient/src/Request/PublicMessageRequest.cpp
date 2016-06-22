/*
 * PublicMessageRequest.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "PublicMessageRequest.h"
#include "../Core/SystemManager.h"

namespace SFS {
namespace Request{

PublicMessageRequest::PublicMessageRequest() {
	// TODO Auto-generated constructor stub
	messageType = MessageType::PublicMessage;

	roomId = -1;
	params = 0;
}

PublicMessageRequest::~PublicMessageRequest() {
	// TODO Auto-generated destructor stub
	if (params){
		params->release();
		params = 0;
	}
}

void PublicMessageRequest::toByteArray(std::vector<char> &bytes){
	int userId = SystemManager::getInstance()->getUserId();
	if (roomId < 0){
		roomId = SystemManager::getInstance()->getLastRoom();
	}

	contents->setByte("t", 0); // messagetype public
	contents->setInt("r", roomId);
	contents->setInt("u", userId);
	contents->setString("m", message);
	if (params){
		contents->setSFSObject("p", params);
	}

	BaseRequest::toByteArray(bytes);
}

void PublicMessageRequest::setParams(SFS::Entity::SFSObject* obj){
	if (params){
		params->release();
		params = 0;
	}
	params - obj;
	if (params){
		params->retain();
	}
}

}
} /* namespace SFS */
