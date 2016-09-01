/**
 * Created by Quyet Nguyen on 8/30/2016.
 */

var CaoThapScene = MiniGameScene.extend({
    ctor : function () {
        this._super();

        this.initAvatarMe();
        this.initButton();
        this.initChip(cc.winSize.width/2);

        this.initScene();
    },
    initScene : function () {
        var highBt = new ccui.Button("minigame-highBt.png","","", ccui.Widget.PLIST_TEXTURE);
        highBt.setScale(cc.winSize.screenScale);
        highBt.setZoomScale(0.05);
        highBt.setPosition(cc.winSize.width/2 - 240 * cc.winSize.screenScale, 344);
        this.sceneLayer.addChild(highBt);
        this.highBt = highBt;

        var lowBt = new ccui.Button("minigame-lowBt.png","","", ccui.Widget.PLIST_TEXTURE);
        lowBt.setScale(cc.winSize.screenScale);
        lowBt.setZoomScale(0.05);
        lowBt.setPosition(cc.winSize.width/2 + 240 * cc.winSize.screenScale, highBt.y);
        this.sceneLayer.addChild(lowBt);
        this.lowBt = lowBt;

        var card = new cc.Sprite("#gp_card_up.png");
        card.setScale(2.0 * cc.winSize.screenScale);
        card.setPosition(cc.winSize.width/2, highBt.y);
        this.sceneLayer.addChild(card);
        this.card = card;

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("minigame-bg1.png",cc.rect(20,20,4,4));
        bg1.setPosition(cc.winSize.width/2, 655);
        bg1.setPreferredSize(cc.size(350, 94));
        this.sceneLayer.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("minigame-bg1.png",cc.rect(20,20,4,4));
        bg2.setPreferredSize(cc.size(94, 350));
        bg2.setPosition(100, 323);
        this.sceneLayer.addChild(bg2);

        var bg3 = ccui.Scale9Sprite.createWithSpriteFrameName("minigame-bg1.png",cc.rect(20,20,4,4));
        bg3.setPreferredSize(bg2.getPreferredSize());
        bg3.setPosition(cc.winSize.width - 100, bg2.y);
        this.sceneLayer.addChild(bg3);

        this.kingCards = [];
        for(var i=0;i<3;i++){
            var kingCard = new cc.Sprite("#minigame-kingCard2.png");
            kingCard.setPosition(bg2.x, 230 + 80 * i);
            this.kingCards.push(kingCard);
            this.sceneLayer.addChild(kingCard);
        }

        var size = cc.size(bg3.getContentSize().width-4, bg3.getContentSize().height-4);
        var clippingNode = new ccui.Layout();
        clippingNode.setContentSize(size);
        clippingNode.setClippingEnabled(true);
        clippingNode.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingNode.setPosition(bg3.x - size.width/2, bg3.y - size.height/2);
        this.sceneLayer.addChild(clippingNode);

        var margin = 20.0;
        var padding = 10.0;
        var cardHeight = 123.0;
        this.cardScale = 0.7;
        this.historyMove = cc.p(bg3.x, bg3.y + size.height/2 - margin - (cardHeight * this.cardScale / 2));
        this.historyListMoveTo = cc.p(0.0, -(cardHeight * this.cardScale + padding));

        var historyList = new newui.TableView(size, 1);
        historyList.setMargin(margin,margin,0,0);
        historyList.setPadding(padding);
        historyList.setScrollBarEnabled(false);
        clippingNode.addChild(historyList);
        this.historyList = historyList;
    },
    addHistory : function (data) {
        var duration = 0.5;
        var cardImg = "#"+data.rank + s_card_suit[data.suit] +".png";

        var cardMove = new cc.Sprite(cardImg);
        cardMove.setPosition(this.card.getPosition());
        cardMove.setScale(this.card.getScale());
        var moveAction = new cc.Spawn(new cc.MoveTo(duration, this.historyMove), new cc.ScaleTo(duration, this.cardScale));
        var finishAction = new cc.CallFunc(function () {
            cardMove.removeFromParent(true);
        });
        this.sceneLayer.addChild(cardMove);
        cardMove.runAction(new cc.Sequence(moveAction, finishAction));

        var list = this.historyList;
        var thiz = this;
        list.stopAllActions();
        list.jumpToTop();
        var move2 = cc.MoveTo(duration, this.historyListMoveTo);
        var finished2 = cc.CallFunc(function () {
            list.y = 0;
            var card = new cc.Sprite(cardImg);
            card.setScale(thiz.cardScale);
            list.insertItem(card, 0);
        });
        list.runAction(new cc.Sequence(move2, finished2));
    }
});