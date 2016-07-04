/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var LoginDialog = cc.Node.extend({
   // mTouch:null,
    ctor : function () {
        this._super();

        var blackLayer = new cc.LayerColor(cc.color(0,0,0,0.8 * 255), cc.winSize.width, cc.winSize.height);
        this.addChild(blackLayer);

        this.layerBg = ccui.Scale9Sprite.createWithSpriteFrameName("home-layer-bg.png", cc.rect(114, 114, 4, 4));
        this.layerBg.setPreferredSize(cc.size(850.0, 700.0));
        this.layerBg.setPosition(cc.winSize.width / 2, cc.winSize.height/2);
        this.addChild(this.layerBg);

        var title = cc.Sprite("#home-signin-text.png");
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

        this.userText = new newui.EditBox(cc.size(470, 70));
        this.userText.setPlaceHolder("Tài khoản");
        this.userText.setFont(cc.res.font.Roboto_Condensed, 24);
        this.userText.setFontColor(cc.color(255,255,255,255));
        this.userText.setPlaceholderFont(cc.res.font.Roboto_Condensed, 24);
        this.userText.setPlaceholderFontColor(cc.color(144, 144, 144, 255));
        this.userText.setMaxLength(32);
        this.userText.setInputMode(newui.EditBox.InputMode.SINGLE_LINE);
        this.userText.setReturnType(newui.EditBox.ReturnType.DONE);
        this.userText.setPosition(userNameBg.getPosition());
        this.layerBg.addChild(this.userText);

        this.passwordText = new newui.EditBox(cc.size(470, 70));
        this.passwordText.setPlaceHolder("Mật khẩu");
        this.passwordText.setFont(cc.res.font.Roboto_Condensed, 24);
        this.passwordText.setFontColor(cc.color(255,255,255,255));
        this.passwordText.setPlaceholderFont(cc.res.font.Roboto_Condensed, 24);
        this.passwordText.setPlaceholderFontColor(cc.color(144, 144, 144, 255));
        this.passwordText.setMaxLength(30);
        this.passwordText.setInputMode(newui.EditBox.InputMode.SINGLE_LINE);
        this.passwordText.setReturnType(newui.EditBox.ReturnType.DONE);
        this.passwordText.setInputFlag(newui.EditBox.InputFlag.PASSWORD);
        this.passwordText.setPosition(passwordBg.getPosition());
        this.layerBg.addChild(this.passwordText);

        var margin = 100.0;
        var mTouch = cc.rect(margin, margin, this.layerBg.getContentSize().width - margin * 2, this.layerBg.getContentSize().height - margin * 2);
        //touch
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(thiz.visible){
                    var pTouch = touch.getLocation();
                    var p = thiz.layerBg.convertToNodeSpace(pTouch);
                    if(!cc.rectContainsPoint(mTouch, p)){
                        thiz.visible = false;
                    }
                    else{
                        cc.log("touch: "+ p.x + " "+ p.y);
                    }

                    return true;
                }
                return false;
            }
        }, this);
    },

    show : function () {
        this.visible = true;
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

        var title = cc.Sprite("#home-signup-text.png");
        title.setPosition(bg.getContentSize().width/2, 465.0);
        bg.addChild(title);

        //touch
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(thiz.visible){
                    var pTouch = touch.getLocation();
                    var p = bg.convertToNodeSpace(pTouch);
                    if(!cc.rectContainsPoint(mTouch, p)){
                        thiz.visible = false;
                    }
                    else{
                        cc.log("touch: "+ p.x + " "+ p.y);
                    }

                    return true;
                }
                return false;
            }
        }, this);
    },

    show : function () {
        this.visible = false;
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

        this.loginDialog = new LoginDialog();
        this.loginDialog.visible = false;
        this.addChild(this.loginDialog);

        this.signupDialog = new SignupDialog();
        this.signupDialog.visible = false;
        this.addChild(this.signupDialog);

        var thiz = this;
        this.loginBt.addClickEventListener(function () {
            thiz.loginDialog.show();
        });

        this.signupBt.addClickEventListener(function () {
            thiz.signupDialog.show();
        });
    }
});