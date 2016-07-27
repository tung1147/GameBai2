/*
 * SocketAdapter.cpp
 *
 *  Created on: Dec 1, 2015
 *      Author: QuyetNguyen
 */

#include "SocketAdapter.h"
#include <thread>
#include <chrono>


//static char headerBuffer[4];
namespace SFS{

SocketPool::SocketPool(){
	mData = new  std::queue<SocketData*>();
}

SocketPool::~SocketPool(){
	if (mData){
		while (!mData->empty()) {
			SocketData* data = mData->front();
			if (data){
				data->release();
			}
			mData->pop();
		}

		delete mData;
		mData = 0;
	}

}

void SocketPool::push(SocketData* data){
	std::unique_lock<std::mutex> lk(poolMutex);
	if (mData){
		mData->push(data);
		data->retain();
	}
	poolCond.notify_one();
}

void SocketPool::clear(){
	std::unique_lock<std::mutex> lk(poolMutex);
	if (mData){
		while (!mData->empty()) {
			SocketData* data = mData->front();
			data->release();
			mData->pop();
		}
	}

	poolCond.notify_all();
}

SocketData* SocketPool::take(){
	std::unique_lock<std::mutex> lk(poolMutex);

	if (mData){
		if (!mData->empty()){
			SocketData* data = mData->front();
			mData->pop();
			return data;
		}

		poolCond.wait(lk);

		if (mData && !mData->empty()){
			SocketData* data = mData->front();
			data->retain();
			data->autoRelease();

			mData->pop();		
			return data;
		}
		else{
			return 0;
		}
	}

	return 0;
}

SocketData* SocketPool::pop(){
	std::unique_lock<std::mutex> lk(poolMutex);
	if (mData && !mData->empty()){
		auto data = mData->front();
		data->retain();
		data->autoRelease();
		mData->pop();
		return data;
	}
	return 0;
}

/****/

SocketAdapter::SocketAdapter() {
	// TODO Auto-generated constructor stub
	running = false;
	mData = 0;
}

SocketAdapter::~SocketAdapter() {
	// TODO Auto-generated destructor stub
	if (mData){
		delete mData;
		mData = 0;
	}
}

void SocketAdapter::updateThread(){
	this->update();
	SFS::AutoReleasePool::getInstance()->removePool();
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

void SocketAdapter::pushMessage(SocketData* data){
	mData->push(data);
}

SocketData* SocketAdapter::popMessage(){
	return mData->pop();
}

SocketSender::SocketSender(){
	mData = new SocketPool();
}

SocketSender::~SocketSender(){

}

/****/
SocketReceiver::SocketReceiver(){
	mData = new SocketPool();
}

SocketReceiver::~SocketReceiver(){

}

/**/
SocketClient::SocketClient(){
	connectTime = 0;
	mSender = 0;
	mReceiver = 0;
	_recvCallback = nullptr;
	_statusCallback = nullptr;

	releasePool = 0;

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
	this->setStatus(SocketStatusType::Connecting);
	this->host = host;
	this->port = port;

	this->retain();
	std::thread newThread(&SocketClient::updateConnection, this);
	newThread.detach();
}

void SocketClient::updateConnection(){
	auto currentTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
	auto dt = currentTime - connectTime;
	if (dt < 2000){ //delay 2000ms
		std::this_thread::sleep_for(std::chrono::milliseconds(2000 - dt));
	}

	bool b = this->connectThread();
	connectTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();

	if (b){
		this->startAdapter();
		this->setStatus(SocketStatusType::Connected);
	}
	else{
		this->resetSocket();
		if (this->getStatus() == SocketStatusType::Connecting){
			this->setStatus(SocketStatusType::ConnectFailure);
		}
	}
	
	SFS::AutoReleasePool::getInstance()->removePool();
	//this->release();
}

void SocketClient::startAdapter(){

}

void SocketClient::closeClient(){
	if (mSender && mReceiver){
		mSender->stop();
		mReceiver->stop();
	}

	_clientStatus.clear();
	this->setStatus(SocketStatusType::Closed);
	closeSocket();
}

SocketStatusType SocketClient::getStatus(){
	return _clientStatus.get();
}

void SocketClient::setStatus(SocketStatusType status, bool isEvent){
	_clientStatus.set(status, isEvent);
}

void SocketClient::sendMessage(SocketData* data){
	if (mSender){
		mSender->pushMessage(data);
	}
}

void SocketClient::processEvent(){
	if (_statusCallback){
		_clientStatus.popAllStatus(_statusBuffer);
		for (int i = 0; i < _statusBuffer.size(); i++){
			_statusCallback(_statusBuffer[i]);
		}
		_statusBuffer.clear();
	}
}

void SocketClient::processRecvMessage(){
	if (_recvCallback){
		auto data = mReceiver->popMessage();
		while (data){
			if (this->getStatus() != SocketStatusType::Connected){
				break;
			}

			_recvCallback(data);
			data = mReceiver->popMessage();
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
	if (this->getStatus() == SocketStatusType::Connected){
		this->setStatus(SocketStatusType::LostConnection);
	}
}

void SocketClient::processMessage(){
	if (this->getStatus() == SocketStatusType::Connected){
		if (mSender && mReceiver){
			processRecvMessage();
			if (!mReceiver->isRunning()){
				if (this->getStatus() == SocketStatusType::Connected){
					this->processSocketError();
					this->closeSocket();
					this->clearAdapter();
				}
			}
		}
	}

	processEvent();

	if (!releasePool){
		releasePool = SFS::AutoReleasePool::getInstance()->getPool();
	}
	releasePool->releaseAll();
}

}