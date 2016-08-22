/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var HomeScene = IScene.extend({
    ctor : function () {
        this._super();
        this.type = "HomeScene";
        this.homeLocation = 0;

        LobbyClient.getInstance().addListener("login", this.onLoginHandler, this);
        LobbyClient.getInstance().addListener("LobbyStatus", this.onLobbyStatusHandler, this);

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this.sceneLayer.addChild(bg);

        this.mainLayer = new cc.Node();
        this.sceneLayer.addChild(this.mainLayer);

        this.topBar = new LobbyTopBar();
        this.mainLayer.addChild(this.topBar);

        this.userInfo = new LobbyBottomBar();
        this.mainLayer.addChild(this.userInfo);

        this.homeLayer = new HomeLayer();
        this.mainLayer.addChild(this.homeLayer,1);

        this.gameLayer = new GameLayer();
        this.mainLayer.addChild(this.gameLayer);

        this.lobbyLayer = new LobbyLayer();
        this.mainLayer.addChild(this.lobbyLayer);

        this.miniGame = new MiniGameLayer();
        this.mainLayer.addChild(this.miniGame);

        var thiz = this;
        this.topBar.backBt.addClickEventListener(function () {
            thiz.backButtonHandler();
        });
        this.topBar.newsBt.addClickEventListener(function () {
            thiz.newsButtonhandler();
        });
        this.topBar.rankBt.addClickEventListener(function () {
            thiz.rankButtonHandler();
        });
        this.topBar.callBt.addClickEventListener(function () {
            thiz.callButtonHandler();
        });
        this.topBar.settingBt.addClickEventListener(function () {
            thiz.settingButtonHandler();
        });
        this.userInfo.newsBt.addClickEventListener(function () {
            thiz.newsMesasgeButtonHandler();
        });
        this.userInfo.paymentBt.addClickEventListener(function () {
            thiz.paymentButtonHandler();
        });
        this.userInfo.rewardBt.addClickEventListener(function () {
            thiz.rewardButtonHandler();
        });
        this.userInfo.userinfoBt.addClickEventListener(function () {
            thiz.userInfoButtonHandler();
        });

        this.homeLayer.loginBt.addClickEventListener(function () {
            var loginDialog  = new LoginDialog();
            thiz.popupLayer.addChild(loginDialog);
        });

        this.homeLayer.signupBt.addClickEventListener(function () {
            var signupDialog = new SignupDialog();
            thiz.popupLayer.addChild(signupDialog);
        });
        this.homeLayer.fbButton.addClickEventListener(function () {
            FacebookPlugin.getInstance().showLogin();
        });

        this.startHome();

        //
        FloatButton.getInstance().show(this);
    },
    onLoginHandler : function (command, data) {
      //  cc.log("onLoginHandler");
        if(data.status == 0){
            LoadingDialog.getInstance().hide();
            if(this.homeLocation == 1){
                this.userInfo.y = -100.0;
                this.userInfo.stopAllActions();
                this.userInfo.runAction(new cc.MoveTo(0.2, cc.p(0,0)));
                this.startGame();
            }
            else{
                this.userInfo.refreshView();
                this.topBar.refreshView();
            }
        }
    },
    onLobbyStatusHandler : function () {
      //  cc.log("onLobbyStatusHandler");
    },
    startHome : function () {
        this.popupLayer.removeAllChildren();
        if(this.subLayer){
            this.subLayer.removeFromParent(true);
            this.subLayer = 0;
            this.mainLayer.visible = true;
        }
        this.homeLayer.visible = true;
        this.gameLayer.visible = true;
        this.lobbyLayer.visible = false;
        this.userInfo.visible = false;
        if(this.homeLocation == 0 || this.homeLocation == 3) {
            this.gameLayer.startAnimation();
        }
        if(this.homeLocation == 0){
            this.miniGame.startAnimation();
        }
        this.homeLayer.y = -100.0;
        this.homeLayer.stopAllActions();
        this.homeLayer.runAction(new cc.EaseSineOut(new cc.MoveTo(0.3, cc.p(0,0))));
        this.homeLocation = 1;
        FloatButton.getInstance().setVisible(false);
    },
    startGame : function () {
        this.popupLayer.removeAllChildren();
        if(this.homeLocation == 0 || this.homeLocation == 1){
            this.userInfo.y = -100.0;
            this.userInfo.stopAllActions();
            this.userInfo.runAction(new cc.EaseSineOut(new cc.MoveTo(0.3, cc.p(0,0))));
        }
        this.homeLayer.visible = false;
        this.gameLayer.visible = true;
        this.lobbyLayer.visible = false;
        this.userInfo.visible = true;
        this.userInfo.refreshView();
        this.topBar.refreshView();
        if(this.homeLocation == 0 || this.homeLocation == 3) {
            this.gameLayer.startAnimation();
        }
        if(this.homeLocation == 0){
            this.miniGame.startAnimation();
        }
        this.homeLocation = 2;
        FloatButton.getInstance().setVisible(true);
    },

    startLobby : function(){
        this.popupLayer.removeAllChildren();
        this.homeLayer.visible = false;
        this.gameLayer.visible = false;
        this.lobbyLayer.visible = true;
        this.userInfo.visible = true;
        this.userInfo.refreshView();
        if(arguments.length == 1){
            this.lobbyLayer.startGame(arguments[0]);
            LobbyClient.getInstance().subscribe(arguments[0]);
        }
        else{
            this.lobbyLayer.startGame(-1);
        }
        this.homeLocation = 3;
        FloatButton.getInstance().setVisible(true);
    },
    onTouchGame : function (gameId) {
        if(this.homeLocation == 1){
            MessageNode.getInstance().show("Bạn phải đăng nhập trước");
            return;
        }
        if(gameId == GameType.MiniGame_CaoThap){

        }
        else if(gameId == GameType.MiniGame_ChanLe){

        }
        else if(gameId == GameType.MiniGame_Pocker){

        }
        else if(gameId == GameType.GAME_VongQuayMayMan){
            var vongquay = new VongQuayScene();
            cc.director.replaceScene(new cc.TransitionFade(0.5, vongquay, cc.color("#000000")));
        }
        else{
            this.startLobby(gameId);
        }
    },
    
    startGameWithAnimation : function () {
        this.startGame();
    },

    backButtonHandler : function () {
        var thiz = this;
        if(LoadingDialog.getInstance().isShow()){
            return;
        }
        if(this.popupLayer.getChildren().length > 0){
            this.popupLayer.removeAllChildren();
            return;
        }
        if(this.subLayer){
            this.subLayer.removeFromParent(true);
            this.subLayer = 0;
            this.mainLayer.visible = true;
            if(this.homeLocation == 2){
                this.miniGame.startAnimation();
                this.gameLayer.startAnimation();
            }
            if(this.homeLocation == 3){
                this.lobbyLayer.startAnimation();
                this.miniGame.startAnimation();
            }
            return;
        }
        if(this.homeLocation == 1){
            //exit app
            SystemPlugin.getInstance().exitApp();
        }
        else if(this.homeLocation == 2){
            //logout
            //to home
            var dialog = new MessageConfirmDialog();
            dialog.setMessage("Bạn muốn thoát game ?");
            dialog.okButtonHandler = function () {
                SystemPlugin.getInstance().exitApp();
            };
            dialog.cancelButtonHandler = function () {
                dialog.hide();
            };
            dialog.show();
        }
        else if(this.homeLocation == 3){
            //to game
            LobbyClient.getInstance().unSubscribe();
            this.startGame();
        }
    },

    addSubLayer : function (subLayer) {
        var thiz = this;
        subLayer.backBt.addClickEventListener(function () {
            thiz.backButtonHandler();
        });
        subLayer.settingBt.addClickEventListener(function () {
            thiz.settingButtonHandler();
        });

        this.subLayer = subLayer;
        this.sceneLayer.addChild(subLayer);
        this.mainLayer.visible = false;
    },

    newsButtonhandler : function () {
        if(this.homeLocation == 1){
            MessageNode.getInstance().show("Bạn phải đăng nhập trước");
            return;
        }
        this.addSubLayer(new NewsLayer());
    },
    
    rankButtonHandler : function () {
        if(this.homeLocation == 1){
            MessageNode.getInstance().show("Bạn phải đăng nhập trước");
            return;
        }
        this.addSubLayer(new RankLayer());
    },

    settingButtonHandler : function () {
        var dialog = new SettingDialog();
        dialog.showWithAnimationMove();
    },

    callButtonHandler : function () {
        // var dialog = new Dialog();
        // dialog.initWithSize(cc.size(700,300));
        // dialog.show();

       // LoadingDialog.getInstance().show();
        //MessageNode.getInstance().show("Test message node");

        // var dialog = new RewardDialog();
        // dialog.setItem("Apple iPhone 10S 128GB", 1000000);
        // dialog.showWithAnimationScale();

        var dialog = new ResultDialog();
        dialog.show();
    },

    newsMesasgeButtonHandler : function () {
        if(this.homeLocation == 1){
            MessageNode.getInstance().show("Bạn phải đăng nhập trước");
            return;
        }
        this.addSubLayer(new InboxLayer());
    },
    
    rewardButtonHandler : function () {
        this.addSubLayer(new RewardLayer());
    },
    
    paymentButtonHandler : function () {
        this.addSubLayer(new PaymentLayer());
    },
    
    userInfoButtonHandler : function () {
        var dialog = new UserinfoDialog();
        dialog.showWithAnimationMove();
    },

    onEnter : function () {
        this._super();
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // onKeyPressed:  function(keyCode, event){
            //     cc.log("Key " + parseKeyCode(keyCode) + " was pressed!");
            // },
            onKeyReleased: function(keyCode, event){
                if(parseKeyCode(keyCode) == cc.KEY.back){
                    thiz.backButtonHandler();
                }
            }
        }, this);
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});