/*
 * PrivateMessageRequest.cpp
 *
 *  Created on: Feb 5, 2016
 *      Author: Quyet Nguyen
 */

#include "PrivateMessageRequest.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftPrivateMessageRequest_types.h"

namespace es {

PrivateMessageRequest::PrivateMessageRequest() {
	// TODO Auto-generated constructor stub
	messageType = es::type::PrivateMessageRequest;

	esObject = 0;
	message = "";
}

PrivateMessageRequest::~PrivateMessageRequest() {
	// TODO Auto-generated destructor stub
	if (esObject){
		delete esObject;
		esObject = 0;
	}
}

bool PrivateMessageRequest::initWithBytes(const char* bytes, int len){
	return false;
}

void PrivateMessageRequest::initWithJson(const rapidjson::Value& jsonData){
	/*std::string message;
	std::vector<std::string>  userNames;
	EsObject* esObject;*/

	if (jsonData.HasMember("message") && jsonData["message"].IsString()){
		message = jsonData["message"].GetString();
	}

	if (jsonData.HasMember("userNames") && jsonData["userNames"].IsArray()){
		const rapidjson::Value& data = jsonData["userNames"];
		bool flag = true;
		for (int i = 0; i < data.Size(); i++){
			if (!data[i].IsString()){
				flag = false;
				break;
			}
		}
		if (flag){
			for (int i = 0; i < data.Size(); i++){
				std::string user = data[i].GetString(); 
				userNames.push_back(user);
			}
		}
	}

	if (jsonData.HasMember("esObject") && jsonData["esObject"].IsObject()){
		esObject = (EsObject*)EsEntity::createFromJson(jsonData["esObject"]);
	}
}

void PrivateMessageRequest::getBytes(std::vector<char> &buffer){
	BaseMessage::getBytes(buffer);

	ThriftPrivateMessageRequest thriftObj;
	thriftObj.__set_message(this->message);
	if (userNames.size() > 0){
		for (int i = 0; i < userNames.size(); i++){
			thriftObj.userNames.push_back(userNames[i]);
		}
		thriftObj.__isset.userNames = true;
	}

	if (esObject){
		esObject->writeToFlattenedEsObject(&thriftObj.esObject);
	}

	apache::thrift::transport::TMemoryBuffer transport;
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);
	thriftObj.write(&protocol);

	uint8_t* dataPtr;
	uint32_t len;
	transport.getBuffer(&dataPtr, &len);
	buffer.insert(buffer.end(), dataPtr, dataPtr + len);
}

void PrivateMessageRequest::printDebug(){

}

} /* namespace es */
