/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var NewsSubLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var _top = 554.0;
        var _bottom = 126.0;

        var itemList = new newui.TableView(cc.size(cc.winSize.width, _top - _bottom), 1);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setPadding(10);
        itemList.setMargin(10,10,0,0);
        itemList.setPosition(cc.p(0, _bottom));
        this.addChild(itemList, 1);
        this.itemList = itemList;
    }
});

var NewsNotificationLayer = NewsSubLayer.extend({
    ctor : function () {
        this._super();
        this.dialogTitle = "Thông báo";
        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "THÔNG BÁO");
        titleLabel.setPosition(489.0 * cc.winSize.screenScale, 576);
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "THỜI GIAN");
        timeLabel.setPosition(1070.0 * cc.winSize.screenScale, 576);
        titleLabel.setOpacity(0.2 * 255);
        timeLabel.setOpacity(0.2 * 255);
        this.addChild(titleLabel);
        this.addChild(timeLabel);
        this.titleLabel = titleLabel;

        for(var i=0;i<10;i++){
            this.addMessage("title", "time", "content");
        }
    },

    addMessage : function (title, time, content) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.itemList.getContentSize().width, 80));
        this.itemList.pushItem(container);

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg1.setPreferredSize(cc.size(858 * cc.winSize.screenScale, 80));
        bg1.setPosition(489.0 * cc.winSize.screenScale, bg1.getContentSize().height/2);
        container.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg2.setPreferredSize(cc.size(300 * cc.winSize.screenScale, 80));
        bg2.setPosition(1070.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg2);

        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, title);
        titleLabel.setPosition(bg1.getPosition());
        container.addChild(titleLabel);
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, time);
        timeLabel.setPosition(bg2.getPosition());
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
    ctor : function () {
        this._super();
        this.dialogTitle = "Hướng dẫn";
        this.titleLabel.setString("HƯỚNG DẪN");
    }
});

var NewsLevelLayer = NewsSubLayer.extend({

    ctor : function () {
        this._super();

        var _left = 60.0 * cc.winSize.screenScale;
        var _padding = 2.0;
        this.width1 = 80.0;
        this.width2 = 180.0;
        this.width3 = cc.winSize.width - this.width1 - this.width2 - _padding*2 - _left*2;

        var levelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "CẤP");
        levelLabel.setPosition(_left + this.width1/2, 576);
        levelLabel.setOpacity(0.2 * 255);
        this.addChild(levelLabel);
        this.levelLabel = levelLabel;

        var scoreLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "ĐIỂM");
        scoreLabel.setPosition(_left + this.width1 + this.width2/2 + _padding, 576);
        scoreLabel.setOpacity(0.2 * 255);
        this.addChild(scoreLabel);
        this.scoreLabel = scoreLabel;

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "NỘI DUNG");
        contentLabel.setPosition(_left + this.width1 + this.width2 + this.width3/2 + _padding * 2, 576);
        contentLabel.setOpacity(0.2 * 255);
        this.addChild(contentLabel);
        this.contentLabel = contentLabel;

        for(var i=0;i<10;i++){
            this.addItem(100+i, 1000000000 + i, "content\n asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd asdasd");
        }
    },

    addItem : function (level,score,content) {
        var contentlabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, content, cc.TEXT_ALIGNMENT_CENTER, this.width3 - 10.0);
        var container = new ccui.Widget();
        this.itemList.pushItem(container);
        var containerHeight = contentlabel.getContentSize().height + 10;
        if(containerHeight < 80.0){
            containerHeight = 80.0;
        }
        container.setContentSize(cc.size(this.itemList.getContentSize().width, containerHeight));

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg1.setPreferredSize(cc.size(this.width1, container.getContentSize().height));

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg2.setPreferredSize(cc.size(this.width2, container.getContentSize().height));

        var bg3 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg3.setPreferredSize(cc.size(this.width3 , container.getContentSize().height));

        bg1.setPosition(this.levelLabel.x, bg1.getContentSize().height/2);
        container.addChild(bg1);
        bg2.setPosition(this.scoreLabel.x, bg1.y);
        container.addChild(bg2);
        bg3.setPosition(this.contentLabel.x, bg1.y);
        container.addChild(bg3);

        var levelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, level.toString());
        levelLabel.setPosition(bg1.getPosition());
        container.addChild(levelLabel);

        var scoreLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(score));
        scoreLabel.setPosition(bg2.getPosition());
        container.addChild(scoreLabel);

        contentlabel.setPosition(bg3.getPosition());
        container.addChild(contentlabel);
    }
});

var NewsVipLayer = NewsLevelLayer.extend({
    ctor : function () {
        this._super();
        this.levelLabel.setString("VIP");
    }
});

var NewsLayer = LobbySubLayer.extend({
    ctor : function () {
        var icon_img1 = ["#lobby-clubs-1.png", "#lobby-hearts-1.png", "#lobby-diamonds-1.png", "#lobby-spades-1.png"];
        var icon_img2 = ["#lobby-clubs-2.png", "#lobby-hearts-2.png", "#lobby-diamonds-2.png", "#lobby-spades-2.png"];
        this._super();

        this.allLayer = [new NewsNotificationLayer(), new NewsLevelLayer(), new NewsVipLayer(),new NewsTutorialLayer()];
        for(var i=0;i<this.allLayer.length;i++){
            this.addChild(this.allLayer[i], 1);
        }

        var title = new cc.Sprite("#lobby-title-news.png");
        title.setPosition(cc.winSize.width/2, 720.0 - 63 * cc.winSize.screenScale);
        this.addChild(title);
        title.setScale(cc.winSize.screenScale);

        var bottomBar = new cc.Node();
        this.addChild(bottomBar);
        bottomBar.setScale(cc.winSize.screenScale);

        var tabBg = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-tab-bg.png", cc.rect(10,0,4,86));
        tabBg.setPreferredSize(cc.size(1000, 86));
        tabBg.setPosition(1280.0/2, tabBg.getContentSize().height/2);
        bottomBar.addChild(tabBg);

        var dx = tabBg.getContentSize().width/4;
        var x = tabBg.x -  tabBg.getContentSize().width/2 + dx/2;

        var selectBar = new cc.Sprite("#sublobby-tab-selected.png");
        bottomBar.addChild(selectBar);
        if(selectBar.getContentSize().width > dx){
            selectBar.setScaleX(dx/selectBar.getContentSize().width);
        }

        var selectBg = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-tab-selected-bg.png", cc.rect(10,10,4,4));
        selectBg.setPreferredSize(cc.size(dx, tabBg.getContentSize().height));
        bottomBar.addChild(selectBg);

        var mToggle = new ToggleNodeGroup();
        bottomBar.addChild(mToggle);

        for(var i=0;i<4;i++){
            var icon1 = new cc.Sprite(icon_img1[i]);
            var icon2 = new cc.Sprite(icon_img2[i]);
            icon1.setAnchorPoint(cc.p(0.5,0.0));
            icon2.setAnchorPoint(cc.p(0.5,0.0));
            icon1.setPosition(x, 0);
            icon2.setPosition(icon1.getPosition());
            bottomBar.addChild(icon1);
            bottomBar.addChild(icon2);

            var text1 = new cc.Sprite("#news-tab-"+(i+1)+".png");
            var text2 = new cc.Sprite("#news-tab-selected-"+(i+1)+".png");
            text1.setPosition(x, tabBg.y);
            text2.setPosition(text1.getPosition());
            bottomBar.addChild(text1,1);
            bottomBar.addChild(text2,1);

            var toggleItem = new ToggleNodeItem(selectBg.getContentSize());
            toggleItem.icon1 = icon1;
            toggleItem.icon2 = icon2;
            toggleItem.text1 = text1;
            toggleItem.text2 = text2;
            toggleItem.layer = this.allLayer[i];
            toggleItem.setPosition(x, tabBg.y);
            toggleItem.onSelect = function (isForce) {
                if(isForce){
                    selectBg.setPosition(this.getPosition());
                    selectBar.setPosition(selectBg.getPosition());
                }
                else{
                    selectBg.stopAllActions();
                    selectBar.stopAllActions();
                    selectBg.runAction(new cc.MoveTo(0.1, this.getPosition()));
                    selectBar.runAction(new cc.MoveTo(0.1, this.getPosition()));
                }

                this.icon1.visible = false;
                this.icon2.visible = true;
                this.text1.visible = false;
                this.text2.visible = true;
                this.layer.visible = true;
            };
            toggleItem.onUnSelect = function () {
                this.icon1.visible = true;
                this.icon2.visible = false;
                this.text1.visible = true;
                this.text2.visible = false;
                this.layer.visible = false;
            };
            x += dx;
            mToggle.addItem(toggleItem);
        }

        this.mToggle = mToggle;
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
    }
});
