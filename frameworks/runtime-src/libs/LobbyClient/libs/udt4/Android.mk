LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_CPPFLAGS += -DLINUX
LOCAL_MODULE := udt_static
LOCAL_MODULE_FILENAME := libudt

LOCAL_SRC_FILES := udt/api.cpp \
udt/buffer.cpp \
udt/cache.cpp \
udt/ccc.cpp \
udt/channel.cpp \
udt/common.cpp \
udt/core.cpp \
udt/epoll.cpp \
udt/list.cpp \
udt/md5.cpp \
udt/packet.cpp \
udt/queue.cpp \
udt/window.cpp \

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/udt \

LOCAL_C_INCLUDES := $(LOCAL_PATH)/udt \
                    
LOCAL_STATIC_LIBRARIES := cocos2dx_internal_static

include $(BUILD_STATIC_LIBRARY)