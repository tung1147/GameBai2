/*
 * LoginRequest.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "LoginRequest.h"
#include "../Core/MD5.h"

namespace SFS {
namespace Request{

LoginRequest::LoginRequest() {
	// TODO Auto-generated constructor stub
	messageType = MessageType::Login;

	zoneName = "";
	userName = "";
	password = "";
	param = 0;
}

LoginRequest::~LoginRequest() {
	// TODO Auto-generated destructor stub
	if (param){
		param->release();
		param = 0;
	}
}

void LoginRequest::setParams(SFS::Entity::SFSObject* obj){
	if (param){
		param->release();
		param = 0;
	}
	param = obj;
	if (param){
		param->retain();
	}
}

void LoginRequest::toByteArray(std::vector<char> &bytes){
	contents->setString("zn", zoneName);
	contents->setString("un", userName);
	contents->setString("pw", SFS::Utils::string_to_md5(password));
	if (param){
		contents->setSFSObject("p", param);
	}

	BaseRequest::toByteArray(bytes);
}

}
} /* namespace SFS */
