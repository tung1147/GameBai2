/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var s_card_type = s_card_type || {};
s_card_type.CARD_VIETTEL = 1;
s_card_type.CARD_VINA = 2;
s_card_type.CARD_MOBI = 3;

var RewardSublayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var _top = 600.0;
        var _bottom = 126.0;

        var itemList = new newui.TableView(cc.size(cc.winSize.width, _top - _bottom), 4);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setPadding(60);
        itemList.setMargin(10,10,0,0);
        itemList.setPosition(cc.p(0, _bottom));
        this.addChild(itemList, 1);
        this.itemList = itemList;
    }
});

var s_card_money = s_card_money || ["50k", "100k", "200k", "500k"];
var RewardCardLayer = RewardSublayer.extend({
    ctor : function () {
        this._super();
        for(var i=0; i<20;i++){
            this.addCard(s_card_type.CARD_MOBI, i%4, 550000);
        }
    },
    
    addCard : function (cardType, cardId, gold) {
        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(gold));
        var goldBgWidth = goldLabel.getContentSize().width + 60.0;
        if(goldBgWidth < 170.0){
            goldBgWidth = 170.0;
        }
        var goldBg = ccui.Scale9Sprite.createWithSpriteFrameName("reward-gold-bg.png",cc.rect(50,0,4,44));
        goldBg.setPreferredSize(cc.size(goldBgWidth, 44));

        var cardImg = null;
        var cardMoney = null;
        if(cardType == s_card_type.CARD_VIETTEL){
            cardImg = new cc.Sprite("#reward-card-viettel.png");
            cardMoney = new cc.Sprite("#reward-viettel-" + s_card_money[cardId] +".png");
        }
        else if(cardType == s_card_type.CARD_VINA){
            cardImg = new cc.Sprite("#reward-card-vina.png");
            cardMoney = new cc.Sprite("#reward-vina-" + s_card_money[cardId] +".png");
        }
        else{
            cardImg = new cc.Sprite("#reward-card-mobi.png");
            cardMoney = new cc.Sprite("#reward-mobi-" + s_card_money[cardId] +".png");
        }

        var contaner = new ccui.Widget();
        contaner.setContentSize(cc.size(cardImg.getContentSize().width, cardImg.getContentSize().height + 60.0));
        this.itemList.pushItem(contaner);

        cardImg.setPosition(contaner.getContentSize().width/2, contaner.getContentSize().height - cardImg.getContentSize().height/2);
        contaner.addChild(cardImg);
        cardMoney.setPosition(cardImg.getPosition());
        contaner.addChild(cardMoney);

        goldBg.setPosition(cardImg.x , goldBg.getContentSize().height/2);
        contaner.addChild(goldBg);

        goldLabel.setPosition(goldBg.x + 20.0, goldBg.y);
        goldLabel.setColor(cc.color("#ffde00"));
        contaner.addChild(goldLabel);
    }
});

var RewardItemLayer = RewardSublayer.extend({
    ctor : function () {
        this._super();

        for(var i=0; i<20;i++){
            this.addItem("itemImg", "iPhone6 32GB", 12000000, 550000);
        }
    },
    
    addItem : function (itemImg, itemName, itemMoney, gold) {
        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(gold));
        var goldBgWidth = goldLabel.getContentSize().width + 60.0;
        if(goldBgWidth < 170.0){
            goldBgWidth = 170.0;
        }
        var goldBg = ccui.Scale9Sprite.createWithSpriteFrameName("reward-gold-bg.png",cc.rect(50,0,4,44));
        goldBg.setPreferredSize(cc.size(goldBgWidth, 44));

        var itemBg = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        itemBg.setPreferredSize(cc.size(210, 276));
        var itemBgPadding = new cc.Sprite("#reward-item-bg-2.png");

        var itemIcon = new cc.Sprite("#reward-card-viettel.png");

        var contaner = new ccui.Widget();
        contaner.setContentSize(cc.size(itemBg.getContentSize().width, itemBg.getContentSize().height + 60.0));
        this.itemList.pushItem(contaner);

        itemBg.setPosition(contaner.getContentSize().width/2, contaner.getContentSize().height - itemBg.getContentSize().height/2);
        contaner.addChild(itemBg);
        itemBgPadding.setPosition(itemBg.x, itemBg.y - 69);
        contaner.addChild(itemBgPadding);

        itemIcon.setPosition(itemBg.x, itemBg.y + 36);
        contaner.addChild(itemIcon);

        goldBg.setPosition(itemBg.x , goldBg.getContentSize().height/2);
        contaner.addChild(goldBg);

        goldLabel.setPosition(itemBg.x + 20.0, goldBg.y);
        goldLabel.setColor(cc.color("#ffde00"));
        contaner.addChild(goldLabel);
    }
});

var RewardHistoryLayer = RewardSublayer.extend({
    ctor : function () {
        this._super();
    }
});

var RewardLayer = LobbySubLayer.extend({
    ctor : function () {
        this._super();

        var allLayer = [new RewardCardLayer(), new RewardItemLayer(), new RewardHistoryLayer()];
        for(var i=0;i<allLayer.length;i++){
            this.addChild(allLayer[i]);
        }

        var title = new cc.Sprite("#lobby-title-reward.png");
        title.setPosition(cc.winSize.width/2, 720.0 - 63 * cc.winSize.screenScale);
        this.addChild(title);
        title.setScale(cc.winSize.screenScale);

        var icon_img1 = ["#lobby-clubs-1.png", "#lobby-spades-1.png", "#lobby-diamonds-1.png"];
        var icon_img2 = ["#lobby-clubs-2.png", "#lobby-spades-2.png", "#lobby-diamonds-2.png"];

        var bottomBar = new cc.Node();
        this.addChild(bottomBar);
        bottomBar.setScale(cc.winSize.screenScale);

        var tabBg = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-tab-bg.png", cc.rect(10,0,4,86));
        tabBg.setPreferredSize(cc.size(960, 86));
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

            var text1 = new cc.Sprite("#reward-tab-"+(i+1)+".png");
            var text2 = new cc.Sprite("#reward-tab-selected-"+(i+1)+".png");
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