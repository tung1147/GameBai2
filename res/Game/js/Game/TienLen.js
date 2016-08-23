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
        var cardList = new CardList(cc.size(cc.winSize.width - 10, 100));
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
    initPlayer : function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        this.sceneLayer.addChild(playerMe,1);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player1,1);

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width/2, 680.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player2,1);

        var player3 = new GamePlayer();
        player3.setPosition(120.0 / cc.winSize.screenScale, 360.0);
        this.sceneLayer.addChild(player3,1);

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
            this.onReconnect(content.p);
        }
        else if (content.c == "10"){//update status
            var gameStatus = content.p["1"];
            this.onGameStatus(gameStatus);
        }
        else if(content.c == "3"){ //start game
            this.onStartGame(content.p);
        }
        else if(content.c == "6"){ //new turn
            this.onUpdateTurn(content.p.u, this.timeTurn, true);
            this.cardOnTable.removeAll();
        }
        else if(content.c == "7"){ //next turn
            this.onUpdateTurn(content.p.u, this.timeTurn, false);
        }
        else if(content.c == "5"){ //bo luot
            this.onBoLuot(content.p.u);
        }
        else if(content.c == "4"){ //danh bai thanh cong
            this.onDanhBaiThanhCong(content.p);
        }
        else if(content.c == "8"){ //ket qua
            this.onGameFinished(content.p);
        }
        else if(content.c == "12"){ //chat chem
            this.onChatChem(content.p);
        }
    },
    onBoLuot : function (username) {
        if(PlayerMe.username == username){
            return;
        }
        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == username){
                var slot = this.allSlot[i];

                var labelEffect = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Bỏ lượt");
                labelEffect.setColor(cc.color("#ff0000"));
                labelEffect.setPosition(slot.avt.getPosition());
                slot.addChild(labelEffect, 10);
                labelEffect.runAction(new cc.Sequence(new cc.DelayTime(1.0), new cc.CallFunc(function () {
                    labelEffect.removeFromParent(true);
                })));

                return;
            }
        }
    },
    onStartGame : function (params) {
        var cards = [];
        var cardData = params["1"];
        for(var i=0;i<cardData.length;i++){
            cards.push(this.getCardWithId(cardData[i]));
        }
        this.cardList.dealCards(cards, true);
    },
    onGameFinished : function (params) {
        var winPlayer = params.u;
        var playerData = params["3"];
        var winString = "Thắng";

        var dialog = new ResultDialog(playerData.length);
        for(var i=0;i<playerData.length;i++){
            dialog.userLabel[i].setString(playerData[i].u);
            var gold = parseInt(playerData[i]["4"]);
            var goldStr = cc.Global.NumberFormat1(Math.abs(gold)) +" V";
            if(gold >= 0){
                goldStr = "+" + goldStr;
            }
            else{
                goldStr = "-" + goldStr;
            }
            dialog.goldLabel[i].setString(goldStr);

            if(gold >=0){
                dialog.goldLabel[i].setColor(cc.color("#ffde00"));
            }
            else{
                dialog.goldLabel[i].setColor(cc.color("#ff0000"));
            }

            var cardList = playerData[i]["2"];
            if(playerData[i].u == winPlayer){
                dialog.contentLabel[i].setString(winString);
            }
            else{
                dialog.contentLabel[i].setString("Thua " + cardList.length + " lá");
            }

            for(var j=0;j<cardList.length;j++){
                var cardData= this.getCardWithId(cardList[j]);
                var card = new Card(cardData.rank, cardData.suit);
                dialog.cardList[i].addCard(card);
            }
            dialog.cardList[i].reOrderWithoutAnimation();

            //update gold
            this.updateGold(playerData[i].u, playerData[i]["3"]);
            //effect
        }
        dialog.showWithAnimationMove();
    },
    onChatChem : function (params) {
        var player1 = params["7"];
        var gold1 = params["3"];
        var changeGold1 =  params["2"];

        var player2 = params["8"];
        var gold2 = params["6"];
        var changeGold2 =  params["5"];

        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == player1){
                this.allSlot[i].runChangeGoldEffect(changeGold1);
                //+ tien changeGold1
            }
            if(this.allSlot[i].username == player2){
                this.allSlot[i].runChangeGoldEffect("-"+changeGold2);
                //- tien changeGold2
            }
        }

        this.updateGold(player1, gold1);
        this.updateGold(player2, gold2);
    },
    onReconnect : function (params) {
        //card on table
        this.cardOnTable.removeAll();
        var status = params["1"]["1"];
        if(status == 2){ //playing
            var cardData = params["1"]["12"]["3"];
            if(cardData.length > 0){
                var cards = [];
                for(var i=0;i<cardData.length;i++){
                    cards.push(this.getCardWithId(cardData[i]));
                }
                this.cardOnTable.addCardReconnect(cards);
            }

            //update turn
            var username = params["1"]["12"]["u"];
            var currentTime = params["1"]["12"]["2"] / 1000;
            var newTurn = cardData.length == 0 ? true:false;
            this.onUpdateTurn(username, currentTime, newTurn);

            //add card me
            this.cardList.removeAll();
            var cardsMe = params["3"];
            for(var i=0;i<cardsMe.length;i++){
                var cardId = this.getCardWithId(cardsMe[i]);
                var cardNew = new Card(cardId.rank, cardId.suit);
                this.cardList.addCard(cardNew);
            }
            this.cardList.reOrderWithoutAnimation();
        }
        else{
            this.cardList.removeAll();
            for(var i=0;i<this.allSlot.length;i++){
                this.allSlot[i].stopTimeRemain();
            }
        }
    },
    onGameStatus : function (status) {
        this.gameStatus = status;
        if(status == 0){ //waiting
            this.danhbaiBt.visible = false;
            this.xepBaiBt.visible = false;
            this.boluotBt.visible = false;
            this.startBt.visible = false;
            this.cardList.removeAll();
            this.cardOnTable.removeAll();
        }
        else if(status == 1){ //ready
            this.danhbaiBt.visible = false;
            this.xepBaiBt.visible = false;
            this.boluotBt.visible = false;
            this.startBt.visible = false;
            this.cardList.removeAll();
            this.cardOnTable.removeAll();

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
            this.cardOnTable.removeAll();
        }
    },
    updateOwner : function (username) {
        this._super(username);
        if(this.gameStatus == 1 && this.isOwnerMe) {
            this.startBt.visible = true;
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
    onUpdateTurn : function (username, currentTime, newTurn) {
        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].username == username){
                this.allSlot[i].showTimeRemain(currentTime, this.timeTurn);
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
    onShowResult : function (params) {

    },
    /* send request */
    sendStartRequest : function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },
    sendBoluotRequest : function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("5", null);
    },
    sendDanhBai : function () {
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