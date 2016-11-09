/**
 * Created by QuyetNguyen on 11/9/2016.
 */

var socket = socket || {};

/* lobby */
socket.LobbySocket = socket.LobbySocket || {};
socket.LobbySocket.NotConnection = 0;
socket.LobbySocket.Connecting = 1;
socket.LobbySocket.Connected = 2;
socket.LobbySocket.ConnectFailure = 3;
socket.LobbySocket.LostConnection = 4;
socket.LobbySocket.Closed = 5;

socket.LobbySocket.StatusName = socket.LobbySocket.StatusName || {};
socket.LobbySocket.StatusName[socket.LobbySocket.NotConnection] = "NotConnected";
socket.LobbySocket.StatusName[socket.LobbySocket.Connecting] = "Connecting";
socket.LobbySocket.StatusName[socket.LobbySocket.Connected] = "Connected";
socket.LobbySocket.StatusName[socket.LobbySocket.ConnectFailure] = "ConnectFailure";
socket.LobbySocket.StatusName[socket.LobbySocket.LostConnection] = "LostConnection";
socket.LobbySocket.StatusName[socket.LobbySocket.Closed] = "NotConnected";

socket.LobbyClient = cc.Class.extend({
    ctor : function () {
        this.wsocket = null;
        this.socketStatus = socket.LobbySocket.NotConnection;
    },
    connect : function (host, port) {
        if(this.wsocket){
            this.wsocket.close();
            this.wsocket = null;
        }
        this.setSocketStatus(socket.LobbySocket.Connecting);

      //  var url = "ws://" + host + ":" + port;
        var url = "ws://uat1.puppetserver.com:8887/websocket";
        var wsocket = new WebSocket(url);
        this.wsocket = wsocket;

        var thiz = this;

        this.wsocket.onopen = function (event) {
            cc.log("onOpen: "+event.type);
            if(thiz.socketStatus == socket.LobbySocket.Connecting){
                thiz.setSocketStatus(socket.LobbySocket.Connected);
            }
        };
        this.wsocket.onmessage = function (event) {
            cc.log("onmessage: "+event.type);
        };
        this.wsocket.onerror = function (event) {
            //cc.log("onerror: "+event.type+" -- "+wsocket.readyState);

            if(thiz.socketStatus == socket.LobbySocket.Connecting){
                thiz.setSocketStatus(socket.LobbySocket.ConnectFailure);
            }
            else{
                thiz.setSocketStatus(socket.LobbySocket.LostConnection);
            }
        };
        this.wsocket.onclose = function (event) {
            thiz.wsocket = null;
           // cc.log("onclose: "+event.type);
            if(thiz.socketStatus == socket.LobbySocket.Connected){
                thiz.setSocketStatus(socket.LobbySocket.Closed);
            }
        };
    },
    close : function () {
        if(this.wsocket){
            this.wsocket.close();
            this.wsocket = null;
        }
    },
    setSocketStatus : function (status) {
        this.socketStatus = status;
        if(this.onEvent){
            cc.log("lobbyStatus: "+socket.LobbySocket.StatusName[this.socketStatus]);
            this.onEvent("socketStatus", socket.LobbySocket.StatusName[this.socketStatus]);
        }
    },
    onRecvMessage : function () {
        if(this.onEvent){
           // this.onEvent(eventName, data);
        }
    },
});

/* lobby */
socket.LobbyClient.NotConnection = 0;
socket.LobbyClient.Connecting = 1;
socket.LobbyClient.Connected = 2;
socket.LobbyClient.ConnectFailure = 3;
socket.LobbyClient.LostConnection = 4;
socket.LobbyClient.Closed = 5;

socket.LobbyClient.UDT = 0;
socket.LobbyClient.TCP = 1;