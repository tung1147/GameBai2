/**
 * Created by QuyetNguyen on 1/6/2017.
 */

var ContactDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Liên hệ");
        this.initWithSize(cc.size(680, 450));
    },
});