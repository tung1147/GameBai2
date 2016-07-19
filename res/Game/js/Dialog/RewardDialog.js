/**
 * Created by Quyet Nguyen on 7/19/2016.
 */
var RewardDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(600,420));
        this.title.setString("Nhận thưởng");
        this.closeButton.visible = false;
        this.okTitle.setString("Nhận thưởng");
        this.cancelTitle.setString("Hủy");

        var bg = ccui.Scale9Sprite.createWithSpriteFrameName("lobby-text-input.png",cc.rect(10,10,4,4));
        bg.setPreferredSize(cc.size(420, 60));
        bg.setPosition(this.dialogNode.getContentSize().width/2, this.dialogNode.getContentSize().height/2 - 40);
        this.dialogNode.addChild(bg);

        var phoneText = new newui.EditBox(cc.size(bg.getContentSize().width - 6, bg.getContentSize().height-2));
        phoneText.setFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        phoneText.setPlaceholderFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        phoneText.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        phoneText.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        phoneText.setPlaceHolder("Nhập số điện thoại");
        phoneText.setPosition(bg.getPosition());
        this.dialogNode.addChild(phoneText, 1);
    },
    setItem : function (itemName, gold) {
        var goldstr = "<font color='#ffde00'>" + " " + cc.Global.NumberFormat1(gold) + " V" + " " + "</font>";
        var itemStr = "<font color='#17b0e2'>" + " " + itemName + "</font>";

        var textStr1 = "<font face='"+cc.res.font.Roboto_Condensed+"' size='30'>" + "Bạn muốn đổi" +goldstr + "</font>";
        var textStr2 = "<font face='"+cc.res.font.Roboto_Condensed+"' size='30'>" + "lấy" +itemStr + "</font>";

        var text = ccui.RichText.createWithXML(textStr1);
        text.setPosition(this.dialogNode.getContentSize().width/2, this.dialogNode.getContentSize().height/2 + 80);
        this.dialogNode.addChild(text);

        var text2 = ccui.RichText.createWithXML(textStr2);
        text2.setPosition(text.x, text.y - 40);
        this.dialogNode.addChild(text2);
    },
    cancelButtonHandler : function () {
        this.hide();
    }
});