/**
 * Created by Quyet Nguyen on 6/23/2016.
 */
var LobbyClient = (function() {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,

        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.lobbySocket = new socket.LobbyClient(socket.LobbyClient.TCP);
                var thiz = this;
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);

                    if(messageName == "socketStatus"){
                        var messageData = JSON.parse(data);
                        var event = new cc.EventCustom("lobbyStatus");
                        event.setUserData({
                            messageName : messageName,
                            data : data
                        });
                        cc.eventManager.dispatchEvent(event);
                    }
                    else if(messageName == "message"){
                        var messageData = JSON.parse(data);
                        var event = new cc.EventCustom("lobbyMessage");
                        event.setUserData({
                            messageName : messageName,
                            data : messageData
                        });
                        cc.eventManager.dispatchEvent(event);
                    }
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
                        username : "quyetnguyen",
                        password : "quyetnguyen123"
                    };

                    this.send(loginRequest);
                }
            }
            else if(messageName == "message"){

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