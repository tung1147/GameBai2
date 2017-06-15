/*
 * WorkerManager.cpp
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#include "WorkerManager.h"

WorkerTicket::WorkerTicket(int count){
	_count = count;
	_success = _count;
	finishedCallback = nullptr;
}

WorkerTicket::~WorkerTicket(){

}

void WorkerTicket::done(bool sucess){
	_count_mutex.lock();
	_count--;
	if (sucess){
		_success--;
	}
	if (_count <= 0){
		_count_mutex.unlock();
		if (finishedCallback){
			finishedCallback(_success == 0);
		}
		delete this;
		return;
	}
	_count_mutex.unlock();
}

WorkerTicket* WorkerTicket::create(int count){
	auto ticker = new WorkerTicket(count);
	return ticker;
}

static WorkerManager* s_WorkerManager = 0;
WorkerManager* WorkerManager::getInstance(){
	if (!s_WorkerManager){
		s_WorkerManager = new WorkerManager();
	}
	return s_WorkerManager;
}

WorkerManager::WorkerManager(){

}

WorkerManager::~WorkerManager(){
	
}

LaucherAction WorkerManager::takeAction(){
	std::unique_lock<std::mutex> lk(_actionsMutex);
	if (!_actions.empty()){
		auto action = _actions.front();
		_actions.pop();
		return action;
	}
	_actions_condition_variable.wait(lk);
	if (!_actions.empty()){
		auto action = _actions.front();
		_actions.pop();
		return action;
	}
	return nullptr;
}

void WorkerManager::pushAction(const LaucherAction& action){
	std::unique_lock<std::mutex> lk(_actionsMutex);
	_actions.push(action);
	_actions_condition_variable.notify_one();
}

void WorkerManager::runActionThread(){
	do
	{
		auto action = this->takeAction();
		if (action){
			action();
		}
		else{
			break;
		}
	} while (true);
}

void WorkerManager::start(int thread){
	for (int i = 0; i < thread; i++){
		std::thread workerThread(&WorkerManager::runActionThread, this);
		workerThread.detach();
	}
}

void WorkerManager::stop(){
	std::unique_lock<std::mutex> lk(_actionsMutex);
	while (!_actions.empty()){
		_actions.pop();
	}
	_actions_condition_variable.notify_all();
}