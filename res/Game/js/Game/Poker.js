/**
 * Created by VGA10 on 1/19/2017.
 */

var PokerGamePlayer = GamePlayer.extend({
    ctor: function (playerIndex, handler) {
        this._super();
        this.playerIndex = playerIndex;
        this._handler = handler;
        var btnSitDown = new ccui.Button("pk_btn_sitdown.png","","",ccui.Widget.PLIST_TEXTURE);
        var thiz = this;
        btnSitDown.addClickEventListener(function () {
            thiz.onSitDownBtClick();
        } );
        btnSitDown.setPosition(thiz.avt.getPosition());
        btnSitDown.visible = false;
        thiz.addChild(btnSitDown);
        this.btnSitDown = btnSitDown;

        var lblBet = new cc.LabelTTF("10",cc.res.font.Roboto_Condensed,20);
        lblBet.setPosition(thiz.avt.getPosition() + cc.p(200,200));
        lblBet.visible = true;
        thiz.addChild(lblBet);
        this.lblBet = lblBet;

        var imgDeal = new cc.Sprite("#pk_icon_dealer.png");
        imgDeal.setPosition(thiz.avt.getPosition() + cc.p(200,-200));
        imgDeal.visible = true;
        thiz.addChild(imgDeal);
        this.imgDeal = imgDeal;

        var imgBigBild = new cc.Sprite("#pk_icon_bigBlind.png");
        imgBigBild.setPosition(thiz.avt.getPosition() + cc.p(200,-200));
        imgBigBild.visible = true;
        thiz.addChild(imgBigBild);
        this.imgBigBild = imgBigBild;

        var imgSmallBlind = new cc.Sprite("#pk_icon_smallBlind.png");
        imgSmallBlind.setPosition(thiz.avt.getPosition() + cc.p(200,-200));
        imgSmallBlind.visible = true;
        thiz.addChild(imgSmallBlind);
        this.imgSmallBlind = imgSmallBlind;

        this.setVisbleSitDown(true);

        var cardList = new CardList(cc.size(130, 86));
        cardList.setPosition(thiz.avt.getPosition());
        this.addChild(cardList);
        cardList.setTouchEnable(false);
        this.cardList = cardList;


        var phomVituarl = new cc.Sprite("#pk_cardMask.png");
        phomVituarl.setPosition(thiz.avt.getPosition() + cc.p(-200,-200));
        phomVituarl.visible = true;
        thiz.addChild(phomVituarl);
        this.phomVituarl = phomVituarl;



    },
    setEnable : function (enable) {
        this._super(enable);
        if(enable && this.btnSitDown){
            this.btnSitDown.visible = false;
        }
        if(enable && this.phomVituarl){
            this.phomVituarl.visible = false;
        }
    },
    setDealer : function (isDeader) {
        this.imgDeal.setVisible(isDeader);
    },
    setBigBlind : function (isDeader) {
        this.imgBigBild.setVisible(isDeader);
    },
    setSmallBlid : function (isDeader) {
        this.imgSmallBlind.setVisible(isDeader);
    },

    setCardVituarlVisible:function (isVisible) {
        this.phomVituarl.visible = isVisible;
    },
    setMoneyBet:function (moneyBet) {
        if(moneyBet > 0)
        {
            this.lblBet.setVisible(true);
        }
        else
        {
            this.lblBet.setVisible(false);
        }
        this.lblBet.setString(moneyBet);
    },
    setInfo : function (info) {
        if(info){
            this.setGold(info.money);
            this.setMoneyBet(info.moneyBet);
            this.setBigBlind(info.isBigBlind);
            this.setSmallBlid(info.isSmallBlind);
            this.setDealer(info.isDealer);

        }
    },

    updateAction:function (idAction) {
      if(idAction == PK_ACTION_PLAYER_CHECK)
      {
          this.userLabel.setString("CHECK");
      }
      else if(idAction == PK_ACTION_PLAYER_CALL){
          this.userLabel.setString("CALL");
      }
      else if(idAction == PK_ACTION_PLAYER_FOLD){
          this.userLabel.setString("FOLD");
      }
      else if(idAction == PK_ACTION_PLAYER_RAISE){
          this.userLabel.setString("RAISE");
      }
      else if(idAction == PK_ACTION_PLAYER_BET){
          this.userLabel.setString("BET");
      }
      else if(idAction == PK_ACTION_PLAYER_ALL_IN){
          this.userLabel.setString("ALL_IN");
      }
    },

    setVisbleSitDown:function (isVisible) {
        this.btnSitDown.visible = isVisible ;
        this.inviteBt.visible = !isVisible;

    },

    onSitDownBtClick:function () {
        this._handler.showSitDownDialog(this.playerIndex);
    }

});

var Poker = IGameScene.extend({
    timeMaxTurn:20,
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

        var cardMix = new CardList(cc.size(240, 80));
        cardMix.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        cardMix.visible = true;
        this.sceneLayer.addChild(cardMix);
        this.cardMix = cardMix;

        // var publicCards = [2,3];
        // var cards = [];
        // for (var i = 0; i < publicCards.length; i++) {
        //     cards.push(CardList.prototype.getCardWithId(publicCards[i]));
        //
        // }
        // this.cardMix.addNewCard(cards);

    },

    showSitDownDialog: function (index) {
        this._controller.sendSitDownRequest(index, 10000);
    },

    updatePlayerInfo : function (username, info) {
        var slot = this.getSlotByUsername(username);
        if(slot){
            slot.setInfo(info);
        }
    },

    updateActionPlayer:function (username, money, moneyEXchang, idAction) {
        this.handleButtons(null);
        var slot = this.getSlotByUsername(username);
        if(slot){
            switch (idAction) {
                case PK_ACTION_PLAYER_BET :
                    SoundPlayer.playSound("pk_chips_bet");
                    break;
                case PK_ACTION_PLAYER_CALL :
                {
                    SoundPlayer.playSound("pk_call");
                    SoundPlayer.playSound("pk_chips_bet");
                }
                    break;
                case PK_ACTION_PLAYER_FOLD :
                    SoundPlayer.playSound("pk_fold");
                    break;
                case PK_ACTION_PLAYER_CHECK :
                    SoundPlayer.playSound("pk_check");
                    break;
                case PK_ACTION_PLAYER_RAISE : {
                    SoundPlayer.playSound("pk_raise");
                    SoundPlayer.playSound("pk_chips_bet");
                }
                    break;
                case PK_ACTION_PLAYER_ALL_IN :
                {
                    SoundPlayer.playSound("pk_allin");
                    SoundPlayer.playSound("pk_chips_bet");
                }
                    break;
            }
        }
        slot.stopTimeRemain();
        if(idAction == PK_ACTION_PLAYER_ALL_IN || idAction == PK_ACTION_PLAYER_CALL || idAction == PK_ACTION_PLAYER_RAISE || idAction == PK_ACTION_PLAYER_NONE)
        {
            slot.setMoneyBet(money)
        }
        else if(idAction == PK_ACTION_PLAYER_FOLD)
        {
            slot.phomVituarl.setVisible(false);

        }
        slot.updateAction(idAction);
        // for (var i = 0; i < this.allSlot.length; i++) {
        //     if (this.allSlot[i].username == username) {
        //         this.allSlot[i].showTimeRemain(currentTime, maxTime);
        //     }
        //     else {
        //         this.allSlot[i].stopTimeRemain();
        //     }
        // }
    },

    initPlayer: function () {
        var playerPosition = [
            cc.p(cc.winSize.width / 2, 130), // 0
            cc.p(280, 190), // 1
            cc.p(130, 365), // 2
            cc.p(220, 530), // 3
            cc.p(500, 610), // 4
            cc.p(775, 610), // 5
            cc.p(1060, 530), // 6
            cc.p(1145, 370), // 7
            cc.p(1000, 195) // 8
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
        for (var i = 0; i < 5; i++) {
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



    initController: function () {
        this._controller = new PokerController(this);
    },

    initButton: function () {
        var thiz = this;


        var raiseBt = new ccui.Button("pk_btn_raise.png", "", "", ccui.Widget.PLIST_TEXTURE);
        raiseBt.setPosition(1160*cc.winSize.screenScale, 50);
        raiseBt.setScale(cc.winSize.screenScale);
        this.raiseBt = raiseBt;
        this.sceneLayer.addChild(raiseBt);

        var callBt = new ccui.Button("pk_btn_call.png", "", "", ccui.Widget.PLIST_TEXTURE);
        callBt.setPosition(1040*cc.winSize.screenScale, 50);
        callBt.setScale(cc.winSize.screenScale);
        this.callBt = callBt;
        this.sceneLayer.addChild(callBt);

        var checkBt = new ccui.Button("pk_btn_check.png", "", "", ccui.Widget.PLIST_TEXTURE);
        checkBt.setPosition(920*cc.winSize.screenScale, 50);
        checkBt.setScale(cc.winSize.screenScale);
        this.checkBt = checkBt;
        this.sceneLayer.addChild(checkBt);

        var foldBt = new ccui.Button("pk_btn_fold.png", "", "", ccui.Widget.PLIST_TEXTURE);
        foldBt.setPosition(795*cc.winSize.screenScale, 50);
        foldBt.setScale(cc.winSize.screenScale);
        this.foldBt = foldBt;
        this.sceneLayer.addChild(foldBt);

        var allinBt = new ccui.Button("pk_btn_allin.png","","",ccui.Widget.PLIST_TEXTURE);
        allinBt.setPosition(raiseBt.getPosition());
        allinBt.setScale(cc.winSize.screenScale);
        this.allinBt = allinBt;
        this.sceneLayer.addChild(allinBt);

        var betBt = new ccui.Button("pk_btn_Bet.png","","",ccui.Widget.PLIST_TEXTURE);
        betBt.setPosition(raiseBt.getPosition());
        betBt.setScale(cc.winSize.screenScale);
        this.betBt = betBt;
        this.sceneLayer.addChild(betBt);

        betBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_CHECK,1000);
        });

        allinBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_ALL_IN,0);
        });

        foldBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_FOLD,0);
            thiz.handleButtons(null);
        });

        raiseBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_RAISE,1000);
        });

        callBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_CALL,0);
            thiz.handleButtons(null);
        });

        checkBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_CHECK,0);
            thiz.handleButtons(null);
        });

        this.buttons = [betBt, raiseBt, callBt, checkBt, foldBt,allinBt];
        this.hideAllButton();
    },


    handleButtons:function(arrAction){
        this.hideAllButton();
    // bettingPoker->setVisible(false); chưa có


    // cbCallAny->setVisible(false);
    // cbChectOrFold->setVisible(false);
    // cbFold->setVisible(false);
    // cbCheck->setVisible(false);
    if(arrAction != null)
    {
        for(var i = 0; i < arrAction.length; i++)
        {

            if(arrAction[i] == PK_ACTION_PLAYER_RAISE)
            {
                this.raiseBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_CALL)
            {
                this.callBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_FOLD)
            {
                this.foldBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_CHECK)
            {
                this.checkBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_ALL_IN)
            {
                this.allinBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_BET)
            {
                this.betBt.setVisible(true);
            }
        }
        if(this.raiseBt.isVisible() || this.betBt.isVisible())
        {
            // isVisiableBet = btnBet.isVisible();
            this.allinBt.setVisible(false);

        }
    }


},
    onUpdateTurn: function (username) {
        // cc.log("updateTurn: " + currentTime + ":" + maxTime + " - " + Date.now());
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username) {
                this.allSlot[i].showTimeRemain(this.timeMaxTurn, this.timeMaxTurn);
            }
            else {
                this.allSlot[i].stopTimeRemain();
            }
        }
    },

    dealPublicCards:function (cards) {

        this.cardMix.addNewCard(cards);
    },


    hideAllButton: function () {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].setVisible(false);
        }
    },



    performDealCards: function (cards, animation) {
        this.allSlot[0].cardList.removeAll();
        // for(var i; i < cards.length; i++)
        // {
        //     var cardNew = new Card(data[i].rank, data[i].suit);
        //     this.allSlot[0].cardList.addCard(cardNew);
        // }
        this.allSlot[0].cardList.dealCards(cards, true);
        // this.allSlot[0].cardList.addCardReconnect(cards);


    },

    backButtonClickHandler: function () {
        if(this.allSlot[0].username == PlayerMe.username){
            this._controller.requestStandup();
        }
        else{
            if (this._controller) {
                this._controller.requestQuitRoom();
            }
        }
    },

    updateInviteButton : function () {
        if(this.allSlot[0].username == PlayerMe.username){
            for(var i = 0; i<this.allSlot.length; i++){
                if(this.allSlot[i].username == ""){
                    this.allSlot[i].setVisbleSitDown(false);
                }
            }
        }
        else{
            for(var i = 0; i<this.allSlot.length; i++){
                if(this.allSlot[i].username == ""){
                    this.allSlot[i].setVisbleSitDown(true);
                }
            }
        }
    }
});