/**
 * Created by QuyetNguyen on 11/23/2016.
 */

/*PHOM*/
s_sfs_error_msg[61] = "Không thể ăn bài";
s_sfs_error_msg[62] = "Không thể hạ bài";
s_sfs_error_msg[63] = "Không thể gửi bài";
s_sfs_error_msg[64] = "Không thể bốc bài";

var PhomController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        this.timeTurn = 15;
    },

    getMaxSlot: function () {
        return 4;
    },

    getCardWithId: function (cardId) {
        var rankCard = (cardId % 13) + 3;
        if (rankCard > 13) {
            rankCard -= 13;
        }
        return {
            rank: rankCard,
            suit: Math.floor(cardId / 13)
        };
    },

    getCardIdWithRank: function (rank, suit) {
        var rankCard = rank - 3;
        if (rankCard < 0) {
            rankCard = 13 + rankCard;
        }
        return ((suit * 13) + rankCard);
    },

    onSFSExtension: function (messageType, content) {
        this._super(messageType, content);
        cc.log("mysfs : " + JSON.stringify(content));
        if (content.c == "10") {//update status
            this.onGameStatus(content.p["1"]);
        }
        else if (content.c == "3") { //start game
            this.onStartGame(content.p);
        }
        else if (content.c == "4") { // danh bai thanh cong
            this.onDanhBaiThanhCong(content.p);
        }
        else if (content.c == "7") { // change turn
            this.onTurnChanged(content.p);
        }
        else if (content.c == "103") { // an bai`
            this.onStealCard(content.p);
        }
        else if (content.c == "104") { // can bang bai
            this.onBalanceCard(content.p);
        }
        else if (content.c == "46") { // cong, tru tien an
            this.onStealAssetUpdate(content.p);
        }
        else if (content.c == "106") {// gui bai
            this.onDelegateCard(content.p);
        }
        else if (content.c == "108") {// ha bai
            this.onHaBai(content.p);
        }
        else if (content.c == "8") { // ket thuc van choi
            this.onGameFinished(content.p);
        }
        else if (content.c == "109") { // thay doi trang thai
            this.onStatusChanged(content.p);
        }
        else if (content.c == "101") { //boc bai
            this.onDrawDeck(content.p);
        }
        else if (content.c == "110") { // thong bao so bai boc con lai
            this.onUpdateDrawDeck(content.p);
        }
    },

    onGameStatus: function (param) {
        // this._view.onGameStatus(param);
        this._view.hideAllButton();
        this._view.setDeckVisible(false);
        switch (param) {
            case 0: // waiting
                this._view.removeAllCards();
                break;
            case 1: // ready
                this._view.removeAllCards();
                this._view.setStartBtVisible(this.isOwnerMe);
                break;
            case 2: // playing
                this._view.setDeckVisible(true);
                this._view.setXepBaiBtVisible(true);
                break;
            case 3: // finish
                break;
        }
    },

    onJoinRoom : function (params) {
        this._super(params);
        this.onGameStatus(params["1"]);
        this.timeTurn = params["7"];
    },

    onReconnect: function (param) {
        this._super(param);
        //this._view.onReconnect(param);
        var userData = param["1"]["5"];

        //update turn
        var turnInfo = param["1"]["12"];
        this._view.showTimeRemainUser(turnInfo["u"], turnInfo["2"] / 1000, 15);
        this._view.performDrawDeckUpdate(turnInfo["3"]);

        // on-hand cards
        this._view.setCardList(param["3"]);

        //surf through userData
        for (var i = 0; i < userData.length; i++) {
            var data = userData[i];
            var username = data["u"];

            // update my status
            if (username == PlayerMe.username)
                this.onTurnChanged({s: userData[i]["s"], u: username});

            // trash cards
            if (data["10"])
                this._view.setTrashCardList(data["10"], username);

            // stolen cards
            if (data["12"]) {
                if (username == PlayerMe.username)
                    this._view.setStolenCardsMe(data["12"]);
                else
                    this._view.setStolenCardsOther(data["12"], username);
            }
        }

        // grouped card
        this._view.processGroupedCard(param["4"]);
    },

    onStartGame: function (param) {
        //this._view.onStartGame(param);
        var cards = [];
        var cardData = param["1"];
        var groupCardData = param["2"];
        for (var i = 0; i < cardData.length; i++)
            cards.push(this.getCardWithId(cardData[i]));
        this._view.performDealCards(cards, groupCardData);
    },

    onDanhBaiThanhCong: function (param) {
        //this._view.onDanhBaiThanhCong(param);
        var username = param.u;
        var card = this.getCardWithId(param["1"]);
        if (PlayerMe.username == username)
            this._view.performDanhBaiMe(card);
        else
            this._view.performDanhBaiOther(username, card);
    },

    onTurnChanged: function (param) {
        //this._view.onTurnChanged(param);
        var username = param.u;
        this._view.showTimeRemainUser(username, this.timeTurn);
        this._view.hideAllButton();
        this._view.setXepBaiBtVisible(true);

        if (!param.s)
            return; // not my turn

        switch (param.s) {
            case 0:
                this._view.setXepBaiBtVisible(false);
                break;
            case 1:
                break;
            case 2: // luot boc bai
                this._view.setDrawBtVisible(true);
                break;
            case 3: // co the an bai
                this._view.setDrawBtVisible(true);
                this._view.setAnBaiBtVisible(true);
                break;
            case 4: // danh bai
                this._view.setDanhBaiBtVisible(true);
                break;
            case 5: // co luot ha bai
                this._view.setHaBaiBtVisible(true);
                break;
            case 6: // co luot gui bai
                this._view.setGuiBaiBtVisible(true);
                break;
            case 7: // u`
                this._view.setUBtVisible(true);
                this._view.setDanhBaiBtVisible(true);
                break;
            case 8:
                this._view.setXepBaiBtVisible(false);
                break;
        }
        if (param["3"] && param["3"].length > 0)
            this._view.suggestCards(param["3"]);
        if (param["4"] && param["4"].length > 0)
            this._view.suggestCards(param["4"]);
    },

    onStealCard: function (param) {
        var stealer = param["u1"];
        var stolenUser = param["u2"];
        var stolenCard = param["1"];
        var groupedCards = param["2"];

        this._view.performStealCard(stealer, stolenUser, stolenCard, groupedCards);
    },

    onBalanceCard: function (param) {
        //this._view.onBalanceCard(param);
        var cardId = param["1"];
        var fromUser = param["u1"];
        var toUser = param["u2"];
        this._view.performBalanceCard(fromUser, toUser, cardId);
    },

    onStealAssetUpdate: function (param) {
        var stealer = param["u1"];
        var stolenUser = param["u2"];
        var stealerAmount = param["s1"];
        var stolenAmount = param["s2"];
        var stealerBalance = param["m1"];
        var stolenBalance = param["m2"];

        this._view.performAssetChange(stealer,stealerAmount,stealerBalance);
        this._view.performAssetChange(stolenUser,-stolenAmount,stolenBalance);
    },

    onDelegateCard: function (param) {
        var fromUser = param["u"];
        var delegateData = param["1"];
        for (var i = 0; i < delegateData.length; i++) {
            var delegateInfo = delegateData[i];
            var sender = delegateInfo["u1"];
            var receiver = delegateInfo["u2"];
            var cards = delegateInfo["4"];
            var groupedCardAfter = [];
            for (var j = 0; j < delegateInfo["5"].length; j++)
                groupedCardAfter = groupedCardAfter.concat(delegateInfo["5"][j]);

            this._view.performDelegateCards(sender, receiver, cards, groupedCardAfter);
        }
    },

    onHaBai: function (param) {
        var username = param["u"];
        var groupedCards = param["11"];
        var stolenCards = param["12"];
        if (username == PlayerMe.username)
            this._view.performHaBaiMe(groupedCards);
        else
            this._view.performHaBaiOther(username, groupedCards, stolenCards);
    },

    onGameFinished: function (param) {
        //this._view.onGameFinished(param);
        this._view.setUBtVisible(false); // some case u` button still visible
        this._view.showTimeRemainUser(null); // stop all timer
        var userData = param["3"];
        var resultData = [];
        var resultStringArray = ["Bét ", "Ù Khan", "Ù Tròn", "Ù Thường", "Ù Đền",
            "Nhất ", "Nhì ", "Ba ", "Móm"];
        for (var i = 0; i < userData.length; i++) {
            var resultEntry = {};
            resultEntry.username = userData[i].u;
            resultEntry.gold = parseInt(userData[i]["4"]);
            resultEntry.cardList = userData[i]["2"];
            resultEntry.resultString = resultStringArray[userData[i]["5"]];
            if ([0, 5, 6, 7].indexOf(userData[i]["5"]) != -1) {
                // them thong tin diem
                if (userData[i]["7"])
                    resultEntry.resultString += userData[i]["7"] + " điểm";
            }
            this._view.updateGold(userData[i].u, userData[i]["3"]);
            resultData.push(resultEntry);
        }

        this._view.showResultDialog(resultData);
    },

    onStatusChanged: function (param) {

    },

    onDrawDeck: function (param) {
        var username = param.u;
        var cardId = param["1"];
        var groupedCard = param["2"];
        if (username == PlayerMe.username)
            this._view.performDrawCardMe(cardId, groupedCard);
        else
            this._view.performDrawCardOther(username);
    },

    onUpdateDrawDeck: function (param) {
        this._view.performDrawDeckUpdate(param["1"]);
    },

    sendURequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("109", null);
    },

    sendAnBaiRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("103", null);
    },

    sendGuiBaiRequest: function (cards) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("106", {1: cards});
    },

    sendHaBaiRequest: function (cards) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("108", {1: cards});
    },

    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },

    sendDanhBai: function (cardId) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("4", {1: cardId});
    },
    sendDrawRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("101", null);
    }
});