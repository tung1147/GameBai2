/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

var TrashCardOnTable = cc.Node.extend({
    ctor: function () {
        this._super();
        this.cardList = []; // list of card sprites
        this.cardSize = null;
        this.cardScale = 0.5;
    },
    setCardPosition: function (x, y) {
        //this.cardPosition = cc.p(x, y);
        this.cardPosition = cc.p(0, 0);
        this.setPosition(x, y);
    },

    addCard: function (card) {
        var p = this.convertToNodeSpace(card.getPosition());
        card.setPosition(p);
        var animationDuration = 0.3;

        if (!this.cardSize)
            this.cardSize = card.getContentSize();
        var dx = this.cardSize.width * this.cardScale;
        var width = 4 * dx;
        var x = this.cardPosition.x - width / 2 + dx / 2;
        x += this.cardList.length * dx;

        var moveAction = new cc.MoveTo(animationDuration, cc.p(x, this.cardPosition.y));
        var scaleAction = new cc.ScaleTo(animationDuration, 0.5);
        card.runAction(new cc.EaseBackIn(new cc.Spawn(moveAction, scaleAction)));
        card.canTouch = false;
        this.cardList.push(card);
        this.addChild(card, 0);
        this.reOrder();
    },

    removeCardById: function (id) {
        var card = this.getCardWithId(id);

        for (var i = 0; i < this.cardList.length; i++)
            if (this.cardList[i].rank == card.rank && this.cardList[i].suit == card.suit) {
                var retVal = this.cardList[i];
                retVal.setPosition(this.convertToWorldSpace(retVal.getPosition()));
                retVal.retain();
                retVal.removeFromParent(true);
                this.cardList.splice(i, 1);
                return retVal;
            }
        cc.log(id + " " + JSON.stringify(card));
        return null;
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

    reOrder: function () {
        if (this.cardList.length > 0) {
            this.setContentSize(cc.size(this.cardList[0].width *
                this.cardList.length * this.cardScale,
                this.cardList[0].height * this.cardScale));
            var width = this.cardSize.width * this.cardList.length * this.cardScale;
            if (width > this.getContentSize().width) {
                width = this.getContentSize().width;
            }
            var dx = width / this.cardList.length;
            var x = this.getContentSize().width / 2 - width / 2 + dx / 2;
            var y = this.getContentSize().height / 2;
            for (var i = 0; i < this.cardList.length; i++) {
                var card = this.cardList[i];
                card.setScale(this.cardScale);
                card.origin = cc.p(x, y);
                card.cardIndex = i;
                card.cardDistance = dx;
                card.moveToOriginPosition();
                x += dx;
            }
        }
    },

    addNewCard: function (card) {
        var cardSprite = new Card(card.rank, card.suit);
        cardSprite.setPosition(this.getParent().getPosition());
        cardSprite.canTouch = false;
        this.addCard(cardSprite);
    },

    addCardReconnect: function (cards) {

    },

    addCardWithoutAnimation: function (cards) {
        if (!this.cardSize) {
            this.cardSize = cards[0].getContentSize();
        }
        this.cardList.push(cards);

        var dx = this.cardSize.width * this.cardScale;
        var width = cards.length * dx;
        var x = this.cardPosition.x - width / 2 + dx / 2;

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(x, this.cardPosition.y);
            card.setScale(0.5);
            this.addChild(card, 0);
            x += dx;
        }
    },

    removeAll: function () {
        this.cardList = [];
        this.removeAllChildren(true);
    }
});

var PhomCardList = CardList.extend({
    dealCards: function (cards, animation) {
        this._super(cards, animation);
    },
    reArrangeCards: function (groupList) {

    },
    suggestCards: function (cards) {
        for (var i = 0; i < this.cardList.length; i++) {
            var cardSprite = this.cardList[i];
            var selected = cards.indexOf(this.getCardIdWithRank(cardSprite.rank,
                    cardSprite.suit)) != -1;
            cardSprite.setSelected(selected, true);
        }
    },
    getCardIdWithRank: function (rank, suit) {
        var rankCard = rank - 3;
        if (rankCard < 0) {
            rankCard = 13 + rankCard;
        }
        return ((suit * 13) + rankCard);
    },
    processGroupedCard: function (param) {
        var groupedCard = [];
        for (var i = 0; i < param.length; i++)
            groupedCard = groupedCard.concat(param[i]);
        cc.log("Process grouped card : " + JSON.stringify(groupedCard));

        for (var i = 0; i < this.cardList.length; i++) {
            var id = this.getCardIdWithRank(this.cardList[i].rank,
                this.cardList[i].suit);
            cc.log("Cardlist " + i + " id " + id);
            if (groupedCard.indexOf(id) != -1) {
                var dotSprite = new cc.Sprite("#card-dot.png");
                dotSprite.setPosition(this.cardList[i].width - 20,
                    this.cardList[i].height - 20);
                this.cardList[i].addChild(dotSprite);
            }
            else {
                this.cardList[i].removeAllChildren(true);
            }
        }
    },
});
var Phom = IGameScene.extend({
    ctor: function () {
        this._super();

        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        table_bg.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(table_bg);

        this.initPlayer();
        this.initButton();

        var cardList = new PhomCardList(cc.size(cc.winSize.width - 10, 100));
        cardList.setAnchorPoint(cc.p(0.5, 0.0));
        cardList.setPosition(cc.winSize.width / 2, 100.0);
        this.sceneLayer.addChild(cardList, 2);
        this.cardList = cardList;

        var drawDeck = new cc.Sprite("#gp_card_up.png");
        drawDeck.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        var drawDeckLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "");
        drawDeckLabel.setPosition(drawDeck.width / 2, drawDeck.height / 2);
        drawDeck.setScale(0.5);
        drawDeckLabel.setVisible(false);
        drawDeck.addChild(drawDeckLabel);
        this.drawDeckLabel = drawDeckLabel;
        this.drawDeck = drawDeck;
        this.sceneLayer.addChild(drawDeck);
    },
    onSFSExtension: function (messageType, content) {
        this._super(messageType, content);
        cc.log("mysfs : " + JSON.stringify(content));
        if (content.c == "1") { // startGame
            this.onGameStatus(content.p["1"]);
            this.timeTurn = content.p["7"];
        }
        else if (content.c == "13") {//reconnect

        }
        else if (content.c == "10") {//update status
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
    onStatusChanged: function (param) {

    },
    onGameFinished: function (param) {
        this.uBt.visible = false;
        var roomStatus = param["s"];
        var winUser = param["u"];
        var userData = param["3"];
        var winString = "Thắng";

        var dialog = new ResultDialog(userData.length);
        for (var i = 0; i < userData.length; i++) {
            dialog.userLabel[i].setString(userData[i].u);
            var gold = parseInt(userData[i]["4"]);
            var goldStr = cc.Global.NumberFormat1(Math.abs(gold)) + " V";
            if (gold >= 0) {
                goldStr = "+" + goldStr;
            }
            else {
                goldStr = "-" + goldStr;
            }
            dialog.goldLabel[i].setString(goldStr);

            if (gold >= 0) {
                dialog.goldLabel[i].setColor(cc.color("#ffde00"));
            }
            else {
                dialog.goldLabel[i].setColor(cc.color("#ff0000"));
            }

            var cardList = userData[i]["2"];
            var contentString = "";
            switch (userData[i]["5"]) {
                case 0:
                    contentString = "Bét ";
                    if (userData[i]["7"] > 0)
                        contentString += userData[i]["7"] + " điểm";
                    break;
                case 1:
                    contentString = "Ù Khan";
                    break;
                case 2:
                    contentString = "Ù Tròn";
                    break;
                case 3:
                    contentString = "Ù Thường";
                    break;
                case 4:
                    contentString = "Ù Đền";
                    break;
                case 5:
                    contentString = "Nhất " + userData[i]["7"] + " điểm";
                    break;
                case 6:
                    contentString = "Nhì " + userData[i]["7"] + " điểm";
                    break;
                case 7:
                    contentString = "Ba " + userData[i]["7"] + " điểm";
                    break;
                case 8:
                    contentString = "Móm";
                    break;
            }
            cc.log("Content string : " + contentString);
            dialog.contentLabel[i].setString(contentString);
            // if (userData[i].u == winUser) {
            //     dialog.contentLabel[i].setString(winString);
            // }
            // else {
            //     dialog.contentLabel[i].setString("Thua " + cardList.length + " lá");
            // }

            for (var j = 0; j < cardList.length; j++) {
                var cardData = this.getCardWithId(cardList[j]);
                var card = new Card(cardData.rank, cardData.suit);
                dialog.cardList[i].addCard(card);
            }
            dialog.cardList[i].reOrderWithoutAnimation();

            //update gold
            this.updateGold(userData[i].u, userData[i]["3"]);
            //effect
        }
        dialog.showWithAnimationMove();
    },
    onHaBai: function (param) {
        var username = param["u"];
        var groupedCard = param["11"];
        var stolenCard = param["12"];
        var slot = this.getSlotByUsername(username);

        var removeList = [];
        var slotStolenCards = [];
        var stolenCardsSprite = [];
        for (var i = 0; i < slot.dropCards.cardList.length; i++) {
            var id = this.getCardIdWithRank(slot.dropCards.cardList[i].rank,
                slot.dropCards.cardList[i].suit);
            slot.dropCards.cardList[i].retain();
            stolenCardsSprite.push(slot.dropCards.cardList[i]);
            slot.dropCards.cardList[i].removeFromParent();
            slotStolenCards.push(id);
        }
        slot.dropCards.removeAll();
        for (var i = 0; i < groupedCard.length; i++) {
            var list = groupedCard[i];
            for (var j = 0; j < list.length; j++) {
                var card = this.getCardWithId(list[j]);
                if (username == PlayerMe.username) {
                    removeList.push(card);
                } else {
                    var cardSprite;
                    if (slotStolenCards.indexOf(list[j]) == -1)
                        cardSprite = new Card(card.rank, card.suit);
                    else {
                        cardSprite = stolenCardsSprite[slotStolenCards.indexOf(list[j])];
                        cardSprite.release();
                    }
                    slot.dropCards.addCard(cardSprite);
                }
            }
        }
        var arr = this.cardList.removeCard(removeList);
        for (var i = 0; i < arr.length; i++) {
            this.playerView[0].dropCards.addCard(arr[i]);
            arr[i].release();
        }
        slot.dropCards.reOrder();
        this.cardList.reOrder();
    },
    onDelegateCard: function (param) {
        if (param["1"] && param["1"].length > 0) {
            for (var i = 0; i < param["1"].length; i++) {
                var delegateData = param["1"][i];
                var sender = delegateData["u1"];
                var receiver = delegateData["u2"];
                var delegateCardsId = delegateData["4"];
                var groupedCardAfter = [];
                for (var j = 0; j < delegateData["5"].length; j++)
                    groupedCardAfter = groupedCardAfter.concat(delegateData["5"][j]);
                var receiverSlot = this.getSlotByUsername(receiver);
                var finalList = [];

                //determine where to get sprites
                for (var j = 0; j < groupedCardAfter.length; j++) {
                    if (delegateCardsId.indexOf(groupedCardAfter[j]) == -1) {
                        // from grouped card before
                        finalList.push(receiverSlot.dropCards.removeCardById(groupedCardAfter[j]));
                    }
                    else {
                        // from my deck
                        if (sender == PlayerMe.username) {
                            finalList.push(this.cardList.removeCardById(groupedCardAfter[j]));
                        }
                        // from someone's deck
                        else {
                            var card = this.getCardWithId(groupedCardAfter[j]);
                            var cardSprite = new Card(card.rank, card.suit);
                            cardSprite.setPosition(this.getSlotByUsername(sender).getPosition());
                            finalList.push(cardSprite);
                        }
                    }
                }

                for (var j = 0; j < finalList.length; j++) {
                    //add back to receiver drop cards
                    receiverSlot.dropCards.addCard(finalList[i]);
                    finalList[i].release();
                }
                receiverSlot.dropCards.reOrder();
            }
        }
    },
    onStealAssetUpdate: function (param) {
        var stealer = param["u1"];
        var stolenUser = param["u2"];
        var stealerAmount = param["s1"];
        var stolenAmount = param["s2"];
        var stealerBalance = param["m1"];
        var stolenBalance = param["m2"];
    },
    onBalanceCard: function (param) {
        var cardId = param["1"];
        var fromUser = this.getSlotByUsername(param["u1"]);
        var destUser = this.getSlotByUsername(param["u2"]);
        cc.log("Moving cardId " + cardId + " from user " + param["u1"]
            + " to user " + param["u2"]);
        var cardSprite = fromUser.trashCards.removeCardById(cardId);
        destUser.trashCards.addCard(cardSprite);
        cardSprite.release();
        destUser.trashCards.reOrder();
    },
    onStealCard: function (param) {
        cc.log("Player " + param["u1"] + " stolen card id " + param["1"]
            + " from " + param["u2"]);
        var stolenUser = this.getSlotByUsername(param["u2"]);
        var cardSprite = stolenUser.trashCards.removeCardById(param["1"]);
        cardSprite.removeAllChildren(true);
        var borderSprite = new cc.Sprite("#boder_do.png");
        borderSprite.setPosition(cardSprite.width / 2, cardSprite.height / 2);
        cardSprite.addChild(borderSprite);
        if (param["u1"] == PlayerMe.username) {
            if (cardSprite) {
                this.cardList.addCard(cardSprite);
                cardSprite.release();
                this.cardList.reOrder();
                this.cardList.processGroupedCard(param["2"]);
            }
        }
        else {
            var stealer = this.getSlotByUsername(param["u1"]);
            stealer.dropCards.addCard(cardSprite);
            stealer.reOrder();
        }
    },
    onDrawDeck: function (param) {
        var user = param.u;
        if (user == PlayerMe.username) {
            var card = this.getCardWithId(param["1"]);
            var cardSprite = new Card(card.rank, card.suit);
            cardSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.cardList.addCard(cardSprite);
            this.cardList.reOrder();
            this.cardList.processGroupedCard(param["2"]);
        }
    },
    onUpdateDrawDeck: function (param) {
        var cardCount = param["1"];
        if (cardCount)
            this.drawDeckLabel.setString(cardCount);
    },
    onTurnChanged: function (param) {
        var username = param.u;
        this.anbaiBt.visible = this.danhbaiBt.visible = this.uBt.visible
            = this.habaiBt.visible = this.drawBt.visible =
            this.guibaiBt.visible = false;
        this.xepBaiBt.visible = true;
        if (!param.s)
            return;
        switch (param.s) {
            case 0:
                this.xepBaiBt.visible = false;
                break;
            case 1:
                break;
            case 2:
                this.drawBt.visible = true;
                break;
            case 3:
                this.drawBt.visible = true;
                this.anbaiBt.visible = true;
                break;
            case 4:
                this.danhbaiBt.visible = true;
                break;
            case 5:
                this.habaiBt.visible = true;
                this.danhbaiBt.visible = true;
                break;
            case 6: // gui bai
                this.guibaiBt.visible = true;
                break;
            case 7: // u`
                this.uBt.visible = true;
                break;
            case 8:
                this.xepBaiBt.visible = false;
                break;
        }

        if (param["3"] && param["3"].length > 0) {
            this.cardList.suggestCards(param["3"]);
        }
        if (param["4"] && param["4"].length > 0) {
            this.cardList.suggestCards(param["4"]);
        }
    },
    onDanhBaiThanhCong: function (param) {
        var username = param.u;
        var slot = this.getSlotByUsername(username);
        if (slot) {
            var cards = [];
            var cardId = param["1"];
            cards.push(this.getCardWithId(cardId));
            if (slot.isMe) {
                var arr = this.cardList.removeCard(cards);
                slot.trashCards.addCard(arr[0]);
                this.cardList.reOrder();
                for (var i = 0; i < arr.length; i++)
                    arr[i].release();
            }
            else {
                slot.trashCards.addNewCard(this.getCardWithId(param["1"]));
            }
            //slot.trashCards.reOrder();
        }
    },
    onStartGame: function (params) {
        var cards = [];
        var cardData = params["1"];
        var groupCardData = params["2"];
        for (var i = 0; i < cardData.length; i++) {
            var card = this.getCardWithId(cardData[i]);
            for (var j = 0; j < groupCardData.length; j++) {
                if (groupCardData[j].indexOf(cardData[i]) != -1) // found in group j
                    card.groupId = j;
                else
                    card.groupId = -1;
            }
            cards.push(card);
        }
        this.cardList.dealCards(cards, true);
        this.cardList.processGroupedCard(groupCardData);
    },
    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        playerMe.trashCards = new TrashCardOnTable();
        playerMe.trashCards.setCardPosition(cc.winSize.width / 2 - 85, 200);
        playerMe.dropCards = new TrashCardOnTable();
        playerMe.dropCards.setCardPosition(playerMe.trashCards.x, playerMe.trashCards.y + 50);
        playerMe.addChild(playerMe.dropCards);
        playerMe.addChild(playerMe.trashCards);
        this.sceneLayer.addChild(playerMe, 1);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120.0 / cc.winSize.screenScale, 360.0);
        player1.trashCards = new TrashCardOnTable();
        player1.trashCards.setCardPosition(player1.width / 2 - 50, player1.height / 2 - 50);
        player1.trashCards.setAnchorPoint(cc.p(1.0, 0.5));
        player1.dropCards = new TrashCardOnTable();
        player1.dropCards.setCardPosition(player1.trashCards.x, player1.trashCards.y + 50);
        player1.dropCards.setAnchorPoint(cc.p(1.0, 0.5));
        player1.addChild(player1.dropCards);
        player1.addChild(player1.trashCards);
        this.sceneLayer.addChild(player1, 1);

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width / 2, 680.0 * cc.winSize.screenScale);
        player2.trashCards = new TrashCardOnTable();
        player2.trashCards.setCardPosition(player2.width / 2, player2.height / 2 - 120);
        player2.dropCards = new TrashCardOnTable();
        player2.dropCards.setCardPosition(player2.trashCards.x, player2.trashCards.y + 50);
        player2.addChild(player2.trashCards);
        player2.addChild(player2.dropCards);
        this.sceneLayer.addChild(player2, 1);

        var player3 = new GamePlayer();
        player3.setPosition(120.0 / cc.winSize.screenScale, 360.0);
        player3.trashCards = new TrashCardOnTable();
        player3.trashCards.setCardPosition(player3.width / 2, player3.height / 2 - 50);
        player3.trashCards.setAnchorPoint(cc.p(0.0, 0.5));
        player3.dropCards = new TrashCardOnTable();
        player3.dropCards.setCardPosition(player3.trashCards.x, player3.trashCards.y + 50);
        player3.dropCards.setAnchorPoint(cc.p(0.0, 0.5));
        player3.addChild(player3.trashCards);
        player3.addChild(player3.dropCards);
        this.sceneLayer.addChild(player3, 1);
        this.playerView = [playerMe, player1, player2, player3];
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
    initButton: function () {
        var danhbaiBt = new ccui.Button("game-danhbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        danhbaiBt.setPosition(cc.winSize.width - 510, 50);
        this.sceneLayer.addChild(danhbaiBt);

        var xepBaiBt = new ccui.Button("game-xepbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        xepBaiBt.setPosition(cc.winSize.width - 710, danhbaiBt.y);
        this.sceneLayer.addChild(xepBaiBt);

        var uBt = new ccui.Button("game-uBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        uBt.setPosition(danhbaiBt.getPosition());
        this.sceneLayer.addChild(uBt);

        var drawBt = new ccui.Button("game-bocbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        drawBt.setPosition(cc.winSize.width - 110, danhbaiBt.y);
        this.sceneLayer.addChild(drawBt);

        var startBt = new ccui.Button("game-startBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(drawBt.getPosition());
        this.sceneLayer.addChild(startBt);

        var habaiBt = new ccui.Button("game-habaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        habaiBt.setPosition(cc.winSize.width - 310, danhbaiBt.y);
        this.sceneLayer.addChild(habaiBt);

        var anbaiBt = new ccui.Button("game-anbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        anbaiBt.setPosition(habaiBt.x, habaiBt.y);
        this.sceneLayer.addChild(anbaiBt);

        var guibaiBt = new ccui.Button("game-guibaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        guibaiBt.setPosition(anbaiBt.getPosition());
        this.sceneLayer.addChild(guibaiBt);


        var thiz = this;
        startBt.addClickEventListener(function () {
            thiz.sendStartRequest();
        });
        drawBt.addClickEventListener(function () {
            thiz.sendDrawRequest();
        });
        danhbaiBt.addClickEventListener(function () {
            thiz.sendDanhBai();
        });
        xepBaiBt.addClickEventListener(function () {
            //thiz.sendStartRequest();
        });
        habaiBt.addClickEventListener(function () {
            thiz.sendHaBaiRequest();
        });

        anbaiBt.addClickEventListener(function () {
            thiz.sendAnBaiRequest();
        });

        uBt.addClickEventListener(function () {
            thiz.sendURequest();
        });

        guibaiBt.addClickEventListener(function () {
            thiz.sendGuiBaiRequest();
        });

        danhbaiBt.visible = false;
        xepBaiBt.visible = true;
        drawBt.visible = false;
        startBt.visible = false;
        habaiBt.visible = false;
        anbaiBt.visible = false;
        uBt.visible = false;
        guibaiBt.visible = false;

        this.danhbaiBt = danhbaiBt;
        this.uBt = uBt;
        this.xepBaiBt = xepBaiBt;
        this.drawBt = drawBt;
        this.startBt = startBt;
        this.anbaiBt = anbaiBt;
        this.habaiBt = habaiBt;
        this.guibaiBt = guibaiBt;
    },
    sendURequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("109", null);
    },
    sendAnBaiRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("103", null);
    },
    sendGuiBaiRequest: function () {
        var guibaiList = this.cardList.getCardSelected();
        var data = [];
        for (var i = 0; i < guibaiList.length; i++) {
            data.push(this.getCardIdWithRank(guibaiList[i].rank, guibaiList[i].suit));
        }
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("106", data);
    },
    sendHaBaiRequest: function () {
        var habaiList = this.cardList.getCardSelected();
        var data = [];
        for (var i = 0; i < habaiList.length; i++) {
            data.push(this.getCardIdWithRank(habaiList[i].rank, habaiList[i].suit));
        }
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("108", {1: data});
    },
    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },
    sendDanhBai: function () {
        var cards = this.cardList.getCardSelected();
        if (cards.length > 0) {
            var cardId = this.getCardIdWithRank(cards[0].rank, cards[0].suit);
            var param = {1: cardId};
            SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("4", param);
        } else
            MessageNode.getInstance().show("Bạn phải chọn 1 quân bài");
    },
    sendDrawRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("101", null);
    },
    onGameStatus: function (status) {
        this.gameStatus = status;
        if (status == 0) { //waiting
            this.startBt.visible = true;
            this.danhbaiBt.visible = this.drawBt.visible =
                this.drawDeckLabel.visible = this.drawDeck.visible =
                    this.xepBaiBt.visible = this.habaiBt.visible =
                        this.anbaiBt.visible = false;
            this.cardList.removeAll();
            if (this.playerView) {
                for (var i = 0; i < this.playerView.length; i++) {
                    this.playerView[i].trashCards.removeAll();
                    this.playerView[i].dropCards.removeAll();
                }
            }
        }
        else if (status == 1) { //ready
            this.danhbaiBt.visible = false;
            this.xepBaiBt.visible = false;
            this.drawBt.visible = false;
            this.startBt.visible = false;
            this.drawDeckLabel.visible = false;
            this.drawDeck.visible = false;
            this.anbaiBt.visible = false;
            this.habaiBt.visible = false;
            this.cardList.removeAll();
            if (this.playerView) {
                for (var i = 0; i < this.playerView.length; i++) {
                    this.playerView[i].trashCards.removeAll();
                    this.playerView[i].dropCards.removeAll();
                }
            }

            if (this.isOwnerMe) {
                this.startBt.visible = true;
            }
        }
        else if (status == 2) { //play
            this.drawDeckLabel.visible = true;
            this.drawDeck.visible = true;
            this.startBt.visible = false;
            this.xepBaiBt.visible = true;
        }
        else if (status == 3) { //finish
            this.danhbaiBt.visible = false;
            this.xepBaiBt.visible = false;
            this.drawBt.visible = false;
            this.startBt.visible = false;
            this.habaiBt.visible = false;
            this.anbaiBt.visible = false;
        }
    }
});