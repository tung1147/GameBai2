/*
 * SmartfoxClient.cpp
 *
 *  Created on: Jun 23, 2016
 *      Author: Quyet Nguyen
 */

#include "SmartfoxClient.h"
#include "cocos2d.h"
USING_NS_CC;

namespace quyetnd {

SmartfoxClient::SmartfoxClient() {
	// TODO Auto-generated constructor stub
	client = 0;
	client = new SFS::TcpSocketClient();
	client->_recvCallback = CC_CALLBACK_1(SmartfoxClient::onRecvMessage, this);
	client->_statusCallback = CC_CALLBACK_1(SmartfoxClient::onRecvStatus, this);
	Director::getInstance()->getScheduler()->scheduleUpdateForTarget(this, INT_MAX, false);
}

SmartfoxClient::~SmartfoxClient() {
	// TODO Auto-generated destructor stub
	Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
	if (client){
		client->release();
		client = 0;
	}
}

void SmartfoxClient::onRecvMessage(SFS::SocketData* data){
	js_proxy_t* p = jsb_get_native_proxy(this);
	if (!p){
		//error
		return;
	}
	ScriptingCore* sc = ScriptingCore::getInstance();
	if (sc){
		jsval dataVal[] = {
			dataVal[0] = INT_TO_JSVAL(data->messageType),
			dataVal[1] = std_string_to_jsval(sc->getGlobalContext(), data->getContents()->toJSON()),
		};
		sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onMessage", 2, dataVal);
	}
}

void SmartfoxClient::onRecvStatus(const SFS::SocketStatusData& data){
	js_proxy_t* p = jsb_get_native_proxy(this);
	if (!p){
		//error
		return;
	}
	ScriptingCore* sc = ScriptingCore::getInstance();
	if (sc){
		jsval dataVal[] = {
			dataVal[0] = std_string_to_jsval(sc->getGlobalContext(), SFS::SocketStatusName(data.status)),
		};
		sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onEvent", 1, dataVal);
	}
}

//void SmartfoxClient::sendJSMessage(const std::string& messageName, const std::string& value){
//	js_proxy_t* p = jsb_get_native_proxy(this);
//	if (!p){
//		//error
//		return;
//	}
//	ScriptingCore* sc = ScriptingCore::getInstance();
//	if (sc){
//		jsval dataVal[] = {
//			dataVal[0] = std_string_to_jsval(sc->getGlobalContext(), messageName),
//			dataVal[1] = std_string_to_jsval(sc->getGlobalContext(), value)
//		};
//		sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onEvent", 2, dataVal);
//	}
//}

void SmartfoxClient::update(float dt){
	if (client){
		client->processMessage();
	}
}

void SmartfoxClient::connect(const std::string& host, int port){
	if (client){
		//client->closeClient();
		client->connectTo(host, port);
	}
}

void SmartfoxClient::close(){
	if (client){
		client->closeClient();
	}
}

void SmartfoxClient::send(int messageType, const std::string& contensJSON){	
	if (client){
		auto message = new SFS::BaseMessage();
		message->messageType = messageType;
		if (contensJSON != ""){
			auto contents = (SFS::Entity::SFSObject*)SFS::Entity::SFSEntity::createFromJSON(contensJSON);
			if (contents){
				message->setContents(contents);
				contents->release();
			}
			else{
				log("json error [format invalid]");
			}		
		}

		client->sendMessage(message);		
		message->release();
	}
}

//void SmartfoxClient::send(const std::string& json){
//	auto request = SFS::Entity::SFSObject::createFromJSON(json);
//	this->sendMessage(request);
//	request->release();
//}

} /* namespace quyetnd */
