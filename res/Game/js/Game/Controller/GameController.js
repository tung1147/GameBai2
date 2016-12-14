/**
 * Created by QuyetNguyen on 11/23/2016.
 */

var s_sfs_error_msg = s_sfs_error_msg || [];

var GameController = cc.Class.extend({
    ctor : function () {

    },
    initWithView : function (view) {
        this._view = view;
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.SocketStatus, this.onSmartfoxSocketStatus, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.UserExitRoom, this.onSmartfoxUserExitRoom, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.GenericMessage, this.onSmartfoxRecvChatMessage, this);
        LobbyClient.getInstance().addListener("getLastSessionInfo", this.onGetLastSessionInfo, this);
    },

    releaseController : function () {
        SmartfoxClient.getInstance().removeListener(this);
        LobbyClient.getInstance().removeListener(this);
        this._view = null;
    },

    onSmartfoxSocketStatus : function (type, eventName) {
        if(eventName == "LostConnection"){
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            LobbyClient.getInstance().requestGetLastSessionInfo();
        }
    },

    onSmartfoxUserExitRoom : function (messageType, contents) {
        if(PlayerMe.SFS.userId ==  contents.u){
            this._view.exitToLobby();
        }
    },

    onSmartfoxRecvChatMessage : function (event, data) {
        this._view.onChatMessage(data.p.userName, data.m);
    },

    onSFSExtension : function (messageType, content) {
        if(content.c == "ping"){
            SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("ping", null);
        }
        else if(content.c == "0"){ //update gold
            this.onUpdateGold(content.p);
        }
        else if(content.c == "1"){ //startGame
            this.onJoinRoom(content.p);
        }
        else if (content.c == "13"){//reconnect
            this.onReconnect(content.p);
        }
        else if (content.c == "2"){ //user joinRoom
            this.onUserJoinRoom(content.p);
        }
        else if (content.c == "9"){ //user exit
            this.onUserExit(content.p);
        }
        else if(content.c == "11"){ // update owner
            this.onUpdateOwner(content.p.u);
        }
        else if(content.c == "19"){ // exit room
           this.onExitGame(content.p);
        }
        else if(content.c == "___err___"){ //error chem
            this.onError(content.p);
        }

        if(this._view.onSFSExtension){
            this._view.onSFSExtension(messageType, content);
        }
    },

    onJoinRoom : function (params) {
        this._processPlayerPosition(params["5"]);
    },

    onReconnect : function(params){
        this._processPlayerPosition(params["1"]["5"]);
    },

    onUpdateOwner : function (params) {
        if(PlayerMe.username == params){
            this.isOwnerMe = true;
        }
        else{
            this.isOwnerMe = false;
        }
    },

    onUpdateGold : function (params) {
        this._view.updateGold(params.u, params["2"]);
        if(params.u == PlayerMe.username){
            PlayerMe.gold = parseInt(params["2"]);
        }
    },
    onUserJoinRoom : function (p) {
        var userInfo = {
            index: p["4"],
            username: p["u"],
            gold: p["3"],
            avt : p["avtId"]
        };
        this._view.userJoinRoom(userInfo);
    },
    onUserExit : function (params) {
        if(params.u != PlayerMe.username){
            this._view.userExitRoom(params.u);
        }
    },
    onExitGame : function (param) {
        this._view.updateRegExitRoom(param["1"]);
        if(param["1"]){
            MessageNode.getInstance().show("Bạn đã đăng ký thoát phòng thành công !");
        }
        else{
            MessageNode.getInstance().show("Bạn đã hủy đăng ký thoát phòng thành công !");
        }
    },
    onError : function (params) {
        // this.onError(content.p);
        var ec = params.code;
        var msg = s_sfs_error_msg[ec];
        if(msg){
            this._view.showErrorMessage(msg);
        }
        else{
            this._view.showErrorMessage("Mã lỗi không xác định[" + ec + "]");
        }
    },

    _processPlayerPosition : function (players) {
        //find me
        var meIndex = 0;
        this.isSpectator = false;
        for(var i=0;i<players.length;i++){
            if(players[i].u == PlayerMe.username){
                meIndex = players[i]["4"];
                this.isSpectator = players[i]["2"];
                var regExt = players[i]["regExt"];
                this._view.updateRegExitRoom(regExt);
                break;
            }
        }

        this.playerSlot = [];
        var maxSlot = this.getMaxSlot();
        for(var i=0;i<maxSlot;i++){
            var slot = i - meIndex;
            if(slot < 0){
                slot += maxSlot;
            }
            this.playerSlot[slot] = {
                userIndex : i,
                username : ""
            };
        }

        for(var i=0;i<players.length;i++){
            var slot = players[i]["4"] - meIndex;
            if(slot < 0){
                slot += maxSlot;
            }

            this.playerSlot[slot].username = players[i]["u"];
            this.playerSlot[slot].gold = players[i]["3"];
            this.playerSlot[slot].spectator = players[i]["2"];
            this.playerSlot[slot].avt = players[i]["avtId"];

            // this.playerSlot[slot] = {
            //     userIndex : players[i]["4"],
            //     username : players[i]["u"],
            //     gold : players[i]["3"],
            //     spectator : players[i]["2"]
            // }
        }

        this._view.fillPlayerToSlot(this.playerSlot);

        //update owner
        var ownerPlayer = null;
        for(var i=0;i<players.length;i++){
            if(players[i]["1"] == true){
                ownerPlayer = players[i].u;
                if(PlayerMe.username == ownerPlayer){
                    this.isOwnerMe = true;
                }
                else{
                    this.isOwnerMe = false;
                }
                break;
            }
        }
        //this._view.updateOwner(ownerPlayer);
        this.onUpdateOwner(ownerPlayer);
    },

    //lobby client
    onGetLastSessionInfo : function (command, eventData) {
        var info = eventData.data.lastSessionInfo;
        if(info){
            var host = info.ip;
            var port = info.port;
            if(host && port){
                //LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                this._view.showLoading("Đang kết nối lại máy chủ");
                SmartfoxClient.getInstance().connect(host, port);
                return;
            }
        }
        this._view.exitToLobby();
    },

    //request
    requestQuitRoom : function () {
        SmartfoxClient.getInstance().sendExtensionRequest(PlayerMe.SFS.roomId,"19", null);
    },

    sendChat : function (message) {
        var content = {
            t : 0, //public message
            r : PlayerMe.SFS.roomId,
            u : PlayerMe.SFS.userId,
            m : message,
            p : {
                userName : PlayerMe.username
            }
        };
        SmartfoxClient.getInstance().send(socket.SmartfoxClient.GenericMessage, content);
    }

});