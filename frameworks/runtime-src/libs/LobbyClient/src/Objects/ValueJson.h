/*
 * ValueJSON.h
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_OBJECTS_VALUEJSON_H_
#define LOBBYCLIENT_OBJECTS_VALUEJSON_H_

#include "Value.h"

namespace quyetnd {
namespace data{

class ValueJson : public Value{
	std::string jsonStr;
	Value* value;

	void initWithJson(const std::string& json);
	void initWithValue(Value* value);
public:
	ValueJson();
	virtual ~ValueJson();
	virtual void writeToBuffer(quyetnd::data::ValueWriter* writer);
#ifdef LOBBY_LOGGER
	virtual void printDebug();
#endif

	const std::string& getJSON();
	Value* getValue();

	static ValueJson* create(const std::string& json);
	static ValueJson* create(Value* value);
};

}
}

#endif /* LOBBYCLIENT_OBJECTS_VALUEJSON_H_ */
