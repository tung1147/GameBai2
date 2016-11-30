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
        cc.log("card id " + id + " " + JSON.stringify(card));
        return null;
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

    reOrder: function (noAnimation) {
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
                if (noAnimation)
                    card.setPosition(card.origin);
                else
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

    addCardWithoutAnimation: function (cards) {
        if (!this.cardSize) {
            this.cardSize = cards[0].getContentSize();
        }
        this.cardList.concat(cards);

        var dx = this.cardSize.width * this.cardScale;
        var width = cards.length * dx;
        var x = this.getContentSize().width / 2 + dx / 2;
        var y = this.getContentSize().height / 2;

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setScale(this.cardScale);
            card.setPosition(x, y);
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
    reArrangeCards: function () {
        // chia ra 2 array, grouped va ungrouped
        var groupedCard = [];
        var ungroupedCard = [];
        for (var i = 0; i < this.cardList.length; i++) {
            var cardId = this.getCardIdWithRank(this.cardList[i].rank, this.cardList[i].suit);
            var index = this.groupedCard.indexOf(cardId);
            if (index != -1)
                groupedCard[index] = this.cardList[i];
            else
                ungroupedCard.push(this.cardList[i]);
        }

        ungroupedCard.sort(function (a, b) {
            return a.rank - b.rank;
        });

        this.cardList = [];
        this.cardList = groupedCard.concat(ungroupedCard);
        this.reOrder();
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
        this.groupedCard = groupedCard;

        for (var i = 0; i < this.cardList.length; i++) {
            var id = this.getCardIdWithRank(this.cardList[i].rank,
                this.cardList[i].suit);
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
    }
});
var Phom = IGameScene.extend({
    ctor: function () {
        this._super();
        this._controller = new PhomController(this);

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
    onStatusChanged: function (param) {

    },
    onReconnect: function (param) {
        this._super(param);
        var userInfo = param["1"]["5"];

        //update my status
        for (var i = 0; i < userInfo.length; i++) {
            if (userInfo[i]["u"] == PlayerMe.username) {
                this.onTurnChanged({s: userInfo[i]["s"], u: userInfo[i]["u"]});
            }
        }

        //update turn
        var turnInfo = param["1"]["12"];
        this.getSlotByUsername(turnInfo["u"]).showTimeRemain(turnInfo["2"] / 1000, 15);
        this.drawDeckLabel.setString(turnInfo["3"]);

        //on-hand cards
        var onHandCards = param["3"];
        var pushLish = [];
        for (var i = 0; i < onHandCards.length; i++) {
            var card = this.getCardWithId(onHandCards[i]);
            this.cardList.addCard(new Card(card.rank, card.suit));
        }
        this.cardList.reOrderWithoutAnimation();

        // trash card
        for (var i = 0; i < userInfo.length; i++) {
            var data = userInfo[i];
            var username = data["u"];
            var slot = this.getSlotByUsername(username);
            var trashCards = data["10"];

            //trashcard
            if (!trashCards)
                break;
            for (var j = 0; j < trashCards.length; j++) {
                var card = this.getCardWithId(trashCards[j]);
                slot.trashCards.addCard(new Card(card.rank, card.suit));
            }
            slot.trashCards.reOrder(true);
        }

        // stolen card
        for (var i = 0; i < userInfo.length; i++) {
            var data = userInfo[i];
            var username = data["u"];
            var stolenCards = data["12"];
            if (username == PlayerMe.username) {
                for (var j = 0; j < this.cardList.cardList.length; j++) {
                    var cardId = this.getCardIdWithRank(
                        this.cardList.cardList[j].rank,
                        this.cardList.cardList[j].suit
                    );
                    if (stolenCards.indexOf(cardId) != -1) {
                        var redBorder = new cc.Sprite("#boder_do.png");
                        redBorder.setPosition(
                            this.cardList.cardList[j].width / 2,
                            this.cardList.cardList[j].height / 2
                        );
                        this.cardList.cardList[j].addChild(redBorder);
                    }
                }
            }
            else {
                for (var j = 0; j < stolenCards.length; j++) {
                    var card = this.getCardWithId(stolenCards[j]);
                    var cardSprite = new Card(card.rank, card.suit);
                    var redBorder = new cc.Sprite("#boder_do.png");
                    redBorder.setPosition(cardSprite.width / 2, cardSprite.height / 2);
                    cardSprite.addChild(redBorder);
                    slot.dropCards.addCard(cardSprite)
                }
                slot.dropCards.reOrder(true);
            }
        }

        //grouped Cards

        var groupedCards = [];
        if (param["4"]) {
            for (var i = 0; i < param["4"].length; i++)
                groupedCards = groupedCards.concat(param["4"][i]);

            for (var i = 0; i < this.cardList.cardList.length; i++) {
                var cardId = this.getCardIdWithRank(
                    this.cardList.cardList[i].rank,
                    this.cardList.cardList[i].suit
                );

                if (groupedCards.indexOf(cardId) != -1) {
                    var dotSprite = new cc.Sprite("#card-dot.png");
                    dotSprite.setPosition(
                        this.cardList.cardList[i].width - 20,
                        this.cardList.cardList[i].height - 20
                    );
                    this.cardList.cardList[i].addChild(dotSprite);
                }
            }
        }
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
    performHaBaiMe: function (groupedCards) {
        var removeList = [];
        for (var i = 0;i<groupedCards.length;i++){
            var list = groupedCards[i];
            for (var j = 0;j<list.length;j++){
                removeList.push(this.getCardWithId(list[j]));
            }
        }

        var arr = this.cardList.removeCard(removeList);
        for (var i = 0;i<arr.length;i++){
            this.playerView[0].dropCards.addCard(arr[i]);
            arr[i].release();
        }
        this.playerView[0].dropCards.reOrder();
        this.cardList.reOrder();
    },
    performHaBaiOther : function (username,groupedCards,stolenCards) {
        var slot = this.getSlotByUsername(username);
        var stolenCardsId = [];
        var stolenCardsSprite = [];

        //index stolen cards
        for (var i = 0;i<slot.dropCards.cardList.length;i++){
            stolenCardsId.push(
                this.getCardIdWithRank(slot.dropCards.cardList[i].rank,
                    slot.dropCards.cardList[i].suit)
            );
            slot.dropCards.cardList[i].retain();
            stolenCardsSprite.push(slot.dropCards.cardList[i]);
            slot.dropCards.cardList[i].removeFromParent();
        }

        //add to drop cards list
        for (var i = 0;i<groupedCards.length;i++){
            for (var j = 0;j<groupedCards[i].length;j++){
                var index = stolenCardsId.indexOf(groupedCards[i][j]);
                if (index == -1){// from hands, create new sprite
                    var card = this.getCardWithId(groupedCards[i][j]);
                    slot.dropCards.addCard(new Card(card.rank,card.suit));
                }
                else{ // from exist drop card
                    slot.dropCards.addCard(stolenCardsSprite[index]);
                    stolenCardsSprite[index].release();
                }
            }
        }
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
    performReorderCards: function () {
        this.cardList.reOrder();
    },
    performDelegateCards: function (sender, receiver, cards,
                                    groupedCardAfter) {
        var finalList = [];
        var receiverSlot = this.getSlotByUsername(receiver);

        //determine where to get sprites
        for (var j = 0; j < groupedCardAfter.length; j++) {
            if (cards.indexOf(groupedCardAfter[j]) == -1) {
                // from grouped card before
                var cardSprite = receiverSlot.dropCards.removeCardById(groupedCardAfter[j])
                finalList.push(cardSprite);
                cardSprite.release();
            }
            else {
                // from my deck
                if (sender == PlayerMe.username) {
                    var cardSprite = this.cardList.removeCardById(groupedCardAfter[j])
                    finalList.push(cardSprite);
                    cardSprite.release();
                    cc.log("Removed card id " + groupedCardAfter[j] + " from my deck");
                }
                // from someone's deck
                else {
                    var card = this.getCardWithId(groupedCardAfter[j]);
                    var cardSprite = new Card(card.rank, card.suit);
                    cardSprite.setPosition(this.getSlotByUsername(sender).getPosition());
                    finalList.push(cardSprite);
                    cc.log("Added card id " + groupedCardAfter[j]);
                }
            }
        }

        for (var i = 0; i < finalList.length; i++) {
            //add back to receiver drop cards
            receiverSlot.dropCards.addCard(finalList[i]);
        }
        receiverSlot.dropCards.reOrder();
    },
    onStealAssetUpdate: function (param) {
        var stealer = param["u1"];
        var stolenUser = param["u2"];
        var stealerAmount = param["s1"];
        var stolenAmount = param["s2"];
        var stealerBalance = param["m1"];
        var stolenBalance = param["m2"];
    },
    performBalanceCard: function (from, to, card) {
        var fromUser = this.getSlotByUsername(from);
        var toUser = this.getSlotByUsername(to);
        var cardSprite = fromUser.trashCards.removeCardById(card);
        toUser.trashCards.addCard(cardSprite);
        cardSprite.release();
        toUser.trashCards.reOrder();
    },
    performStealCard: function (stealer, stolenUser, stolenCard,
                                groupedCard) { // in case I'm stealer
        var stolenUserSlot = this.getSlotByUsername(stolenUser);
        var cardSprite = stolenUserSlot.trashCards.removeCardById(stolenCard);
        cardSprite.removeAllChildren(true); //purify card, amen
        var borderSprite = new cc.Sprite("#boder_do.png");
        borderSprite.setPosition(cardSprite.width / 2, cardSprite.height / 2);
        cardSprite.addChild(borderSprite);
        if (stealer == PlayerMe.username) {
            this.cardList.addCard(cardSprite);
            cardSprite.release();
            this.cardList.processGroupedCard(groupedCard);
            this.cardList.reArrangeCards();
        }
        else {
            var stealerSlot = this.getSlotByUsername(stealer);
            stealerSlot.dropCards.addCard(cardSprite);
            stealerSlot.dropCards.reOrder();
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
    showTimeRemainUser: function (username, currentTime, maxTime) {
        maxTime = maxTime || currentTime;
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username)
                this.allSlot[i].showTimeRemain(currentTime, maxTime);
            else
                this.allSlot[i].stopTimeRemain();
        }
    },
    setDrawBtVisible: function (visible) {
        this.drawBt.visible = visible;
    },
    setAnBaiBtVisible: function (visible) {
        this.anbaiBt.visible = visible;
    },
    setDanhBaiBtVisible: function (visible) {
        this.danhbaiBt.visible = visible;
    },
    setHaBaiBtVisible: function (visible) {
        this.habaiBt.visible = visible;
    },
    setGuiBaiBtVisible: function (visible) {
        this.guibaiBt.visible = visible;
    },
    setUBtVisible: function (visible) {
        this.uBt.visible = visible;
    },
    suggestCards: function (cards) {
        this.cardList.suggestCards(cards);
    },
    performDanhBaiMe: function (card) {
        var arr = this.cardList.removeCard([card]);
        this.playerView[0].trashCards.addCard(arr[0]);
        this.cardList.reOrder();
        for (var i = 0; i < arr.length; i++) {
            arr[i].removeAllChildren(true);
            arr[i].release();
        }
    },
    performDanhBaiOther: function (username, card) {
        var slot = this.getSlotByUsername(username);
        slot.trashCards.addNewCard(card);
    },

    performDealCards: function (cards, groupedCards) {
        this.cardList.dealCards(cards, true);
        this.cardList.processGroupedCard(groupedCards);
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
            thiz.xepBai();
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

        this.danhbaiBt = danhbaiBt;
        this.uBt = uBt;
        this.xepBaiBt = xepBaiBt;
        this.drawBt = drawBt;
        this.startBt = startBt;
        this.anbaiBt = anbaiBt;
        this.habaiBt = habaiBt;
        this.guibaiBt = guibaiBt;

        this.allButton = [danhbaiBt, uBt, xepBaiBt, drawBt,
            startBt, anbaiBt, habaiBt, guibaiBt];
        this.hideAllButton();
    },
    hideAllButton: function () {
        for (var i = 0; i < this.allButton.length; i++)
            this.allButton[i].visible = false;
    },
    xepBai: function () {
        this.cardList.reArrangeCards();
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
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("106", {1: data});
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
    setStartBtVisible: function (visible) {
        this.startBt.visible = visible;
    },
    removeAllCards: function () {
        this.cardList.removeAll();
        if (this.playerView) {
            for (var i = 0; i < this.playerView.length; i++) {
                this.playerView[i].trashCards.removeAll();
                this.playerView[i].dropCards.removeAll();
            }
        }
    },
    setDeckVisible: function (visible) {
        this.drawDeck.visible = visible;
        this.drawDeckLabel.visible = visible;
    },
    setXepBaiBtVisible: function (visible) {
        this.xepBaiBt.visible = visible;
    }
});