/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var LoadingDialog = cc.Node.extend({
    ctor : function () {
        this._super();
    },

    onEnter : function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                return true;
            }
        }, this);
    },

    onExit : function () {
        this._super();
        cc.eventManager.removeLis
    }
});