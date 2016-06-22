/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftPluginListEntry_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftPluginListEntry::~ThriftPluginListEntry() throw() {
}


void ThriftPluginListEntry::__set_pluginName(const std::string& val) {
  this->pluginName = val;
}

void ThriftPluginListEntry::__set_sentToRoom(const bool val) {
  this->sentToRoom = val;
}

void ThriftPluginListEntry::__set_destinationZoneId(const int32_t val) {
  this->destinationZoneId = val;
}

void ThriftPluginListEntry::__set_estinationRoomId(const int32_t val) {
  this->estinationRoomId = val;
}

void ThriftPluginListEntry::__set_roomLevelPlugin(const bool val) {
  this->roomLevelPlugin = val;
}

void ThriftPluginListEntry::__set_originZoneId(const int32_t val) {
  this->originZoneId = val;
}

void ThriftPluginListEntry::__set_originRoomId(const int32_t val) {
  this->originRoomId = val;
}

void ThriftPluginListEntry::__set_parameters(const  ::es::ThriftFlattenedEsObject& val) {
  this->parameters = val;
}

uint32_t ThriftPluginListEntry::read(::apache::thrift::protocol::TProtocol* iprot) {

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
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->pluginName);
          this->__isset.pluginName = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 2:
        if (ftype == ::apache::thrift::protocol::T_BOOL) {
          xfer += iprot->readBool(this->sentToRoom);
          this->__isset.sentToRoom = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 3:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->destinationZoneId);
          this->__isset.destinationZoneId = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 4:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->estinationRoomId);
          this->__isset.estinationRoomId = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 5:
        if (ftype == ::apache::thrift::protocol::T_BOOL) {
          xfer += iprot->readBool(this->roomLevelPlugin);
          this->__isset.roomLevelPlugin = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 6:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->originZoneId);
          this->__isset.originZoneId = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 7:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->originRoomId);
          this->__isset.originRoomId = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 8:
        if (ftype == ::apache::thrift::protocol::T_STRUCT) {
          xfer += this->parameters.read(iprot);
          this->__isset.parameters = true;
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

uint32_t ThriftPluginListEntry::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftPluginListEntry");

  xfer += oprot->writeFieldBegin("pluginName", ::apache::thrift::protocol::T_STRING, 1);
  xfer += oprot->writeString(this->pluginName);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("sentToRoom", ::apache::thrift::protocol::T_BOOL, 2);
  xfer += oprot->writeBool(this->sentToRoom);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("destinationZoneId", ::apache::thrift::protocol::T_I32, 3);
  xfer += oprot->writeI32(this->destinationZoneId);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("estinationRoomId", ::apache::thrift::protocol::T_I32, 4);
  xfer += oprot->writeI32(this->estinationRoomId);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("roomLevelPlugin", ::apache::thrift::protocol::T_BOOL, 5);
  xfer += oprot->writeBool(this->roomLevelPlugin);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("originZoneId", ::apache::thrift::protocol::T_I32, 6);
  xfer += oprot->writeI32(this->originZoneId);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("originRoomId", ::apache::thrift::protocol::T_I32, 7);
  xfer += oprot->writeI32(this->originRoomId);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("parameters", ::apache::thrift::protocol::T_STRUCT, 8);
  xfer += this->parameters.write(oprot);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftPluginListEntry &a, ThriftPluginListEntry &b) {
  using ::std::swap;
  swap(a.pluginName, b.pluginName);
  swap(a.sentToRoom, b.sentToRoom);
  swap(a.destinationZoneId, b.destinationZoneId);
  swap(a.estinationRoomId, b.estinationRoomId);
  swap(a.roomLevelPlugin, b.roomLevelPlugin);
  swap(a.originZoneId, b.originZoneId);
  swap(a.originRoomId, b.originRoomId);
  swap(a.parameters, b.parameters);
  swap(a.__isset, b.__isset);
}

ThriftPluginListEntry::ThriftPluginListEntry(const ThriftPluginListEntry& other0) {
  pluginName = other0.pluginName;
  sentToRoom = other0.sentToRoom;
  destinationZoneId = other0.destinationZoneId;
  estinationRoomId = other0.estinationRoomId;
  roomLevelPlugin = other0.roomLevelPlugin;
  originZoneId = other0.originZoneId;
  originRoomId = other0.originRoomId;
  parameters = other0.parameters;
  __isset = other0.__isset;
}
ThriftPluginListEntry& ThriftPluginListEntry::operator=(const ThriftPluginListEntry& other1) {
  pluginName = other1.pluginName;
  sentToRoom = other1.sentToRoom;
  destinationZoneId = other1.destinationZoneId;
  estinationRoomId = other1.estinationRoomId;
  roomLevelPlugin = other1.roomLevelPlugin;
  originZoneId = other1.originZoneId;
  originRoomId = other1.originRoomId;
  parameters = other1.parameters;
  __isset = other1.__isset;
  return *this;
}
void ThriftPluginListEntry::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftPluginListEntry(";
  out << "pluginName=" << to_string(pluginName);
  out << ", " << "sentToRoom=" << to_string(sentToRoom);
  out << ", " << "destinationZoneId=" << to_string(destinationZoneId);
  out << ", " << "estinationRoomId=" << to_string(estinationRoomId);
  out << ", " << "roomLevelPlugin=" << to_string(roomLevelPlugin);
  out << ", " << "originZoneId=" << to_string(originZoneId);
  out << ", " << "originRoomId=" << to_string(originRoomId);
  out << ", " << "parameters=" << to_string(parameters);
  out << ")";
}

} // namespace
