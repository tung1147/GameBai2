/**
 * Created by VGA10 on 9/15/2016.
 */
var StatisticBoard = IDialog.extend({
    ctor: function () {
        this._super();

        var board_bg = ccui.Scale9Sprite.createWithSpriteFrameName("board_bg.png", cc.rect(105, 105, 147, 147));
        board_bg.setAnchorPoint(cc.p(0, 0));
        this.dialogNode.addChild(board_bg);
        this.board_bg = board_bg;

        this.initWithSize(cc.size(1080, 720));
        this.retain();

        // var colorLayer = new cc.LayerColor(cc.color(255, 255, 255, 255), 50000, 50000);
        // this.rewardFundTableLayout.addChild(colorLayer);

        this.initRewardFundTable();
        this.initTopEarningTable();
        this.initPlayHistoryTable();
        this.initNavBar();

        // var sttLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25,
        //     "STT", cc.TEXT_ALIGNMENT_CENTER);
        // sttLabel.setPosition(160, 590);
        // sttLabel.setColor(cc.color("#8ba1bc"));
        // sttLabel.setScale(0.8);
        // board_bg.addChild(sttLabel);
        //
        // var taikhoanLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25,
        //     "Tài khoản", cc.TEXT_ALIGNMENT_CENTER);
        // taikhoanLabel.setPosition(420,590);
        // taikhoanLabel.setColor(cc.color("#8ba1bc"));
        // taikhoanLabel.setScale(0.8);
        // board_bg.addChild(taikhoanLabel);
    },
    initWithSize: function (mSize) {
        this.board_bg.setPreferredSize(cc.size(mSize.width, mSize.height));
        this.dialogNode.setContentSize(this.board_bg.getContentSize());

        this.rewardFundTableLayout = this.initClippingTable(mSize, true);
        this.topEarningTableLayout = this.initClippingTable(mSize, false);
        this.historyTableLayout = this.initClippingTable(mSize, false);
    },
    initRewardFundTable: function () {
        var thoigianLabel = this.rewardFundTableLayout.createLabel("Thời gian", 40, 385);
        this.rewardFundTableLayout.addChild(thoigianLabel);

        var muccuocLabel = this.rewardFundTableLayout.createLabel("Mức cược", 320, 385);
        this.rewardFundTableLayout.addChild(muccuocLabel);

        var taikhoanLabel = this.rewardFundTableLayout.createLabel("Tài khoản", 500, 385);
        this.rewardFundTableLayout.addChild(taikhoanLabel);

        var tienLabel = this.rewardFundTableLayout.createLabel("Tiền", 690, 385);
        this.rewardFundTableLayout.addChild(tienLabel);

        var statisticList = new newui.TableView(cc.size(800, 370), 1);
        statisticList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        statisticList.setScrollBarEnabled(false);
        statisticList.setPadding(10);
        statisticList.setMargin(10, 10, 0, 0);
        statisticList.setAnchorPoint(0.0, 0.0);
        statisticList.setPosition(25, 0);
        this.rewardFundTableLayout.addChild(statisticList);
        this.rewardFundTableLayout.statisticList = statisticList;
    },
    initTopEarningTable: function () {
        var sttLabel = this.topEarningTableLayout.createLabel("STT", 40, 385);
        this.topEarningTableLayout.addChild(sttLabel);

        var taikhoanLabel = this.topEarningTableLayout.createLabel("Tài khoản", 360, 385);
        this.topEarningTableLayout.addChild(taikhoanLabel);

        var tienLabel = this.topEarningTableLayout.createLabel("Tiền", 610, 385);
        this.topEarningTableLayout.addChild(tienLabel);

        var statisticList = new newui.TableView(cc.size(800, 370), 1);
        statisticList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        statisticList.setScrollBarEnabled(false);
        statisticList.setPadding(10);
        statisticList.setMargin(10, 10, 0, 0);
        statisticList.setAnchorPoint(0.0, 0.0);
        statisticList.setPosition(25, 0);
        this.topEarningTableLayout.addChild(statisticList);
        this.topEarningTableLayout.statisticList = statisticList;
    },
    initPlayHistoryTable: function () {
        var thoigianLabel = this.historyTableLayout.createLabel("Thời gian", 40, 385);//255
        this.historyTableLayout.addChild(thoigianLabel);

        var bobaiLabel = this.historyTableLayout.createLabel("Bộ bài", 295, 385);//215
        this.historyTableLayout.addChild(bobaiLabel);

        var tenbaiLabel = this.historyTableLayout.createLabel("Tên bài", 510, 385); // 185
        this.historyTableLayout.addChild(tenbaiLabel);

        var tienanduocLabel = this.historyTableLayout.createLabel("Tiền ăn được", 695, 385); // 145
        this.historyTableLayout.addChild(tienanduocLabel);

        var statisticList = new newui.TableView(cc.size(800, 370), 1);
        statisticList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        statisticList.setScrollBarEnabled(false);
        statisticList.setPadding(10);
        statisticList.setMargin(10, 10, 0, 0);
        statisticList.setAnchorPoint(0.0, 0.0);
        statisticList.setPosition(25, 0);
        this.historyTableLayout.addChild(statisticList);
        this.historyTableLayout.statisticList = statisticList;
    },
    initNavBar: function () {
        var thiz = this;
        var navBorder = new cc.Sprite("#nav_statistic_board.png");
        navBorder.setAnchorPoint(0.5, 0.0);
        navBorder.setPosition(this.dialogNode.width / 2, 104);
        this.dialogNode.addChild(navBorder);

        //active button Y = 100, inactive = 129
        this.rewardFundBtn = new ccui.Button("nav_huthuong_active.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.rewardFundBtn.setAnchorPoint(0.5, 0.0);
        this.rewardFundBtn.setPosition(this.dialogNode.width / 2 - 230, 100);
        this.rewardFundBtn.navIndex = 1;
        this.rewardFundBtn.selected = function () {
            this.loadTextureNormal("nav_huthuong_active.png", ccui.Widget.PLIST_TEXTURE);
            thiz.rewardFundTableLayout.visible = true;
            this.setPositionY(100);
        };
        this.rewardFundBtn.deselected = function () {
            this.loadTextureNormal("nav_huthuong_inactive.png", ccui.Widget.PLIST_TEXTURE);
            thiz.rewardFundTableLayout.visible = false;
            this.setPositionY(129);
        };

        this.topEarningBtn = new ccui.Button("nav_caothu_inactive.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.topEarningBtn.setAnchorPoint(0.5, 0.0);
        this.topEarningBtn.setPosition(this.dialogNode.width / 2, 129);
        this.topEarningBtn.navIndex = 2;
        this.topEarningBtn.selected = function () {
            this.loadTextureNormal("nav_caothu_active.png", ccui.Widget.PLIST_TEXTURE);
            thiz.topEarningTableLayout.visible = true;
            this.setPositionY(100);
        };
        this.topEarningBtn.deselected = function () {
            this.loadTextureNormal("nav_caothu_inactive.png", ccui.Widget.PLIST_TEXTURE);
            thiz.topEarningTableLayout.visible = false;
            this.setPositionY(129);
        };

        this.historyBtn = new ccui.Button("nav_lichsu_inactive.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.historyBtn.setAnchorPoint(0.5, 0.0);
        this.historyBtn.setPosition(this.dialogNode.width / 2 + 230, 129);
        this.historyBtn.navIndex = 3;
        this.historyBtn.selected = function () {
            this.loadTextureNormal("nav_lichsu_active.png", ccui.Widget.PLIST_TEXTURE);
            thiz.historyTableLayout.visible = true;
            this.setPositionY(100);
        };
        this.historyBtn.deselected = function () {
            this.loadTextureNormal("nav_lichsu_inactive.png", ccui.Widget.PLIST_TEXTURE);
            thiz.historyTableLayout.visible = false;
            this.setPositionY(129);
        };

        this.dialogNode.addChild(this.rewardFundBtn);
        this.dialogNode.addChild(this.topEarningBtn);
        this.dialogNode.addChild(this.historyBtn);
        this.navBtnSelected = this.rewardFundBtn;

        //initialize listener
        this.rewardFundBtn.addClickEventListener(function () {
            thiz.selectNav(this);
        });
        this.topEarningBtn.addClickEventListener(function () {
            thiz.selectNav(this);
        });
        this.historyBtn.addClickEventListener(function () {
            thiz.selectNav(this);
        })
    },
    selectNav: function (btnSelect) {
        this.navBtnSelected.deselected();
        btnSelect.selected();
        this.navBtnSelected = btnSelect;
        this.onNavBtnSelected(btnSelect.navIndex);
    },
    onNavBtnSelected: function (navIndex) {

    },
    initClippingTable: function (mSize, isVisible) {
        this.mTouch = cc.rect(this.dialogNode.x - mSize.width / 2 + 100, this.dialogNode.y - mSize.height / 2 + 100,
            mSize.width - 200, mSize.height - 200);
        var tableLayout = new ccui.Layout();
        tableLayout.setContentSize(cc.size(this.mTouch.width - 20, this.mTouch.height - 110));
        tableLayout.setAnchorPoint(0.0, 0.0);
        tableLayout.setPosition(110, 200);
        tableLayout.setClippingEnabled(true);
        tableLayout.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        tableLayout.visible = isVisible;
        this.dialogNode.addChild(tableLayout);
        tableLayout.createLabel = function (str, posX, posY) {
            var returnLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, str, cc.TEXT_ALIGNMENT_LEFT);
            returnLabel.setScale(0.7);
            returnLabel.setColor(cc.color("#8ba1bc"));
            returnLabel.setAnchorPoint(0.0, 0.5);
            returnLabel.setPosition(posX, posY);
            return returnLabel;
        };
        return tableLayout;
    },
    adjustlel: function () {
        // this.vlvl++;
        // this.thoigianLabel.setPosition(40, 350 + this.vlvl);
        // cc.log("" + (350 + this.vlvl));
    },
    addRewardFundEntry: function (time, betAmount, account, reward) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.rewardFundTableLayout.statisticList.getContentSize().width, 60));
        this.rewardFundTableLayout.statisticList.pushItem(container);

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg1.setPreferredSize(cc.size(280 * cc.winSize.screenScale, 60));
        bg1.setPosition(140 * cc.winSize.screenScale, bg1.getContentSize().height / 2);
        container.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg2.setPreferredSize(cc.size(180 * cc.winSize.screenScale, 60));
        bg2.setPosition(370.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg2);

        var bg3 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg3.setPreferredSize(cc.size(180 * cc.winSize.screenScale, 60));
        bg3.setPosition(550.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg3);

        var bg4 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg4.setPreferredSize(cc.size(150 * cc.winSize.screenScale, 60));
        bg4.setPosition(715.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg4);

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, time);
        timeLabel.setPosition(bg1.getPosition());
        container.addChild(timeLabel);

        var betAmountLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, betAmount);
        betAmountLabel.setPosition(bg2.getPosition());
        betAmountLabel.setColor(cc.color("#ffde00"));
        container.addChild(betAmountLabel);

        var accountLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, account);
        accountLabel.setPosition(bg3.getPosition());
        container.addChild(accountLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, reward);
        rewardLabel.setPosition(bg4.getPosition());
        rewardLabel.setColor(cc.color("#ffde00"));
        container.addChild(rewardLabel);

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var dialog = new MessageDialog();
            dialog.title.setString("An tien");
            dialog.setMessage(reward);
            dialog.showWithAnimationScale();
        });
    },
    addTopEarningEntry: function (order, account, reward) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.rewardFundTableLayout.statisticList.getContentSize().width, 60));
        this.topEarningTableLayout.statisticList.pushItem(container);

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg1.setPreferredSize(cc.size(320 * cc.winSize.screenScale, 60));
        bg1.setPosition(160 * cc.winSize.screenScale, bg1.getContentSize().height / 2);
        container.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg2.setPreferredSize(cc.size(250 * cc.winSize.screenScale, 60));
        bg2.setPosition(445.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg2);

        var bg3 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg3.setPreferredSize(cc.size(230 * cc.winSize.screenScale, 60));
        bg3.setPosition(685.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg3);

        var orderLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "" + order);
        orderLabel.setPosition(bg1.getPosition());
        container.addChild(orderLabel);

        var accountLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "" + account);
        accountLabel.setPosition(bg2.getPosition());
        container.addChild(accountLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "" + reward);
        rewardLabel.setPosition(bg3.getPosition());
        rewardLabel.setColor(cc.color("#ffde00"));
        container.addChild(rewardLabel);

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var dialog = new MessageDialog();
            dialog.title.setString("An tien");
            dialog.setMessage(reward);
            dialog.showWithAnimationScale();
        });
    },
    addHistoryEntry: function (time, deck, rewardName, reward) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.rewardFundTableLayout.statisticList.getContentSize().width, 60));
        this.historyTableLayout.statisticList.pushItem(container);

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg1.setPreferredSize(cc.size(255 * cc.winSize.screenScale, 60));
        bg1.setPosition(127.5 * cc.winSize.screenScale, bg1.getContentSize().height / 2);
        container.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg2.setPreferredSize(cc.size(215 * cc.winSize.screenScale, 60));
        bg2.setPosition(362.5 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg2);

        var bg3 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg3.setPreferredSize(cc.size(185 * cc.winSize.screenScale, 60));
        bg3.setPosition(562.5 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg3);

        var bg4 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png", cc.rect(10, 0, 4, 80));
        bg4.setPreferredSize(cc.size(145 * cc.winSize.screenScale, 60));
        bg4.setPosition(727.5 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg4);

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, time);
        timeLabel.setPosition(bg1.getPosition());
        container.addChild(timeLabel);

        // var betAmountLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25,betAmount);
        // betAmountLabel.setPosition(bg2.getPosition());
        // betAmountLabel.setColor(cc.color("#ffde00"));
        // container.addChild(betAmountLabel);

        var rewardNameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, rewardName);
        rewardNameLabel.setPosition(bg3.getPosition());
        container.addChild(rewardNameLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, reward);
        rewardLabel.setPosition(bg4.getPosition());
        rewardLabel.setColor(cc.color("#ffde00"));
        container.addChild(rewardLabel);

        var suitArray = [2, 3, 0, 1];
        var baseX = bg2.getPositionX() - 80 * cc.winSize.screenScale;
        var baseY = bg2.getPositionY();
        for (var i = 0; i < deck.length; i++) {
            var rank = (deck[i] + 1) % 13 + 1;
            var suit = suitArray[Math.floor(deck[i] / 13)];

            var cardSprite = new cc.Sprite("#" + rank + s_card_suit[suit] + ".png");
            cardSprite.setScale(0.3);
            cardSprite.setPosition(baseX + i * 32 * cc.winSize.screenScale,baseY);
            container.addChild(cardSprite);
        }

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var dialog = new MessageDialog();
            dialog.title.setString("An tien");
            dialog.setMessage(reward);
            dialog.showWithAnimationScale();
        });
    }
});