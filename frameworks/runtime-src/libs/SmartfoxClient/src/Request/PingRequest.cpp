/*
 * PingRequest.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "PingRequest.h"
#include "../Core/MD5.h"

namespace SFS {
namespace Request{

PingRequest::PingRequest() {
// TODO Auto-generated constructor stub
	messageType = MessageType::PingPong;
}

PingRequest::~PingRequest() {
// TODO Auto-generated destructor stub

}

void PingRequest::toByteArray(std::vector<char> &bytes){
	BaseRequest::toByteArray(bytes);
}

}
} /* namespace SFS */
