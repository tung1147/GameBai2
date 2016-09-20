/*
 * ElectroClient.cpp
 *
 *  Created on: Sep 15, 2016
 *      Author: Quyet Nguyen
 */

#include "ElectroClient.h"
#include "cocos2d.h"
USING_NS_CC;

namespace quyetnd{

ElectroClient::ElectroClient() {
	// TODO Auto-generated constructor stub
	_pingTimeInterval = 15.0f;
	client = 0;
	client = new es::TcpSocketClient();
	client->_recvCallback = CC_CALLBACK_1(ElectroClient::onRecvMessage, this);
	client->_statusCallback = CC_CALLBACK_1(ElectroClient::onRecvStatus, this);
	Director::getInstance()->getScheduler()->scheduleUpdateForTarget(this, INT_MAX, false);
}

ElectroClient::~ElectroClient() {
	// TODO Auto-generated destructor stub
	Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
	if (client){
		client->release();
		client = 0;
	}
}

void ElectroClient::update(float dt){
	if (client){
		client->processMessage();
		if (client->getStatus() == es::SocketStatusType::Connected){
			this->updatePing(dt);
		}
	}
}

void ElectroClient::updatePing(float dt){
	if (_pingTime <= 0.0f){
		if (_waitingPing){
			CCLOG("es lost ping");
			client->closeSocket();
		}
		else{
			//send ping
			es::PingRequest* pingRequest = new es::PingRequest();
			client->sendMessage(pingRequest);
			pingRequest->release();


			_pingTime = _pingTimeInterval;
			_waitingPing = true;
		}
	}
	else{
		_pingTime -= dt;
	}
}

void ElectroClient::onRecvMessage(es::SocketData* data){
	es::BaseEvent* message = (es::BaseEvent*)data;
	if (data->messageType == es::type::MessageType::PingResponse){
		_waitingPing = false;
	}

	js_proxy_t* p = jsb_get_native_proxy(this);
	if (!p){
		//error
		return;
	}
	ScriptingCore* sc = ScriptingCore::getInstance();
	if (sc){
		jsval dataVal[] = {
			dataVal[0] = std_string_to_jsval(sc->getGlobalContext(), message->jsonData),
		};
		sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onMessage", 1, dataVal);
	}
}

void ElectroClient::onRecvStatus(const es::SocketStatusData& data){
	js_proxy_t* p = jsb_get_native_proxy(this);
	if (!p){
		//error
		return;
	}
	ScriptingCore* sc = ScriptingCore::getInstance();
	if (sc){
		jsval dataVal[] = {
			dataVal[0] = std_string_to_jsval(sc->getGlobalContext(), es::SocketStatusName(data.status)),
		};
		sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onEvent", 1, dataVal);
	}
}

void ElectroClient::setPingInterval(float time){
	_pingTimeInterval = time;
}

void ElectroClient::connect(const std::string& host, int port){
	if (client){
		//client->closeClient();
		client->connectTo(host, port);
		_waitingPing = false;
		_pingTime = _pingTimeInterval;
	}
}

void ElectroClient::close(){
	if (client){
		client->closeClient();
	}
}

void ElectroClient::send(const std::string& contensJSON){
	if (client){
		auto message = new es::JsonRequest();
		if (contensJSON != ""){
			message->setJson(contensJSON);
		}
		client->sendMessage(message);
		message->release();
	}
}

int ElectroClient::getStatus(){
	if (client){
		return client->getStatus();
	}
	return -1;
}

}