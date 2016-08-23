/**
 * Created by Quyet Nguyen on 7/21/2016.
 */

var GameTopBar = cc.Node.extend({
    ctor : function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onExtensionCommand, this);

        this.backBt = new ccui.Button("ingame-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.backBt.setPosition(65, 653);
        this.addChild(this.backBt);

        this.settingBt = new ccui.Button("ingame-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.settingBt.setPosition(1220, this.backBt.y);
        this.addChild(this.settingBt);

        this.setAnchorPoint(0.0, 1.0);
        this.setContentSize(1280.0, 720.0);
        this.setPosition(0.0, 720.0);
        this.setScale(cc.winSize.screenScale);
    },
    onExit : function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },
    onExtensionCommand : function (messageType, contents) {
        
    }
});

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

var IGameScene = IScene.extend({
    ctor : function () {
        this._super();
        this.type = "GameScene";
        this.isOwnerMe = false;

        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.UserExitRoom, this.onUserExitRoom, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this.sceneLayer.addChild(bg);

        var gameTopBar = new GameTopBar();
        this.addChild(gameTopBar);

        var thiz = this;
        gameTopBar.backBt.addClickEventListener(function(){
            thiz.backButtonClickHandler();
        });
    },
    backButtonClickHandler : function () {
        SmartfoxClient.getInstance().sendExtensionRequest(PlayerMe.SFS.roomId,"quitRoom", null);
    },
    exitToLobby : function () {
        var homeScene = new HomeScene();
        var gameId = s_games_chanel_id[PlayerMe.gameType]
        homeScene.startLobby(gameId);
        cc.director.replaceScene(homeScene);
    },
    exitToGame : function () {
        var homeScene = new HomeScene();
        homeScene.startGame();
        cc.director.replaceScene(homeScene);
    },
    onExit : function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },
    onUserExitRoom : function (messageType, contents) {
        if(PlayerMe.SFS.userId ==  contents.u){
            this.exitToLobby();
        }
    },
    onSFSExtension : function (messageType, content) {
        if(content.c == "ping"){
            SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("ping", null);
        }
        else if(content.c == "0"){ //update gold
            this.updateGold(content.p.u, content.p["2"]);
        }
        else if(content.c == "1"){ //startGame
            this.processPlayerPosition(content);
        }
        else if (content.c == "2"){ //user joinRoom
            this.processPlayerPosition(content);
        }
        else if (content.c == "9"){ //user exit
            this.processPlayerPosition(content);
        }
        else if (content.c == "13"){//reconnect
            this.processPlayerPosition(content);
        }
        else if(content.c == "11"){ // update owner
            this.updateOwner(content.p.u);
        }
        else if(content.c == "___err___"){ //error chem
            this.onError(content.p);
        }
    },
    onError : function (params) {
        var ec = params.code;
        var msg = s_sfs_error_msg[ec];
        if(msg){
            MessageNode.getInstance().show(msg);
        }
        else{
            MessageNode.getInstance().show("Mã lỗi không xác định[" + ec + "]");
        }
    },
    updateOwner : function (username) {
        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == username){
                //show key icon
            }
            else{

            }
        }

        if(PlayerMe.username == username){
            this.isOwnerMe = true;
        }
        else{
            this.isOwnerMe = false;
        }
    },
    updateGold : function (username, gold) {
        var goldNumber = gold;
        if(typeof gold === "string"){
            goldNumber = parseInt(gold);
        }
        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == username){
                this.allSlot[i].setGold(goldNumber);
                return;
            }
        }
    },
    processPlayerPosition : function (content) {
         if(content.c == "1"){ //startGame
            var userList = content.p["5"];
            this.setPlayerWithPosition(userList);

            for(var i=0;i<this.allSlot.length;i++){
                this.allSlot[i].setEnable(false);
            }
            for(var i=0;i<userList.length;i++){
                var idx = userList[i]["4"];
                this.allSlot[idx].setEnable(true);
                this.allSlot[idx].setUsername(userList[i].u);
                this.allSlot[idx].setGold(userList[i]["3"]);
                this.allSlot[idx].stopTimeRemain();
               // this.updateGold(userList[i].u, userList[i]["3"]);
            }
        }
        else if (content.c == "2"){ //user joinRoom
            var idx = content.p["4"];
            this.allSlot[idx].setEnable(true);
            this.allSlot[idx].stopTimeRemain();
            this.allSlot[idx].setUsername(content.p.u);
            this.allSlot[idx].setGold(content.p["3"]);
            // this.updateGold(content.p.u, content.p["3"]);
        }
        else if (content.c == "9"){ //user exit
            if(content.p.u != PlayerMe.username){
                for(var i=0;i<this.allSlot.length;i++){
                    if(this.allSlot[i].username == content.p.u){
                        this.allSlot[i].setEnable(false);
                        this.allSlot[i].stopTimeRemain();
                        break;
                    }
                }
            }
            else{
                //me
            }
        }
        else if (content.c == "13"){//reconnect
            var userList = content.p["1"]["5"];
            this.setPlayerWithPosition(userList);

            for(var i=0;i<this.allSlot.length;i++){
                this.allSlot[i].setEnable(false);
                this.allSlot[i].stopTimeRemain();
            }
            for(var i=0;i<userList.length;i++){
                var idx = userList[i]["4"];
                this.allSlot[idx].setEnable(true);
                this.allSlot[idx].stopTimeRemain();
                this.allSlot[idx].setUsername(userList[i].u);
                this.allSlot[idx].setGold(userList[i]["3"]);
               // this.updateGold(userList[i].u, userList[i]["3"]);
            }
        }
    },
    getSlotByUsername : function (username) {
        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == username){
                return this.allSlot[i];
            }
        }
        return null;
    },
    setPlayerWithPosition : function (players) {
        //find me
        var idx = 0;
        for(var i=0;i<players.length;i++){
            if(players[i].u == PlayerMe.username){
                idx = players[i]["4"];
                break;
            }
        }
        var allSlot = [];
        for(var i=0;i<this.playerView.length;i++){
            allSlot[idx] = this.playerView[i];
            idx++;
            if(idx >= this.playerView.length){
                idx = 0;
            }
        }
        this.allSlot = allSlot;

        //update owner
        var ownerPlayer = null;
        for(var i=0;i<players.length;i++){
            if(players[i]["1"] == true){
                ownerPlayer = players[i].u;
                break;
            }
        }
        this.updateOwner(ownerPlayer);
    },
});