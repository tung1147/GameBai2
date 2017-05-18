/**
 * Created by QuyetNguyen on 1/6/2017.
 */

var ContactDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Liên hệ");
        this.initWithSize(cc.size(478, 278));
        this.showContactInfo();
    },

    setTitle : function (title) {
        this.title.setString(title);
    },

    showContactInfo : function () {

        var contactFacebook = new ccui.Button("contactFacebook.png", "", "", ccui.Widget.PLIST_TEXTURE);
        contactFacebook.setPosition(this.width/2, 189);
        this.addChild(contactFacebook);

        var contactStr = "Vui lòng nhắn tin qua fanpage Facebook để được hỗ trợ trực tiếp";
        var contactLabel = new cc.LabelBMFont(contactStr,cc.res.font.Roboto_Condensed_18, 440, cc.TEXT_ALIGNMENT_CENTER);
        contactLabel.setPosition(this.width/2, 264);


        var facebookLabel = new cc.LabelBMFont("Nhắn tin",cc.res.font.Roboto_Condensed_18);
        facebookLabel.setPosition(contactFacebook.x, 130);
        facebookLabel.setColor(cc.color("#ffde00"));
        this.addChild(facebookLabel);

        contactFacebook.addClickEventListener(function () {
            cc.Global.openURL(GameConfig.fanpage);
        });

        this.addChild(contactLabel);
    }
});