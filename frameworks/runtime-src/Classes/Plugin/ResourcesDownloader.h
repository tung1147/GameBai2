/*
 * ResourcesDownloader.h
 *
 *  Created on: Mar 23, 2016
 *      Author: Quyet Nguyen
 */

#ifndef PLUGIN_RESOURCES_DOWNLOADER_H_
#define PLUGIN_RESOURCES_DOWNLOADER_H_
#include "cocos2d.h"
USING_NS_CC;

namespace quyetnd{

enum ResourcesType{
	kResourcesTypeTexture = 1,
};

class Resources;
typedef std::function<void(Resources*)> DownloadCallback;
struct ResourcesDownload{
	FILE* file;
	Resources* resources;
};

class Resources{
protected:
	bool _isLoading;
	bool _isSucess;

	std::vector<DownloadCallback> _s_callback;

	std::string _url;
	std::string _cacheFileName;
	std::vector<unsigned char> _buffer;

	virtual void onLoadResourcePreFinished();
	virtual void onLoadResourceFinished();
	virtual void invokeCallback();

	virtual void loadFromCache();
	virtual void loadFromUrl();
	virtual void loadResources();
public:
	bool _isCache;

	Resources();
	virtual ~Resources();
	void setUrl(const std::string& url);
	void addData(unsigned char* data, int size);

	void load(const DownloadCallback& callback);
};

class ResourcesTexture : public Resources {
protected:
	cocos2d::Image* image;

	virtual void onLoadResourcePreFinished();
	virtual void onLoadResourceFinished();
public:
	cocos2d::Texture2D* texture;
public:
	ResourcesTexture();
	virtual ~ResourcesTexture();
};

class ResourcesDownloader{
protected:
	std::map<std::string, Resources*> _resources;
	std::string _cacheDir;

	void init();
	Resources* createResourcesWithType(int resType);
public:
	ResourcesDownloader();
	virtual ~ResourcesDownloader();

	const std::string& getCacheDir();

	void loadResources(const std::string& url, int resType, const DownloadCallback &callback = nullptr, bool isCache = true);
	void loadTexture(const std::string& url, std::function<void(cocos2d::Texture2D*)> callback, bool isCache = true);

	static ResourcesDownloader* getInstance();
};

}
#endif /* PLUGIN_RESOURCES_DOWNLOADER_H_ */
