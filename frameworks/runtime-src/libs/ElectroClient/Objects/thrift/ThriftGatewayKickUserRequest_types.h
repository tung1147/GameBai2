/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef ThriftGatewayKickUserRequest_TYPES_H
#define ThriftGatewayKickUserRequest_TYPES_H

#include <iosfwd>

#include "libs/Thrift.h"

#include "libs/TProtocol.h"
#include "libs/TTransport.h"


#include "ThriftFlattenedEsObjectRO_types.h"
#include "ThriftErrorType_types.h"


namespace es {

class ThriftGatewayKickUserRequest;

typedef struct _ThriftGatewayKickUserRequest__isset {
  _ThriftGatewayKickUserRequest__isset() : clientId(false), error(false), esObject(false) {}
  bool clientId :1;
  bool error :1;
  bool esObject :1;
} _ThriftGatewayKickUserRequest__isset;

class ThriftGatewayKickUserRequest {
 public:

  ThriftGatewayKickUserRequest(const ThriftGatewayKickUserRequest&);
  ThriftGatewayKickUserRequest& operator=(const ThriftGatewayKickUserRequest&);
  ThriftGatewayKickUserRequest() : clientId(0), error(( ::es::ThriftErrorType::type)0) {
  }

  virtual ~ThriftGatewayKickUserRequest() throw();
  int64_t clientId;
   ::es::ThriftErrorType::type error;
   ::es::ThriftFlattenedEsObjectRO esObject;

  _ThriftGatewayKickUserRequest__isset __isset;

  void __set_clientId(const int64_t val);

  void __set_error(const  ::es::ThriftErrorType::type val);

  void __set_esObject(const  ::es::ThriftFlattenedEsObjectRO& val);

  bool operator == (const ThriftGatewayKickUserRequest & rhs) const
  {
    if (__isset.clientId != rhs.__isset.clientId)
      return false;
    else if (__isset.clientId && !(clientId == rhs.clientId))
      return false;
    if (__isset.error != rhs.__isset.error)
      return false;
    else if (__isset.error && !(error == rhs.error))
      return false;
    if (__isset.esObject != rhs.__isset.esObject)
      return false;
    else if (__isset.esObject && !(esObject == rhs.esObject))
      return false;
    return true;
  }
  bool operator != (const ThriftGatewayKickUserRequest &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const ThriftGatewayKickUserRequest & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

  virtual void printTo(std::ostream& out) const;
};

void swap(ThriftGatewayKickUserRequest &a, ThriftGatewayKickUserRequest &b);

inline std::ostream& operator<<(std::ostream& out, const ThriftGatewayKickUserRequest& obj)
{
  obj.printTo(out);
  return out;
}

} // namespace

#endif
