/**
 * Created by Quyet Nguyen on 6/24/2016.
 */

var SystemPlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.plugin = new quyetnd.SystemPlugin();
                this.plugin.setTarget(this);
            }
        },

        getPackageName :function () {
            return this.plugin.getPackageName();
        },

        getVersionName : function () {
            return this.plugin.getVersionName();
        },

        getDeviceUUID : function () {
            return this.plugin.getDeviceUUID();
        },

        getDeviceUUIDWithKey : function (key) {
            return this.plugin.getDeviceUUIDWithKey(key);
        },

        buyIAPItem : function (itemBundle) {
            this.plugin.buyIAPItem(itemBundle);
        },

        iOSInitStore : function (itemList) {
            this.plugin.iOSInitStore(itemList);
        },
        
        //event
        onBuyItemFinishAndroid : function (returnCode, signature, json) {
            cc.log(returnCode + " - " + signature + " - " + json);
        },

        onBuyItemFinishIOS : function (returnCode, signature) {
            cc.log(returnCode + " - " + signature);
        },

        onRegisterNotificationSuccess : function (deviceId, token) {
            cc.log("onRegisterNotificationSuccess: "+deviceId + " - " + token);
        }
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    }
    return Clazz;
})();