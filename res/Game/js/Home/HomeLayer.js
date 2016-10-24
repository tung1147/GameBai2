/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var LoginDialog = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("#home-login-dialog.png");
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(bg);

        var title = new cc.Sprite("#login-title.png");
        title.setPosition(cc.winSize.width/2, bg.y + 374);
        this.addChild(title);

        var facebookBt = new ccui.Button("home-fbBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        facebookBt.setPosition(cc.p(cc.winSize.width/2, bg.y - 264));
        this.addChild(facebookBt);
        facebookBt.addClickEventListener(function () {
            FacebookPlugin.getInstance().showLogin();
        });

        var loginBt = new ccui.Button("home-loginBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        loginBt.setPosition(cc.p(cc.winSize.width/2 - 128, bg.y - 430));
        this.addChild(loginBt);

        var signupBt = new ccui.Button("home-signupBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        signupBt.setPosition(cc.p(cc.winSize.width/2 + 128, loginBt.y));
        this.addChild(signupBt);
        this.signupBt = signupBt;

        var usernameBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(20, 20, 4, 4));
        usernameBg.setPreferredSize(cc.size(420, 72));
        usernameBg.setPosition(cc.winSize.width/2, bg.y + 160);
        this.addChild(usernameBg);

        var passwordBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(20, 20, 4, 4));
        passwordBg.setPreferredSize(cc.size(420, 72));
        passwordBg.setPosition(cc.winSize.width/2, bg.y + 62);
        this.addChild(passwordBg);

        this.checkBox = new ccui.CheckBox();
        this.checkBox.loadTextureBackGround("home-checkBox.png", ccui.Widget.PLIST_TEXTURE);
        this.checkBox.loadTextureFrontCross("home-checkCross.png", ccui.Widget.PLIST_TEXTURE);
        this.checkBox.setPosition(240, bg.y - 32);
        this.addChild( this.checkBox);
        this.checkBox.setSelected(cc.Global.GetSetting("savePassword", true));
        this.checkBox.addEventListener(function (target,event) {
            cc.Global.SetSetting("savePassword", event == ccui.CheckBox.EVENT_SELECTED);
        });

        var saveLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "LƯU MẬT KHẨU");
        saveLabel.setPosition(cc.winSize.width/2 + 17, this.checkBox.y - 2);
        this.addChild(saveLabel, 1);

        var padding = new cc.Sprite("#home-login-padding.png");
        padding.setPosition(cc.winSize.width/2, bg.y - 93);
        this.addChild(padding);

        var lostPasswordLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "QUÊN MẬT KHẨU ?");
        lostPasswordLabel.setPosition(cc.winSize.width/2, bg.y - 154);
        this.addChild(lostPasswordLabel, 1);

        this.userText = new newui.TextField(cc.size(400, 70), cc.res.font.Roboto_Condensed_25);
        this.userText.setPlaceHolder("Tài khoản");
        this.userText.setTextColor(cc.color(255,255,255));
        this.userText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.userText.setMaxLength(32);
        this.userText.setPosition(usernameBg.getPosition());
        this.addChild(this.userText,1);

        this.passwordText = new newui.TextField(cc.size(400, 70), cc.res.font.Roboto_Condensed_25);
        this.passwordText.setPasswordEnable(true);
        this.passwordText.setPlaceHolder("Mật khẩu");
        this.passwordText.setTextColor(cc.color(255,255,255));
        this.passwordText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.passwordText.setMaxLength(30);
        this.passwordText.setPosition(passwordBg.getPosition());
        this.addChild(this.passwordText,1);

        this.userText.setText(cc.Global.GetSetting("username", ""));
        this.passwordText.setText(cc.Global.GetSetting("password", ""));

        var thiz = this;
        loginBt.addClickEventListener(function () {
            var username = thiz.userText.getText();
            var password = thiz.passwordText.getText();
            if(!username && username.length == 0){
                MessageNode.getInstance().show("Bạn phải nhập tên tài khoản");
                return;
            }
            if(!password && password.length == 0){
                MessageNode.getInstance().show("Bạn phải nhập mật khẩu");
                return;
            }
            LoadingDialog.getInstance().show("Đang đăng nhập");
            LobbyClient.getInstance().loginNormal(username, password, thiz.checkBox.isSelected());
        });
    }
});

var SignupDialog = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("#home-login-dialog.png");
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(bg);

        var title = new cc.Sprite("#signup-title.png");
        title.setPosition(cc.winSize.width/2, bg.y + 374);
        this.addChild(title);

        var signupBt = new ccui.Button("home-signupBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        signupBt.setPosition(cc.p(cc.winSize.width/2, bg.y - 50));
        this.addChild(signupBt);

        var backBt = new ccui.Button("home-closeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(cc.p(614, bg.y + 304));
        this.addChild(backBt);
        this.backBt = backBt;

        var usernameBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(20, 20, 4, 4));
        usernameBg.setPreferredSize(cc.size(420, 72));
        usernameBg.setPosition(cc.winSize.width/2, bg.y + 160);
        this.addChild(usernameBg);

        var passwordBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(20, 20, 4, 4));
        passwordBg.setPreferredSize(cc.size(420, 72));
        passwordBg.setPosition(cc.winSize.width/2, bg.y + 62);
        this.addChild(passwordBg);

        this.userText = new newui.TextField(cc.size(400, 70), cc.res.font.Roboto_Condensed_25);
        this.userText.setPlaceHolder("Tài khoản");
        this.userText.setTextColor(cc.color(255,255,255));
        this.userText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.userText.setMaxLength(32);
        this.userText.setPosition(usernameBg.getPosition());
        this.addChild(this.userText,1);

        this.passwordText = new newui.TextField(cc.size(400, 70), cc.res.font.Roboto_Condensed_25);
        this.passwordText.setPlaceHolder("Mật khẩu");
        this.passwordText.setTextColor(cc.color(255,255,255));
        this.passwordText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.passwordText.setMaxLength(30);
        this.passwordText.setPosition(passwordBg.getPosition());
        this.addChild(this.passwordText,1);

        //touch
        var thiz = this;
        signupBt.addClickEventListener(function () {
            var username = thiz.userText.getText();
            var password = thiz.passwordText.getText();
            if(!username && username.length == 0){
                MessageNode.getInstance().show("Bạn phải nhập tên tài khoản");
                return;
            }
            if(!password && password.length == 0){
                MessageNode.getInstance().show("Bạn phải nhập mật khẩu");
                return;
            }
            LoadingDialog.getInstance().show("Đang đăng ký");
            LobbyClient.getInstance().signup(username, password);
        });
    }
});

var HomeLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var blackLayer = new cc.LayerColor(cc.color(0,0,0,0.8 * 255), cc.winSize.width, cc.winSize.height);
        this.addChild(blackLayer);

        //touch
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(thiz.visible){
                    return true;
                }
                return false;
            }
        }, this);

        this.showLogin();
    },
    showLogin : function () {
        if(this.dialog){
            this.dialog.removeFromParent(true);
        }
        this.dialog = new LoginDialog();
        this.addChild(this.dialog);

        var thiz = this;
        this.dialog.signupBt.addClickEventListener(function () {
            thiz.showSignup();
        });
    },
    showSignup : function () {
        if(this.dialog){
            this.dialog.removeFromParent(true);
        }
        this.dialog = new SignupDialog();
        this.addChild(this.dialog);

        var thiz = this;
        this.dialog.backBt.addClickEventListener(function () {
            thiz.showLogin();
        });
    }
});