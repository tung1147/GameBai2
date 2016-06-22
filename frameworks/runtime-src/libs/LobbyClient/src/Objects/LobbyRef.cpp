/*
 * AutoReleasePool.cpp
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#include "LobbyRef.h"
#include <thread>
//#include "../Logger/Logger.h"

namespace quyetnd {
namespace data{

LobbyRef::LobbyRef(){
	retainCount = 1;
}

LobbyRef::~LobbyRef(){

}

void LobbyRef::retain(){
	mMutex.lock();
	retainCount++;
	mMutex.unlock();
}

void LobbyRef::release(){
	mMutex.lock();
	retainCount--;
	if (retainCount <= 0){
		mMutex.unlock();
		delete this;
		return;
	}
	mMutex.unlock();
}

void LobbyRef::autorelease(){
	auto pool = AutoReleasePool::getInstance()->getPool();
	pool->addObject(this);
	this->release();
}

/****/

ReleasePool::ReleasePool(){

}

ReleasePool::~ReleasePool(){
	this->releaseAll();
}

void ReleasePool::addObject(LobbyRef* obj){
	_objects.push_back(obj);
	obj->retain();
}

void ReleasePool::releaseAll(){
	for (int i = 0; i < _objects.size(); i++){
		_objects[i]->release();
	}
	_objects.clear();
}

/****/

AutoReleasePool::AutoReleasePool() {
	// TODO Auto-generated constructor stub

}

AutoReleasePool::~AutoReleasePool() {
	// TODO Auto-generated destructor stub
}

ReleasePool* AutoReleasePool::getPool(){
	std::unique_lock<std::mutex> lk(poolMutex);

	size_t threadId = std::hash<std::thread::id>()(std::this_thread::get_id());
	//quyetnd::log("thread: %d", threadId);
	auto it = s_pool.find(threadId);
	ReleasePool* pret = 0;
	if (it != s_pool.end()){
		pret = it->second;
	}
	else{
		pret = new ReleasePool();
		s_pool.insert(std::make_pair(threadId, pret));
	}

	return pret;
}

void AutoReleasePool::removePool(){
	std::unique_lock<std::mutex> lk(poolMutex);
	size_t threadId = std::hash<std::thread::id>()(std::this_thread::get_id());
	auto it = s_pool.find(threadId);
	if (it != s_pool.end()){
		delete it->second;
		s_pool.erase(it);
	}
}

static AutoReleasePool s_AutoReleasePool;
AutoReleasePool* AutoReleasePool::getInstance(){
	return &s_AutoReleasePool;
}
	
}
} /* namespace quyetnd */
