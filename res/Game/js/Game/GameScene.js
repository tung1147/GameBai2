/**
 * Created by Quyet Nguyen on 7/21/2016.
 */

var GameTopBar = cc.Node.extend({
    ctor : function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.UserExitRoom, this.onUserExitRoom, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onExtensionCommand, this);

        var bg = new cc.Sprite("#home-top-bar.png");
        bg.setAnchorPoint(0.0, 1.0);
        bg.setPosition(0.0, cc.winSize.height);
        this.addChild(bg);

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
    onUserExitRoom : function (messageType, contents) {
        if(PlayerMe.SFS.userId ==  contents.u){
            var homeScene = new HomeScene();
            var gameId = s_games_chanel_id[PlayerMe.SFS.gameType]
            homeScene.startLobby(gameId);
            cc.director.replaceScene(homeScene);
        }
    },
    onExtensionCommand : function (messageType, contents) {
        
    }
});


var IGameScene = IScene.extend({
   ctor : function () {
       this._super();
       this.type = "GameScene";

       var bg = new cc.Sprite("res/game-bg.jpg");
       bg.x = cc.winSize.width/2;
       bg.y = cc.winSize.height/2;
       this.sceneLayer.addChild(bg);

       var gameTopBar = new GameTopBar();
       this.addChild(gameTopBar);
       gameTopBar.backBt.addClickEventListener(function(){
           cc.log("gameTopBar addClickEventListener");
            SmartfoxClient.getInstance().sendExtensionRequest(PlayerMe.SFS.roomId,"quitRoom", null);
       });
   }
});