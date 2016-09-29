/*
 * ArrayValue.h
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_OBJECTS_ARRAYVALUE_H_
#define LOBBYCLIENT_OBJECTS_ARRAYVALUE_H_
#include "Value.h"

namespace quyetnd {
namespace data{

class ArrayValue : public Value{
protected:
	std::vector<Value*> data;
#ifdef LOBBY_LOGGER
	virtual void printToOutStream(std::ostringstream& outStream, int padding);
#endif
	virtual void toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator);
public:
	ArrayValue();
	virtual ~ArrayValue();

	virtual void writeToBuffer(quyetnd::data::ValueWriter* writer);

	int size();
	void clear();

	void addItem(Value* item);
	Value* getItem(int index);

	void addBool(bool value);
	void addFloat(float value);
	void addDouble(double value);
	void addInt(int64_t value);
	void addUInt(uint64_t value);
	void addString(const std::string& value);
	DictValue* addDict(DictValue* value = 0);
	ArrayValue* addArray(ArrayValue* value = 0);

	bool getBool(int index);
	float getFloat(int index);
	double getDouble(int index);
	int64_t getInt(int index);
	uint64_t getUInt(int index);
	std::string getString(int index);
	DictValue* getDict(int index);
	ArrayValue* getArray(int index);

	static ArrayValue* create();
};

}
} /* namespace quyetnd */

#endif /* LOBBYCLIENT_OBJECTS_ARRAYVALUE_H_ */
