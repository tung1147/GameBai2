/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftDeleteRoomVariableRequest_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftDeleteRoomVariableRequest::~ThriftDeleteRoomVariableRequest() throw() {
}


void ThriftDeleteRoomVariableRequest::__set_zoneId(const int32_t val) {
  this->zoneId = val;
}

void ThriftDeleteRoomVariableRequest::__set_roomId(const int32_t val) {
  this->roomId = val;
}

void ThriftDeleteRoomVariableRequest::__set_name(const std::string& val) {
  this->name = val;
}

uint32_t ThriftDeleteRoomVariableRequest::read(::apache::thrift::protocol::TProtocol* iprot) {

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
          xfer += iprot->readI32(this->zoneId);
          this->__isset.zoneId = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 2:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->roomId);
          this->__isset.roomId = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 3:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->name);
          this->__isset.name = true;
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

uint32_t ThriftDeleteRoomVariableRequest::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftDeleteRoomVariableRequest");

  xfer += oprot->writeFieldBegin("zoneId", ::apache::thrift::protocol::T_I32, 1);
  xfer += oprot->writeI32(this->zoneId);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("roomId", ::apache::thrift::protocol::T_I32, 2);
  xfer += oprot->writeI32(this->roomId);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("name", ::apache::thrift::protocol::T_STRING, 3);
  xfer += oprot->writeString(this->name);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftDeleteRoomVariableRequest &a, ThriftDeleteRoomVariableRequest &b) {
  using ::std::swap;
  swap(a.zoneId, b.zoneId);
  swap(a.roomId, b.roomId);
  swap(a.name, b.name);
  swap(a.__isset, b.__isset);
}

ThriftDeleteRoomVariableRequest::ThriftDeleteRoomVariableRequest(const ThriftDeleteRoomVariableRequest& other0) {
  zoneId = other0.zoneId;
  roomId = other0.roomId;
  name = other0.name;
  __isset = other0.__isset;
}
ThriftDeleteRoomVariableRequest& ThriftDeleteRoomVariableRequest::operator=(const ThriftDeleteRoomVariableRequest& other1) {
  zoneId = other1.zoneId;
  roomId = other1.roomId;
  name = other1.name;
  __isset = other1.__isset;
  return *this;
}
void ThriftDeleteRoomVariableRequest::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftDeleteRoomVariableRequest(";
  out << "zoneId=" << to_string(zoneId);
  out << ", " << "roomId=" << to_string(roomId);
  out << ", " << "name=" << to_string(name);
  out << ")";
}

} // namespace
