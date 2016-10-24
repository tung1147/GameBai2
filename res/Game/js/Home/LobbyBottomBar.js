/**
 * Created by Quyet Nguyen on 7/1/2016.
 */

var LobbyBottomBar = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("#home-bottom-bar.png");
        bg.setAnchorPoint(cc.p(0,0));
        bg.setPosition(cc.p(0,0));
        this.addChild(bg);
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0,0));

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Name2221231312313213212312312332132", cc.TEXT_ALIGNMENT_CENTER);
        nameLabel.setDimensions(190.0, nameLabel.getLineHeight());
        nameLabel.setLineBreakWithoutSpace(true);
        nameLabel.setColor(cc.color(255,255,255));
        nameLabel.setPosition(274, 88);
        this.addChild(nameLabel,1);
        this.nameLabel = nameLabel;

        var goldBg = new ccui.Scale9Sprite("home-bar-bg1.png", cc.rect(20,0,4,27));
        goldBg.setPreferredSize(cc.size(202.0, 27.0));
        goldBg.setPosition(274, 58);
        this.addChild(goldBg);
        var startIcon = new cc.Sprite("#home-start-icon.png");
        startIcon.setPosition(cc.p(182, goldBg.y));
        this.addChild(startIcon);

        var goldLabel = cc.Label.createWithBMFont("res/fonts/lobby_gold_number.fnt", "500.000");
        goldLabel.setColor(cc.color(255,184,0));
        goldLabel.setPosition(goldBg.x, goldBg.y + 2);
        this.addChild(goldLabel,1);
        this.goldLabel = goldLabel;

        var levelBar = new cc.ProgressTimer(new cc.Sprite("#home-level-bar.png"));
        levelBar.setType(cc.ProgressTimer.TYPE_BAR);
        levelBar.setMidpoint(cc.p(0.0, 0.5));
        levelBar.setBarChangeRate(cc.p(1.0,0.0));
        levelBar.setPosition(goldBg.x, 21);
        levelBar.setPercentage(50.0);
        this.addChild(levelBar);
        this.levelBar = levelBar;
        var levelBarBg = new ccui.Scale9Sprite("home-bar-bg1.png", cc.rect(20,0,4,27));
        levelBarBg.setPreferredSize(cc.size(202.0, 27.0));
        levelBarBg.setPosition(levelBar.getContentSize().width/2, levelBar.getContentSize().height/2);
        levelBar.addChild(levelBarBg, -1);
        var startIcon2 = new cc.Sprite("#home-start-icon2.png");
        startIcon2.setPosition(cc.p(182, levelBar.y));
        this.addChild(startIcon2);

        var level = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Lv.50");
        level.setPosition(levelBar.x, levelBar.y-1);
        level.setColor(cc.color.WHITE);
        this.addChild(level, 1);
        this.levelLabel = level;

        var avt =  UserAvatar.createMe();
        avt.setPosition(80, 60);
        this.addChild(avt, 0);
        this.avatar = avt;

        var paymentBt = new ccui.Button("home-paymentBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        paymentBt.setPosition(472, 72);
        this.addChild(paymentBt);
        var rewardBt = new ccui.Button("home-rewardBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rewardBt.setPosition(620, paymentBt.y);
        this.addChild(rewardBt);

        this.paymentBt = paymentBt;
        this.rewardBt = rewardBt;

        var paymentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "NẠP VÀNG");
        paymentLabel.setPosition(paymentBt.x, 18);
        this.addChild(paymentLabel, 1);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "ĐỔI THƯỞNG");
        rewardLabel.setPosition(rewardBt.x, paymentLabel.y);
        this.addChild(rewardLabel, 1);
    },

    refreshView : function () {
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
    }
});