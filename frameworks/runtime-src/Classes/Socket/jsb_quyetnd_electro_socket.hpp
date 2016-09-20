#include "base/ccConfig.h"
#ifndef __quyetnd_electro_socket_h__
#define __quyetnd_electro_socket_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_quyetnd_ElectroClient_class;
extern JSObject *jsb_quyetnd_ElectroClient_prototype;
void register_all_quyetnd_electro_socket(JSContext* cx, JS::HandleObject obj);


#endif // __quyetnd_electro_socket_h__
