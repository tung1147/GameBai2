/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var LoginDialog = cc.Node.extend({
    ctor : function () {
        this._super();
        var blackLayer = new cc.LayerColor(cc.color(0,0,0,0.8 * 255), cc.winSize.width, cc.winSize.height);
        this.addChild(blackLayer);

        this.layerBg = new ccui.Scale9Sprite("home-layer-bg.png", cc.rect(124,186,4,4));
        this.layerBg.setPreferredSize(cc.size(850.0, 700.0));
        this.layerBg.setPosition(cc.winSize.width / 2, cc.winSize.height/2);
        this.addChild(this.layerBg);

        var title = new cc.LabelBMFont("ĐĂNG NHẬP", cc.res.font.Roboto_CondensedBold_30);
        title.setColor(cc.color("#c4e1ff"));
        title.setPosition(this.layerBg.getContentSize().width/2, 560.0);
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

        this.userText.nextTextField = this.passwordText;
        this.passwordText.nextTextField = this.userText;

        this.userText.setText(cc.Global.GetSetting("username", ""));
        this.passwordText.setText(cc.Global.GetSetting("password", ""));

        var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Lưu mật khẩu");
        label1.setAnchorPoint(1.0, 0.5);
        label1.setColor(cc.color("#4a8ed3"));
        label1.setPosition(this.layerBg.getContentSize().width/2 - 15, 270);
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

        // var padding = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "|");
        // padding.setColor(cc.color.WHITE);
        // padding.setPosition(this.layerBg.getContentSize().width/2, label1.y);
        // this.layerBg.addChild(padding,1);

        var resetPassword = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Quên mật khẩu");
        resetPassword.setAnchorPoint(0.0, 0.5);
        resetPassword.setColor(cc.color("#4a8ed3"));
        resetPassword.setPosition(this.layerBg.getContentSize().width/2 + 15, label1.y);
        this.layerBg.addChild(resetPassword,1);

        var loginBt = new ccui.Button("login-okBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        loginBt.setPosition(this.layerBg.getContentSize().width/2, 200.0);
        loginBt.setZoomScale(0.02);
        this.layerBg.addChild(loginBt);

        var regLabel = new cc.LabelBMFont("Đăng ký", cc.res.font.Roboto_Condensed_25);
        regLabel.setColor(cc.color("#4c6080"));
        regLabel.setPosition(this.layerBg.getContentSize().width/2, 130.0);
        this.layerBg.addChild(regLabel, 1);

        var regButton = new ccui.Widget();
        regButton.setContentSize(regLabel.getContentSize());
        regButton.setPosition(regLabel.getPosition());
        regButton.setTouchEnabled(true);
        this.regButton = regButton;
        this.layerBg.addChild(regButton);

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

        var bg = ccui.Scale9Sprite.createWithSpriteFrameName("home-layer-bg.png", cc.rect(124,186,4,4));
        bg.setPreferredSize(cc.size(900.0, 800.0));
        bg.setPosition(cc.winSize.width / 2, cc.winSize.height/2);
        this.addChild(bg);

        var margin = 100.0;
        var mTouch = cc.rect(margin, margin, bg.getContentSize().width - margin * 2, bg.getContentSize().height - margin * 2);
        var title = new cc.LabelBMFont("ĐĂNG KÝ", cc.res.font.Roboto_CondensedBold_30);
        title.setPosition(bg.getContentSize().width/2, 662.0);
        title.setColor(cc.color("#c4e1ff"));
        bg.addChild(title);
        this.layerBg = bg;

        /* login text field */
        var userNameBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(12,12,4,4));
        userNameBg.setPreferredSize(cc.size(500, 70));
        userNameBg.setPosition(cc.p(this.layerBg.getContentSize().width/2, 550));
        this.layerBg.addChild(userNameBg);

        var passwordBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(12,12,4,4));
        passwordBg.setPreferredSize(cc.size(500, 70));
        passwordBg.setPosition(cc.p(this.layerBg.getContentSize().width/2, 460));
        this.layerBg.addChild(passwordBg);

        var phoneBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(12,12,4,4));
        phoneBg.setPreferredSize(cc.size(500, 70));
        phoneBg.setPosition(cc.p(this.layerBg.getContentSize().width/2, 370));
        this.layerBg.addChild(phoneBg);

        this.userText = new newui.TextField(cc.size(470, 70), cc.res.font.Roboto_Condensed_25);
        this.userText.setPlaceHolder("Tài khoản");
        this.userText.setTextColor(cc.color(255,255,255));
        this.userText.setPlaceHolderColor(cc.color("#c4e1ff"));
        this.userText.setMaxLength(32);
        this.userText.setPosition(userNameBg.getPosition());
        bg.addChild(this.userText,1);

        this.passwordText = new newui.TextField(cc.size(470, 70), cc.res.font.Roboto_Condensed_25);
        this.passwordText.setPasswordEnable(true);
        this.passwordText.setPlaceHolder("Mật khẩu");
        this.passwordText.setTextColor(cc.color(255,255,255));
        this.passwordText.setPlaceHolderColor(cc.color("#c4e1ff"));
        this.passwordText.setMaxLength(30);
        this.passwordText.setPosition(passwordBg.getPosition());
        bg.addChild(this.passwordText,1);

        this.phoneText = new newui.TextField(cc.size(470, 70), cc.res.font.Roboto_Condensed_25);
        this.phoneText.setPasswordEnable(true);
        this.phoneText.setPlaceHolder("Số điện thoại");
        this.phoneText.setTextColor(cc.color(255,255,255));
        this.phoneText.setPlaceHolderColor(cc.color("#c4e1ff"));
        this.phoneText.setMaxLength(30);
        this.phoneText.setPosition(phoneBg.getPosition());
        bg.addChild(this.phoneText,1);

        this.userText.nextTextField = this.passwordText;
        this.passwordText.nextTextField = this.phoneText;
        this.phoneText.nextTextField = this.userText;

        var signupBt = new ccui.Button("signup-okBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        signupBt.setPosition(this.layerBg.getContentSize().width/2, 190.0);
        this.layerBg.addChild(signupBt);

        var toggleIcon1 = new cc.Sprite("#home_toggle.png");
        toggleIcon1.setPosition(this.layerBg.getContentSize().width/2 - 160, 280);
        this.layerBg.addChild(toggleIcon1);
        var toggleLabel1 = new cc.LabelBMFont("Nam", cc.res.font.Roboto_Condensed_25);
        toggleLabel1.setAnchorPoint(cc.p(0.0, 0.5));
        toggleLabel1.setColor(cc.color("#72acd6"));
        toggleLabel1.setPosition(toggleIcon1.x + 30, toggleIcon1.y);
        this.layerBg.addChild(toggleLabel1,1);

        var toggleIcon2 = new cc.Sprite("#home_toggle.png");
        toggleIcon2.setPosition(this.layerBg.getContentSize().width/2 + 20, toggleIcon1.y);
        this.layerBg.addChild(toggleIcon2);
        var toggleLabel2 = new cc.LabelBMFont("Nữ", cc.res.font.Roboto_Condensed_25);
        toggleLabel2.setAnchorPoint(cc.p(0.0, 0.5));
        toggleLabel2.setColor(cc.color("#72acd6"));
        toggleLabel2.setPosition(toggleIcon2.x + 30, toggleIcon2.y);
        this.layerBg.addChild(toggleLabel2,1);

        var toggleSelected = new cc.Sprite("#home_toggle_selected.png");
        toggleSelected.setPosition(toggleIcon1.getPosition());
        this.layerBg.addChild(toggleSelected);

        var toggleIcon = [toggleIcon1, toggleIcon2];
        var mToggle = new ToggleNodeGroup();
        this.mToggle = mToggle;
        this.layerBg.addChild(mToggle);
        for(var i=0;i<toggleIcon.length;i++){
            (function () {
                var toggleItem = new ToggleNodeItem(toggleIcon[i].getContentSize());
                toggleItem.setPosition(toggleIcon[i].getPosition());
                toggleItem.onSelect = function () {
                    toggleSelected.setPosition(toggleItem.getPosition());
                };
                mToggle.addItem(toggleItem);
            })();
        }

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

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
    }
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