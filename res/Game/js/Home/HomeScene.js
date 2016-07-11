/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var HomeScene = IScene.extend({
    homeLayer:null,
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this.sceneLayer.addChild(bg);

        this.homeLayer = new HomeLayer();
        this.sceneLayer.addChild(this.homeLayer);

        this.gameLayer = new GameLayer();
        this.sceneLayer.addChild(this.gameLayer);

        this.lobbyLayer = new LobbyLayer();
        this.sceneLayer.addChild(this.lobbyLayer);

        this.miniGame = new MiniGameLayer();
        this.sceneLayer.addChild(this.miniGame);

        this.topBar = new LobbyTopBar();
        this.sceneLayer.addChild(this.topBar);

        this.userInfo = new LobbyBottomBar();
        this.sceneLayer.addChild(this.userInfo);

        //this.startHome();
        this.startGame();
        //this.startLobby();
    },

    startHome : function () {
        this.homeLayer.visible = true;
        this.gameLayer.visible = true;
        this.lobbyLayer.visible = false;
        this.userInfo.visible = false;
    },

    startGame : function () {
        this.homeLayer.visible = false;
        this.gameLayer.visible = true;
        this.lobbyLayer.visible = false;
        this.userInfo.visible = true;
    },

    startGameWithAnimation : function () {
        this.startGame();
    },

    startLobby : function(){
        this.homeLayer.visible = false;
        this.gameLayer.visible = false;
        this.lobbyLayer.visible = true;
        this.userInfo.visible = true;
    }

});