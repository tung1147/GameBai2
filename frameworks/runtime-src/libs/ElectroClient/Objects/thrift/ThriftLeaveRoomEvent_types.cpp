/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftLeaveRoomEvent_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftLeaveRoomEvent::~ThriftLeaveRoomEvent() throw() {
}


void ThriftLeaveRoomEvent::__set_zoneId(const int32_t val) {
  this->zoneId = val;
__isset.zoneId = true;
}

void ThriftLeaveRoomEvent::__set_roomId(const int32_t val) {
  this->roomId = val;
__isset.roomId = true;
}

uint32_t ThriftLeaveRoomEvent::read(::apache::thrift::protocol::TProtocol* iprot) {

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
      default:
        xfer += iprot->skip(ftype);
        break;
    }
    xfer += iprot->readFieldEnd();
  }

  xfer += iprot->readStructEnd();

  return xfer;
}

uint32_t ThriftLeaveRoomEvent::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftLeaveRoomEvent");

  if (this->__isset.zoneId) {
    xfer += oprot->writeFieldBegin("zoneId", ::apache::thrift::protocol::T_I32, 1);
    xfer += oprot->writeI32(this->zoneId);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.roomId) {
    xfer += oprot->writeFieldBegin("roomId", ::apache::thrift::protocol::T_I32, 2);
    xfer += oprot->writeI32(this->roomId);
    xfer += oprot->writeFieldEnd();
  }
  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftLeaveRoomEvent &a, ThriftLeaveRoomEvent &b) {
  using ::std::swap;
  swap(a.zoneId, b.zoneId);
  swap(a.roomId, b.roomId);
  swap(a.__isset, b.__isset);
}

ThriftLeaveRoomEvent::ThriftLeaveRoomEvent(const ThriftLeaveRoomEvent& other0) {
  zoneId = other0.zoneId;
  roomId = other0.roomId;
  __isset = other0.__isset;
}
ThriftLeaveRoomEvent& ThriftLeaveRoomEvent::operator=(const ThriftLeaveRoomEvent& other1) {
  zoneId = other1.zoneId;
  roomId = other1.roomId;
  __isset = other1.__isset;
  return *this;
}
void ThriftLeaveRoomEvent::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftLeaveRoomEvent(";
  out << "zoneId="; (__isset.zoneId ? (out << to_string(zoneId)) : (out << "<null>"));
  out << ", " << "roomId="; (__isset.roomId ? (out << to_string(roomId)) : (out << "<null>"));
  out << ")";
}

} // namespace
