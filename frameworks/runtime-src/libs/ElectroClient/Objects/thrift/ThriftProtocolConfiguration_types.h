/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef ThriftProtocolConfiguration_TYPES_H
#define ThriftProtocolConfiguration_TYPES_H

#include <iosfwd>

#include "libs/Thrift.h"

#include "libs/TProtocol.h"
#include "libs/TTransport.h"




namespace es {

class ThriftProtocolConfiguration;

typedef struct _ThriftProtocolConfiguration__isset {
  _ThriftProtocolConfiguration__isset() : messageCompressionThreshold(false) {}
  bool messageCompressionThreshold :1;
} _ThriftProtocolConfiguration__isset;

class ThriftProtocolConfiguration {
 public:

  ThriftProtocolConfiguration(const ThriftProtocolConfiguration&);
  ThriftProtocolConfiguration& operator=(const ThriftProtocolConfiguration&);
  ThriftProtocolConfiguration() : messageCompressionThreshold(0) {
  }

  virtual ~ThriftProtocolConfiguration() throw();
  int32_t messageCompressionThreshold;

  _ThriftProtocolConfiguration__isset __isset;

  void __set_messageCompressionThreshold(const int32_t val);

  bool operator == (const ThriftProtocolConfiguration & rhs) const
  {
    if (!(messageCompressionThreshold == rhs.messageCompressionThreshold))
      return false;
    return true;
  }
  bool operator != (const ThriftProtocolConfiguration &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const ThriftProtocolConfiguration & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

  virtual void printTo(std::ostream& out) const;
};

void swap(ThriftProtocolConfiguration &a, ThriftProtocolConfiguration &b);

inline std::ostream& operator<<(std::ostream& out, const ThriftProtocolConfiguration& obj)
{
  obj.printTo(out);
  return out;
}

} // namespace

#endif
