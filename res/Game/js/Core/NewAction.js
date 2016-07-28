/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

//Point()|cc.p()|
var quyetnd = quyetnd || {};
quyetnd.ActionShake2D = cc.CustomAction.extend({
    ctor : function (duration, strength) {
        this._strength = null;
        this._originPosition = null;
        this._target = null;

        this._super();
        this.initWithDuration(duration);
        this._strength = strength;
    },

    onStop : function () {
        this._target.setPosition(this._originPosition);
    },

    onUpdate : function (dt) {
        this._target.x = this._originPosition.x + this._strength.x - (Math.random() * this._strength.x * 2);
        this._target.y = this._originPosition.y + this._strength.y - (Math.random() * this._strength.y * 2);
    },

    onStartWithTarget : function (target) {
        this._target = target;
        this._originPosition = target.getPosition();
    }
});

quyetnd.ActionTimer = cc.CustomAction.extend({
    ctor : function (duration, callback) {
        this._super();
        this.callback = callback;
        this.initWithDuration(duration);
    },

    onUpdate : function (dt) {
        if(this.callback){
            this.callback(dt);
        }
    }
});