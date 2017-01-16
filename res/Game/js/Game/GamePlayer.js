/**
 * Created by Quyet Nguyen on 7/27/2016.
 */
var GamePlayer = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setContentSize(cc.size(158, 184));
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.isMe = false;
        this.username = "";
        this.gold = 0;

        this.infoLayer = new cc.Node();
        this.addChild(this.infoLayer);

        var avt = UserAvatar.createAvatar();
        avt.setPosition(this.getContentSize().width / 2, 110);
        this.infoLayer.addChild(avt);

        var chatView = new PlayerMessageView();
        chatView.setPosition(avt.getPosition());
        this.infoLayer.addChild(chatView, 10);
        this.chatView = chatView;

        var timer = new cc.ProgressTimer(new cc.Sprite("#player-progress-2.png"));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer.setPosition(avt.getPosition());
        timer.setPercentage(100.0);
        this.infoLayer.addChild(timer);
        this.timer = timer;

        var timer2 = new cc.ProgressTimer(new cc.Sprite("#player-progress-1.png"));
        timer2.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer2.setReverseDirection(true);
        timer2.setPosition(avt.getPosition());
        timer2.setPercentage(0.0);
        this.infoLayer.addChild(timer2);
        this.timer2 = timer2;

        var inviteBt = new ccui.Button("ingame_inviteBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        inviteBt.setPosition(avt.getPosition());
        this.addChild(inviteBt);

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Player", cc.TEXT_ALIGNMENT_CENTER);
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(this.getContentSize().width, userLabel.getLineHeight());
        userLabel.setPosition(this.getContentSize().width / 2, 50);
        this.infoLayer.addChild(userLabel, 1);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "1.000V", cc.TEXT_ALIGNMENT_CENTER);
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(this.getContentSize().width / 2, 20);
        this.infoLayer.addChild(goldLabel, 1);

        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
        this.inviteBt = inviteBt;
        this.avt = avt;

        var thiz = this;
        inviteBt.addClickEventListener(function () {
            thiz.showInviteDialog();
        });
        var infoBt = new ccui.Widget();
        infoBt.setContentSize(avt.getContentSize());
        infoBt.setPosition(avt.getPosition());
        this.infoLayer.addChild(infoBt);
        infoBt.setTouchEnabled(true);
        infoBt.addClickEventListener(function () {
            thiz.showInfoDialog();
        });
        this.setEnable(true);
    },
    showChatMessage: function (message) {

    },
    setGold: function (gold) {
        this.goldLabel.setString(cc.Global.NumberFormat1(gold));
        this.gold = gold;
    },
    setUsername: function (name) {
        this.username = name;
        if (name.length > 3 && this.isMe == false)
            name = name.substring(0, name.length - 3) + "***";
        this.userLabel.setString(name);
    },
    setEnable: function (enable) {
        // this._isEnable = enable;
        if (enable) {
            this.infoLayer.visible = true;
            this.inviteBt.visible = false;
        }
        else {
            this.username = "";
            this.spectator = false;
            this.infoLayer.visible = false;
            this.inviteBt.visible = true;
        }
    },
    showInviteDialog: function () {
        // cc.log("showInviteDialog");
        var dialog = new InviteDialog();
        dialog.show();
    },
    showInfoDialog: function () {
        // cc.log("showInfoDialog");
        var dialog = new UserDialog();
        dialog.setUsername(this.username);
        dialog.setGold(this.gold);
        if (this.avt) {
            dialog.setAvatar(this.avt.avatarId);
        }
        dialog.showWithAnimationScale();
    },
    setAvatar: function (avtId) {
        if (this.avt) {
            this.avt.serAvatarId(avtId);
        }
    },
    runChangeGoldEffect: function (gold) {
        var goldNumber = gold;
        if (typeof gold === "string") {
            goldNumber = parseInt(gold);
        }
        var strGold = cc.Global.NumberFormat1(Math.abs(goldNumber)) + "V";
        if (gold >= 0) {
            strGold = "+" + strGold;
        }
        else {
            strGold = "-" + strGold;
        }
        var labelEffect = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, strGold);
        if (gold >= 0) {
            labelEffect.setColor(cc.color("#ffde00"));
        }
        else {
            labelEffect.setColor(cc.color("#ff0000"));
        }
        labelEffect.setPosition(this.userLabel.getPosition());
        this.infoLayer.addChild(labelEffect, 10);

        var effectDuration = 2.0;
        var moveAction = new cc.MoveBy(effectDuration, cc.p(0.0, 100.0));
        var finishedAction = new cc.CallFunc(function () {
            labelEffect.removeFromParent(true);
        });
        labelEffect.runAction(new cc.Sequence(moveAction, finishedAction));
    },
    showTimeRemain: function (currentTime, maxTime) {
        var startValue = 100.0 * (currentTime / maxTime);
        // var deltaValue = 100.0 - startValue;
        this.setProgressPercentage(startValue);
        var thiz = this;
        var action = new quyetnd.ActionTimer(currentTime, function (dt) {
            thiz.setProgressPercentage((1.0 - dt) * startValue);
        });
        if (this.timer) {
            this.timer.stopAllActions();
            this.timer.runAction(action);
        }
    },
    setProgressPercentage: function (percentage) {
        this.timer.setPercentage(100.0 - percentage);
        this.timer2.setPercentage(percentage);
    },
    stopTimeRemain: function () {
        if (this.timer) {
            this.timer.stopAllActions();
            this.setProgressPercentage(0.0);
        }
    }
});

var GamePlayerMe = GamePlayer.extend({
    ctor: function () {
        cc.Node.prototype.ctor.call(this);
        this.isMe = true;
        this.infoLayer = new cc.Node();
        this.addChild(this.infoLayer);

        this.setContentSize(cc.size(300, 100));
        this.setAnchorPoint(cc.p(0.5, 0.5));

        var avt = UserAvatar.createMe();
        avt.setPosition(60, 50);
        this.infoLayer.addChild(avt);

        var chatView = new PlayerMessageView();
        chatView.setPosition(avt.getPosition());
        chatView.setAnchorPoint(cc.p(0.0, 0.0));
        this.infoLayer.addChild(chatView, 10);
        this.chatView = chatView;

        var timer = new cc.ProgressTimer(new cc.Sprite("#player-progress-2.png"));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer.setPosition(avt.getPosition());
        timer.setPercentage(100.0);
        this.infoLayer.addChild(timer);
        this.timer = timer;

        var timer2 = new cc.ProgressTimer(new cc.Sprite("#player-progress-1.png"));
        timer2.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer2.setReverseDirection(true);
        timer2.setPosition(avt.getPosition());
        timer2.setPercentage(0.0);
        this.infoLayer.addChild(timer2);
        this.timer2 = timer2;

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, PlayerMe.username, cc.TEXT_ALIGNMENT_LEFT);
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(194, userLabel.getLineHeight());
        userLabel.setPosition(107, 70);
        this.infoLayer.addChild(userLabel);

        var goldIcon = new cc.Sprite("#ingame-goldIcon.png");
        goldIcon.setPosition(120, 30);
        this.infoLayer.addChild(goldIcon);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "99.999.999V", cc.TEXT_ALIGNMENT_CENTER);
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(140, 30);
        this.infoLayer.addChild(goldLabel);

        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
        this.avt = avt;
    },
    onEnter: function () {
        this._super();
        this.setGold(PlayerMe.gold);
    },
    setEnable: function (enable) {

    }
});

var PlayerMessageView = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));

        var bg = new ccui.Scale9Sprite("ingame-chat-bg.png", cc.rect(20, 20, 4, 4));
        bg.setPreferredSize(cc.size(100, 100));
        this.setContentSize(bg.getContentSize());
        this.addChild(bg);
        bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.bg = bg;

        var label = new cc.LabelBMFont("Message", cc.res.font.Roboto_Condensed_25, 300, cc.TEXT_ALIGNMENT_CENTER);
        label.setPosition(bg.getPosition());
        this.addChild(label);
        this.label = label;

        this.setVisible(false);
    },

    show: function (message) {
        this.setVisible(true);
        this.stopAllActions();

        var thiz = this;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(5.0),
            new cc.CallFunc(function () {
                thiz.setVisible(false);
            })
        ));

        this.label.setString(message);
        this.bg.setPreferredSize(cc.size(this.label.getContentSize().width + 40, this.label.getContentSize().height + 20));
        this.setContentSize(this.bg.getContentSize());
        this.bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.label.setPosition(this.bg.getPosition());
    }
});