/*
 * JsonRequest.cpp
 *
 *  Created on: Jan 28, 2016
 *      Author: QuyetNguyen
 */

#include "JsonRequest.h"
#include "../../ElectroLogger.h"
#include <functional>
#include "JoinRoomRequest.h"
#include "LeaveRoomRequest.h"
#include "LoginRequest.h"
#include "LogoutRequest.h"
#include "PingRequest.h"
#include "PluginRequest.h"
#include "PrivateMessageRequest.h"
#include "PublicMessageRequest.h"

namespace es {
	static std::map<int, std::function<BaseRequest*()>> s_request_handler = {
		{ es::type::MessageType::JoinGameRequest, [](){return new JoinRoomRequest(); } },
		{ es::type::MessageType::LeaveRoomRequest, [](){return new LeaveRoomRequest(); } },
		{ es::type::MessageType::LoginRequest, [](){return new LoginRequest(); } },
		{ es::type::MessageType::LogOutRequest, [](){return new LogoutRequest(); } },
		{ es::type::MessageType::PingRequest, [](){return new PingRequest(); } },
		{ es::type::MessageType::PluginRequest, [](){return new PluginRequest(); } },
		{ es::type::MessageType::PrivateMessageRequest, [](){return new PrivateMessageRequest(); } },
		{ es::type::MessageType::PublicMessageRequest, [](){return new PublicMessageRequest(); } }
	};

	static BaseRequest* _get_request(int requestId){
		auto it = s_request_handler.find(requestId);
		if (it != s_request_handler.end()){
			return (it->second)();
		}
		return 0;
	}


JsonRequest::JsonRequest(){
	requestType = -1;
}

JsonRequest::~JsonRequest(){

}

void JsonRequest::setJson(const std::string& json){
	_json = json;
}

void JsonRequest::getBytes(std::vector<char> &buffer){
	if (_json != ""){
		rapidjson::Document doc;
		bool error = doc.Parse<0>(_json.c_str()).HasParseError();
		if (!error && doc.IsObject()){
			if (doc.HasMember("messageType") && doc["messageType"].IsNumber()){
				requestType = doc["messageType"].GetInt();
				auto request = _get_request(requestType);
				if (request){
					request->initWithJson(doc);
					request->getBytes(buffer);
					requestSize = buffer.size();
					request->release();
					return;
				}
			}
		}
	}
#ifdef ES_LOGGER
	es::log("error parse json");
#endif
}

void JsonRequest::printDebug(){
#ifdef ES_LOGGER
	es::log("SEND message[%s] - %d bytes", es::type::messageTypeName(requestType), requestSize);
#endif
}

} /* namespace es */
