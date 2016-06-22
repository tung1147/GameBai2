/*
 * NetwordDefine.cpp
 *
 *  Created on: Oct 15, 2015
 *      Author: QuyetNguyen
 */

#include "NetwordDefine.h"
#include <map>

static std::map<int, std::string> s_socketstatus_name = {
	{ NotConnection , "NotConnection"},
	{ Connecting, "Connecting" },
	{ Connected, "Connected" },
	{ ConnectFailure, "ConnectFailure" },
	//{ ReConnecting, "ReConnecting" },
	//{ Disconnected, "Disconnected" },
	{ LostConnection, "LostConnection" },
	//{ LostPing, "LostPing" },
	{ Closed, "Closed" },
};

const char* SocketStatusName(int status){
	auto it = s_socketstatus_name.find(status);
	if (it != s_socketstatus_name.end()){
		return it->second.c_str();
	}
	return "";
}

SocketRef::SocketRef(){
	retainCount = 1;
}

SocketRef::~SocketRef(){

}

void SocketRef::retain(){
    std::unique_lock<std::mutex> lk(refMutex);
//	refMutex.lock();
	retainCount++;
//	refMutex.unlock();
}

void SocketRef::release(){
	std::unique_lock<std::mutex> lk(refMutex);

	//refMutex.lock();
  
	retainCount--;
	if (retainCount<=0){
		//refMutex.unlock();
		lk.unlock();
		delete this;
		return;
	}
	//refMutex.unlock();
}

/****/
SocketClientStatus::SocketClientStatus(){
//	mStatusCallback = nullptr;
	clientStatus = SocketStatus::NotConnection;
}

SocketClientStatus::~SocketClientStatus(){

}

void SocketClientStatus::set(SocketStatus status, bool isEvent){
    std::unique_lock<std::mutex> lk(statusMutex);
	//statusMutex.lock();
    
	if (clientStatus != status){
        if(isEvent){
            SocketStatusEvent mEvent;
            mEvent.preStatus = clientStatus;
            mEvent.status = status;
            statusEvent.push_back(mEvent);
        }

		clientStatus = status;
	}
	//statusMutex.unlock();
}

SocketStatus SocketClientStatus::get(){
    std::unique_lock<std::mutex> lk(statusMutex);
    return clientStatus;
}

void SocketClientStatus::popAllStatus(std::vector<SocketStatusEvent> &buffer){
    std::unique_lock<std::mutex> lk(statusMutex);
	for(int i=0;i<statusEvent.size();i++){
		buffer.push_back(statusEvent[i]);
	}
	statusEvent.clear();
}

void SocketClientStatus::clear(){
    std::unique_lock<std::mutex> lk(statusMutex);
	clientStatus = SocketStatus::NotConnection;
	statusEvent.clear();
}
