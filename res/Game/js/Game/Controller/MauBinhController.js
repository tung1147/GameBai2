/**
 * Created by VGA10 on 1/11/2017.
 */
var maubinh_wintypes = maubinh_wintypes ||
    ["", "Sập ba chi", "Binh lủng", "3 sảnh", "3 thùng", "Lục phé bôn", "5 đôi 1 sám", "12 lá đồng màu", "13 lá đồng màu", "Sảnh rồng", "Rồng cuốn"];

var maubinh_chitypes = maubinh_chitypes ||
    ["", "Mậu thầu", "Đôi", "Thú", "Xám", "Sảnh", "Thùng", "Cù lũ", "Tứ quý", "Thùng phá sảnh", "Sảnh rồng"];

var MauBinhController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("3", this._onStartGameHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._onGameStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("451", this._onXepXongHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("452", this._onXepLaiHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("8", this._onGameFinishHandler, this);

    },
    _onStartGameHandler: function (cmd, content) {
        this.onStartGame(content.p);
    },

    _onGameStatusHandler: function (cmd, content) {
        this.onGameStatus(content.p);
    },

    _onXepXongHandler: function (cmd, content) {
        this.onXepXong(content.p);
    },

    _onXepLaiHandler: function (cmd, content) {
        this.onXepLai(content.p);
    },

    _onGameFinishHandler: function (cmd, content) {
        this.onGameFinish(content.p);
    },

    onStartGame: function (param) {
        this._view.performDealCards(param["1"], true);
    },

    onGameStatus: function (param) {
        this._view.hideAllButton();
        cc.log(param);
        switch (param["1"]) {
            case 1:
                this._view.setStartBtVisible(this.isOwnerMe);
                this._view.cleanBoard();
                break;

            case 2:
                this._view.setIngameButtonVisible(true);
                this._view.showTimeRemaining(param["2"]);
                break;

            case 3:
                // xep xong
                this._view.showTimeRemaining(0);
                this._view.onTimeOut();
                break;
        }
        this._view.setArrangeEnable(param["1"] == 2);
    },

    onXepXong: function (param) {
        var user = param["u"];
        this._view.onUserXepBaiStatus(user, true);

        if (user == PlayerMe.username) {
            var thangTrangMode = param["2"];
            if (thangTrangMode > 0) {
                this._view.performAnnounce(user, maubinh_wintypes[thangTrangMode]);
            }
            this._view.setArrangeEnable(false);
        }
    },

    onReconnect: function (param) {
        this._super(param);
        this._view.performChangeRewardFund(param["1"]["11"]["2"]);
        this._view.performDealCards(param["3"]);
        this.onGameStatus({1: param["1"]["1"], 2: Math.floor(param["1"]["13"] / 1000)});

        if (param["1"]["1"] == 3 && param["1"]["14"]) {
            // ket qua
            this.onGameFinish(param["1"]["14"], true);
        }
    },

    onXepLai: function (param) {
        var user = param["u"];
        this._view.onUserXepBaiStatus(user, false);
        this._view.setArrangeEnable(true);
    },

    onGameFinish: function (param, isReconnect) {
        var currentPhaseId = param["2"]["1"];
        var currentPhaseTime = Math.floor(param["2"]["2"]);
        var subPhases = param["1"];
        var delayCount = 0;

        for (var i = 0; i < subPhases.length; i++) {
            // sp = subPhase
            var sp = subPhases[i];
            var spId = sp["1"];
            if (isReconnect && spId < currentPhaseId) {
            }
            else if (isReconnect && spId == currentPhaseId) {
                delayCount += currentPhaseTime;
            } else {
                delayCount += sp["2"];
            }

            var matches = sp["3"];
            for (var j = 0; j < matches.length; j++) {
                var matchData = matches[j];
                var username = matchData["u"];
                var winType = matchData["0"];
                var exMoney = matchData["3"];
                var cardArray = matchData["1"];
                var newMoney = matchData["4"];
                var moneyChange = matchData["5"];
                var soChiWin = matchData["6"];
                var wholeCards = matchData["8"];
                var rankChi = matchData["10"];
                switch (spId) {
                    case 1 : // so binh lung, thang trang
                        this._view.performRevealCard(username, cardArray, winType, exMoney, delayCount);
                        break;
                    case 2: // so chi
                    case 3:
                    case 4:
                        this._view.performSoChi(username, spId - 2, rankChi, exMoney, cardArray, delayCount);
                        break;
                    case 5 : // thang trang 2
                        this._view.performSummaryChange(username, winType, exMoney, delayCount);
                        break;
                    case 6 : // hien thi bang ket qua
                        this._view.addResultEntry(username, winType, soChiWin, wholeCards, newMoney, moneyChange);
                        break;
                }
            }
        }

        delayCount += 2000;
        this._view.performShowResult(delayCount);
        this._view.cleanBoard(delayCount += 2000);
    },

    sendXepBaiXong: function (cards) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("451", {1: cards});
    },

    getMaxSlot: function () {
        return 4;
    },

    onJoinRoom: function (param) {
        this._super(param);

        var huThuongValue = param["11"]["2"];
        this._view.performChangeRewardFund(huThuongValue);
    },

    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },

    sendXepBaiLai: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("452", null);
    }
});