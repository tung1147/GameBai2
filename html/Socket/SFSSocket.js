/**
 * Created by QuyetNguyen on 11/9/2016.
 */

var socket = socket || {};

socket.SFSSocket = socket.SFSSocket || {};
socket.SFSSocket.NotConnection = 0;
socket.SFSSocket.Connecting = 1;
socket.SFSSocket.Connected = 2;
socket.SFSSocket.ConnectFailure = 3;
socket.SFSSocket.LostConnection = 4;
socket.SFSSocket.Closed = 5;

socket.SFSSocket.StatusName = socket.SFSSocket.StatusName || {};
socket.SFSSocket.StatusName[socket.SFSSocket.NotConnection] = "NotConnected";
socket.SFSSocket.StatusName[socket.SFSSocket.Connecting] = "Connecting";
socket.SFSSocket.StatusName[socket.SFSSocket.Connected] = "Connected";
socket.SFSSocket.StatusName[socket.SFSSocket.ConnectFailure] = "ConnectFailure";
socket.SFSSocket.StatusName[socket.SFSSocket.LostConnection] = "LostConnection";
socket.SFSSocket.StatusName[socket.SFSSocket.Closed] = "Closed";

socket.SmartfoxClient = cc.Class.extend({
    ctor : function () {
        this.wsocket = null;
        this.socketStatus = socket.SFSSocket.NotConnection;
    },
    connect : function (url) {
        if(this.wsocket){
            this.close();
        }

        this.setSocketStatus(socket.LobbySocket.Connecting);

      //  var url = "ws://uat1.puppetserver.com:8888/websocket";
        var wsocket = new WebSocket(url);
        this.wsocket = wsocket;

        var thiz = this;

        this.wsocket.onopen = function (event) {
          //  cc.log("onOpen: "+event.type);
            if(thiz.socketStatus == socket.SFSSocket.Connecting){
                thiz.setSocketStatus(socket.SFSSocket.Connected);
            }
        };
        this.wsocket.onmessage = function (event) {
           // cc.log("onmessage: "+event.type);
            thiz.onRecvMessage(event.data);
        };
        this.wsocket.onerror = function (event) {
          //  cc.log("onerror: "+event.type+" -- "+wsocket.readyState);

            if(thiz.socketStatus == socket.SFSSocket.Connecting){
                thiz.setSocketStatus(socket.SFSSocket.ConnectFailure);
            }
            else{
                thiz.setSocketStatus(socket.SFSSocket.LostConnection);
            }
        };
        this.wsocket.onclose = function (event) {
            thiz.resetSocket();
            thiz.wsocket = 0;

           // cc.log("onclose: "+event.type);
            if(thiz.socketStatus == socket.SFSSocket.Connected){
                thiz.setSocketStatus(socket.SFSSocket.LostConnection);
            }
        };
    },
    close : function () {
        if(this.wsocket){
            if(this.socketStatus == socket.SFSSocket.Connected){
                this.setSocketStatus(socket.SFSSocket.Closed);
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
            cc.log("sfs: status :"+socket.SFSSocket.StatusName[this.socketStatus]);
            this.onEvent(socket.SFSSocket.StatusName[this.socketStatus]);
        }
    },
    getStatus : function () {
        return this.socketStatus;
    },
    onRecvMessage : function (data) {
        if(this.onMessage){
            var content = JSON.parse(data);
            var param = JSON.stringify(content.p);

        //    cc.log("onRecvMessage: "+data);
            this.onMessage(content.a, param);
        }
    },
    send : function (requestType, data) {
        if(this.wsocket){
            var controllerId = 0;
            if(requestType == socket.SmartfoxClient.CallExtension){
                controllerId = 1;
            }
            var param = JSON.parse(data);
            var request = {
                a : requestType,
                c : controllerId,
                p : param
            };
            this.wsocket.send(JSON.stringify(request));

            cc.log("send: "+data);
        }
    }
});

socket.SmartfoxClient.Handshake = 0;
socket.SmartfoxClient.Login = 1;
socket.SmartfoxClient.Logout = 2;
socket.SmartfoxClient.GetRoomList = 3;
socket.SmartfoxClient.JoinRoom = 4;
socket.SmartfoxClient.AutoJoin = 5;
socket.SmartfoxClient.CreateRoom = 6;
socket.SmartfoxClient.GenericMessage = 7;
socket.SmartfoxClient.ChangeRoomName = 8;
socket.SmartfoxClient.ChangeRoomPassword = 9;
socket.SmartfoxClient.ObjectMessage = 10;
socket.SmartfoxClient.SetRoomVariables = 11;
socket.SmartfoxClient.SetUserVariables = 12;
socket.SmartfoxClient.CallExtension = 13;
socket.SmartfoxClient.LeaveRoom = 14;
socket.SmartfoxClient.SubscribeRoomGroup = 15;
socket.SmartfoxClient.UnsubscribeRoomGroup = 16;
socket.SmartfoxClient.SpectatorToPlayer = 17;
socket.SmartfoxClient.PlayerToSpectator = 18;
socket.SmartfoxClient.ChangeRoomCapacity = 19;
socket.SmartfoxClient.PublicMessage = 20;
socket.SmartfoxClient.PrivateMessage = 21;
socket.SmartfoxClient.ModeratorMessage = 22;
socket.SmartfoxClient.AdminMessage = 23;
socket.SmartfoxClient.KickUser = 24;
socket.SmartfoxClient.BanUser = 25;
socket.SmartfoxClient.ManualDisconnection = 26;
socket.SmartfoxClient.FindRooms = 27;
socket.SmartfoxClient.FindUsers = 28;
socket.SmartfoxClient.PingPong = 29;
socket.SmartfoxClient.SetUserPosition = 30;
//--- Buddy List API Requests -------------------------------------------------
socket.SmartfoxClient.InitBuddyList = 200;
socket.SmartfoxClient.AddBuddy = 201;
socket.SmartfoxClient.BlockBuddy = 202;
socket.SmartfoxClient.RemoveBuddy = 203;
socket.SmartfoxClient.SetBuddyVariables = 204;
socket.SmartfoxClient.GoOnline = 205;
//--- Game API Requests --------------------------------------------------------
socket.SmartfoxClient.InviteUser = 300;
socket.SmartfoxClient.InvitationReply = 301;
socket.SmartfoxClient.CreateSFSGame = 302;
socket.SmartfoxClient.QuickJoinGame = 303;
//only reponse code
socket.SmartfoxClient.UserEnterRoom = 1000,
    socket.SmartfoxClient.UserCountChange = 1001;
socket.SmartfoxClient.UserLost  = 1002;
socket.SmartfoxClient.RoomLost = 1003;
socket.SmartfoxClient.UserExitRoom = 1004;
socket.SmartfoxClient.ClientDisconnection = 1005;
socket.SmartfoxClient.ReconnectionFailure = 1006;
socket.SmartfoxClient.SetMMOItemVariables = 1007;

socket.SmartfoxClient.SocketStatus = 3000;