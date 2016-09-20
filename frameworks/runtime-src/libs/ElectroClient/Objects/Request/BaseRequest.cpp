/*
 * GatewayKickUserRequest.cpp
 *
 *  Created on: Jan 28, 2016
 *      Author: QuyetNguyen
 */

#include "BaseRequest.h"

namespace es {

BaseRequest::BaseRequest(){

}

BaseRequest::~BaseRequest(){

}

bool BaseRequest::initWithBytes(const char* bytes, int len){
	return true;
}

void BaseRequest::initWithJson(const rapidjson::Value& jsonData){

}

} /* namespace es */
