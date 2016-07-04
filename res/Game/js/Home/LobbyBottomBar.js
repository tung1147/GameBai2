/**
 * Created by Quyet Nguyen on 7/1/2016.
 */

var LobbyBottomBar = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg = new ccui.Scale9Sprite("home-bar-bg.png", cc.rect(8,8,4,4));
        bg.setPreferredSize(cc.size(1280.0, 100.0));
        bg.setAnchorPoint(cc.p(0,0));
        bg.setPosition(cc.p(0,0));
        this.addChild(bg);
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0,0));

        var avt =  cc.Sprite("#lobby-avt.png");//Sprite::createWithSpriteFrameName("lobby-avt.png");
        avt.setPosition(56, 50);
        this.addChild(avt, 0);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Name2221231312313213212312312332132");
        nameLabel.setDimensions(190.0, nameLabel.getLineHeight());
        nameLabel.setLineBreakWithoutSpace(true);
        nameLabel.setAnchorPoint(0.0, 0.5);
        nameLabel.setColor(cc.color(255,255,255));
        nameLabel.setPosition(110,65);
        this.addChild(nameLabel,1);

        var goldIcon = new cc.Sprite("#home-gold-icon.png");
        goldIcon.setPosition(120, 32);
        this.addChild(goldIcon);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "500000V");
        goldLabel.setAnchorPoint(0.0, 0.5);
        goldLabel.setColor(cc.color(255,184,0));
        goldLabel.setPosition(140,30);
        this.addChild(goldLabel,1);

        var level = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Level 50");
        level.setAnchorPoint(0.0, 0.5);
        level.setPosition(330, 65);
        level.setColor(cc.color.WHITE);
        this.addChild(level, 1);

        var vip = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "VIP 5");
        vip.setAnchorPoint(0.0, 0.5);
        vip.setPosition(330, 30);
        vip.setColor(cc.color.WHITE);
        this.addChild(vip, 1);

        var levelBar = new cc.ProgressTimer(new cc.Sprite("#home-level-bar.png"));
        levelBar.setType(cc.ProgressTimer.TYPE_BAR);
        levelBar.setMidpoint(cc.p(0.0, 0.5));
        levelBar.setBarChangeRate(cc.p(1.0,0.0));
        levelBar.setAnchorPoint(cc.p(0.0,0.5));
        levelBar.setPosition(430, 65);
        levelBar.setPercentage(50.0);
        var levelBarBg = new cc.Sprite("#home-level-bg.png");
        levelBarBg.setPosition(levelBar.getContentSize().width/2, levelBar.getContentSize().height/2);
        levelBar.addChild(levelBarBg, -1);
        this.addChild(levelBar);

        var vipBar = new cc.ProgressTimer(new cc.Sprite("#home-vip-bar.png"));
        vipBar.setType(cc.ProgressTimer.TYPE_BAR);
        vipBar.setMidpoint(cc.p(0.0, 0.5));
        vipBar.setBarChangeRate(cc.p(1.0,0.0));
        vipBar.setAnchorPoint(cc.p(0.0,0.5));
        vipBar.setPosition(430, 30);
        vipBar.setPercentage(97.0);
        var vipBarBg = new cc.Sprite("#home-level-bg.png");
        vipBarBg.setPosition(vipBar.getContentSize().width/2, vipBar.getContentSize().height/2);
        vipBar.addChild(vipBarBg, -1);
        this.addChild(vipBar);

        var paymentBt = new ccui.Button("home-paymentBt.png", "home-paymentBt-selected.png", "", ccui.Widget.PLIST_TEXTURE);
        paymentBt.setPosition(947, 50);
        this.addChild(paymentBt);

        var rewardBt = new ccui.Button("home-rewardBt.png", "home-rewardBt-selected.png", "", ccui.Widget.PLIST_TEXTURE);
        rewardBt.setPosition(1170, 50);
        this.addChild(rewardBt);

        var newsBt = new ccui.Button("home-inboxBt.png", "home-inboxBt-selected.png", "", ccui.Widget.PLIST_TEXTURE);
        newsBt.setPosition(728, 50);
        this.addChild(newsBt);

        var newBg = new cc.Sprite("#home-news-count.png");
        newBg.setPosition(newsBt.getContentSize().width, newsBt.getContentSize().height);
        newsBt.addChild(newBg);

        var newLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "9+");
        newLabel.setPosition(newBg.getContentSize().width/2, newBg.getContentSize().height/2);
        newLabel.setColor(cc.color(104, 46, 46));
        newBg.addChild(newLabel);

        this.setScale(cc.winSize.screenScale);
    }
});