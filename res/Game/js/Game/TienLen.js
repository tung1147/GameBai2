/**
 * Created by Quyet Nguyen on 7/21/2016.
 */

var TienLen = IGameScene.extend({
    ctor : function () {
        this._super();

        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        table_bg.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(table_bg);

        this.initPlayer();
        this.initButton();

        //initCard
        var cardList = new CardList(cc.size(cc.winSize.width, 100));
        cardList.setAnchorPoint(cc.p(0.5, 0.0));
        cardList.setPosition(cc.winSize.width/2, 100.0);
        this.sceneLayer.addChild(cardList);
        this.cardList = cardList;

        var cardOnTable = new CardOnTable();
        cardOnTable.setPosition(cc.p(0,0));
        this.sceneLayer.addChild(cardOnTable);
        this.cardOnTable = cardOnTable;

        //test
    },
    initButton : function () {
        var danhbaiBt = ccui.Button("game-danhbaiBt.png","","",ccui.Widget.PLIST_TEXTURE);
        danhbaiBt.setPosition(cc.winSize.width - 510, 50);
        this.sceneLayer.addChild(danhbaiBt);

        var xepBaiBt = ccui.Button("game-xepbaiBt.png","","",ccui.Widget.PLIST_TEXTURE);
        xepBaiBt.setPosition(cc.winSize.width - 310, danhbaiBt.y);
        this.sceneLayer.addChild(xepBaiBt);

        var boluotBt = ccui.Button("game-boluotBt.png","","",ccui.Widget.PLIST_TEXTURE);
        boluotBt.setPosition(cc.winSize.width - 110, danhbaiBt.y);
        this.sceneLayer.addChild(boluotBt);

        var startBt = ccui.Button("game-startBt.png","","",ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(boluotBt.getPosition());
        this.sceneLayer.addChild(startBt);

        var thiz = this;
        startBt.addClickEventListener(function () {
            thiz.sendStartRequest();
        });
        boluotBt.addClickEventListener(function () {
            thiz.sendBoluotRequest();
        });
        danhbaiBt.addClickEventListener(function () {
            thiz.sendDanhBai();
        });

        //danhbaiBt.visible = false;
        xepBaiBt.visible = false;
        boluotBt.visible = false;
        startBt.visible = false;

        this.danhbaiBt = danhbaiBt;
        this.xepBaiBt = xepBaiBt;
        this.boluotBt = boluotBt;
        this.startBt = startBt;
    },
    initPlayer : function (meIndex) {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        this.sceneLayer.addChild(playerMe);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player1);

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width/2, 680.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player2);

        var player3 = new GamePlayer();
        player3.setPosition(120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player3);

        this.playerView = [playerMe, player1, player2, player3];
    },
    getCardWithId : function (cardId) {
        var rankCard = (cardId % 13) + 3;
        if(rankCard > 13){
            rankCard -= 13;
        }
        return {
            rank : rankCard,
            suit : Math.floor(cardId/13)
        };
    },
    getCardIdWithRank : function (rank, suit) {
        var rankCard = rank - 3;
        if(rankCard < 0){
            rankCard = 13 + rankCard;
        }
        return ((suit*13) + rankCard);
    },
    onSFSExtension : function (messageType, content) {
        this._super(messageType, content);
        if(content.c == "1"){ //startGame
            var gameStatus = content.p["1"];
            this.onGameStatus(gameStatus);
            this.timeTurn = content.p["7"];
        }
        else if (content.c == "13"){//reconnect
            var gameStatus = content.p["1"]["1"];
            this.onGameStatus(gameStatus);
            this.timeTurn = content.p["1"]["7"];
        }
        else if (content.c == "10"){//update status
            var gameStatus = content.p["1"];
            this.onGameStatus(gameStatus);
        }
        else if(content.c == "3"){ //start game
            this.onStartGame(content.p);
        }
        else if(content.c == "6"){ //new turn
            this.onUpdateTurn(content.p, true);
        }
        else if(content.c == "7"){ //next turn
            this.onUpdateTurn(content.p, false);
        }
        else if(content.c == "4"){ //danh bai thanh cong
            this.onDanhBaiThanhCong(content.p);
        }
    },
    onStartGame : function (params) {
        var cards = [];
        var cardData = params["1"];
        for(var i=0;i<cardData.length;i++){
            cards.push(this.getCardWithId(cardData[i]));
        }
        this.cardList.dealCards(cards);
    },
    onGameStatus : function (status) {
        if(status == 0){ //waiting
            this.danhbaiBt.visible = false;
            this.xepBaiBt.visible = false;
            this.boluotBt.visible = false;
            this.startBt.visible = false;
        }
        else if(status == 1){ //ready
            this.danhbaiBt.visible = false;
            this.xepBaiBt.visible = false;
            this.boluotBt.visible = false;
            this.startBt.visible = false;
            if(this.isOwnerMe){
                this.startBt.visible = true;
            }
        }
        else if(status == 2){ //play
            this.startBt.visible = false;
            this.xepBaiBt.visible = true;
        }
        else if(status == 3){ //finish
            this.danhbaiBt.visible = false;
            this.xepBaiBt.visible = false;
            this.boluotBt.visible = false;
            this.startBt.visible = false;
            this.cardList.removeAll();
        }
    },
    onDanhBaiThanhCong : function (param) {
        var slot = this.getSlotByUsername(param.u);
        if(slot){
            var cards = [];
            var cardData = param["2"];
            for(var i=0;i<cardData.length;i++){
                cards.push(this.getCardWithId(cardData[i]));
            }
            if(slot.isMe){
                var arr = this.cardList.removeCard(cards);
                this.cardOnTable.moveOldCard();
                this.cardOnTable.addCard(arr);
                this.cardList.reOrder();
                for(var i=0;i<arr.length;i++){
                    arr[i].release();
                }
            }
            else{
                this.cardOnTable.moveOldCard();
                this.cardOnTable.addNewCardList(cards, slot.getPosition());
            }
        }
    },
    onUpdateTurn : function (param,newTurn) {
        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == param.u){
                this.allSlot[i].showTimeRemain(this.timeTurn, this.timeTurn);
                if(this.allSlot[i].isMe){
                    this.danhbaiBt.visible = true;
                    this.boluotBt.visible = true;
                    if(newTurn){
                        this.boluotBt.visible = false;
                    }
                }
                else{
                    this.danhbaiBt.visible = false;
                    this.boluotBt.visible = false;
                }
            }
            else{
                this.allSlot[i].stopTimeRemain();
            }
        }
    },

    /* send request */
    sendStartRequest : function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },
    sendBoluotRequest : function () {
        // var cards = [
        //     {
        //         rank : 1,
        //         suit : CardSuit.Hearts
        //     },
        //     {
        //         rank : 2,
        //         suit : CardSuit.Hearts
        //     },
        //     {
        //         rank : 3,
        //         suit : CardSuit.Hearts
        //     }
        // ]
        // this.cardOnTable.addCard(cards);
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("5", null);
    },
    sendDanhBai : function () {
        // if(!this.start){
        //     var cards = [
        //         {
        //             rank : 1,
        //             suit : CardSuit.Hearts
        //         },
        //         {
        //             rank : 2,
        //             suit : CardSuit.Hearts
        //         },
        //         {
        //             rank : 3,
        //             suit : CardSuit.Hearts
        //         },
        //         {
        //             rank : 4,
        //             suit : CardSuit.Hearts
        //         },
        //         {
        //             rank : 5,
        //             suit : CardSuit.Hearts
        //         },
        //         {
        //             rank : 6,
        //             suit : CardSuit.Hearts
        //         },
        //         {
        //             rank : 7,
        //             suit : CardSuit.Hearts
        //         }
        //     ];
        //     this.cardList.dealCards(cards);
        //     this.start = true;
        //     return;
        // }

        var cards = this.cardList.getCardSelected();
        if(cards.length > 0){
            var cardId = [];
            for(var i=0;i<cards.length;i++){
                cardId.push(this.getCardIdWithRank(cards[i].rank, cards[i].suit));
            }
            var param = {
                2 : cardId
            };
            SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("4", param);
        }
        else{
            MessageNode.getInstance().show("Bạn phải chọn quân bài");
        }
    }
});