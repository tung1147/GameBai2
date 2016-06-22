/*
 * ElectroLogger.cpp
 *
 *  Created on: Jan 29, 2016
 *      Author: QuyetNguyen
 */

#include "ElectroLogger.h"
#include <cstdarg>

#if defined(ANDROID)
 #include <android/log.h>
#endif

////mac
//#if defined(CC_TARGET_OS_MAC) || defined(__APPLE__)
//
//#endif
//
//// iphone
//#if defined(CC_TARGET_OS_IPHONE)
//
//#endif
//
//// android
//#if defined(ANDROID)
//
//#endif
//
//// win32
//#if defined(_WIN32) && defined(_WINDOWS)
//
//#endif
//
//// linux
//#if defined(LINUX) && !defined(__APPLE__)
//
//#endif
//
//// marmalade
//#if defined(MARMALADE)
//
//#endif
//
//// bada
//#if defined(SHP)
//
//#endif
//
//// qnx
//#if defined(__QNX__)
//
//#endif
//
//// native client
//#if defined(__native_client__)
//
//#endif
//
//// Emscripten
//#if defined(EMSCRIPTEN)
//
//#endif
//
//// tizen
//#if defined(TIZEN)
//
//#endif
//
//// qt5
//#if defined(CC_TARGET_QT5)
//
//#endif
//
//// WinRT (Windows 8.1 Store/Phone App)
//#if defined(WINRT)
//
//#endif

//#include "cocos2d.h"
//
//static void _print_to_console(const char* buf){
//    cocos2d::Director::getInstance()->getConsole()->log(buf);
//}

//#define ES_LOGGER

#include <string>

#if defined(_WIN32) || defined(WINRT)
#include "Windows.h"
#elif defined(ANDROID)

#endif

namespace es {

#ifdef ES_LOGGER
    
#define MAX_LOG_LENGTH 16 * 1024 //16KB log
    
    static void _log(const char *format, va_list args){
		char* buf = new char[MAX_LOG_LENGTH];

		vsnprintf(buf, MAX_LOG_LENGTH - 3, format, args);
		strcat(buf, "\n");
        
		log_to_console(buf);
        
        delete[] buf;
    }
    
#endif
    
    void log_to_console(const char* buf){
#ifdef ES_LOGGER
    
#if defined(ANDROID)
        __android_log_print(ANDROID_LOG_DEBUG, "electro-debug", "%s", buf);
#elif defined(_WIN32) || defined(WINRT)
        int pos = 0;
        int len = strlen(buf);
		int bufferSize = len > MAX_LOG_LENGTH ? MAX_LOG_LENGTH : len;
		char* tempBuf = new char[bufferSize + 1];
		WCHAR* wszBuf = new WCHAR[bufferSize + 1];
        
		while (pos < len)
		{
			std::copy(buf + pos, buf + pos + bufferSize, tempBuf);
            
			tempBuf[bufferSize] = 0;
            
			MultiByteToWideChar(CP_UTF8, 0, tempBuf, -1, wszBuf, (bufferSize + 1));
            OutputDebugStringW(wszBuf);
			WideCharToMultiByte(CP_ACP, 0, wszBuf, -1, tempBuf, (bufferSize + 1), nullptr, FALSE);
            printf("%s", tempBuf);
            
			pos += bufferSize;          		
			bufferSize = len - pos;
			if (bufferSize > MAX_LOG_LENGTH){
				bufferSize = MAX_LOG_LENGTH;
			}
        } 

        fflush(stdout);

		delete[] tempBuf;
		delete[] wszBuf;
#else
        fprintf(stdout, "%s", buf);
        fflush(stdout);
#endif
        
#endif
    }
    
    void log(const char * format, ...){
#ifdef ES_LOGGER
        va_list args;
        va_start(args, format);
        _log(format, args);
        va_end(args);
#endif
    }
    
    void log_hex(const char* buf, int len){
#ifdef ES_LOGGER
        char* data = new char[len*3 + 10];
        
        for(int i=0;i<len;i++){
            sprintf(&data[i*3], "%02X ", (unsigned char)buf[i]);
        }
        
        log("%s", data);
        
        delete []data;
#endif
    }
    
} /* namespace es */
