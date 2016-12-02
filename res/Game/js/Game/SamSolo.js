/**
 * Created by anhvt on 12/1/2016.
 */

var SamSolo = Sam.extend({
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
        player1.setPosition(cc.winSize.width / 2, 660.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player1, 1);

        this.playerView = [playerMe, player1];
    }
});