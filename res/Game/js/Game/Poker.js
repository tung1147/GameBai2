/**
 * Created by VGA10 on 1/19/2017.
 */
var Poker = IGameScene.extend({
    ctor: function () {
        this._super();
        this.initPlayer();
        this.initButton();
    },

    initPlayer: function () {
// var playerMe = new GamePlayerMe();
        // playerMe.setPosition(150, 50.0);
        // this.sceneLayer.addChild(playerMe, 1);
        var player0 = new GamePlayer();
        player0.setPosition(cc.winSize.width / 2, 50);
        this.sceneLayer.addChild(player0, 1);
        player0.chatView.setAnchorPoint(cc.p(1.0, 1.0));

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player1, 1);
        player1.chatView.setAnchorPoint(cc.p(1.0, 0.0));
        player1.chatView.y += 20;

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width / 2, 650.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player2, 1);
        player2.chatView.setAnchorPoint(cc.p(1.0, 1.0));

        var player3 = new GamePlayer();
        player3.setPosition(120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player3, 1);
        player3.chatView.setAnchorPoint(cc.p(0.0, 0.0));
        player3.chatView.y += 20;

        this.playerView = [player0, player1, player2, player3, player0, player0, player0, player0, player0];
    },

    initController: function () {
        this._controller = new PokerController(this);
    },

    initButton : function () {
        var thiz = this;
        var startBt = new ccui.Button("game-startBt.png","","",ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(cc.winSize.width - 110, 50);
        this.sceneLayer.addChild(startBt);

        startBt.addClickEventListener(function () {
            thiz._controller.sendStartRequest();
        });
    }
});