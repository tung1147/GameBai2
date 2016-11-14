/**
 * Created by Quyet Nguyen on 8/30/2016.
 */

var CaoThapScene = MiniGameScene.extend({
    ctor: function () {
        this._super();

        this.initAvatarMe();
        this.initButton();
        this.initConstant();
        this.initChip(cc.winSize.width / 2);

        this.initScene();
        this.delta = 0;

        this.result = 0;
        this.rewardFund = [];
        this.onCooldown = false;

        this.remainingTime = 0;

        /*
         turnstate
         0 = chua bat dau
         1 = con luot
         2 = het luot
         */
        this.turnstate = 0;
        this.rolling = false;
        var thiz = this;

        this.turnTimer = setInterval(function () {
            thiz.onTimer();
        }, 1000);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if (!thiz.card)
                    return false;
                var p = thiz.card.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(
                        cc.rect(0, 0, thiz.card._getWidth(), thiz.card._getHeight()),
                        p
                    )) {
                    thiz.onCardClick();
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
        switch (data["cmd"]) {
            //cap nhat hu thuong
            case this.REWARD_FUND_REQUEST_CODE:
                var rewardFundList = data["" + this.REWARD_FUND_LIST_CODE];
                if (rewardFundList.length < 3)
                    return;
                this.rewardFund = rewardFundList;
                this.updateRewardFund();
                break;

            //Lay dc card dau tien
            case this.FIRST_CARD_REQUEST_CODE:
                var cardId = data["" + this.FIRST_CARD_ID_CODE];
                var currentBankValue = data["" + this.CURRENT_BANK_AMOUNT_CODE];
                var highReward = data["" + this.HIGH_REWARD_AMOUNT_CODE];
                var lowReward = data["" + this.LOW_REWARD_AMOUNT_CODE];
                var gameId = data["" + this.GAME_ID_CODE];
                var thiz = this;
                cc.log("" + cardId);

                var cooldownTimer = setInterval(function () {
                    if (thiz.onCooldown)
                        return;
                    thiz.rolling = false;
                    thiz.turnstate = 1;
                    thiz.remainingTime = 120;
                    var rank = (cardId + 1) % 13 + 1;
                    var suitArray = [2, 3, 0, 1];
                    var suit = suitArray[Math.floor(cardId / 13)];
                    thiz.result = rank * 4 + suit;
                    thiz.setCard(rank * 4 + suit);
                    thiz.pushKing(rank == 13);
                    thiz.highValueLabel.setString("" + highReward);
                    thiz.lowValueLabel.setString("" + lowReward);
                    thiz.bankValueLabel.setString("" + currentBankValue);
                    thiz.tipLabel.setString("Quân tiếp theo cao hơn hay thấp hơn?");
                    clearInterval(cooldownTimer);
                }, 100);

                break;

            //doan cao thap
            case this.PREDICT_COMMAND_CODE:
                cc.log(JSON.stringify(data));
                var thiz = this;
                var cardId = data["" + this.RESULT_CARD_ID_CODE];
                var resultId = data["" + this.RESULT_ID_CODE];
                var currentBankValue = data["" + this.CURRENT_BANK_AMOUNT_CODE];
                var totalHighEarning = data["" + this.TOTAL_HIGH_EARNING_CODE];
                var totalLowEarning = data["" + this.TOTAL_LOW_EARNING_CODE];
                var totalEarning = data["" + this.TOTAL_USER_EARNING_CODE];
                var highReward = data["" + this.HIGH_REWARD_AMOUNT_CODE];
                var lowReward = data["" + this.LOW_REWARD_AMOUNT_CODE];

                var cooldownTimer = setInterval(function () {
                    if (thiz.onCooldown)
                        return;
                    thiz.rolling = false;
                    thiz.turnstate = 1;
                    thiz.remainingTime = 120;
                    var rank = (cardId + 1) % 13 + 1;
                    var suitArray = [2, 3, 0, 1];
                    var suit = suitArray[Math.floor(cardId / 13)];
                    thiz.result = rank * 4 + suit;
                    thiz.setCard(rank * 4 + suit);
                    thiz.highValueLabel.setString("" + highReward);
                    thiz.lowValueLabel.setString("" + lowReward);
                    thiz.bankValueLabel.setString("" + currentBankValue);
                    thiz.luotMoiBt.visible = true;
                    switch (resultId) {
                        // thang
                        case 0:
                        case "0":
                        case 1:
                        case "1":
                            thiz.turnstate = 1;
                            thiz.tipLabel.setString("Quân tiếp theo cao hơn hay thấp hơn?");
                            thiz.pushKing(rank == 13);
                            break;

                        // thua
                        case 2:
                        case "2":
                            thiz.turnstate = 2;
                            thiz.tipLabel.setString("Bạn chọn sai, chúc bạn may mắn lần sau!");
                            break;

                        //thang lon
                        case 3:
                        case "3":
                            //
                            break;
                    }
                    clearInterval(cooldownTimer);
                }, 100);

                break;
            case this.USER_GOLD_REQUEST_CODE:
                var userGold = data["" + this.USER_GOLD_ID_CODE];
                this.playerMe.setGold(userGold);
                break;

            case this.ERROR_COMMAND_CODE:
                switch (data["ec"]) {
                    case this.NOT_ENOUGH_GOLD_ERROR_CODE : //khong du tien
                        MessageNode.getInstance().show("Không đủ tiền chơi");
                        this.rolling = this.onCooldown = false;
                        this.turnstate = 0;
                        break;
                }
                break;

            case this.REWARD_FUND_WIN_HISTORY_REQUEST_CODE:
                //lich su no hu thuong
                var rewardFundHistory = data["606"];
                for (var i = 0; i < rewardFundHistory.length; i++) {
                    this.stat_board.addRewardFundEntry(rewardFundHistory[i]["600"],
                        cc.Global.NumberFormat1(rewardFundHistory[i]["601"]),
                        rewardFundHistory[i]["603"],
                        cc.Global.NumberFormat1(rewardFundHistory[i]["602"]));
                }
                break;

            case this.TOP_EARNING_LIST_COMMAND:
                // danh sach cao thu
                var topEarningList = data["607"];
                for (var i = 0; i < topEarningList.length; i++) {
                    this.stat_board.addTopEarningEntry(i + 1, topEarningList[i]["609"],
                        cc.Global.NumberFormat1(topEarningList[i]["608"]));
                }
                break;

            case this.USER_HISTORY_REQUEST_CODE:
                var historyList = data["611"];
                for (var i = 0; i < historyList.length; i++) {
                    var rewardName = ["Thắng", "Hòa", "Thua"];
                    this.stat_board.addHistoryEntry(historyList[i]["612"],
                        historyList[i]["614"],
                        rewardName[historyList[i]["616"]],
                        cc.Global.NumberFormat1(historyList[i]["615"]));
                }
                break;
        }
    },
    onSelectChip: function (chipIndex) {
        if (this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString("" + this.rewardFund[chipIndex - 1][this.REWARD_FUND_AMOUNT_CODE]);
    },
    initScene: function () {
        var hiloLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Hi - Lo", cc.TEXT_ALIGNMENT_LEFT);
        hiloLabel.setAnchorPoint(cc.p(0.0, 0.5));
        hiloLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 48 * cc.winSize.screenScale);
        this.sceneLayer.addChild(hiloLabel);

        var hiloLabel_vn = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Cao - Thấp", cc.TEXT_ALIGNMENT_LEFT);
        hiloLabel_vn.setAnchorPoint(cc.p(0.0, 0.5));
        hiloLabel_vn.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 15 - 70 * cc.winSize.screenScale);
        this.sceneLayer.addChild(hiloLabel_vn);

        var huThuongLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Hũ Thưởng", cc.TEXT_ALIGNMENT_CENTER);
        huThuongLabel.setPosition(100, 565);
        this.sceneLayer.addChild(huThuongLabel);

        var huThuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "1.000.000.000", cc.TEXT_ALIGNMENT_CENTER);
        huThuongValueLabel.setPosition(100, 525);
        huThuongValueLabel.setColor(cc.color("#ffde00"));
        this.huThuongValueLabel = huThuongValueLabel;
        this.sceneLayer.addChild(huThuongValueLabel);

        var huThuongValueIcon = new cc.Sprite("#ingame-goldIcon.png");
        huThuongValueIcon.setPosition(100, 460);
        huThuongValueIcon.setScale(1.4);
        this.sceneLayer.addChild(huThuongValueIcon);

        var bankValueIcon = new cc.Sprite("#ingame-goldIcon.png");
        bankValueIcon.setPosition(cc.winSize.width / 2, 670);
        bankValueIcon.setScale(1.4);
        this.sceneLayer.addChild(bankValueIcon);

        var bankValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0", cc.TEXT_ALIGNMENT_CENTER);
        bankValueLabel.setPosition(cc.winSize.width / 2, 630);
        bankValueLabel.setColor(cc.color("ffde00"));
        this.sceneLayer.addChild(bankValueLabel);
        this.bankValueLabel = bankValueLabel;

        var tipLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "", cc.TEXT_ALIGNMENT_CENTER);
        tipLabel.setPosition(cc.winSize.width / 2, huThuongLabel.getPositionY());
        this.sceneLayer.addChild(tipLabel);
        this.tipLabel = tipLabel;

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_40, "", cc.TEXT_ALIGNMENT_CENTER);
        timeLabel.setPosition(cc.winSize.width / 2, tipLabel.getPositionY() - 50);
        timeLabel.setColor(cc.color("#ffde00"));
        this.sceneLayer.addChild(timeLabel);
        this.timeLabel = timeLabel;

        var highBt = new ccui.Button("minigame-highBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        highBt.setScale(cc.winSize.screenScale);
        highBt.setZoomScale(0.05);
        highBt.setPosition(cc.winSize.width / 2 - 240 * cc.winSize.screenScale, 344);
        this.sceneLayer.addChild(highBt);
        this.highBt = highBt;

        var highValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "0", cc.TEXT_ALIGNMENT_CENTER);
        highValueLabel.setPosition(highBt.getPositionX(), highBt.getPositionY() - 105 * cc.winSize.screenScale);
        highValueLabel.setColor(cc.color("#ffde00"));
        this.highValueLabel = highValueLabel;
        this.sceneLayer.addChild(highValueLabel);

        var highTip = new cc.Sprite("#klacaonhat.png");
        highTip.setPosition(highValueLabel.getPositionX(), highValueLabel.getPositionY() - 40);
        this.sceneLayer.addChild(highTip);

        var lowBt = new ccui.Button("minigame-lowBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        lowBt.setScale(cc.winSize.screenScale);
        lowBt.setZoomScale(0.05);
        lowBt.setPosition(cc.winSize.width / 2 + 240 * cc.winSize.screenScale, highBt.y);
        this.sceneLayer.addChild(lowBt);
        this.lowBt = lowBt;

        var lowValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "0", cc.TEXT_ALIGNMENT_CENTER);
        lowValueLabel.setPosition(lowBt.getPositionX(), highValueLabel.getPositionY());
        lowValueLabel.setColor(cc.color("#ffde00"));
        this.lowValueLabel = lowValueLabel;
        this.sceneLayer.addChild(lowValueLabel);

        var lowTip = new cc.Sprite("#alathapnhat.png");
        lowTip.setPosition(lowValueLabel.getPositionX(), highTip.getPositionY());
        this.sceneLayer.addChild(lowTip);

        var luotMoiBt = new ccui.Button("luotmoi.png", "", "", ccui.Widget.PLIST_TEXTURE);
        luotMoiBt.setScale(cc.winSize.screenScale);
        luotMoiBt.setPosition(cc.winSize.width - 150 * cc.winSize.screenScale, 60);
        luotMoiBt.visible = false;
        this.sceneLayer.addChild(luotMoiBt);
        this.luotMoiBt = luotMoiBt;

        var questionIcon = new cc.Sprite("#question.png");
        questionIcon.setPosition(cc.winSize.width - 100, 525);
        this.sceneLayer.addChild(questionIcon);

        var card = new cc.Sprite("#gp_card_up.png");
        card.setScale(2 * cc.winSize.screenScale);
        card.setPosition(cc.winSize.width / 2, highBt.y);
        this.sceneLayer.addChild(card);
        this.card = card;

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("minigame-bg1.png", cc.rect(20, 20, 4, 4));
        bg1.setPosition(cc.winSize.width / 2, 655);
        bg1.setPreferredSize(cc.size(350, 94));
        this.sceneLayer.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("minigame-bg1.png", cc.rect(20, 20, 4, 4));
        bg2.setPreferredSize(cc.size(94, 350));
        bg2.setPosition(100, 323);
        this.sceneLayer.addChild(bg2);

        var bg3 = ccui.Scale9Sprite.createWithSpriteFrameName("minigame-bg1.png", cc.rect(20, 20, 4, 4));
        bg3.setPreferredSize(bg2.getPreferredSize());
        bg3.setPosition(cc.winSize.width - 100, bg2.y);
        this.sceneLayer.addChild(bg3);

        this.kingCards = [];
        for (var i = 0; i < 3; i++) {
            var kingCard = new cc.Sprite("#minigame-kingCard1.png");
            kingCard.setPosition(bg2.x, 230 + 80 * i);
            kingCard.activated = false;
            this.kingCards.push(kingCard);
            this.sceneLayer.addChild(kingCard);
        }

        var size = cc.size(bg3.getContentSize().width - 4, bg3.getContentSize().height - 4);
        var clippingNode = new ccui.Layout();
        clippingNode.setContentSize(size);
        clippingNode.setClippingEnabled(true);
        clippingNode.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingNode.setPosition(bg3.x - size.width / 2, bg3.y - size.height / 2);
        this.sceneLayer.addChild(clippingNode);

        var margin = 20.0;
        var padding = 10.0;
        var cardHeight = 123.0;
        this.cardScale = 0.7;
        this.historyMove = cc.p(bg3.x, bg3.y + size.height / 2 - margin - (cardHeight * this.cardScale / 2));
        this.historyListMoveTo = cc.p(0.0, -(cardHeight * this.cardScale + padding));

        var historyList = new newui.TableView(size, 1);
        historyList.setMargin(margin, margin, 0, 0);
        historyList.setPadding(padding);
        historyList.setScrollBarEnabled(false);
        clippingNode.addChild(historyList);
        this.historyList = historyList;

        var thiz = this;
        luotMoiBt.addClickEventListener(function () {
            thiz.onLuotMoiBtClick();
        });
        highBt.addClickEventListener(function () {
            thiz.onHighBtClick();
        });
        lowBt.addClickEventListener(function () {
            thiz.onLowBtClick();
        });

        this.stat_board = new StatisticBoard();
    },
    addHistory: function (data) {
        var duration = 0.5;
        var cardImg = "#" + data.rank + s_card_suit[data.suit] + ".png";

        var cardMove = new cc.Sprite(cardImg);
        cardMove.setPosition(this.card.getPosition());
        cardMove.setScale(this.card.getScale());
        var moveAction = new cc.Spawn(new cc.MoveTo(duration, this.historyMove), new cc.ScaleTo(duration, this.cardScale));
        var finishAction = new cc.CallFunc(function () {
            cardMove.removeFromParent(true);
        });
        this.sceneLayer.addChild(cardMove);
        cardMove.runAction(new cc.Sequence(moveAction, finishAction));

        var list = this.historyList;
        var thiz = this;
        list.stopAllActions();
        list.jumpToTop();
        var move2 = cc.MoveTo(duration, this.historyListMoveTo);
        var finished2 = cc.CallFunc(function () {
            list.y = 0;
            var card = new cc.Sprite(cardImg);
            card.setScale(thiz.cardScale);
            list.insertItem(card, 0);
        });
        list.runAction(new cc.Sequence(move2, finished2));
    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();

        var msg = {
            command: "53"
        };
        LobbyClient.getInstance().send(msg);
        msg = {command: "getTopUsers", gameType: "Mini_Cao_Thap"};
        LobbyClient.getInstance().send(msg);
        msg = {command: "getExplosiveUsers", gameType: "Mini_Cao_Thap", skip: "0", limit: "20"};
        LobbyClient.getInstance().send(msg);
        msg = {command: "getMiniGameLogs", gameType: "Mini_Cao_Thap", skip: "0", limit: "20"};
        LobbyClient.getInstance().send(msg);
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        LobbyClient.getInstance().send({command: 52});
        LobbyClient.getInstance().removeListener(this);
        if (this.turnTimer)
            clearInterval(this.turnTimer);
    },
    update: function (dt) {
        if (this.rolling) {
            // dang quay
            this.delta += dt;
            // if (this.delta < 0.1)
            //     return;
            var randNum = Math.floor(Math.random() * 51 + 4);
            var thiz = this;
            thiz.setCard(randNum);
            this.delta = 0;
        }
    },
    onCardClick: function () {
        if (this.turnstate == 0) {
            // turn dau tien
            var msg = {
                command: "" + this.FIRST_CARD_REQUEST_CODE
            };
            msg["" + this.BET_AMOUNT_ID_CODE] = this.chipGroup.chipSelected.chipIndex;
            LobbyClient.getInstance().send(msg);
            console.log("onCardClick");
            this.rollCard();
        }
    },
    onLuotMoiBtClick: function () {
        this.result = 0;
        this.bankValueLabel.setString("0");
        this.luotMoiBt.visible = false;
        this.historyList.removeAllItems();
        this.card.setSpriteFrame("gp_card_up.png");
        this.timeLabel.setString("");
        this.turnstate = 0;

        msg = {
            command: "57"
        };
        LobbyClient.getInstance().send(msg);
    },
    onHighBtClick: function () {
        if (this.turnstate != 1 || this.rolling)
            return;
        var msg = {
            command: "" + this.PREDICT_COMMAND_CODE
        };
        msg["" + this.USER_PREDICT_ID_CODE] = this.PREDICT_HIGH;
        LobbyClient.getInstance().send(msg);
        this.rollCard();
    },
    onLowBtClick: function () {
        if (this.turnstate != 1 || this.rolling)
            return;
        var msg = {
            command: "" + this.PREDICT_COMMAND_CODE
        };
        msg["" + this.USER_PREDICT_ID_CODE] = this.PREDICT_LOW;
        LobbyClient.getInstance().send(msg);
        this.rollCard();
    },
    rollCard: function () {
        if (this.rolling)
            return;
        this.rolling = true;
        var thiz = this;
        this.onCooldown = true;
        var cardData = {};
        cardData.rank = Math.floor(this.result / 4);
        cardData.suit = this.result % 4;
        console.log("" + cardData.rank);
        if (cardData.rank != 0)
            thiz.addHistory(cardData);

        setTimeout(function () {
            thiz.onCooldown = false;
        }, 1000);
        // setTimeout(function () {
        //     thiz.rolling = false;
        //     res = Math.floor(Math.random() * 12 + 1);// result
        //     thiz.setCard(res);
        //     if (thiz.turnstate == 0) {
        //         // roll lan dau
        //         thiz.onRightPredict(res);
        //         return;
        //     }
        //     if (res >= thiz.result && thiz.predict == 1) {
        //         thiz.onRightPredict(res);
        //         return;
        //     }
        //     if (res <= thiz.result && thiz.predict == 2) {
        //         thiz.onRightPredict(res);
        //         return;
        //     }
        //     // doan sai
        //     thiz.tipLabel.setString("Bạn chọn sai, chúc bạn may mắn lần sau!");
        //     thiz.timeLabel.setString("");
        //     thiz.bankValueLabel.setString("0");
        //     thiz.turnstate = 2;
        //     thiz.luotMoiBt.visible = true;
        // }, 1000);
    },
    setCard: function (cardNum) {
        // if (cardNum < 4 || cardNum > 55)
        //     console.log(cardNum);
        this.card.setSpriteFrame("" + Math.floor(cardNum / 4) +
            s_card_suit[cardNum % 4] + ".png");
    },
    onRollResult: function () {

    },
    onTimer: function () {
        if (this.turnstate == 1) {
            this.remainingTime -= 1;

            this.timeLabel.setString("" + Math.floor(this.remainingTime / 60) + " : " + this.remainingTime % 60);
            if (this.remainingTime <= 0) {
                Math.random() < 0.5 ? this.onLowBtClick() : this.onHighBtClick();
            }
        }
    },

    updateRewardFund: function () {
        // called when the reward fund is changed or user select another bet amount
        var betAmountID = this.chipGroup.chipSelected.chipIndex;
        if (!this.rewardFund || this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString(this.rewardFund[betAmountID - 1]["" + this.REWARD_FUND_AMOUNT_CODE]);
    },

    initConstant: function () {
        this.ENTER_COMMAND_CODE = 53;
        this.FIRST_CARD_REQUEST_CODE = 54;
        this.BET_AMOUNT_ID_CODE = 506;
        this.BET_AMOUNT_1000 = 1;
        this.BET_AMOUNT_10000 = 2;
        this.BET_AMOUNT_100000 = 3;
        this.FIRST_CARD_ID_CODE = 507;
        this.CURRENT_BANK_AMOUNT_CODE = 513;
        this.HIGH_REWARD_AMOUNT_CODE = 517;
        this.LOW_REWARD_AMOUNT_CODE = 518;
        this.GAME_ID_CODE = 621;
        this.USER_PREDICT_ID_CODE = 509;
        this.PREDICT_HIGH = 1;
        this.PREDICT_LOW = 2;
        this.PREDICT_COMMAND_CODE = 55;
        this.RESULT_CARD_ID_CODE = 508;
        this.RESULT_ID_CODE = 510;
        this.TOTAL_HIGH_EARNING_CODE = 514;
        this.TOTAL_LOW_EARNING_CODE = 515;
        this.TOTAL_USER_EARNING_CODE = 516;
        this.RESULT_ID_WIN = 0;
        this.RESULT_ID_DRAW = 1;
        this.RESULT_ID_LOSE = 2;
        this.RESULT_ID_BIGWIN = 3;
        this.REWARD_FUND_AMOUNT_CODE = 512;
        this.BET_AMOUNT_CODE = 520;
        this.USER_GOLD_REQUEST_CODE = 56;
        this.USER_GOLD_ID_CODE = 6;
        this.EXIT_LOBBY_COMMAND_CODE = 52;
        this.REWARD_FUND_WIN_HISTORY_REQUEST_CODE = 51;
        this.REWARD_FUND_WIN_HISTORY_FROM_CODE = 604;
        this.REWARD_FUND_WIN_HISTORY_LIMIT_CODE = 605;
        this.REWARD_FUND_WIN_HISTORY_LIST_CODE = 606;
        this.REWARD_FUND_WIN_HISTORY_DATE_CODE = 600;
        this.REWARD_FUND_WIN_HISTORY_BET_AMOUNT_CODE = 601;
        this.REWARD_FUND_WIN_HISTORY_REWARD_AMOUNT_CODE = 602;
        this.REWARD_FUND_WIN_HISTORY_USERNAME_CODE = 603;
        this.TOP_EARNING_LIST_COMMAND = 50;
        this.TOP_EARNING_LIST_LIMIT_CODE = 610;
        this.TOP_EARNING_LIST_LIST_CODE = 607;
        this.TOP_EARNING_USER_EARNING_CODE = 608;
        this.TOP_EARNING_USERNAME_CODE = 609;
        this.USER_HISTORY_REQUEST_CODE = 49;
        this.USER_HISTORY_FROM_CODE = 617;
        this.USER_HISTORY_LIMIT_CODE = 618;
        this.USER_HISTORY_LIST_CODE = 611;
        this.USER_HISTORY_DATE_CODE = 612;
        this.USER_HISTORY_CARDS_CODE = 614;
        this.USER_HISTORY_EARNING_CODE = 615;
        this.USER_HISTORY_RESULT_CODE = 616;
        this.ERROR_COMMAND_CODE = 4;
        this.NOT_ENOUGH_GOLD_ERROR_CODE = 92;
        this.ROLLING_ERROR_CODE = 93;
        this.TIME_EXPIRED_ERROR_CODE = 94;
        this.REWARD_FUND_REQUEST_CODE = 53;
        this.REWARD_FUND_LIST_CODE = 511;
    },
    rankButtonHandler: function () {
        this.stat_board.showWithAnimationScale();
    },
    pushKing: function (isK) {
        if (!isK) {
            for (var i = 0; i < 3; i++) {
                this.kingCards[i].setSpriteFrame("minigame-kingCard1.png");
                this.kingCards[i].activated = false;
            }
        }
        else {
            var i = 0;
            while (this.kingCards[i].activated && i < 2)
                i++;
            this.kingCards[i].setSpriteFrame("minigame-kingCard2.png");
            this.kingCards[i].activated = true;
        }
    }
});