/**
 * Created by Quyet Nguyen on 7/11/2016.
 */
var SettingDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(600, 430));
        this.title.setString("Cài đặt");
       // this.closeButton.visible = false;
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        var soundLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Âm thanh");
        soundLabel.setAnchorPoint(cc.p(0.0, 0.5));
        soundLabel.setPosition(220, 380);
        this.dialogNode.addChild(soundLabel);

        var vibratorLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Rung");
        vibratorLabel.setAnchorPoint(soundLabel.getAnchorPoint());
        vibratorLabel.setPosition(soundLabel.x, soundLabel.y - 70);
        this.dialogNode.addChild(vibratorLabel);

        var inviteLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Nhận lời mời chơi");
        inviteLabel.setAnchorPoint(soundLabel.getAnchorPoint());
        inviteLabel.setPosition(vibratorLabel.x, vibratorLabel.y - 70);
        this.dialogNode.addChild(inviteLabel);

        var emailLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Email: " + GameConfig.email);
        emailLabel.setAnchorPoint(soundLabel.getAnchorPoint());
        emailLabel.setPosition(inviteLabel.x, inviteLabel.y - 70);
        this.dialogNode.addChild(emailLabel);

        var soundIcon = new cc.Sprite("#setting-sound-icon.png");
        soundIcon.setPosition(180, soundLabel.y);
        this.dialogNode.addChild(soundIcon);

        var vibratorIcon = new cc.Sprite("#setting-vibrator-icon.png");
        vibratorIcon.setPosition(soundIcon.x, vibratorLabel.y);
        this.dialogNode.addChild(vibratorIcon);

        var inviteIcon = new cc.Sprite("#setting-invite-icon.png");
        inviteIcon.setPosition(soundIcon.x, inviteLabel.y);
        this.dialogNode.addChild(inviteIcon);

        var emailIcon = new cc.Sprite("#setting-help-icon.png");
        emailIcon.setPosition(soundIcon.x, emailLabel.y);
        this.dialogNode.addChild(emailIcon);

        var soundOnOff = new newui.ButtonToggle("#setting-on.png","#setting-off.png");
        soundOnOff.setPosition(550, soundLabel.y);
        soundOnOff.onSelect = function (target,selected) {
            cc.Global.SetSetting("sound",selected);
        };
        this.dialogNode.addChild(soundOnOff);
        soundOnOff.select(cc.Global.GetSetting("sound",true));

        var vibratorOnOff = new newui.ButtonToggle("#setting-on.png","#setting-off.png");
        vibratorOnOff.setPosition(soundOnOff.x, vibratorLabel.y);
        vibratorOnOff.onSelect = function (target,selected) {
            cc.Global.SetSetting("vibrator",selected);
        };
        this.dialogNode.addChild(vibratorOnOff);
        vibratorOnOff.select(cc.Global.GetSetting("vibrator",true));

        var inviteOnOff = new newui.ButtonToggle("#setting-on.png","#setting-off.png");
        inviteOnOff.setPosition(soundOnOff.x, inviteLabel.y);
        inviteOnOff.onSelect = function (target,selected) {
            cc.Global.SetSetting("invite",selected);
        };
        this.dialogNode.addChild(inviteOnOff);
        inviteOnOff.select(cc.Global.GetSetting("invite",true));
    }
});