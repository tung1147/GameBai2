/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef ThriftRoomVariableUpdateAction_TYPES_H
#define ThriftRoomVariableUpdateAction_TYPES_H

#include <iosfwd>

#include "libs/Thrift.h"

#include "libs/TProtocol.h"
#include "libs/TTransport.h"




namespace es {

struct ThriftRoomVariableUpdateAction {
  enum type {
    ThriftRoomVariableUpdateAction_VariableCreated = 1,
    ThriftRoomVariableUpdateAction_VariableUpdated = 2,
    ThriftRoomVariableUpdateAction_VariableDeleted = 3
  };
};

//extern const std::map<int, const char*> _ThriftRoomVariableUpdateAction_VALUES_TO_NAMES;

} // namespace

#endif
