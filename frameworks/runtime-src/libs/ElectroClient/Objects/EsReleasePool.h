//
//  EsReleasePool.h
//  GameBaiVip
//
//  Created by QuyetNguyen on 1/30/16.
//
//

#ifndef Es_releasepool_h
#define Es_releasepool_h

#include <mutex>
#include <vector>
#include <map>

namespace es{

class EsRef {
protected:
	int retainCount;
	std::mutex refMutex;
public:
	EsRef();
	virtual ~EsRef();

	virtual void retain();
	virtual void release();
	virtual void autoRelease();
};

class ReleasePool{
	std::vector<EsRef*> _pool;
public:
	ReleasePool();
	virtual ~ReleasePool();

	void releaseAll();
	void addToPool(EsRef* ref);
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

}

#endif /* Es_releasepool_h */
