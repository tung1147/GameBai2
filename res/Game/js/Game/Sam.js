/**
 * Created by Quyet Nguyen on 7/25/2016.
 */
var Sam = TienLen.extend({
    ctor: function () {
        this._super();

        var baosamBt = new ccui.Button("game-baosamBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        baosamBt.setPosition(cc.winSize.width - 910, 50);
        this.sceneLayer.addChild(baosamBt);
        baosamBt.visible = false;
        this.baosamBt = baosamBt;

        var huysamBt = new ccui.Button("game-huysamBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        huysamBt.setPosition(cc.winSize.width - 710,50);
        this.sceneLayer.addChild(huysamBt);
        huysamBt.visible = false;
        this.huysamBt = huysamBt;

        var thiz = this;
        baosamBt.addClickEventListener(function () {
            thiz.sendBaoSamRequest();
        });

        huysamBt.addClickEventListener(function () {
            thiz.sendHuySamRequest();
        })
    },
    initController : function () {
        this._controller = new SamController(this);
    },
    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        this.sceneLayer.addChild(playerMe, 1);

        var progressTimerBaoSam = new cc.ProgressTimer(new cc.Sprite("#player-progress-3.png"));
        progressTimerBaoSam.setType(cc.ProgressTimer.TYPE_BAR);
        progressTimerBaoSam.setMidpoint(cc.p(0.0, 0.5));
        progressTimerBaoSam.setBarChangeRate(cc.p(1.0, 0.0));
        progressTimerBaoSam.setPercentage(0);
        progressTimerBaoSam.setPosition(cc.p(cc.winSize.width / 2, 220.0));
        this.progressTimerBaoSam = progressTimerBaoSam;
        this.sceneLayer.addChild(progressTimerBaoSam, 2);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player1, 1);
        player1.chatView.setAnchorPoint(cc.p(1.0,0.0));
        player1.chatView.y += 20;

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width / 2 - 220, 650.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player2, 1);
        player2.chatView.setAnchorPoint(cc.p(1.0,1.0));

        var player3 = new GamePlayer();
        player3.setPosition(cc.winSize.width / 2 + 220, 650.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player3, 1);
        player3.chatView.setAnchorPoint(cc.p(1.0,1.0));

        var player4 = new GamePlayer();
        player4.setPosition(120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player4, 1);
        player4.chatView.setAnchorPoint(cc.p(0.0,0.0));
        player4.chatView.y += 20;

        this.playerView = [playerMe, player1, player2, player3,player4];

        var cardRemaining1 = new CardRemaining();
        cardRemaining1.setPosition(30,100);
        player1.infoLayer.addChild(cardRemaining1);
        player1.cardRemaining = cardRemaining1;

        var cardRemaining2 = new CardRemaining();
        cardRemaining2.setPosition(130,100);
        player2.infoLayer.addChild(cardRemaining2);
        player2.cardRemaining = cardRemaining2;

        var cardRemaining3 = new CardRemaining();
        cardRemaining3.setPosition(130,100);
        player3.infoLayer.addChild(cardRemaining3);
        player3.cardRemaining = cardRemaining3;

        var cardRemaining4 = new CardRemaining();
        cardRemaining4.setPosition(130,100);
        player4.infoLayer.addChild(cardRemaining4);
        player4.cardRemaining = cardRemaining4;
    },

    setSamBtVisible :function(visible){
        this.baosamBt.visible = this.huysamBt.visible = visible;
    },

    alertMessage : function (msg) {
        MessageNode.getInstance().show(msg);
    },

    showBaoSamTimeRemaining: function (timeRemaining) {
        this.progressTimerBaoSam.visible = true;
        this.playerView[0].setProgressPercentage(timeRemaining/10000.0);
    },

    sendBaoSamRequest: function () {
        this._controller.sendBaoSamRequest();
    },
    sendHuySamRequest: function () {
        this._controller.sendHuySamRequest();
    }
});