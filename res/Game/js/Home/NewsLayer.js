/**
 * Created by Quyet Nguyen on 7/11/2016.
 */
var NewsLayer = LobbySubLayer.extend({
    ctor : function () {
        var icon_img1 = ["#lobby-clubs-1.png", "#lobby-hearts-1.png", "#lobby-diamonds-1.png", "#lobby-spades-1.png"];
        var icon_img2 = ["#lobby-clubs-2.png", "#lobby-hearts-2.png", "#lobby-diamonds-2.png", "#lobby-spades-2.png"];

        this._super();
        var title = new cc.Sprite("#lobby-title-news.png");
        title.setPosition(cc.winSize.width/2, 720.0 - 63 * cc.winSize.screenScale);
        this.addChild(title);
        title.setScale(cc.winSize.screenScale);

        var bottomBar = new cc.Node();
        this.addChild(bottomBar);
        bottomBar.setScale(cc.winSize.screenScale);

        var tabBg = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-tab-bg.png", cc.rect(10,0,4,82));
        tabBg.setPreferredSize(cc.size(1000, 82));
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
            };
            toggleItem.onUnSelect = function () {
                this.icon1.visible = true;
                this.icon2.visible = false;
                this.text1.visible = true;
                this.text2.visible = false;
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

var MessageLayer = LobbySubLayer.extend({
    ctor : function () {
        this._super();

        var title = new cc.Sprite("#lobby-title-newMessage.png");
        title.setPosition(cc.winSize.width/2, 720.0 - 63 * cc.winSize.screenScale);
        this.addChild(title);
        title.setScale(cc.winSize.screenScale);

        var _left = 60.0;
        var _right = cc.winSize.width  - 60.0;
        var _top = 554.0;
        var _bottom = 0.0;

        var messageList = new newui.TableView(cc.size(_right - _left, _top - _bottom), 1);
        messageList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        messageList.setScrollBarEnabled(false);
        messageList.setPadding(10);
       // messageList.setMargin()
        messageList.setPosition(cc.p(_left, _bottom));
        this.addChild(messageList, 1);
        this.messageList = messageList;

        for(var i=0;i<20;i++){
            this.addMessage(0, "Hệ thống", "Title", "Content");
        }
    },
    addMessage : function (time, sender, title, content) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.messageList.getContentSize().width, 78));
        this.messageList.pushItem(container);

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 78));
        bg1.setPreferredSize(cc.size(250 * cc.winSize.screenScale, 78));
        bg1.setPosition(bg1.getContentSize().width/2, bg1.getContentSize().height/2);
        container.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 78));
        bg2.setPreferredSize(cc.size(250 * cc.winSize.screenScale, 78));

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 78));
        bg2.setPreferredSize(cc.size(250 * cc.winSize.screenScale, 78));


        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Time");
        var senderLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, sender);
        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, title);

    }
});