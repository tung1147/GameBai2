/**
 * Created by VGA10 on 12/8/2016.
 * Rat la dep trai
 */

var VideoPokerController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        this.turnState = 0;
        this.holdingList = [0, 0, 0, 0, 0];
    },

    onSFSExtension: function (messageType, content) {
        this._super(messageType, content);
        var thiz = this;
        switch (content.c) {
            case "252": // ket qua luot dau tien
                this.onFirstRollResult(content.p.data);
                break;

            case "253":
                this.onNextRollResult(content.p.data);
                break;

            case "254":
                this.onRequestDoubleResult(content.p.data);
                break;

            case "256":
                this.onDoubleResult(content.p.data);
                break;
        }
    },

    onFirstRollResult: function (param) {
        var gameId = param["1"];
        var cardArray = param["2"];
        var holdValue = param["3"]["1"];
        var resultId = param["3"]["2"];

        var holdArray = [];
        for (var i = 0; i < 5; i++)
            holdArray.push((holdValue >> i) & 1);

        this._view.setCardArray(cardArray);
        var index = 0;
        var thiz = this;
        setTimeout(function () {
            var rollingInterval = setInterval(function () {
                thiz._view.setRollCard(index, false);
                index++;
                if (index >= 5) {
                    thiz._view.setHoldArray(holdArray);
                    thiz.setTurnState(1);
                    thiz.setRolling(false);
                    thiz._view.setFlashing(false, false);
                    clearInterval(rollingInterval);
                }
            }, 500);
        }, 500);
    },

    onNextRollResult: function (param) {
        var cardArray = param["4"];
        var resultId = param["5"]["2"];
        var bankValue = param["6"];
        var rewardIndexes = param["5"]["1"];
        var rewardArray = [];
        for (var i = 0; i < 5; i++)
            rewardArray.push((rewardIndexes >> i) & 1);
        this._view.setCardArray(cardArray);
        var thiz = this;
        var index = 0;
        setTimeout(function () {
            var rollingInterval = setInterval(function () {
                while (thiz.holdingList[index] && index < 5)
                    index++;
                if (index >= 5) {
                    thiz.setRolling(false);
                    thiz._view.activateReward(resultId);
                    thiz._view.setRewardCards(rewardArray);
                    thiz._view.setHoldArray([0, 0, 0, 0, 0]);
                    thiz._view.setBankValue(bankValue);
                    thiz.setTurnState(resultId < 9 ? 2 : 0);
                    thiz._view.setFlashing(resultId < 9, resultId < 9);
                    clearInterval(rollingInterval);
                    return;
                }
                thiz._view.setRollCard(index, false);
                index++;
            }, 500);
        }, 500);
    },

    onRequestDoubleResult: function (param) {
        var firstCardId = param["1"];
        this._view.showDoubleTurn(firstCardId);
        this._view.setFlashing(true,false);
        this._view.setRewardCards([0, 0, 0, 0, 0]);
        this.setTurnState(3);
    },

    onDoubleResult: function (param) {
        var cardArray = [];
        cardArray.push(param["1"]);
        cardArray = cardArray.concat(param["4"]);
        var bankValue = param["6"];
        var choosenPos = param["3"];
        this._view.setBankValue(bankValue);
        console.log(cardArray);
        this.setTurnState(4);
        this._view.setFlashing(false,false);
        this._view.setHoldCard(choosenPos,true);
        this._view.setCardArray(cardArray);
    },

    sendRollRequest: function (betType) {
        if (!this.checkRequestRolling()) return;
        for (var i = 0; i < 5; i++)
            this._view.setRollCard(i, true);
        this._view.setHoldArray([0,0,0,0,0]);
        this._view.setFlashing(false, true);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "251", {1: betType});
    },

    sendNextRollRequest: function (holdIndexes) {
        if (!this.checkRequestRolling())
            return;
        var holdValue = 0;
        this.holdingList = holdIndexes;
        if (holdIndexes.length == 5) {
            for (var i = 0; i < 5; i++) {
                holdValue = holdValue | (holdIndexes[i] << i);
                if (!holdIndexes[i]) this._view.setRollCard(i, true);
            }
            this.setRolling(true);
            this._view.setFlashing(false, true);
            SmartfoxClient.getInstance().sendExtensionRequest(-1, "253", {1: holdValue});
        }
    },

    sendDoubleRequest: function () {
        this._view.activateReward(10); // clear reward indicator
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "254", null);
    },

    sendDoubleChoice: function (choice) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "256", {1: choice});
    },

    checkRequestRolling: function () {
        if (this.isRolling)
            return false;
        this.setRolling(this.turnState <= 1);
        return this.turnState <= 1;
    },

    sendGetRewardRequest: function () {
        if (this.turnState == 2) {
            SmartfoxClient.getInstance().sendExtensionRequest(-1, "255", null);
            this._view.setRewardCards([0, 0, 0, 0, 0]);
        }
        if (this.turnState == 2 || this.turnState == 4) {
            this.holdingList = [0, 0, 0, 0, 0];
            this.setTurnState(0);
            this._view.resetBoard();
        }
    },

    sendJoinGame: function () {
        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo.ip, 8888, "260");
    },

    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "261", null);
    },

    sendGetTopRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "258", null);
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "259", null);
    },

    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "257", null);
    },

    setRolling: function (isRolling) {
        this.isRolling = isRolling;
        this._view.setRolling(isRolling);
    },

    setTurnState: function (state) {
        this.turnState = state;
        this._view.turnState = state;
    }
});