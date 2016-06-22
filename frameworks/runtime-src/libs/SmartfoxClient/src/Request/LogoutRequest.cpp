/*
 * LogoutRequest.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "LogoutRequest.h"

namespace SFS {
namespace Request{

LogoutRequest::LogoutRequest() {
	// TODO Auto-generated constructor stub
	messageType = MessageType::Logout;
}

LogoutRequest::~LogoutRequest() {
	// TODO Auto-generated destructor stub
}

void LogoutRequest::toByteArray(std::vector<char> &bytes){
	BaseRequest::toByteArray(bytes);
}

}
} /* namespace SFS */
