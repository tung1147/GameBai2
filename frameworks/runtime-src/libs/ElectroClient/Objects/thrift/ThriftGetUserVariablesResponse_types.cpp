/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftGetUserVariablesResponse_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftGetUserVariablesResponse::~ThriftGetUserVariablesResponse() throw() {
}


void ThriftGetUserVariablesResponse::__set_userName(const std::string& val) {
  this->userName = val;
}

void ThriftGetUserVariablesResponse::__set_userVariables(const std::map<std::string,  ::es::ThriftFlattenedEsObject> & val) {
  this->userVariables = val;
}

uint32_t ThriftGetUserVariablesResponse::read(::apache::thrift::protocol::TProtocol* iprot) {

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
          xfer += iprot->readString(this->userName);
          this->__isset.userName = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 2:
        if (ftype == ::apache::thrift::protocol::T_MAP) {
          {
            this->userVariables.clear();
            uint32_t _size0;
            ::apache::thrift::protocol::TType _ktype1;
            ::apache::thrift::protocol::TType _vtype2;
            xfer += iprot->readMapBegin(_ktype1, _vtype2, _size0);
            uint32_t _i4;
            for (_i4 = 0; _i4 < _size0; ++_i4)
            {
              std::string _key5;
              xfer += iprot->readString(_key5);
               ::es::ThriftFlattenedEsObject& _val6 = this->userVariables[_key5];
              xfer += _val6.read(iprot);
            }
            xfer += iprot->readMapEnd();
          }
          this->__isset.userVariables = true;
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

uint32_t ThriftGetUserVariablesResponse::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftGetUserVariablesResponse");

  xfer += oprot->writeFieldBegin("userName", ::apache::thrift::protocol::T_STRING, 1);
  xfer += oprot->writeString(this->userName);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("userVariables", ::apache::thrift::protocol::T_MAP, 2);
  {
    xfer += oprot->writeMapBegin(::apache::thrift::protocol::T_STRING, ::apache::thrift::protocol::T_STRUCT, static_cast<uint32_t>(this->userVariables.size()));
    std::map<std::string,  ::es::ThriftFlattenedEsObject> ::const_iterator _iter7;
    for (_iter7 = this->userVariables.begin(); _iter7 != this->userVariables.end(); ++_iter7)
    {
      xfer += oprot->writeString(_iter7->first);
      xfer += _iter7->second.write(oprot);
    }
    xfer += oprot->writeMapEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftGetUserVariablesResponse &a, ThriftGetUserVariablesResponse &b) {
  using ::std::swap;
  swap(a.userName, b.userName);
  swap(a.userVariables, b.userVariables);
  swap(a.__isset, b.__isset);
}

ThriftGetUserVariablesResponse::ThriftGetUserVariablesResponse(const ThriftGetUserVariablesResponse& other8) {
  userName = other8.userName;
  userVariables = other8.userVariables;
  __isset = other8.__isset;
}
ThriftGetUserVariablesResponse& ThriftGetUserVariablesResponse::operator=(const ThriftGetUserVariablesResponse& other9) {
  userName = other9.userName;
  userVariables = other9.userVariables;
  __isset = other9.__isset;
  return *this;
}
void ThriftGetUserVariablesResponse::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftGetUserVariablesResponse(";
  out << "userName=" << to_string(userName);
  out << ", " << "userVariables=" << to_string(userVariables);
  out << ")";
}

} // namespace
