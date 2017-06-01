/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var s_Dialog_Create_Button1 = function (size, title) {
    var bt = new ccui.Button("dialog-button-1.png", "", "", ccui.Widget.PLIST_TEXTURE);
    bt.setScale9Enabled(true);
    bt.setColor(cc.color("#ffde00"));
    bt.setCapInsets(cc.rect(10,10,4,4));
    bt.setContentSize(size);
    if(title){
        var btTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, title);
        btTitle.setColor(cc.color("#835238"));
        btTitle.setPosition(size.width/2, size.height/2);
        bt.getRendererNormal().addChild(btTitle);
        bt.buttonTitleLabel = btTitle;
    }
    return bt;
};

var s_Dialog_Create_Button2 = function (size, title) {
    var bt = new ccui.Button("dialog-button-1.png", "", "", ccui.Widget.PLIST_TEXTURE);
    bt.setScale9Enabled(true);
    bt.setColor(cc.color("#c9d6ed"));
    bt.setCapInsets(cc.rect(10,10,4,4));
    bt.setContentSize(size);
    if(title){
        var btTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, title);
        btTitle.setColor(cc.color("#426275"));
        btTitle.setPosition(size.width/2, size.height/2);
        bt.getRendererNormal().addChild(btTitle);
        bt.buttonTitleLabel = btTitle;
    }
    return bt;
};

var IDialog = cc.Node.extend({
    ctor : function () {
        this._super();
        this._isShow = false;
        this.mTouch = cc.rect(0,0,0,0);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        this._maxLeft = 0;
        this._maxRight = cc.winSize.width;
        this._maxBottom = 0;
        this._maxTop = cc.winSize.height;

        // var colorLayer = new cc.LayerColor(cc.color(0,0,0,180), cc.winSize.width, cc.winSize.height);
        // this.addChild(colorLayer);
        //
        // var dialogNode = new cc.Node();
        // dialogNode.setAnchorPoint(cc.p(0.5, 0.5));
        // dialogNode.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        // this.addChild(dialogNode);
        // this = dialogNode;
    },
    adjustlel : function () {

    },
    show : function (rootNode) {
        this._isShow = true;
        var parentNode = this.getParent();
        if(parentNode){
            this.removeFromParent(true);
            parentNode.removeFromParent(true);
            parentNode = null;
        }

        if(!rootNode){
            rootNode = cc.director.getRunningScene();
        }

        if(rootNode){
            if(rootNode.popupLayer){
                parentNode = rootNode.popupLayer;
            }
            else{
                parentNode = rootNode;
            }

            this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            if(!this._bgColor){
                this._bgColor = cc.color(0,0,0,180);
            }
            var colorLayer = new cc.LayerColor(this._bgColor, cc.winSize.width, cc.winSize.height);
            colorLayer.addChild(this);
            parentNode.addChild(colorLayer);
        }
    },
    showWithAnimationScale : function () {
        Dialog.prototype.show.apply(this, arguments);

        var defaultScale = this.getScale();
        this.setScale(0.0);
        var scaleAction = new cc.EaseElasticOut(new cc.ScaleTo(0.7, defaultScale));
        this.runAction(scaleAction);
    },
    showWithAnimationMove : function () {
        Dialog.prototype.show.apply(this, arguments);

        this.y = cc.winSize.height + this.getContentSize().height/2;
        var moveAction = new cc.EaseBounceOut(new cc.MoveTo(0.7, cc.p(cc.winSize.width/2, cc.winSize.height/2)));
        this.runAction(moveAction);
    },
    hide : function () {
        this._isShow = false;
        var parent = this.getParent();
        if(parent){
            this.removeFromParent(true);
            parent.removeFromParent(true);
        }
    },

    isShow : function () {
        //return this._running;
        return this._isShow;
    },

    onTouchDialog : function () {

    },

    onExit : function () {
        this._super();
        this._isShow = false;
    },

    onEnter : function () {
        this._super();
        this._isShow = true;

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(thiz._moveEnable){
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if(cc.rectContainsPoint(thiz.mTouch, p)){
                        thiz.onTouchDialog();
                        return true;
                    }
                    return false;
                }
                else{
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if(cc.rectContainsPoint(thiz.mTouch, p)){
                        thiz._touchInside = true;
                        thiz.adjustlel();
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved : function (touch, event){
                if(thiz._moveEnable){
                    thiz.moveDialog(touch.getDelta());
                }
            },
            onTouchEnded : function (touch, event) {
                if(thiz._moveEnable){

                }
                else{
                    if(thiz._touchInside){
                        thiz._touchInside = false;
                        return;
                    }
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if(!cc.rectContainsPoint(thiz.mTouch, p)){
                        thiz.hide();
                    }
                }
                cc.log(thiz._moveEnable);
            }
        }, this);
    },

    moveDialog : function (ds) {
        this.x += ds.x;
        this.y += ds.y;
        if(this.x < this._maxLeft){
            this.x = this._maxLeft;
        }
        if(this.x > this._maxRight){
            this.x = this._maxRight;
        }
        if(this.y < this._maxBottom){
            this.y = this._maxBottom;
        }
        if(this.y > this._maxTop){
            this.y = this._maxTop;
        }
    }
});

var Dialog = IDialog.extend({
    ctor : function () {
        this._super();
        this._marginLeft = 0.0;
        this._marginRight = 0.0;
        this._marginTop = 0.0;
        this._marginBottom = 0.0;

        var dialogBg = new ccui.Scale9Sprite("dialog-bg.png", cc.rect(20, 20, 4, 4));
        dialogBg.setAnchorPoint(cc.p(0.0,0.0));
        this.addChild(dialogBg);

        var dialogBg2 = new ccui.Scale9Sprite("dialog-bg2.png", cc.rect(90, 90, 4, 4));
        dialogBg2.setAnchorPoint(cc.p(0.0,0.0));
        dialogBg2.setVisible(false);
        this.addChild(dialogBg2);

        var dialogBgTitle = new cc.Scale9Sprite("dialog-bg-title.png", cc.rect(20, 0, 4, 60));
        this.addChild(dialogBgTitle);


        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Title");
        title.setColor(cc.color("#77cbee"));
        this.addChild(title);

        var closeButton = new ccui.Button("dialog-button-close.png","","", ccui.Widget.PLIST_TEXTURE);
        this.addChild(closeButton);

        var okButton = s_Dialog_Create_Button1(cc.size(182, 60), "OK");
        this.addChild(okButton);

        var cancelButton = s_Dialog_Create_Button2(cc.size(182, 60), "CANCEL");
        this.addChild(cancelButton);

        this.dialogBg = dialogBg;
        this.dialogBg2 = dialogBg2;
        this.title = title;
        this.closeButton = closeButton;
        this.okButton = okButton;
        this.cancelButton = cancelButton;
        this.okTitle = okButton.buttonTitleLabel;
        this.cancelTitle = cancelButton.buttonTitleLabel;
        this.dialogBgTitle = dialogBgTitle;
        this.isBgDialogShadow = false;


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
    },

    initWithSize : function (mSize) {
        this.dialogBg.setVisible(!this.isBgDialogShadow);
        this.dialogBg2.setVisible(this.isBgDialogShadow);
        if(this.isBgDialogShadow)
        {
            this.dialogBg2.setPreferredSize(cc.size(mSize.width, mSize.height));
            this.setContentSize(this.dialogBg2.getContentSize());

            this.dialogBgTitle.setPreferredSize(cc.size(this.dialogBg2.getContentSize().width - 50, 60));
            this.dialogBgTitle.setPosition(cc.p(this.dialogBg2.width/2, this.dialogBg2.height - this.dialogBgTitle.getContentSize().height/2));
            this.title.setPosition(this.getContentSize().width/2, this.dialogBgTitle.getPosition().y);
            this.closeButton.setPosition(this.getContentSize().width - 58.0, this.title.y);
            this.mTouch = cc.rect(25, 25, mSize.width - 25, mSize.height - 25);

            this._maxLeft = mSize.width/2 - 21;
            this._maxRight = cc.winSize.width - mSize.width/2 + 21;
            this._maxBottom = mSize.height/2 - 21;
            this._maxTop = cc.winSize.height - mSize.height/2 - 4;

        }
        else
        {
            this.dialogBg.setPreferredSize(cc.size(mSize.width + this._marginLeft + this._marginRight, mSize.height + this._marginTop + this._marginBottom));
            this.setContentSize(this.dialogBg.getContentSize());

            this.dialogBgTitle.setPreferredSize(cc.size(this.dialogBg.getContentSize().width, 60));
            this.dialogBgTitle.setPosition(cc.p(this.dialogBg.getContentSize().width/2, this.dialogBg.height - this.dialogBgTitle.getContentSize().height/2));


            this.title.setPosition(this.getContentSize().width/2, this.dialogBgTitle.getPosition().y);
            this.closeButton.setPosition(this.getContentSize().width - 33.0, this.title.y);
            this.mTouch = cc.rect(this._marginLeft, this._marginBottom, mSize.width, mSize.height);

            this._maxLeft = mSize.width/2 + 4;
            this._maxRight = cc.winSize.width - mSize.width/2 - 4;
            this._maxBottom = mSize.height/2 + 4;
            this._maxTop = cc.winSize.height - mSize.height/2 - 4;
        }


        this.okButton.setPosition(this.getContentSize().width/2 - this.okButton.getContentSize().width/2 - 15.0, 50);
        this.cancelButton.setPosition(this.getContentSize().width/2 + this.cancelButton.getContentSize().width/2 + 15.0, 50);


    },

    closeButtonHandler : function () {
        this.hide();
    }
});