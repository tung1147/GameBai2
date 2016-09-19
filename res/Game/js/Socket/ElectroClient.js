/**
 * Created by Quyet Nguyen on 9/15/2016.
 */

var ElectroClient = (function() {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.allListener = [];
                this.lobbySocket = new socket.ElectroClient();
                var thiz = this;
                this.lobbySocket.onEvent = function (eventName) {
                    cc.log("onEvent: "+eventName);
                    thiz.onEvent(eventName);
                };
                this.lobbySocket.onMessage = function (data) {
                    cc.log("onMessage: "+data);
                    thiz.onMessage(JSON.parse(data));
                }
            }
        },

        send: function(message) {
            if(this.lobbySocket){
                this.lobbySocket.send(JSON.stringify(message));
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
            this.postEvent("EsEvent", eventName);
        },
        onMessage : function (message) {
            this.postEvent("message", message);
        },
		postEvent : function (messageType, params) {
           // this.prePostEvent(messageType, params);
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
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    }

    return Clazz;
})();