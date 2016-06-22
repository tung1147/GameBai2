/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef ThriftPrivateMessageRequest_TYPES_H
#define ThriftPrivateMessageRequest_TYPES_H

#include <iosfwd>

#include "libs/Thrift.h"
//
#include "libs/TProtocol.h"
#include "libs/TTransport.h"

//
#include "ThriftFlattenedEsObject_types.h"


namespace es {

class ThriftPrivateMessageRequest;

typedef struct _ThriftPrivateMessageRequest__isset {
  _ThriftPrivateMessageRequest__isset() : message(false), userNames(false), esObject(false) {}
  bool message :1;
  bool userNames :1;
  bool esObject :1;
} _ThriftPrivateMessageRequest__isset;

class ThriftPrivateMessageRequest {
 public:

  ThriftPrivateMessageRequest(const ThriftPrivateMessageRequest&);
  ThriftPrivateMessageRequest& operator=(const ThriftPrivateMessageRequest&);
  ThriftPrivateMessageRequest() : message() {
  }

  virtual ~ThriftPrivateMessageRequest() throw();
  std::string message;
  std::vector<std::string>  userNames;
   ::es::ThriftFlattenedEsObject esObject;

  _ThriftPrivateMessageRequest__isset __isset;

  void __set_message(const std::string& val);

  void __set_userNames(const std::vector<std::string> & val);

  void __set_esObject(const  ::es::ThriftFlattenedEsObject& val);

  bool operator == (const ThriftPrivateMessageRequest & rhs) const
  {
    if (__isset.message != rhs.__isset.message)
      return false;
    else if (__isset.message && !(message == rhs.message))
      return false;
    if (__isset.userNames != rhs.__isset.userNames)
      return false;
    else if (__isset.userNames && !(userNames == rhs.userNames))
      return false;
    if (__isset.esObject != rhs.__isset.esObject)
      return false;
    else if (__isset.esObject && !(esObject == rhs.esObject))
      return false;
    return true;
  }
  bool operator != (const ThriftPrivateMessageRequest &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const ThriftPrivateMessageRequest & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

  virtual void printTo(std::ostream& out) const;
};

void swap(ThriftPrivateMessageRequest &a, ThriftPrivateMessageRequest &b);

inline std::ostream& operator<<(std::ostream& out, const ThriftPrivateMessageRequest& obj)
{
  obj.printTo(out);
  return out;
}

} // namespace

#endif
