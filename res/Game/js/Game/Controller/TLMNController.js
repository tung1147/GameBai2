/**
 * Created by QuyetNguyen on 11/23/2016.
 */

var TLMNGameController = GameController.extend({
    ctor : function (view) {
        this._super();
        this.initWithView(view);
    },
    getMaxSlot : function () {
        if(this.isSolo){
            return 2;
        }
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
        if (content.c == "1") { //startGame
            this.onJoinGame(content.p);
        }
        else if (content.c == "13") {//reconnect
            this.onReconnect(content.p);
        }
        else if (content.c == "10") {//update status
            this.onGameStatus(content.p["1"]);
        }
        else if (content.c == "3") { //start game
            this.onStartGame(content.p);
        }
        else if (content.c == "6") { //new turn
            this._view.removeCardOnTable();
            this.onUpdateTurn(content.p.u, this.timeTurn, true);
        }
        else if (content.c == "7") { //next turn
            this.onUpdateTurn(content.p.u, this.timeTurn, false);
        }
        else if (content.c == "5") { //bo luot
            var user = content.p.u;
            this._view.onBoLuot(user);
        }
        else if (content.c == "4") { //danh bai thanh cong
            this.onDanhBaiThanhCong(content.p);
        }
        else if (content.c == "8") { //ket qua
            this.onGameFinished(content.p);
        }
        else if (content.c == "12") { //chat chem
            this._view.onChatChem(content.p);
        }
    },

    onJoinGame : function (params) {
        this.updateGameInfo(params);
    },

    onReconnect: function (params) {
        this.updateGameInfo(params["1"]);

        var status = params["1"]["1"];
        if (status == 2) { //playing
            //add card me
            var cardData = params["3"];
            var cards = [];
            for (var i = 0; i < cardData.length; i++) {
                cards.push(this.getCardWithId(cardData[i]));
            }
            this._view.setCardMe(cards);
        }
        else {
            this._view.removeCardList();
            this._view.onUpdateTurn(".", 0, 0);
        }
    },

    updateGameInfo : function (params) {
        this.timeTurn = params["7"];

        var gameStatus = params["1"];
        this.onGameStatus(gameStatus);

        /* update card on table*/
        if (gameStatus == 2) { //playing
            var cardData = params["12"]["3"];
            if (cardData.length > 0) {
                var cards = [];
                for (var i = 0; i < cardData.length; i++) {
                    cards.push(this.getCardWithId(cardData[i]));
                }
                this._view.setCardOnTable(cards);
            }

            /* update turn */
            var username = params["12"]["u"];
            var currentTime = params["12"]["2"] / 1000;
            var newTurn = (cardData.length > 0) ? true : false;
            this.onUpdateTurn(username, currentTime, newTurn);
        }
    },

    onStartGame: function (params) {
        var cards = [];
        var cardData = params["1"];
        for (var i = 0; i < cardData.length; i++) {
            cards.push(this.getCardWithId(cardData[i]));
        }
        this._view.dealCards(cards);
    },

    onUpdateTurn : function (username, currentTime, newTurn) {
        if(newTurn){
            this._view.removeCardOnTable();
        }

        if (PlayerMe.username == username) {
            this._view.setDanhBaiBtVisible(true);
            if (newTurn) {
                this._view.setBoLuotBtVisible(false);
            }
            else{
                this._view.setBoLuotBtVisible(true);
            }
        }
        else {
            this._view.setDanhBaiBtVisible(false);
            this._view.setBoLuotBtVisible(false);
        }

        this._view.onUpdateTurn(username, currentTime, this.timeTurn);
    },

    onGameStatus: function (status) {
        this.gameStatus = status;
        if (status == 0) { //waiting
            this._view.setDanhBaiBtVisible(false);
            this._view.setXepBaiBtVisible(false);
            this._view.setBoLuotBtVisible(false);
            this._view.setStartBtVisible(false);
            this._view.removeCardList();
            this._view.removeCardOnTable();
        }
        else if (status == 1) { //ready
            this._view.setDanhBaiBtVisible(false);
            this._view.setXepBaiBtVisible(false);
            this._view.setBoLuotBtVisible(false);
            this._view.setStartBtVisible(false);
            this._view.removeCardList();
            this._view.removeCardOnTable();

            /* fix, dungtv sida */
            this.isSpectator = false;
            if (this.isOwnerMe) {
                this._view.setStartBtVisible(true);
            }
        }
        else if (status == 2) { //play
            if(this.isSpectator){
                this._view.showErrorMessage("Bàn đang chơi, vui lòng chờ", this._view);
            }
            else{
                this._view.setXepBaiBtVisible(true);
                this._view.setStartBtVisible(false);
            }
        }
        else if (status == 3) { //finish
            if(this.isSpectator){
                this._view.showErrorMessage("Bàn đang chơi, vui lòng chờ", this._view);
            }
            else{
                this._view.setDanhBaiBtVisible(false);
                this._view.setXepBaiBtVisible(false);
                this._view.setBoLuotBtVisible(false);
                this._view.setStartBtVisible(false);
                this._view.removeCardList();
                this._view.removeCardOnTable();
            }
        }
    },

    onDanhBaiThanhCong: function (param) {
        var username = param.u;
        var cards = [];
        var cardData = param["2"];
        for (var i = 0; i < cardData.length; i++) {
            cards.push(this.getCardWithId(cardData[i]));
        }

        if(PlayerMe.username == username){
            this._view.onDanhbaiMe(username, cards);
        }
        else{
            this._view.onDanhbaiOther(username, cards);
        }
    },

    onGameFinished: function (params) {
        this._view.onUpdateTurn(".",0,0);

        var winPlayer = params.u;
        var playerData = params["3"];
        var player = [];
        for (var i = 0; i < playerData.length; i++) {
            var username = playerData[i].u;
            var gold = parseInt(playerData[i]["3"]);
            var title = null;

            var cardListData = playerData[i]["2"];
            var cardList = [];
            for(var j=0;j<cardListData.length;j++){
                cardList.push(this.getCardWithId(cardListData[j]));
            }

            if(username == winPlayer){
                title = "Thắng";
            }
            else{
                title = "Thua " + cardList.length + " lá";
            }

            player[i] = {
                username : username,
                title : title,
                gold : gold,
                cardList : cardList
            };

            //update gold
            this._view.updateGold(username, gold);
        }

        this._view.showFinishedDialog(player);
    },
    updateOwner : function (username) {
       this._super(username);
       if (this.gameStatus == 1 && this.isOwnerMe) {
            this._view.setStartBtVisible(true);
       }
    },
    /* request */
    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },
    sendBoluotRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("5", null);
    },

    sendDanhBai: function (cards) {
        if (cards.length > 0) {
            var cardId = [];
            for (var i = 0; i < cards.length; i++) {
                cardId.push(this.getCardIdWithRank(cards[i].rank, cards[i].suit));
            }
            var param = {
                2: cardId
            };
            SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("4", param);
        }
        else {
            this._view.showErrorMessage("Bạn phải chọn quân bài đánh");
        }
    }
});