/*
 * SFSRef.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "SFSRef.h"
#include <thread>

namespace SFS {

SFSRef::SFSRef() {
	// TODO Auto-generated constructor stub
	retainCount = 1;
}

SFSRef::~SFSRef() {
	// TODO Auto-generated destructor stub
}

void SFSRef::retain(){
	refMutex.lock();
	retainCount++;
	refMutex.unlock();
}

void SFSRef::release(){
	refMutex.lock();
	retainCount--;
	if (retainCount <= 0){
		refMutex.unlock();
		delete this;
		return;
	}
	refMutex.unlock();
}

void SFSRef::autoRelease(){
	auto mPool = SFS::AutoReleasePool::getInstance()->getPool();
	mPool->addToPool(this);
	this->release();
}

ReleasePool::ReleasePool(){

}

ReleasePool::~ReleasePool(){
	this->releaseAll();
}

void ReleasePool::releaseAll(){
	for (int i = 0; i < _pool.size(); i++){
		_pool[i]->release();
	}
	_pool.clear();
}

void ReleasePool::addToPool(SFSRef* ref){
	_pool.push_back(ref);
	ref->retain();
}

//
static AutoReleasePool s_AutoReleasePool;

AutoReleasePool::AutoReleasePool() {
	// TODO Auto-generated constructor stub

}

AutoReleasePool::~AutoReleasePool() {
	// TODO Auto-generated destructor stub
	for (auto it = s_pool.begin(); it != s_pool.end(); it++){
		delete it->second;
	}
	s_pool.clear();
}

AutoReleasePool* AutoReleasePool::getInstance(){
	return &s_AutoReleasePool;
}

ReleasePool* AutoReleasePool::getPool(){
	size_t threadId = std::hash<std::thread::id>()(std::this_thread::get_id());

	std::unique_lock<std::mutex> lk(poolMutex);
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
	size_t threadId = std::hash<std::thread::id>()(std::this_thread::get_id());

	std::unique_lock<std::mutex> lk(poolMutex);
	auto it = s_pool.find(threadId);
	if (it != s_pool.end()){
		delete it->second;
		s_pool.erase(it);
	}
}

} /* namespace SFS */
