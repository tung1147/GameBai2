/*
 * SFSObject.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_ENTITIES_SFSOBJECT_H_
#define SFSCLIENT_ENTITIES_SFSOBJECT_H_
#include "SFSEntity.h"
#include "SFSArray.h"
namespace SFS{
namespace Entity{

class SFSObject : public SFSEntity{
	std::map<std::string, SFSEntity*> mData;
public:
	SFSObject();
	virtual ~SFSObject();
	virtual void toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator);

	int size();

	virtual void writeToBuffer(StreamWriter* writer);
	virtual void initWithReader(StreamReader* reader);
#ifdef SFS_LOGGER
	virtual void printDebug(std::ostringstream& os, int padding);
#endif

	bool isExistKey(const std::string& key);

	SFSEntity* getItem(const std::string& key);
	void setItem(const std::string& key, SFSEntity* data);

	bool getBool(const std::string& key, bool defaultValue = false);
	char getByte(const std::string& key, char defaultValue = 0);
	int16_t getShort(const std::string& key, int16_t defaultValue = 0);
	int32_t getInt(const std::string& key, int32_t defaultValue = 0);
	int64_t getLong(const std::string& key, int64_t defaultValue = 0);
	float getFloat(const std::string& key, float defaultValue = 0);
	double getDouble(const std::string& key, double defaultValue = 0);
	std::string getString(const std::string& key, const std::string& defaultValue = "");
	SFSObject* getSFSObject(const std::string& key, SFSObject* defaultValue = 0);

	std::vector<bool> getBoolArray(const std::string& key);
	std::vector<char> getByteArray(const std::string& key);
	std::vector<int16_t> getShortArray(const std::string& key);
	std::vector<int32_t> getIntArray(const std::string& key);
	std::vector<int64_t> getLongArray(const std::string& key);
	std::vector<float> getFloatArray(const std::string& key);
	std::vector<double> getDoubleArray(const std::string& key);
	std::vector<std::string> getStringArray(const std::string& key);
	SFSArray* getSFSArray(const std::string& key);

	void setBool(const std::string& key, bool value);
	void setByte(const std::string& key, char value);
	void setShort(const std::string& key, int16_t value);
	void setInt(const std::string& key, int32_t value);
	void setLong(const std::string& key, int64_t value);
	void setFloat(const std::string& key, float value);
	void setDouble(const std::string& key, double value);
	void setString(const std::string& key, const std::string& value);
	SFSObject* setSFSObject(const std::string& key, SFSObject* object = 0);

	void setBoolArray(const std::string& key, const std::vector<bool>& arr);
	void setByteArray(const std::string& key, const std::vector<char>& arr);
	void setShortArray(const std::string& key, const std::vector<int16_t>& arr);
	void setIntArray(const std::string& key, const std::vector<int32_t>& arr);
	void setLongArray(const std::string& key, const std::vector<int64_t>& arr);
	void setFloatArray(const std::string& key, const std::vector<float>& arr);
	void setDoubleArray(const std::string& key, const  std::vector<double>& arr);
	void setStringArray(const std::string& key, const std::vector<std::string>& arr);
	SFSArray* setSFSObjectArray(const std::string& key, SFSArray* sfsArray = 0);

	static SFSObject* create();
};

}
}

#endif /* SFSCLIENT_ENTITIES_SFSOBJECT_H_ */
