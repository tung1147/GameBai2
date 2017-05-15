/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var UserInfoChangeLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;
        LobbyClient.getInstance().addListener("getProfile", this.onGetProfile, this);
        LobbyClient.getInstance().addListener("updateProfile", this.onUpdateProfile, this);

        var bg1 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(12,12,4,4));
        bg1.setPreferredSize(cc.size(280, 44));
        bg1.setPosition(640, 337);
        this.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(12,12,4,4));
        bg2.setPreferredSize(cc.size(280, 44));
        bg2.setPosition(bg1.x, bg1.y - 70);
        this.addChild(bg2);

        var bg3 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(12,12,4,4));
        bg3.setPreferredSize(cc.size(280, 44));
        bg3.setPosition(bg1.x, bg2.y - 70);
        this.addChild(bg3);

        var bg4 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(12,12,4,4));
        bg4.setPreferredSize(cc.size(280, 44));
        bg4.setPosition(bg1.x, bg3.y - 70);
        this.addChild(bg4);

        var okButton = new ccui.Button("dialog-button-1.png","","", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setZoomScale(0.03);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(280, 44);
        okButton.setPosition(bg1.x, 50);
        okButton.addClickEventListener(function () {
           thiz.requestSetUserinfo();
        });
        this.addChild(okButton);

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "LƯU");
        okTitle.setColor(cc.color("#835238"));
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);

        var textSize = cc.size(bg1.getContentSize().width - 4, bg1.getContentSize().height - 4);

        var addressText = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_18);
        addressText.setPlaceHolder("Địa chỉ");
        addressText.setPlaceHolderColor(cc.color("#45b8e3"));
        addressText.setPosition(bg1.getPosition());
        this.addChild(addressText);

        var idText = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_18);
        idText.setPlaceHolder("Số CMND");
        idText.setPlaceHolderColor(cc.color("#45b8e3"));
        idText.setPosition(bg2.getPosition());
        this.addChild(idText);

        var emailText = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_18);
        emailText.setPlaceHolder("Email");
        emailText.setPlaceHolderColor(cc.color("#45b8e3"));
        emailText.setPosition(bg3.getPosition());
        this.addChild(emailText);

        var merchantText = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_18);
        merchantText.setPlaceHolder("Mã đại lý");
        merchantText.setPlaceHolderColor(cc.color("#45b8e3"));
        merchantText.setPosition(bg4.getPosition());
        this.addChild(merchantText);

        this.addressText = addressText;
        this.idText = idText;
        this.emailText = emailText;
        this.merchantText = merchantText;
    },

    onGetProfile : function (cmd, data) {
        var info = data["data"]["info"];
        this.addressText.setText(info["add"]);
        this.idText.setText(info["cmnd"]);
        this.emailText.setText(info["email"]);
        this.merchantText.setText(info["merchantId"]);

        // if(this.merchantText.getText() != ""){
        //     this.merchantText.setEnable(false);
        // }
        // else{
        //     this.merchantText.setEnable(true);
        // }
    },

    onUpdateProfile : function (cmd,data) {
        var status = data["status"];
        if(status == 0){
            // this.addressText.setEnable(false);
            // this.idText.setEnable(false);
            // this.emailText.setEnable(false);
            // this.merchantText.setEnable(false);

            MessageNode.getInstance().show("Cập nhật thông tin thành công");
        }
    },

    requestSetUserinfo : function () {
        var address = this.addressText.getText();
        var id = this.idText.getText();
        var email = this.emailText.getText();
        var merchantId = this.merchantText.getText();

        var request = {
            command : "updateProfile",
            id : id,
            email  : email,
            add : address,
            merchantId : merchantId
        };
       LobbyClient.getInstance().send(request);
    },

    onEnter : function () {
        this._super();
        LobbyClient.getInstance().send({command : "getProfile"});
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var UserinfoPasswordLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("changePassword", this.onRecvChangePassword, this);

        var bg1 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(12,12,4,4));
        bg1.setPreferredSize(cc.size(280, 44));
        bg1.setPosition(640, 337);
        this.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(12,12,4,4));
        bg2.setPreferredSize(cc.size(280, 44));
        bg2.setPosition(bg1.x, bg1.y - 70);
        this.addChild(bg2);

        var bg3 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(12,12,4,4));
        bg3.setPreferredSize(cc.size(280, 44));
        bg3.setPosition(bg1.x, bg2.y - 70);
        this.addChild(bg3);

        var okButton = new ccui.Button("dialog-button-1.png","","", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setZoomScale(0.03);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(280, 44);
        okButton.setPosition(bg1.x, 110);
        this.addChild(okButton);

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "ĐỔI MẬT KHẨU");
        okTitle.setColor(cc.color("#835238"));
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);

        var textSize = cc.size(bg1.getContentSize().width - 4, bg1.getContentSize().height - 4);

        var passwordText = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_18);
        passwordText.setPlaceHolder("Mật khẩu cũ");
        passwordText.setPlaceHolderColor(cc.color("#45b8e3"));
        passwordText.setPasswordEnable(true);
        passwordText.setPosition(bg1.getPosition());
        this.addChild(passwordText);
        this.passwordText = passwordText;

        var passwordText1 = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_18);
        passwordText1.setPlaceHolder("Mật khẩu mới");
        passwordText1.setPlaceHolderColor(cc.color("#45b8e3"));
        passwordText1.setPasswordEnable(true);
        passwordText1.setPosition(bg2.getPosition());
        this.addChild(passwordText1);
        this.passwordText1 = passwordText1;

        var passwordText2 = new newui.TextField(textSize, cc.res.font.Roboto_Condensed_18);
        passwordText2.setPlaceHolder("Nhập lại mật khẩu");
        passwordText2.setPlaceHolderColor(cc.color("#45b8e3"));
        passwordText2.setPasswordEnable(true);
        passwordText2.setPosition(bg3.getPosition());
        this.addChild(passwordText2);
        this.passwordText2 = passwordText2;

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
            var newPassword = this.passwordText1.getText();
            LobbyClient.getInstance()._password = newPassword;
            if(cc.Global.getSavePassword() != ""){
                cc.Global.setSavePassword(newPassword);
            }

            this.passwordText.setText("");
            this.passwordText1.setText("");
            this.passwordText2.setText("");
        }
        else{
            MessageNode.getInstance().show("Đổi mật khẩu thất bại");
        }
    },
});

var VerifyPhoneLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var iconSuc = new cc.Sprite("#userinfo-vertify-successful.png");
        iconSuc.setPosition(640, 250);
        this.addChild(iconSuc);

        var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Số điện thoại xác nhận tài khoản");
        label1.setPosition(640, 190);
        this.addChild(label1);

        var phoneLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "0123456789");
        phoneLabel.setColor(cc.color("#46d1ff"));
        phoneLabel.setPosition(label1.x, 120);
        this.addChild(phoneLabel);
        this.phoneLabel = phoneLabel;

        // var okButton = new ccui.Button("dialog-button-1.png","","", ccui.Widget.PLIST_TEXTURE);
        // okButton.setScale9Enabled(true);
        // okButton.setZoomScale(0.03);
        // okButton.setCapInsets(cc.rect(10,10,4,4));
        // okButton.setContentSize(384, 60);
        // okButton.setPosition(label1.x, 280);
        // this.addChild(okButton);
        // this.okButton = okButton;
        //
        // var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Đổi số điện thoại");
        // okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        // okButton.getRendererNormal().addChild(okTitle);
    },
    refreshView : function () {
        var phone = PlayerMe.phoneNumber.substring(0, PlayerMe.phoneNumber.length - 3) + "***";
        this.phoneLabel.setString(phone);
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

        var left = 500;
        var right = 850;
        var dx = (right - left)/(s_Verify_SMS_Provider.length);
        var x = left + dx/2;
        var y = 290;

        this.smsLabel = [];
        var thiz = this;
        for(var i=0; i<s_Verify_SMS_Provider.length; i++){
            (function () {
                var idx = i;

                var label = new cc.LabelBMFont(s_Verify_SMS_Provider[i], cc.res.font.Roboto_Condensed_16);
                label.setColor(cc.color("#72acd6"));
                label.setPosition(x - 10, y);
                thiz.addChild(label,1);

                var bg1 = new cc.Sprite("#dialog-checkBox-2.png");
                bg1.setPosition(label.x - label.getContentSize().width/2 - 20, y);
                thiz.addChild(bg1);

                var bg2 = new cc.Sprite("#dialog-checkBoxCross-2.png");
                bg2.setPosition(bg1.getPosition());
                thiz.addChild(bg2);

                var smsContent = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "sms", cc.TEXT_ALIGNMENT_CENTER, 1000);
                smsContent.setPosition((right + left)/2 - 30, 190);
                thiz.addChild(smsContent, 1);
                thiz.smsLabel.push(smsContent);

                var toggleItem = new ToggleNodeItem(cc.size(dx, bg1.getContentSize().height));
                toggleItem.setPosition((bg1.x + label.x)/2, bg1.y);
                toggleItem.onSelect = function () {
                    bg2.setVisible(true);
                    smsContent.setVisible(true);
                    thiz.idx = idx;
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
            var okButton = s_Dialog_Create_Button1(cc.size(280, 44), "Xác nhận");
            okButton.setPosition((right + left)/2 - 30, 100);
            this.addChild(okButton);
            this.okButton = okButton;

            okButton.addClickEventListener(function () {
                SystemPlugin.getInstance().showSMS(thiz.smsGateway, thiz.smsContent[thiz.idx]);
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

var UserinfoDialog = Dialog.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("verifyCode", this.onRecvVerifyCode, this);
        LobbyClient.getInstance().addListener("verifyCodeBySms", this.onRecvVerifyCode, this);

        var thiz = this;
        this.initWithSize(cc.size(860, 480));
        this.title.setString("THÔNG TIN CÁ NHÂN");
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        var avatar = UserAvatar.createMe();
        avatar.setPosition(95, 350);
        this.addChild(avatar,2);

        var avatarBt = new ccui.Widget();
        avatarBt.setContentSize(avatar.getContentSize());
        avatarBt.setPosition(avatar.getPosition());
        avatarBt.setTouchEnabled(true);
        avatarBt.addClickEventListener(function () {
            var dialog = new AvatarDialog();
            dialog.show();
        });
        this.addChild(avatarBt);

        var displayName = PlayerMe.username;
        if(displayName.length > 15){
            displayName = displayName.substring(0, 15);
        }
        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, displayName);
        userLabel.setColor(cc.color("#bff2ff"));
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setPosition(142, avatar.y + 12);
        this.addChild(userLabel,1);
        this.userLabel = userLabel;

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "100.000V");
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(userLabel.x, avatar.y - 12);
        this.addChild(goldLabel,1);
        this.goldLabel = goldLabel;

        var levelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "99");
        levelLabel.setColor(cc.color("#8de8ff"));
        levelLabel.setPosition(325, avatar.y);
        this.addChild(levelLabel,1);
        this.levelLabel = levelLabel;

        var levelLabelBg = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_14, "Level");
        levelLabelBg.setColor(cc.color("#8de8ff"));
        levelLabelBg.setPosition(levelLabel.x, levelLabel.y - 34);
        this.addChild(levelLabelBg,1);

        var vipLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "99");
        vipLabel.setColor(cc.color("#ffde00"));
        vipLabel.setPosition(400, avatar.y);
        this.addChild(vipLabel,1);
        this.vipLabel = vipLabel;

        var vipLabelBg = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_14, "V.I.P");
        vipLabelBg.setColor(cc.color("#8de8ff"));
        vipLabelBg.setPosition(vipLabel.x, vipLabel.y - 34);
        this.addChild(vipLabelBg,1);

        var levelBar = new cc.ProgressTimer(new cc.Sprite("#userinfo-level-bar.png"));
        levelBar.setType(cc.ProgressTimer.TYPE_RADIAL);
        levelBar.setReverseDirection(true);
        levelBar._alwaysRefreshVertext = true;
        levelBar.setPosition(levelLabel.getPosition());
        levelBar.setPercentage(50.0);
        this.addChild(levelBar);
        this.levelBar = levelBar;

        var levelBarBg = new cc.Sprite("#userinfo-level-bg.png");
        levelBarBg.setPosition(levelBar.getContentSize().width/2, levelBar.getContentSize().height/2);
        levelBar.addChild(levelBarBg,-1);

        var vipBar = new cc.ProgressTimer(new cc.Sprite("#userinfo-vip-bar.png"));
        vipBar.setType(cc.ProgressTimer.TYPE_RADIAL);
        vipBar.setReverseDirection(true);
        vipBar._alwaysRefreshVertext = true;
        vipBar.setPosition(vipLabel.getPosition());
        vipBar.setPercentage(50.0);
        this.addChild(vipBar);
        this.vipBar = vipBar;

        var vipBarBg = new cc.Sprite("#userinfo-level-bg.png");
        vipBarBg.setPosition(vipBar.getContentSize().width/2, vipBar.getContentSize().height/2);
        vipBar.addChild(vipBarBg,-1);

        // var closeBt = new ccui.Button("dialog-button-close.png", "","", ccui.Widget.PLIST_TEXTURE);
        // closeBt.setPosition(983 , 605);
        // this.addChild(closeBt);
        // closeBt.addClickEventListener(function () {
        //     thiz.hide();
        // });

        var logoutBt = new ccui.Button("userinfo-logout.png", "", "", ccui.Widget.PLIST_TEXTURE);
        logoutBt.setPosition(140 , 35);
        this.addChild(logoutBt);
        logoutBt.addClickEventListener(function () {
            SceneNavigator.toHome();
        });

        // var touchSize = cc.size(this.getContentSize().width - 200.0, this.getContentSize().height - 200.0);
        // this.mTouch = cc.rect(cc.winSize.width/2 - touchSize.width/2, cc.winSize.height/2- touchSize.height/2, touchSize.width, touchSize.height);

        this.initAllLayer();
        this.refreshView();
    },

    initAllLayer : function () {
        var thiz = this;
        this.selectTab = 0;

        // var infoBg = new ccui.Scale9Sprite("userinfo-bg.png", cc.rect(12,12,4,4));
        // infoBg.setPreferredSize(cc.size(420,400));
        // infoBg.setPosition(769,338);
        // this.addChild(infoBg);

        var allLayer = [new UserInfoChangeLayer(), new UserinfoPasswordLayer(), new UserinfoVerifyLayer()];
        for(var i=0;i<allLayer.length;i++){
            this.addChild(allLayer[i],1);
            allLayer[i].setVisible(false);
        }
        this.allLayer = allLayer;

        var img1 = ["#userinfo-tab1.png", "#userinfo-tab2.png","#userinfo-tab3.png"];
        var img2 = ["#userinfo-tab4.png", "#userinfo-tab5.png","#userinfo-tab6.png"];

        var x = 280.0;
        var y = 260.0;
        var dy = 70.0;

        var mToggle = new ToggleNodeGroup();
        this.mToggle = mToggle;
        this.addChild(mToggle);
        for(var i=0;i<img1.length;i++){
            (function () {
                var icon1 = new cc.Sprite(img1[i]);
                icon1.setPosition(x, y - dy * i);
                thiz.addChild(icon1);

                var icon2 = new cc.Sprite(img2[i]);
                icon2.setPosition(icon1.getPosition());
                thiz.addChild(icon2);

                var mNode = allLayer[i];

                var toggleItem = new ToggleNodeItem(icon1.getContentSize());
                toggleItem.setPosition(icon1.getPosition());
                mToggle.addItem(toggleItem);
                toggleItem.onSelect = function () {
                    icon1.visible = false;
                    icon2.visible = true;
                    mNode.setVisible(true);
                };

                toggleItem.onUnSelect = function () {
                    icon1.visible = true;
                    icon2.visible = false;
                    mNode.setVisible(false);
                };
            })();
        }
    },

    refreshView : function () {
        this.goldLabel.setString(cc.Global.NumberFormat1(PlayerMe.gold) +" V");
        // if(PlayerMe.phoneNumber === ""){
        //     this.subicon1.visible = true;
        //     this.subicon2.visible = true;
        // }
        // else{
        //     this.subicon1.visible = false;
        //     this.subicon2.visible = false;
        // }

        var level = cc.Global.GetLevelMe();
        this.levelLabel.setString(level.level.toString());
        this.levelBar.setPercentage(level.expPer);

        var vip = cc.Global.GetVipMe();
        this.vipLabel.setString(vip.level.toString());
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