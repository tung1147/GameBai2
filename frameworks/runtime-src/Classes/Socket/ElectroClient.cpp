/*
 * ElectroClient.cpp
 *
 *  Created on: Sep 15, 2016
 *      Author: Quyet Nguyen
 */

#include "ElectroClient.h"

ElectroClient::ElectroClient() {
	// TODO Auto-generated constructor stub

}

ElectroClient::~ElectroClient() {
	// TODO Auto-generated destructor stub
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
			/*SFS::BaseMessage* pingMessage = new SFS::BaseMessage();
			pingMessage->messageType = SFS::MessageType::PingPong;
			client->sendMessage(pingMessage);
			pingMessage->release();*/

			_pingTime = 15.0f;
			_waitingPing = true;
		}
	}
	else{
		_pingTime -= dt;
	}
}

void ElectroClient::connect(const std::string& host, int port){
	if (client){
		//client->closeClient();
		client->connectTo(host, port);
		_waitingPing = false;
		_pingTime = 0.0f;
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