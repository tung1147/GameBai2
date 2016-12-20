/**
 * Created by QuyetNguyen on 12/20/2016.
 */
var MiniGamePopup = cc.Node.extend({
    ctor : function () {
        this._super();
      //  this.setScale(0.6);
    },

    onEnter : function () {
        this._super();

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            },
            onTouchMoved: function (touch, event) {
                thiz.onTouchMoved(touch, event);
            },
            onTouchEnded: function (touch, event) {
                thiz.onTouchEnded(touch, event);
            }
        }, this);
    },

    onExit : function () {
        this._super();
    },

    onTouchBegan : function (touch, event) {
        if(this._touchStartPoint){
            return false;
        }

        this._touchStartPoint = touch.getLocation();
        var p = this.convertToNodeSpace(this._touchStartPoint);
        if(cc.rectContainsPoint(this._boudingRect, p)){
            return true;
        }
        this._touchStartPoint = null;
        return false;
    },

    onTouchMoved : function (touch, event) {
        var p = touch.getLocation();
        this.moveNode(cc.p(p.x - this._touchStartPoint.x, p.y - this._touchStartPoint.y));
        this._touchStartPoint = p;
    },

    onTouchEnded : function (touch, event) {
        this._touchStartPoint = null;
    },

    moveNode : function (ds) {
        this.x += ds.x;
        this.y += ds.y;

        var lb = this.convertToWorldSpace(cc.p(this._boudingRect.x, this._boudingRect.y));
        var rt = this.convertToWorldSpace(cc.p(this._boudingRect.x + this._boudingRect.width, this._boudingRect.y + this._boudingRect.height));

        if(lb.x < 0){
            this.x -= lb.x;
        }
        if(rt.x > cc.winSize.width){
            this.x -= (rt.x - cc.winSize.width);
        }
        if(lb.y < 0){
            this.y -= lb.y;
        }
        if(rt.y > cc.winSize.height){
            this.y -= (rt.y - cc.winSize.height);
        }
    },

    show : function () {
        this.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        var bg = new cc.LayerColor(cc.color(0,0,0,0));
        bg.addChild(this);

        var runningScene = cc.director.getRunningScene();
        if(runningScene){
            if(runningScene.popupLayer){
                runningScene.popupLayer.addChild(bg)
            }
            else{
                runningScene.addChild(bg);
            }

            // cc.eventManager.addListener({
            //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //     swallowTouches:true,
            //     onTouchBegan : function () {
            //         return true;
            //     }
            // }, bg);
        }
    },

    hide : function () {
        this.getParent().removeFromParent(true);
    }
});