/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef ThriftPingResponse_TYPES_H
#define ThriftPingResponse_TYPES_H

#include <iosfwd>

#include "libs/Thrift.h"

#include "libs/TProtocol.h"
#include "libs/TTransport.h"




namespace es {

class ThriftPingResponse;

typedef struct _ThriftPingResponse__isset {
  _ThriftPingResponse__isset() : globalResponseRequested(false), pingRequestId(false) {}
  bool globalResponseRequested :1;
  bool pingRequestId :1;
} _ThriftPingResponse__isset;

class ThriftPingResponse {
 public:

  ThriftPingResponse(const ThriftPingResponse&);
  ThriftPingResponse& operator=(const ThriftPingResponse&);
  ThriftPingResponse() : globalResponseRequested(0), pingRequestId(0) {
  }

  virtual ~ThriftPingResponse() throw();
  bool globalResponseRequested;
  int32_t pingRequestId;

  _ThriftPingResponse__isset __isset;

  void __set_globalResponseRequested(const bool val);

  void __set_pingRequestId(const int32_t val);

  bool operator == (const ThriftPingResponse & rhs) const
  {
    if (__isset.globalResponseRequested != rhs.__isset.globalResponseRequested)
      return false;
    else if (__isset.globalResponseRequested && !(globalResponseRequested == rhs.globalResponseRequested))
      return false;
    if (__isset.pingRequestId != rhs.__isset.pingRequestId)
      return false;
    else if (__isset.pingRequestId && !(pingRequestId == rhs.pingRequestId))
      return false;
    return true;
  }
  bool operator != (const ThriftPingResponse &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const ThriftPingResponse & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

  virtual void printTo(std::ostream& out) const;
};

void swap(ThriftPingResponse &a, ThriftPingResponse &b);

inline std::ostream& operator<<(std::ostream& out, const ThriftPingResponse& obj)
{
  obj.printTo(out);
  return out;
}

} // namespace

#endif
