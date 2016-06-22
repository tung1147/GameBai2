/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef ThriftLoginResponse_TYPES_H
#define ThriftLoginResponse_TYPES_H

#include <iosfwd>

#include "libs/Thrift.h"

#include "libs/TProtocol.h"
#include "libs/TTransport.h"


#include "ThriftFlattenedEsObjectRO_types.h"
#include "ThriftErrorType_types.h"


namespace es {

class ThriftLoginResponse;

typedef struct _ThriftLoginResponse__isset {
  _ThriftLoginResponse__isset() : successful(false), error(false), esObject(false), userName(false), userVariables(false), buddyListEntries(false) {}
  bool successful :1;
  bool error :1;
  bool esObject :1;
  bool userName :1;
  bool userVariables :1;
  bool buddyListEntries :1;
} _ThriftLoginResponse__isset;

class ThriftLoginResponse {
 public:

  ThriftLoginResponse(const ThriftLoginResponse&);
  ThriftLoginResponse& operator=(const ThriftLoginResponse&);
  ThriftLoginResponse() : successful(0), error(( ::es::ThriftErrorType::type)0), userName() {
  }

  virtual ~ThriftLoginResponse() throw();
  bool successful;
   ::es::ThriftErrorType::type error;
   ::es::ThriftFlattenedEsObjectRO esObject;
  std::string userName;
  std::map<std::string,  ::es::ThriftFlattenedEsObjectRO>  userVariables;
  std::map<std::string,  ::es::ThriftFlattenedEsObjectRO>  buddyListEntries;

  _ThriftLoginResponse__isset __isset;

  void __set_successful(const bool val);

  void __set_error(const  ::es::ThriftErrorType::type val);

  void __set_esObject(const  ::es::ThriftFlattenedEsObjectRO& val);

  void __set_userName(const std::string& val);

  void __set_userVariables(const std::map<std::string,  ::es::ThriftFlattenedEsObjectRO> & val);

  void __set_buddyListEntries(const std::map<std::string,  ::es::ThriftFlattenedEsObjectRO> & val);

  bool operator == (const ThriftLoginResponse & rhs) const
  {
    if (!(successful == rhs.successful))
      return false;
    if (!(error == rhs.error))
      return false;
    if (!(esObject == rhs.esObject))
      return false;
    if (!(userName == rhs.userName))
      return false;
    if (!(userVariables == rhs.userVariables))
      return false;
    if (!(buddyListEntries == rhs.buddyListEntries))
      return false;
    return true;
  }
  bool operator != (const ThriftLoginResponse &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const ThriftLoginResponse & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

  virtual void printTo(std::ostream& out) const;
};

void swap(ThriftLoginResponse &a, ThriftLoginResponse &b);

inline std::ostream& operator<<(std::ostream& out, const ThriftLoginResponse& obj)
{
  obj.printTo(out);
  return out;
}

} // namespace

#endif
