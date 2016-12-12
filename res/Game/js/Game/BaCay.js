/**
 * Created by Quyet Nguyen on 7/25/2016.
 */


var BaCay = IGameScene.extend({
    ctor: function () {
        this._super();
        this.initScene();
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
    },

    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        playerMe.cardList = new CardList(cc.size(240, 100));
        playerMe.cardList.setPosition(cc.winSize.width / 2, 100.0);
        playerMe.resultLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        playerMe.resultLabel.setColor(cc.color("#8e9bff"));
        playerMe.resultLabel.setPosition(playerMe.cardList.x, playerMe.cardList.y + 90);
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
            var cardList = new CardList(cc.size(240, 100));
            cardList.setPosition(this.playerView[i].avt.x, this.playerView[i].avt.y - 10);
            cardList.setScale(0.6);
            this.playerView[i].addChild(cardList);
            this.playerView[i].cardList = cardList;

            var resultLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
            resultLabel.setColor(cc.color("#8e9bff"));
            resultLabel.setPosition(cardList.x, cardList.y - 120);
            this.playerView[i].addChild(resultLabel);
            this.playerView[i].resultLabel = resultLabel;
        }
    },

    initButton: function () {
        var thiz = this;
        var revealBt = new ccui.Button("game-lathetBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        revealBt.setPosition(cc.winSize.width - 310, 50);
        this.sceneLayer.addChild(revealBt);
        this.revealBt = revealBt;

        this.revealBt.addClickEventListener(function () {
            thiz.onRevealBtClick();
        });
    },

    onRevealBtClick: function () {
        this._controller.sendRevealCard();
    },

    revealCards: function (cards, username) {
        var slot = this.getSlotByUsername(username);
        if (slot.revealed)
            return;

        var cardArray = [];
        for (var i = 0; i < cards.length; i++)
            cardArray.push(this.getCardWithId(cards[i]));
        slot.cardList.addNewCard(cardArray);
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

    dealCardMe: function (cards) {
        var cardArray = [];
        for (var i = 0; i < cards.length; i++)
            cardArray.push(this.getCardWithId(cards[i]));

        this.playerView[0].cardList.dealCards(cardArray, true);
    },

    resetBoard: function () {
        for (var i = 0; i < this.playerView.length; i++) {
            this.playerView[i].cardList.removeAll();
            this.playerView[i].resultLabel.setString("");
            this.playerView[i].revealed = false;
        }
    },

    setStateString : function (str) {
        this.stateString.setString(str);
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
    }
});