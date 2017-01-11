/**
 * Created by Quyet Nguyen on 7/25/2016.
 */



var MauBinh = IGameScene.extend({
    ctor : function () {
        this._super();
        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        table_bg.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(table_bg);

        this.initPlayer();
        this.initButton();

    },

    initPlayer : function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150,50);
        this.sceneLayer.addChild(playerMe,1);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120/cc.winSize.screenScale,360);
        this.sceneLayer.addChild(player1,1);

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width/2,650);
        this.sceneLayer.addChild(player2,1);

        var player3 = new GamePlayer();
        player3.setPosition(120 * cc.winSize.screenScale,360);
        this.sceneLayer.addChild(player3,1);

        this.playerView = [playerMe,player1,player2,player3];
    },

    initButton : function () {
        var xepbaiBt = new ccui.Button("game-xepbaiBt.png","","",ccui.Widget.PLIST_TEXTURE);
        xepbaiBt.setPosition(cc.winSize.width - 110,50);
        this.xepbaiBt = xepbaiBt;
        this.sceneLayer.addChild(xepbaiBt);

        var xongBt = new ccui.Button("game-xongBt.png","","",ccui.Widget.PLIST_TEXTURE);
        xongBt.setPosition(cc.winSize.width - 310,50);
        this.xongBt = xongBt;
        this.sceneLayer.addChild(xongBt);

        var startBt = new ccui.Button("game-startBt.png","","",ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(xepbaiBt.getPosition());
        this.startBt = startBt;
        this.sceneLayer.addChild(startBt);

        this.setIngameButtonVisible(false);
        this.setStartButtonVisible(false);
    },

    initController : function () {
        this._controller = new MauBinhController(this);
    },

    setIngameButtonVisible : function (visible) {
        this.xepbaiBt.visible = visible;
        this.xongBt.visible = visible;
    },

    setStartButtonVisible : function (visible) {
        this.startBt.visible = visible;
    }
});