/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftRegisterUDPConnectionRequest_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftRegisterUDPConnectionRequest::~ThriftRegisterUDPConnectionRequest() throw() {
}


void ThriftRegisterUDPConnectionRequest::__set_port(const int32_t val) {
  this->port = val;
}

uint32_t ThriftRegisterUDPConnectionRequest::read(::apache::thrift::protocol::TProtocol* iprot) {

  apache::thrift::protocol::TInputRecursionTracker tracker(*iprot);
  uint32_t xfer = 0;
  std::string fname;
  ::apache::thrift::protocol::TType ftype;
  int16_t fid;

  xfer += iprot->readStructBegin(fname);

  using ::apache::thrift::protocol::TProtocolException;


  while (true)
  {
    xfer += iprot->readFieldBegin(fname, ftype, fid);
    if (ftype == ::apache::thrift::protocol::T_STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->port);
          this->__isset.port = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      default:
        xfer += iprot->skip(ftype);
        break;
    }
    xfer += iprot->readFieldEnd();
  }

  xfer += iprot->readStructEnd();

  return xfer;
}

uint32_t ThriftRegisterUDPConnectionRequest::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftRegisterUDPConnectionRequest");

  xfer += oprot->writeFieldBegin("port", ::apache::thrift::protocol::T_I32, 1);
  xfer += oprot->writeI32(this->port);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftRegisterUDPConnectionRequest &a, ThriftRegisterUDPConnectionRequest &b) {
  using ::std::swap;
  swap(a.port, b.port);
  swap(a.__isset, b.__isset);
}

ThriftRegisterUDPConnectionRequest::ThriftRegisterUDPConnectionRequest(const ThriftRegisterUDPConnectionRequest& other0) {
  port = other0.port;
  __isset = other0.__isset;
}
ThriftRegisterUDPConnectionRequest& ThriftRegisterUDPConnectionRequest::operator=(const ThriftRegisterUDPConnectionRequest& other1) {
  port = other1.port;
  __isset = other1.__isset;
  return *this;
}
void ThriftRegisterUDPConnectionRequest::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftRegisterUDPConnectionRequest(";
  out << "port=" << to_string(port);
  out << ")";
}

} // namespace
