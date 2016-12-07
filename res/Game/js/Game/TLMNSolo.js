/**
 * Created by anhvt on 12/1/2016.
 */

var TLMNSolo = TienLen.extend({
    ctor : function () {
        this._super();
        this._controller.isSolo = true;
    },
    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        this.sceneLayer.addChild(playerMe, 1);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width / 2, 650.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player1, 1);
        player1.chatView.setAnchorPoint(cc.p(0.0,1.0));

        this.playerView = [playerMe, player1];
    }
});