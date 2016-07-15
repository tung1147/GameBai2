/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var RankSubLayer = cc.Node.extend({
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

        var _left = 60.0 * cc.winSize.screenScale;
        var _padding = 2.0;
        this.width1 = 150.0 * cc.winSize.screenScale;
        this.width3 = 200.0;
        this.width2 = cc.winSize.width - this.width1 - this.width3 - _padding*2 - _left*2;

        this.x1 = _left + this.width1/2;
        this.x2 = this.x1 + this.width1/2 + this.width2/2;
        this.x3 = this.x2 + this.width2/2 + this.width3/2;

        var rankLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Cấp");
        rankLabel.setPosition(this.x1, 576);
        rankLabel.setOpacity(0.2 * 255);
        this.addChild(rankLabel);
        this.rankLabel = rankLabel;

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Người chơi");
        userLabel.setPosition(this.x2, 576);
        userLabel.setOpacity(0.2 * 255);
        this.addChild(userLabel);
        this.userLabel = userLabel;

        var scoreLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Điểm");
        scoreLabel.setPosition(this.x3, 576);
        scoreLabel.setOpacity(0.2 * 255);
        this.addChild(scoreLabel);
        this.scoreLabel = scoreLabel;

        for(var i=0;i<10;i++){
            this.addItem(i+1, "username", 100000);
        }
    },
    
    addItem : function (rank,username,score) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.itemList.getContentSize().width, 80));
        this.itemList.pushItem(container);


        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg1.setPreferredSize(cc.size(this.width1, container.getContentSize().height));
        bg1.setPosition(this.x1, container.getContentSize().height/2);
        container.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg2.setPreferredSize(cc.size(this.width2, container.getContentSize().height));
        bg2.setPosition(this.x2, container.getContentSize().height/2);
        container.addChild(bg2);

        var bg3 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg3.setPreferredSize(cc.size(this.width3 , container.getContentSize().height));
        bg3.setPosition(this.x3, container.getContentSize().height/2);
        container.addChild(bg3);

        var rankLabel =  cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, rank);
        rankLabel.setPosition(bg1.getPosition());
        container.addChild(rankLabel);

        var userLabel =  cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, username, cc.TEXT_ALIGNMENT_CENTER);
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(bg2.getContentSize().width - 10, userLabel.getLineHeight());
        userLabel.setPosition(bg2.getPosition());
        container.addChild(userLabel);

        var scoreLabel =  cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, score);
        scoreLabel.setPosition(bg3.getPosition());
        container.addChild(scoreLabel);
    }
});

var RankGoldLayer = RankSubLayer.extend({
    ctor : function () {
        this._super();
        this.scoreLabel.setString("Vàng");
    }
});

var RankVipLayer = RankSubLayer.extend({
    ctor : function () {
        this._super();
        this.scoreLabel.setString("VIP");
    }
});

var RankLevelLayer = RankSubLayer.extend({
    ctor : function () {
        this._super();
        this.scoreLabel.setString("Level");
    }
});

var RankLayer = LobbySubLayer.extend({
    ctor : function () {
        this._super();
        var title = new cc.Sprite("#lobby-title-rank.png");
        title.setPosition(cc.winSize.width/2, 720.0 - 63 * cc.winSize.screenScale);
        this.addChild(title);
        title.setScale(cc.winSize.screenScale);

        var allLayer = [new RankGoldLayer(),new RankVipLayer(),new RankLevelLayer()];
        for(var i=0;i<allLayer.length;i++){
            this.addChild(allLayer[i]);
        }

        var icon_img1 = ["#lobby-clubs-1.png", "#lobby-spades-1.png", "#lobby-diamonds-1.png"];
        var icon_img2 = ["#lobby-clubs-2.png", "#lobby-spades-2.png", "#lobby-diamonds-2.png"];

        var bottomBar = new cc.Node();
        this.addChild(bottomBar);
        bottomBar.setScale(cc.winSize.screenScale);

        var tabBg = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-tab-bg.png", cc.rect(10,0,4,82));
        tabBg.setPreferredSize(cc.size(960, 82));
        tabBg.setPosition(1280.0/2, tabBg.getContentSize().height/2);
        bottomBar.addChild(tabBg);

        var dx = tabBg.getContentSize().width/3;
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

        for(var i=0;i<3;i++){
            var icon1 = new cc.Sprite(icon_img1[i]);
            var icon2 = new cc.Sprite(icon_img2[i]);
            icon1.setAnchorPoint(cc.p(0.5,0.0));
            icon2.setAnchorPoint(cc.p(0.5,0.0));
            icon1.setPosition(x, 0);
            icon2.setPosition(icon1.getPosition());
            bottomBar.addChild(icon1);
            bottomBar.addChild(icon2);

            var text1 = new cc.Sprite("#rank-tab-"+(i+1)+".png");
            var text2 = new cc.Sprite("#rank-tab-selected-"+(i+1)+".png");
            text1.setPosition(x, tabBg.y);
            text2.setPosition(text1.getPosition());
            bottomBar.addChild(text1,1);
            bottomBar.addChild(text2,1);

            var toggleItem = new ToggleNodeItem(selectBg.getContentSize());
            toggleItem.icon1 = icon1;
            toggleItem.icon2 = icon2;
            toggleItem.text1 = text1;
            toggleItem.text2 = text2;
            toggleItem.layer = allLayer[i];
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