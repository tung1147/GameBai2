/**
 * Created by Quyet Nguyen on 8/19/2016.
 */

var s_float_button_games = s_float_button_games || [13,14,15];
var s_float_button_animationDuration = s_float_button_animationDuration || 0.2;

var FloatButtonCenter = cc.Node.extend({
    ctor : function () {
        this._super();
        var normalSprite = new cc.Sprite("#floatBt-hide.png");
        this.addChild(normalSprite);
        this.setContentSize(cc.size(84, 84));

        var showSprite = new cc.Sprite("#floatbt-show.png");
        showSprite.visible = false;
        this.addChild(showSprite);

        //normalSprite.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        //showSprite.setPosition(normalSprite.getPosition());

        this.normalSprite = normalSprite;
        this.showSprite = showSprite;
    },
    show : function () {
        this.normalSprite.visible = false;
        this.showSprite.visible = true;
    },
    hide : function () {
        this.normalSprite.visible = true;
        this.showSprite.visible = false;
    }
});

var FloatButton = (function() {
    var instance = null;
    var FloatButtonClass = cc.Node.extend({
        ctor : function () {
            this._super();
            this.showAll = false;
            this.setPosition(cc.winSize.width/2, cc.winSize.height/2);

            var bg = new cc.Sprite("#floatBt-bg.png");
            bg.visible = false;
            this.addChild(bg);
            this.bg = bg;

            this.initComponent();
            this.initButtonCenter();
        },
        initButtonCenter : function () {
            var btCenter = new FloatButtonCenter();
            btCenter.setPosition(0,0);
            this.addChild(btCenter);

            this.rectTouch = cc.rect(-btCenter.getContentSize().width/2, -btCenter.getContentSize().height/2, btCenter.getContentSize().width, btCenter.getContentSize().height);
            this.btCenter = btCenter;
        },
        initComponent : function () {
            var radius = cc.p(0,120);
            var size = s_float_button_games.length;
            var allComponent = [];
            for(var i=0;i<size;i++){
                var component = new FloatButtomComponent(s_float_button_games[i]);
                var angle = cc.PI * 2 / size * i;
                component.targetPosition =  cc.pRotateByAngle(radius, cc.p(0,0), angle);
                component.visible = false;
                this.addChild(component);
                allComponent.push(component);

                component.setPosition(component.targetPosition);
            }
            this.allComponent = allComponent;
        },
        show : function (parent) {
            var currentParent = this.getParent();
            if(currentParent){
                currentParent.removeChild(this);
            }
            parent.addChild(this);
            this.forceHide();
           // cc.log("show");
        },
        onEnter : function () {
            this._super();
            this.isTouch = false;

            var thiz = this;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan : function (touch, event) {
                    if(thiz.isTouch){
                        return false;
                    }
                    var b = thiz.onTouchBegan(touch, event);
                    if(b){
                        thiz.isTouch = true;
                    }
                    return b;
                },
                onTouchMoved : function (touch, event) {
                    thiz.onTouchMoved(touch, event);
                },
                onTouchEnded : function (touch, event) {
                    thiz.isTouch = false;
                    thiz.onTouchEnded(touch, event);
                }
            }, this);
        },
        onExit : function () {
            this._super();
            cc.eventManager.removeListeners(this);
        },
        onTouchBegan : function (touch, event){
            if(!cc.Global.NodeIsVisible(this)){
                return false;
            }
            var p = this.convertToNodeSpace(touch.getLocation());
            if(cc.rectContainsPoint(this.rectTouch, p)){
                this.startPosition = touch.getLocation();
                this.isMoved = false;
                this.canMoved = true;
                return true;
            }
            else{
                if(this.showAll){
                    this.canMoved = false;
                    this.hideAllComponent();
                    return true;
                }
            }
            return false;
        },
        onTouchMoved : function (touch, event){
            if(!this.canMoved){
                return;
            }
            var p = touch.getLocation();
            if(!this.isMoved){
                var d = cc.pDistance(this.startPosition, p);
                if(cc.pDistance(this.startPosition, p) >= 10){
                    this.isMoved = true;
                }
                else{
                    return;
                }
            }

            var x = this.x + (p.x - this.startPosition.x);
            var y = this.y + (p.y - this.startPosition.y);
            //fix position
            var left = x - this.rectTouch.width/2;
            var right = x + this.rectTouch.width/2;
            var top = y + this.rectTouch.height/2;
            var bottom = y - this.rectTouch.height/2;
            if(left < 0){
                x = this.rectTouch.width/2;
            }
            if(right > cc.winSize.width){
                x = cc.winSize.width - this.rectTouch.width/2;
            }
            if(bottom < 0){
                y = this.rectTouch.height/2;
            }
            if(top > cc.winSize.height){
                y = cc.winSize.height - this.rectTouch.height/2;
            }

            this.x = x;
            this.y = y;
            this.startPosition = p;
        },
        onTouchEnded : function (touch, event){
            if(!this.canMoved){
                return;
            }
            if(!this.isMoved){
                if(this.showAll){
                    this.hideAllComponent();
                }
                else{
                    this.showAllComponent();
                }
            }
        },
        showAllComponent : function () {
            this.showAll = true;
            this.btCenter.show();
            for(var i=0;i<this.allComponent.length;i++){
                this.allComponent[i].show(s_float_button_animationDuration);
            }
            this.bg.visible = true;
            this.bg.setScale(0.0);
            this.bg.stopAllActions();
            this.bg.runAction(new cc.EaseSineOut(new cc.ScaleTo(s_float_button_animationDuration, 1.0)));
        },
        hideAllComponent : function () {
            this.showAll = false;
            this.btCenter.hide();
            for(var i=0;i<this.allComponent.length;i++){
                this.allComponent[i].hide(s_float_button_animationDuration);
            }
            this.bg.stopAllActions();
            var scaleAction = new cc.EaseSineIn(new cc.ScaleTo(s_float_button_animationDuration, 0.0));
            var thiz = this;
            var finishedAction = new cc.CallFunc(function () {
                thiz.bg.visible = false;
            });
            this.bg.runAction(new cc.Sequence(scaleAction, finishedAction));
        },
        forceHide : function () {
            this.showAll = false;
            this.btCenter.hide();
            for(var i=0;i<this.allComponent.length;i++){
                this.allComponent[i].visible = false;
            }
            this.bg.visible = false;
        },
    });

    FloatButtonClass.getInstance = function() {
        if (!instance) {
            instance = new FloatButtonClass();
            instance.retain();
        }
        return instance;
    }

    return FloatButtonClass;
})();