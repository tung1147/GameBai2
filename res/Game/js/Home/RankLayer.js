/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var RankSubLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        this.initItemList();

        var _left = cc.winSize.width/2 - 340;
        var _padding = 2.0;
        this.width1 = 106;
        this.width2 = 348;
        this.width3 = 220;

        this.x1 = this.width1 / 2;
        this.x2 = this.x1 + this.width1 / 2 + this.width2 / 2 + _padding;
        this.x3 = this.x2 + this.width2 / 2 + this.width3 / 2 + _padding;

        var rankLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Cấp");
        rankLabel.setPosition(355 * cc.winSize.screenScale, 576);
        rankLabel.setColor(cc.color("#2776a4"));
        this.addChild(rankLabel);
        this.rankLabel = rankLabel;

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Người chơi");
        userLabel.setPosition(580 * cc.winSize.screenScale, 576);
        userLabel.setColor(cc.color("#2776a4"));
        this.addChild(userLabel);
        this.userLabel = userLabel;

        var scoreLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Điểm");
        scoreLabel.setPosition(860 * cc.winSize.screenScale, 576);
        scoreLabel.setColor(cc.color("#2776a4"));
        this.addChild(scoreLabel);
        this.scoreLabel = scoreLabel;
    },

    initItemList : function () {
        var _top = 554.0;
        var _bottom = 90.0;
        var _left = cc.winSize.width/2 - 340 * cc.winSize.screenScale;

        var itemList = new newui.TableView(cc.size(680, _top - _bottom), 1);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setAnchorPoint(cc.p(0.0, 1.0));
        itemList.setMargin(10, 30, 0, 0);
        itemList.setScale(cc.winSize.screenScale);
        itemList.setPosition(cc.p(_left, _top));
        this.addChild(itemList, 1);
        this.itemList = itemList;

    },

    addItem: function (rank, username, score) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.itemList.getContentSize().width, 60));
        this.itemList.pushItem(container);

        if(this.itemList.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);

            var bg1 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg1.setPreferredSize(cc.size(1, 50));
            bg1.setPosition(100, 30);
            container.addChild(bg1);
            //
            var bg2 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg2.setPreferredSize(cc.size(1, 50));
            bg2.setPosition(480, 30);
            container.addChild(bg2);

        }


        var rankLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, rank);
        rankLabel.setColor(cc.color("#ffde00"));
        rankLabel.setPosition(this.x1, 30);
        container.addChild(rankLabel);

        if (username.length > 3 && (username != PlayerMe.username)) {
            username = username.substring(0, username.length - 3) + "***";
        }

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, username, cc.TEXT_ALIGNMENT_CENTER);
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setColor(cc.color("#8de8ff"));
        userLabel.setDimensions(200, userLabel.getLineHeight());
        userLabel.setPosition(this.x2, 30);
        container.addChild(userLabel);

        var scoreLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, score);
        scoreLabel.setPosition(this.x3, 30);
        scoreLabel.setColor(cc.color("#ffde00"));
        container.addChild(scoreLabel);
    }
});

var RankGoldLayer = RankSubLayer.extend({
    ctor: function () {
        this._super();
        this.scoreLabel.setString("Vàng");
        LobbyClient.getInstance().addListener("getTop", this.onGetTop, this);
        LobbyClient.getInstance().send({command: "getTop", type: 2, limit: 10});
    },
    onGetTop: function (command, data) {
        data = data["data"]["2"];
        if (this.itemList.length > 0 || (!data))
            return;
        for (var i = 0; i < data.length; i++) {
            this.addItem(i + 1, data[i]["username"], data[i]["value"]);
        }
    },
    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var RankVipLayer = RankSubLayer.extend({
    ctor: function () {
        this._super();
        this.scoreLabel.setString("VIP");
        LobbyClient.getInstance().addListener("getTop", this.onGetTop, this);
        LobbyClient.getInstance().send({command: "getTop", type: 3, limit: 10});
    },
    onGetTop: function (command, data) {
        data = data["data"]["3"];
        if (this.itemList.length > 0 || (!data))
            return;
        for (var i = 0; i < data.length; i++) {
            this.addItem(i + 1, data[i]["username"], data[i]["value"]);
        }
    },
    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var s_game_rank_id = s_game_rank_id || [
        GameType.GAME_MauBinh,
        GameType.GAME_TienLenMN,
        GameType.GAME_TLMN_Solo,
        GameType.GAME_Sam,
        GameType.GAME_Sam_Solo,
        GameType.GAME_Phom,
        GameType.GAME_BaCay,
        GameType.GAME_XocDia,
        GameType.GAME_TaiXiu,
        //GameType.GAME_Lieng
        //GameType.GAME_BaCayChuong
];

var RankLevelLayer = RankSubLayer.extend({
    ctor: function () {
        this._super();
        LobbyClient.getInstance().addListener("getTop", this.onGetTop, this);

        //override
        var _left = cc.winSize.width/2 - 340;
        var _padding = 2.0;
        this.width1 = 106;
        this.width2 = 242;
        this.width3 = 166;
        this.width4 = 160;

        this.x1 = this.width1 / 2;
        this.x2 = this.x1 + this.width1 / 2 + this.width2 / 2 + _padding;
        this.x3 = this.x2 + this.width2 / 2 + this.width3 / 2 + _padding;
        this.x4 = this.x3 + this.width3 / 2 + this.width4 / 2 + _padding;

        this._left = _left;

        this.scoreLabel.removeFromParent(true);
        this.userLabel.setPositionX(500 * cc.winSize.screenScale);
        this.rankLabel.setPositionX(350 * cc.winSize.screenScale);
        /**/

        var winLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Thắng");
        winLabel.setPosition(740 * cc.winSize.screenScale, this.rankLabel.y);
        winLabel.setColor(cc.color("#2776a4"));
        this.addChild(winLabel);

        var loseLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Thua");
        loseLabel.setPosition(900 * cc.winSize.screenScale, this.rankLabel.y);
        loseLabel.setColor(cc.color("#2776a4"));
        this.addChild(loseLabel);

        var typeToggle = new ToggleNodeGroup();

        var itemCount = 0;
        for (var i = 0; i < s_game_rank_id.length; i++) {
            var gameId = s_game_rank_id[i];
            if(s_game_available[gameId]) {
                itemCount++;
            }
        }

        var dy = 80.0;
        var width = 180.0;
        var height = dy * itemCount;
        var x = width/2 - 18.0;
        var y = height - dy/2;

        typeToggle.setAnchorPoint(cc.p(0.0,0.0));
        typeToggle.setContentSize(cc.size(width, height));
        typeToggle.setScale(cc.winSize.screenScale);

        var scrollView = new newui.TableView(cc.size(width * cc.winSize.screenScale, dy* 5), 1);
        scrollView.setPosition(cc.winSize.width - width * cc.winSize.screenScale, 140);
      //  scrollView.setScale(cc.winSize.screenScale);
        scrollView.pushItem(typeToggle);
        this.addChild(scrollView, 1);

        var selectBg = new cc.Sprite("#rank_label_selected_1.png");
        selectBg.setPosition(x, y);
        typeToggle.addChild(selectBg);

        var selectIcon = new cc.Sprite("#rank_label_selected_2.png");
        selectIcon.setPosition(width - selectIcon.getContentSize().width/2, y);
        typeToggle.addChild(selectIcon);

        var thiz = this;
        for (var i = 0; i < s_game_rank_id.length; i++) {
            (function () {
                var gameId = s_game_rank_id[i];
                if(s_game_available[gameId]){
                    var icon1 = new cc.Sprite("#rank_label_" + gameId + "_1.png");
                    var icon2 = new cc.Sprite("#rank_label_" + gameId + "_2.png");

                    icon1.setPosition(x, y);
                    icon2.setPosition(icon1.getPosition());

                    typeToggle.addChild(icon1);
                    typeToggle.addChild(icon2);

                    var toggleItem = new ToggleNodeItem(icon1.getContentSize());
                    toggleItem.setPosition(icon1.getPosition());
                    typeToggle.addItem(toggleItem);
                    toggleItem.onSelect = function (isForce) {
                        icon1.setVisible(false);
                        icon2.setVisible(true);
                        selectBg.y = icon1.y;
                        selectIcon.y = icon1.y;

                        thiz.requestGetTop(gameId);
                    };
                    toggleItem.onUnSelect = function () {
                        icon1.setVisible(true);
                        icon2.setVisible(false);
                    };

                    y -= dy;
                }
            })();
        }

     //   typeToggle.selectItem(0);
        this.typeToggle = typeToggle;
    },

    requestGetTop : function (gameId) {
        this.itemList.removeAllItems();
        LobbyClient.getInstance().send({command: "getTop", type: 1, gameType: s_games_chanel[gameId], limit: 10});
    },

    onEnter : function () {
        this._super();
        this.typeToggle.selectItem(0);
    },

    // initItemList : function () {
    //     var _top = 554.0;
    //     var _bottom = 100.0 * cc.winSize.screenScale;
    //     var _left = cc.winSize.width/2 - 340;
    //
    //     var itemList = new newui.TableView(cc.size(680 , _top - _bottom), 1);
    //     itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
    //     itemList.setScrollBarEnabled(false);
    //     itemList.setPadding(10);
    //     itemList.setMargin(10, 30, 0, 0);
    //     itemList.setPosition(cc.p(_left, _bottom));
    //     this.addChild(itemList, 1);
    //     this.itemList = itemList;
    // },

    onGetTop: function (command, data) {
        cc.log(JSON.stringify(data));
        data = data["data"]["1"];
        if (!data)
            return;
        this.itemList.removeAllItems();
        for (var i = 0; i < data.length; i++) {
            this.addItem(i + 1, data[i]["username"], data[i]["winGold"], data[i]["looseGold"]);
        }
    },
    addItem: function (rank, username, win, lose) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.itemList.getContentSize().width, 60));
        this.itemList.pushItem(container);

        if(this.itemList.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);

            var bg1 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg1.setPreferredSize(cc.size(1, 50));
            bg1.setPosition(100, 30);
            container.addChild(bg1);
            //
            var bg2 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg2.setPreferredSize(cc.size(1, 50));
            bg2.setPosition(360, 30);
            container.addChild(bg2);

            var bg3 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg3.setPreferredSize(cc.size(1, 50));
            bg3.setPosition(520, 30);
            container.addChild(bg3);
        }

        var rankLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, rank);
        rankLabel.setColor(cc.color("#ffde00"));
        rankLabel.setPosition(this.x1, 30);
        container.addChild(rankLabel);

        if (username.length > 3 && (username != PlayerMe.username)) {
            username = username.substring(0, username.length - 3) + "***";
        }

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, username, cc.TEXT_ALIGNMENT_CENTER);
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(100, 0);
        userLabel.setColor(cc.color("#8de8ff"));
        userLabel.setPosition(this.x2, 30);
        container.addChild(userLabel);

        var winLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, win);
        winLabel.setColor(cc.color("#ffde00"));
        winLabel.setPosition(this.x3, 30);
        container.addChild(winLabel);

        var loseLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, lose);
        loseLabel.setPosition(this.x4, 30);
        container.addChild(loseLabel);
    },
    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var rank_tab_1 = rank_tab_1 || [
    "ĐẠI GIA",
    "VIP",
    "CAO THỦ"
];

var rank_tab_2 = rank_tab_2 || [
        "ĐẠI GIA",
        "VIP",
        "CAO THỦ"
];

var RankLayer = LobbySubLayer.extend({
    ctor: function () {
        this._super("#lobby-title-rank.png");

        var allLayer = [new RankGoldLayer(), new RankVipLayer(), new RankLevelLayer()];
        for (var i = 0; i < allLayer.length; i++) {
            this.addChild(allLayer[i]);
        }
        this._initTab(rank_tab_1, rank_tab_2, allLayer);
    },

    onEnter: function () {
        this._super();
        this.mToggle.selectItem(0);
    }
});