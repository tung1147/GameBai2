/**
 * Created by VGA10 on 1/19/2017.
 */

var PokerGamePlayer = GamePlayer.extend({
    ctor: function (playerIndex, handler) {
        this._super();
        this.playerIndex = playerIndex;
        this._handler = handler;
    },

    onInviteBtClick: function () {
        this._handler.showSitDownDialog(this.playerIndex);
    }
});

var Poker = IGameScene.extend({
    ctor: function () {
        this._super();
        this.initPlayer();
        this.initButton();

        this.bg.removeFromParent(true);
        var bg = new cc.Sprite("res/game-poker-bg.png");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bg, -1);

        var table_bg = new cc.Sprite("res/gp_table_poker.png");
        table_bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        table_bg.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(table_bg);

        var cardList = new CardList(cc.size(240, 80));
        cardList.setPosition(cc.winSize.width / 2, 240);
        cardList.visible = false;
        this.sceneLayer.addChild(cardList);
        this.cardList = cardList;

        var publicCards = new CardList(cc.size(400,80));
        publicCards.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        publicCards.visible = false;
        this.sceneLayer.addChild(publicCards);
        this.publicCards = publicCards;
    },

    showSitDownDialog: function (index) {
        this._controller.sendSitDownRequest(index, 10000);
    },

    initPlayer: function () {
        var playerPosition = [
            cc.p(cc.winSize.width / 2, 130), // 0
            cc.p(1000, 195), // 1
            cc.p(1145, 370), // 2
            cc.p(1060, 530), // 3
            cc.p(775, 610), // 4
            cc.p(500, 610), // 5
            cc.p(220, 530), // 6
            cc.p(130, 365), // 7
            cc.p(280, 190) // 8
        ];
        // var player0 = new GamePlayer();
        // player0.setPosition(cc.winSize.width / 2, 50);
        // this.sceneLayer.addChild(player0, 1);
        // player0.chatView.setAnchorPoint(cc.p(1.0, 1.0));
        //
        // var player1 = new GamePlayer();
        // player1.setPosition(cc.winSize.width - 120.0 / cc.winSize.screenScale, 360.0);
        // this.sceneLayer.addChild(player1, 1);
        // player1.chatView.setAnchorPoint(cc.p(1.0, 0.0));
        // player1.chatView.y += 20;
        //
        // var player2 = new GamePlayer();
        // player2.setPosition(cc.winSize.width / 2, 650.0 * cc.winSize.screenScale);
        // this.sceneLayer.addChild(player2, 1);
        // player2.chatView.setAnchorPoint(cc.p(1.0, 1.0));
        //
        // var player3 = new GamePlayer();
        // player3.setPosition(120.0 / cc.winSize.screenScale, 360.0);
        // this.sceneLayer.addChild(player3, 1);
        // player3.chatView.setAnchorPoint(cc.p(0.0, 0.0));
        // player3.chatView.y += 20;

        this.playerView = [];
        var thiz = this;
        for (var i = 0; i < 9; i++) {
            var player = new PokerGamePlayer(i, this);
            player.setPosition(playerPosition[i]);
            this.sceneLayer.addChild(player, 1);
            this.playerView.push(player);
        }
    },

    onUserSitDown: function (username) {
        if (username == PlayerMe.username) {
            this.cardList.setVisible(true);
        }
    },

    setActionVisible: function (actionId) {
        switch (actionId) {
            case 1:
                this.allinBt.visible = true;
                break;
            case 2:
                this.foldBt.visible = true;
                break;
            case 3:
                this.raiseBt.visible = true;
                break;
            case 4:
                this.callBt.visible = true;
                break;
            case 5:
                this.checkBt.visible = true;
                break;
        }
    },

    initController: function () {
        this._controller = new PokerController(this);
    },

    initButton: function () {
        var thiz = this;
        var startBt = new ccui.Button("game-startBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(cc.winSize.width - 110, 50);
        this.startBt = startBt;
        this.sceneLayer.addChild(startBt);

        var raiseBt = new ccui.Button("game-raiseBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        raiseBt.setPosition(cc.winSize.width - 110, 50);
        this.raiseBt = raiseBt;
        this.sceneLayer.addChild(raiseBt);

        var callBt = new ccui.Button("game-callBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        callBt.setPosition(cc.winSize.width - 310, 50);
        this.callBt = callBt;
        this.sceneLayer.addChild(callBt);

        var checkBt = new ccui.Button("game-checkBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        checkBt.setPosition(cc.winSize.width - 510, 50);
        this.checkBt = checkBt;
        this.sceneLayer.addChild(checkBt);

        var foldBt = new ccui.Button("game-foldBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        foldBt.setPosition(cc.winSize.width - 710, 50);
        this.foldBt = foldBt;
        this.sceneLayer.addChild(foldBt);

        var allinBt = new ccui.Button("game-allinBt.png","","",ccui.Widget.PLIST_TEXTURE);
        allinBt.setPosition(cc.winSize.width - 910,50);
        this.allinBt = allinBt;
        this.sceneLayer.addChild(allinBt);

        startBt.addClickEventListener(function () {
            thiz._controller.sendStartRequest();
        });

        allinBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(1,1000);
        });

        foldBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(2,1000);
        });

        raiseBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(3,1000);
        });

        callBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(4,1000);
        });

        checkBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(5,1000);
        });

        this.buttons = [startBt, raiseBt, callBt, checkBt, foldBt,allinBt];
        this.hideAllButton();
    },

    setStartBtVisible: function (visible) {
        this.startBt.setVisible(visible);
    },

    dealPublicCards:function (cards) {
        for (var i = 0;i<cards;i++){
            var card = new Card(cards[i].rank,cards[i].suit);
            this.publicCards.addCard(card);
        }
    },

    resetBoard : function () {
        this.publicCards.removeAll();
        this.cardList.removeAll();
        this.hideAllButton();
    },

    hideAllButton: function () {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].setVisible(false);
        }
    },

    setPublicCardsVisible : function (visible) {
        this.publicCards.visible = visible;
    },

    performDealCards: function (cards, animation) {
        this.cardList.visible = true;
        this.cardList.dealCards(cards, animation);
    }
});