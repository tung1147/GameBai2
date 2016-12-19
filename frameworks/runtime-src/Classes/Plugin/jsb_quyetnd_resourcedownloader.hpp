#include "base/ccConfig.h"
#ifndef __quyetnd_resourcesloader_h__
#define __quyetnd_resourcesloader_h__

#include "jsapi.h"
#include "jsfriendapi.h"
#include <string>

void register_all_quyetnd_resourcesloader(JSContext* cx, JS::HandleObject obj);

#endif // __quyetnd_resourcesloader_h__
