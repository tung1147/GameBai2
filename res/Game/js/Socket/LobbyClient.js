/**
 * Created by Quyet Nguyen on 6/23/2016.
 *
 *
 *
 */
var LobbyClient = (function() {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.allListener = {};
                this.lobbySocket = new socket.LobbyClient(socket.LobbyClient.UDT);
                var thiz = this;
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);
                };

                this.host = "10.0.1.106";
                this.port = 9999;
            }
        },
        send: function(message) {
            if(this.lobbySocket){
                this.lobbySocket.send(JSON.stringify(message));
            }
        },
        close: function() {
            this.isReconnected = false;
            if(this.lobbySocket){
                this.lobbySocket.close();
            }
        },
        connect : function () {
            if(this.lobbySocket){
                this.isKicked = false;
                this.lobbySocket.connect(this.host, this.port);
            }
        },
        onEvent : function (messageName, data) {
            if(messageName == "socketStatus"){
                this.postEvent("LobbyStatus", data);
            }
            else if(messageName == "message"){
                var messageData = JSON.parse(data);              
                this.postEvent(messageData.command, messageData);
            }
        },
        prePostEvent : function (command, event) {
                 
        },
        postEvent : function (command, event) {
            this.prePostEvent(command, event);
            var arr = this.allListener[command];
            if(arr){
                this.isBlocked = true;
                for(var i=0;i<arr.length;){
                    var target = arr[i];
                    if(target){
                        target.listener.apply(target.target, [command, event]);
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
        addListener : function (command, _listener, _target) {
            var arr = this.allListener[command];
            if(!arr){
                arr = [];
                this.allListener[command] = arr;
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
                    if(arr[i] && arr[i].target == target){
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
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    }

    return Clazz;
})();