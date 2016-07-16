/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var UserinfoPasswordLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg1.setPreferredSize(cc.size(384, 60));
        bg1.setPosition(777, 434);
        this.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg2.setPreferredSize(cc.size(384, 60));
        bg2.setPosition(bg1.x, 356);
        this.addChild(bg2);

        var bg3 = ccui.Scale9Sprite.createWithSpriteFrameName("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg3.setPreferredSize(cc.size(384, 60));
        bg3.setPosition(bg1.x, 278);
        this.addChild(bg3);

        var okButton = new ccui.Button("dialog-button-1.png","","", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setZoomScale(0.03);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(384, 60);
        okButton.setPosition(bg1.x, 189);
        this.addChild(okButton);

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Đổi mật khẩu");
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);

        var textSize = cc.size(bg1.getContentSize().width - 4, bg1.getContentSize().height - 4);

        var passwordText = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_25);
        passwordText.setPlaceHolder("Mật khẩu cũ");
        passwordText.setPasswordEnable(true);
        passwordText.setPosition(bg1.getPosition());
        this.addChild(passwordText);

        var passwordText1 = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_25);
        passwordText1.setPlaceHolder("Mật khẩu mới");
        passwordText1.setPasswordEnable(true);
        passwordText1.setPosition(bg2.getPosition());
        this.addChild(passwordText1);

        var passwordText2 = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_25);
        passwordText2.setPlaceHolder("Nhập lại mật khẩu");
        passwordText2.setPasswordEnable(true);
        passwordText2.setPosition(bg3.getPosition());
        this.addChild(passwordText2);
    }
});

var UserInfoPhoneLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Số điện thoại xác nhận tài khoản");
        label1.setPosition(777, 410);
        this.addChild(label1);

        var phoneLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "0123456789");
        phoneLabel.setColor(cc.color("#009cff"));
        phoneLabel.setPosition(label1.x, 365);
        this.addChild(phoneLabel);
        this.phoneLabel = phoneLabel;

        var okButton = new ccui.Button("dialog-button-1.png","","", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setZoomScale(0.03);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(384, 60);
        okButton.setPosition(label1.x, 280);
        this.addChild(okButton);
        this.okButton = okButton;

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Đổi mật khẩu");
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);
    },
    refreshView : function () {

    },
    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.refreshView();
        }
    }
});

var UserSendPhoneLayer = cc.Node.extend({
    ctor : function () {
        this._super();
    }
});

var UserinfoVerifyLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        this.addChild(new UserSendPhoneLayer());
    },

});

var UserinfoDialog = IDialog.extend({
    ctor : function () {
        this._super();
        if(cc.winSize.width < 1080.0){
            this.dialogNode.setScale(cc.winSize.width / 1080.0);
        }

        var layer = new UserinfoVerifyLayer();
        this.dialogNode.addChild(layer,1);

        var dialogBg = ccui.Scale9Sprite.createWithSpriteFrameName("dialog-bg-2.png", cc.rect(114, 114, 4, 4));
        dialogBg.setPreferredSize(cc.size(1120, 748));
        dialogBg.setAnchorPoint(cc.p(0.0,0.0));
        this.dialogNode.setContentSize(dialogBg.getContentSize());
        this.dialogNode.addChild(dialogBg);

        var userinfoBg = ccui.Scale9Sprite.createWithSpriteFrameName("userinfo-bg.png", cc.rect(10, 10, 4, 4));
        userinfoBg.setPreferredSize(cc.size(874, 380));
        userinfoBg.setPosition(this.dialogNode.getContentSize().width/2, this.dialogNode.getContentSize().height/2 - 52);
        this.dialogNode.addChild(userinfoBg);

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "username");
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setPosition(208, this.dialogNode.getContentSize().height/2 + 220);
        this.dialogNode.addChild(userLabel);

        var goldIcon = new cc.Sprite("#userinfo-goldIcon.png");
        goldIcon.setAnchorPoint(cc.p(0.0, 0.5));
        goldIcon.setPosition(208 - 19, this.dialogNode.getContentSize().height/2 + 180);
        this.dialogNode.addChild(goldIcon);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "100.000V");
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(goldIcon.x + 62, goldIcon.y);
        this.dialogNode.addChild(goldLabel);

        var avatar = UserAvatar.createMe();
        avatar.setPosition(154, (userLabel.y + goldLabel.y)/2);
        this.dialogNode.addChild(avatar);

        var levelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Level 99");
        levelLabel.setAnchorPoint(cc.p(0.0, 0.5));
        levelLabel.setPosition(586, userLabel.y);
        this.dialogNode.addChild(levelLabel);

        var vipLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "VIP 99");
        vipLabel.setAnchorPoint(cc.p(0.0, 0.5));
        vipLabel.setPosition(levelLabel.x, goldLabel.y);
        this.dialogNode.addChild(vipLabel);

        var levelBar = new cc.ProgressTimer(new cc.Sprite("#userinfo-level-bar.png"));
        levelBar.setType(cc.ProgressTimer.TYPE_BAR);
        levelBar.setBarChangeRate(cc.p(1.0, 0.0));
        levelBar.setMidpoint(cc.p(0.0,0.5));
        levelBar.setAnchorPoint(cc.p(0.5,0.5));
        levelBar.setPosition(770.0, levelLabel.y);
        levelBar.setPercentage(50.0);
        this.dialogNode.addChild(levelBar);

        var levelBarBg = new cc.Sprite("#userinfo-level-bg.png");
        levelBarBg.setPosition(levelBar.getContentSize().width/2, levelBar.getContentSize().height/2);
        levelBar.addChild(levelBarBg,-1);

        var vipBar = new cc.ProgressTimer(new cc.Sprite("#userinfo-vip-bar.png"));
        vipBar.setType(cc.ProgressTimer.TYPE_BAR);
        vipBar.setBarChangeRate(cc.p(1.0, 0.0));
        vipBar.setMidpoint(cc.p(0.0,0.5));
        vipBar.setAnchorPoint(cc.p(0.5,0.5));
        vipBar.setPosition(770.0, vipLabel.y);
        vipBar.setPercentage(50.0);
        this.dialogNode.addChild(vipBar);

        var vipBarBg = new cc.Sprite("#userinfo-level-bg.png");
        vipBarBg.setPosition(vipBar.getContentSize().width/2, vipBar.getContentSize().height/2);
        vipBar.addChild(vipBarBg,-1);
    }
});