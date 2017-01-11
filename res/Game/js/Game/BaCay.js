/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

var BaCayCardList = CardList.extend({
    dealCards: function (cards, animation) {
        this._super(cards, animation);
        for (var i = 0; i < this.cardList.length; i++) {
            this.cardList[i].setSpriteFrame("gp_card_up.png");

            // override select event to reveal card
            this.overrideReveal(this.cardList[i]);
        }
    },

    overrideReveal: function (card) {
        card.setSelected = function (selected, force) {
            if (force) {
                card.stopAllActions();
                card.setPosition(card.origin);
            }
            if (selected == true) {
                card.reveal();
            }
        };
        card.reveal = function () {
            if (card.revealed)
                return;
            card.revealed = true;
            var duration = 0.1;
            var oldScaleX = card.scaleX;
            var scaleDown = new cc.ScaleTo(duration, 0.0, card.scaleY);
            var revealAction = new cc.CallFunc(function () {
                card.setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
            });
            var scaleUp = new cc.ScaleTo(duration, oldScaleX, card.scaleY);

            card.runAction(new cc.Sequence(scaleDown, revealAction, scaleUp));
            SoundPlayer.playSound("open_card");
        }
    },

    addCard: function (card) {
        this._super(card);
        this.overrideReveal(card);
    },

    revealAll: function (cards) {
        if (cards) {
            for (var i = 0; i < cards.length; i++) {
                var card = CardList.prototype.getCardWithId(cards[i]);
                this.cardList[i].rank = card.rank;
                this.cardList[i].suit = card.suit;
            }
        }
        for (var j = 0; j < this.cardList.length; j++)
            this.cardList[j].reveal();
    }
});

var BaCay = IGameScene.extend({
    ctor: function () {
        this._super();
        this.initScene();
        this.timeRemaining = 0;
        this.timeInterval = null;
    },

    initScene: function () {
        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        table_bg.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(table_bg);

        this.initPlayer();
        this.initButton();

        var stateString = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        stateString.setColor(cc.color("#8e9bff"));
        stateString.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.sceneLayer.addChild(stateString);
        this.stateString = stateString;

        var huThuongBg = ccui.Scale9Sprite.createWithSpriteFrameName("bacayhuthuong_bg.png", cc.rect(15, 15, 4, 4));
        huThuongBg.setPreferredSize(cc.size(322, 47));
        huThuongBg.setPosition(cc.winSize.width / 2, 525);
        this.sceneLayer.addChild(huThuongBg);

        var huThuongLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "HŨ BA CÂY: ");
        huThuongLabel.setPosition(huThuongBg.x - 75, huThuongBg.y);
        huThuongLabel.setColor(cc.color("#c1ceff"));
        this.sceneLayer.addChild(huThuongLabel);

        var huThuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
        huThuongValueLabel.setPosition(huThuongBg.x + 60, huThuongBg.y);
        huThuongValueLabel.setColor(cc.color("#ffde00"));
        this.sceneLayer.addChild(huThuongValueLabel);
        this.huThuongValueLabel = huThuongValueLabel;

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_BoldCondensed_36_Glow,"");
        timeLabel.setPosition(huThuongBg.x, huThuongBg.y - 100);
        timeLabel.setScale(2.0);
        this.sceneLayer.addChild(timeLabel);
        this.timeLabel = timeLabel;
    },

    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        playerMe.cardList = new BaCayCardList(cc.size(240, 100));
        playerMe.cardList.setPosition(cc.winSize.width / 2, 100.0);
        playerMe.resultLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        playerMe.resultLabel.setColor(cc.color("#8e9bff"));
        playerMe.resultLabel.setPosition(playerMe.cardList.x, playerMe.cardList.y + 90);
        playerMe.assetChangePos = cc.p(playerMe.resultLabel.x, playerMe.resultLabel.y + 50);
        this.sceneLayer.addChild(playerMe, 1);
        this.sceneLayer.addChild(playerMe.cardList, 2);
        this.sceneLayer.addChild(playerMe.resultLabel, 2);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120.0 / cc.winSize.screenScale, 240.0);
        this.sceneLayer.addChild(player1, 1);

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width - 160.0, 500.00);
        this.sceneLayer.addChild(player2, 1);

        var player3 = new GamePlayer();
        player3.setPosition(cc.winSize.width / 2, 650.0);
        this.sceneLayer.addChild(player3, 1);

        var player4 = new GamePlayer();
        player4.setPosition(160.0, 500.0);
        this.sceneLayer.addChild(player4, 1);

        var player5 = new GamePlayer();
        player5.setPosition(120.0, 240.0);
        this.sceneLayer.addChild(player5, 1);

        this.playerView = [playerMe, player1, player2, player3, player4, player5];

        for (var i = 1; i < this.playerView.length; i++) {
            var cardList = new BaCayCardList(cc.size(240, 100));
            cardList.setPosition(this.playerView[i].avt.x, this.playerView[i].avt.y - 10);
            cardList.setScale(0.6);
            cardList.setTouchEnable(false);
            this.playerView[i].infoLayer.addChild(cardList);
            this.playerView[i].cardList = cardList;

            var resultLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
            resultLabel.setColor(cc.color("#8e9bff"));
            resultLabel.setPosition(cardList.x, cardList.y - 120);
            this.playerView[i].infoLayer.addChild(resultLabel);
            this.playerView[i].resultLabel = resultLabel;

            if (i == 1 || i == 2)
                this.playerView[i].assetChangePos = cc.p(resultLabel.x - 100, resultLabel.y);
            else
                this.playerView[i].assetChangePos = cc.p(resultLabel.x + 100, resultLabel.y);
        }
    },

    initButton: function () {
        var thiz = this;
        var revealBt = new ccui.Button("game-lathetBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        revealBt.setPosition(cc.winSize.width - 310, 50);
        revealBt.visible = false;
        this.sceneLayer.addChild(revealBt);
        this.revealBt = revealBt;

        this.revealBt.addClickEventListener(function () {
            thiz.onRevealBtClick();
        });
    },

    playResultSound: function (winner) {
        SoundPlayer.playSound(winner == PlayerMe.username ? "winning" : "losing");
    },

    onRevealBtClick: function () {
        this._controller.sendRevealCard();
    },

    //seconds
    showTimeRemaining: function (timeRemaining) {
        if (timeRemaining > 0) {
            this.timeRemaining = timeRemaining;
            if (this.timeInterval) {
                clearInterval(this.timeInterval)
            }
            var thiz = this;
            thiz.timeLabel.setString(timeRemaining);
            thiz.timeRemaining--;
            this.timeInterval = setInterval(function () {
                if (thiz.timeRemaining <= 0){
                    thiz.timeLabel.setString("");
                    clearInterval(thiz.timeInterval);
                }else{
                    thiz.timeLabel.setString(thiz.timeRemaining);
                    thiz.timeRemaining--;
                }
            }, 1000);
        }else{
            this.timeRemaining = 0;
            this.timeLabel.setString("");
        }
    },

    performAssetChange: function (amount, goldAfter, username) {
        var slot = this.getSlotByUsername(username);
        var changeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
        changeLabel.setString(amount > 0 ? ("+" + amount) : amount);
        changeLabel.setColor(cc.color(amount > 0 ? "#ffde00" : "#c52829"));
        changeLabel.setPosition(slot.assetChangePos);
        if (username == PlayerMe.username)
            this.sceneLayer.addChild(changeLabel);
        else
            slot.addChild(changeLabel);

        slot.setGold(goldAfter);
        var moveAction = new cc.MoveTo(1.0, slot.assetChangePos.x, slot.assetChangePos.y + 50);
        var removeAction = new cc.CallFunc(function () {
            changeLabel.removeFromParent(true);
        });
        changeLabel.runAction(new cc.Sequence(moveAction, removeAction));
    },

    revealCards: function (cards, username) {
        var slot = this.getSlotByUsername(username);
        if (slot.revealed)
            return;
        slot.cardList.revealAll(username == PlayerMe.username ? null : cards);
        slot.revealed = true;
    },

    setResultString: function (str, usr) {
        var slot = this.getSlotByUsername(usr);
        slot.resultLabel.setString(str);
    },

    setRevealBtVisible: function (isVisible) {
        this.revealBt.visible = isVisible;
    },

    initController: function () {
        this._controller = new BaCayController(this);
    },

    dealCard: function (cards) {
        var cardArray = [];
        for (var i = 0; i < cards.length; i++)
            cardArray.push(CardList.prototype.getCardWithId(cards[i]));
        this.playerView[0].cardList.dealCards(cardArray, true);

        for (var j = 1; j < this.playerView.length; j++) // dummy cards for other players
            if (this.playerView[j].username != "")
                this.playerView[j].cardList.dealCards(cardArray, true);
    },

    reappearCard: function (cards) {
        for (var j = 0; j < this.playerView.length; j++)
            if (this.playerView[j].username != "") {
                for (var i = 0; i < cards.length; i++) {
                    var card = CardList.prototype.getCardWithId(cards[i]);
                    var cardObject = new Card(card.rank, card.suit);
                    cardObject.setSpriteFrame("gp_card_up.png");
                    this.playerView[j].cardList.addCard(cardObject);
                }
                this.playerView[j].cardList.reOrderWithoutAnimation();
            }
    },

    resetBoard: function () {
        for (var i = 0; i < this.playerView.length; i++) {
            this.playerView[i].cardList.removeAll();
            this.playerView[i].resultLabel.setString("");
            this.playerView[i].revealed = false;
        }
    },

    setStateString: function (str) {
        this.stateString.setString(str);
    },
});