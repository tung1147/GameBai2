/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

var MauBinh = IGameScene.extend({
    ctor: function () {
        this._super();
        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        table_bg.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(table_bg);

        this.initScene();

        this.initPlayer();
        this.initButton();

    },

    initScene: function () {
        var huThuongBg = ccui.Scale9Sprite.createWithSpriteFrameName("bacayhuthuong_bg.png", cc.rect(15, 15, 4, 4));
        huThuongBg.setPreferredSize(cc.size(322, 47));
        huThuongBg.setPosition(cc.winSize.width / 2, 525);
        this.sceneLayer.addChild(huThuongBg);

        var huThuongLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "HŨ MẬU BINH: ");
        huThuongLabel.setPosition(huThuongBg.x - 75, huThuongBg.y);
        huThuongLabel.setColor(cc.color("#c1ceff"));
        this.sceneLayer.addChild(huThuongLabel);

        var huThuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
        huThuongValueLabel.setPosition(huThuongBg.x + 60, huThuongBg.y);
        huThuongValueLabel.setColor(cc.color("#ffde00"));
        this.sceneLayer.addChild(huThuongValueLabel);
        this.huThuongValueLabel = huThuongValueLabel;

        var timeLabel = new cc.LabelBMFont("", cc.res.font.Roboto_BoldCondensed_36_Glow);
        timeLabel.setPosition(huThuongBg.x, huThuongBg.y - 100);
        timeLabel.setScale(2.0);
        this.sceneLayer.addChild(timeLabel);
        this.timeLabel = timeLabel;

        var chatBt = new ccui.Button("ingame-chatBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        chatBt.setPosition(1120, 653);
        this.gameTopBar.addChild(chatBt);
        var thiz = this;
        chatBt.addClickEventListener(function () {
            var dialog = new ChatDialog();
            dialog.onTouchMessage = function (message) {
                thiz.sendChatMessage(message);
            };
            dialog.show();
        });
    },

    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50);
        playerMe.cardList = new CardList(cc.size(cc.winSize.width - 100,100));
        playerMe.cardList.setAnchorPoint(cc.p(0.5, 0.0));
        playerMe.cardList.setPosition(cc.winSize.width / 2, 100);
        this.sceneLayer.addChild(playerMe.cardList, 2);
        this.sceneLayer.addChild(playerMe, 1);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120 / cc.winSize.screenScale, 360);
        player1.cardList = new CardList(cc.size(cc.winSize.width / 3,100));
        player1.cardList.setPosition(player1.getPosition());
        this.sceneLayer.addChild(player1.cardList, 2);
        this.sceneLayer.addChild(player1, 1);

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width / 2, 650);
        player2.cardList = new CardList(cc.size(cc.winSize.width / 3,100));
        player2.cardList.setPosition(player2.getPosition());
        this.sceneLayer.addChild(player2.cardList, 2);
        this.sceneLayer.addChild(player2, 1);

        var player3 = new GamePlayer();
        player3.setPosition(120 * cc.winSize.screenScale, 360);
        player3.cardList = new CardList(cc.size(cc.winSize.width / 3,100));
        player3.cardList.setPosition(player3.getPosition());
        this.sceneLayer.addChild(player3.cardList, 2);
        this.sceneLayer.addChild(player3, 1);

        this.playerView = [playerMe, player1, player2, player3];
    },

    initButton: function () {
        var xepbaiBt = new ccui.Button("game-xepbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        xepbaiBt.setPosition(cc.winSize.width - 110, 50);
        this.xepbaiBt = xepbaiBt;
        this.sceneLayer.addChild(xepbaiBt);

        var xongBt = new ccui.Button("game-xongBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        xongBt.setPosition(cc.winSize.width - 310, 50);
        this.xongBt = xongBt;
        this.sceneLayer.addChild(xongBt);

        var startBt = new ccui.Button("game-startBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(xepbaiBt.getPosition());
        this.startBt = startBt;
        this.sceneLayer.addChild(startBt);

        var thiz = this;

        startBt.addClickEventListener(function () {
            thiz._controller.sendStartRequest();
        });

        xongBt.addClickEventListener(function () {
            thiz.xepBaiXong();
        });

        this.setIngameButtonVisible(false);
        this.setStartBtVisible(false);

        this.allButtons = [xepbaiBt, xongBt, startBt];
    },

    initController: function () {
        this._controller = new MauBinhController(this);
    },

    xepBaiXong:  function () {
        var cards = [];
        for (var i =0 ;i<this.playerView[0].cardList.cardList.length;i++){
            var cardObj = this.playerView[0].cardList.cardList[i];
            cards.push(CardList.prototype.getCardIdWithRank(cardObj.rank,cardObj.suit));
        }
        this._controller.sendXepBaiXong(cards);
    },

    setIngameButtonVisible: function (visible) {
        this.xepbaiBt.visible = visible;
        this.xongBt.visible = visible;
    },

    setStartBtVisible: function (visible) {
        this.startBt.visible = visible;
    },

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
                if (thiz.timeRemaining <= 0) {
                    thiz.timeLabel.setString("");
                    clearInterval(thiz.timeInterval);
                } else {
                    thiz.timeLabel.setString(thiz.timeRemaining);
                    thiz.timeRemaining--;
                }
            }, 1000);
        } else {
            this.timeLabel.setString("");
            this.timeRemaining = null;
        }
    },

    onTimeOut: function () {

    },
    performDealCards: function (cards) {
        this.playerView[0].cardList.dealCards(cards);
    },

    hideAllButton: function () {
        this.allButtons.forEach(function (item, index) {
            item.setVisible(false);
        })
    }
});