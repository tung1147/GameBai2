/**
 * Created by Quyet Nguyen on 8/30/2016.
 *
 *
 */

var MiniPokerScene = MiniGameScene.extend({
    ctor: function () {
        this._super();


        this.autoRoll = false;
        this.delta = 0;
        this.baseCardHeight = 0;
        this.cardHeight = 0;
        this.rollHeight = 0;
        this.rolling = false;
        this.rewardFund = [];
        this.cardLayoutMargin = (870 * cc.winSize.screenScale - 590) / 6 + 115 - 80 * cc.winSize.screenScale;
        this.activeReward = {};
        this.rewardGroup = [];
        this.rewardCardSprites = [];

        this.initConstant();
        this.initAvatarMe();
        this.initButton();
        this.initChip(cc.winSize.width / 2 + 100);

        this.cards = [];
        this.genCards();

        this.initScene();
        this.initRewards();

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
                if (!thiz.quaytudong)
                    return false;
                var p = thiz.quaytudong.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(
                        cc.rect(0, 0, thiz.quaytudong._getWidth(), thiz.quaytudong._getHeight()),
                        p
                    )) {
                    thiz.quaytudongClick();
                    return true;
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
            case 262: // cap nhat tien hu thuong
                var rewardFundArray = data["515"];
                if (rewardFundArray.length < 3)
                    return;
                this.rewardFund = rewardFundArray;
                this.updateRewardFund();
                break;

            case 261: //ket qua luot quay
                var rollId = data["512"];
                var rollResultArray = data["513"];
                var rewardCard = data["516"];
                var rewardRank = data["518"];
                var gameId = data["621"];
                var userGain = data["519"];
                this.genCards(rollResultArray);
                setTimeout(function () {
                    for (i = 0; i < 5; i++) {
                        thiz.cardSprites[i].setSpriteFrame(thiz.cards[i].rank + s_card_suit[thiz.cards[i].suit] + ".png");
                    }

                    //stop rolling
                    var index = 0;
                    var rollingInterval = setInterval(function () {
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
                            thiz.activateReward(rollId, rewardRank);
                            //thiz.quayBt.loadTextureNormal("quay1.png", ccui.Widget.PLIST_TEXTURE);
                            thiz.setFlashing(false);
                            clearInterval(rollingInterval);
                            // show reward cards
                            for (var i = 0; i < 5; i++)
                                thiz.rewardCardSprites[i].visible = (rewardCard >> i) & 1;

                            if (thiz.autoRoll) {
                                setTimeout(function () {
                                    if (thiz.autoRoll)
                                        thiz.onQuayBtClick();
                                }, 1500);
                            }
                        }
                    }, 500);
                }, 500);
                break;

            case 260: //update tien user
                var userGold = data["6"];
                //var userGain = data["519"];
                this.playerMe.setGold(userGold);
                break;

            case 4:
                var errorCode = data["ec"];
                if (errorCode == 92) {
                    MessageNode.getInstance().show("Không đủ tiền chơi");
                    this.rolling = false;
                    thiz.setFlashing(false);
                    for (var i = 0; i < 15; i++) {
                        thiz.cardSprites[i % 5].visible = true;
                        thiz.cardRollingSprites[i].visible = false;
                    }
                    break;
                }
                break;

            case 265:
                //danh sach cao thu
                var topEarningList = data["607"];
                for (var i = 0; i < topEarningList.length; i++) {
                    this.stat_board.addTopEarningEntry(i + 1, topEarningList[i]["609"],
                        cc.Global.NumberFormat1(topEarningList[i]["608"]));
                }
                break;

            case 266:
                //lich su choi
                var historyList = data["611"];
                for (var i = 0; i < historyList.length; i++) {
                    var rewardName = historyList[i]["616"] == 0 || historyList[i]["616"] < 10 ?
                        this.rewardGroup[historyList[i]["616"]].rewardNameLabel.getString()
                        : "Không ăn";
                    this.stat_board.addHistoryEntry(historyList[i]["612"],
                        historyList[i]["614"],
                        rewardName,
                        cc.Global.NumberFormat1(historyList[i]["615"]));
                }
                break;

            case 752:
                //lich su no hu thuong
                var rewardFundHistory = data["606"];
                for (var i = 0; i < rewardFundHistory.length; i++) {
                    this.stat_board.addRewardFundEntry(rewardFundHistory[i]["600"],
                        cc.Global.NumberFormat1(rewardFundHistory[i]["601"]),
                        rewardFundHistory[i]["603"],
                        cc.Global.NumberFormat1(rewardFundHistory[i]["602"]));
                }
                break;
        }
    },

    initScene: function () {

        var thiz = this;

        var miniPokerLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Mini Poker", cc.TEXT_ALIGNMENT_LEFT);
        miniPokerLabel.setAnchorPoint(cc.p(0.0, 0.5));
        miniPokerLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 48 * cc.winSize.screenScale);
        this.sceneLayer.addChild(miniPokerLabel);

        var classicLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Classic", cc.TEXT_ALIGNMENT_LEFT);
        classicLabel.setAnchorPoint(cc.p(0.0, 0.5));
        classicLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 15 - 70 * cc.winSize.screenScale);
        this.sceneLayer.addChild(classicLabel);

        var rollLayer = new cc.Sprite("#roll_bg.png");
        rollLayer.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2);
        rollLayer.setScale(cc.winSize.screenScale, 0.9);
        this.sceneLayer.addChild(rollLayer);


        var cards_border = ccui.Scale9Sprite.createWithSpriteFrameName("poker_cards_border.png", cc.rect(97, 97, 5, 3));
        cards_border.setPreferredSize(cc.size(870 * cc.winSize.screenScale, 275));
        cards_border.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 + 20);
        this.sceneLayer.addChild(cards_border);

        var resultLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        resultLabel.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 + 155);
        resultLabel.setColor(cc.color("#ffde00"));
        this.resultLabel = resultLabel;
        this.sceneLayer.addChild(resultLabel);

        var huthuongLabel = new cc.Sprite("#minipoker_huthuong.png");
        huthuongLabel.setPosition(cc.winSize.width / 2 - 105 * cc.winSize.screenScale, cc.winSize.height / 2 - 115);
        this.sceneLayer.addChild(huthuongLabel);

        var huthuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_BoldCondensed_36_Glow, "12.345.678", cc.TEXT_ALIGNMENT_CENTER);
        huthuongValueLabel.setPosition(cc.winSize.width / 2 - 130 * cc.winSize.screenScale, cc.winSize.height / 2 - 155);
        this.huThuongValueLabel = huthuongValueLabel;
        this.sceneLayer.addChild(huthuongValueLabel);

        var quayBt = new ccui.Button("videoQuayBtn.png", "", "", ccui.Widget.PLIST_TEXTURE);
        quayBt.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 139);
        quayBt.setZoomScale(0);
        quayBt.setScale(4 / 5);
        this.quayBt = quayBt;
        this.sceneLayer.addChild(quayBt);
        // var curQuayBtSprite = 1;
        // this.quayBtInterval = setInterval(function () {
        //     if (!thiz.rolling) {
        //         return;
        //     }
        //     curQuayBtSprite++;
        //     curQuayBtSprite = curQuayBtSprite > 3 ? 2 : curQuayBtSprite;
        //     thiz.quayBt.loadTextureNormal("quay" + curQuayBtSprite + ".png", ccui.Widget.PLIST_TEXTURE);
        // }, 200);

        this.initFlashing();

        quayBt.addClickEventListener(function () {
            thiz.onQuayBtClick();
        });

        var quaytudong = new cc.Sprite("#quaytudong.png");
        quaytudong.setPosition(cc.winSize.width / 2 + 434 * cc.winSize.screenScale, cc.winSize.height / 2 - 140);
        this.quaytudong = quaytudong;
        quaytudong.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(quaytudong);

        var clippingcards_layout = new ccui.Layout();
        clippingcards_layout.setContentSize(cards_border._getWidth() - 140 * cc.winSize.screenScale, cards_border._getHeight() - 125);
        clippingcards_layout.setClippingEnabled(true);
        clippingcards_layout.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingcards_layout.setPosition(cc.winSize.width / 2 + 240 * cc.winSize.screenScale - cards_border.width / 2, cc.winSize.height / 2 - 50);
        this.sceneLayer.addChild(clippingcards_layout);

        this.cardSprites = [];
        this.cardRollingSprites = [];
        this.baseCardHeight = clippingcards_layout.height / 2;
        for (i = 0; i < 5; i++) {
            var cardSprite = new cc.Sprite("#" + this.cards[i].rank + s_card_suit[this.cards[i].suit] + ".png");
            cardSprite.setPosition(i * (120 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin, clippingcards_layout.height / 2);
            clippingcards_layout.addChild(cardSprite);
            var rewardSprite = new cc.Sprite("#card_selected.png");
            rewardSprite.setPosition(cardSprite.getPosition());
            clippingcards_layout.addChild(rewardSprite);
            rewardSprite.setScale(1.05 / 1.5);
            var fadeIn = new cc.FadeIn(0.5);
            var fadeOut = new cc.FadeOut(0.5);
            rewardSprite.runAction(cc.RepeatForever(cc.Sequence(fadeIn, fadeOut)));
            // rewardSprite.visible = false;
            this.cardSprites.push(cardSprite);
            this.rewardCardSprites.push(rewardSprite);
        }
        this.cardHeight = clippingcards_layout.height;

        for (i = 0; i < 15; i++) {
            var cardSprite = new cc.Sprite("#card-motion" + (i % 3 + 1) + ".png");
            cardSprite.setPosition((i % 5) * (120 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin,
                clippingcards_layout.height / 2 + (i % 3 - 1) * clippingcards_layout.height);
            clippingcards_layout.addChild(cardSprite);
            cardSprite.setOpacity(128);
            cardSprite.visible = false;
            this.cardRollingSprites.push(cardSprite);
        }

        this.stat_board = new StatisticBoard();
    },
    onSelectChip: function (chipIndex) {
        if (this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString("" + cc.Global.NumberFormat1(this.rewardFund[chipIndex - 1]["514"]));
    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();
        var msg = {command: this.REWARD_FUND_REQUEST_CODE};
        LobbyClient.getInstance().send(msg);
        msg = {command: "getTopUsers", gameType: "Mini_Poker"};
        LobbyClient.getInstance().send(msg);
        msg = {command: "getExplosiveUsers", gameType: "Mini_Poker", skip: "0", limit: "20"};
        LobbyClient.getInstance().send(msg);
        msg = {command: "getMiniGameLogs", gameType: "Mini_Poker", skip: "0", limit: "20"};
        LobbyClient.getInstance().send(msg);
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        // clearInterval(this.quayBtInterval);
        LobbyClient.getInstance().send({command: 263});
        LobbyClient.getInstance().removeListener(this);
    },
    update: function (dt) {
        if (!this.baseCardHeight || !this.cardHeight || this.cards.length < 5
            || !this.rolling)
            return;
        this.rollHeight -= 40;

        this.rollHeight = this.rollHeight > 0 ? this.rollHeight : this.rollHeight + this.cardHeight * 3;
        for (i = 0; i < 15; i++) {
            if (!this.cards[i % 5].rolling) {
                continue;
            }
            this.cardRollingSprites[i].visible = true;
            var newY = this.baseCardHeight + (i % 3 - 1) * this.cardHeight + this.rollHeight;
            newY = newY > this.baseCardHeight + this.cardHeight ? newY - 2 * this.cardHeight
                : newY;
            this.cardRollingSprites[i].setPosition((i % 5) * (120 + 20 * cc.winSize.screenScale)
                * cc.winSize.screenScale + this.cardLayoutMargin, newY
            );
        }
    },
    initRewards: function () {
        var margin_left = 35 + 140 * cc.winSize.screenScale;
        var item_height = 50;
        this.rewardGroup.push({});
        var huthuong = new rewardItem("HŨ THƯỞNG");
        huthuong.setAnchorPoint(cc.p(0.0, 0.5));
        huthuong.setPosition(margin_left, 550);
        this.sceneLayer.addChild(huthuong);
        this.rewardGroup.push(huthuong);

        var thungphasanh = new rewardItem("THÙNG PHÁ SẢNH", 1000);
        thungphasanh.setAnchorPoint(cc.p(0.0, 0.5));
        thungphasanh.setPosition(margin_left, huthuong.getPositionY() - item_height);
        this.sceneLayer.addChild(thungphasanh);
        this.rewardGroup.push(thungphasanh);

        var tuquy = new rewardItem("TỨ QUÝ", 150);
        tuquy.setAnchorPoint(cc.p(0.0, 0.5));
        tuquy.setPosition(margin_left, thungphasanh.getPositionY() - item_height);
        this.sceneLayer.addChild(tuquy);
        this.rewardGroup.push(tuquy);

        var culu = new rewardItem("CỦ LŨ", 50);
        culu.setAnchorPoint(cc.p(0.0, 0.5));
        culu.setPosition(margin_left, tuquy.getPositionY() - item_height);
        this.sceneLayer.addChild(culu);
        this.rewardGroup.push(culu);

        var thung = new rewardItem("THÙNG", 20);
        thung.setPosition(margin_left, culu.getPositionY() - item_height);
        this.sceneLayer.addChild(thung);
        this.rewardGroup.push(thung);

        var sanh = new rewardItem("SẢNH", 13);
        sanh.setPosition(margin_left, thung.getPositionY() - item_height);
        this.sceneLayer.addChild(sanh);
        this.rewardGroup.push(sanh);

        var bala = new rewardItem("SÂM", 8);
        bala.setPosition(margin_left, sanh.getPositionY() - item_height);
        this.sceneLayer.addChild(bala);
        this.rewardGroup.push(bala);

        var haidoi = new rewardItem("HAI ĐÔI", 5);
        haidoi.setPosition(margin_left, bala.getPositionY() - item_height);
        this.sceneLayer.addChild(haidoi);
        this.rewardGroup.push(haidoi);

        var doijhoachon = new rewardItem("ĐÔI J HOẶC HƠN", 2.5);
        doijhoachon.setPosition(margin_left, haidoi.getPositionY() - item_height);
        this.sceneLayer.addChild(doijhoachon);
        this.rewardGroup.push(doijhoachon);
    },
    activateReward: function (id, rank) {
        if (this.activeReward instanceof rewardItem)
            this.activeReward.setActive(false);
        if (0 < id && id < 10) {
            this.activeReward = this.rewardGroup[id];
            this.activeReward.setActive(true);
            if (id == 3 || id == 7 || id == 9) {
                var result = "";
                switch (id) {
                    case 3:
                        result += "TỨ QUÝ ";
                        break;
                    case 7:
                        result += "BA LÁ ";
                        break;
                    case 9:
                        result += "ĐÔI ";
                        break;
                }
                switch (rank) {
                    case 12:
                        result += "ÁT";
                        break;
                    case 0:
                        result += "HAI";
                        break;
                    case 1:
                        result += "BA";
                        break;
                    case 2:
                        result += "BỐN";
                        break;
                    case 3:
                        result += "NĂM";
                        break;
                    case 4:
                        result += "SÁU";
                        break;
                    case 5:
                        result += "BẢY";
                        break;
                    case 6:
                        result += "TÁM";
                        break;
                    case 7:
                        result += "CHÍN";
                        break;
                    case 8:
                        result += "MƯỜI";
                        break;
                    case 9:
                        result += "J";
                        break;
                    case 10:
                        result += "Q";
                        break;
                    case 11:
                        result += "K";
                        break;
                }
                this.resultLabel.setString(result);
            }
            else
                this.resultLabel.setString(this.activeReward.rewardNameLabel.getString());
        }
        else {
            this.activeReward = {};
            this.resultLabel.setString("Không ăn");
        }

    },
    adjustAdd: function () {
    },
    adjustSub: function () {
    },
    quaytudongClick: function () {
        this.autoRoll = !this.autoRoll;
        this.quaytudong.setSpriteFrame(this.autoRoll ? "quaytudong_active.png" : "quaytudong.png");
        if (!this.rolling)
            this.onQuayBtClick();
    },
    genCards: function (cardarray) {
        for (i = 0; i < 5; i++) {
            var suitArray = [2, 3, 0, 1];
            var card = {};
            if (cardarray) {
                card = {
                    rank: (cardarray[i] + 1) % 13 + 1,
                    suit: suitArray[Math.floor(cardarray[i] / 13)],
                    rolling: false
                };
            }
            else {
                card = {
                    rank: Math.floor(Math.random() * 12) + 1,
                    suit: suitArray[Math.floor(Math.random() * 4)],
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
    },
    onQuayBtClick: function () {
        if (this.rolling)
            return;
        this.rolling = true;
        this.setFlashing(true);
        this.resultLabel.setString("");
        for (i = 0; i < 15; i++) {
            this.cardSprites[i % 5].visible = false;
            this.rewardCardSprites[i % 5].visible = false;
            this.cards[i % 5].rolling = true;
            this.cardRollingSprites[i].visible = true;
        }
        var thiz = this;
        var msg = {command: this.ROLL_COMMAND_CODE};
        msg["" + this.BET_AMOUNT_ID_CODE] = this.chipGroup.chipSelected.chipIndex;
        LobbyClient.getInstance().send(msg);
    },
    initConstant: function () {
        this.REWARD_FUND_REQUEST_CODE = 262;
        this.ROLL_COMMAND_CODE = 261;
        this.BET_AMOUNT_ID_CODE = 511;
        this.BET_AMOUNT_1000 = 1;
        this.BET_AMOUNT_10000 = 2;
        this.BET_AMOUNT_100000 = 3;
    },
    initFlashing: function () {
        //add two particle groups
        var quayTopParticle = new cc.Sprite("#quayTopParticle1.png");
        quayTopParticle.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 111);
        quayTopParticle.setScale(4 / 5);
        this.quayTopParticle = quayTopParticle;
        this.sceneLayer.addChild(quayTopParticle);

        var quayBtmParticle = new cc.Sprite("#quayBtmParticle1.png");
        quayBtmParticle.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 175);
        quayBtmParticle.setScale(4 / 5);
        this.quayBtmParticle = quayBtmParticle;
        this.sceneLayer.addChild(quayBtmParticle);

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
    },
    setFlashing: function (isFlashing) {
        this.quayTopParticle.stopAllActions();
        this.quayBtmParticle.stopAllActions();
        if (isFlashing) {
            this.quayTopParticle.runAction(this.quayTopAction);
            this.quayBtmParticle.runAction(this.quayBtmAction);
        }
    },
    updateRewardFund: function () {
        // called when the reward fund is changed or user select another bet amount
        var betAmountID = this.chipGroup.chipSelected.chipIndex;
        if (!this.rewardFund || this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString("" + cc.Global.NumberFormat1(this.rewardFund
                [this.chipGroup.chipSelected.chipIndex - 1]["514"]));
    },
    rankButtonHandler: function () {
        this.stat_board.showWithAnimationScale();
    }
});