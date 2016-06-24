/*
 * ValueWriter.h
 *
 *  Created on: Jun 10, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_OBJECTS_VALUEWRITER_H_
#define LOBBYCLIENT_OBJECTS_VALUEWRITER_H_

#ifndef __STDINT_LIMITS
#define __STDINT_LIMITS
#endif
#include <cstdint>
#include <vector>
#include <string>
#include <stack>

namespace quyetnd {
namespace data {

class ValueWriter {
	void write_native_Bytes(const char* bytes, int32_t size);
	void write_native_Int8(int8_t value);
	void write_native_Int16(int16_t value);
	void write_native_Int32(int32_t value);
	void write_native_Int64(int64_t value);
	void write_native_UInt8(uint8_t value);
	void write_native_UInt16(uint16_t value);
	void write_native_UInt32(uint32_t value);
	void write_native_UInt64(uint64_t value);
	void write_native_float(float f);
	void write_native_double(double d);

	std::vector<char> mBuffer;
public:
	ValueWriter();
	virtual ~ValueWriter();

	const std::vector<char>& getBuffer();
	void clear();

	void writeNil();
	void writeBool(bool b);
	void writeUint(uint64_t i64);
	void writeInt(int64_t i64);
	void writeFloat(float f);
	void writeDouble(double d);
	void writeString(const std::string& str);
	void writeBin(const char* str, uint32_t size);
	void writeArray(uint32_t size);
	void writeMap(uint32_t size);

	void createDataLength();
};

}
} /* namespace quyetnd */

#endif /* LOBBYCLIENT_OBJECTS_VALUEWRITER_H_ */
