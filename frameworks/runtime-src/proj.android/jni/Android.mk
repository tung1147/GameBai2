LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

$(call import-add-path,$(LOCAL_PATH)/../../libs)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

FILE_LIST := $(wildcard $(LOCAL_PATH)/hellojavascript/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/Action/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/NewGUI/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/Socket/*.cpp)

LOCAL_SRC_FILES := $(FILE_LIST:$(LOCAL_PATH)/%=%)

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes

LOCAL_STATIC_LIBRARIES := cocos2d_js_static smartfoxclient_static lobbyclient_static

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)


$(call import-module, scripting/js-bindings/proj.android)
$(call import-module,SmartfoxClient/proj.android)
$(call import-module,LobbyClient/proj.android)