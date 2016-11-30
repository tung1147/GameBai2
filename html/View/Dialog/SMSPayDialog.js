/**
 * Created by VGA10 on 9/28/2016.
 */

var SMSPayDialog = Dialog.extend({
    ctor: function () {
        this._super();
        this.initWithSize(cc.size(600, 450));
        this.title.setString("Chọn nhà mạng");
      //  this.closeButton.visible = false;
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        this.selectedTelCo = {};
        this.bundleId = 0;
        this.smsSyntax = "";
        var thiz = this;

        var viettelBt = new ccui.Button("dialog-button-2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        viettelBt.setScale9Enabled(true);
        viettelBt.setCapInsets(cc.rect(10, 10, 4, 4));
        viettelBt.setContentSize(170, 60);
        viettelBt.setPosition(210, 390);
        var viettelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "VIETTEL");
        viettelLabel.setPosition(viettelBt.width / 2, viettelBt.height / 2);
        viettelBt.getRendererNormal().addChild(viettelLabel);
        viettelBt.select = function () {
            viettelBt.loadTextureNormal("dialog-button-1.png", ccui.Widget.PLIST_TEXTURE);
        };
        viettelBt.deselect = function () {
            viettelBt.loadTextureNormal("dialog-button-2.png", ccui.Widget.PLIST_TEXTURE);
        };
        viettelBt.addClickEventListener(function () {
            thiz.selectTelCo(0);
        });
        this.dialogNode.addChild(viettelBt);
        this.viettelBt = viettelBt;

        var mobiBt = new ccui.Button("dialog-button-2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        mobiBt.setScale9Enabled(true);
        mobiBt.setCapInsets(cc.rect(10, 10, 4, 4));
        mobiBt.setContentSize(170, 60);
        mobiBt.setPosition(400, 390);
        var mobiLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "MOBIFONE");
        mobiLabel.setPosition(mobiBt.width / 2, mobiBt.height / 2);
        mobiBt.getRendererNormal().addChild(mobiLabel);
        mobiBt.select = function () {
            mobiBt.loadTextureNormal("dialog-button-1.png", ccui.Widget.PLIST_TEXTURE);
        };
        mobiBt.deselect = function () {
            mobiBt.loadTextureNormal("dialog-button-2.png", ccui.Widget.PLIST_TEXTURE);
        };
        mobiBt.addClickEventListener(function () {
            thiz.selectTelCo(1);
        });
        this.dialogNode.addChild(mobiBt);
        this.mobiBt = mobiBt;

        var vinaBt = new ccui.Button("dialog-button-2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        vinaBt.setScale9Enabled(true);
        vinaBt.setCapInsets(cc.rect(10, 10, 4, 4));
        vinaBt.setContentSize(170, 60);
        vinaBt.setPosition(590, 390);
        var vinaLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "VINAPHONE");
        vinaLabel.setPosition(vinaBt.width / 2, vinaBt.height / 2);
        vinaBt.getRendererNormal().addChild(vinaLabel);
        vinaBt.select = function () {
            vinaBt.loadTextureNormal("dialog-button-1.png", ccui.Widget.PLIST_TEXTURE);
        };
        vinaBt.deselect = function () {
            vinaBt.loadTextureNormal("dialog-button-2.png", ccui.Widget.PLIST_TEXTURE);
        };
        vinaBt.addClickEventListener(function () {
            thiz.selectTelCo(2);
        });
        this.dialogNode.addChild(vinaBt);
        this.vinaBt = vinaBt;

        var smsTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "Gửi tin nhắn");
        smsTitle.setPosition(this.dialogNode.getContentSize().width/2, 300);
        this.dialogNode.addChild(smsTitle);

        var smsContent = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "SMS Content");
        smsContent.setColor(cc.color("#4297b0"));
        smsContent.setPosition(this.dialogNode.getContentSize().width/2, 250);
        this.dialogNode.addChild(smsContent);
        this.smsContent = smsContent;

        var smsGateway = cc.Global.SMSList[0].smsGateway;
        var smsPhoneNumber = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "Đến đầu số "+smsGateway);
        smsPhoneNumber.setPosition(this.dialogNode.getContentSize().width/2, 200);
        this.dialogNode.addChild(smsPhoneNumber);

        this.selectTelCo(0);
    },

    selectTelCo: function (telcoIndex) {
        if (this.selectedTelCo instanceof ccui.Button) {
            this.selectedTelCo.deselect();
        }
        switch (telcoIndex) {
            case 0:
                this.selectedTelCo = this.viettelBt;
                break;
            case 1:
                this.selectedTelCo = this.mobiBt;
                break;
            case 2:
                this.selectedTelCo = this.vinaBt;
                break;
        }

        this.selectedTelCo.select();
        this.buildSMSSyntax(this.bundleId,telcoIndex);
    },
    buildSMSSyntax: function (index, telco) {
        var syntax = "";
        switch (telco) {
            case 0:
                syntax = cc.Global.SMSList[index].vttContent.replace('username', PlayerMe.username);
                break;
            case 1:
                syntax = cc.Global.SMSList[index].vmsContent.replace('username', PlayerMe.username);
                break;
            case 2:
                syntax = cc.Global.SMSList[index].vnpContent.replace('username', PlayerMe.username);
        }
        this.smsContent.setString(syntax);

        // this.smsSyntax = syntax;
        // var smsHint = "<font face='" + cc.res.font.Roboto_Condensed + "' size='25'>" + "Cú pháp " +
        //     "<font color='#ffde00'>" + syntax
        //     + "</font>" + " gửi " + "<font color='#ffde00'>" + cc.Global.SMSList[0].smsGateway + "</font></font>";
        //
        // if (this.smsLabel)
        //     this.smsLabel.removeFromParent(true);
        // this.smsLabel = ccui.RichText.createWithXML(smsHint, {});
        // this.smsLabel.setPosition(400, 260);
        // this.dialogNode.addChild(this.smsLabel);
    }
});