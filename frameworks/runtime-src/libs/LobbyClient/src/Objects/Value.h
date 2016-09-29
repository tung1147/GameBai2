/*
 * Value.h
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_OBJECTS_VALUE_H_
#define LOBBYCLIENT_OBJECTS_VALUE_H_

#include <sstream>
#include "LobbyRef.h"
#include "ValueWriter.h"
#include "rapidjson/rapidjson.h"
#include "rapidjson/document.h"

namespace quyetnd {
namespace data{

enum ValueType{
	TypeNULL = 0,
	TypeBool = 1,
	TypeFloat = 2,
	TypeDouble = 3,
	TypeInt = 4,
	TypeUInt = 5,
	TypeString = 6,
	TypeDict = 7,
	TypeArray = 8,
};

class PrimitiveValue;
class DictValue;
class ArrayValue;
class StringValue;

class Value : public LobbyRef{
	friend PrimitiveValue;
	friend DictValue;
	friend ArrayValue;
	friend StringValue;
protected:
	virtual void refreshLogBuffer(std::ostringstream& outStream);
	virtual void printToOutStream(std::ostringstream& outStream, int padding);
	virtual void printPadding(std::ostringstream& outStream, int padding);
	virtual void toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator);
public:
	int valueType;
public:
	Value();
	virtual ~Value();
	virtual void writeToBuffer(quyetnd::data::ValueWriter* writer);
	virtual void writeJson(std::ostringstream& str);
	virtual void printDebug();

	std::string toJSON();
};

}
} /* namespace quyetnd */

#endif /* LOBBYCLIENT_OBJECTS_VALUE_H_ */
