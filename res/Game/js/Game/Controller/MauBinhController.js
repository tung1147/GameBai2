/**
 * Created by VGA10 on 1/11/2017.
 */

var MauBinhController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

    },
    getMaxSlot: function () {
        return 4;
    }
});