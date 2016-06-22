/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftGetRoomsInZoneResponse_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftGetRoomsInZoneResponse::~ThriftGetRoomsInZoneResponse() throw() {
}


void ThriftGetRoomsInZoneResponse::__set_zoneId(const int32_t val) {
  this->zoneId = val;
}

void ThriftGetRoomsInZoneResponse::__set_zoneName(const std::string& val) {
  this->zoneName = val;
}

void ThriftGetRoomsInZoneResponse::__set_entries(const std::vector< ::es::ThriftRoomListEntry> & val) {
  this->entries = val;
}

uint32_t ThriftGetRoomsInZoneResponse::read(::apache::thrift::protocol::TProtocol* iprot) {

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
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->zoneName);
          this->__isset.zoneName = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 3:
        if (ftype == ::apache::thrift::protocol::T_LIST) {
          {
            this->entries.clear();
            uint32_t _size0;
            ::apache::thrift::protocol::TType _etype3;
            xfer += iprot->readListBegin(_etype3, _size0);
            this->entries.resize(_size0);
            uint32_t _i4;
            for (_i4 = 0; _i4 < _size0; ++_i4)
            {
              xfer += this->entries[_i4].read(iprot);
            }
            xfer += iprot->readListEnd();
          }
          this->__isset.entries = true;
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

uint32_t ThriftGetRoomsInZoneResponse::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftGetRoomsInZoneResponse");

  xfer += oprot->writeFieldBegin("zoneId", ::apache::thrift::protocol::T_I32, 1);
  xfer += oprot->writeI32(this->zoneId);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("zoneName", ::apache::thrift::protocol::T_STRING, 2);
  xfer += oprot->writeString(this->zoneName);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("entries", ::apache::thrift::protocol::T_LIST, 3);
  {
    xfer += oprot->writeListBegin(::apache::thrift::protocol::T_STRUCT, static_cast<uint32_t>(this->entries.size()));
    std::vector< ::es::ThriftRoomListEntry> ::const_iterator _iter5;
    for (_iter5 = this->entries.begin(); _iter5 != this->entries.end(); ++_iter5)
    {
      xfer += (*_iter5).write(oprot);
    }
    xfer += oprot->writeListEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftGetRoomsInZoneResponse &a, ThriftGetRoomsInZoneResponse &b) {
  using ::std::swap;
  swap(a.zoneId, b.zoneId);
  swap(a.zoneName, b.zoneName);
  swap(a.entries, b.entries);
  swap(a.__isset, b.__isset);
}

ThriftGetRoomsInZoneResponse::ThriftGetRoomsInZoneResponse(const ThriftGetRoomsInZoneResponse& other6) {
  zoneId = other6.zoneId;
  zoneName = other6.zoneName;
  entries = other6.entries;
  __isset = other6.__isset;
}
ThriftGetRoomsInZoneResponse& ThriftGetRoomsInZoneResponse::operator=(const ThriftGetRoomsInZoneResponse& other7) {
  zoneId = other7.zoneId;
  zoneName = other7.zoneName;
  entries = other7.entries;
  __isset = other7.__isset;
  return *this;
}
void ThriftGetRoomsInZoneResponse::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftGetRoomsInZoneResponse(";
  out << "zoneId=" << to_string(zoneId);
  out << ", " << "zoneName=" << to_string(zoneName);
  out << ", " << "entries=" << to_string(entries);
  out << ")";
}

} // namespace
