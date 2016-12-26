/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var LoginDialog = cc.Node.extend({
    ctor : function () {
        this._super();
        var blackLayer = new cc.LayerColor(cc.color(0,0,0,0.8 * 255), cc.winSize.width, cc.winSize.height);
        this.addChild(blackLayer);

        this.layerBg = ccui.Scale9Sprite.createWithSpriteFrameName("home-layer-bg.png", cc.rect(114, 114, 4, 4));
        this.layerBg.setPreferredSize(cc.size(850.0, 700.0));
        this.layerBg.setPosition(cc.winSize.width / 2, cc.winSize.height/2);
        this.addChild(this.layerBg);

        var title = new cc.Sprite("#home-signin-text.png");
        title.setPosition(this.layerBg.getContentSize().width/2, 550.0);
        this.layerBg.addChild(title);

        /* login text field */
        var userNameBg = ccui.Scale9Sprite.createWithSpriteFrameName("home-text-bg.png", cc.rect(12,12,4,4));
        userNameBg.setPreferredSize(cc.size(500, 70));
        userNameBg.setPosition(cc.p(this.layerBg.getContentSize().width/2, 450));
        this.layerBg.addChild(userNameBg);

        var passwordBg = ccui.Scale9Sprite.createWithSpriteFrameName("home-text-bg.png", cc.rect(12,12,4,4));
        passwordBg.setPreferredSize(cc.size(500, 70));
        passwordBg.setPosition(cc.p(this.layerBg.getContentSize().width/2, 350));
        this.layerBg.addChild(passwordBg);

        this.userText = new newui.TextField(cc.size(470, 70), cc.res.font.Roboto_Condensed_25);
        this.userText.setPlaceHolder("Tài khoản");
        this.userText.setTextColor(cc.color(255,255,255));
        this.userText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.userText.setMaxLength(32);
        this.userText.setPosition(userNameBg.getPosition());
        this.layerBg.addChild(this.userText,1);

        this.passwordText = new newui.TextField(cc.size(470, 70), cc.res.font.Roboto_Condensed_25);
        this.passwordText.setPasswordEnable(true);
        this.passwordText.setPlaceHolder("Mật khẩu");
        this.passwordText.setTextColor(cc.color(255,255,255));
        this.passwordText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.passwordText.setMaxLength(30);
        this.passwordText.setPosition(passwordBg.getPosition());
        this.layerBg.addChild(this.passwordText,1);

        this.userText.setText(cc.Global.GetSetting("username", ""));
        this.passwordText.setText(cc.Global.GetSetting("password", ""));

        var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Lưu mật khẩu");
        label1.setAnchorPoint(1.0, 0.5);
        label1.setColor(cc.color.WHITE);
        label1.setPosition(this.layerBg.getContentSize().width/2 - 10, 270);
        this.layerBg.addChild(label1,1);

        this.checkBox = new ccui.CheckBox();
        this.checkBox.loadTextureBackGround("home-checkBox.png", ccui.Widget.PLIST_TEXTURE);
        this.checkBox.loadTextureFrontCross("home-checkCross.png", ccui.Widget.PLIST_TEXTURE);
        this.checkBox.setPosition(label1.x - label1.getContentSize().width - 30 , label1.y);
        this.layerBg.addChild( this.checkBox);
        this.checkBox.setSelected(cc.Global.GetSetting("savePassword", true));
        this.checkBox.addEventListener(function (target,event) {
            cc.Global.SetSetting("savePassword", event == ccui.CheckBox.EVENT_SELECTED);
        });

        var padding = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "|");
        padding.setColor(cc.color.WHITE);
        padding.setPosition(this.layerBg.getContentSize().width/2, label1.y);
        this.layerBg.addChild(padding,1);

        var resetPassword = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Quên mật khẩu");
        resetPassword.setAnchorPoint(0.0, 0.5);
        resetPassword.setColor(cc.color.WHITE);
        resetPassword.setPosition(this.layerBg.getContentSize().width/2 + 10, label1.y);
        this.layerBg.addChild(resetPassword,1);

        var loginBt = new ccui.Button("login-okBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        loginBt.setPosition(this.layerBg.getContentSize().width/2, 180.0);
        this.layerBg.addChild(loginBt);

        // var playButton = new ccui.Button("login-playBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // playButton.setPosition(this.layerBg.getContentSize().width/2, 130.0);
        // this.layerBg.addChild(playButton);

        var margin = 100.0;
        var mTouch = cc.rect(margin, margin, this.layerBg.getContentSize().width - margin * 2, this.layerBg.getContentSize().height - margin * 2);
        //touch
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                return true;
            },
            onTouchEnded : function (touch, event) {
                var pTouch = touch.getLocation();
                var p = thiz.layerBg.convertToNodeSpace(pTouch);
                if(!cc.rectContainsPoint(mTouch, p)){
                    thiz.removeFromParent(true);
                }
            }
        }, this);

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

        var blackLayer = new cc.LayerColor(cc.color(0,0,0,0.8 * 255), cc.winSize.width, cc.winSize.height);
        this.addChild(blackLayer);

        var bg = ccui.Scale9Sprite.createWithSpriteFrameName("home-layer-bg.png", cc.rect(114, 114, 4, 4));
        bg.setPreferredSize(cc.size(900.0, 650.0));
        bg.setPosition(cc.winSize.width / 2, cc.winSize.height/2);
        this.addChild(bg);

        var margin = 100.0;
        var mTouch = cc.rect(margin, margin, bg.getContentSize().width - margin * 2, bg.getContentSize().height - margin * 2);
        var title = new cc.Sprite("#home-signup-text.png");
        title.setPosition(bg.getContentSize().width/2, 465.0);
        bg.addChild(title);
        this.layerBg = bg;

        /* login text field */
        var userNameBg = ccui.Scale9Sprite.createWithSpriteFrameName("home-text-bg.png", cc.rect(12,12,4,4));
        userNameBg.setPreferredSize(cc.size(500, 70));
        userNameBg.setPosition(cc.p(this.layerBg.getContentSize().width/2, 380));
        this.layerBg.addChild(userNameBg);

        var passwordBg = ccui.Scale9Sprite.createWithSpriteFrameName("home-text-bg.png", cc.rect(12,12,4,4));
        passwordBg.setPreferredSize(cc.size(500, 70));
        passwordBg.setPosition(cc.p(this.layerBg.getContentSize().width/2, 280));
        this.layerBg.addChild(passwordBg);

        this.userText = new newui.TextField(cc.size(470, 70), cc.res.font.Roboto_Condensed_25);
        this.userText.setPlaceHolder("Tài khoản");
        this.userText.setTextColor(cc.color(255,255,255));
        this.userText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.userText.setMaxLength(32);
        this.userText.setPosition(userNameBg.getPosition());
        bg.addChild(this.userText,1);

        this.passwordText = new newui.TextField(cc.size(470, 70), cc.res.font.Roboto_Condensed_25);
        this.passwordText.setPasswordEnable(true);
        this.passwordText.setPlaceHolder("Mật khẩu");
        this.passwordText.setTextColor(cc.color(255,255,255));
        this.passwordText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.passwordText.setMaxLength(30);
        this.passwordText.setPosition(passwordBg.getPosition());
        bg.addChild(this.passwordText,1);

        var signupBt = new ccui.Button("signup-okBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        signupBt.setPosition(this.layerBg.getContentSize().width/2, 180.0);
        this.layerBg.addChild(signupBt);

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
            },
            
            onTouchEnded : function (touch, event) {
                var pTouch = touch.getLocation();
                var p = bg.convertToNodeSpace(pTouch);
                if(!cc.rectContainsPoint(mTouch, p)){
                    thiz.removeFromParent();
                }
            }
        }, this);

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
    },
    
});

var HomeLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var homeBar = new cc.Node();
        homeBar.setScale(cc.winSize.screenScale);
        this.addChild(homeBar);

        this.barBg = ccui.Scale9Sprite.createWithSpriteFrameName("home-bar-bg.png", cc.rect(8,8,4,4));
        this.barBg.setPreferredSize(cc.size(1280.0, 100.0));
        this.barBg.setAnchorPoint(cc.PointZero());
        this.barBg.setPosition(cc.PointZero());
        homeBar.addChild(this.barBg);

        this.fbButton = new ccui.Button("home-bg-bt.png","","", ccui.Widget.PLIST_TEXTURE);
        this.fbButton.setPosition(cc.p(640.0, this.barBg.getContentSize().height/2));
        this.fbButton.setScale(cc.winSize.screenScale);
        homeBar.addChild(this.fbButton);

        this.loginBt = new ccui.Button("home-signin.png","home-signin-selected.png","", ccui.Widget.PLIST_TEXTURE);
        this.loginBt.setPosition(cc.p(840.0, this.fbButton.y));
        homeBar.addChild(this.loginBt);

        this.signupBt = new ccui.Button("home-signup.png","home-signup-selected.png","", ccui.Widget.PLIST_TEXTURE);
        this.signupBt.setPosition(cc.p(440.0, this.fbButton.y));
        homeBar.addChild(this.signupBt);
        
        // var thiz = this;
        // this.loginBt.addClickEventListener(function () {
        //     var loginDialog  = new LoginDialog();
        //     thiz.popupLayer.addChild(loginDialog);
        // });
        //
        // this.signupBt.addClickEventListener(function () {
        //     var signupDialog = new SignupDialog();
        //     thiz.popupLayer.addChild(signupDialog);
        // });
        // this.fbButton.addClickEventListener(function () {
        //     FacebookPlugin.getInstance().showLogin();
        // });
    }
});