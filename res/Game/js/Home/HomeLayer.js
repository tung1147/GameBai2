/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var _createDialogFunction = function (obj) {
    obj.show = function () {
        var runningScene = cc.director.getRunningScene();
        if(runningScene.popupLayer){
            var parentNode = runningScene.popupLayer;
        }
        else{
            var parentNode = runningScene;
        }
        parentNode.addChild(obj);
    };

    obj.hide = function () {
        obj.removeFromParent(true);
    }
};

var LoginDialog = cc.Node.extend({
    ctor : function () {
        this._super();
        _createDialogFunction(this);
        var thiz = this;

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
        var userNameBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(12,12,4,4));
        userNameBg.setPreferredSize(cc.size(500, 70));
        userNameBg.setPosition(cc.p(this.layerBg.getContentSize().width/2, 450));
        this.layerBg.addChild(userNameBg);

        var passwordBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(12,12,4,4));
        passwordBg.setPreferredSize(cc.size(500, 70));
        passwordBg.setPosition(cc.p(this.layerBg.getContentSize().width/2, 350));
        this.layerBg.addChild(passwordBg);

        this.userText = new newui.TextField(cc.size(470, 70), cc.res.font.Roboto_Condensed_25);
        this.userText.setPlaceHolder("Tài khoản");
        this.userText.setTextColor(cc.color(255,255,255));
        this.userText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.userText.setMaxLength(32);
        this.userText.setPosition(userNameBg.getPosition());
        this.userText.setReturnCallback(function () {
            thiz.onLoginButonHandler();
            return false;
        });
        this.layerBg.addChild(this.userText,1);

        this.passwordText = new newui.TextField(cc.size(470, 70), cc.res.font.Roboto_Condensed_25);
        this.passwordText.setPasswordEnable(true);
        this.passwordText.setPlaceHolder("Mật khẩu");
        this.passwordText.setTextColor(cc.color(255,255,255));
        this.passwordText.setPlaceHolderColor(cc.color(144, 144, 144));
        this.passwordText.setMaxLength(30);
        this.passwordText.setPosition(passwordBg.getPosition());
        this.passwordText.setReturnCallback(function () {
            thiz.onLoginButonHandler();
            return false;
        });
        this.layerBg.addChild(this.passwordText,1);

        this.userText.nextTextField = this.passwordText;
        this.passwordText.nextTextField = this.userText;

        this.userText.setText(cc.Global.getSaveUsername());
        this.passwordText.setText(cc.Global.getSavePassword());

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

        var resetPasswordBt = new ccui.Widget();
        resetPasswordBt.setContentSize(resetPassword.getContentSize());
        resetPasswordBt.setPosition(resetPassword.x + resetPassword.getContentSize().width/2, resetPassword.y);
        resetPasswordBt.setTouchEnabled(true);
        this.layerBg.addChild(resetPasswordBt);

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
        this.layerBg.addChild(regButton);

        var margin = 100.0;
        var mTouch = cc.rect(margin, margin, this.layerBg.getContentSize().width - margin * 2, this.layerBg.getContentSize().height - margin * 2);
        //touch
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
           thiz.onLoginButonHandler();
        });

        regButton.addClickEventListener(function () {
            SceneNavigator.showSignup();
            thiz.hide();
        });
        resetPasswordBt.addClickEventListener(function () {
            var dialog = new ContactDialog();
            dialog.show();
            thiz.hide();
        });
    },

    onLoginButonHandler : function () {
        var username = this.userText.getText();
        var password = this.passwordText.getText();
        if(!username && username.length == 0){
            MessageNode.getInstance().show("Bạn phải nhập tên tài khoản");
            return;
        }
        if(!password && password.length == 0){
            MessageNode.getInstance().show("Bạn phải nhập mật khẩu");
            return;
        }
        LoadingDialog.getInstance().show("Đang đăng nhập");
        LobbyClient.getInstance().loginNormal(username, password, this.checkBox.isSelected());
    },
});

var SignupDialog = cc.Node.extend({
    ctor : function () {
        this._super();
        _createDialogFunction(this);
        var thiz = this;

        var blackLayer = new cc.LayerColor(cc.color(0,0,0,0.8 * 255), cc.winSize.width, cc.winSize.height);
        this.addChild(blackLayer);

        var bg = new ccui.Scale9Sprite("home-layer-bg.png", cc.rect(124,186,4,4));
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
        signupBt.setPosition(this.layerBg.getContentSize().width/2, 210.0);
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
        var genderToggle = new ToggleNodeGroup();
        this.genderToggle = genderToggle;
        this.layerBg.addChild(genderToggle);
        for(var i=0;i<toggleIcon.length;i++){
            (function () {
                var itemIdx = i;

                var toggleItem = new ToggleNodeItem(toggleIcon[i].getContentSize());
                toggleItem.setPosition(toggleIcon[i].getPosition());
                toggleItem.onSelect = function () {
                    toggleSelected.setPosition(toggleItem.getPosition());
                    thiz._male = (itemIdx == 0) ? true : false;
                };
                genderToggle.addItem(toggleItem);
            })();
        }

        //touch
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
            var phoneNumber = thiz.phoneText.getText();
            LoadingDialog.getInstance().show("Đang đăng ký");
            LobbyClient.getInstance().signup(username, password, phoneNumber, thiz._male);
        });


        var loginLabel = new cc.LabelBMFont("Đăng nhập", cc.res.font.Roboto_Condensed_25);
        loginLabel.setColor(cc.color("#4c6080"));
        loginLabel.setPosition(this.layerBg.getContentSize().width/2, 140.0);
        this.layerBg.addChild(loginLabel, 1);

        var loginBt = new ccui.Widget();
        loginBt.setContentSize(loginLabel.getContentSize());
        loginBt.setPosition(loginLabel.getPosition());
        loginBt.setTouchEnabled(true);
        this.layerBg.addChild(loginBt);
        loginBt.addClickEventListener(function () {
            SceneNavigator.showLoginNormal();
            thiz.hide();
        });
    },

    onEnter : function () {
        this._super();
        this.genderToggle.selectItem(0);
    }
});

var HomeLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var barBg = new cc.Sprite("#login_bar_bg.png");
        barBg.setAnchorPoint(cc.p(0,0));
        barBg.setPosition(cc.p(0,0));
        this.addChild(barBg);

        var logo = new cc.Sprite("#bot_bar_logo.png");
        logo.setPosition(640, 98);
        this.addChild(logo);

        var fbButton = new ccui.Button("home-bg-bt.png","","", ccui.Widget.PLIST_TEXTURE);
        fbButton.setPosition(cc.p(640.0, 30));
        fbButton.setScale(cc.winSize.screenScale);
        this.addChild(fbButton);

        var loginBt = new ccui.Button("home-signin.png","","", ccui.Widget.PLIST_TEXTURE);
        loginBt.setPosition(cc.p(920, 37));
        this.addChild(loginBt);

        var signupBt = new ccui.Button("home-signup.png","","", ccui.Widget.PLIST_TEXTURE);
        signupBt.setPosition(cc.p(378,36));
        this.addChild(signupBt);

        this.fbButton = fbButton;
        this.loginBt = loginBt;
        this.signupBt = signupBt;

        loginBt.addClickEventListener(function () {
            SceneNavigator.showLoginNormal();
        });

        signupBt.addClickEventListener(function () {
            SceneNavigator.showSignup();
        });
    }
});