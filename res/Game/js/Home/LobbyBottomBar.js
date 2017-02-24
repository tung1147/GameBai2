/**
 * Created by Quyet Nguyen on 7/1/2016.
 */

var LobbyBottomBar = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg = new ccui.Scale9Sprite("home-bar-bg.png", cc.rect(8,8,4,4));
        bg.setPreferredSize(cc.size(1280.0, 70.0));
        bg.setAnchorPoint(cc.p(0,0));
        bg.setPosition(cc.p(0,0));
        this.addChild(bg);
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0,0));

        var avt =  UserAvatar.createMe();
        avt.setPosition(48, 35);
        this.addChild(avt, 0);
        this.avatar = avt;

        if(cc.sys.isNative){
            var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Name2221231312313213212312312332132");
            nameLabel.setLineBreakWithoutSpace(true);
            nameLabel.setDimensions(190.0, nameLabel.getLineHeight());
        }
        else{
            var nameLabel = new cc.LabelTTF("Name2221231312313213212312312332132", cc.res.font.Roboto_CondensedBold, 25);
            nameLabel.setDimensions(190.0, nameLabel.getLineHeight());
        }

        nameLabel.setAnchorPoint(0.0, 0.5);
        nameLabel.setColor(cc.color("#69abe8"));
        nameLabel.setScale(0.8);
        nameLabel.setPosition(86,47);
        this.addChild(nameLabel,1);
        this.nameLabel = nameLabel;

        var goldIcon = new cc.Sprite("#home-gold-icon.png");
        goldIcon.setPosition(94, 24);
        this.addChild(goldIcon);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "500000V");
        goldLabel.setAnchorPoint(0.0, 0.5);
        goldLabel.setColor(cc.color(255,184,0));
        goldLabel.setScale(0.8);
        goldLabel.setPosition(106,22);
        this.addChild(goldLabel,1);
        this.goldLabel = goldLabel;

        var level = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Level 50");
        level.setAnchorPoint(0.0, 0.5);
        level.setColor(cc.color("#63b0f1"));
        level.setScale(0.6);
        level.setPosition(320, 47);
        this.addChild(level, 1);
        this.levelLabel = level;

        var vip = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "VIP 5");
        vip.setAnchorPoint(0.0, 0.5);
        vip.setColor(cc.color("#63b0f1"));
        vip.setScale(0.6);
        vip.setPosition(320, 23);
        this.addChild(vip, 1);
        this.vipLabel = vip;

        var levelBar = new cc.ProgressTimer(new cc.Sprite("#home-level-bar.png"));
        levelBar.setType(cc.ProgressTimer.TYPE_BAR);
        levelBar.setMidpoint(cc.p(0.0, 0.5));
        levelBar.setBarChangeRate(cc.p(1.0,0.0));
        levelBar.setAnchorPoint(cc.p(0.0,0.5));
        levelBar.setPosition(370, 45);
        levelBar.setPercentage(50.0);
        var levelBarBg = new cc.Sprite("#home-level-bg.png");
        levelBarBg.setPosition(levelBar.getContentSize().width/2, levelBar.getContentSize().height/2);
        levelBar.addChild(levelBarBg, -1);
        this.addChild(levelBar);
        this.levelBar = levelBar;

        var vipBar = new cc.ProgressTimer(new cc.Sprite("#home-vip-bar.png"));
        vipBar.setType(cc.ProgressTimer.TYPE_BAR);
        vipBar.setMidpoint(cc.p(0.0, 0.5));
        vipBar.setBarChangeRate(cc.p(1.0,0.0));
        vipBar.setAnchorPoint(cc.p(0.0,0.5));
        vipBar.setPosition(370, 22);
        vipBar.setPercentage(97.0);
        var vipBarBg = new cc.Sprite("#home-level-bg.png");
        vipBarBg.setPosition(vipBar.getContentSize().width/2, vipBar.getContentSize().height/2);
        vipBar.addChild(vipBarBg, -1);
        this.addChild(vipBar);
        this.vipBar = vipBar;

        var paymentBt = new ccui.Button("home-paymentBt.png", "home-paymentBt-selected.png", "", ccui.Widget.PLIST_TEXTURE);
        paymentBt.setPosition(1007, 35);
        this.addChild(paymentBt);

        var rewardBt = new ccui.Button("home-rewardBt.png", "home-rewardBt-selected.png", "", ccui.Widget.PLIST_TEXTURE);
        rewardBt.setPosition(1175, 35);
        this.addChild(rewardBt);

        var newsBt = new ccui.Button("home-inboxBt.png", "home-inboxBt-selected.png", "", ccui.Widget.PLIST_TEXTURE);
        newsBt.setPosition(840, 35);
        this.addChild(newsBt);

        var newBg = new cc.Sprite("#home-news-count.png");
        newBg.setPosition(newsBt.getContentSize().width, newsBt.getContentSize().height);
        newsBt.addChild(newBg);

        var newLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "9+");
        newLabel.setPosition(newBg.getContentSize().width/2, newBg.getContentSize().height/2);
        newLabel.setColor(cc.color(104, 46, 46));
        newBg.addChild(newLabel);

        var userinfoBt = new ccui.Widget();
        userinfoBt.setContentSize(avt.getContentSize());
        userinfoBt.setTouchEnabled(true);
        userinfoBt.setPosition(avt.getPosition());
        this.addChild(userinfoBt);

        this.setScale(cc.winSize.screenScale);

        this.paymentBt = paymentBt;
        this.rewardBt = rewardBt;
        this.newsBt = newsBt;
        this.newBg = newBg;
        this.newLabel = newLabel;
        this.userinfoBt = userinfoBt;

        this.refreshView();
    },

    refreshView : function () {
        this.avatar.serAvatarId(PlayerMe.avatar);
        this.nameLabel.setString(PlayerMe.username);
        this.goldLabel.setString(cc.Global.NumberFormat1(PlayerMe.gold) +" V");
        if(PlayerMe.messageCount <= 0){
            this.newBg.visible = false;
        }
        else{
            this.newBg.visible = true;
            if(PlayerMe.messageCount > 9){
                this.newLabel.setString("9+");
            }
            else{
                this.newLabel.setString(PlayerMe.messageCount.toString());
            }
        }

        var level = cc.Global.GetLevelMe();
        this.levelLabel.setString("Level " + level.level);
        this.levelBar.setPercentage(level.expPer);

        var vip = cc.Global.GetVipMe();
        this.vipLabel.setString("VIP " + vip.level);
        this.vipBar.setPercentage(vip.expPer);

        //this.avatar.
    }
});