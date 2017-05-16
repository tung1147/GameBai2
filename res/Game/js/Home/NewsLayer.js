/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var NewsSubLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        var _top = 554.0;
        var _bottom = 90.0 * cc.winSize.screenScale;

        var _left = 160.0;
        var _right = 1120.0;

        var itemList = new newui.TableView(cc.size(_right - _left , _top - _bottom), 1);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        // itemList.setPadding(10);
        itemList.setMargin(10, 30, 0, 0);
        itemList.setPosition(cc.p(_left, _bottom));
        this.addChild(itemList, 1);
        this.itemList = itemList;
    }
});

var NewsNotificationLayer = NewsSubLayer.extend({
    ctor: function () {
        this._super();
        this.newsType = "event";
        this.dialogTitle = "THÔNG BÁO";

        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Thông báo");
        titleLabel.setPosition(510.0 * cc.winSize.screenScale, 576);
        titleLabel.setColor(cc.color("#2776A4"));

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Thời gian");
        timeLabel.setPosition(950.0 * cc.winSize.screenScale, 576);
        timeLabel.setColor(cc.color("#2776A4"));
        // titleLabel.setOpacity(0.2 * 255);
        // timeLabel.setOpacity(0.2 * 255);
        this.addChild(titleLabel);
        this.addChild(timeLabel);
        this.titleLabel = titleLabel;

        LobbyClient.getInstance().addListener("getNews", this.onNewData, this);


        // for(var i = 0; i < 30; i++){
        //     this.addMessage("title", "createTime", "content");
        // }
    },

    onNewData: function (command, data) {
        data = data["data"];
        var events = data["event"];
        if (!events)
            return;
        for (var i = 0; i < events.length; i++) {
            this.addMessage(events[i]["title"], events[i]["createTime"], events[i]["content"]);
        }
    },

    setVisible : function (visible) {
        NewsSubLayer.prototype.setVisible.call(this, visible);
        if(visible){
            this.itemList.removeAllItems();
            LobbyClient.getInstance().send({command: "getNews", type: this.newsType});
        }
    },

    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    addMessage: function (title, time, content) {
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
            bg1.setPosition(650, 30);
            container.addChild(bg1);
        }


        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, title);
        titleLabel.setPosition(350, 30);
        titleLabel.setColor(cc.color("#8de8ff"))
        container.addChild(titleLabel);

        var d = new Date(time);
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.DateToString(d), cc.TEXT_ALIGNMENT_CENTER, 1000);
        timeLabel.setPosition(800, 30);
        timeLabel.setColor(cc.color("#8de8ff"))
        container.addChild(timeLabel);

        container.setTouchEnabled(true);
        var thiz = this;
        container.addClickEventListener(function () {
            var dialog = new MessageDialog();
            dialog.title.setString(thiz.dialogTitle);
            dialog.setMessage(content);
            dialog.showWithAnimationScale();
        });
    }
});

var NewsTutorialLayer = NewsNotificationLayer.extend({
    ctor: function () {
        this._super();
        this.newsType = "guide";
        this.dialogTitle = "Hướng dẫn";
        this.titleLabel.setString("HƯỚNG DẪN");
    },
    onNewData: function (command, data) {
        var guides = data["data"]["guide"];
        if (!guides)
            return;
        for (var i = 0;i<guides.length;i++){
            this.addMessage(guides[i]["title"], guides[i]["createTime"], guides[i]["content"]);
        }
    }
});

var NewsLevelLayer = NewsSubLayer.extend({
    ctor: function () {
        this._super();

        var _left = 170.0 * cc.winSize.screenScale;
        var _padding = 2.0;
        this.width1 = 80.0;
        this.width2 = 180.0;
        this.width3 = cc.winSize.width - this.width1 - this.width2 - _padding * 2 - _left * 2;

        var levelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Cấp");
        levelLabel.setPosition(_left + this.width1 / 2, 576);
        levelLabel.setColor(cc.color("#2776A4"));
        this.addChild(levelLabel);
        this.levelLabel = levelLabel;

        var scoreLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Điểm");
        scoreLabel.setPosition(_left + this.width1 + this.width2 / 2 + _padding - 10, 576);
        scoreLabel.setColor(cc.color("#2776A4"));
        this.addChild(scoreLabel);
        this.scoreLabel = scoreLabel;

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Nội dung");
        contentLabel.setPosition(_left + this.width1 + this.width2 + this.width3 / 2 + _padding * 2 - 20, 576);
        contentLabel.setColor(cc.color("#2776A4"));
        this.addChild(contentLabel);
        this.contentLabel = contentLabel;

        this.initData();
    },

    addItem: function (level, score, content) {
        var contentlabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, content, cc.TEXT_ALIGNMENT_CENTER, this.width3 - 10.0);
        var container = new ccui.Widget();
        this.itemList.pushItem(container);
        // var containerHeight = contentlabel.getContentSize().height + 10;
        // if (containerHeight < 80.0) {
        //     containerHeight = 80.0;
        // }
        container.setContentSize(cc.size(this.itemList.getContentSize().width, 60));

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
            bg2.setPosition(250, 30);
            container.addChild(bg2);
        }

        var levelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, level.toString());
        levelLabel.setPosition(50, 30);
        container.addChild(levelLabel);

        var scoreLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, cc.Global.NumberFormat1(score));
        scoreLabel.setPosition(170, 30);
        container.addChild(scoreLabel);

        contentlabel.setPosition(600, 30);
        container.addChild(contentlabel);
    },
    initData: function () {
        for (var i = 0; i < LevelData.length; i++) {
            this.addItem(i, LevelData[i].exp, LevelData[i].content);
        }
    }
});

var NewsVipLayer = NewsLevelLayer.extend({
    ctor: function () {
        this._super();
        this.levelLabel.setString("VIP");
    },
    initData: function () {
        for (var i = 0; i < VipData.length; i++) {
            this.addItem(i, VipData[i].exp, VipData[i].content);
        }
    }
});

var news_tab_1 = news_tab_1 || [
    "THÔNG BÁO",
    "TÍNH ĐIỂM KN",
    "TÍNH ĐIỂM VIP",
    "HƯỚNG DẪN"
];

var news_tab_2 = news_tab_2 || [
        "THÔNG BÁO",
        "TÍNH ĐIỂM KN",
        "TÍNH ĐIỂM VIP",
        "HƯỚNG DẪN"
];

var NewsLayer = LobbySubLayer.extend({
    ctor: function () {
        this._super("#lobby-title-news.png");

        this.allLayer = [new NewsNotificationLayer(), new NewsLevelLayer(), new NewsVipLayer(), new NewsTutorialLayer()];
        for (var i = 0; i < this.allLayer.length; i++) {
            this.addChild(this.allLayer[i], 1);
        }

        this._initTab(news_tab_1, news_tab_2, this.allLayer);
    },

    onEnter: function () {
        this._super();
        this.mToggle.selectItem(0);
    }
});
