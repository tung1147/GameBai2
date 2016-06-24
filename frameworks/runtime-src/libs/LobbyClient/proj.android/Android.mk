LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_CPPFLAGS += -fexceptions
$(call import-add-path,$(LOCAL_PATH)/../libs)
LOCAL_MODULE := lobbyclient_static
LOCAL_MODULE_FILENAME := liblobbyclient

FILE_LIST := $(wildcard $(LOCAL_PATH)/../src/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../src/Logger/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../src/Objects/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../src/Socket/*.cpp)

LOCAL_SRC_FILES := $(FILE_LIST:$(LOCAL_PATH)/%=%)

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../src
LOCAL_C_INCLUDES := $(LOCAL_PATH)/../src \

LOCAL_STATIC_LIBRARIES := udt_static
                   
include $(BUILD_STATIC_LIBRARY)

$(call import-module,.)
$(call import-module,udt4)