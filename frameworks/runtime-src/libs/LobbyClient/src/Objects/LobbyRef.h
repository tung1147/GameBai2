/*
 * AutoReleasePool.h
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_OBJECTS_AUTORELEASEPOOL_H_
#define LOBBYCLIENT_OBJECTS_AUTORELEASEPOOL_H_
#include <mutex>
#include <vector>
#include <map>

namespace quyetnd {
namespace data{

class LobbyRef{
protected:
	int retainCount;
	std::mutex mMutex;
public:
	LobbyRef();
	virtual ~LobbyRef();
	virtual void retain();
	virtual void release();
	virtual void autorelease();
};

class ReleasePool{
	std::vector<LobbyRef*> _objects;
public:
	ReleasePool();
	virtual ~ReleasePool();
	virtual void addObject(LobbyRef* obj);
	virtual void releaseAll();
};

class AutoReleasePool {
	std::mutex poolMutex;
	std::map<size_t, quyetnd::data::ReleasePool*> s_pool;
public:
	AutoReleasePool();
	virtual ~AutoReleasePool();

	quyetnd::data::ReleasePool* getPool();
	void removePool();

	static quyetnd::data::AutoReleasePool* getInstance();
};

}
} /* namespace quyetnd */

#endif /* LOBBYCLIENT_OBJECTS_AUTORELEASEPOOL_H_ */
