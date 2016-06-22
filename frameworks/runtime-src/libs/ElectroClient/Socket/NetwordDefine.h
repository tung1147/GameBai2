/*
 * NetwordDefine.h
 *
 *  Created on: Oct 14, 2015
 *      Author: QuyetNguyen
 */

#ifndef NETWORDDEFINE_H_
#define NETWORDDEFINE_H_

//mac
#if defined(CC_TARGET_OS_MAC) || defined(__APPLE__)

#endif

// iphone
#if defined(CC_TARGET_OS_IPHONE)

#endif

// android
#if defined(ANDROID)

#endif

// win32
#if defined(_WIN32) && defined(_WINDOWS)
#define USE_WINSOCK_2
#endif

// linux
#if defined(LINUX) && !defined(__APPLE__)

#endif

// marmalade
#if defined(MARMALADE)

#endif

// bada
#if defined(SHP)

#endif

// qnx
#if defined(__QNX__)

#endif

// native client
#if defined(__native_client__)

#endif

// Emscripten
#if defined(EMSCRIPTEN)

#endif

// tizen
#if defined(TIZEN)

#endif

// qt5
#if defined(CC_TARGET_QT5)

#endif

// WinRT (Windows 8.1 Store/Phone App)
#if defined(WINRT)
#define USE_WINSOCK_2
#endif


#ifdef USE_WINSOCK_2
#include <winsock2.h>
#include <ws2tcpip.h>
//#include <wspiapi.h>
#include <Ws2tcpip.h>
typedef SOCKET SSocket;
#define SYS_SOCKET_INVALID INVALID_SOCKET
#else 
#include <netdb.h>
#include <signal.h>
#include <unistd.h>
#include <netinet/in.h>
typedef int SSocket;
#define SYS_SOCKET_INVALID -1
#endif

#include <vector>
#include <mutex>
#include <functional>
#include <errno.h>
#include <cstdlib>
#include <cstring>

#include "../Objects/BaseMessage.h"

#define BUFFER_SIZE 10240

//enum SocketEvent {
//	RecvData = 0,
//	SocketStatusChange,
//};

enum SocketStatus{
	NotConnection = 0,
	Connecting, //1
	Connected, //2
	ConnectFailure, //3
	LostConnection, //4
	Closed //5
};

enum SocketErrorType{
	SOCKET_NO_ERROR = 0,
	TIMEOUT,
	LOSTCONNECT,
};

const char* SocketStatusName(int status);

//typedef std::vector<char> SocketData;
typedef es::BaseMessage SocketData;

typedef std::function<void(SocketData*)> ReceiverCallback;

struct SocketStatusEvent{
	SocketStatus preStatus;
	SocketStatus status;
};
//typedef std::function<void(SocketEvent, const SocketStatusEvent&)> SocketStatusCallback;

class SocketRef {
protected:
	int retainCount;
	std::mutex refMutex;
public:
	SocketRef();
	virtual ~SocketRef();

	virtual void retain();
	virtual void release();
};

class SocketClientStatus{
	SocketStatus clientStatus;
	std::mutex statusMutex;
	std::vector<SocketStatusEvent> statusEvent;

//	SocketStatusCallback mStatusCallback;
public:
	SocketClientStatus();
	~SocketClientStatus();

	void set(SocketStatus status, bool isEvent);
	SocketStatus get();

	void popAllStatus(std::vector<SocketStatusEvent> &buffer);
	void clear();
};

#endif /* NETWORDDEFINE_H_ */

