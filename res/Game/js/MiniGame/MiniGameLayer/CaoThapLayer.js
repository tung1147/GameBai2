/**
 * Created by QuyetNguyen on 12/20/2016.
 */

var CaoThapLayer = MiniGamePopup.extend({
    ctor : function () {
        this._super();
        this._boudingRect = cc.rect(30, 47, 930, 510);

        var bg = new cc.Sprite("#caothap_bg.png");
        bg.setAnchorPoint(cc.p(0,0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(bg);


        var closeButton = new ccui.Button("caothap_closeBt.png","","", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(895, 407);
        this.addChild(closeButton);

        var tutorialButton = new ccui.Button("caothap_tutorialBt.png","","", ccui.Widget.PLIST_TEXTURE);
        tutorialButton.setPosition(769, 426);
        this.addChild(tutorialButton);

        var historyButton = new ccui.Button("caothap_historyBt.png","","", ccui.Widget.PLIST_TEXTURE);
        historyButton.setPosition(694, 430);
        this.addChild(historyButton);

        var upButton = new ccui.Button("caothap_up.png", "", "", ccui.Widget.PLIST_TEXTURE);
        upButton.setPosition(270, 292);
        this.addChild(upButton);

        var downButton = new ccui.Button("caothap_down.png", "", "", ccui.Widget.PLIST_TEXTURE);
        downButton.setPosition(730, 292);
        this.addChild(downButton);

        var startButton = new ccui.Button("caothap_startButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startButton.setZoomScale(0.0);
        startButton.setPosition(871.5, 114);
        this.addChild(startButton);
        startButton.setVisible(false);

        var nextButton = new ccui.Button("caothap_nextButton.png", "caothap_nextButton.png", "caothap_nextButton_off.png", ccui.Widget.PLIST_TEXTURE);
        nextButton.setPosition(startButton.getPosition());
        nextButton.setEnabled(false);
        this.addChild(nextButton);
        this.nextButton = nextButton;

        var coinIcon = new cc.Sprite("#caothap_coinIcon.png");
        coinIcon.setPosition(749, 90);
        this.addChild(coinIcon);

        var goldLabel = new cc.LabelBMFont("100.000", cc.res.font.Roboto_CondensedBold_30);
        goldLabel.setColor(cc.color("#ffea00"));
        goldLabel.setAnchorPoint(cc.p(1.0, 0.5));
        goldLabel.setPosition(725, 90);
        this.addChild(goldLabel, 1);

        var timeLabel = new cc.LabelBMFont("05:00", cc.res.font.Roboto_CondensedBold_30);
        timeLabel.setPosition(500, 415);
        this.addChild(timeLabel, 1);

        var jackpotLabel = new cc.LabelBMFont("100.000", cc.res.font.Roboto_CondensedBold_30);
        jackpotLabel.setColor(cc.color("#ffea00"));
        jackpotLabel.setPosition(500, 462);
        this.addChild(jackpotLabel, 1);

        var upLabel = new cc.LabelBMFont("CAO", cc.res.font.Roboto_CondensedBold_30);
        upLabel.setColor(cc.color("#c9ceff"));
        upLabel.setPosition(upButton.x, 192);
        this.addChild(upLabel, 1);

        var downLabel = new cc.LabelBMFont("THẤP", cc.res.font.Roboto_CondensedBold_30);
        downLabel.setColor(cc.color("#c9ceff"));
        downLabel.setPosition(downButton.x, upLabel.y);
        this.addChild(downLabel, 1);

        var upGoldLabel = new cc.LabelBMFont("10.000.000", cc.res.font.Roboto_Condensed_25);
        upGoldLabel.setColor(cc.color("#ffea00"));
        upGoldLabel.setPosition(upButton.x, 160);
        this.addChild(upGoldLabel, 2);

        var downGoldLabel = new cc.LabelBMFont("10.000.000", cc.res.font.Roboto_Condensed_25);
        downGoldLabel.setColor(cc.color("#ffea00"));
        downGoldLabel.setPosition(downButton.x, upGoldLabel.y);
        this.addChild(downGoldLabel, 2);

        this.initNoHu();
        this.initHistory();
        this.initMucCuoc();

        var thiz = this;
        downButton.addClickEventListener(function () {
            var idx = Math.floor(Math.random() * 13);
            thiz.addHistory(idx);
        });
    },

    initMucCuoc : function () {

    },

    initNoHu : function () {
        this._kingCards = [];
        for(var i=0;i<3;i++){
            var kingCard = new cc.Sprite("#caothap_kingCard_1.png");
            kingCard.setPosition(227 + i * 45, 429);
            this.addChild(kingCard, 1);
            this._kingCards.push(kingCard);
        }
    },

    initHistory : function () {
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

    addHistory : function (cardIndex) {
        if(this.historyList.size() > 0){
            var item = this.historyList.getItem(0);
            item.label.setColor(cc.color("#8d9de6"));
            item.lastCardSprite.setVisible(false);
        }


        var container = new ccui.Widget();
        container.setContentSize(39, 48);

        var label =  new cc.LabelBMFont(cardIndex.toString(), cc.res.font.Roboto_CondensedBold_30);
        label.setColor(cc.color("#7adfff"));
        label.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
        container.addChild(label);
        container.label = label;

        var lastCardSprite = new cc.Sprite("#caothap_history_lastCard.png");
        lastCardSprite.setPosition(label.getPosition());
        container.addChild(lastCardSprite);
        container.lastCardSprite = lastCardSprite;

        this.historyList.insertItem(container, 0);
        this.historyList.forceRefreshView();
        this.historyList.jumpToRight();
    }
});