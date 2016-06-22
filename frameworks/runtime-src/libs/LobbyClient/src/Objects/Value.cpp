/*
 * Value.cpp
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#include "Value.h"
#include "PrimitiveValue.h"
#include "ArrayValue.h"
#include "DictValue.h"
#include "rapidjson/rapidjson.h"
#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
#include <iomanip>
#include "../Logger/Logger.h"

namespace quyetnd {
namespace data{
	
Value::Value() {
	// TODO Auto-generated constructor stub
	valueType = ValueType::TypeNULL;
}

Value::~Value() {
	// TODO Auto-generated destructor stub
//	quyetnd::log("delete Value[%d]", valueType);
}

void Value::writeToBuffer(quyetnd::data::ValueWriter* writer){
	writer->writeNil();
}

void Value::writeJson(std::ostringstream& str){
	str << "null";
}

void Value::printDebug(){
#ifdef LOBBY_LOGGER
	std::ostringstream outputStream;
	this->printToOutStream(outputStream, 0);
	refreshLogBuffer(outputStream);
#endif
}

void Value::refreshLogBuffer(std::ostringstream& outStream){
#ifdef LOBBY_LOGGER
	quyetnd::log_to_console(outStream.str().c_str());
	outStream.str("");
	outStream.clear();
#endif
}

void Value::printToOutStream(std::ostringstream& outStream, int padding){
	outStream << "[NULL]";
}

void Value::printPadding(std::ostringstream& outStream, int padding){
	for (int i = 0; i < padding; i++){
#if defined(ANDROID)
		outStream << "  ";
#else
		outStream << "\t";
#endif	
	}
}

std::string Value::toJSON(){
	std::ostringstream stringStream;
	stringStream << std::setprecision(17);
	this->writeJson(stringStream);
	return stringStream.str();
}

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
			else if(value.IsInt64()){
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

Value* Value::createFromJSON(const char* json, int size){
	rapidjson::Document doc;
	bool b = doc.Parse<0>(json).HasParseError();
	Value* value = 0;
	if (!b){
		value = __createValueFromJSON(doc);
	}
	else{
		value = new Value();
	}

	value->autorelease();
	return value;
}

Value* Value::createFromJSON(const std::string& json){
	return createFromJSON(json.c_str(), json.size());
}

}
} /* namespace quyetnd */
