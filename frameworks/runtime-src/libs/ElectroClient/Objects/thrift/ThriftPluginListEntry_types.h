/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef ThriftPluginListEntry_TYPES_H
#define ThriftPluginListEntry_TYPES_H

#include <iosfwd>

#include "libs/Thrift.h"

#include "libs/TProtocol.h"
#include "libs/TTransport.h"


#include "ThriftFlattenedEsObject_types.h"


namespace es {

class ThriftPluginListEntry;

typedef struct _ThriftPluginListEntry__isset {
  _ThriftPluginListEntry__isset() : pluginName(false), sentToRoom(false), destinationZoneId(false), estinationRoomId(false), roomLevelPlugin(false), originZoneId(false), originRoomId(false), parameters(false) {}
  bool pluginName :1;
  bool sentToRoom :1;
  bool destinationZoneId :1;
  bool estinationRoomId :1;
  bool roomLevelPlugin :1;
  bool originZoneId :1;
  bool originRoomId :1;
  bool parameters :1;
} _ThriftPluginListEntry__isset;

class ThriftPluginListEntry {
 public:

  ThriftPluginListEntry(const ThriftPluginListEntry&);
  ThriftPluginListEntry& operator=(const ThriftPluginListEntry&);
  ThriftPluginListEntry() : pluginName(), sentToRoom(0), destinationZoneId(0), estinationRoomId(0), roomLevelPlugin(0), originZoneId(0), originRoomId(0) {
  }

  virtual ~ThriftPluginListEntry() throw();
  std::string pluginName;
  bool sentToRoom;
  int32_t destinationZoneId;
  int32_t estinationRoomId;
  bool roomLevelPlugin;
  int32_t originZoneId;
  int32_t originRoomId;
   ::es::ThriftFlattenedEsObject parameters;

  _ThriftPluginListEntry__isset __isset;

  void __set_pluginName(const std::string& val);

  void __set_sentToRoom(const bool val);

  void __set_destinationZoneId(const int32_t val);

  void __set_estinationRoomId(const int32_t val);

  void __set_roomLevelPlugin(const bool val);

  void __set_originZoneId(const int32_t val);

  void __set_originRoomId(const int32_t val);

  void __set_parameters(const  ::es::ThriftFlattenedEsObject& val);

  bool operator == (const ThriftPluginListEntry & rhs) const
  {
    if (!(pluginName == rhs.pluginName))
      return false;
    if (!(sentToRoom == rhs.sentToRoom))
      return false;
    if (!(destinationZoneId == rhs.destinationZoneId))
      return false;
    if (!(estinationRoomId == rhs.estinationRoomId))
      return false;
    if (!(roomLevelPlugin == rhs.roomLevelPlugin))
      return false;
    if (!(originZoneId == rhs.originZoneId))
      return false;
    if (!(originRoomId == rhs.originRoomId))
      return false;
    if (!(parameters == rhs.parameters))
      return false;
    return true;
  }
  bool operator != (const ThriftPluginListEntry &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const ThriftPluginListEntry & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

  virtual void printTo(std::ostream& out) const;
};

void swap(ThriftPluginListEntry &a, ThriftPluginListEntry &b);

inline std::ostream& operator<<(std::ostream& out, const ThriftPluginListEntry& obj)
{
  obj.printTo(out);
  return out;
}

} // namespace

#endif
