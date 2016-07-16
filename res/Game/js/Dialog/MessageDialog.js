/**
 * Created by Quyet Nguyen on 7/16/2016.
 */

var MessageDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(600,320));
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Thông báo");

        var messageLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "message", cc.TEXT_ALIGNMENT_CENTER, 550);
        messageLabel.setPosition(this.dialogNode.getContentSize().width/2, this.dialogNode.getContentSize().height/2 - 40);
        this.dialogNode.addChild(messageLabel);
        this.messageLabel = messageLabel;
    },
    setMessage : function (message) {
        this.messageLabel.setString(message);
    }
});

var MessageConfirmDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(600,400));
        this.title.setString("Thông báo");
        this.closeButton.visible = false;
        this.okTitle.setString("Đồng ý");
        this.cancelTitle.setString("Đóng");

        var messageLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "message", cc.TEXT_ALIGNMENT_CENTER, 550);
        messageLabel.setPosition(this.dialogNode.getContentSize().width/2, this.dialogNode.getContentSize().height/2);
        this.dialogNode.addChild(messageLabel);
        this.messageLabel = messageLabel;
    },
    setMessage : function (message) {
        this.messageLabel.setString(message);
    },
    okButtonHandler : function () {

    },
    cancelButtonHandler : function () {
        this.hide();
    }
});