/*
 * HttpFileDownloader.h
 *
 *  Created on: Mar 23, 2016
 *      Author: Quyet Nguyen
 */

#ifndef PLUGIN_HttpFileDownloader_H_
#define PLUGIN_HttpFileDownloader_H_

#include <string>
#include <vector>
#include <map>
#include <mutex>
#include <queue>
#include <thread>
#include <functional>
#include <condition_variable>
namespace quyetnd{

enum DownloadResult{
	OK = 0,
	NETWORK_ERROR = 2,
	FILE_ERROR = 3,
	CURL_ERROR = 4
};

class DownloadRequest{
private:
	FILE* fileWrite;

	void onFinished(int returnCode);

	void runOnUi(const std::function<void()> runable);
	void downloadWithCache();
	void downloadNoCache();
public:
	std::string _url;
	std::string _fileName;
	std::function<void(int)> finishedCallback;
	std::function<void(unsigned char* data, size_t size)> processCallback;
public:
	DownloadRequest();
	DownloadRequest(const std::string& url, const std::string& fileName = "");
	virtual ~DownloadRequest();

	void execute();
	size_t onDownloadHandler(void *ptr, size_t size, size_t nmemb);
};

class HttpFileDownloader{
	std::queue<DownloadRequest*> _request;
	std::mutex _request_mutex;
	std::condition_variable _request_condition_variable;

	DownloadRequest* takeRequest();
	void updateThread();
	void init();
	void stop();
public:
	HttpFileDownloader();
	virtual ~HttpFileDownloader();

	void addRequest(DownloadRequest* request);

	static HttpFileDownloader* getInstance();
};

}
#endif /* PLUGIN_HttpFileDownloader_H_ */
