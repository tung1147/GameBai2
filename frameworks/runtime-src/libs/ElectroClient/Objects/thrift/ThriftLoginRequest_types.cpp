/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#include "ThriftLoginRequest_types.h"

#include <algorithm>
#include <ostream>

#include "libs/TToString.h"

namespace es {


ThriftLoginRequest::~ThriftLoginRequest() throw() {
}


void ThriftLoginRequest::__set_userName(const std::string& val) {
  this->userName = val;
__isset.userName = true;
}

void ThriftLoginRequest::__set_password(const std::string& val) {
  this->password = val;
__isset.password = true;
}

void ThriftLoginRequest::__set_sharedSecret(const std::string& val) {
  this->sharedSecret = val;
__isset.sharedSecret = true;
}

void ThriftLoginRequest::__set_esObject(const  ::es::ThriftFlattenedEsObjectRO& val) {
  this->esObject = val;
__isset.esObject = true;
}

void ThriftLoginRequest::__set_userVariables(const std::map<std::string,  ::es::ThriftFlattenedEsObject> & val) {
  this->userVariables = val;
__isset.userVariables = true;
}

void ThriftLoginRequest::__set_protocol(const  ::es::ThriftProtocol::type val) {
  this->protocol = val;
__isset.protocol = true;
}

void ThriftLoginRequest::__set_hashId(const int32_t val) {
  this->hashId = val;
__isset.hashId = true;
}

void ThriftLoginRequest::__set_clientVersion(const std::string& val) {
  this->clientVersion = val;
__isset.clientVersion = true;
}

void ThriftLoginRequest::__set_clientType(const std::string& val) {
  this->clientType = val;
__isset.clientType = true;
}

void ThriftLoginRequest::__set_remoteAddress(const std::vector<int8_t> & val) {
  this->remoteAddress = val;
__isset.remoteAddress = true;
}

uint32_t ThriftLoginRequest::read(::apache::thrift::protocol::TProtocol* iprot) {

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
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->password);
          this->__isset.password = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 3:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->sharedSecret);
          this->__isset.sharedSecret = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 4:
        if (ftype == ::apache::thrift::protocol::T_STRUCT) {
          xfer += this->esObject.read(iprot);
          this->__isset.esObject = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 5:
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
      case 6:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          int32_t ecast7;
          xfer += iprot->readI32(ecast7);
          this->protocol = ( ::es::ThriftProtocol::type)ecast7;
          this->__isset.protocol = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 7:
        if (ftype == ::apache::thrift::protocol::T_I32) {
          xfer += iprot->readI32(this->hashId);
          this->__isset.hashId = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 8:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->clientVersion);
          this->__isset.clientVersion = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 9:
        if (ftype == ::apache::thrift::protocol::T_STRING) {
          xfer += iprot->readString(this->clientType);
          this->__isset.clientType = true;
        } else {
          xfer += iprot->skip(ftype);
        }
        break;
      case 10:
        if (ftype == ::apache::thrift::protocol::T_LIST) {
          {
            this->remoteAddress.clear();
            uint32_t _size8;
            ::apache::thrift::protocol::TType _etype11;
            xfer += iprot->readListBegin(_etype11, _size8);
            this->remoteAddress.resize(_size8);
            uint32_t _i12;
            for (_i12 = 0; _i12 < _size8; ++_i12)
            {
              xfer += iprot->readByte(this->remoteAddress[_i12]);
            }
            xfer += iprot->readListEnd();
          }
          this->__isset.remoteAddress = true;
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

uint32_t ThriftLoginRequest::write(::apache::thrift::protocol::TProtocol* oprot) const {
  uint32_t xfer = 0;
  apache::thrift::protocol::TOutputRecursionTracker tracker(*oprot);
  xfer += oprot->writeStructBegin("ThriftLoginRequest");

  if (this->__isset.userName) {
    xfer += oprot->writeFieldBegin("userName", ::apache::thrift::protocol::T_STRING, 1);
    xfer += oprot->writeString(this->userName);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.password) {
    xfer += oprot->writeFieldBegin("password", ::apache::thrift::protocol::T_STRING, 2);
    xfer += oprot->writeString(this->password);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.sharedSecret) {
    xfer += oprot->writeFieldBegin("sharedSecret", ::apache::thrift::protocol::T_STRING, 3);
    xfer += oprot->writeString(this->sharedSecret);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.esObject) {
    xfer += oprot->writeFieldBegin("esObject", ::apache::thrift::protocol::T_STRUCT, 4);
    xfer += this->esObject.write(oprot);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.userVariables) {
    xfer += oprot->writeFieldBegin("userVariables", ::apache::thrift::protocol::T_MAP, 5);
    {
      xfer += oprot->writeMapBegin(::apache::thrift::protocol::T_STRING, ::apache::thrift::protocol::T_STRUCT, static_cast<uint32_t>(this->userVariables.size()));
      std::map<std::string,  ::es::ThriftFlattenedEsObject> ::const_iterator _iter13;
      for (_iter13 = this->userVariables.begin(); _iter13 != this->userVariables.end(); ++_iter13)
      {
        xfer += oprot->writeString(_iter13->first);
        xfer += _iter13->second.write(oprot);
      }
      xfer += oprot->writeMapEnd();
    }
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.protocol) {
    xfer += oprot->writeFieldBegin("protocol", ::apache::thrift::protocol::T_I32, 6);
    xfer += oprot->writeI32((int32_t)this->protocol);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.hashId) {
    xfer += oprot->writeFieldBegin("hashId", ::apache::thrift::protocol::T_I32, 7);
    xfer += oprot->writeI32(this->hashId);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.clientVersion) {
    xfer += oprot->writeFieldBegin("clientVersion", ::apache::thrift::protocol::T_STRING, 8);
    xfer += oprot->writeString(this->clientVersion);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.clientType) {
    xfer += oprot->writeFieldBegin("clientType", ::apache::thrift::protocol::T_STRING, 9);
    xfer += oprot->writeString(this->clientType);
    xfer += oprot->writeFieldEnd();
  }
  if (this->__isset.remoteAddress) {
    xfer += oprot->writeFieldBegin("remoteAddress", ::apache::thrift::protocol::T_LIST, 10);
    {
      xfer += oprot->writeListBegin(::apache::thrift::protocol::T_BYTE, static_cast<uint32_t>(this->remoteAddress.size()));
      std::vector<int8_t> ::const_iterator _iter14;
      for (_iter14 = this->remoteAddress.begin(); _iter14 != this->remoteAddress.end(); ++_iter14)
      {
        xfer += oprot->writeByte((*_iter14));
      }
      xfer += oprot->writeListEnd();
    }
    xfer += oprot->writeFieldEnd();
  }
  xfer += oprot->writeFieldStop();
  xfer += oprot->writeStructEnd();
  return xfer;
}

void swap(ThriftLoginRequest &a, ThriftLoginRequest &b) {
  using ::std::swap;
  swap(a.userName, b.userName);
  swap(a.password, b.password);
  swap(a.sharedSecret, b.sharedSecret);
  swap(a.esObject, b.esObject);
  swap(a.userVariables, b.userVariables);
  swap(a.protocol, b.protocol);
  swap(a.hashId, b.hashId);
  swap(a.clientVersion, b.clientVersion);
  swap(a.clientType, b.clientType);
  swap(a.remoteAddress, b.remoteAddress);
  swap(a.__isset, b.__isset);
}

ThriftLoginRequest::ThriftLoginRequest(const ThriftLoginRequest& other15) {
  userName = other15.userName;
  password = other15.password;
  sharedSecret = other15.sharedSecret;
  esObject = other15.esObject;
  userVariables = other15.userVariables;
  protocol = other15.protocol;
  hashId = other15.hashId;
  clientVersion = other15.clientVersion;
  clientType = other15.clientType;
  remoteAddress = other15.remoteAddress;
  __isset = other15.__isset;
}
ThriftLoginRequest& ThriftLoginRequest::operator=(const ThriftLoginRequest& other16) {
  userName = other16.userName;
  password = other16.password;
  sharedSecret = other16.sharedSecret;
  esObject = other16.esObject;
  userVariables = other16.userVariables;
  protocol = other16.protocol;
  hashId = other16.hashId;
  clientVersion = other16.clientVersion;
  clientType = other16.clientType;
  remoteAddress = other16.remoteAddress;
  __isset = other16.__isset;
  return *this;
}
void ThriftLoginRequest::printTo(std::ostream& out) const {
  using ::apache::thrift::to_string;
  out << "ThriftLoginRequest(";
  out << "userName="; (__isset.userName ? (out << to_string(userName)) : (out << "<null>"));
  out << ", " << "password="; (__isset.password ? (out << to_string(password)) : (out << "<null>"));
  out << ", " << "sharedSecret="; (__isset.sharedSecret ? (out << to_string(sharedSecret)) : (out << "<null>"));
  out << ", " << "esObject="; (__isset.esObject ? (out << to_string(esObject)) : (out << "<null>"));
  out << ", " << "userVariables="; (__isset.userVariables ? (out << to_string(userVariables)) : (out << "<null>"));
  out << ", " << "protocol="; (__isset.protocol ? (out << to_string(protocol)) : (out << "<null>"));
  out << ", " << "hashId="; (__isset.hashId ? (out << to_string(hashId)) : (out << "<null>"));
  out << ", " << "clientVersion="; (__isset.clientVersion ? (out << to_string(clientVersion)) : (out << "<null>"));
  out << ", " << "clientType="; (__isset.clientType ? (out << to_string(clientType)) : (out << "<null>"));
  out << ", " << "remoteAddress="; (__isset.remoteAddress ? (out << to_string(remoteAddress)) : (out << "<null>"));
  out << ")";
}

} // namespace
