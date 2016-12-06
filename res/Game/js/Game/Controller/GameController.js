/**
 * Created by QuyetNguyen on 11/23/2016.
 */

var s_sfs_error_msg = s_sfs_error_msg || [];
/*TLMN*/
s_sfs_error_msg[1] = "Đánh bài không hợp lệ";
s_sfs_error_msg[2] = "Bạn không phải chủ phòng";
s_sfs_error_msg[3] = "Không đủ người chơi để bắt đầu";
s_sfs_error_msg[4] = "Bạn phải đánh quân bài nhỏ nhất";
s_sfs_error_msg[5] = "Bạn không thể bỏ lượt";
s_sfs_error_msg[6] = "Người chơi chưa sẵn sàng";
s_sfs_error_msg[7] = "Bạn chưa đến lượt";
s_sfs_error_msg[8] = "Bạn không có 4 đôi thông";
s_sfs_error_msg[9] = "Bạn không có đủ tiền";

/*PHOM*/
s_sfs_error_msg[61] = "Không thể ăn bài";
s_sfs_error_msg[62] = "Không thể hạ bài";
s_sfs_error_msg[63] = "Không thể gửi bài";
s_sfs_error_msg[64] = "Không thể bốc bài";

var GameController = cc.Class.extend({
    ctor : function () {

    },
    initWithView : function (view) {
        this._view = view;
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.SocketStatus, this.onSmartfoxSocketStatus, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.UserExitRoom, this.onUserExitRoom, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
        LobbyClient.getInstance().addListener("getLastSessionInfo", this.onGetLastSessionInfo, this);
    },

    releaseController : function () {
        SmartfoxClient.getInstance().removeListener(this);
    },

    onSmartfoxSocketStatus : function (type, eventName) {
        if(eventName == "LostConnection"){
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            LobbyClient.getInstance().requestGetLastSessionInfo();
        }
    },

    onUserExitRoom : function (messageType, contents) {
        if(PlayerMe.SFS.userId ==  contents.u){
            this._view.exitToLobby();
        }
    },

    onSFSExtension : function (messageType, content) {
        if(content.c == "ping"){
            SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("ping", null);
        }
        else if(content.c == "0"){ //update gold
            this._view.updateGold(content.p.u, content.p["2"]);
            if(content.p.u == PlayerMe.username){
                PlayerMe.gold = parseInt(content.p["2"]);
            }
        }
        else if(content.c == "1"){ //startGame
            this.processPlayerPosition(content);
        }
        else if (content.c == "2"){ //user joinRoom
            var userInfo = {
                index : content.p["4"],
                username : content.p["u"],
                gold : content.p["3"]
            }
            this._view.userJoinRoom(userInfo);
        }
        else if (content.c == "9"){ //user exit
            if(content.p.u != PlayerMe.username){
                this._view.userExitRoom(content.p["u"]);
            }
        }
        else if (content.c == "13"){//reconnect
            this.processPlayerPosition(content);
        }
        else if(content.c == "11"){ // update owner
            this.updateOwner(content.p.u);
        }
        else if(content.c == "19"){ // exit room
            if(content.p["1"]){
                MessageNode.getInstance().show("Bạn đã đăng ký thoát phòng thành công !");
            }
            else{
                MessageNode.getInstance().show("Bạn đã hủy đăng ký thoát phòng thành công !");
            }
        }
        else if(content.c == "___err___"){ //error chem
           // this.onError(content.p);
            var ec = content.p.code;
            var msg = s_sfs_error_msg[ec];
            if(msg){
                this._view.showErrorMessage(msg);
            }
            else{
                this._view.showErrorMessage("Mã lỗi không xác định[" + ec + "]");
            }
        }

        if(this._view.onSFSExtension){
            this._view.onSFSExtension(messageType, content);
        }
    },

    processPlayerPosition : function (content) {
        var players = null;
        if(content.c == "1"){ //startGame
            players = content.p["5"];
        }
        else if (content.c == "13"){//reconnect
            players = content.p["1"]["5"];
        }


        //find me
        var meIndex = 0;
        this.isSpectator = false;
        for(var i=0;i<players.length;i++){
            if(players[i].u == PlayerMe.username){
                meIndex = players[i]["4"];
                this.isSpectator = players[i]["2"];
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
        this.updateOwner(ownerPlayer);
    },

    onGetLastSessionInfo : function (command, eventData) {
        var info = eventData.data.lastSessionInfo;
        if(info){
            var host = info.ip;
            var port = info.port;
            if(host && port){
                //LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                this._view.showLoading("Đang kết nối lại máy chủ");
                SmartfoxClient.getInstance().findAndJoinRoom(host, port);
                return;
            }
        }
        this._view.exitToLobby();
    },
    updateOwner : function (username) {
        if(PlayerMe.username == username){
            this.isOwnerMe = true;
        }
        else{
            this.isOwnerMe = false;
        }
    },
    //request
    requestQuitRoom : function () {
        SmartfoxClient.getInstance().sendExtensionRequest(PlayerMe.SFS.roomId,"19", null);
    }
});