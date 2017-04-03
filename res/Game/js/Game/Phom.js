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
        var card = CardList.prototype.getCardWithId(id);
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
            var x = -this.getContentSize().width / 2 + dx / 2;
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
            var cardId = CardList.prototype.getCardIdWithRank(this.cardList[i].rank, this.cardList[i].suit);
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
            var selected = cards.indexOf(CardList.prototype.getCardIdWithRank(cardSprite.rank,
                    cardSprite.suit)) != -1;
            cardSprite.setSelected(selected, true);
        }
    },

    processGroupedCard: function (param) {
        var groupedCard = [];
        for (var i = 0; i < param.length; i++)
            groupedCard = groupedCard.concat(param[i]);
        this.groupedCard = groupedCard;

        for (var i = 0; i < this.cardList.length; i++) {
            var id = CardList.prototype.getCardIdWithRank(this.cardList[i].rank,
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

        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width / 2, 320);
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
        drawDeck.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 10);
        var drawDeckLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        drawDeckLabel.setPosition(drawDeck.width / 2, drawDeck.height / 2);
        drawDeckLabel.setVisible(false);
        drawDeck.addChild(drawDeckLabel);
        drawDeck.setScale(0.8);
        this.drawDeckLabel = drawDeckLabel;
        this.drawDeck = drawDeck;
        this.sceneLayer.addChild(drawDeck);
    },
    initController: function () {
        this._controller = new PhomController(this);
    },
    setTrashCardList: function (cards, username) {
        var slot = this.getSlotByUsername(username);
        slot.trashCards.removeAll();
        for (var j = 0; j < cards.length; j++) {
            var card = CardList.prototype.getCardWithId(cards[j]);
            slot.trashCards.addCard(new Card(card.rank, card.suit));
        }
    },

    setCardList: function (cards) {
        this.cardList.removeAll();
        for (var i = 0; i < cards.length; i++) {
            var card = CardList.prototype.getCardWithId(cards[i]);
            this.cardList.addCard(new Card(card.rank, card.suit));
        }
        this.cardList.reOrderWithoutAnimation();
    },

    setStolenCardsMe: function (cards) {
        for (var i = 0; i < this.cardList.cardList.length; i++) {
            var card = this.cardList.cardList[i];
            var cardId = CardList.prototype.getCardIdWithRank(card.rank, card.suit);
            if (cards.indexOf(cardId) != -1) {
                var borderSprite = new cc.Sprite("#boder_do.png");
                borderSprite.setPosition(card.width / 2, card.height / 2);
                card.addChild(borderSprite);
            }
        }
    },

    setStolenCardsOther: function (cards, username) {
        var slot = this.getSlotByUsername(username);
        slot.dropCards.removeAll();

        for (var i = 0; i < cards.length; i++) {
            var card = CardList.prototype.getCardWithId(cards[i]);
            var cardSprite = new Card(card.rank, card.suit);
            var redBorder = new cc.Sprite("#boder_do.png");
            redBorder.setPosition(cardSprite.width / 2, cardSprite.height / 2);
            cardSprite.addChild(redBorder);
            slot.dropCards.addCard(cardSprite);
        }
    },

    processGroupedCard: function (groupedCard) {
        this.cardList.processGroupedCard(groupedCard);
    },

    showResultDialog: function (resultData) {
        var dialog = new ResultDialog(resultData.length);

        for (var i = 0; i < resultData.length; i++) {
            var username = resultData[i].username;
            if (username.length > 3 && (username != PlayerMe.username)){
                username = username.substring(0,username.length - 3) + "***";
            }
            dialog.userLabel[i].setString(username);
            if (resultData[i].username = PlayerMe.username) {
                SoundPlayer.playSound(resultData[i].isWinner ? "winning" : "losing");
            }
            var goldStr = resultData[i].gold >= 0 ? "+" : "-";
            goldStr += (cc.Global.NumberFormat1(Math.abs(resultData[i].gold)) + " V");
            dialog.goldLabel[i].setString(goldStr);
            dialog.goldLabel[i].setColor(resultData[i].gold >= 0 ?
                cc.color("#ffde00") : cc.color("#ff0000"));
            dialog.contentLabel[i].setString(resultData[i].resultString);

            for (var j = 0; j < resultData[i].cardList.length; j++) {
                var cardData = CardList.prototype.getCardWithId(resultData[i].cardList[j]);
                var card = new Card(cardData.rank, cardData.suit);
                dialog.cardList[i].addCard(card);
            }

            dialog.cardList[i].reOrderWithoutAnimation();
        }

        dialog.showWithAnimationMove();
    },

    performHaBaiMe: function (groupedCards) {
        var removeList = [];
        for (var i = 0; i < groupedCards.length; i++) {
            var list = groupedCards[i];
            for (var j = 0; j < list.length; j++) {
                removeList.push(CardList.prototype.getCardWithId(list[j]));
            }
        }

        var arr = this.cardList.removeCard(removeList);
        for (var i = 0; i < arr.length; i++) {
            this.playerView[0].dropCards.addCard(arr[i]);
            arr[i].release();
        }
        this.playerView[0].dropCards.reOrder();
        this.cardList.reOrder();
    },

    performHaBaiOther: function (username, groupedCards, stolenCards) {
        var slot = this.getSlotByUsername(username);
        var stolenCardsId = [];
        var stolenCardsSprite = [];

        //index stolen cards
        for (var i = 0; i < slot.dropCards.cardList.length; i++) {
            stolenCardsId.push(
                CardList.prototype.getCardIdWithRank(slot.dropCards.cardList[i].rank,
                    slot.dropCards.cardList[i].suit)
            );
            slot.dropCards.cardList[i].retain();
            stolenCardsSprite.push(slot.dropCards.cardList[i]);
            slot.dropCards.cardList[i].removeFromParent();
        }

        //add to drop cards list
        for (var i = 0; i < groupedCards.length; i++) {
            for (var j = 0; j < groupedCards[i].length; j++) {
                var index = stolenCardsId.indexOf(groupedCards[i][j]);
                if (index == -1) {// from hands, create new sprite
                    var card = CardList.prototype.getCardWithId(groupedCards[i][j]);
                    slot.dropCards.addCard(new Card(card.rank, card.suit));
                }
                else { // from exist drop card
                    slot.dropCards.addCard(stolenCardsSprite[index]);
                    stolenCardsSprite[index].release();
                }
            }
        }
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
                    var card = CardList.prototype.getCardWithId(groupedCardAfter[j]);
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
        this.cardList.reOrder();
    },
    performAssetChange: function (username, changeAmount, balance) {
        this._super(changeAmount,balance,username);
        // var slot = this.getSlotByUsername(username);
        // if (balance)
        //     slot.setGold(balance);
        //
        // var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        // var changeText = (changeAmount >= 0 ? "+" : "") + changeAmount;
        // changeSprite.setString(changeText);
        // changeSprite.setColor(cc.color(changeAmount >= 0 ? "#ffde00" : "#ff0000"));
        // changeSprite.setPosition(slot.avt.getPosition());
        // slot.addChild(changeSprite, 420);
        //
        // changeSprite.runAction(new cc.Sequence(new cc.DelayTime(1.0), new cc.CallFunc(function () {
        //     changeSprite.removeFromParent(true);
        // })));
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
        stolenUserSlot.trashCards.reOrder();

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
    performDrawCardMe: function (cardId, groupedCard) {
        var card = CardList.prototype.getCardWithId(cardId);
        var cardSprite = new Card(card.rank, card.suit);
        cardSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.cardList.addCard(cardSprite);
        this.cardList.reOrder();
        this.cardList.processGroupedCard(groupedCard);
    },

    performDrawCardOther: function (username) {
        var slot = this.getSlotByUsername(username);
        var card = new cc.Sprite("#gp_card_up.png");
        this.sceneLayer.addChild(card);
        card.setScale(0.5);
        card.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        var moveAction = new cc.MoveTo(0.3, slot.getPosition());
        var removeAction = new cc.CallFunc(function () {
            card.removeFromParent(true);
        });

        card.runAction(new cc.Sequence(moveAction, removeAction));
    },
    performDrawDeckUpdate: function (cardCount) {
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
        playerMe.trashCards.setCardPosition(cc.winSize.width / 2, 200);
        playerMe.dropCards = new TrashCardOnTable();
        playerMe.dropCards.setCardPosition(playerMe.trashCards.x, playerMe.trashCards.y + 50);
        playerMe.addChild(playerMe.dropCards);
        playerMe.addChild(playerMe.trashCards);
        this.sceneLayer.addChild(playerMe, 1);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 144.0 / cc.winSize.screenScale, 320.0);
        player1.trashCards = new TrashCardOnTable();
        player1.trashCards.setCardPosition(player1.width / 2 - 50, player1.height / 2 - 25);
        player1.trashCards.setAnchorPoint(cc.p(1.0, 0.5));
        player1.dropCards = new TrashCardOnTable();
        player1.dropCards.setCardPosition(player1.trashCards.x, player1.trashCards.y + 50);
        player1.dropCards.setAnchorPoint(cc.p(1.0, 0.5));
        player1.addChild(player1.dropCards);
        player1.addChild(player1.trashCards);
        this.sceneLayer.addChild(player1, 1);
        player1.chatView.setAnchorPoint(cc.p(1.0, 0.0));

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width / 2, 580.0 * cc.winSize.screenScale);
        player2.trashCards = new TrashCardOnTable();
        player2.trashCards.setCardPosition(player2.width / 2, player2.height / 2 - 120);
        player2.dropCards = new TrashCardOnTable();
        player2.dropCards.setCardPosition(player2.trashCards.x, player2.trashCards.y + 50);
        player2.addChild(player2.trashCards);
        player2.addChild(player2.dropCards);
        this.sceneLayer.addChild(player2, 1);
        // this.sceneLayer.addChild(player1, 1);
        player2.chatView.setAnchorPoint(cc.p(0.0, 1.0));

        var player3 = new GamePlayer();
        player3.setPosition(144.0 / cc.winSize.screenScale, 320.0);
        player3.trashCards = new TrashCardOnTable();
        player3.trashCards.setCardPosition(player3.width / 2 + 125, player3.height / 2 - 25);
        player3.trashCards.setAnchorPoint(cc.p(0.0, 0.5));
        player3.dropCards = new TrashCardOnTable();
        player3.dropCards.setCardPosition(player3.trashCards.x, player3.trashCards.y + 50);
        player3.dropCards.setAnchorPoint(cc.p(0.0, 0.5));
        player3.addChild(player3.trashCards);
        player3.addChild(player3.dropCards);
        player3.chatView.setAnchorPoint(cc.p(0.0, 0.0));

        this.sceneLayer.addChild(player3, 1);
        this.playerView = [playerMe, player1, player2, player3];
    },
    initButton: function () {
        var danhbaiBt = new ccui.Button("game-danhbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        danhbaiBt.setPosition(cc.winSize.width - 310, 46);
        this.sceneLayer.addChild(danhbaiBt);

        var xepBaiBt = new ccui.Button("game-xepbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        xepBaiBt.setPosition(cc.winSize.width - 710, danhbaiBt.y);
        this.sceneLayer.addChild(xepBaiBt);

        var uBt = new ccui.Button("game-uBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        uBt.setPosition(cc.winSize.width - 510, danhbaiBt.y);
        this.sceneLayer.addChild(uBt);

        var drawBt = new ccui.Button("game-bocbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        drawBt.setPosition(cc.winSize.width - 110, danhbaiBt.y);
        this.sceneLayer.addChild(drawBt);

        var startBt = new ccui.Button("game-startBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(drawBt.getPosition());
        this.sceneLayer.addChild(startBt);

        var habaiBt = new ccui.Button("game-habaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        habaiBt.setPosition(cc.winSize.width - 510, danhbaiBt.y);
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
        this._controller.sendURequest();
    },
    sendAnBaiRequest: function () {
        this._controller.sendAnBaiRequest();
    },
    sendGuiBaiRequest: function () {
        var guibaiList = this.cardList.getCardSelected();
        var data = [];
        for (var i = 0; i < guibaiList.length; i++) {
            data.push(CardList.prototype.getCardIdWithRank(guibaiList[i].rank, guibaiList[i].suit));
        }
        this._controller.sendGuiBaiRequest(data);
    },
    sendHaBaiRequest: function () {
        var habaiList = this.cardList.getCardSelected();
        var data = [];
        for (var i = 0; i < habaiList.length; i++) {
            data.push(CardList.prototype.getCardIdWithRank(habaiList[i].rank, habaiList[i].suit));
        }
        this._controller.sendHaBaiRequest(data);
    },
    sendStartRequest: function () {
        this._controller.sendStartRequest();
    },
    sendDanhBai: function () {
        var cards = this.cardList.getCardSelected();
        if (cards.length > 0) {
            var cardId = CardList.prototype.getCardIdWithRank(cards[0].rank, cards[0].suit);
            this._controller.sendDanhBai(cardId);
        } else
            MessageNode.getInstance().show("Bạn phải chọn 1 quân bài");
    },
    sendDrawRequest: function () {
        this._controller.sendDrawRequest();
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