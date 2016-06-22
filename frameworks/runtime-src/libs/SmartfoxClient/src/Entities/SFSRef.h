/*
 * SFSRef.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_ENTITIES_SFSREF_H_
#define SFSCLIENT_ENTITIES_SFSREF_H_
#include <mutex>
#include <vector>
#include <map>

namespace SFS {

class SFSRef {
protected:
	int retainCount;
	std::mutex refMutex;
public:
	SFSRef();
	virtual ~SFSRef();

	virtual void retain();
	virtual void release();
	virtual void autoRelease();
};

class ReleasePool{
	std::vector<SFSRef*> _pool;
public:
	ReleasePool();
	virtual ~ReleasePool();

	void releaseAll();
	void addToPool(SFSRef* ref);
};

class AutoReleasePool {
	std::mutex poolMutex;
	std::map<size_t, ReleasePool*> s_pool;
public:
	AutoReleasePool();
	virtual ~AutoReleasePool();

	void removePool();
	ReleasePool* getPool();

	static AutoReleasePool* getInstance();
};

} /* namespace SFS */

#endif /* SFSCLIENT_ENTITIES_SFSREF_H_ */
