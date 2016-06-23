/**
 * Created by Quyet Nguyen on 6/23/2016.
 */

socket.LobbyClient.UDT = 0;
socket.LobbyClient.TCP = 1;

socket.LobbyClient.prototype._ctor = function (socketType) {
    this.initClientWithType(socketType);
};

var LobbyClient = (function() {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,

        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.lobbySocket = new socket.LobbyClient(socket.LobbyClient.UDT);
                var thiz = this;
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);
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
                cc.log("connect");
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
                var messageData = JSON.parse(data);
            }
            cc.log("data: "+data);
            cc.log("message: "+messageName);
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