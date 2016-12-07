/**
 * Created by anhvt on 12/5/2016.
 */
var CaoThapController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        /*
         Trang thai game
         0 = chua bat dau
         1 = con luot
         2 = het luot
         */
        this.turnState = 0;
        this.result = -1;
        this.rolling = false;
        this.onCooldown = false;
    },

    onSFSExtension: function (messageType, content) {
        this._super(messageType, content);
        var thiz = this;
        var interval = null;
        switch (content.c) {
            case "407": // nhan thong tin la dau tien
                interval = setInterval(function () {
                    if (!thiz.onCooldown){
                        thiz.onInitGame(content.p.data);
                        clearInterval(interval);
                    }
                },100);
                break;

            case "408": // nhan ket qua cao thap
                interval = setInterval(function () {
                    if (!thiz.onCooldown){
                        thiz.onPredictResult(content.p.data);
                        clearInterval(interval);
                    }
                },100);
                break;
        }
    },
    onPredictResult: function (data) {
        var resultCard = data["8"];
        var winType = data["9"]; // win(0), same(1), lose(2), bigwin(3)
        var bankValue = data["3"];
        switch (winType) {
            case 0: // win
            case 1:
                this._view.setTipString("Quân tiếp theo cao hơn hay thấp hơn?");
                this.turnState = 1;
                break;
            case 2:
                this._view.setTipString("Bạn chọn sai, chúc bạn may mắn lần sau!");
                this.turnState = 2;
                break;
            case 3:
                this._view.setTipString("Nổ hũ rồi, nhận thưởng xóa game thôi");
                this.turnState = 1;
                break;
        }
        this._view.showResultCard(resultCard);
        this._view.setLuotMoiBtVisible(true);
        this._view.setBankValue(bankValue);
        this.turnState = data["7"] == 1 ? 1 : 2;
        this.result = data["7"] == 1 ? resultCard : -1;
        this.setRolling(false);
    },

    onInitGame: function (data) {
        var gameId = data["1"];
        var firstCard = data["2"];
        var bankValue = data["3"];
        var highReward = data["4"];
        var lowReward = data["5"];
        var timeRemaining = data["6"];
        var lastTurn = data["7"];

        this.turnState = 1;
        this.result = firstCard;
        this._view.setBankValue(bankValue);
        this._view.setReward(lowReward, highReward);
        this._view.showResultCard(firstCard);
        this._view.setGameId(gameId);
        this._view.pushKing((firstCard % 13) == 10);
        this._view.setTipString("Quân tiếp theo cao hơn hay thấp hơn?");
        this.setRolling(false);
    },

    sendInitGame: function (betType) {
        if (!this.checkRequestRolling()) return;
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "407", {1: betType});
    },

    sendHighPredict: function () {
        if (!this.checkRequestRolling()) return;
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "408", {1: 1});
        this.setRolling(true);
        this._view.addHistory(this.result);
    },

    sendLowPredict: function () {
        if (!this.checkRequestRolling()) return;
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "408", {1: 2});
        this.setRolling(true);
        this._view.addHistory(this.result);
    },

    checkRequestRolling: function () {
        if (this.turnState != 2 && this.rolling != true) {
            this.rolling = true;
            this.onCooldown = true;
            var thiz = this;
            setTimeout(function () {
                thiz.onCooldown = false;
            },1000);
            this.setRolling(true);
            return true;
        }
        return false;
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
        this._view.setRolling(isRolling);
    },

    sendLuotMoiRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "409", null);
        this._view.setTipString("");
        this.turnState = 0;
        this._view.clearTurn();
    },

    sendJoinGame : function () {
        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo.ip, 8888, "404");
    },

    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "405", null);
    },

    sendGetTopRequest : function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "402", null);
    },

    sendGetExplosionHistory : function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1,"403",null);
    },

    sendGetUserHistory : function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1,"401",null);
    }
});