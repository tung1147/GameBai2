/**
 * Created by Quyet Nguyen on 7/11/2016.
 */
var SettingDialog = Dialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        this.initWithSize(cc.size(598, 378));
        this.title.setString("Cài đặt");
       // this.closeButton.visible = false;
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        var soundLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Âm thanh");
        soundLabel.setAnchorPoint(cc.p(1.0, 0.5));
        soundLabel.setPosition(349, 361);
        soundLabel.setColor(cc.color("#a6bde0"));
        this.addChild(soundLabel);

        var vibratorLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Rung");
        vibratorLabel.setAnchorPoint(soundLabel.getAnchorPoint());
        vibratorLabel.setPosition(soundLabel.x, soundLabel.y - 70);
        vibratorLabel.setColor(cc.color("#a6bde0"));
        this.addChild(vibratorLabel);

        var inviteLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Nhận lời mời chơi");
        inviteLabel.setAnchorPoint(soundLabel.getAnchorPoint());
        inviteLabel.setPosition(vibratorLabel.x, vibratorLabel.y - 70);
        inviteLabel.setColor(cc.color("#a6bde0"));
        this.addChild(inviteLabel);

        var emailLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, GameConfig.email);
        emailLabel.setAnchorPoint(cc.p(1.0, 0.5));
        emailLabel.setPosition(639, 134);
        emailLabel.setColor(cc.color("#4d5f7b"));
        this.addChild(emailLabel);

        var versionLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Ver " + SystemPlugin.getInstance().getVersionName());
        versionLabel.setAnchorPoint(cc.p(0.0, 0.5));
        versionLabel.setPosition(123, 134);
        versionLabel.setColor(cc.color("#4d5f7b"));
        this.addChild(versionLabel);

        var soundIcon = new cc.Sprite("#setting-sound-icon.png");
        soundIcon.setPosition(384, soundLabel.y);
        this.addChild(soundIcon);

        var vibratorIcon = new cc.Sprite("#setting-vibrator-icon.png");
        vibratorIcon.setPosition(soundIcon.x, vibratorLabel.y);
        this.addChild(vibratorIcon);

        var inviteIcon = new cc.Sprite("#setting-invite-icon.png");
        inviteIcon.setPosition(soundIcon.x, inviteLabel.y);
        this.addChild(inviteIcon);

        var emailIcon = new cc.Sprite("#setting-email-icon.png");
        emailIcon.setPosition(660, emailLabel.y);
        this.addChild(emailIcon);

        var soundOnOff = new newui.ButtonToggle("#setting-on.png","#setting-off.png");
        soundOnOff.setPosition(485, soundLabel.y);
        soundOnOff.onSelect = function (target,selected) {
            thiz._setSoundEnable(selected);
            if (!selected){
                SoundPlayer.stopAllSound();
            }
        };
        this.addChild(soundOnOff);

        var vibratorOnOff = new newui.ButtonToggle("#setting-on.png","#setting-off.png");
        vibratorOnOff.setPosition(soundOnOff.x, vibratorLabel.y);
        vibratorOnOff.onSelect = function (target,selected) {
            thiz._setVibratorEnable(selected);
        };
        this.addChild(vibratorOnOff);

        var inviteOnOff = new newui.ButtonToggle("#setting-on.png","#setting-off.png");
        inviteOnOff.setPosition(soundOnOff.x, inviteLabel.y);
        inviteOnOff.onSelect = function (target,selected) {
            thiz._setInviteEnable(selected);
        };
        this.addChild(inviteOnOff);

        this.soundOnOff = soundOnOff;
        this.vibratorOnOff = vibratorOnOff;
        this.inviteOnOff = inviteOnOff;

        this.soundIcon = soundIcon;
        this.vibratorIcon = vibratorIcon;
        this.inviteIcon = inviteIcon;
    },

    _setSoundEnable : function (enable, force) {
        cc.Global.SetSetting("sound",enable);
        this.soundIcon.setSpriteFrame(enable ? "setting-sound-icon-2.png" : "setting-sound-icon.png");
        if(force){
            this.soundOnOff.select(enable);
        }
    },

    _setVibratorEnable : function (enable, force) {
        cc.Global.SetSetting("vibrator",enable);
        this.vibratorIcon.setSpriteFrame(enable ? "setting-vibrator-icon-2.png" : "setting-vibrator-icon.png");
        if(force){
            this.vibratorOnOff.select(enable);
        }
    },

    _setInviteEnable : function (enable, force) {
        cc.Global.SetSetting("invite",enable);
        this.inviteIcon.setSpriteFrame(enable ? "setting-invite-icon-2.png" : "setting-invite-icon.png");
        if(force){
            this.inviteOnOff.select(enable);
        }
    },

    onEnter : function () {
        this._super();

        this._setSoundEnable(cc.Global.GetSetting("sound",true), true);
        this._setVibratorEnable(cc.Global.GetSetting("vibrator",true), true);
        this._setInviteEnable(cc.Global.GetSetting("invite",true), true);
    }
});