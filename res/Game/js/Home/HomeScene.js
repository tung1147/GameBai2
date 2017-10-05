/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var s_homescene_first_run = true;

var HomeScene = IScene.extend({
    ctor: function () {
        this._super();
        this.miniGameLayer = new cc.Node();
        this.addChild(this.miniGameLayer, 1);

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bg);

        this.mainLayer = new cc.Node();
        this.sceneLayer.addChild(this.mainLayer);

        var miniGame = new MiniGameLayer();
        this.mainLayer.addChild(miniGame);

        var gameLayer = new GameLayer();
        this.mainLayer.addChild(gameLayer);

        var topBar = new LobbyTopBar();
        this.mainLayer.addChild(topBar);

        var bottomBar = new LobbyBottomBar();
        this.mainLayer.addChild(bottomBar);
    },

    onFetchProduct: function (command, data) {
        // data = data["data"];
        // cc.Global.thecaoData = cc.Global.thecaoData || data["1"];
        // cc.Global.vatphamData = cc.Global.vatphamData || data["4"];
        // cc.Global.dailyData = cc.Global.dailyData || data["3"];
        // cc.Global.tienmatData = cc.Global.tienmatData || data["2"];
    },
    onFetchCashin: function (command, data) {
        //cc.log(JSON.stringify(data));
        // data = data["data"]["2"];
        // cc.Global.SMSList = [];
        // for (var i = 0; i < data.length; i++) {
        //     var currency = data[i]["currency"];
        //     var smsGateway = data[i]["detail"]["smsGateway"];
        //     var vmsContent = data[i]["detail"]["vmsContent"];
        //     var vnpContent = data[i]["detail"]["vnpContent"];
        //     var vttContent = data[i]["detail"]["vttContent"];
        //     var gold = data[i]["gold"];
        //     var id = data[i]["id"];
        //     var price = data[i]["price"];
        //     cc.Global.SMSList.push({
        //         currency: currency,
        //         smsGateway: smsGateway,
        //         vmsContent: vmsContent,
        //         vnpContent: vnpContent,
        //         vttContent: vttContent,
        //         gold: parseInt(gold.replace(",", "")),
        //         id: id,
        //         price: parseInt(price)
        //     });
        // }
    },
    onSFSChangeGold : function (messageType, data) {
        if(data.p.reason == 1){
            var goldChange = data["p"]["1"];
            if(goldChange < 0){
                MessageNode.getInstance().show("Bạn vừa bị trừ "+Math.abs(goldChange) + " Vàng vì thoát khỏi phòng", null, this);
            }
        }
    },

    _checkLogin : function () {
        if(this.homeLocation == 1){
            //MessageNode.getInstance().show("Bạn phải đăng nhập trước");
            SceneNavigator.showLoginNormal();
            return false;
        }
        return true;
    },

    onChangeRefeshUserInfo : function (command, data) {
        this.userInfo.refreshView();
    },

    onNewsMessage : function (command, data) {
        //this.topBar.refreshView();
        var popupMsg = data["data"]["popup"];
        if(popupMsg && popupMsg != ""){
            //show popup
            var messageDialog = new MessageDialog();
            messageDialog.setMessage(popupMsg);
            messageDialog.showWithAnimationScale();
        }
    },

    onLoginHandler: function (command, data) {
        //  cc.log("onLoginHandler");
        if (data.status == 0) {
            this.userInfo.refreshView();
            this.miniGame.fetchHuThuong();

            // subscribe hu thuon
            LobbyClient.getInstance().send({command: "subscribeMiniGame", gameType: "Mini_Poker"});
            LobbyClient.getInstance().send({command: "subscribeMiniGame", gameType: "Mini_Cao_Thap"});
            LobbyClient.getInstance().send({command: "subscribeMiniGame", gameType: "Video_Poker"});
        }
    },

    onMiniGameReconnect : function () {
        if(this.homeLocation == 0 || this.homeLocation == 1){
            this.startGame();
        }
    },

    onLobbyStatusHandler: function () {
        //  cc.log("onLobbyStatusHandler");
    },

    startHome: function () {
        this.popupLayer.removeAllChildren();
    },

    startGame: function () {

    },

    startLobby: function () {

    },

    onTouchGame: function (gameId) {
        if (this._checkLogin() == false) {
            return;
        }

        if(!s_game_available[gameId]){
            MessageNode.getInstance().show("Game chưa ra mắt");
            return;
        }
        if(gameId == GameType.GAME_SLOT_FRUIT)
        {
            cc.director.replaceScene(new SlotFruitScene());
            return;
        }

        if (gameId == GameType.GAME_VongQuayMayMan ||
            gameId == GameType.MiniGame_CaoThap ||
            gameId == GameType.MiniGame_ChanLe ||
            gameId == GameType.MiniGame_Poker ||
            gameId == GameType.MiniGame_VideoPoker) {
            SceneNavigator.toMiniGame(gameId, false);
        }
        else {
            this.startLobby(gameId);
        }
    },

    backButtonHandler: function () {
        var thiz = this;
        if (LoadingDialog.getInstance().isShow()) {
            return;
        }
        if (this.popupLayer.getChildren().length > 0) {
            this.popupLayer.removeAllChildren();
            return;
        }
        if (this.subLayer) {
            this.subLayer.removeFromParent(true);
            this.subLayer = 0;
            this.mainLayer.visible = true;
            if (this.homeLocation == 2) {
                this.miniGame.startAnimation();
                this.gameLayer.startAnimation();
            }
            if (this.homeLocation == 3) {
                this.lobbyLayer.startAnimation();
                this.miniGame.startAnimation();
            }
            return;
        }
        if (this.homeLocation == 1) {
            //exit app
            SystemPlugin.getInstance().exitApp();
        }
        else if (this.homeLocation == 2) {
            //logout
            //to home
            var dialog = new MessageConfirmDialog();
            dialog.setMessage("Bạn muốn thoát game ?");
            dialog.okButtonHandler = function () {
                // if(cc.sys.isNative){
                //     SystemPlugin.getInstance().exitApp();
                // }
                // else{
                //     SceneNavigator.toHome();
                // }
                SceneNavigator.toHome();
            };
            dialog.cancelButtonHandler = function () {
                dialog.hide();
            };
            dialog.show();
        }
        else if (this.homeLocation == 3) {
            //to game
            LobbyClient.getInstance().unSubscribe();
            this.startGame();
        }
    },

    onEnter: function () {
        this._super();
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // onKeyPressed:  function(keyCode, event){
            //     cc.log("Key " + parseKeyCode(keyCode) + " was pressed!");
            // },
            onKeyReleased: function (keyCode, event) {
                if(cc.sys.isNative){
                    if (parseKeyCode(keyCode) === cc.KEY.back) {
                        thiz.backButtonHandler();
                    }
                }
                else{
                    if(keyCode === cc.KEY.escape){
                        thiz.backButtonHandler();
                    }
                }
            }
        }, this);

        if(s_homescene_first_run){
            s_homescene_first_run = false;
            cc.director.setDisplayStats(false);

            if(!cc.sys.isNative){
                s_homescene_first_run = false;
                if(ViewNavigatorManager.execute()){
                    this.homeLayer.y = 0;
                    this.homeLayer.stopAllActions();
                }
                else{
                    var accessToken = cc.Global.GetSetting("accessToken","");
                    if(accessToken != ""){
                        LoadingDialog.getInstance().show("Đang đăng nhập");
                        LobbyClient.getInstance().tokenLogin(accessToken);
                    }
                }
            }
            else{
                SystemPlugin.getInstance().enableMipmapTexture("res/Card.png");
                //mobile auto login
                var loginType = cc.Global.GetSetting("lastLoginType", "");
                if(loginType === "normalLogin"){
                    var username = cc.Global.getSaveUsername();
                    var password = cc.Global.getSavePassword();
                    if(username !== "" && password != ""){
                        LoadingDialog.getInstance().show("Đang đăng nhập");
                        LobbyClient.getInstance().loginNormal(username, password, true);
                    }
                }
                else if(loginType === "facebookLogin"){
                    LoadingDialog.getInstance().show("Đang đăng nhập");
                    FacebookPlugin.getInstance().showLogin();
                }
            }
        }

        MiniGameNavigator.showAll();
    },

    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
        SmartfoxClient.getInstance().removeListener(this);
    }
});