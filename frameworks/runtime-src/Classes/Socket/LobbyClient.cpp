/*
 * LobbyClient.cpp
 *
 *  Created on: Jun 23, 2016
 *      Author: Quyet Nguyen
 */

#include "LobbyClient.h"
#include "cocos2d.h"
USING_NS_CC;

#define PING_TIME_STEP 15.0f

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
		if (mClient->getStatus() == quyetnd::net::SocketStatusType::Connected){
			this->updatePing(dt);
		}
	}
}

void LobbyClient::updatePing(float dt){
	if (_pingTime <= 0.0f){
		if (_waitingPing){
			mClient->closeSocket();
		}
		else{		
			//send ping
			quyetnd::data::DictValue* pingRequest = new quyetnd::data::DictValue();
			pingRequest->setString("command", "ping");
			pingRequest->setInt("time", time(0));
			this->sendMessage(pingRequest);
			pingRequest->release();

			_pingTime = PING_TIME_STEP;
			_waitingPing = true;
		}
	}
	else{
		_pingTime -= 0.0f;
	}
}

void LobbyClient::sendMessage(quyetnd::data::Value* message){
	if (mClient){
		mClient->sendMessage(message);
	}
}

void LobbyClient::connect(const std::string& host, int port){
	if (mClient){	
		_waitingPing = false;
		_pingTime = 0.0f;
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
	quyetnd::data::DictValue* msg = (quyetnd::data::DictValue*)data;
	auto command = msg->getString("command");
	if (command == "ping"){
		_waitingPing = false;
	}
	this->sendJSMessage("message", data->toJSON());
}

void LobbyClient::onRecvStatus(const quyetnd::net::SocketStatusData& data){
	this->sendJSMessage("socketStatus", quyetnd::net::SocketStatusName(data.status));
}

int LobbyClient::getStatus(){
	if (mClient){
		return mClient->getStatus();
	}
	return -1;
}


} /* namespace quyetnd */
