/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var UserinfoPasswordLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("changePassword", this.onRecvChangePassword, this);

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
        passwordText.setPlaceHolderColor(cc.color("#787878"));
        passwordText.setPasswordEnable(true);
        passwordText.setPosition(bg1.getPosition());
        this.addChild(passwordText);

        var passwordText1 = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_25);
        passwordText1.setPlaceHolder("Mật khẩu mới");
        passwordText1.setPlaceHolderColor(cc.color("#787878"));
        passwordText1.setPasswordEnable(true);
        passwordText1.setPosition(bg2.getPosition());
        this.addChild(passwordText1);

        var passwordText2 = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_25);
        passwordText2.setPlaceHolder("Nhập lại mật khẩu");
        passwordText2.setPlaceHolderColor(cc.color("#787878"));
        passwordText2.setPasswordEnable(true);
        passwordText2.setPosition(bg3.getPosition());
        this.addChild(passwordText2);

        okButton.addClickEventListener(function () {
            var password = passwordText.getText();
            if(password === ""){
                MessageNode.getInstance().show("Bạn phải mật khẩu");
                return;
            }
            var newPassword1 = passwordText1.getText();
            if(newPassword1 === ""){
                MessageNode.getInstance().show("Bạn phải mật khẩu mới");
                return;
            }
            var newPassword2 = passwordText2.getText();
            if(newPassword2 === ""){
                MessageNode.getInstance().show("Bạn phải lại mật khẩu mới");
                return;
            }
            if(newPassword1 != newPassword2){
                MessageNode.getInstance().show("Mật khẩu không trùng nhau");
                return;
            }
             var request = {
                 command : "changePassword",
                 password : password,
                 newPassword : newPassword1
            };
            LobbyClient.getInstance().send(request);
            LoadingDialog.getInstance().show("Đang đổi mật khẩu");
        });
    },
    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },
    onRecvChangePassword : function (messageName, data) {
        LoadingDialog.getInstance().hide();
        if(data.status === 0){
            MessageNode.getInstance().show("Đổi mật khẩu thành công");
        }
        else{
            MessageNode.getInstance().show("Đổi mật khẩu thất bại");
        }
    },
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


var s_Verify_SMS_Provider = s_Verify_SMS_Provider || ["VIETTEL", "VINA", "MOBI"];
var VerifySendSMSLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var mToggle = new ToggleNodeGroup();
        this.mToggle = mToggle;
        this.addChild(mToggle);

        var left = 600;
        var right = 1000;
        var dx = (right - left)/(s_Verify_SMS_Provider.length);
        var x = left + dx/2;
        var y = 450;

        this.smsLabel = [];
        var thiz = this;
        for(var i=0; i<s_Verify_SMS_Provider.length; i++){
            (function () {
                var label = new cc.LabelBMFont(s_Verify_SMS_Provider[i], cc.res.font.Roboto_Condensed_25);
                label.setColor(cc.color("#72acd6"));
                label.setPosition(x - 10, y);
                thiz.addChild(label,1);

                var bg1 = new cc.Sprite("#dialog-checkBox-2.png");
                bg1.setPosition(label.x - label.getContentSize().width/2 - 20, y);
                thiz.addChild(bg1);

                var bg2 = new cc.Sprite("#dialog-checkBoxCross-2.png");
                bg2.setPosition(bg1.getPosition());
                thiz.addChild(bg2);

                var smsContent =  new cc.LabelTTF("sms", cc.res.font.Roboto_Condensed, 20, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER);
                smsContent.setPosition((right + left)/2 - 30, 350);
                thiz.addChild(smsContent, 1);
                thiz.smsLabel.push(smsContent);

                var toggleItem = new ToggleNodeItem(cc.size(dx, bg1.getContentSize().height));
                toggleItem.setPosition((bg1.x + label.x)/2, bg1.y);
                toggleItem.onSelect = function () {
                    bg2.setVisible(true);
                    smsContent.setVisible(true);
                };
                toggleItem.onUnSelect = function () {
                    bg2.setVisible(false);
                    smsContent.setVisible(false);
                };
                mToggle.addItem(toggleItem);
                x += dx;
            })();
        }

        if(cc.sys.isNative){
            var okButton = new ccui.Button("dialog-button-1.png","","", ccui.Widget.PLIST_TEXTURE);
            okButton.setScale9Enabled(true);
            okButton.setZoomScale(0.03);
            okButton.setCapInsets(cc.rect(10,10,4,4));
            okButton.setContentSize(384, 60);
            okButton.setPosition((right + left)/2 - 30, 230);
            this.addChild(okButton);
            this.okButton = okButton;

            var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Xác nhận");
            okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
            okButton.getRendererNormal().addChild(okTitle);

            okButton.addClickEventListener(function () {

            });
        }
    },
    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.mToggle.selectItem(0);
            if(this.okButton){
                this.okButton.setVisible(false);
            }

            //requet sms
            var request = {
                command : "getVerifyAccountMessage"
            };
            LobbyClient.getInstance().send(request);
        }
    },

    onEnter : function () {
        this._super();
        LobbyClient.getInstance().addListener("getVerifyAccountMessage", this.onRecvSMSContent, this);
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    onRecvSMSContent : function (messageName, data) {
        this.smsGateway = data["data"]["numberTo"];
        this.smsContent = [data["data"]["vettel"], data["data"]["vnp"], data["data"]["vms"]];

        if(this.okButton){
            this.okButton.visible = true;
        }
        for(var i=0; i<this.smsLabel.length; i++){
            var text = "Soạn tin nhắn\n\n"+this.smsContent[i] +"\n\nGửi đến "+this.smsGateway;
            this.smsLabel[i].setString(text);
        }
    }
});

var UserinfoVerifyLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        //LobbyClient.getInstance().addListener("verifyAccount", this.onRecvVerifyAccount, this);
        LobbyClient.getInstance().addListener("verifyCode", this.onRecvVerifyCode, this);

        this.phoneLayer = new VerifyPhoneLayer();
        this.addChild(this.phoneLayer);

        this.sendSMSLayer = new VerifySendSMSLayer();
        this.addChild(this.sendSMSLayer);

        this.refreshView();
    },
    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },
    onRecvVerifyAccount : function (messageName, data) {
        // LoadingDialog.getInstance().hide();
        // if(data.status == 0){
        //     this.toSendCodeLayer();
        //     this.sendCodeLayer.phoneLabel.visible = true;
        //     this.sendCodeLayer.phoneLabel.setString(this.sendPhoneLayer.phoneText.getText());
        //     this.sendCodeLayer.title.setString("Mã xác nhận đã gửi đến số điện thoại");
        // }
        // else{
        //     MessageNode.getInstance().show("Gửi yêu cầu lỗi [" + data.status + "]");
        // }
    },
    onRecvVerifyCode : function (messageName, data) {
        if(data.status == 0){
           this.refreshView();
        }
        else{
            MessageNode.getInstance().show("Không thể xác nhận được tài khoản [" + data.status + "]");
        }
        LoadingDialog.getInstance().hide();
    },
    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.refreshView();
        }
    },
    refreshView :function () {
        if(PlayerMe.phoneNumber === ""){
            this.phoneLayer.setVisible(false);
            this.sendSMSLayer.setVisible(true);
        }
        else{
            this.phoneLayer.setVisible(true);
            this.sendSMSLayer.setVisible(false);
        }
    }
});

var UserinfoDialog = IDialog.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("verifyCode", this.onRecvVerifyCode, this);
        LobbyClient.getInstance().addListener("verifyCodeBySms", this.onRecvVerifyCode, this);

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

        var logoutBt = new ccui.Button("userinfo-logout-1.png", "userinfo-logout-2.png", "", ccui.Widget.PLIST_TEXTURE);
        logoutBt.setPosition(230 , 170);
        this.dialogNode.addChild(logoutBt);
        logoutBt.addClickEventListener(function () {
            SceneNavigator.toHome();
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
            allLayer[i].setVisible(false);
        }
        this.allLayer = allLayer;

        var img1 = ["#userinfo-tab1.png", "#userinfo-tab3.png"];
        var img2 = ["#userinfo-tab2.png", "#userinfo-tab4.png"];
        var x = 340.0;
        var y = 419.0;
        var dy = 86.0;

        var selectSprite = new cc.Sprite("#userinfo-tab-selected.png");
        this.dialogNode.addChild(selectSprite,1);

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
                selectSprite.setPosition(this.getPosition());
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
        if(PlayerMe.phoneNumber === ""){
            this.subicon1.visible = true;
            this.subicon2.visible = true;
        }
        else{
            this.subicon1.visible = false;
            this.subicon2.visible = false;
        }

        var level = cc.Global.GetLevelMe();
        this.levelLabel.setString("Level " + level.level);
        this.levelBar.setPercentage(level.expPer);

        var vip = cc.Global.GetVipMe();
        this.vipLabel.setString("VIP " + vip.level);
        this.vipBar.setPercentage(vip.expPer);
    },
    onRecvVerifyCode : function (messageName, data) {
        if(data.status == 0){
            if(PlayerMe.phoneNumber === ""){
                this.subicon1.visible = true;
                this.subicon2.visible = true;
            }
            else{
                this.subicon1.visible = false;
                this.subicon2.visible = false;
            }
        }
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(this.selectTab);
    },
    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});