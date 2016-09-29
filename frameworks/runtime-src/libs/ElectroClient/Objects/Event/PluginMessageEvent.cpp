/*
 * PluginMessageEvent.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "PluginMessageEvent.h"

#include "../thrift/ThriftPluginMessageEvent_types.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../../ElectroLogger.h"

namespace es {

PluginMessageEvent::PluginMessageEvent() {
	// TODO Auto-generated constructor stub
	parameters = 0;
	messageType = es::type::MessageType::PluginMessageEvent;
}

PluginMessageEvent::~PluginMessageEvent() {
	// TODO Auto-generated destructor stub
	if (parameters){
		delete parameters;
		parameters = 0;
	}
}

bool PluginMessageEvent::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftPluginMessageEvent thriftObj;
	thriftObj.read(&protocol);

	this->pluginName = thriftObj.pluginName;
	this->sentToRoom = thriftObj.sentToRoom;
	this->destinationZoneId = thriftObj.destinationZoneId;
	this->destinationRoomId = thriftObj.destinationRoomId;
	this->roomLevelPlugin = thriftObj.roomLevelPlugin;
	this->originZoneId = thriftObj.originZoneId;
	this->originRoomId = thriftObj.originRoomId;


	if (thriftObj.__isset.parameters){
		parameters = new EsObject();
		parameters->initFromFlattenedEsObject(&thriftObj.parameters);
	}

	//
	//to json
	rapidjson::Document doc;
	doc.SetObject();
	doc.AddMember("messageType", messageType, doc.GetAllocator());
	doc.AddMember("pluginName", pluginName, doc.GetAllocator());
	doc.AddMember("sentToRoom", sentToRoom, doc.GetAllocator());
	doc.AddMember("destinationZoneId", destinationZoneId, doc.GetAllocator());
	doc.AddMember("destinationRoomId", destinationRoomId, doc.GetAllocator());
	doc.AddMember("roomLevelPlugin", roomLevelPlugin, doc.GetAllocator());
	doc.AddMember("originZoneId", originZoneId, doc.GetAllocator());
	doc.AddMember("originRoomId", originRoomId, doc.GetAllocator());
	if (parameters){
		rapidjson::Value esObj;
		parameters->toJson(esObj, doc.GetAllocator());
		doc.AddMember("parameters", esObj, doc.GetAllocator());
	}

	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	doc.Accept(writer);
	jsonData = buffer.GetString();

	return true;
}

void PluginMessageEvent::getBytes(std::vector<char> &buffer){

}

void PluginMessageEvent::printDebug(){
#ifdef ES_LOGGER
	es::log("pluginName:%s", pluginName.c_str());
	es::log("sentToRoom:%d", sentToRoom);
	es::log("destinationZoneId:%d", destinationZoneId);
	es::log("destinationRoomId:%d", destinationRoomId);
	es::log("roomLevelPlugin:%d", roomLevelPlugin);
	es::log("originZoneId:%d", originZoneId);
	es::log("originRoomId:%d", originRoomId);
	if (parameters){
		parameters->printDebug();
	}
#endif
}

} /* namespace es */
