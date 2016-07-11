/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var HomeScene = IScene.extend({
    homeLayer:null,
    homeLocation:0,
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this.sceneLayer.addChild(bg);

        this.topBar = new LobbyTopBar();
        this.sceneLayer.addChild(this.topBar);

        this.userInfo = new LobbyBottomBar();
        this.sceneLayer.addChild(this.userInfo);

        this.homeLayer = new HomeLayer();
        this.sceneLayer.addChild(this.homeLayer);

        this.gameLayer = new GameLayer();
        this.sceneLayer.addChild(this.gameLayer);

        this.lobbyLayer = new LobbyLayer();
        this.sceneLayer.addChild(this.lobbyLayer);

        this.miniGame = new MiniGameLayer();
        this.sceneLayer.addChild(this.miniGame);
        
        //this.startHome();
        this.startGame();
        //this.startLobby();

        var thiz = this;
        this.topBar.backBt.addClickEventListener(function () {
            thiz.backButtonHandler();
        })
    },

    startHome : function () {
        homeLocation = 1;
        this.homeLayer.visible = true;
        this.gameLayer.visible = true;
        this.lobbyLayer.visible = false;
        this.userInfo.visible = false;
    },

    startGame : function () {
        homeLocation = 2;
        this.homeLayer.visible = false;
        this.gameLayer.visible = true;
        this.lobbyLayer.visible = false;
        this.userInfo.visible = true;
    },

    startLobby : function(){
        homeLocation = 3;
        this.homeLayer.visible = false;
        this.gameLayer.visible = false;
        this.lobbyLayer.visible = true;
        this.userInfo.visible = true;
        if(arguments.length == 1){
            this.lobbyLayer.startGame(arguments[0]);
        }
        else{
            this.lobbyLayer.startGame(-1);
        }
    },

    backButtonHandler : function () {
        if(homeLocation == 1){
            //exit app
        }
        else if(homeLocation == 2){
            //logout
            //to home
        }
        else if(homeLocation == 3){
            //to game
            this.startGame();
        }
    },

    startGameWithAnimation : function () {
        this.startGame();
    },
});