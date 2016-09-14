//
//  GenericErrorResponse.hpp
//  GameBaiVip
//
//  Created by QuyetNguyen on 1/30/16.
//
//

#ifndef GenericErrorResponse_hpp
#define GenericErrorResponse_hpp
#include "BaseEvent.h"

namespace es {

class GenericErrorResponse : public BaseEvent{
public:
    int requestMessageType;
    int errorType;
    EsObject* extraData;
public:
    GenericErrorResponse();
    virtual ~GenericErrorResponse();
        
    virtual bool initWithBytes(const char* bytes, int len);
    virtual void getBytes(std::vector<char> &buffer);
    virtual void printDebug();
};

}

#endif /* GenericErrorResponse_hpp */
