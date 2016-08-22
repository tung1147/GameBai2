/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var ResultDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(600, 430));
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Kết quả");
    }
});