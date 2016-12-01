/**
 * Created by QuyetNguyen on 11/23/2016.
 */
var SamController = TLMNGameController.extend({
    ctor : function (view) {
        this._super();
        this.initWithView(view);
    },

    getMaxSlot : function () {
        return 5;
    },
});