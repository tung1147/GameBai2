/**
 * Created by VGA10 on 12/6/2016.
 */
var MiniPokerController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        this.rolling = false;
        this.autoRoll = false;
        this.lastBetType = 1;
    },

    onSFSExtension: function (messageType, content) {
        this._super(messageType, content);
        var thiz = this;
        switch (content.c) {
            case "351": // ket qua luot roll
                setTimeout(function () {
                    thiz.onRollResult(content.p.data);
                },1000);
                break;
        }
    },

    onChangeAssets: function (gold, changeAmount) {
        if (changeAmount <= 0)
            this._view.onChangeAssets(gold, changeAmount);
        else {
            this.goldAfter = gold;
            this.changeAmount = changeAmount;
        }
    },

    onRollResult: function (data) {
        var gameId = data["1"];
        var cardArray = data["2"];
        var result = data["3"];
        var rewardIndexes = data["4"];
        var rewardCardRank = data["5"];
        var rewardIndexesArray = [];
        for (var i = 0; i < 5; i++)
            rewardIndexesArray[i] = (rewardIndexes >> i) & 1;
        this._view.setCardArray(cardArray);
        var thiz = this;
        var index = 0;
        this._view.activateReward(result, rewardCardRank);
        if (result == 0){
            this._view.showJackpot();
        }
        this._view.setRewardCards(rewardIndexesArray);
        if (this.changeAmount) {
            this._view.onChangeAssets(this.goldAfter, this.changeAmount);
            this.goldAfter = this.changeAmount = null;
        }
        this._view.setQuayBtEnable(true);
        if (this.autoRoll)
            this.sendRollRequest(this.lastBetType);
    },

    sendJoinGame: function () {
        cc.log("lelelelele");
        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo.ip, PlayerMe.miniGameInfo.port, "355");
    },

    sendRollRequest: function (betType) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "351", {1: betType});
        this._view.setQuayBtEnable(false);
        this.lastBetType = betType;
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
        this._view.setFlashing(isRolling);
        this._view.setRolling(isRolling);
        if (isRolling) {
            this._view.setRewardCards([0, 0, 0, 0, 0]);
            for (var i = 0; i < 5; i++)
                this._view.setRollCard(i, true);
        }
    },

    setAutoRoll: function (isAuto) {
        this.autoRoll = isAuto;
    },

    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "356", null);
    },

    sendGetTopRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "353", null);
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "354", null);
    },

    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "352", null);
    }
});