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
socket.LobbySocket.StatusName[socket.LobbySocket.Closed] = "Closed";

socket.LobbyClient = cc.Class.extend({
    ctor : function () {
        this.wsocket = null;
        this.socketStatus = socket.LobbySocket.NotConnection;
    },
    connect : function (host, port) {
        if(this.wsocket){
            this.close();
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

                //test
                var message = {
                    command: "login",
                    platformId: 4,
                    bundleId: "bundleId",
                    version: "1.0.1",
                    imei: "imei",
                    type: "normal",
                    username: "username",
                    password: "password"
                };
                thiz.send(JSON.stringify(message));
            }
        };
        this.wsocket.onmessage = function (event) {
            cc.log("onmessage: "+event.type);
            thiz.onRecvMessage(event.data);
        };
        this.wsocket.onerror = function (event) {
            cc.log("onerror: "+event.type+" -- "+wsocket.readyState);

            if(thiz.socketStatus == socket.LobbySocket.Connecting){
                thiz.setSocketStatus(socket.LobbySocket.ConnectFailure);
            }
            else{
                thiz.setSocketStatus(socket.LobbySocket.LostConnection);
            }
        };
        this.wsocket.onclose = function (event) {
            thiz.resetSocket();
            thiz.wsocket = 0;

            cc.log("onclose: "+event.type);
            if(thiz.socketStatus == socket.LobbySocket.Connected){
                thiz.setSocketStatus(socket.LobbySocket.LostConnection);
            }
        };
    },
    close : function () {
        if(this.wsocket){
            if(this.socketStatus == socket.LobbySocket.Connected){
                this.setSocketStatus(socket.LobbySocket.Closed);
            }

            this.resetSocket();
            this.wsocket.close();
            this.wsocket = 0;
        }
    },
    resetSocket : function () {
        if(this.wsocket){
            this.wsocket.onopen = 0;
            this.wsocket.onmessage = 0;
            this.wsocket.onerror = 0;
            this.wsocket.onclose = 0;
        }
    },
    setSocketStatus : function (status) {
        this.socketStatus = status;
        if(this.onEvent){
            cc.log("lobbyStatus: "+socket.LobbySocket.StatusName[this.socketStatus]);
            this.onEvent("socketStatus", socket.LobbySocket.StatusName[this.socketStatus]);
        }
    },
    onRecvMessage : function (data) {
        if(this.onEvent){
            cc.log("onRecvMessage: "+data);
            this.onEvent("message", data);
        }
    },
    send : function (data) {
        if(this.wsocket){
            this.wsocket.send(data);
        }
    }
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