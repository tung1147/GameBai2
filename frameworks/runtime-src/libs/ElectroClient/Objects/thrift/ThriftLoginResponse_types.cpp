/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftLoginResponse_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftLoginResponse::~ThriftLoginResponse() throw() {
}


void ThriftLoginResponse::__set_successful(const bool val) {
  this->successful = val;
}

void ThriftLoginResponse::__set_error(const  ::es::ThriftErrorType::type val) {
  this->error = val;
}

void ThriftLoginResponse::__set_esObject(const  ::es::ThriftFlattenedEsObjectRO& val) {
  this->esObject = val;
}

void ThriftLoginResponse::__set_userName(const std::string& val) {
  this->userName = val;
}

void ThriftLoginResponse::__set_userVariables(const std::map<std::string,  ::es::ThriftFlattenedEsObjectRO> & val) {
  this->userVariables = val;
}

void ThriftLoginResponse::__set_buddyListEntries(const std::map<std::string,  ::es::ThriftFlattenedEsObjectRO> & val) {
  this->buddyListEntries = val;
}

uint32_t ThriftLoginResponse::read(::apache::thrift::protocol::TProtocol* iprot) {

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
        if (ftype == ::apache::thrift::protocol::T_BOOL) {
          xfer += iprot->readBool(this->successful);
          this->__isset.successful = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 2:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          int32_t ecast0;
          xfer += iprot->readI32(ecast0);
          this->error = ( ::es::ThriftErrorType::type)ecast0;
          this->__isset.error = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 3:
        if (ftype == ::apache::thrift::protocol::T_STRUCT) {
          xfer += this->esObject.read(iprot);
          this->__isset.esObject = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 4:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->userName);
          this->__isset.userName = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 5:
        if (ftype == ::apache::thrift::protocol::T_MAP) {
          {
            this->userVariables.clear();
            uint32_t _size1;
            ::apache::thrift::protocol::TType _ktype2;
            ::apache::thrift::protocol::TType _vtype3;
            xfer += iprot->readMapBegin(_ktype2, _vtype3, _size1);
            uint32_t _i5;
            for (_i5 = 0; _i5 < _size1; ++_i5)
            {
              std::string _key6;
              xfer += iprot->readString(_key6);
               ::es::ThriftFlattenedEsObjectRO& _val7 = this->userVariables[_key6];
              xfer += _val7.read(iprot);
            }
            xfer += iprot->readMapEnd();
          }
          this->__isset.userVariables = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 6:
        if (ftype == ::apache::thrift::protocol::T_MAP) {
          {
            this->buddyListEntries.clear();
            uint32_t _size8;
            ::apache::thrift::protocol::TType _ktype9;
            ::apache::thrift::protocol::TType _vtype10;
            xfer += iprot->readMapBegin(_ktype9, _vtype10, _size8);
            uint32_t _i12;
            for (_i12 = 0; _i12 < _size8; ++_i12)
            {
              std::string _key13;
              xfer += iprot->readString(_key13);
               ::es::ThriftFlattenedEsObjectRO& _val14 = this->buddyListEntries[_key13];
              xfer += _val14.read(iprot);
            }
            xfer += iprot->readMapEnd();
          }
          this->__isset.buddyListEntries = true;
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

uint32_t ThriftLoginResponse::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftLoginResponse");

  xfer += oprot->writeFieldBegin("successful", ::apache::thrift::protocol::T_BOOL, 1);
  xfer += oprot->writeBool(this->successful);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("error", ::apache::thrift::protocol::T_I32, 2);
  xfer += oprot->writeI32((int32_t)this->error);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("esObject", ::apache::thrift::protocol::T_STRUCT, 3);
  xfer += this->esObject.write(oprot);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("userName", ::apache::thrift::protocol::T_STRING, 4);
  xfer += oprot->writeString(this->userName);
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("userVariables", ::apache::thrift::protocol::T_MAP, 5);
  {
    xfer += oprot->writeMapBegin(::apache::thrift::protocol::T_STRING, ::apache::thrift::protocol::T_STRUCT, static_cast<uint32_t>(this->userVariables.size()));
    std::map<std::string,  ::es::ThriftFlattenedEsObjectRO> ::const_iterator _iter15;
    for (_iter15 = this->userVariables.begin(); _iter15 != this->userVariables.end(); ++_iter15)
    {
      xfer += oprot->writeString(_iter15->first);
      xfer += _iter15->second.write(oprot);
    }
    xfer += oprot->writeMapEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldBegin("buddyListEntries", ::apache::thrift::protocol::T_MAP, 6);
  {
    xfer += oprot->writeMapBegin(::apache::thrift::protocol::T_STRING, ::apache::thrift::protocol::T_STRUCT, static_cast<uint32_t>(this->buddyListEntries.size()));
    std::map<std::string,  ::es::ThriftFlattenedEsObjectRO> ::const_iterator _iter16;
    for (_iter16 = this->buddyListEntries.begin(); _iter16 != this->buddyListEntries.end(); ++_iter16)
    {
      xfer += oprot->writeString(_iter16->first);
      xfer += _iter16->second.write(oprot);
    }
    xfer += oprot->writeMapEnd();
  }
  xfer += oprot->writeFieldEnd();

  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftLoginResponse &a, ThriftLoginResponse &b) {
  using ::std::swap;
  swap(a.successful, b.successful);
  swap(a.error, b.error);
  swap(a.esObject, b.esObject);
  swap(a.userName, b.userName);
  swap(a.userVariables, b.userVariables);
  swap(a.buddyListEntries, b.buddyListEntries);
  swap(a.__isset, b.__isset);
}

ThriftLoginResponse::ThriftLoginResponse(const ThriftLoginResponse& other17) {
  successful = other17.successful;
  error = other17.error;
  esObject = other17.esObject;
  userName = other17.userName;
  userVariables = other17.userVariables;
  buddyListEntries = other17.buddyListEntries;
  __isset = other17.__isset;
}
ThriftLoginResponse& ThriftLoginResponse::operator=(const ThriftLoginResponse& other18) {
  successful = other18.successful;
  error = other18.error;
  esObject = other18.esObject;
  userName = other18.userName;
  userVariables = other18.userVariables;
  buddyListEntries = other18.buddyListEntries;
  __isset = other18.__isset;
  return *this;
}
void ThriftLoginResponse::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftLoginResponse(";
  out << "successful=" << to_string(successful);
  out << ", " << "error=" << to_string(error);
  out << ", " << "esObject=" << to_string(esObject);
  out << ", " << "userName=" << to_string(userName);
  out << ", " << "userVariables=" << to_string(userVariables);
  out << ", " << "buddyListEntries=" << to_string(buddyListEntries);
  out << ")";
}

} // namespace
