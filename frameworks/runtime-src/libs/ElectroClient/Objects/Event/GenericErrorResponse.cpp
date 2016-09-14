//
//  GenericErrorResponse.cpp
//  GameBaiVip
//
//  Created by QuyetNguyen on 1/30/16.
//
//

#include "GenericErrorResponse.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftGenericErrorResponse_types.h"
#include "../MessageType.h"
#include "../ErrorType.h"
#include "../../ElectroLogger.h"

namespace es {
GenericErrorResponse::GenericErrorResponse(){
	messageType = es::type::GenericErrorResponse;
    extraData = 0;
}

GenericErrorResponse::~GenericErrorResponse(){
    if(extraData){
        delete extraData;
        extraData = 0;
    }
}

bool GenericErrorResponse::initWithBytes(const char* bytes, int len){
 
    apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
    apache::thrift::protocol::TBinaryProtocol protocol(&transport);
    
    ThriftGenericErrorResponse thriftObj;
    thriftObj.read(&protocol);
    
    requestMessageType = thriftObj.requestMessageType;
    errorType = thriftObj.errorType;
    if(thriftObj.__isset.extraData){
        extraData = new EsObject();
        extraData->initFromFlattenedEsObject(&thriftObj.extraData);
    }
    
	//to json
	rapidjson::Document doc;
	doc.SetObject();
	doc.AddMember("messageType", messageType, doc.GetAllocator());
	doc.AddMember("requestMessageType", requestMessageType, doc.GetAllocator());
	doc.AddMember("errorType", errorType, doc.GetAllocator());
	if (extraData){
		rapidjson::Value esObj;
		extraData->toJson(esObj, doc.GetAllocator());
		doc.AddMember("extraData", esObj, doc.GetAllocator());
	}

	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	doc.Accept(writer);
	jsonData = buffer.GetString();

    return true;
}

void GenericErrorResponse::getBytes(std::vector<char> &buffer){
    
}

void GenericErrorResponse::printDebug(){
    es::log("requestMessageType : %s", es::type::messageTypeName(requestMessageType));
    es::log("errorType : %s", es::type::errorType_name(errorType));
    if(extraData){
        es::log("extraData : ");
        extraData->printDebug();
    }
}
    
}
