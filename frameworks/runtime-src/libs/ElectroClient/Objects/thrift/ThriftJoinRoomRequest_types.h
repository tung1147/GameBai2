/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef ThriftJoinRoomRequest_TYPES_H
#define ThriftJoinRoomRequest_TYPES_H

#include <iosfwd>

#include "libs/Thrift.h"

#include "libs/TProtocol.h"
#include "libs/TTransport.h"

namespace es {

class ThriftJoinRoomRequest;

typedef struct _ThriftJoinRoomRequest__isset {
  _ThriftJoinRoomRequest__isset() : zoneName(false), roomName(false), zoneId(false), roomId(false), password(false), receivingRoomListUpdates(false), receivingRoomAttributeUpdates(false), receivingUserListUpdates(false), receivingUserVariableUpdates(false), receivingRoomVariableUpdates(false), receivingVideoEvents(false) {}
  bool zoneName :1;
  bool roomName :1;
  bool zoneId :1;
  bool roomId :1;
  bool password :1;
  bool receivingRoomListUpdates :1;
  bool receivingRoomAttributeUpdates :1;
  bool receivingUserListUpdates :1;
  bool receivingUserVariableUpdates :1;
  bool receivingRoomVariableUpdates :1;
  bool receivingVideoEvents :1;
} _ThriftJoinRoomRequest__isset;

class ThriftJoinRoomRequest {
 public:

  ThriftJoinRoomRequest(const ThriftJoinRoomRequest&);
  ThriftJoinRoomRequest& operator=(const ThriftJoinRoomRequest&);
  ThriftJoinRoomRequest() : zoneName(), roomName(), zoneId(0), roomId(0), password(), receivingRoomListUpdates(0), receivingRoomAttributeUpdates(0), receivingUserListUpdates(0), receivingUserVariableUpdates(0), receivingRoomVariableUpdates(0), receivingVideoEvents(0) {
  }

  virtual ~ThriftJoinRoomRequest() throw();
  std::string zoneName;
  std::string roomName;
  int32_t zoneId;
  int32_t roomId;
  std::string password;
  bool receivingRoomListUpdates;
  bool receivingRoomAttributeUpdates;
  bool receivingUserListUpdates;
  bool receivingUserVariableUpdates;
  bool receivingRoomVariableUpdates;
  bool receivingVideoEvents;

  _ThriftJoinRoomRequest__isset __isset;

  void __set_zoneName(const std::string& val);

  void __set_roomName(const std::string& val);

  void __set_zoneId(const int32_t val);

  void __set_roomId(const int32_t val);

  void __set_password(const std::string& val);

  void __set_receivingRoomListUpdates(const bool val);

  void __set_receivingRoomAttributeUpdates(const bool val);

  void __set_receivingUserListUpdates(const bool val);

  void __set_receivingUserVariableUpdates(const bool val);

  void __set_receivingRoomVariableUpdates(const bool val);

  void __set_receivingVideoEvents(const bool val);

  bool operator == (const ThriftJoinRoomRequest & rhs) const
  {
    if (__isset.zoneName != rhs.__isset.zoneName)
      return false;
    else if (__isset.zoneName && !(zoneName == rhs.zoneName))
      return false;
    if (__isset.roomName != rhs.__isset.roomName)
      return false;
    else if (__isset.roomName && !(roomName == rhs.roomName))
      return false;
    if (__isset.zoneId != rhs.__isset.zoneId)
      return false;
    else if (__isset.zoneId && !(zoneId == rhs.zoneId))
      return false;
    if (__isset.roomId != rhs.__isset.roomId)
      return false;
    else if (__isset.roomId && !(roomId == rhs.roomId))
      return false;
    if (__isset.password != rhs.__isset.password)
      return false;
    else if (__isset.password && !(password == rhs.password))
      return false;
    if (__isset.receivingRoomListUpdates != rhs.__isset.receivingRoomListUpdates)
      return false;
    else if (__isset.receivingRoomListUpdates && !(receivingRoomListUpdates == rhs.receivingRoomListUpdates))
      return false;
    if (__isset.receivingRoomAttributeUpdates != rhs.__isset.receivingRoomAttributeUpdates)
      return false;
    else if (__isset.receivingRoomAttributeUpdates && !(receivingRoomAttributeUpdates == rhs.receivingRoomAttributeUpdates))
      return false;
    if (__isset.receivingUserListUpdates != rhs.__isset.receivingUserListUpdates)
      return false;
    else if (__isset.receivingUserListUpdates && !(receivingUserListUpdates == rhs.receivingUserListUpdates))
      return false;
    if (__isset.receivingUserVariableUpdates != rhs.__isset.receivingUserVariableUpdates)
      return false;
    else if (__isset.receivingUserVariableUpdates && !(receivingUserVariableUpdates == rhs.receivingUserVariableUpdates))
      return false;
    if (__isset.receivingRoomVariableUpdates != rhs.__isset.receivingRoomVariableUpdates)
      return false;
    else if (__isset.receivingRoomVariableUpdates && !(receivingRoomVariableUpdates == rhs.receivingRoomVariableUpdates))
      return false;
    if (__isset.receivingVideoEvents != rhs.__isset.receivingVideoEvents)
      return false;
    else if (__isset.receivingVideoEvents && !(receivingVideoEvents == rhs.receivingVideoEvents))
      return false;
    return true;
  }
  bool operator != (const ThriftJoinRoomRequest &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const ThriftJoinRoomRequest & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

  virtual void printTo(std::ostream& out) const;
};

void swap(ThriftJoinRoomRequest &a, ThriftJoinRoomRequest &b);

inline std::ostream& operator<<(std::ostream& out, const ThriftJoinRoomRequest& obj)
{
  obj.printTo(out);
  return out;
}

} // namespace

#endif
