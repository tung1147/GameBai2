/**
 * Created by Quyet Nguyen on 7/11/2016.
 */
var SettingDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(600, 320));
        this.title.setString("Cài đặt");
        this.closeButton.visible = false;
        this.okButton.visible = false;
        this.cancelButton.visible = false;
    }
});