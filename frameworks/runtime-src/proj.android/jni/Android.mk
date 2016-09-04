LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

$(call import-add-path,$(LOCAL_PATH)/../../../cocos2d-x)
$(call import-add-path,$(LOCAL_PATH)/../../../cocos2d-x/external)
$(call import-add-path,$(LOCAL_PATH)/../../../cocos2d-x/cocos)
$(call import-add-path,$(LOCAL_PATH)/../../libs)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs
ifeq ($(USE_ARM_MODE),1)
LOCAL_ARM_MODE := arm
endif

FILE_LIST := $(wildcard $(LOCAL_PATH)/hellojavascript/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/Action/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/NewGUI/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/Socket/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/Plugin/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/GameLaucher/*.cpp)

LOCAL_SRC_FILES := $(FILE_LIST:$(LOCAL_PATH)/%=%)

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes
					

LOCAL_STATIC_LIBRARIES := cocos2d_js_static smartfoxclient_static lobbyclient_static cocos_curl_static

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)

#$(call import-module,.)
$(call import-module,scripting/js-bindings/proj.android)
$(call import-module,SmartfoxClient/proj.android)
$(call import-module,LobbyClient/proj.android)
$(call import-module,curl/prebuilt/android)
