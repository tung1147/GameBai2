/**
 * Created by Quyet Nguyen on 7/25/2016.
 */
var Sam = TienLen.extend({
    ctor: function () {
        this._super();
        var baosamBt = ccui.Button("game-baosamBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        baosamBt.setPosition(cc.winSize.width - 910, 50);
        this.sceneLayer.addChild(baosamBt);
        baosamBt.visible = false;
        this.baosamBt = baosamBt;

        var huysamBt = ccui.Button("game-huysamBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
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
    onSFSExtension: function (messageType, content) {
        this._super(messageType, content);
        cc.log(JSON.stringify(content));
        if (content.c == "51") {
            this.onUserCallSam(content.p.u);
        }
        else if (content.c == "52") {
            this.onUserFoldSam(content.p.u);
        }
        else if (content.c == "53") {
            this.onChangeSamState(content.p["1"],content.p["2"]);
        }
        else if (content.c == "54") {
            this.onNotifiOne(content.p.u);
        }
    },
    onUserCallSam: function (username) {
        var slot = this.getSlotByUsername(username);
        var msg = slot.isMe ? "Bạn" : ("Người chơi " + username);
        msg += " đã báo sâm thành công";
        MessageNode.getInstance().show(msg);
    },
    onUserFoldSam: function (username) {
        var slot = this.getSlotByUsername(username);
        var msg = slot.isMe ? "Bạn" : ("Người chơi " + username);
        msg+= " đã hủy sâm thành công";
        MessageNode.getInstance().show(msg);
    },
    onChangeSamState: function (state,timeRemaining) {
        if (state == 1){ // cho phep bao sam
            this.baosamBt.visible = this.huysamBt.visible = true;
            this.progressTimerBaoSam.visible = true;
            this.playerView[0].setProgressPercentage(timeRemaining/10000.0);
        }
        else if (state == 2){
            this.baosamBt.visible = this.huysamBt.visible = false;
        }
    },
    onNotifiOne: function (username) {
        var slot = this.getSlotByUsername(username);
        if (!slot.isMe){
            MessageNode.getInstance().show("Người chơi " + username + " chỉ còn lại 1 lá");
        }
    },
    sendBaoSamRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("51", {});
    },
    sendHuySamRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("52",{});
    }
});