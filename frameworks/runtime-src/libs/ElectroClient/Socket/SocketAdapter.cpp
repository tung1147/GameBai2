/*
 * SocketAdapter.cpp
 *
 *  Created on: Dec 1, 2015
 *      Author: QuyetNguyen
 */

#include "SocketAdapter.h"
#include <thread>

//static char headerBuffer[4];

SocketPool::SocketPool(){
	mData = new  std::queue<SocketData*>();
}

SocketPool::~SocketPool(){
	if (mData){
		while (!mData->empty()) {
			SocketData* data = mData->front();
			if (data){
				delete data;
			}		
			mData->pop();
		}

		delete mData;
		mData = 0;
	}

}

void SocketPool::push(SocketData* data){

}

void SocketPool::clear(){
	std::unique_lock<std::mutex> lk(poolMutex);
	if (mData){
		while (!mData->empty()) {
			SocketData* data = mData->front();
			delete data;
			mData->pop();
		}
	}
}

SocketData* SocketPool::take(){
    return 0;
}

void SocketPool::takeAll(std::vector<SocketData*> &arr){
    std::unique_lock<std::mutex> lk(poolMutex);
	if (mData){
		while (!mData->empty()) {
			arr.push_back(mData->front());
			mData->pop();
		}
	}
}

/* pool sender */
SocketPoolSender::SocketPoolSender(){
    
}

SocketPoolSender::~SocketPoolSender(){
    
}
    
void SocketPoolSender::push(SocketData* _data){
    std::unique_lock<std::mutex> lk(poolMutex);
	if (mData){
		mData->push(_data);
	}
	
    
    poolCond.notify_one();
}

SocketData* SocketPoolSender::take(){
    std::unique_lock<std::mutex> lk(poolMutex);

	if (mData){
		if (!mData->empty()){
			SocketData* data = mData->front();
			mData->pop();
			return data;
		}

		poolCond.wait(lk);

		if (mData){
			SocketData* data = mData->front();
			mData->pop();
			return data;
		}
		else{
			return 0;
		}
	}
	
	return 0;
}

void SocketPoolSender::clear(){
	std::unique_lock<std::mutex> lk(poolMutex);

	if (mData){
		while (!mData->empty()) {
			SocketData* data = mData->front();
			delete data;
			mData->pop();
		}

		delete mData;
		mData = 0;
	}

    poolCond.notify_all();
}

/* pool receiver */
SocketPoolReceiver::SocketPoolReceiver(){
    
}
SocketPoolReceiver::~SocketPoolReceiver(){
    
}
    
void SocketPoolReceiver::push(SocketData* data){
	std::unique_lock<std::mutex> lk(poolMutex);
	if (mData){
		mData->push(data);
	}	
}

/****/

SocketAdapter::SocketAdapter() {
	// TODO Auto-generated constructor stub
	running = false;
    mData = 0;
}

SocketAdapter::~SocketAdapter() {
	// TODO Auto-generated destructor stub
    if(mData){
        delete mData;
        mData = 0;
    }
}

void SocketAdapter::updateThread(){
	this->update();
	this->release();
}

bool SocketAdapter::isRunning(){
    std::unique_lock<std::mutex> lk(mMutex);
    return running;
}

void SocketAdapter::setRunning(bool running){
	std::unique_lock<std::mutex> lk(mMutex);
	this->running = running;
}

void SocketAdapter::start(){
	if (!isRunning()){
		this->setRunning(true);
		//running = true;
		
		this->retain();
		std::thread newThread(&SocketAdapter::updateThread, this);
		newThread.detach();
	}
}

void SocketAdapter::stop(){
    this->setRunning(false);
	mData->clear();
}

void SocketAdapter::update(){

}

void SocketAdapter::pushSendMessage(SocketData* data){
    mData->push(data);
}

void SocketAdapter::popAllMessage(std::vector<SocketData*> &arr){
    mData->takeAll(arr);
}

///

SocketSender::SocketSender(){
    mData = new SocketPoolSender();
}

SocketSender::~SocketSender(){
    
}

//void SocketSender::setRunning(bool running){
//	std::unique_lock<std::mutex> lk(mMutex);
//	this->running = running;
//	if(!running){
//	    mData->clear();
//	}
//}

/****/
SocketReceiver::SocketReceiver(){
    mData = new SocketPoolReceiver();
}

SocketReceiver::~SocketReceiver(){
    
}

//void SocketReceiver::setRunning(bool running){
//	std::unique_lock<std::mutex> lk(mMutex);
//	this->running = running;
//}

/**/
SocketClient::SocketClient(){
	mSender = 0;
	mReceiver = 0;
	_recvCallback = nullptr;

	port = 0;
	host = "";
}

SocketClient::~SocketClient(){
	this->closeSocket();
    this->clearAdapter();
}

void SocketClient::closeSocket(){

}

void SocketClient::createAdapter(){

}

bool SocketClient::connectThread(){
	return false;
}

void SocketClient::connectTo(const std::string& host, int port){
	clearAdapter();
	createAdapter();
	resetSocket();

//	this->setRunning(false);
	//running = false;

	_clientStatus.clear();
	this->setStatus(SocketStatus::Connecting);
	this->host = host;
	this->port = port;

	this->retain();
	std::thread newThread(&SocketClient::updateConnection, this);
	newThread.detach();
}

void SocketClient::updateConnection(){
	bool b = this->connectThread();
	if(b){
		this->startAdapter();
		this->setStatus(SocketStatus::Connected);	 
	}
	else{
		this->resetSocket();
		if(this->getStatus() == SocketStatus::Connecting){
			this->setStatus(SocketStatus::ConnectFailure);
		}
	}
	this->release();
}

void SocketClient::startAdapter(){

}

void SocketClient::closeClient(){
	if (mSender && mReceiver){
		mSender->stop();
		mReceiver->stop();
	}

	_clientStatus.clear();
	this->setStatus(SocketStatus::Closed);
	closeSocket();
}

SocketStatus SocketClient::getStatus(){
	return _clientStatus.get();
}

void SocketClient::setStatus(SocketStatus status, bool isEvent){
	_clientStatus.set(status, isEvent);
}

void SocketClient::sendMessage(SocketData* data){
	if (mSender){
		mSender->pushSendMessage(data);
	}
	else{
		delete data;
	}
}

void SocketClient::addCallback(const ReceiverCallback& callback){
	_recvCallback = callback;
}

//void SocketClient::addStatusCallback(const SocketStatusCallback& callback){
//	_statusCallback = callback;
//}

void SocketClient::processEvent(){
	if (_recvCallback){
		_clientStatus.popAllStatus(_statusBuffer);
		es::SocketStatus socketStatus;
		for(int i=0;i<_statusBuffer.size();i++){
			socketStatus.preStatus = _statusBuffer[i].preStatus;
			socketStatus.status = _statusBuffer[i].status;
			_recvCallback(&socketStatus);

//			_statusCallback(SocketEvent::SocketStatusChange, _statusBuffer[i]);
		}
		_statusBuffer.clear();
	}
}

void SocketClient::processRecvMessage(){
	if(_recvCallback){
		mReceiver->popAllMessage(_recvBuffer);
		if(_recvBuffer.size() > 0){
			int i=0;
			while(i < _recvBuffer.size()){
				if(this->getStatus() == SocketStatus::Connected){
					_recvCallback(_recvBuffer[i]);
					i++;
				}
				else{
					break;
				}
			}

			for (i = 0; i < _recvBuffer.size(); i++){
				delete _recvBuffer[i];
			}
			_recvBuffer.clear();
		}
	}
}

void SocketClient::clearAdapter(){
	std::unique_lock<std::mutex> lk(clientMutex);
	if (mSender){
		mSender->stop();	
		mSender->release();
		mSender = 0;
	}
	if (mReceiver){
		mReceiver->stop();
		mReceiver->release();
		mReceiver = 0;
	}
}

void SocketClient::resetSocket(){

}

void SocketClient::processSocketError(){
	if(this->getStatus() == SocketStatus::Connected){
		this->setStatus(SocketStatus::LostConnection);
	}
}

void SocketClient::processMessage(){
	processEvent();
	if(this->getStatus() == SocketStatus::Connected){
		if (mSender && mReceiver){
			processRecvMessage();
			if (!mReceiver->isRunning()){
				if (this->getStatus() == SocketStatus::Connected){
					this->processSocketError();
					this->closeSocket();
					this->clearAdapter();
				}
			}
		}
	}
}
