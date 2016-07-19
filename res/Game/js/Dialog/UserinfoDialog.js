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

var VerifyPhoneLayer = cc.Node.extend({
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

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Đổi số điện thoại");
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);
    },
    refreshView : function () {
        this.phoneLabel.setString(PlayerMe.phoneNumber);
    },
    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.refreshView();
        }
    }
});

var VerifySendPhoneLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg1.setPreferredSize(cc.size(384, 60));
        bg1.setPosition(777, 434);
        this.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg2.setPreferredSize(cc.size(384, 60));
        bg2.setPosition(bg1.x, 354);
        this.addChild(bg2);

        var textSize = cc.size(bg1.getContentSize().width - 4, bg1.getContentSize().height - 4);

        var phoneText = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_25);
        phoneText.setPlaceHolder("Nhập số điện thoại");
        phoneText.setPosition(bg1.getPosition());
        this.addChild(phoneText,1);
        this.phoneText = phoneText;

        var passwordText = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_25);
        passwordText.setPlaceHolder("Nhập mật khẩu");
        passwordText.setPasswordEnable(true);
        passwordText.setPosition(bg2.getPosition());
        this.addChild(passwordText,1);
        this.passwordText = passwordText;

        var okButton = new ccui.Button("dialog-button-1.png","","", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setZoomScale(0.03);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(384, 60);
        okButton.setPosition(bg1.x, 265);
        this.addChild(okButton);

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Xác nhận");
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);

        var sendCodeBt = new ccui.Text("Đã có mã xác nhận", cc.res.font.Roboto_Condensed, 25);
        sendCodeBt.setPosition(okButton.x, 160);
        sendCodeBt.setTouchEnabled(true);
        sendCodeBt.setTextColor(cc.color("#009cff"));
        this.addChild(sendCodeBt,1);
        this.sendCodeBt = sendCodeBt;
    },
    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.phoneText.setText("");
            this.passwordText.setText("");
        }
    }
});

var VerifySendCodeLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Nhập mã xác nhận");
        title.setScale(20.0 / 25.0);
        title.setPosition(777, 452);
        this.addChild(title, 1);
        this.title = title;

        var phoneLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "0123456789");
        phoneLabel.setPosition(title.x, 415);
        phoneLabel.setColor(cc.color("#009cff"));
        this.addChild(phoneLabel, 1);
        this.phoneLabel = phoneLabel;

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg1.setPreferredSize(cc.size(384, 60));
        bg1.setPosition(777, 336);
        this.addChild(bg1);

        var textSize = cc.size(bg1.getContentSize().width - 4, bg1.getContentSize().height - 4);

        var codeText = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_25);
        codeText.setPlaceHolder("Mã xác nhận");
        codeText.setPosition(bg1.getPosition());
        this.addChild(codeText,1);
        this.codeText = codeText;

        var okButton = new ccui.Button("dialog-button-1.png","","", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setZoomScale(0.03);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(384, 60);
        okButton.setPosition(bg1.x, 242);
        this.addChild(okButton);
        this.okButton = okButton;

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Xác nhận");
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);

        var backButton = new ccui.Text("Quay lại", cc.res.font.Roboto_Condensed, 25);
        backButton.setPosition(okButton.x, 160);
        backButton.setTouchEnabled(true);
        backButton.setTextColor(cc.color("#009cff"));
        this.addChild(backButton,1);
        this.backButton = backButton;
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.phoneLabel.visible = false;
            this.title.setString("Nhập mã xác nhận");
        }
        else{
            this.codeText.setText("");
        }
    }
});

var UserinfoVerifyLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        this.phoneLayer = new VerifyPhoneLayer();
        this.addChild(this.phoneLayer);

        this.sendPhoneLayer = new VerifySendPhoneLayer();
        this.addChild(this.sendPhoneLayer);

        this.sendCodeLayer = new VerifySendCodeLayer();
        this.addChild(this.sendCodeLayer);

        this.refreshView();

        var thiz = this;
        this.sendPhoneLayer.sendCodeBt.addClickEventListener(function () {
            thiz.toSendCodeLayer();
        });

        this.sendCodeLayer.backButton.addClickEventListener(function () {
            thiz.toSendPhoneLayer();
        });

        this.phoneLayer.okButton.addClickEventListener(function () {
            thiz.toSendPhoneLayer();
        });
    },
    toSendPhoneLayer : function () {
        this.phoneLayer.setVisible(false);
        this.sendPhoneLayer.setVisible(true);
        this.sendCodeLayer.setVisible(false);
    },
    toSendCodeLayer : function () {
        this.phoneLayer.setVisible(false);
        this.sendPhoneLayer.setVisible(false);
        this.sendCodeLayer.setVisible(true);
    },
    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.refreshView();
        }
    },
    refreshView :function () {
        if(PlayerMe.verify){
            this.phoneLayer.setVisible(true);
            this.sendPhoneLayer.setVisible(false);
            this.sendCodeLayer.setVisible(false);
        }
        else{
            this.phoneLayer.setVisible(false);
            this.sendPhoneLayer.setVisible(true);
            this.sendCodeLayer.setVisible(false);
        }
    }
});

var UserinfoDialog = IDialog.extend({
    ctor : function () {
        this._super();
        if(cc.winSize.width < 1080.0){
            this.dialogNode.setScale(cc.winSize.width / 1080.0);
        }
        var thiz = this;
        this.selectTab = 0;

        var dialogBg = ccui.Scale9Sprite.createWithSpriteFrameName("dialog-bg-2.png", cc.rect(114, 114, 4, 4));
        dialogBg.setPreferredSize(cc.size(1120, 748));
        dialogBg.setAnchorPoint(cc.p(0.0,0.0));
        this.dialogNode.setContentSize(dialogBg.getContentSize());
        this.dialogNode.addChild(dialogBg);

        var userinfoBg = ccui.Scale9Sprite.createWithSpriteFrameName("userinfo-bg.png", cc.rect(10, 10, 4, 4));
        userinfoBg.setPreferredSize(cc.size(874, 380));
        userinfoBg.setPosition(this.dialogNode.getContentSize().width/2, this.dialogNode.getContentSize().height/2 - 52);
        this.dialogNode.addChild(userinfoBg);

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, PlayerMe.username);
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
        this.goldLabel = goldLabel;

        var avatar = UserAvatar.createMe();
        avatar.setPosition(154, (userLabel.y + goldLabel.y)/2);
        this.dialogNode.addChild(avatar);

        var levelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Level 99");
        levelLabel.setAnchorPoint(cc.p(0.0, 0.5));
        levelLabel.setPosition(586, userLabel.y);
        this.dialogNode.addChild(levelLabel);
        this.levelLabel = levelLabel;

        var vipLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "VIP 99");
        vipLabel.setAnchorPoint(cc.p(0.0, 0.5));
        vipLabel.setPosition(levelLabel.x, goldLabel.y);
        this.dialogNode.addChild(vipLabel);
        this.vipLabel = vipLabel;

        var levelBar = new cc.ProgressTimer(new cc.Sprite("#userinfo-level-bar.png"));
        levelBar.setType(cc.ProgressTimer.TYPE_BAR);
        levelBar.setBarChangeRate(cc.p(1.0, 0.0));
        levelBar.setMidpoint(cc.p(0.0,0.5));
        levelBar.setAnchorPoint(cc.p(0.5,0.5));
        levelBar.setPosition(770.0, levelLabel.y);
        levelBar.setPercentage(50.0);
        this.dialogNode.addChild(levelBar);
        this.levelBar = levelBar;

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
        this.vipBar = vipBar;

        var vipBarBg = new cc.Sprite("#userinfo-level-bg.png");
        vipBarBg.setPosition(vipBar.getContentSize().width/2, vipBar.getContentSize().height/2);
        vipBar.addChild(vipBarBg,-1);

        var closeBt = new ccui.Button("dialog-button-close.png", "","", ccui.Widget.PLIST_TEXTURE);
        closeBt.setPosition(983 , 605);
        this.dialogNode.addChild(closeBt);
        closeBt.addClickEventListener(function () {
            thiz.hide();
        });

        var touchSize = cc.size(this.dialogNode.getContentSize().width - 200.0, this.dialogNode.getContentSize().height - 200.0);
        this.mTouch = cc.rect(cc.winSize.width/2 - touchSize.width/2, cc.winSize.height/2- touchSize.height/2, touchSize.width, touchSize.height);

        this.initAllLayer();
        this.refreshView();
    },

    initAllLayer : function () {
        var allLayer = [new UserinfoPasswordLayer(), new UserinfoVerifyLayer()];
        for(var i=0;i<allLayer.length;i++){
            this.dialogNode.addChild(allLayer[i],1);
            allLayer[i].visible = false;
        }
        this.allLayer = allLayer;

        var img1 = ["#userinfo-tab1.png", "#userinfo-tab3.png"];
        var img2 = ["#userinfo-tab2.png", "#userinfo-tab4.png"];
        var x = 340.0;
        var y = 419.0;
        var dy = 86.0;

        var mToggle = new ToggleNodeGroup();
        this.mToggle = mToggle;
        this.dialogNode.addChild(mToggle);
        for(var i=0;i<img1.length;i++){
            var icon1 = new cc.Sprite(img1[i]);
            icon1.setPosition(x,y);
            this.dialogNode.addChild(icon1);

            var icon2 = new cc.Sprite(img2[i]);
            icon2.setPosition(x,y);
            this.dialogNode.addChild(icon2);
            if(i==1){
                var subicon1 = new cc.Sprite("#userinfo-tab5.png");
                subicon1.setPosition(icon1.getContentSize().width/2,icon1.getContentSize().height/2);
                icon1.addChild(subicon1);

                var subicon2 = new cc.Sprite("#userinfo-tab6.png");
                subicon2.setPosition(icon2.getContentSize().width/2,icon2.getContentSize().height/2);
                icon2.addChild(subicon2);

                this.subicon1 = subicon1;
                this.subicon2 = subicon2;
            }

            var toggleItem = new ToggleNodeItem(icon1.getContentSize());
            toggleItem.icon1 = icon1;
            toggleItem.icon2 = icon2;
            toggleItem.layer = allLayer[i];
            toggleItem.setPosition(x,y);
            toggleItem.onSelect = function () {
                this.icon1.visible = false;
                this.icon2.visible = true;
                this.layer.setVisible(true);
            };
            toggleItem.onUnSelect = function () {
                this.icon1.visible = true;
                this.icon2.visible = false;
                this.layer.setVisible(false);
            };
            mToggle.addItem(toggleItem);
            y-=dy;
        }
    },

    refreshView : function () {
        this.goldLabel.setString(cc.Global.NumberFormat1(PlayerMe.gold) +" V");
        if(PlayerMe.verify){
            this.subicon1.visible = false;
            this.subicon2.visible = false;
        }
        else{
            this.subicon1.visible = true;
            this.subicon2.visible = true;
        }
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(this.selectTab);
    }
});