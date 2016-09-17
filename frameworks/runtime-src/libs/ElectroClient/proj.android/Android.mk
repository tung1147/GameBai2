LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_CPPFLAGS += -fexceptions

LOCAL_MODULE := electroclient_static
LOCAL_MODULE_FILENAME := libelectroclient

FILE_LIST := $(wildcard $(LOCAL_PATH)/../*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../Socket/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../Objects/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../Objects/Entity/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../Objects/Event/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../Objects/Request/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../Objects/thrift/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../Objects/thrift/libs/*.cpp)

LOCAL_SRC_FILES := $(FILE_LIST:$(LOCAL_PATH)/%=%)

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/..

LOCAL_C_INCLUDES := $(LOCAL_PATH)/.. \
                   
include $(BUILD_STATIC_LIBRARY)