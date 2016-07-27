/**
 * Created by Quyet Nguyen on 7/21/2016.
 */

var TienLen = IGameScene.extend({
    ctor : function () {
        this._super();

        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        table_bg.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(table_bg);

        this.initPlayer();
        this.initButton();
    },
    initButton : function () {
        var danhbaiBt = ccui.Button("game-danhbaiBt.png","","",ccui.Widget.PLIST_TEXTURE);
        danhbaiBt.setPosition(cc.winSize.width - 510, 50);
        this.sceneLayer.addChild(danhbaiBt);

        var xepBaiBt = ccui.Button("game-xepbaiBt.png","","",ccui.Widget.PLIST_TEXTURE);
        xepBaiBt.setPosition(cc.winSize.width - 310, danhbaiBt.y);
        this.sceneLayer.addChild(xepBaiBt);

        var boluotBt = ccui.Button("game-boluotBt.png","","",ccui.Widget.PLIST_TEXTURE);
        boluotBt.setPosition(cc.winSize.width - 110, danhbaiBt.y);
        this.sceneLayer.addChild(boluotBt);

        var startBt = ccui.Button("game-startBt.png","","",ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(boluotBt.getPosition());
        this.sceneLayer.addChild(startBt);

        danhbaiBt.visible = false;
        xepBaiBt.visible = false;
        boluotBt.visible = false;
        startBt.visible = false;
    },
    initPlayer : function (meIndex) {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        this.sceneLayer.addChild(playerMe);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player1);

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width/2, 680.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player2);

        var player3 = new GamePlayer();
        player3.setPosition(120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player3);

        this.playerView = [playerMe, player1, player2, player3];
    },
    onSFSExtension : function (messageType, content) {
        this._super(messageType, content);
    },

});