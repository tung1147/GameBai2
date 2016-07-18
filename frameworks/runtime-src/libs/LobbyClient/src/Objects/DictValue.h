/*
 * DictValue.h
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_OBJECTS_DICTVALUE_H_
#define LOBBYCLIENT_OBJECTS_DICTVALUE_H_
#include "Value.h"

namespace quyetnd {
namespace data{

class DictValue : public Value{
	std::map<std::string, Value*> data;
	virtual void printToOutStream(std::ostringstream& outStream, int padding);
public:
	DictValue();
	virtual ~DictValue();
	virtual void writeToBuffer(quyetnd::data::ValueWriter* writer);
	virtual void writeJson(std::ostringstream& str);

	bool isExistKey(const std::string& key);
	int size();
	void clear();

	void addItem(const std::string& key, Value* item);
	Value* getItem(const std::string& key);

	bool getBool(const std::string& key, bool defaultValue = 0);
	float getFloat(const std::string& key, float defaultValue = 0);
	double getDouble(const std::string& key, double defaultValue = 0);
	int64_t getInt(const std::string& key, int64_t defaultValue = 0);
	uint64_t getUInt(const std::string& key, uint64_t defaultValue = 0);
	const std::string& getString(const std::string& key, const std::string& defaultValue = "");
	DictValue* getDict(const std::string& key, DictValue* defaultValue = 0);
	ArrayValue* getArray(const std::string& key, ArrayValue* defaultValue = 0);

	void setBool(const std::string& key, bool value);
	void setFloat(const std::string& key, float value);
	void setDouble(const std::string& key, double value);
	void setInt(const std::string& key, int64_t value);
	void setUInt(const std::string& key, uint64_t value);
	void setString(const std::string& key, const std::string& value);
	DictValue* setDict(const std::string& key, DictValue* value = 0);
	ArrayValue* setArray(const std::string& key, ArrayValue* value = 0);

	static DictValue* create();
};

}
} /* namespace quyetnd */

#endif /* LOBBYCLIENT_OBJECTS_DICTVALUE_H_ */
