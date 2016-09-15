/*
 * LoginRequest.cpp
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#include "LoginRequest.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftLoginRequest_types.h"
#include "../../ElectroLogger.h"

namespace es {

LoginRequest::LoginRequest() {
	// TODO Auto-generated constructor stub
	messageType = es::type::LoginRequest;

	esObject = 0; 
	userName = "";
	password = "";
	sharedSecret = "";

//	clientType = "cocos2dx";

//	clientType = "CSharpUnity";
	
	clientType = "QuyetNguyen";
	clientVersion = "5.4.1";
}

LoginRequest::~LoginRequest() {
	// TODO Auto-generated destructor stub

	if (esObject){
		delete esObject;
		esObject = 0;
	}

	for (auto it = userVariables.begin(); it != userVariables.end(); it++){
		delete it->second;
	}
	userVariables.clear();
}

bool LoginRequest::initWithBytes(const char* bytes, int len){
	return true;
}

void LoginRequest::initWithJson(const rapidjson::Value& jsonData){
	if (jsonData.HasMember("userName") && jsonData["userName"].IsString()){
		userName = jsonData["userName"].GetString();
	}
	if (jsonData.HasMember("password") && jsonData["password"].IsString()){
		password = jsonData["password"].GetString();
	}
	if (jsonData.HasMember("sharedSecret") && jsonData["sharedSecret"].IsString()){
		sharedSecret = jsonData["sharedSecret"].GetString();
	}
	if (jsonData.HasMember("protocol") && jsonData["protocol"].IsNumber()){
		protocol = jsonData["protocol"].GetInt();
	}
	if (jsonData.HasMember("hashId") && jsonData["hashId"].IsNumber()){
		hashId = jsonData["hashId"].GetInt();
	}
	if (jsonData.HasMember("clientVersion") && jsonData["clientVersion"].IsString()){
		clientVersion = jsonData["clientVersion"].GetString();
	}
	if (jsonData.HasMember("clientType") && jsonData["clientType"].IsString()){
		clientType = jsonData["clientType"].GetString();
	}
	if (jsonData.HasMember("esObject") && jsonData["esObject"].IsObject()){
		esObject = (EsObject*)EsEntity::createFromJson(jsonData["esObject"]);
	}
	if (jsonData.HasMember("userVariables") && jsonData["userVariables"].IsObject()){
		const rapidjson::Value& data = jsonData["userVariables"];
		bool flag = true;
		for (auto it = data.MemberBegin(); it != data.MemberEnd(); it++){
			if (!data.IsObject()){
				flag = false;
				return;
			}
		}

		if (flag){
			for (auto it = data.MemberBegin(); it != data.MemberEnd(); it++){
				auto item = (EsObject*)EsEntity::createFromJson(it->value);
				userVariables.insert(std::make_pair(it->name.GetString(), item));
			}
		}	
	}
}

void LoginRequest::getBytes(std::vector<char> &buffer){
	BaseMessage::getBytes(buffer);

	//buffer.push_back(0xff);

	ThriftLoginRequest thriftObj;
	thriftObj.__set_userName(userName);
	thriftObj.__set_password(password);
	//thriftObj.__set_sharedSecret(sharedSecret);
	thriftObj.__set_clientType(this->clientType);
	thriftObj.__set_clientVersion(this->clientVersion);

	if (esObject){
		es::ThriftFlattenedEsObjectRO flattenedEsObjectRO;
		esObject->writeToFlattenedEsObjectRO(&thriftObj.esObject);
		thriftObj.__isset.esObject = true;
	}

	if (userVariables.size() > 0){
		for (auto it = userVariables.begin(); it != userVariables.end(); it++){
			es::ThriftFlattenedEsObject flattenedEsObject;
			it->second->writeToFlattenedEsObject(&flattenedEsObject);
			thriftObj.userVariables.insert(std::make_pair(it->first, flattenedEsObject));
			
		}

		thriftObj.__isset.userVariables = true;
	}


	apache::thrift::transport::TMemoryBuffer transport;
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);
	thriftObj.write(&protocol);

	uint8_t* dataPtr;
	uint32_t len;
	transport.getBuffer(&dataPtr, &len);

	buffer.insert(buffer.end(), dataPtr, dataPtr + len); 
}

void LoginRequest::printDebug(){
	es::log("[LoginRequest]");
	es::log("username : %s", userName.c_str());
	es::log("passwords : %s", password.c_str());
	es::log("sharedSecret: %s", sharedSecret.c_str());
	es::log("protocol: %d", protocol);
	es::log("hashId: %d", protocol);
	es::log("clientVersion: %s", clientVersion.c_str());
	es::log("clientType: %s", clientType.c_str());

	std::ostringstream outStream;

	if (esObject){
		es::log("esObject:");
		esObject->printDebugToBuffer(outStream, 10);
	}
	
	if (userVariables.size() > 0){
		es::log("\n[userVariables]");
		for (auto it = userVariables.begin(); it != userVariables.end(); it++){
			outStream << it->first << ":";
			int a = it->first.length() + 1;
			it->second->printDebugToBuffer(outStream, a);
		}
	}
}

} /* namespace es */
