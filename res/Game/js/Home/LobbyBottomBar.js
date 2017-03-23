/**
 * Created by Quyet Nguyen on 7/1/2016.
 */

var InboxCountNode = cc.Node.extend({
    ctor : function () {
        this._super();

        // var bg = new cc.Sprite("#home-news-count.png");
        // bg.setPosition(newsBt.getContentSize().width, newsBt.getContentSize().height);
        // newsBt.addChild(newBg);
        //
        // var newLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "9+");
        // newLabel.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
        // newLabel.setColor(cc.color(104, 46, 46));
        // bg.addChild(newLabel);

        // if(PlayerMe.messageCount <= 0){
        //     this.newBg.visible = false;
        // }
        // else{
        //     this.newBg.visible = true;
        //     if(PlayerMe.messageCount > 9){
        //         this.newLabel.setString("9+");
        //     }
        //     else{
        //         this.newLabel.setString(PlayerMe.messageCount.toString());
        //     }
        // }
    }
});

var LobbyBottomBar = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("#bot_bar_bg.png");
        bg.setAnchorPoint(cc.p(0,0));
        bg.setPosition(cc.p(0,0));
        this.addChild(bg);
        this.setAnchorPoint(cc.p(0,0));

        var logo = new cc.Sprite("#bot_bar_logo.png");
        logo.setPosition(640, 50);
        this.addChild(logo);

        var avt =  UserAvatar.createMe();
        avt.setPosition(58, 44);
        this.addChild(avt, 0);
        this.avatar = avt;

        var nameLabel = new cc.LabelTTF("Name2221231312313213212312312332132", cc.res.font.Roboto_CondensedBold, 18);
        nameLabel.setDimensions(190.0, nameLabel.getLineHeight());
        nameLabel.setAnchorPoint(0.0, 0.5);
        nameLabel.setColor(cc.color("#63b0f1"));
        nameLabel.setPosition(103,47);
        this.addChild(nameLabel,1);
        this.nameLabel = nameLabel;

        var goldLabel = new cc.LabelTTF("100,1111V", cc.res.font.Roboto_Condensed, 14);
        goldLabel.setAnchorPoint(0.0, 0.5);
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(103,25);
        this.addChild(goldLabel,1);
        this.goldLabel = goldLabel;

        var level = new cc.LabelTTF("Level 6", cc.res.font.Roboto_Condensed, 14);
        level.setAnchorPoint(0.0, 0.5);
        level.setPosition(248, 47);
        level.setColor(cc.color("#63b0f1"));
        this.addChild(level, 1);
        this.levelLabel = level;

        var vip = new cc.LabelTTF("Level 6", cc.res.font.Roboto_Condensed, 14);
        vip.setAnchorPoint(0.0, 0.5);
        vip.setPosition(248, 25);
        vip.setColor(cc.color("#63b0f1"));
        this.addChild(vip, 1);
        this.vipLabel = vip;

        var levelBar = new cc.ProgressTimer(new cc.Sprite("#bot_bar_levelBar_1.png"));
        levelBar.setType(cc.ProgressTimer.TYPE_BAR);
        levelBar.setMidpoint(cc.p(0.0, 0.5));
        levelBar.setBarChangeRate(cc.p(1.0,0.0));
        levelBar.setAnchorPoint(cc.p(0.0,0.5));
        levelBar.setPosition(300, 47);
        levelBar.setPercentage(50.0);
        var levelBarBg = new cc.Sprite("#bot_bar_levelBar_bg.png");
        levelBarBg.setPosition(levelBar.getContentSize().width/2, levelBar.getContentSize().height/2);
        levelBar.addChild(levelBarBg, -1);
        this.addChild(levelBar);
        this.levelBar = levelBar;

        var vipBar = new cc.ProgressTimer(new cc.Sprite("#bot_bar_levelBar_2.png"));
        vipBar.setType(cc.ProgressTimer.TYPE_BAR);
        vipBar.setMidpoint(cc.p(0.0, 0.5));
        vipBar.setBarChangeRate(cc.p(1.0,0.0));
        vipBar.setAnchorPoint(cc.p(0.0,0.5));
        vipBar.setPosition(300, 25);
        vipBar.setPercentage(97.0);
        var vipBarBg = new cc.Sprite("#bot_bar_levelBar_bg.png");
        vipBarBg.setPosition(vipBar.getContentSize().width/2, vipBar.getContentSize().height/2);
        vipBar.addChild(vipBarBg, -1);
        this.addChild(vipBar);
        this.vipBar = vipBar;

        var paymentBt = new ccui.Button("bot_bar_paymentBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        paymentBt.setPosition(1011, 40);
        this.addChild(paymentBt);

        var rewardBt = new ccui.Button("bot_bar_rewardBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rewardBt.setPosition(1170, 40);
        this.addChild(rewardBt);

        var userinfoBt = new ccui.Widget();
        userinfoBt.setContentSize(cc.size(200, 80));
        userinfoBt.setAnchorPoint(cc.p(0,0));
        userinfoBt.setTouchEnabled(true);
        userinfoBt.setPosition(0, 0);
        this.addChild(userinfoBt);

        this.setScale(cc.winSize.screenScale);

        this.paymentBt = paymentBt;
        this.rewardBt = rewardBt;
        this.userinfoBt = userinfoBt;

        this.refreshView();
    },

    refreshView : function () {
        this.avatar.setAvatarMe();
        this.nameLabel.setString(PlayerMe.username);
        this.goldLabel.setString(cc.Global.NumberFormat1(PlayerMe.gold) +" V");


        var level = cc.Global.GetLevelMe();
        this.levelLabel.setString("Level " + level.level);
        this.levelBar.setPercentage(level.expPer);

        var vip = cc.Global.GetVipMe();
        this.vipLabel.setString("VIP " + vip.level);
        this.vipBar.setPercentage(vip.expPer);
    }
});