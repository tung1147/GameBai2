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

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width / 2 - 220, 660.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player2, 1);

        var player3 = new GamePlayer();
        player3.setPosition(cc.winSize.width / 2 + 220, 660.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player3, 1);

        var player4 = new GamePlayer();
        player4.setPosition(120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player4, 1);

        this.playerView = [playerMe, player1, player2, player3,player4];
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