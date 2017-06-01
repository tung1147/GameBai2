/**
 * Created by VGA10 on 9/15/2016.
 */
var StatisticBoard = IDialog.extend({
    ctor: function (gameType) {
        this._super();
        this.command = [];
        this.command[GameType.MiniGame_CaoThap] = {getTop: "402", getExplosion: "403", getHistory: "401"};
        this.command[GameType.MiniGame_Poker] = {getTop: "353", getExplosion: "354", getHistory: "352"};
        this.command[GameType.MiniGame_VideoPoker] = {getTop: "258", getExplosion: "259", getHistory: "257"};
        this.gameType = gameType;
        this.rewards = [];
        this.caoThapResults = ["Thắng","Hòa","Thua","Nổ hũ"];
        this.initRewards();

        var board_bg = new ccui.Scale9Sprite("board_bg.png", cc.rect(50, 50, 4, 4));
        board_bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(board_bg);
        this.board_bg = board_bg;

        this.initWithSize(cc.size(870, 550));

        this.initRewardFundTable();
        this.initTopEarningTable();
        this.initPlayHistoryTable();
        this.initNavBar();
    },

    initRewards: function () {
        this.rewards.push("Hũ thưởng");
        this.rewards.push("Thùng phá sảnh");
        this.rewards.push("Tứ quý");
        this.rewards.push("Cù lũ");
        this.rewards.push("Thùng");
        this.rewards.push("Sảnh");
        this.rewards.push("Xám cô");
        this.rewards.push("Hai đôi");
        this.rewards.push("Đôi");
    },


    initWithSize: function (mSize) {
        this.board_bg.setPreferredSize(cc.size(mSize.width, mSize.height));
        this.setContentSize(this.board_bg.getContentSize());
        this.mTouch = cc.rect(98, 98, mSize.width - 70, mSize.height - 70);

        this.rewardFundTableLayout = this.initClippingTable(mSize, true);
        this.topEarningTableLayout = this.initClippingTable(mSize, false);
        this.historyTableLayout = this.initClippingTable(mSize, false);
    },

    onSFSExtension: function (messageType, content) {
        switch (content.c) {
            case "100002": // danh sach cao thu
                this.addTopPlayersData(content.p.data["1"]);
                break;

            case "100001": // lich su no hu
                this.addExplosionHistoryData(content.p.data["1"]);
                break;

            case "100003": // lich su nguoi choi
                this.addHistoryData(content.p.data["1"]);
        }
    },

    onEnter: function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, this.command[this.gameType]["getTop"], null);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, this.command[this.gameType]["getExplosion"], null);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, this.command[this.gameType]["getHistory"], null);
    },

    onExit: function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },

    addTopPlayersData: function (data) {
        for (var i = 0; i < data.length; i++) {
            this.addTopEarningEntry(i + 1, data[i]["1"], data[i]["2"]);
        }
    },

    addExplosionHistoryData: function (data) {
        for (var i = 0; i < data.length; i++) {
            this.addRewardFundEntry(data[i]["1"], data[i]["2"],
                data[i]["3"], data[i]["4"]);
        }
    },

    addHistoryData: function (data) {
        for (var i = 0; i < data.length; i++) {
            this.addHistoryEntry(data[i]["2"], data[i]["3"],
                data[i]["4"], data[i]["5"]);
        }
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
        // statisticList.setPadding(10);
        statisticList.setMargin(10, 10, 0, 0);
        statisticList.setAnchorPoint(0.0, 0.0);
        statisticList.setPosition(25, 0);
        this.rewardFundTableLayout.addChild(statisticList);
        this.rewardFundTableLayout.statisticList = statisticList;
    },
    initTopEarningTable: function () {
        var sttLabel = this.topEarningTableLayout.createLabel("STT", 40, 385);
        this.topEarningTableLayout.addChild(sttLabel);

        var taikhoanLabel = this.topEarningTableLayout.createLabel("Tài khoản", 250, 385);
        this.topEarningTableLayout.addChild(taikhoanLabel);

        var tienLabel = this.topEarningTableLayout.createLabel("Tiền", 610, 385);
        this.topEarningTableLayout.addChild(tienLabel);

        var statisticList = new newui.TableView(cc.size(800, 370), 1);
        statisticList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        statisticList.setScrollBarEnabled(false);
        // statisticList.setPadding(10);
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

        var tenbaiLabel = this.historyTableLayout.createLabel("Tên bài", 520, 385); // 185
        this.historyTableLayout.addChild(tenbaiLabel);

        var tienanduocLabel = this.historyTableLayout.createLabel("Tiền ăn được", 695, 385); // 145
        this.historyTableLayout.addChild(tienanduocLabel);

        var statisticList = new newui.TableView(cc.size(800, 370), 1);
        statisticList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        statisticList.setScrollBarEnabled(false);
        // statisticList.setPadding(10);
        statisticList.setMargin(10, 10, 0, 0);
        statisticList.setAnchorPoint(0.0, 0.0);
        statisticList.setPosition(25, 0);
        this.historyTableLayout.addChild(statisticList);
        this.historyTableLayout.statisticList = statisticList;
    },
    initNavBar: function () {
        var thiz = this;
        // var navBorder = new cc.Sprite("#nav_statistic_board.png");
        // navBorder.setAnchorPoint(0.5, 0.0);
        // navBorder.setPosition(this.width / 2, 104);
        // this.addChild(navBorder);

        //active button Y = 100, inactive = 129
        this.rewardFundBtn = new ccui.Button("nav_huthuong_active.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // this.rewardFundBtn.setAnchorPoint(0.5, 0.0);
        this.rewardFundBtn.setPosition(this.width / 2 - 180, 475);
        this.rewardFundBtn.navIndex = 1;
        this.rewardFundBtn.selected = function () {
            this.loadTextureNormal("nav_huthuong_active.png", ccui.Widget.PLIST_TEXTURE);
            thiz.rewardFundTableLayout.visible = true;
            // this.setPositionY(100);
        };
        this.rewardFundBtn.deselected = function () {
            this.loadTextureNormal("nav_huthuong_inactive.png", ccui.Widget.PLIST_TEXTURE);
            thiz.rewardFundTableLayout.visible = false;
            // this.setPositionY(129);
        };

        this.topEarningBtn = new ccui.Button("nav_caothu_inactive.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // this.topEarningBtn.setAnchorPoint(0.5, 0.5);
        this.topEarningBtn.setPosition(this.width / 2, 475);
        this.topEarningBtn.navIndex = 2;
        this.topEarningBtn.selected = function () {
            this.loadTextureNormal("nav_caothu_active.png", ccui.Widget.PLIST_TEXTURE);
            thiz.topEarningTableLayout.visible = true;
            // this.setPositionY(100);
        };
        this.topEarningBtn.deselected = function () {
            this.loadTextureNormal("nav_caothu_inactive.png", ccui.Widget.PLIST_TEXTURE);
            thiz.topEarningTableLayout.visible = false;
            // this.setPositionY(129);
        };

        this.historyBtn = new ccui.Button("nav_lichsu_inactive.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // this.historyBtn.setAnchorPoint(0.5, 0.0);
        this.historyBtn.setPosition(this.width / 2 + 180, 475);
        this.historyBtn.navIndex = 3;
        this.historyBtn.selected = function () {
            this.loadTextureNormal("nav_lichsu_active.png", ccui.Widget.PLIST_TEXTURE);
            thiz.historyTableLayout.visible = true;
            // this.setPositionY(100);
        };
        this.historyBtn.deselected = function () {
            this.loadTextureNormal("nav_lichsu_inactive.png", ccui.Widget.PLIST_TEXTURE);
            thiz.historyTableLayout.visible = false;
            // this.setPositionY(129);
        };

        this.addChild(this.rewardFundBtn);
        this.addChild(this.topEarningBtn);
        this.addChild(this.historyBtn);
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



        this.closeBtn = new ccui.Button("dialog_his_close_bt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.closeBtn.setPosition(806, 485);
        this.closeBtn.addClickEventListener(function () {
            thiz.hide();
        })
        this.addChild(this.closeBtn);

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
        // this.mTouch = cc.rect(this.x - mSize.width / 2 + 100, this.y - mSize.height / 2 + 100,
        //     mSize.width - 200, mSize.height - 200);
        var tableLayout = new ccui.Layout();
        tableLayout.setContentSize(cc.size(this.mTouch.width, this.mTouch.height - 60));
        tableLayout.setAnchorPoint(0.0, 0.0);
        tableLayout.setPosition(10, 30);
        tableLayout.setClippingEnabled(true);
        tableLayout.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        tableLayout.visible = isVisible;
        this.addChild(tableLayout);
        tableLayout.createLabel = function (str, posX, posY) {
            var returnLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, str, cc.TEXT_ALIGNMENT_LEFT);
            returnLabel.setScale(0.7);
            returnLabel.setColor(cc.color("#77cbee"));
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

        if(this.rewardFundTableLayout.statisticList.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);

            var bg1 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg1.setPreferredSize(cc.size(1, 50));
            bg1.setPosition(290, 30);
            container.addChild(bg1);

            var bg2 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg2.setPreferredSize(cc.size(1, 50));
            bg2.setPosition(470, 30);
            container.addChild(bg2);

            var bg3 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg3.setPreferredSize(cc.size(1, 50));
            bg3.setPosition(660, 30);
            container.addChild(bg3);
        }

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, time);
        timeLabel.setPosition(100 * cc.winSize.screenScale, 30);
        container.addChild(timeLabel);

        var betAmountLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, betAmount);
        betAmountLabel.setAnchorPoint(cc.p(0.0, 0.5));
        betAmountLabel.setPosition(300.0 * cc.winSize.screenScale, 30);
        betAmountLabel.setColor(cc.color("#ffde00"));
        container.addChild(betAmountLabel);

        if (account.length > 3 && (account != PlayerMe.username)) {
            account = account.substring(0, account.length - 3) + "***";
        }

        var accountLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, account, cc.TEXT_ALIGNMENT_LEFT);
        accountLabel.setAnchorPoint(cc.p(0.0, 0.5));
        accountLabel.setPosition(480.0 * cc.winSize.screenScale, 30);
        container.addChild(accountLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, reward, cc.TEXT_ALIGNMENT_LEFT);
        rewardLabel.setAnchorPoint(cc.p(0.0, 0.5));
        rewardLabel.setPosition(665.0 * cc.winSize.screenScale, 30);
        rewardLabel.setColor(cc.color("#ffde00"));
        container.addChild(rewardLabel);

        // container.setTouchEnabled(true);
        // container.addClickEventListener(function () {
        //     var dialog = new MessageDialog();
        //     dialog.title.setString("An tien");
        //     dialog.setMessage(reward);
        //     dialog.showWithAnimationScale();
        // });
    },
    addTopEarningEntry: function (order, account, reward) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.rewardFundTableLayout.statisticList.getContentSize().width, 60));
        this.topEarningTableLayout.statisticList.pushItem(container);

        // var bg1 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        // bg1.setPreferredSize(cc.size(320 * cc.winSize.screenScale, 60));
        // bg1.setPosition(160 * cc.winSize.screenScale, bg1.getContentSize().height / 2);
        // container.addChild(bg1);
        //
        // var bg2 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        // bg2.setPreferredSize(cc.size(250 * cc.winSize.screenScale, 60));
        // bg2.setPosition(445.0 * cc.winSize.screenScale, bg1.y);
        // container.addChild(bg2);
        //
        // var bg3 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        // bg3.setPreferredSize(cc.size(230 * cc.winSize.screenScale, 60));
        // bg3.setPosition(685.0 * cc.winSize.screenScale, bg1.y);
        // container.addChild(bg3);


        if(this.topEarningTableLayout.statisticList.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);

            var bg1 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg1.setPreferredSize(cc.size(1, 50));
            bg1.setPosition(60, 30);
            container.addChild(bg1);

            var bg2 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg2.setPreferredSize(cc.size(1, 50));
            bg2.setPosition(470, 30);
            container.addChild(bg2);

        }

        var orderLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "" + order);
        orderLabel.setPosition(30 * cc.winSize.screenScale, 30);
        container.addChild(orderLabel);

        if (account.length > 3 && (account != PlayerMe.username)) {
            account = account.substring(0, account.length - 3) + "***";
        }

        var accountLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "" + account);
        accountLabel.setPosition(270.0 * cc.winSize.screenScale, 30);
        container.addChild(accountLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "" + reward);
        rewardLabel.setPosition(600.0 * cc.winSize.screenScale, 30);
        rewardLabel.setColor(cc.color("#ffde00"));
        container.addChild(rewardLabel);

        // container.setTouchEnabled(true);
        // container.addClickEventListener(function () {
        //     var dialog = new MessageDialog();
        //     dialog.title.setString("An tien");
        //     dialog.setMessage(reward);
        //     dialog.showWithAnimationScale();
        // });
    },
    addHistoryEntry: function (time, deck, rewardName, reward) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.rewardFundTableLayout.statisticList.getContentSize().width, 60));
        this.historyTableLayout.statisticList.pushItem(container);

        // var bg1 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        // bg1.setPreferredSize(cc.size(255 * cc.winSize.screenScale, 60));
        // bg1.setPosition(127.5 * cc.winSize.screenScale, bg1.getContentSize().height / 2);
        // container.addChild(bg1);
        //
        // var bg2 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        // bg2.setPreferredSize(cc.size(215 * cc.winSize.screenScale, 60));
        // bg2.setPosition(362.5 * cc.winSize.screenScale, bg1.y);
        // container.addChild(bg2);
        //
        // var bg3 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        // bg3.setPreferredSize(cc.size(185 * cc.winSize.screenScale, 60));
        // bg3.setPosition(562.5 * cc.winSize.screenScale, bg1.y);
        // container.addChild(bg3);
        //
        // var bg4 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        // bg4.setPreferredSize(cc.size(145 * cc.winSize.screenScale, 60));
        // bg4.setPosition(727.5 * cc.winSize.screenScale, bg1.y);
        // container.addChild(bg4);


        if(this.historyTableLayout.statisticList.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);

            var bg1 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg1.setPreferredSize(cc.size(1, 50));
            bg1.setPosition(260, 30);
            container.addChild(bg1);

            var bg2 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg2.setPreferredSize(cc.size(1, 50));
            bg2.setPosition(490, 30);
            container.addChild(bg2);

            var bg3 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg3.setPreferredSize(cc.size(1, 50));
            bg3.setPosition(660, 30);
            container.addChild(bg3);
        }

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, time);
        timeLabel.setPosition(100.5 * cc.winSize.screenScale, 30);
        container.addChild(timeLabel);

        // var betAmountLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25,betAmount);
        // betAmountLabel.setPosition(bg2.getPosition());
        // betAmountLabel.setColor(cc.color("#ffde00"));
        // container.addChild(betAmountLabel);

        if (this.gameType == GameType.MiniGame_Poker || this.gameType == GameType.MiniGame_VideoPoker) {
            if (rewardName >= 9) {
                rewardName = "KHÔNG ĂN";
            } else {
                rewardName = this.rewards[rewardName];
            }
        } else if (this.gameType == GameType.MiniGame_CaoThap){
            rewardName = this.caoThapResults[rewardName];
        }
        var rewardNameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, rewardName, cc.TEXT_ALIGNMENT_LEFT);
        rewardNameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        rewardNameLabel.setPosition(500 * cc.winSize.screenScale, 30);
        container.addChild(rewardNameLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, reward);
        rewardLabel.setPosition(710 * cc.winSize.screenScale, 30);
        rewardLabel.setColor(cc.color("#ffde00"));
        container.addChild(rewardLabel);

        var suitArray = [2, 3, 0, 1];
        var baseX = 332.5 * cc.winSize.screenScale - 50 * cc.winSize.screenScale;
        var baseY = 30;
        var marge = 27;
        if(deck.length > 8)
        {
            marge = 20;
        }
        else if(deck.length > 16)
        {
            marge = 15;
        }

        for (var i = 0; i < deck.length; i++) {
            var card = CardList.prototype.getCardWithId(deck[i]);

            var cardSprite = new cc.Sprite("#" + card.rank + s_card_suit[card.suit] + ".png");
            cardSprite.setScale(0.3);
            cardSprite.setPosition(baseX + i * marge * cc.winSize.screenScale, baseY);
            container.addChild(cardSprite);
        }

        // container.setTouchEnabled(true);
        // container.addClickEventListener(function () {
        //     var dialog = new MessageDialog();
        //     dialog.title.setString("An tien");
        //     dialog.setMessage(reward);
        //     dialog.showWithAnimationScale();
        // });
    }
});