LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_CPPFLAGS += -fexceptions

LOCAL_MODULE := smartfoxclient_static
LOCAL_MODULE_FILENAME := libsmartfoxclient

FILE_LIST := $(wildcard $(LOCAL_PATH)/../src/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../src/Core/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../src/Entities/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../src/Event/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../src/Logger/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../src/Request/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../src/Socket/*.cpp)

LOCAL_SRC_FILES := $(FILE_LIST:$(LOCAL_PATH)/%=%)

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../src

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../src \
                   
include $(BUILD_STATIC_LIBRARY)