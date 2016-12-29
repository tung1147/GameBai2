/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var SystemPlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                //init
            }
        },

        getPackageName :function () {
            return "gamebai.com"
        },

        getVersionName : function () {
            return "1.0.0";
        },

        getDeviceUUID : function () {
            return "web_test";
        },

        getDeviceUUIDWithKey : function (key) {
            return "web_test";
        },

        buyIAPItem : function (itemBundle) {

        },

        iOSInitStore : function (itemList) {

        },

        //event
        // onBuyItemFinishAndroid : function (returnCode, signature, json) {
        //
        // },
        //
        // onBuyItemFinishIOS : function (returnCode, signature) {
        //
        // },
        //
        // onRegisterNotificationSuccess : function (deviceId, token) {
        //
        // },
        exitApp : function () {

        },
        enableMipmapTexture : function (texture) {

        },
        showCallPhone : function (phoneNumber) {

        },
        androidRequestPermission : function (permissions, requestCode) {

        },
        androidCheckPermission : function (permission) {

        },
        startLaucher : function () {

        },
        checkFileValidate : function (file) {

        },
        showSMS : function (smsNumber, smsContent) {

        },
        getCarrierName : function () {

        },
        getPushNotificationToken : function () {

        },
        downloadFile : function (url, savePath, callback) {

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