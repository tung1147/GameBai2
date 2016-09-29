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
#include <iomanip>
#include "rapidjson/stringbuffer.h"
#include "rapidjson/prettywriter.h"
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

#ifdef LOBBY_LOGGER
void Value::printDebug(){
	std::ostringstream outputStream;
	this->printToOutStream(outputStream, 0);
	refreshLogBuffer(outputStream);
}

void Value::refreshLogBuffer(std::ostringstream& outStream){
	quyetnd::log_to_console(outStream.str().c_str());
	outStream.str("");
	outStream.clear();
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
#endif

void Value::toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator){
	value.SetNull();
}

std::string Value::toJSON(){
	/*std::ostringstream stringStream;
	stringStream << std::setprecision(17);
	this->writeJson(stringStream);
	return stringStream.str();*/

	rapidjson::Document doc;
	this->toValue(doc, doc.GetAllocator());

	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	doc.Accept(writer);
	std::string jsonData = buffer.GetString();
	return jsonData;
}

}
} /* namespace quyetnd */
