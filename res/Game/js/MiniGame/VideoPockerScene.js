/**
 * Created by Quyet Nguyen on 8/30/2016.
 */
var rewardItem = cc.Node.extend({
    widthInPixel: 240,
    ctor: function () {
        this._super();
        this.widthInPixel = 320 * cc.winSize.screenScale;
        this.initItem.apply(this, arguments);
    },
    initItem: function () {
        var bg = ccui.Scale9Sprite.createWithSpriteFrameName("reward_bg.png", cc.rect(12, 12, 1, 1));
        bg.setPreferredSize(cc.size(this.widthInPixel, 40));
        this.bg = bg;
        this.addChild(bg);

        var bg_active = ccui.Scale9Sprite.createWithSpriteFrameName("reward_bg_active.png", cc.rect(28, 28, 1, 1));
        bg_active.setPreferredSize(cc.size(this.widthInPixel + 15, 40 + 15));
        var fadeIn = cc.FadeIn(0.5, cc.p(0, 0));
        var faceOut = cc.FadeOut(0.5, cc.p(300, 300));
        bg_active.runAction(cc.RepeatForever(cc.Sequence(fadeIn, faceOut)));
        this.bg_active = bg_active;
        bg_active.visible = false;
        this.addChild(bg_active);

        var rewardNameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "", cc.TEXT_ALIGNMENT_LEFT);
        rewardNameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        rewardNameLabel.setPosition(-this.widthInPixel / 2 + 40, this.height / 2);
        rewardNameLabel.setString(arguments[0] || "");
        rewardNameLabel.setColor(cc.color("#ffffab"));
        this.addChild(rewardNameLabel);
        this.rewardNameLabel = rewardNameLabel;

        var rewardXLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "", cc.TEXT_ALIGNMENT_RIGHT);
        rewardXLabel.setAnchorPoint(cc.p(1.0, 0.5));
        rewardXLabel.setPosition(this.widthInPixel / 2 - 10, this.height / 2);
        rewardXLabel.setColor(cc.color("#1a8cbc"));
        if (arguments[1])
            rewardXLabel.setString("X" + arguments[1]);
        this.addChild(rewardXLabel);
        this.rewardXLabel = rewardXLabel;

        var rewardIcon = new cc.Sprite("#rewardIcon.png");
        rewardIcon.setPosition(-this.widthInPixel / 2 + 20, 0);
        this.addChild(rewardIcon);
    },
    setRewardName: function (str) {
        if (this.rewardNameLabel)
            this.rewardNameLabel.setString(str);
    },
    setRewardX: function (str) {
        if (this.rewardXLabel)
            this.rewardXLabel.setString(str);
    },
    setActive: function (isActive) {
        this.bg.visible = !isActive;
        this.bg_active.visible = isActive;
        this.rewardXLabel.setColor(cc.color(isActive ? "#ffff00" : "#1a8cbc"));
    }
});


var VideoPockerScene = MiniGameScene.extend({
    ctor: function () {
        this._super();

        this.delta = 0;
        this.baseCardHeight = 0;
        this.cardHeight = 0;
        this.rollHeight = 0;
        this.rolling = false;
        this.rewardFund = [];
        this.cardLayoutMargin = (870 * cc.winSize.screenScale - 590) / 6 + 115 - 80 * cc.winSize.screenScale;
        this.turnstate = 0;
        this.rewardGroup = [];
        this.activeReward = {};
        this.rewardCardSprites = [];

        this.initAvatarMe();
        this.initButton();
        this.initChip(cc.winSize.width / 2 + 167 * cc.winSize.screenScale);

        this.cards = [];
        this.holdLayers = [];
        this.holdingList = [false, false, false, false, false];

        this.initScene();
        this.initRewards();
        this.genCards();

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                // if (touch.getLocation().x < cc.winSize.width / 2) {
                //     thiz.adjustAdd();
                // }
                // else {
                //     thiz.adjustSub();
                // }
                // return true;
                for (i = 0; i < thiz.cardSprites.length; i++) {
                    var p = thiz.cardSprites[i].convertToNodeSpace(touch.getLocation());
                    if (cc.rectContainsPoint(
                            cc.rect(0, 0, thiz.cardSprites[i]._getWidth(), thiz.cardSprites[i]._getHeight()),
                            p
                        )) {
                        thiz.holdClick(i);
                        return true;
                    }
                }
                return false;
            }
        }, this);
        LobbyClient.getInstance().addListener("miniGame", this.onSocketMessage, this);
        LobbyClient.getInstance().addListener("changeAsset", this.onSocketMessage, this);
    },
    onSocketMessage: function (command, data) {
        data = data["data"];
        if (command == "changeAsset"){
            this.onChangeAssets();
            return;
        }
        var thiz = this;
        switch (data["cmd"]) {
            case 717:// thong tin hu thuong
                var rewardFundArray = data["1"];
                if (rewardFundArray.length < 3)
                    return;
                this.rewardFund = rewardFundArray;
                this.updateRewardFund();
                break;

            case 711: //nhan thong tin 5 la dau tien
                var gameId = data["0"];
                var cards = data["1"];
                var suggestion = data["2"]["1"];
                setTimeout(function () {
                    thiz.genCards(cards);
                    thiz.turnstate = 1;

                    //stop rolling
                    var index = 0;
                    var rollingInterval = setInterval(function () {
                        while (index < 5 && thiz.holdingList[index])
                            index++;
                        thiz.cardSprites[index].visible = true;
                        thiz.cardRollingSprites[index].visible = false;
                        thiz.cardRollingSprites[index + 5].visible = false;
                        thiz.cardRollingSprites[index + 10].visible = false;
                        thiz.cards[index].rolling = false;

                        var basex = thiz.cardSprites[index].getPositionX();
                        var basey = thiz.cardSprites[index].getPositionY();

                        var duration = 0.1;
                        var move1 = cc.MoveTo(duration, cc.p(basex, basey - 20));
                        var move2 = cc.MoveTo(duration, cc.p(basex, basey));

                        if (!thiz.holdingList[index])
                            thiz.cardSprites[index].runAction(new cc.Sequence(move1, move2));
                        index++;
                        if (index >= 5) {
                            thiz.rolling = false;
                            this.turnstate = 1;
                            thiz.setQuayBtnState(false, false);
                            clearInterval(rollingInterval);

                            // hold suggestion
                            for (var i = 0; i < 5; i++) {
                                if ((suggestion >> i) & 1)
                                    thiz.holdClick(i);
                            }
                        }
                    }, 500);
                }, 1200);
                break;

            case 712: // thong tin 5 la sau khi hold
                var gameId = data["0"];
                var cards = data["1"];
                var rewardCards = data["3"]["1"];
                var rewardId = data["3"]["3"];
                var rewardAmount = data["5"];

                setTimeout(function () {
                    thiz.genCards(cards);
                    thiz.turnstate = 1;

                    //stop rolling
                    var index = 0;
                    var rollingInterval = setInterval(function () {
                        while (index < 4 && thiz.holdingList[index])
                            index++;
                        thiz.cardSprites[index].visible = true;
                        thiz.cardRollingSprites[index].visible = false;
                        thiz.cardRollingSprites[index + 5].visible = false;
                        thiz.cardRollingSprites[index + 10].visible = false;
                        thiz.cards[index].rolling = false;

                        var basex = thiz.cardSprites[index].getPositionX();
                        var basey = thiz.cardSprites[index].getPositionY();

                        var duration = 0.1;
                        var move1 = cc.MoveTo(duration, cc.p(basex, basey - 20));
                        var move2 = cc.MoveTo(duration, cc.p(basex, basey));

                        thiz.cardSprites[index].runAction(new cc.Sequence(move1, move2));
                        index++;
                        if (index >= 5) {
                            thiz.rolling = false;
                            thiz.setQuayBtnState(false, false);
                            thiz.resultLabel.setString(rewardAmount);
                            clearInterval(rollingInterval);

                            if (rewardId == 9) // thua
                            {
                                // ket thuc luot choi
                                thiz.turnstate = 0;
                                for (var i = 0; i < 5; i++) {
                                    thiz.holdingList[i] = false;
                                    thiz.holdLayers[i].visible = false;
                                    thiz.resultLabel.setString("0");
                                }
                            }
                            else {
                                // nguoi choi thang, cho phep x2
                                thiz.turnstate = 2;
                                thiz.setQuayBtnState(true, false);
                                thiz.activateReward(rewardId);

                                //hien thi cac la bai an va bo hold
                                for (var i = 0; i < 5; i++) {
                                    thiz.rewardCardSprites[i].visible = (rewardCards >> i) & 1;
                                    thiz.holdingList[i] = false;
                                    thiz.holdLayers[i].visible = false;
                                }
                            }
                        }
                    }, 500);
                }, 1200);
                break;

            case 715:
                //ket thuc luot choi
                thiz.resetBoard();
                break;

            case 718:
                //update tien nguoi choi
                var userGold = data["6"];
                this.playerMe.setGold(userGold);
                break;

            case 713:
                // request x2
                var rewardGold = data["1"];
                var cardId = data["2"];

                // hien thi ket qua server tra ve
                thiz.genCards([cardId, -1, -1, -1, -1]);
                thiz.turnstate = 3;
                break;

            case 714:
                // x2 result
                var rewardGold = data["1"];
                var firstCardId = data["2"];
                var remainCards = data["3"];
                var selectedPosition = data["4"];
                var resultId = data["5"];
                var genArray = [];
                genArray.push(firstCardId);
                genArray = genArray.concat(remainCards);
                thiz.revealCard(genArray, selectedPosition);
                thiz.resultLabel.setString(cc.Global.NumberFormat1(rewardGold));
                thiz.turnstate = 4;
                break;

            case 719:
                //error
                MessageNode.getInstance().show("Không đủ tiền để chơi");
                this.resetBoard();
                break;

            case 751:
                // danh sach cao thu
                var topEarningList = data["607"];
                for (var i = 0; i < topEarningList.length; i++) {
                    this.stat_board.addTopEarningEntry(i + 1, topEarningList[i]["609"],
                        cc.Global.NumberFormat1(topEarningList[i]["608"]));
                }
                break;

            case 752:
                // lich su no hu thuong
                var rewardFundHistory = data["606"];
                for (var i = 0; i < rewardFundHistory.length; i++) {
                    this.stat_board.addRewardFundEntry(rewardFundHistory[i]["600"],
                        cc.Global.NumberFormat1(rewardFundHistory[i]["601"]),
                        rewardFundHistory[i]["603"],
                        cc.Global.NumberFormat1(rewardFundHistory[i]["602"]));
                }
                break;

            case 750:
                // lich su choi
                var historyList = data["611"];
                for (var i = 0; i < historyList.length; i++) {
                    var rewardName = historyList[i]["616"] < 9 ? this.rewardGroup[historyList[i]["616"]].rewardNameLabel.getString()
                        : "Không ăn";
                    this.stat_board.addHistoryEntry(historyList[i]["612"],
                        historyList[i]["614"],
                        rewardName,
                        cc.Global.NumberFormat1(historyList[i]["615"]));
                }
                break;
        }
    },

    initScene: function () {

        var thiz = this;

        var miniPokerLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Video Poker", cc.TEXT_ALIGNMENT_LEFT);
        miniPokerLabel.setAnchorPoint(cc.p(0.0, 0.5));
        miniPokerLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 48 * cc.winSize.screenScale);
        this.sceneLayer.addChild(miniPokerLabel);

        var classicLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Classic", cc.TEXT_ALIGNMENT_LEFT);
        classicLabel.setAnchorPoint(cc.p(0.0, 0.5));
        classicLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 15 - 70 * cc.winSize.screenScale);
        this.sceneLayer.addChild(classicLabel);

        var rollLayer = new cc.Sprite("#roll_bg.png");
        rollLayer.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2);
        rollLayer.setScale(cc.winSize.screenScale, 1);
        this.sceneLayer.addChild(rollLayer);


        var cards_border = ccui.Scale9Sprite.createWithSpriteFrameName("poker_cards_border.png", cc.rect(97, 97, 5, 3));
        cards_border.setPreferredSize(cc.size(870 * cc.winSize.screenScale, 325));
        cards_border.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 + 25);
        this.sceneLayer.addChild(cards_border);

        var resultLabel = cc.Label.createWithBMFont(cc.res.font.videoPokerRewardFont, "0", cc.TEXT_ALIGNMENT_CENTER);
        resultLabel.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 + 175);
        this.resultLabel = resultLabel;
        this.sceneLayer.addChild(resultLabel);

        var resultIcon = cc.Sprite("#rewardIcon.png");
        resultIcon.setPosition(cc.winSize.width / 2 + 100 * cc.winSize.screenScale, resultLabel.getPositionY());
        resultIcon.setScale(1.2);
        this.sceneLayer.addChild(resultIcon);

        var huthuongLabel = new cc.Sprite("#minipoker_huthuong.png");
        huthuongLabel.setPosition(cc.winSize.width / 2 - 105 * cc.winSize.screenScale, cc.winSize.height / 2 - 140);
        this.sceneLayer.addChild(huthuongLabel);

        var huthuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_BoldCondensed_36_Glow, "1.000.000", cc.TEXT_ALIGNMENT_CENTER);
        huthuongValueLabel.setPosition(cc.winSize.width / 2 - 130 * cc.winSize.screenScale, cc.winSize.height / 2 - 175);
        this.huThuongValueLabel = huthuongValueLabel;
        this.sceneLayer.addChild(huthuongValueLabel);

        var quayBt = new ccui.Button("videoQuayBtn.png", "", "", ccui.Widget.PLIST_TEXTURE);
        quayBt.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 159);
        quayBt.setZoomScale(0);
        quayBt.setScale(4 / 5);
        this.quayBt = quayBt;
        this.sceneLayer.addChild(quayBt);

        this.initFlashing();

        quayBt.addClickEventListener(function () {
            thiz.onQuayBtClick();
        });

        var nhanthuongBt = new ccui.Button("btnNhanthuong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        nhanthuongBt.setPosition(cc.winSize.width / 2 + 434 * cc.winSize.screenScale, cc.winSize.height / 2 - 160);
        this.nhanthuongBt = nhanthuongBt;
        nhanthuongBt.addClickEventListener(function () {
            thiz.nhanthuongClick();
        });
        nhanthuongBt.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(nhanthuongBt);

        var clippingcards_layout = new ccui.Layout();
        this.clippingcards_layout = clippingcards_layout;
        clippingcards_layout.setContentSize(cards_border._getWidth() - 140 * cc.winSize.screenScale, cards_border._getHeight() - 100);
        clippingcards_layout.setClippingEnabled(true);
        clippingcards_layout.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingcards_layout.setPosition(cc.winSize.width / 2 + 240 * cc.winSize.screenScale - cards_border.width / 2, cc.winSize.height / 2 - 88);
        this.sceneLayer.addChild(clippingcards_layout);

        this.cardSprites = [];
        this.cardRollingSprites = [];
        this.baseCardHeight = clippingcards_layout.height / 2;
        for (i = 0; i < 5; i++) {
            var cardSprite = new cc.Sprite("#gp_card_up.png");
            cardSprite.setPosition(i * (122 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin,
                clippingcards_layout.height / 2 - 3);
            clippingcards_layout.addChild(cardSprite);
            cardSprite.setScale(1.5 * cc.winSize.screenScale);
            var rewardSprite = new cc.Sprite("#card_selected.png");
            rewardSprite.setPosition(cardSprite.getPosition());
            clippingcards_layout.addChild(rewardSprite);
            rewardSprite.setScale(1.05 * cc.winSize.screenScale);
            var fadeIn = new cc.FadeIn(0.5);
            var fadeOut = new cc.FadeOut(0.5);
            rewardSprite.runAction(cc.RepeatForever(cc.Sequence(fadeIn, fadeOut)));
            rewardSprite.visible = false;
            this.cardSprites.push(cardSprite);
            this.rewardCardSprites.push(rewardSprite);
        }
        this.cardHeight = clippingcards_layout.height;

        for (i = 0; i < 15; i++) {
            var cardSprite = new cc.Sprite("#card-motion" + (i % 3 + 1) + ".png");
            cardSprite.setPosition((i % 5) * (122 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin,
                clippingcards_layout.height / 2 + (i % 3 - 1) * clippingcards_layout.height);
            clippingcards_layout.addChild(cardSprite);
            cardSprite.setScale(1.5 * cc.winSize.screenScale);
            cardSprite.setOpacity(128);
            cardSprite.visible = false;
            this.cardRollingSprites.push(cardSprite);
        }

        for (i = 0; i < 5; i++) {
            var cardHold = new cc.Sprite("#videopoker_hold.png");
            cardHold.setPosition(i * (122 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin,
                clippingcards_layout.height / 2 - 10 * cc.winSize.screenScale);
            cardHold.setScale(182 / 265 * 1.5 * cc.winSize.screenScale);
            clippingcards_layout.addChild(cardHold);
            cardHold.visible = this.holdingList[i];
            this.holdLayers.push(cardHold);
        }
        this.stat_board = new StatisticBoard();
    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();
        var msg = {command: 716};
        LobbyClient.getInstance().send(msg);
        msg = {command: "getTopUsers", gameType: "Video_Poker"};
        LobbyClient.getInstance().send(msg);
        msg = {command: "getExplosiveUsers", gameType: "Video_Poker", skip: "0", limit: "20"};
        LobbyClient.getInstance().send(msg);
        msg = {command: "getMiniGameLogs", gameType: "Video_Poker", skip: "0", limit: "20"};
        LobbyClient.getInstance().send(msg);
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        LobbyClient.getInstance().removeListener(this);
        //clearInterval(this.quayBtInterval);
    },
    update: function (dt) {
        if (!this.baseCardHeight || !this.cardHeight || this.cards.length < 5
            || !this.rolling)
            return;
        this.rollHeight -= 40;

        this.rollHeight = this.rollHeight > 0 ? this.rollHeight : this.rollHeight + this.cardHeight * 3;
        for (i = 0; i < 15; i++) {
            if (!this.cards[i % 5].rolling || this.holdingList[i % 5]) {
                continue;
            }
            this.cardRollingSprites[i].visible = true;
            var newY = this.baseCardHeight + (i % 3 - 1) * this.cardHeight + this.rollHeight;
            newY = newY > this.baseCardHeight + this.cardHeight ? newY - 2 * this.cardHeight
                : newY;
            this.cardRollingSprites[i].setPosition(
                (i % 5) * (122 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin, newY
            );
        }
    },
    initRewards: function () {
        var margin_left = 35 + 140 * cc.winSize.screenScale;
        var item_height = 50;
        var huthuong = new rewardItem("hũ thưởng");
        huthuong.setAnchorPoint(cc.p(0.0, 0.5));
        huthuong.setPosition(margin_left, 550);
        this.sceneLayer.addChild(huthuong);
        this.rewardGroup.push(huthuong);

        var thungphasanh = new rewardItem("thùng phá sảnh", 50);
        thungphasanh.setAnchorPoint(cc.p(0.0, 0.5));
        thungphasanh.setPosition(margin_left, huthuong.getPositionY() - item_height);
        this.sceneLayer.addChild(thungphasanh);
        this.rewardGroup.push(thungphasanh);

        var tuquy = new rewardItem("tứ quý", 25);
        tuquy.setAnchorPoint(cc.p(0.0, 0.5));
        tuquy.setPosition(margin_left, thungphasanh.getPositionY() - item_height);
        this.sceneLayer.addChild(tuquy);
        this.rewardGroup.push(tuquy);

        var culu = new rewardItem("củ lũ", 9);
        culu.setAnchorPoint(cc.p(0.0, 0.5));
        culu.setPosition(margin_left, tuquy.getPositionY() - item_height);
        this.sceneLayer.addChild(culu);
        this.rewardGroup.push(culu);

        var thung = new rewardItem("thùng", 6);
        thung.setPosition(margin_left, culu.getPositionY() - item_height);
        this.sceneLayer.addChild(thung);
        this.rewardGroup.push(thung);

        //sanh , ba la, hai doi, doi j hoac hon

        var sanh = new rewardItem("sảnh", 4);
        sanh.setPosition(margin_left, thung.getPositionY() - item_height);
        this.sceneLayer.addChild(sanh);
        this.rewardGroup.push(sanh);

        var bala = new rewardItem("ba lá", 3);
        bala.setPosition(margin_left, sanh.getPositionY() - item_height);
        this.sceneLayer.addChild(bala);
        this.rewardGroup.push(bala);

        var haidoi = new rewardItem("hai đôi", 2);
        haidoi.setPosition(margin_left, bala.getPositionY() - item_height);
        this.sceneLayer.addChild(haidoi);
        this.rewardGroup.push(haidoi);

        var doijhoachon = new rewardItem("đôi j hoặc hơn", 1);
        doijhoachon.setPosition(margin_left, haidoi.getPositionY() - item_height);
        this.sceneLayer.addChild(doijhoachon);
        this.rewardGroup.push(doijhoachon);
    },
    adjustAdd: function () {
    },
    adjustSub: function () {
    },
    genCards: function (cardarray) {
        for (i = 0; i < 5; i++) {
            var suitArray = [2, 3, 0, 1];
            var card = {};
            if (cardarray) {
                card = {
                    rank: cardarray[i] != -1 ? ((cardarray[i] + 1) % 13 + 1) : 0,
                    suit: suitArray[Math.floor(cardarray[i] / 13)],
                    rolling: false
                };
            }
            else {
                card = {
                    rank: 0,
                    suit: 0,
                    rolling: false
                };
            }

            if (this.cards.length < 5)
                this.cards.push(card);
            else {
                this.cards[i].rank = card.rank;
                this.cards[i].suit = card.suit;
            }
        }
        for (i = 0; i < 5; i++) {
            if (this.cards[i].rank == 0) {
                this.cardSprites[i].setSpriteFrame("gp_card_up.png");
                continue;
            }
            this.cardSprites[i].setSpriteFrame(this.cards[i].rank + s_card_suit[this.cards[i].suit] + ".png");
        }
    },
    onQuayBtClick: function () {
        if (this.rolling || this.turnstate > 2)
            return;
        if (this.turnstate == 0 || this.turnstate == 1)
            this.rolling = true;

        //reset hold state
        if (this.turnstate == 0 || this.turnstate == 2) {
            for (var i = 0; i < 5; i++) {
                this.holdingList[i] = false;
                this.holdLayers[i].visible = false;
                this.rewardCardSprites[i].visible = false;
            }
        }
        if (this.turnstate == 0 || this.turnstate == 1) {
            this.setQuayBtnState(false, true);
            for (i = 0; i < 15; i++) {
                if (this.holdingList[i % 5])
                    continue;
                this.cardSprites[i % 5].visible = false;
                this.cards[i % 5].rolling = true;
                this.cardRollingSprites[i].visible = true;
            }
        }

        var thiz = this;
        var msg = {};
        if (this.turnstate == 0) {
            msg = {
                "1": this.chipGroup.chipSelected.chipIndex,
                command: 710
            };
        }
        else if (this.turnstate == 1) { // turn 2
            var hold = 0;
            for (var i = 0; i < 5; i++) {
                hold = hold | (this.holdingList[i] << i);
            }
            msg = {
                "1": hold,
                command: 712
            };
        } else if (this.turnstate == 2) {
            //request x2
            msg = {command: 713};
        }
        LobbyClient.getInstance().send(msg);
    },
    nhanthuongClick: function () {
        if (this.turnstate == 2) {
            for (var i = 0; i < 5; i++)
                this.rewardCardSprites[i].visible = false;
            var msg = {command: 715};
            LobbyClient.getInstance().send(msg);
        }
        if (this.turnstate == 4) {
            this.resetBoard();
        }
    },
    holdClick: function (holdIndex) {
        if (this.turnstate == 1) {
            this.holdingList[holdIndex] = !this.holdingList[holdIndex];
            this.holdLayers[holdIndex].visible = this.holdingList[holdIndex];
        }
        else if (this.turnstate == 3) {
            if (holdIndex == 0)
                return;
            var msg = {"1": holdIndex, command: 714};
            LobbyClient.getInstance().send(msg);
        }
    },
    initFlashing: function () {
        //add two particle groups
        var quayTopParticle = new cc.Sprite("#quayTopParticle1.png");
        quayTopParticle.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 131);
        quayTopParticle.setScale(4 / 5);
        this.quayTopParticle = quayTopParticle;
        this.sceneLayer.addChild(quayTopParticle);

        var quayBtmParticle = new cc.Sprite("#quayBtmParticle1.png");
        quayBtmParticle.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 195);
        quayBtmParticle.setScale(4 / 5);
        this.quayBtmParticle = quayBtmParticle;
        this.sceneLayer.addChild(quayBtmParticle);

        //quay particle animation
        var quayTopFrames = [];
        for (i = 1; i <= 2; i++) {
            var str = "quayTopParticle" + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            var animFrame = new cc.AnimationFrame();
            animFrame.initWithSpriteFrame(spriteFrame, 1, null);
            quayTopFrames.push(animFrame);
        }
        var quayTopAnimation = cc.Animation.create(quayTopFrames, 0.2, 2);
        var qtAction = cc.Animate.create(quayTopAnimation);
        qtAction.retain();
        this.quayTopAction = cc.RepeatForever(qtAction);
        this.quayTopAction.retain();

        var quayBtmFrames = [];
        for (i = 1; i <= 2; i++) {
            var str = "quayBtmParticle" + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            var animFrame = new cc.AnimationFrame();
            animFrame.initWithSpriteFrame(spriteFrame, 1, null);
            quayBtmFrames.push(animFrame);
        }
        var quayBtmAnimation = cc.Animation.create(quayBtmFrames, 0.2, 2);
        var qbAction = cc.Animate.create(quayBtmAnimation);
        qbAction.retain();
        this.quayBtmAction = cc.RepeatForever(qbAction);
        this.quayBtmAction.retain();

        //x2 particle animation
        var x2TopFrames = [];
        for (i = 1; i <= 2; i++) {
            var str = "x2TopParticle" + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            var animFrame = new cc.AnimationFrame();
            animFrame.initWithSpriteFrame(spriteFrame, 1, null);
            x2TopFrames.push(animFrame);
        }
        var x2TopAnimation = cc.Animation.create(x2TopFrames, 0.2, 2);
        var xtAction = cc.Animate.create(x2TopAnimation);
        xtAction.retain();
        this.x2TopAction = cc.RepeatForever(xtAction);
        this.x2TopAction.retain();

        var x2BtmFrames = [];
        for (i = 1; i <= 2; i++) {
            var str = "x2BtmParticle" + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            var animFrame = new cc.AnimationFrame();
            animFrame.initWithSpriteFrame(spriteFrame, 1, null);
            x2BtmFrames.push(animFrame);
        }
        var x2BtmAnimation = cc.Animation.create(x2BtmFrames, 0.2, 2);
        var xbAction = cc.Animate.create(x2BtmAnimation);
        xbAction.retain();
        this.x2BtmAction = cc.RepeatForever(xbAction);
        this.x2BtmAction.retain();
    },

    setQuayBtnState: function (isX2Enabled, isFlashing) {
        this.quayBt.loadTextureNormal(isX2Enabled ? "videoX2Btn.png" : "videoQuayBtn.png",
            ccui.Widget.PLIST_TEXTURE);
        this.quayTopParticle.stopAllActions();
        this.quayBtmParticle.stopAllActions();
        if (isFlashing) {
            this.quayTopParticle.runAction(isX2Enabled ? this.x2TopAction : this.quayTopAction);
            this.quayBtmParticle.runAction(isX2Enabled ? this.x2BtmAction : this.quayBtmAction);
        }
    },
    updateRewardFund: function () {
        var betAmountID = this.chipGroup.chipSelected.chipIndex;
        if (!this.rewardFund || this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString("" + cc.Global.NumberFormat1(this.rewardFund
                [betAmountID - 1]["2"]));
    },
    onSelectChip: function (chipIndex) {
        if (this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString("" + cc.Global.NumberFormat1(this.rewardFund[chipIndex - 1]["2"]));
    },
    activateReward: function (id) {
        if (this.activeReward instanceof rewardItem)
            this.activeReward.setActive(false);
        if (id < 9) {
            this.activeReward = this.rewardGroup[id];
            this.activeReward.setActive(true);
        }
        else {
            this.activeReward = {};
        }
    },
    revealCard: function (genArray, selectedPos) {
        //this.genCards(genArray);
        var selectedSprite = new cc.Sprite("#card_selected.png");
        selectedSprite.setScale(1.05 * cc.winSize.screenScale);
        selectedSprite.setPosition(this.cardSprites[selectedPos].getPosition());
        var fadeIn = cc.FadeIn(0.5);
        var fadeOut = cc.FadeOut(0.5);
        selectedSprite.runAction(cc.RepeatForever(cc.Sequence(fadeIn, fadeOut)));
        this.clippingcards_layout.addChild(selectedSprite);
        this.selectedSprite = selectedSprite;

        this.genCards(genArray);
    },
    resetBoard: function () {
        this.turnstate = 0;
        this.setQuayBtnState(false, false);
        this.activateReward(11);// deactive reward
        this.genCards();
        this.resultLabel.setString("0");
        if (this.selectedSprite instanceof cc.Sprite) {
            this.selectedSprite.removeFromParent(true);
            this.selectedSprite = null;
        }
        for (var i = 0; i < 5; i++) {
            this.holdingList[i] = false;
            this.holdLayers[i].visible = false;
        }
    },
    rankButtonHandler: function () {
        this.stat_board.showWithAnimationScale();
    }
});