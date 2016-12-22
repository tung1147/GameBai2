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
                // setTimeout(function () {
                //     thiz.onRollResult(content.p.data);
                // }, 500);
                this.onRollResult(content.p.data);
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
        // var rollingInterval = setInterval(function () {
        //     thiz._view.setRollCard(index, false);
        //     index++;
        //     if (index >= 5) {
        //         thiz.setRolling(false);
        //         thiz._view.activateReward(result, rewardCardRank);
        //         thiz._view.setRewardCards(rewardIndexesArray);
        //         if (thiz.changeAmount) {
        //             thiz._view.onChangeAssets(thiz.goldAfter, thiz.changeAmount);
        //             thiz.goldAfter = thiz.changeAmount = null;
        //         }
        //         if (thiz.autoRoll)
        //             setTimeout(function () {
        //                 thiz.sendRollRequest(thiz.lastBetType);
        //             }, 1000);
        //
        //         clearInterval(rollingInterval);
        //     }
        // }, 500);
        // for (var i = 0;i<5;i++)
        //     this._view.setRollCard(i,false);
        //this.setRolling(false);
        this._view.activateReward(result, rewardCardRank);
        this._view.setRewardCards(rewardIndexesArray);
        if (this.changeAmount) {
            this._view.onChangeAssets(this.goldAfter, this.changeAmount);
            this.goldAfter = this.changeAmount = null;
        }
        if (this.autoRoll)
            this.sendRollRequest(this.lastBetType);
    },

    sendJoinGame: function () {
        cc.log("lelelelele");
        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo.ip, PlayerMe.miniGameInfo.port, "355");
    },

    sendRollRequest: function (betType) {
        cc.log("What the actual fuck ? ");
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "351", {1: betType});
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