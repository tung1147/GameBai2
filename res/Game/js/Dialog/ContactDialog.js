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
        this.showContactInfo();
    },

    showContactInfo : function () {
        var contactDial = new cc.Sprite("#contactDial.png");
        contactDial.setPosition(this.dialogNode.width/2 - 100, 295);
        this.dialogNode.addChild(contactDial);

        var contactFacebook = new ccui.Button("contactFacebook.png", "", "", ccui.Widget.PLIST_TEXTURE);
        contactFacebook.setZoomScale(0);
        contactFacebook.setPosition(this.dialogNode.width/2 + 100,contactDial.y);
        this.dialogNode.addChild(contactFacebook);

        var contactStr = "Vui lòng gọi vào hotline hoặc nhắn tin qua fanpage Facebook để được hỗ trợ trực tiếp";
        var contactLabel = new cc.LabelBMFont(contactStr,cc.res.font.Roboto_Condensed_25,580,cc.TEXT_ALIGNMENT_CENTER);
        contactLabel.setPosition(this.dialogNode.width/2,400);

        var dialLabel = new cc.LabelBMFont(GameConfig.hotline,cc.res.font.Roboto_Condensed_25);
        dialLabel.setPosition(contactDial.x,contactDial.y - 70);
        dialLabel.setColor(cc.color("#006fc5"));
        this.dialogNode.addChild(dialLabel);

        var facebookLabel = new cc.LabelBMFont("Nhắn tin",cc.res.font.Roboto_Condensed_25);
        facebookLabel.setPosition(contactFacebook.x,dialLabel.y);
        facebookLabel.setColor(cc.color("#006fc5"));
        this.dialogNode.addChild(facebookLabel);

        contactFacebook.addClickEventListener(function () {
            var win = window.open(GameConfig.fanpage, '_blank');
            win.focus();
        });

        this.dialogNode.addChild(contactLabel);
    }
});