/*
 * EsMessageStreamer.cpp
 *
 *  Created on: Jan 22, 2016
 *      Author: QuyetNguyen
 */

#include "EsMessageStreamer.h"
#include "../ElectroLogger.h"

inline void _reverse_bytes(char* bytes, int len){
	char* temp = new char[len];
	memcpy(temp, bytes, len);
	for (int i = 0, j=len-1; i < len; i++, j--){
		bytes[i] = temp[j];
	}

	delete temp;
}

namespace es {

EsMessageReader::EsMessageReader(){
	dataBuffer = 0;
    isOwner = false;
}

EsMessageReader::EsMessageReader(char* data, int length, bool isOwner){
	index = 0;
    this->isOwner = isOwner;
    
	if (data && length > 0){
        this->length = length;
        
        if(isOwner){
            dataBuffer = new char[length];
            memcpy(dataBuffer, data, length);
        }
        else{
            dataBuffer = data;
        }
			
	}
}

EsMessageReader::~EsMessageReader(){
	if (dataBuffer){
        if(isOwner){
            delete[] dataBuffer;
        }
		dataBuffer = 0;
	}
	length = 0;
}

void EsMessageReader::read(void* buffer, int len){
	if (!dataBuffer || length <= 0){
        es::log("es reader buffer null");
        return;
	}

	if ((index + len) <= length){
		memcpy(buffer, &dataBuffer[index], len);
		index += len;
		return;
	}

    es::log("es reader out-of-range");
}

bool EsMessageReader::nextBool(){
	return nextByte();
}

int8_t EsMessageReader::nextByte(){
	int8_t b;
	read(&b, 1);
	return b;
}

int16_t EsMessageReader::nextShort(){
	//char b[2];
	//read(b, 2);
	//return (short)(((short)(b[0] & 0xff) << 8) | ((short)(b[1] & 0xff) << 0));

	int8_t s;
	read(&s, 2);
	_reverse_bytes((char*)&s, 2);
	return s;
}

int32_t EsMessageReader::nextInt(){
	//char b[4];
	//read(b, 4);
	//return (int)(((int)(b[0] & 0xff) << 24) | ((int)(b[1] & 0xff) << 16) | ((int)(b[2] & 0xff) << 8) | ((int)(b[3] & 0xff) << 0));

	int32_t i;
	read(&i, 4);
	_reverse_bytes((char*)&i, 4);
	return i;
}

int64_t EsMessageReader::nextLong(){
	//char b[8];
	//read(b, 8);
	//return (long)(((long)(b[0] & 0xff) << 56) | ((long)(b[1] & 0xff) << 48) | ((long)(b[2] & 0xff) << 40) | ((long)(b[3] & 0xff) << 32) |
	//	((long)(b[4] & 0xff) << 24) | ((long)(b[5] & 0xff) << 16) | ((long)(b[6] & 0xff) << 8) | ((long)(b[7] & 0xff)));

	int64_t i;
	read(&i, 8);
	_reverse_bytes((char*)&i, 8);
	return i;
}
	
float EsMessageReader::nextFloat(){
	float f;
	read(&f, 4);
	_reverse_bytes((char*)&f, 4);
	return f;
}

double EsMessageReader::nextDouble(){
	double f;
	read(&f, 8);
	_reverse_bytes((char*)&f, 8);
	return f;
}

std::string EsMessageReader::nextString(){
	int length = nextLength();
	char* charBuffer = new char[length];
	read(charBuffer, length);

	std::string pret(charBuffer, charBuffer + length);
	delete charBuffer;

	return pret;
}

std::vector<bool> EsMessageReader::nextBoolArray(){
	std::vector<bool> arr;
	int n = nextLength();
	for (int i = 0; i < n; i++){
		arr.push_back(this->nextBool());
	}

	return arr;
}

std::vector<char> EsMessageReader::nextByteArray(){
	std::vector<char> arr;
	int n = nextLength();
	for (int i = 0; i < n; i++){
		arr.push_back(this->nextByte());
	}

	return arr;
}

std::vector<int16_t> EsMessageReader::nextShortArray(){
	std::vector<int16_t> arr;
	int n = nextLength();
	for (int i = 0; i < n; i++){
		arr.push_back(this->nextShort());
	}

	return arr;
}

std::vector<int32_t> EsMessageReader::nextIntArray(){
	std::vector<int32_t> arr;
	int n = nextLength();
	for (int i = 0; i < n; i++){
		arr.push_back(this->nextInt());
	}

	return arr;
}

std::vector<int64_t> EsMessageReader::nextLongArray(){
	std::vector<int64_t> arr;
	int n = nextLength();
	for (int i = 0; i < n; i++){
		arr.push_back(this->nextLong());
	}

	return arr;
}

std::vector<float> EsMessageReader::nextFloatArray(){
	std::vector<float> arr;
	int n = nextLength();
	for (int i = 0; i < n; i++){
		arr.push_back(this->nextFloat());
	}

	return arr;
}

std::vector<double> EsMessageReader::nextDoubleArray(){
	std::vector<double> arr;
	int n = nextLength();
	for (int i = 0; i < n; i++){
		arr.push_back(this->nextDouble());
	}

	return arr;
}

std::vector<std::string> EsMessageReader::nextStringArray(){
	std::vector<std::string> arr;
	int n = nextLength();
	for (int i = 0; i < n; i++){
		arr.push_back(this->nextString());
	}

	return arr;
}

int EsMessageReader::nextLength(){
	char firstByte = nextByte();
	int byteCount = (firstByte >> 6) & 0x03;
	int length = (firstByte & 0x3f);
	for (int i = 0; i < byteCount; i++) {
		length <<= 8;
		length |= (nextByte() & 0xff);
	}
	return length;
}

/****/

EsMessageWriter::EsMessageWriter(){

}

EsMessageWriter::~EsMessageWriter(){

}

const std::vector<int8_t>& EsMessageWriter::getBuffer(){
	return bytesBuffer;
}

void EsMessageWriter::write(const char* bytes, int length){
	bytesBuffer.insert(bytesBuffer.end(), bytes, bytes + length);
}

void EsMessageWriter::writeBool(bool b){
    char byte = 0x00;
    if(b){
        byte = 0x01;
    }
    
    write(&byte, 1);
}

void EsMessageWriter::writeByte(int8_t i){
	write((char*)&i, 1);
}

void EsMessageWriter::writeShort(int16_t i){
	_reverse_bytes((char*)&i, 2);
	write((char*)&i, 2);
}

void EsMessageWriter::writeInt(int32_t i){
	_reverse_bytes((char*)&i, 4);
	write((char*)&i, 4);
}

void EsMessageWriter::writeLong(int64_t i){
	_reverse_bytes((char*)&i, 8);
	write((char*)&i, 8);
}

void EsMessageWriter::writeFloat(float f){
	_reverse_bytes((char*)&f, 4);
	write((char*)&f, 4);
}

void EsMessageWriter::writeDouble(double d){
	_reverse_bytes((char*)&d, 8);
	write((char*)&d, 8);
}

void EsMessageWriter::writeString(const std::string &str){
	int length = str.size();
	writeLength(length);
	write(str.data(), length);
}

void EsMessageWriter::writetBoolArray(const std::vector<bool> &arr){
	int length = arr.size();
	writeLength(length);
	for (int i = 0; i < length; i++){
		writeBool(arr[i]);
	}
}

void EsMessageWriter::writeByteArray(const std::vector<int8_t> &arr){
	int length = arr.size();
	writeLength(length);
	for (int i = 0; i < length; i++){
		writeByte(arr[i]);
	}
}

void EsMessageWriter::writeShortArray(const std::vector<int16_t> &arr){
	int length = arr.size();
	writeLength(length);
	for (int i = 0; i < length; i++){
		writeShort(arr[i]);
	}
}

void EsMessageWriter::writeIntArray(const std::vector<int32_t> &arr){
	int length = arr.size();
	writeLength(length);
	for (int i = 0; i < length; i++){
		writeInt(arr[i]);
	}
}

void EsMessageWriter::writeLongArray(const std::vector<int64_t> &arr){
	int length = arr.size();
	writeLength(length);
	for (int i = 0; i < length; i++){
		writeLong(arr[i]);
	}
}

void EsMessageWriter::writeFloatArray(const std::vector<float> &arr){
	int length = arr.size();
	writeLength(length);
	for (int i = 0; i < length; i++){
		writeFloat(arr[i]);
	}
}

void EsMessageWriter::writeDoubleArray(const std::vector<double> &arr){
	int length = arr.size();
	writeLength(length);
	for (int i = 0; i < length; i++){
		writeDouble(arr[i]);
	}
}

void EsMessageWriter::writeStringArray(const std::vector<std::string> &arr){
	int length = arr.size();
	writeLength(length);
	for (int i = 0; i < length; i++){
		writeString(arr[i]);
	}
}

void EsMessageWriter::writeLength(int length){
	if ((length & 0x40000000) != 0) {
		//too large
		return;
	}
	int byteCount = 1;
	if (length > 0x3fffff) {
		byteCount = 4;
	}
	else if (length > 0x3fff) {
		byteCount = 3;
	}
	else if (length > 0x3f) {
		byteCount = 2;
	}
	int8_t b = (int8_t)((byteCount - 1) << 6);
	for (int i = byteCount - 1; i >= 0; i--) {
		b |= ((length >> (i * 8)) & 0xff);
		this->writeByte(b);
		b = 0;
	}
}

} /* namespace es */
