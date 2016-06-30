/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var quyetnd = quyetnd || {};
quyetnd.ActionShake2D = cc.CustomAction.extend({
    _strength : null,
    _originPosition : null,
    _target : null,
    ctor : function (duration, strength) {
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

// quyetnd.ActionNumber = cc.CustomAction.extend({
//     ctor : function () {
//
//     }
//
// });