/*
 * LoginEvent.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "LoginEvent.h"
#include "../Core/SystemManager.h"

namespace SFS {
namespace Event{

LoginEvent::LoginEvent() {
	// TODO Auto-generated constructor stub
	isSuccess = false;
	errorCode = -1;
}

LoginEvent::~LoginEvent() {
	// TODO Auto-generated destructor stub
}

//void LoginEvent::printDebug(){
//	BaseEvent::printDebug();0
//	BaseEvent::printDebugContent();
//}

void LoginEvent::initWithSFSObject(SFS::Entity::SFSObject* object){
	//error param "ep"
	BaseEvent::initWithSFSObject(object);

	if (contents->isExistKey("ec")){ //login ok
		isSuccess = false;
		errorCode = contents->getShort("ec");
	}
	else{
		isSuccess = true;

		int userId = contents->getInt("id", -1);
		SFS::SystemManager::getInstance()->setUserId(userId);
	}
}

}
} /* namespace SFS */
