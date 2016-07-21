/*
 * ValueJSON.cpp
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#include "ValueJson.h"
#include "DictValue.h"
#include "ArrayValue.h"
#include "PrimitiveValue.h"
#include "rapidjson/rapidjson.h"
#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
#include <iomanip>

namespace quyetnd {
namespace data{

/****/

//
inline bool __checkDoubleIsFloat(double d){
	if (d < static_cast<double>(-std::numeric_limits<float>::max()) || d > static_cast<double>(std::numeric_limits<float>::max())){
		return false;
	}
	double b = static_cast<double>(static_cast<float>(d));
	return d >= b && d <= b;
}

inline Value* __createDictFromJSON(const rapidjson::Value& value);
inline Value* __createArrayFromJSON(const rapidjson::Value& value);
inline Value* __createValueFromJSON(const rapidjson::Value& value){
	int type = value.GetType();
	switch (type)
	{
	case rapidjson::Type::kNullType:{
		return new Value();
	}
	case rapidjson::Type::kFalseType:{
		auto pret = new PrimitiveValue();
		pret->setBool(false);
		return pret;
	}
	case rapidjson::Type::kTrueType:{
		auto pret = new PrimitiveValue();
		pret->setBool(true);
		return pret;
	}
	case rapidjson::Type::kNumberType:{
		auto pret = new PrimitiveValue();
		if (value.IsInt()){
			pret->setInt(value.GetInt());
		}
		else if (value.IsInt64()){
			pret->setInt(value.GetInt64());
		}
		else if (value.IsUint()){
			pret->setUInt(value.GetUint());
		}
		else if (value.IsUint64()){
			pret->setUInt(value.GetUint64());
		}
		else if (value.IsDouble()){
			double d = value.GetDouble();
			if (__checkDoubleIsFloat(d)){
				pret->setFloat((float)d);
			}
			else{
				pret->setDouble(d);
			}
		}
		return pret;
	}
	case rapidjson::Type::kStringType:{
		auto pret = new StringValue();
		pret->setString(value.GetString());
		//pret->setData(value.GetString(), value.GetStringLength());
		return pret;
	}
	case rapidjson::Type::kObjectType:{
		return __createDictFromJSON(value);
	}
	case rapidjson::Type::kArrayType:{
		return __createArrayFromJSON(value);
	}
	}

	return new Value();
}

inline Value* __createDictFromJSON(const rapidjson::Value& value){
	DictValue* pret = new DictValue();
	for (auto it = value.MemberBegin(); it != value.MemberEnd(); ++it){
		Value* item = __createValueFromJSON(it->value);
		pret->addItem(it->name.GetString(), item);
		item->release();
	}
	return pret;
}

inline Value* __createArrayFromJSON(const rapidjson::Value& value){
	ArrayValue* pret = new ArrayValue();
	for (int i = 0; i < value.Size(); i++){
		Value* item = __createValueFromJSON(value[i]);
		pret->addItem(item);
		item->release();
	}
	return pret;
}

/****/

ValueJson::ValueJson(){
	jsonStr = "";
	value = 0;
}

ValueJson::~ValueJson(){
	if (value){
		value->release();
		value = 0;
	}
}

void ValueJson::writeToBuffer(quyetnd::data::ValueWriter* writer){
	rapidjson::Document doc;
	if (doc.Parse<0>(jsonStr.c_str()).HasParseError()){
		//error parse json
	}
	else{
		if (value){
			value->release();
			value = 0;
		}
		this->value = __createValueFromJSON(doc);
		value->writeToBuffer(writer);
	}
}

void ValueJson::printDebug(){
	if (value){
		value->printDebug();
	}
	else{
		Value::printDebug();
	}
}

const std::string& ValueJson::getJSON(){
	return jsonStr;
}

DictValue* ValueJson::getValue(){
	return (DictValue*)value;
}

void ValueJson::initWithJson(const std::string& json){
	this->jsonStr = json;
}

void ValueJson::initWithValue(Value* v){
	if (value){
		value->release();
		value = 0;
	}
	value = v;
	value->retain();
	jsonStr = value->toJSON();
}

ValueJson* ValueJson::create(const std::string& json){
	ValueJson* value = new ValueJson();
	value->initWithJson(json);
	value->autorelease();
	return value;
}

ValueJson* ValueJson::create(Value* value){
	ValueJson* pret = new ValueJson();
	pret->initWithValue(value);
	pret->autorelease();
	return pret;
}

}
}/* namespace quyetnd */
