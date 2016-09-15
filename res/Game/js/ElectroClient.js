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

        },

        onMessage : function (message) {

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