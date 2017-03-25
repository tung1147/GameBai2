/**
 * Created by Quyet Nguyen on 7/1/2016.
 */

var LobbyBottomBar = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setAnchorPoint(cc.p(0,0));

        var bg = new cc.Sprite("#bot_bar_bg.png");
        bg.setAnchorPoint(cc.p(0,0));
        bg.setPosition(cc.p(0,0));
        this.addChild(bg);

        var bg2 = new cc.Sprite("#bot_bar_avt_bg.png");
        bg2.setAnchorPoint(cc.p(0,0));
        bg2.setPosition(cc.p(0,0));
        this.addChild(bg2);

        var logo = new cc.Sprite("#bot_bar_logo.png");
        logo.setPosition(640, 68);
        this.addChild(logo);

        var avt = UserAvatar.createMe();
        avt.setPosition(49, 49);
        this.addChild(avt, 0);
        this.avatar = avt;

        var nameLabel = new cc.LabelTTF("Name2221231312313213212312312332132", cc.res.font.Roboto_CondensedBold, 18);
        nameLabel.setAnchorPoint(0.0, 0.5);
        nameLabel.setFontFillColor(cc.color("#63b0f1"));
        nameLabel.setPosition(92, 54);
        this.addChild(nameLabel,1);
        this.nameLabel = nameLabel;

        var goldLabel = new cc.LabelTTF("100,1111V", cc.res.font.Roboto_Condensed, 18);
        goldLabel.setAnchorPoint(0.0, 0.5);
        goldLabel.setFontFillColor(cc.color("#ffde00"));
        goldLabel.setPosition(92, 32);
        this.addChild(goldLabel,1);
        this.goldLabel = goldLabel;

        var level = new cc.LabelTTF("6", cc.res.font.Roboto_Condensed, 18);
        level.setPosition(294, 41);
        level.setFontFillColor(cc.color("#009cff"));
        this.addChild(level, 1);
        this.levelLabel = level;

        var vip = new cc.LabelTTF("Level 6", cc.res.font.Roboto_Condensed, 18);
        vip.setPosition(367, 41);
        vip.setFontFillColor(cc.color("#ffde00"));
        this.addChild(vip, 1);
        this.vipLabel = vip;

        var _levelText = new cc.LabelTTF("Level", cc.res.font.Roboto_Condensed, 14);
        _levelText.setFontFillColor(cc.color("#6a8fcc"));
        _levelText.setPosition(level.x, 9);
        this.addChild(_levelText, 1);

        var _vipText = new cc.LabelTTF("V.I.P", cc.res.font.Roboto_Condensed, 14);
        _vipText.setFontFillColor(cc.color("#6a8fcc"));
        _vipText.setPosition(vip.x, 9);
        this.addChild(_vipText, 1);

        var levelBar = new cc.ProgressTimer(new cc.Sprite("#bot_bar_levelBar_1.png"));
        levelBar.setType(cc.ProgressTimer.TYPE_RADIAL);
        levelBar.setReverseDirection(true);
        levelBar.setPosition(level.getPosition());
        levelBar.setPercentage(25.0);
        var levelBarBg = new cc.Sprite("#bot_bar_levelBar_bg.png");
        levelBarBg.setPosition(levelBar.getContentSize().width/2, levelBar.getContentSize().height/2);
        levelBar.addChild(levelBarBg, -1);
        this.addChild(levelBar);
        this.levelBar = levelBar;

        var vipBar = new cc.ProgressTimer(new cc.Sprite("#bot_bar_levelBar_2.png"));
        vipBar.setType(cc.ProgressTimer.TYPE_RADIAL);
        vipBar.setReverseDirection(true);
        vipBar.setPosition(vip.getPosition());
        vipBar.setPercentage(75.0);
        var vipBarBg = new cc.Sprite("#bot_bar_levelBar_bg.png");
        vipBarBg.setPosition(vipBar.getContentSize().width/2, vipBar.getContentSize().height/2);
        vipBar.addChild(vipBarBg, -1);
        this.addChild(vipBar);
        this.vipBar = vipBar;

        if(!cc.sys.isNative && cc._renderType === cc.game.RENDER_TYPE_WEBGL){
            vipBar._alwaysRefreshVertext = true;
            levelBar._alwaysRefreshVertext = true;
        }

        var paymentBt = new ccui.Button("bot_bar_paymentBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        paymentBt.setPosition(933, 35);
        this.addChild(paymentBt);

        var rewardBt = new ccui.Button("bot_bar_rewardBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rewardBt.setPosition(1166, 46);
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

        var myName = PlayerMe.username;
        if(myName.length > 15){
            myName = PlayerMe.username.substr(0, 15);
        }

        this.nameLabel.setString(myName);
        this.goldLabel.setString(cc.Global.NumberFormat1(PlayerMe.gold) +" V");

        var level = cc.Global.GetLevelMe();
        this.levelLabel.setString(level.level.toString());
        this.levelBar.setPercentage(level.expPer);

        var vip = cc.Global.GetVipMe();
        this.vipLabel.setString(vip.level.toString());
        this.vipBar.setPercentage(vip.expPer);
    }
});