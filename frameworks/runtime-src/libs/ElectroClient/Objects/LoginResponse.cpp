/*
 * LoginResponse.cpp
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#include "LoginResponse.h"
#include "thrift/ThriftLoginResponse_types.h"

#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"

#include "../ElectroLogger.h"

namespace es {

LoginResponse::LoginResponse() {
	// TODO Auto-generated constructor stub
	esObject = 0;
	messageType = es::type::LoginResponse;
}

LoginResponse::~LoginResponse() {
	// TODO Auto-generated destructor stub
	if (esObject){
		delete esObject;
		esObject = 0;
	}
}

bool LoginResponse::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftLoginResponse thriftObj;
	thriftObj.read(&protocol);

	this->successful = thriftObj.successful;
	this->errorCode = thriftObj.error;
	this->userName = thriftObj.userName;

	if (thriftObj.__isset.esObject){
		esObject = new EsObject();
		esObject->initFromFlattenedEsObjectRO(&thriftObj.esObject);
	}

	if (thriftObj.__isset.userVariables){
		for (auto it = thriftObj.userVariables.begin(); it != thriftObj.userVariables.end(); it++){
			esObject = new EsObject();
			esObject->initFromFlattenedEsObjectRO(&it->second);
			this->userVariables.insert(std::make_pair(it->first, esObject));
		}
	}

	if (thriftObj.__isset.buddyListEntries){
		for (auto it = thriftObj.buddyListEntries.begin(); it != thriftObj.buddyListEntries.end(); it++){
			esObject = new EsObject();
			esObject->initFromFlattenedEsObjectRO(&it->second);
			this->buddyListEntries.insert(std::make_pair(it->first, esObject));
		}
	}
    
	return true;
}

void LoginResponse::getBytes(std::vector<char> &buffer){


}

void LoginResponse::printDebug(){
    es::log("successful : %d", successful);
    es::log("errorCode : %d", errorCode);
    es::log("userName : %s", userName.c_str());
    
    std::ostringstream outstream;
    
    if(esObject){
        outstream << "esObj : ";
        esObject->printDebug(outstream, 9);
        es::log_to_console(outstream.str().c_str());
    }
    
    if(userVariables.size() > 0){
        es::log("userVariables");
        for (auto it : userVariables){
            outstream.str("");
            outstream.clear();
            
            outstream << it.first << " : ";
            it.second->printDebug(outstream, it.first.length() + 3);
            
            es::log_to_console(outstream.str().c_str());
        }
    }
    
    if(buddyListEntries.size() > 0){
        es::log("buddyListEntries");
        for (auto it : buddyListEntries){
            outstream.str("");
            outstream.clear();
            
            outstream << it.first << " : ";
            it.second->printDebug(outstream, it.first.length() + 3);
            
            es::log_to_console(outstream.str().c_str());
        }
    }
}

} /* namespace es */
