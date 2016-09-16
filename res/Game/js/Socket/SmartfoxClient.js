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
                this.allListener = {};
                this.sfsSocket = new socket.SmartfoxClient();
                var thiz = this;
                this.sfsSocket.onEvent = function (eventName) {
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
                   // info : PlayerMe.SFS.info,
                   // signature : PlayerMe.SFS.signature
                }
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
        findAndJoinRoom : function (host, port) {
            if(this.sfsSocket.getStatus() == socket.SmartfoxClient.Connected){
                if(this.currentHost == host && this.currentPort == port){
                    this.sendFindAndJoinRoom();
                }
                else{
                    this.sfsSocket.close();
                    this.connect(host, port);
                }
            }
            else{
                this.connect(host, port);
            }
        },
        connect : function (host, port) {
            if(this.sfsSocket){
                this.currentHost = host;
                this.currentPort = port;
                this.sfsSocket.connect(host, port);
            }
        },

        onEvent : function (eventName) {
            if(eventName == "Connected"){
                //send handshake
                this.sendHandShake();
            }           
            this.postEvent(socket.SmartfoxClient.SocketStatus, eventName);
        },

        onMessage : function (messageType, data) {
            var content = JSON.parse(data);
            this.postEvent(messageType, content);
        },
        addListener : function (messageType, _listener, _target) {
            var arr = this.allListener[messageType];
            if(!arr){
                arr = [];
                this.allListener[messageType] = arr;
            }
            for(var i=0;i<arr.length;i++){
                if(arr[i].target == _target){
                    return;
                }
            }
            arr.push({
                listener : _listener,
                target : _target
            });
        },
        removeListener : function (target) {
            for (var key in this.allListener) {
                if(!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for(var i=0;i<arr.length;){
                    if(arr[i].target == target){
                        if(this.isBlocked){
                            arr[i] = null;
                        }
                        else{
                            arr.splice(i,1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        },
        postEvent : function (messageType, params) {
            this.prePostEvent(messageType, params);
            var arr = this.allListener[messageType];
            if(arr){
                this.isBlocked = true;
                for(var i=0;i<arr.length;){
                    var target = arr[i];
                    if(target){
                        target.listener.apply(target.target, [messageType, params]);
                    }
                    else{
                        arr.splice(i,1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }
        },
        prePostEvent : function (messageType, contents){

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