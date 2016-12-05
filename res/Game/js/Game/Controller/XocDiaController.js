/**
 * Created by QuyetNguyen on 12/5/2016.
 */

var XocDiaController = GameController.extend({
    ctor : function (view) {
        this._super();
        this.initWithView(view);
    },
    getMaxSlot : function () {
        return 1;
    }
});