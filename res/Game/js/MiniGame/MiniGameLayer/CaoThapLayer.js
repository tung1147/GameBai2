/**
 * Created by QuyetNguyen on 12/20/2016.
 */

var s_CaoThapLayer = null;

var CaoThapLayer = MiniGamePopup.extend({
    ctor: function () {
        this._super();
        this._boudingRect = cc.rect(30, 47, 930, 510);
        this.rolling = false;

        var bg = new cc.Sprite("#caothap_bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);

        var highButton = new ccui.Button("caothap_up.png", "", "", ccui.Widget.PLIST_TEXTURE);
        highButton.setPosition(270, 292);
        this.addChild(highButton);

        var lowButton = new ccui.Button("caothap_down.png", "", "", ccui.Widget.PLIST_TEXTURE);
        lowButton.setPosition(730, 292);
        this.addChild(lowButton);

        var startButton = new ccui.Button("caothap_startButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startButton.setZoomScale(0.0);
        startButton.setPosition(871.5, 114);
        this.addChild(startButton);
        this.startButton = startButton;

        var nextButton = new ccui.Button("caothap_nextButton.png", "caothap_nextButton.png", "caothap_nextButton_off.png", ccui.Widget.PLIST_TEXTURE);
        nextButton.setPosition(startButton.getPosition());
        nextButton.setVisible(false);
        this.addChild(nextButton);
        this.nextButton = nextButton;

        var coinIcon = new cc.Sprite("#caothap_coinIcon.png");
        coinIcon.setPosition(749, 90);
        this.addChild(coinIcon);

        var bankLabel = new cc.LabelBMFont("100.000", cc.res.font.Roboto_CondensedBold_30);
        bankLabel.setColor(cc.color("#ffea00"));
        bankLabel.setAnchorPoint(cc.p(1.0, 0.5));
        bankLabel.setPosition(725, 90);
        this.bankLabel = bankLabel;
        this.addChild(bankLabel, 1);

        var timeLabel = new cc.LabelBMFont("05:00", cc.res.font.Roboto_CondensedBold_30);
        timeLabel.setPosition(500, 415);
        this.timeLabel = timeLabel;
        this.addChild(timeLabel, 1);

        var highLabel = new cc.LabelBMFont("CAO", cc.res.font.Roboto_CondensedBold_30);
        highLabel.setColor(cc.color("#c9ceff"));
        highLabel.setPosition(highButton.x, 192);
        this.addChild(highLabel, 1);

        var lowLabel = new cc.LabelBMFont("THẤP", cc.res.font.Roboto_CondensedBold_30);
        lowLabel.setColor(cc.color("#c9ceff"));
        lowLabel.setPosition(lowButton.x, highLabel.y);
        this.addChild(lowLabel, 1);

        var highValueLabel = new cc.LabelBMFont("10.000.000", cc.res.font.Roboto_Condensed_25);
        highValueLabel.setColor(cc.color("#ffea00"));
        highValueLabel.setPosition(highButton.x, 160);
        this.highValueLabel = highValueLabel;
        this.addChild(highValueLabel, 2);

        var lowValueLabel = new cc.LabelBMFont("10.000.000", cc.res.font.Roboto_Condensed_25);
        lowValueLabel.setColor(cc.color("#ffea00"));
        lowValueLabel.setPosition(lowButton.x, highValueLabel.y);
        this.lowValueLabel = lowValueLabel;
        this.addChild(lowValueLabel, 2);

        var card = new cc.Sprite("#gp_card_up.png");
        card.setScale(2 * cc.winSize.screenScale);
        card.setPosition(500, 260);
        this.addChild(card);
        this.card = card;

        var gameIdLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "ID : 1231231233", cc.TEXT_ALIGNMENT_LEFT);
        gameIdLabel.setColor(cc.color("#5366cb"));
        gameIdLabel.setScale(0.8);
        gameIdLabel.setPosition(lowButton.x, lowValueLabel.y - 25);
        this.addChild(gameIdLabel);
        this.gameIdLabel = gameIdLabel;

        this.initNoHu();
        this.initHistory();

        var thiz = this;
        lowButton.addClickEventListener(function () {
            thiz.onLowPredictClick();
        });

        highButton.addClickEventListener(function () {
            thiz.onHighPredictClick();
        });

        startButton.addClickEventListener(function () {
            thiz.onStartClick();
        });

        nextButton.addClickEventListener(function () {
            thiz._controller.sendLuotMoiRequest();
        });
    },

    onLowPredictClick: function () {
        if (this._controller.getTurnState() != 1)
            return;
        var thiz = this;
        this.rolling = true;
        setTimeout(function () {
            thiz._controller.sendLowPredict();
        }, 1000);
    },

    onHighPredictClick: function () {
        if (this._controller.getTurnState() != 1)
            return;
        var thiz = this;
        this.rolling = true;
        setTimeout(function () {
            thiz._controller.sendHighPredict();
        }, 1000);
    },

    onStartClick: function () {
        if (this._controller.getTurnState() != 0)
            return;
        var thiz = this;
        this.rolling = true;
        setTimeout(function () {
            thiz._controller.sendInitGame(thiz.chipGroup.chipSelected.chipIndex);
        }, 1000);
    },

    initNoHu: function () {
        this._kingCards = [];
        for (var i = 0; i < 3; i++) {
            var kingCard = new cc.Sprite("#caothap_kingCard_1.png");
            kingCard.setPosition(227 + i * 45, 429);
            this.addChild(kingCard, 1);
            this._kingCards.push(kingCard);
        }
    },

    setBankValue: function (value) {
        this.bankLabel.setString(cc.Global.NumberFormat1(value));
    },

    showResultCard: function (cardId) {
        this.rolling = false;
        var card = this.getCardWithId(cardId);
        this.card.setSpriteFrame(card.rank + s_card_suit[card.suit] + ".png");
    },

    initHistory: function () {
        var historyList = new newui.TableView(cc.size(355, 48), 1);
        historyList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        historyList.setReverse(true);
        historyList.setPosition(205, 65);
        // historyList.setMargin(margin, margin, 0, 0);
        // historyList.setPadding(padding);
        historyList.setScrollBarEnabled(false);
        this.addChild(historyList, 3);
        this.historyList = historyList;

        // for(var i=0;i<30;i++){
        //     this.addHistory(0);
        //     //this.addHistory( Math.floor((Math.random() * 13)));
        // }
    },

    initController: function () {
        this._controller = new CaoThapController(this);
    },

    pushKing: function (isK) {
        if (!isK) {
            for (var i = 0; i < 3; i++) {
                this._kingCards[i].setSpriteFrame("caothap_kingCard_1.png");
                this._kingCards[i].activated = false;
            }
        }
        else {
            var i = 0;
            while (this._kingCards[i].activated && i < 2)
                i++;
            this._kingCards[i].setSpriteFrame("caothap_kingCard_2.png");
            this._kingCards[i].activated = true;
        }
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
    },

    update: function (dt) {
        if (this.rolling) {
            // dang quay
            this.delta += dt;
            // if (this.delta < 0.1)
            //     return;
            var randNum = Math.floor(Math.random() * 51 + 4);
            var thiz = this;
            var texture = "" + Math.floor(randNum / 4) +
                s_card_suit[randNum % 4] + ".png";
            this.card.setSpriteFrame(texture);
            this.delta = 0;
        }
    },

    addHistory: function (cardValue, enforce) {
        var card = this.getCardWithId(cardValue);
        var cardIndex = card.rank;
        if (this.historyList.size() > 0) {
            var item = this.historyList.getItem(0);
            item.label.setColor(cc.color("#8d9de6"));
            item.lastCardSprite.setVisible(false);
        }


        var container = new ccui.Widget();
        container.setContentSize(39, 48);

        var label = new cc.LabelBMFont(cardIndex.toString(), cc.res.font.Roboto_CondensedBold_30);
        label.setColor(cc.color("#7adfff"));
        label.setPosition(container.getContentSize().width / 2, container.getContentSize().height / 2);
        container.addChild(label);
        container.label = label;

        var lastCardSprite = new cc.Sprite("#caothap_history_lastCard.png");
        lastCardSprite.setPosition(label.getPosition());
        container.addChild(lastCardSprite);
        container.lastCardSprite = lastCardSprite;

        this.historyList.insertItem(container, 0);
        this.historyList.forceRefreshView();
        this.historyList.jumpToRight();
    },

    setReward: function (lowReward, highReward) {
        this.lowValueLabel.setString(cc.Global.NumberFormat1(lowReward));
        this.highValueLabel.setString(cc.Global.NumberFormat1(highReward));
    },

    setTimeRemaining: function (timeRemaining) {

    },

    setTipString: function (str) {

    },

    setLuotMoiBtVisible: function (visible) {
        this.startButton.visible = !visible;
        this.nextButton.visible = visible;
    },

    clearTurn: function () {
        this.bankLabel.setString("0");
        this.nextButton.visible = false;
        this.startButton.visible = true;
        this.historyList.removeAllItems();
        this.card.setSpriteFrame("gp_card_up.png");
        this.timeLabel.setString("");
    },

    onEnter: function () {
        this._super();
        this.scheduleUpdate();
        s_CaoThapLayer = this;
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        s_CaoThapLayer = null;
    }
});

CaoThapLayer.showPopup = function () {
    if (s_CaoThapLayer) {
        return null;
    }
    var popup = new CaoThapLayer();
    popup.show();
    return popup;
};