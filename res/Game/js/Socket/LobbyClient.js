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
                this.host = "10.0.1.106";
                this.port = 9999;
                this.lobbySocket = new socket.LobbyClient(socket.LobbyClient.TCP);
                this.addListener("login", this.onLogin, this);

                var thiz = this;
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);

                    // if(messageName == "socketStatus"){
                    //     var messageData = JSON.parse(data);
                    //     var event = new cc.EventCustom("lobbyStatus");
                    //     event.setUserData({
                    //         messageName : messageName,
                    //         data : data
                    //     });
                    //     cc.eventManager.dispatchEvent(event);
                    // }
                    // else if(messageName == "message"){
                    //     var messageData = JSON.parse(data);
                    //     var event = new cc.EventCustom("lobbyMessage");
                    //     event.setUserData({
                    //         messageName : messageName,
                    //         data : messageData
                    //     });
                    //     cc.eventManager.dispatchEvent(event);
                    // }
                };
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
        onEvent : function (messageName, data) {
            if(messageName == "socketStatus"){
                if(data == "Connected"){
                    //send login
                    var loginRequest = {
                        command : "login",
                        platformId : 1,
                        bundleId : "test.game.baivip",
                        version : "1.0.0",
                        imei : "imei",
                        type : "normal",
                        username : this.username,
                        password : this.password
                    };
                    this.send(loginRequest);
                }
                this.postEvent("LobbyStatus", data);
            }
            else if(messageName == "message"){
                var messageData = JSON.parse(data);
                if(messageData.command == "error"){
                    this.onError(messageData)
                }

                this.postEvent(messageData.command, messageData);
            }
        },
        onError : function (data) {
            MessageNode.getInstance().show("Có lỗi xảy ra");
            var error = LobbyClient.Error[data.errorCode];
            if(error){
                MessageNode.getInstance().show(error);
            }
            else{
                MessageNode.getInstance().show("Có lỗi xảy ra [" + data.errorCode + "]");
            }

            LoadingDialog.getInstance().hide();
        },
        onLogin : function (command, data) {
            cc.log("onLogin:");
        },
        postEvent : function (command, event) {
            var arr = this.allListener[command];
            if(arr){
                this.isBlocked = true;
                for(var i=0;i<arr.length;){
                    var target = arr[i];
                    if(target.alive){
                        target.listener.apply(target.target, [command, event]);
                    }
                    else{
                        arr.slice(i,1);
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
            arr.push({
                listener : _listener,
                target : _target,
                alive : true
            });
        },
        removeListener : function (target) {
            for (var arr in this.allListener) {
                if(!this.allListener.hasOwnProperty(arr)) continue;
                for(var i=0;i<arr.length;){
                    if(arr[i].target == target){
                        if(this.isBlocked){
                            arr[i].alive = false;
                        }
                        else{
                            arr.slice(i,1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        },
        login : function (username, password) {
            this.username = username;
            this.password = password;
            this.connect(this.host, this.port);
        },
        signup : function (username, password) {
            
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