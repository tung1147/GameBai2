/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var Dialog = cc.Node.extend({
    ctor : function () {
        this._super();
        this._marginLeft = 98.0;
        this._marginRight = 98.0;
        this._marginTop = 98.0;
        this._marginBottom = 98.0;

        var colorLayer = new cc.LayerColor(cc.color(0,0,0,125), cc.winSize.width, cc.winSize.height);
        this.addChild(colorLayer);

        var dialogNode = new cc.Node();
        dialogNode.setAnchorPoint(cc.p(0.5, 0.5));
        dialogNode.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(dialogNode);

        var dialogBg = ccui.Scale9Sprite.createWithSpriteFrameName("dialog-bg.png", cc.rect(124,186,4,4));
        dialogBg.setAnchorPoint(cc.p(0.0,0.0));
        dialogNode.addChild(dialogBg);

        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Title");
        dialogNode.addChild(title);

        var closeButton = new ccui.Button("dialog-button-close.png","","", ccui.Widget.PLIST_TEXTURE);
        dialogNode.addChild(closeButton);

        var okButton = new ccui.Button("dialog-button-1.png","","", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setContentSize(182, 60);
        dialogNode.addChild(okButton);

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "OK BUTTON");
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);

        var cancelButton = new ccui.Button("dialog-button-2.png","","", ccui.Widget.PLIST_TEXTURE);
        cancelButton.setScale9Enabled(true);
        cancelButton.setContentSize(182, 60);
        dialogNode.addChild(cancelButton);

        var cancelTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "OK BUTTON");
        cancelTitle.setPosition(cancelButton.getContentSize().width/2, cancelButton.getContentSize().height/2);
        cancelButton.getRendererNormal().addChild(cancelTitle);

        this.dialogBg = dialogBg;
        this.dialogNode = dialogNode;
        this.title = title;
        this.closeButton = closeButton;
        this.okButton = okButton;
        this.cancelButton = cancelButton;
        this.okTitle = okTitle;
        this.cancelTitle = cancelTitle;

        var thiz = this;
        closeButton.addClickEventListener(function () {
            if(thiz.closeButtonHandler){
                thiz.closeButtonHandler();
            }
        });

        okButton.addClickEventListener(function () {
            if(thiz.okButtonHandler){
                thiz.okButtonHandler();
            }
        });

        cancelButton.addClickEventListener(function () {
            if(thiz.cancelButtonHandler){
                thiz.cancelButtonHandler();
            }
        });

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                return true;
            },
            onTouchEnded : function (touch, event) {
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if(!cc.rectContainsPoint(thiz.mTouch, p)){
                    thiz.hide();
                }
            }
        }, this);
    },

    initWithSize : function (mSize) {
        this.dialogBg.setPreferredSize(cc.size(mSize.width + this._marginLeft + this._marginRight, mSize.height + this._marginTop + this._marginBottom));
        this.dialogNode.setContentSize(this.dialogBg.getContentSize());

        this.title.setPosition(this.dialogNode.getContentSize().width/2, this.dialogNode.getContentSize().height - 138.0);
        this.closeButton.setPosition(this.dialogNode.getContentSize().width - 143.0, this.title.y);
        this.okButton.setPosition(this.dialogNode.getContentSize().width/2 - this.okButton.getContentSize().width/2 - 15.0, 156);
        this.cancelButton.setPosition(this.dialogNode.getContentSize().width/2 + this.cancelButton.getContentSize().width/2 + 15.0, 156);

        this.mTouch = cc.rect(this.dialogNode.x - mSize.width/2, this.dialogNode.y - mSize.height/2, mSize.width, mSize.height);
    },

    onEnter : function () {
        this._super();
    },

    onExit : function () {
        this._super();
    },

    show : function () {
        var parentNode = this.getParent();
        if(parentNode){
            parentNode.removeChild(this);
            parentNode = null;
        }
        if(arguments.length == 1){
            parentNode = arguments[0];
        }
        else{
            parentNode = cc.director.getRunningScene();
        }
        if(parentNode){
            if(parentNode.popupLayer){
                parentNode.popupLayer.addChild(this)
            }
            else{
                parentNode.addChild(this);
            }
        }
    },

    showWithAnimationScane : function () {

    },

    showWithAnimationMove : function () {

    },

    hide : function () {
        var parent = this.getParent();
        if(parent){
            this.removeFromParent(true);
        }
    },

    isShow : function () {
        var parent = this.getParent();
        if(parent){
            return true;
        }
        return false;
    },

    closeButtonHandler : function () {
        this.hide();
    },
});