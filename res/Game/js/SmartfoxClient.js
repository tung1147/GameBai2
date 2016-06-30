/**
 * Created by Quyet Nguyen on 6/23/2016.
 */

var SmartfoxClient = (function() {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,

        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.lobbySocket = new socket.SmartfoxClient();
                var thiz = this;
                this.lobbySocket.onEvent = function (eventName) {
                    thiz.onEvent(eventName);
                    var messageData = JSON.parse(data);
                    var event = new cc.EventCustom("sfsStatus");
                    event.setUserData({
                        data : eventName
                    });
                };
                this.lobbySocket.onMessage = function (messageType, data) {
                    thiz.onMessage(messageType, data);
                    var messageData = JSON.parse(data);
                    var event = new cc.EventCustom("sfsMessage");
                    event.setUserData({
                        messageType : messageType,
                        data : data
                    });
                    cc.eventManager.dispatchEvent(event);
                }
            }
        },

        sendHandShake : function () {
            var content = {
                api : "C++ API",
                cl : "1.6.3",
                bin : true,
               // rt : "reconnectionToken"
            };
            this.send(socket.SmartfoxClient.Handshake, content);
        },

        sendLogin : function(zoneName, username, password, params){
            var content = {
                zn : zoneName,
                un : username,
                pw : password,
              //  p : params
            };
            this.send(socket.SmartfoxClient.Login, content);
        },

        sendLogout : function () {
            this.send(socket.SmartfoxClient.Logout, null);
        },

        sendJoinRoom : function (room) {
            var content = {};
            if(room.isString()){
                if(room != ""){
                    content.n = room; //roomName
                }
            }
            else if(room.isNumber()){
                if(room > -1){
                    content.i = room; //roomId
                }
            }

            content.p = ""; //roomPass
            content.rl = 0; //roomIdToLeave
            content.sp = false; //asSpectator
            this.send(socket.SmartfoxClient.JoinRoom, content);
        },

        sendLeaveRoom : function (roomId) {
            var content = {
                r : roomId
            };
            this.send(socket.SmartfoxClient.LeaveRoom, content);
        },

        sendExtensionRequest : function (roomId, command, params) {
            var content = {
                r : roomId,
                c : command,
            }
            if(params){
                content.p = params;
            }
            this.send(socket.SmartfoxClient.CallExtension, content);
        },

        send: function(messageType, message) {
            if(this.lobbySocket){
                if(message){
                    this.lobbySocket.send(messageType, JSON.stringify(message));
                }
                else{
                    this.lobbySocket.send(messageType, "");
                }
            }
        },

        close: function() {
            if(this.lobbySocket){
                this.lobbySocket.close();
            }
        },

        connect : function (host, port) {
            if(this.lobbySocket){
                this.lobbySocket.connect(host, port);
            }
        },

        onEvent : function (eventName) {
            if(eventName == "Connected"){
                //send handshake
                this.sendHandShake();
            }
            cc.log("onEvent: "+eventName);
        },

        onMessage : function (messageType, data) {
            var content = JSON.parse(data);
            cc.log("onMessage");
            cc.log("messageType: "+messageType);
            cc.log("data:" + data);
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