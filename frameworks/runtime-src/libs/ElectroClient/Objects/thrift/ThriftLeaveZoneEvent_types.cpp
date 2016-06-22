/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftLeaveZoneEvent_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftLeaveZoneEvent::~ThriftLeaveZoneEvent() throw() {
}


void ThriftLeaveZoneEvent::__set_zoneId(const int32_t val) {
  this->zoneId = val;
}

uint32_t ThriftLeaveZoneEvent::read(::apache::thrift::protocol::TProtocol* iprot) {

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
      default:
        xfer += iprot->skip(ftype);
        break;
    }
    xfer += iprot->readFieldEnd();
  }

  xfer += iprot->readStructEnd();

  return xfer;
}

uint32_t ThriftLeaveZoneEvent::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftLeaveZoneEvent");

  xfer += oprot->writeFieldBegin("zoneId", ::apache::thrift::protocol::T_I32, 1);
  xfer += oprot->writeI32(this->zoneId);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftLeaveZoneEvent &a, ThriftLeaveZoneEvent &b) {
  using ::std::swap;
  swap(a.zoneId, b.zoneId);
  swap(a.__isset, b.__isset);
}

ThriftLeaveZoneEvent::ThriftLeaveZoneEvent(const ThriftLeaveZoneEvent& other0) {
  zoneId = other0.zoneId;
  __isset = other0.__isset;
}
ThriftLeaveZoneEvent& ThriftLeaveZoneEvent::operator=(const ThriftLeaveZoneEvent& other1) {
  zoneId = other1.zoneId;
  __isset = other1.__isset;
  return *this;
}
void ThriftLeaveZoneEvent::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftLeaveZoneEvent(";
  out << "zoneId=" << to_string(zoneId);
  out << ")";
}

} // namespace
