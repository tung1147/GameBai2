/**
 * Autogenerated by Thrift Compiler (0.9.3)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef ThriftSearchCriteria_TYPES_H
#define ThriftSearchCriteria_TYPES_H

#include <iosfwd>

#include "libs/Thrift.h"

#include "libs/TProtocol.h"
#include "libs/TTransport.h"


#include "ThriftFlattenedEsObject_types.h"


namespace es {

class ThriftSearchCriteria;

typedef struct _ThriftSearchCriteria__isset {
  _ThriftSearchCriteria__isset() : gameId(false), locked(false), lockedSet(false), gameType(false), gameDetails(false) {}
  bool gameId :1;
  bool locked :1;
  bool lockedSet :1;
  bool gameType :1;
  bool gameDetails :1;
} _ThriftSearchCriteria__isset;

class ThriftSearchCriteria {
 public:

  ThriftSearchCriteria(const ThriftSearchCriteria&);
  ThriftSearchCriteria& operator=(const ThriftSearchCriteria&);
  ThriftSearchCriteria() : gameId(0), locked(0), lockedSet(0), gameType() {
  }

  virtual ~ThriftSearchCriteria() throw();
  int32_t gameId;
  bool locked;
  bool lockedSet;
  std::string gameType;
   ::es::ThriftFlattenedEsObject gameDetails;

  _ThriftSearchCriteria__isset __isset;

  void __set_gameId(const int32_t val);

  void __set_locked(const bool val);

  void __set_lockedSet(const bool val);

  void __set_gameType(const std::string& val);

  void __set_gameDetails(const  ::es::ThriftFlattenedEsObject& val);

  bool operator == (const ThriftSearchCriteria & rhs) const
  {
    if (!(gameId == rhs.gameId))
      return false;
    if (!(locked == rhs.locked))
      return false;
    if (!(lockedSet == rhs.lockedSet))
      return false;
    if (!(gameType == rhs.gameType))
      return false;
    if (!(gameDetails == rhs.gameDetails))
      return false;
    return true;
  }
  bool operator != (const ThriftSearchCriteria &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const ThriftSearchCriteria & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

  virtual void printTo(std::ostream& out) const;
};

void swap(ThriftSearchCriteria &a, ThriftSearchCriteria &b);

inline std::ostream& operator<<(std::ostream& out, const ThriftSearchCriteria& obj)
{
  obj.printTo(out);
  return out;
}

} // namespace

#endif
