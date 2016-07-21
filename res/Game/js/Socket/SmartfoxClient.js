/**
 * Created by Quyet Nguyen on 6/23/2016.
 */

var SmartfoxClient = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        sfsSocket: null,

        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.sfsSocket = new socket.SmartfoxClient();
                var thiz = this;
                this.sfsSocket.onEvent = function (eventName) {
                    cc.log("sfs: "+eventName);
                    thiz.onEvent(eventName);
                };
                this.sfsSocket.onMessage = function (messageType, data) {
                    thiz.onMessage(messageType, data);
                }
            }
        },

        sendHandShake : function () {
            var content = {
                cl : "C++ API",
                api : "1.6.3",
                bin : true,
               // rt : "reconnectionToken"
            };
            this.send(socket.SmartfoxClient.Handshake, content);
        },
        sendLogin : function(){
            var content = {
                zn : "GBVCity",
                un : "",
                pw : "",
                p : {
                    info : PlayerMe.SFS.info,
                    signature : PlayerMe.SFS.signature
                }
            };
            this.send(socket.SmartfoxClient.Login, content);
        },
        sendFindAndJoinRoom : function () {
            var params = {
                gameType : PlayerMe.SFS.gameType,
                betting : PlayerMe.SFS.betting
            };
            this.sendExtensionRequest(-1, "findAndJoinGame",params);
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
            if(this.sfsSocket){
                if(message){
                    this.sfsSocket.send(messageType, JSON.stringify(message));
                }
                else{
                    this.sfsSocket.send(messageType, "");
                }
            }
        },

        close: function() {
            if(this.sfsSocket){
                this.sfsSocket.close();
            }
        },

        connect : function (host, port) {
            if(this.sfsSocket){
                this.sfsSocket.connect(host, port);
            }
        },

        onEvent : function (eventName) {
            if(eventName == "Connected"){
                //send handshake
                this.sendHandShake();
            }
            else if(eventName === "ConnectFailure"){

            }
            else if(eventName === "LostConnection"){

            }
            cc.log("[SFS]onEvent: "+eventName);
        },

        onMessage : function (messageType, data) {
            var content = JSON.parse(data);
            if(messageType === socket.SmartfoxClient.Handshake){
                if(content.tk && content.tk.length > 0){
                    this.sendLogin();
                }
            }
            else if(messageType === socket.SmartfoxClient.Login){
                if(content.ec){ //login error

                }
                else{
                    this.sfsUserId = content.id;
                    this.sendFindAndJoinRoom();
                }
            }
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