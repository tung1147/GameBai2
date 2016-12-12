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

        var thiz = this;
        this.settingBt.addClickEventListener(function () {
            thiz.onSettingButtonHandler();
        });
    },
    onExit : function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },
    onSettingButtonHandler : function () {
        var dialog = new SettingDialog();
        dialog.showWithAnimationMove();
    },
    onExtensionCommand : function (messageType, contents) {

    }
});

// var s_sfs_error_msg = s_sfs_error_msg || [];
// /*TLMN*/
// s_sfs_error_msg[1] = "Đánh bài không hợp lệ";
// s_sfs_error_msg[2] = "Bạn không phải chủ phòng";
// s_sfs_error_msg[3] = "Không đủ người chơi để bắt đầu";
// s_sfs_error_msg[4] = "Bạn phải đánh quân bài nhỏ nhất";
// s_sfs_error_msg[5] = "Bạn không thể bỏ lượt";
// s_sfs_error_msg[6] = "Người chơi chưa sẵn sàng";
// s_sfs_error_msg[7] = "Bạn chưa đến lượt";
// s_sfs_error_msg[8] = "Bạn không có 4 đôi thông";
// s_sfs_error_msg[9] = "Bạn không có đủ tiền";
//
// /*PHOM*/
// s_sfs_error_msg[61] = "Không thể ăn bài";
// s_sfs_error_msg[62] = "Không thể hạ bài";
// s_sfs_error_msg[63] = "Không thể gửi bài";
// s_sfs_error_msg[64] = "Không thể bốc bài";

var IGameScene = IScene.extend({
    ctor : function () {
        this._super();
        this.initController();
        this.type = "GameScene";
        this.isOwnerMe = false;

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this.sceneLayer.addChild(bg);

        var gameTopBar = new GameTopBar();
        this.gameTopBar = gameTopBar;
        this.sceneLayer.addChild(gameTopBar);

        var thiz = this;
        gameTopBar.backBt.addClickEventListener(function(){
            thiz.backButtonClickHandler();
        });
    },
    initController : function () {

    },
    getMaxSlot : function () {
        if(this.playerView){
            return this.playerView.length;
        }
        return 0;
    },

    backButtonClickHandler : function () {
        if(this._controller){
            this._controller.requestQuitRoom();
        }
    },
    exitToLobby : function () {
        var homeScene = new HomeScene();
        var gameId = s_games_chanel_id[PlayerMe.gameType];
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
        if(this._controller){
            this._controller.releaseController();
            this._controller = null;
        }
    },

    showErrorMessage : function (message, scene) {
        if(scene){
            MessageNode.getInstance().show(message,null,scene);
        }
        else{
            MessageNode.getInstance().show(message);
        }
    },

    sendChatMessage : function (message) {
        if(this._controller){
            this._controller.sendChat(message);
        }
    },

    showLoading : function (message) {

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

    getSlotByUsername : function (username) {
        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == username){
                return this.allSlot[i];
            }
        }
        return null;
    },

    fillPlayerToSlot : function (playerList) {
        this.allSlot = this.playerView;
        for(var i=0;i<this.allSlot.length;i++){
            this.allSlot[i] = this.playerView[i];
            var data = playerList[i];

            this.allSlot[i].stopTimeRemain();
            this.allSlot[i].userIndex = data.userIndex;

            if(data.username == ""){
                this.allSlot[i].setEnable(false);
            }
            else{
                this.allSlot[i].setEnable(true);
                this.allSlot[i].setUsername(data.username);
                this.allSlot[i].setGold(data.gold);
                this.allSlot[i].spectator = data.spectator;
            }
        }
    },

    userJoinRoom : function (info) {
        for(var i=0;i<this.allSlot.length;i++){
            if(info.index == this.allSlot[i].userIndex){
                this.allSlot[i].setEnable(true);
                this.allSlot[i].userIndex = info.index;
                this.allSlot[i].stopTimeRemain();
                this.allSlot[i].setUsername(info.username);
                this.allSlot[i].setGold(info.gold);

                return;
            }
        }

        // var meIndex = this.allSlot[0].userIndex;
        // var slot = info.index - meIndex;
        // if(slot < 0){
        //     slot += this.allSlot.length;
        // }
        //
        // this.allSlot[slot].setEnable(true);
        // this.allSlot[slot].userIndex = info.index;
        // this.allSlot[slot].stopTimeRemain();
        // this.allSlot[slot].setUsername(info.username);
        // this.allSlot[slot].setGold(info.gold);
    },

    userExitRoom : function (username) {
        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == username){
                this.allSlot[i].setEnable(false);
                this.allSlot[i].stopTimeRemain();
                break;
            }
        }
    },

    updateRegExitRoom : function (exit) {
        if(exit){
            this.gameTopBar.backBt.loadTextureNormal("ingame-backBt-active.png", ccui.Widget.PLIST_TEXTURE);
        }
        else{
            this.gameTopBar.backBt.loadTextureNormal("ingame-backBt.png", ccui.Widget.PLIST_TEXTURE);
        }

    },

    onChatMessage : function (username, message) {
        cc.log("chat: "+username + " - "+message);
        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == username){
                this.allSlot[i].chatView.show(message);
                break;
            }
        }
    },

    onSFSExtension : function () {
        
    }
});