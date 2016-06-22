/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftZoneUpdateEvent_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftZoneUpdateEvent::~ThriftZoneUpdateEvent() throw() {
}


void ThriftZoneUpdateEvent::__set_zoneId(const int32_t val) {
  this->zoneId = val;
__isset.zoneId = true;
}

void ThriftZoneUpdateEvent::__set_action(const  ::es::ThriftZoneUpdateAction::type val) {
  this->action = val;
__isset.action = true;
}

void ThriftZoneUpdateEvent::__set_roomId(const int32_t val) {
  this->roomId = val;
__isset.roomId = true;
}

void ThriftZoneUpdateEvent::__set_roomCount(const int32_t val) {
  this->roomCount = val;
__isset.roomCount = true;
}

void ThriftZoneUpdateEvent::__set_roomListEntry(const  ::es::ThriftRoomListEntry& val) {
  this->roomListEntry = val;
__isset.roomListEntry = true;
}

uint32_t ThriftZoneUpdateEvent::read(::apache::thrift::protocol::TProtocol* iprot) {

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
          int32_t ecast0;
          xfer += iprot->readI32(ecast0);
          this->action = ( ::es::ThriftZoneUpdateAction::type)ecast0;
          this->__isset.action = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 3:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->roomId);
          this->__isset.roomId = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 4:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->roomCount);
          this->__isset.roomCount = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 5:
        if (ftype == ::apache::thrift::protocol::T_STRUCT) {
          xfer += this->roomListEntry.read(iprot);
          this->__isset.roomListEntry = true;
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

uint32_t ThriftZoneUpdateEvent::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftZoneUpdateEvent");

  if (this->__isset.zoneId) {
    xfer += oprot->writeFieldBegin("zoneId", ::apache::thrift::protocol::T_I32, 1);
    xfer += oprot->writeI32(this->zoneId);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.action) {
    xfer += oprot->writeFieldBegin("action", ::apache::thrift::protocol::T_I32, 2);
    xfer += oprot->writeI32((int32_t)this->action);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.roomId) {
    xfer += oprot->writeFieldBegin("roomId", ::apache::thrift::protocol::T_I32, 3);
    xfer += oprot->writeI32(this->roomId);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.roomCount) {
    xfer += oprot->writeFieldBegin("roomCount", ::apache::thrift::protocol::T_I32, 4);
    xfer += oprot->writeI32(this->roomCount);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.roomListEntry) {
    xfer += oprot->writeFieldBegin("roomListEntry", ::apache::thrift::protocol::T_STRUCT, 5);
    xfer += this->roomListEntry.write(oprot);
    xfer += oprot->writeFieldEnd();
  }
  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftZoneUpdateEvent &a, ThriftZoneUpdateEvent &b) {
  using ::std::swap;
  swap(a.zoneId, b.zoneId);
  swap(a.action, b.action);
  swap(a.roomId, b.roomId);
  swap(a.roomCount, b.roomCount);
  swap(a.roomListEntry, b.roomListEntry);
  swap(a.__isset, b.__isset);
}

ThriftZoneUpdateEvent::ThriftZoneUpdateEvent(const ThriftZoneUpdateEvent& other1) {
  zoneId = other1.zoneId;
  action = other1.action;
  roomId = other1.roomId;
  roomCount = other1.roomCount;
  roomListEntry = other1.roomListEntry;
  __isset = other1.__isset;
}
ThriftZoneUpdateEvent& ThriftZoneUpdateEvent::operator=(const ThriftZoneUpdateEvent& other2) {
  zoneId = other2.zoneId;
  action = other2.action;
  roomId = other2.roomId;
  roomCount = other2.roomCount;
  roomListEntry = other2.roomListEntry;
  __isset = other2.__isset;
  return *this;
}
void ThriftZoneUpdateEvent::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftZoneUpdateEvent(";
  out << "zoneId="; (__isset.zoneId ? (out << to_string(zoneId)) : (out << "<null>"));
  out << ", " << "action="; (__isset.action ? (out << to_string(action)) : (out << "<null>"));
  out << ", " << "roomId="; (__isset.roomId ? (out << to_string(roomId)) : (out << "<null>"));
  out << ", " << "roomCount="; (__isset.roomCount ? (out << to_string(roomCount)) : (out << "<null>"));
  out << ", " << "roomListEntry="; (__isset.roomListEntry ? (out << to_string(roomListEntry)) : (out << "<null>"));
  out << ")";
}

} // namespace
