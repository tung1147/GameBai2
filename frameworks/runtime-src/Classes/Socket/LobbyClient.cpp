/*
 * LobbyClient.cpp
 *
 *  Created on: Jun 23, 2016
 *      Author: Quyet Nguyen
 */

#include "LobbyClient.h"
#include "cocos2d.h"
USING_NS_CC;

namespace quyetnd {

LobbyClient::LobbyClient() {
	// TODO Auto-generated constructor stub
	mClient = 0;
}

LobbyClient::~LobbyClient() {
	// TODO Auto-generated destructor stub
	Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
	if (mClient){
		mClient->release();
		mClient = 0;
	}
}

void LobbyClient::sendJSMessage(const std::string& messageName, const std::string& value){
	js_proxy_t* p = jsb_get_native_proxy(this);
	if (!p){
		//error
		return;
	}
	ScriptingCore* sc = ScriptingCore::getInstance();
	if (sc){
		jsval dataVal[] = {
			dataVal[0] = std_string_to_jsval(sc->getGlobalContext(), messageName),
			dataVal[1] = std_string_to_jsval(sc->getGlobalContext(), value)
		};
		sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onEvent", 2, dataVal);
	}
}

void LobbyClient::initClientWithType(int type){
	if (type == quyetnd::LobbyClientType::UDT){
		mClient = new quyetnd::net::UDTClient();
	}
	else{
		mClient = new quyetnd::net::TCPClient();
	}

	mClient->_recvCallback = CC_CALLBACK_1(LobbyClient::onRecvMessage, this);
	mClient->_statusCallback = CC_CALLBACK_1(LobbyClient::onRecvStatus, this);
	Director::getInstance()->getScheduler()->scheduleUpdateForTarget(this, INT_MAX, false);
}

void LobbyClient::update(float dt){
	if (mClient){
		mClient->processMessage();
	}
}

void LobbyClient::sendMessage(quyetnd::data::Value* message){
	if (mClient){
		mClient->sendMessage(message);
	}
}

void LobbyClient::connect(const std::string& host, int port){
	if (mClient){	
		mClient->connectTo(host, port);
	}
}

void LobbyClient::send(const std::string& json){
	auto message = quyetnd::data::Value::createFromJSON(json);
	this->sendMessage(message);
	message->release();
}

void LobbyClient::close(){
	if (mClient){
		mClient->closeClient();
	}
}

void LobbyClient::onRecvMessage(quyetnd::net::SocketData* data){
	this->sendJSMessage("message", data->toJSON());
}

void LobbyClient::onRecvStatus(const quyetnd::net::SocketStatusData& data){
	this->sendJSMessage("socketStatus", quyetnd::net::SocketStatusName(data.status));
}
	

} /* namespace quyetnd */
