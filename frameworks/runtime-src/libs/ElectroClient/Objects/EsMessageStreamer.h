/*
 * EsMessageStreamer.h
 *
 *  Created on: Jan 22, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ESMESSAGESTREAMER_H_
#define ELECTROCLIENT_OBJECTS_ESMESSAGESTREAMER_H_

#include <string>
#include <vector>
#include <cstdint>

namespace es {
	enum EsObjectIndicatorType{
		EsObjectType_Integer = '0',
		EsObjectType_String = '1',
		EsObjectType_Double = '2',
		EsObjectType_Float = '3',
		EsObjectType_Bool = '4',
		EsObjectType_Byte = '5',
		EsObjectType_Charactor = '6',
		EsObjectType_Long = '7',
		EsObjectType_Short = '8',
		EsObjectType_EsObject = '9',
		EsObjectType_EsObjectArray = 'a',
		EsObjectType_IntegerArray = 'b',
		EsObjectType_StringArray = 'c',
		EsObjectType_DoubleArray = 'd',
		EsObjectType_FloatArray = 'e',
		EsObjectType_BoolArray = 'f',
		EsObjectType_ByteArray = 'g',
		EsObjectType_CharactorArray = 'h',
		EsObjectType_LongArray = 'i',
		EsObjectType_ShortArray = 'j',
		EsObjectType_Number = 'k',
		EsObjectType_NumberArray = 'l',
	};


/*read*/
class EsMessageReader{
	char* dataBuffer;
    
	int length;
    bool isOwner;

	int index;

	void read(void* buffer, int len);
public:
	EsMessageReader();
	EsMessageReader(char* data, int length, bool isOwner = false);
	virtual  ~EsMessageReader();

	bool nextBool();
	int8_t nextByte();
	int16_t nextShort();
	int32_t nextInt();
	int64_t nextLong();
	float nextFloat();
	double nextDouble();
	std::string nextString();

	std::vector<bool> nextBoolArray();
	std::vector<char> nextByteArray();
	std::vector<int16_t> nextShortArray();
	std::vector<int32_t> nextIntArray();
	std::vector<int64_t> nextLongArray();
	std::vector<float> nextFloatArray();
	std::vector<double> nextDoubleArray();
	std::vector<std::string> nextStringArray();

	int nextLength();
};

/*write*/

class EsMessageWriter{
	std::vector<int8_t> bytesBuffer;

	void write(const char* bytes, int length);
public:
	EsMessageWriter();
	virtual ~EsMessageWriter();
	const std::vector<int8_t>& getBuffer();

	void writeBool(bool b);
	void writeByte(int8_t i);
	void writeShort(int16_t i);
	void writeInt(int32_t i);
	void writeLong(int64_t i);
	void writeFloat(float f);
	void writeDouble(double d);
	void writeString(const std::string &str);

	void writetBoolArray(const std::vector<bool> &arr);
	void writeByteArray(const std::vector<int8_t> &arr);
	void writeShortArray(const std::vector<int16_t> &arr);
	void writeIntArray(const std::vector<int32_t> &arr);
	void writeLongArray(const std::vector<int64_t> &arr);
	void writeFloatArray(const std::vector<float> &arr);
	void writeDoubleArray(const std::vector<double> &arr);
	void writeStringArray(const std::vector<std::string> &arr);

	void writeLength(int length);
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ESMESSAGESTREAMER_H_ */
