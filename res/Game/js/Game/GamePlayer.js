/**
 * Created by Quyet Nguyen on 7/27/2016.
 */
var GamePlayer = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setContentSize(cc.size(158,184));
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.isMe = false;

        this.infoLayer = new cc.Node();
        this.addChild(this.infoLayer);

        var avt = UserAvatar.createAvatar();
        avt.setPosition(this.getContentSize().width/2, 110);
        this.infoLayer.addChild(avt);

        var inviteBt = new ccui.Button("ingame_inviteBt.png","","", ccui.Widget.PLIST_TEXTURE);
        inviteBt.setPosition(avt.getPosition());
        this.addChild(inviteBt);

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Player", cc.TEXT_ALIGNMENT_CENTER);
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(this.getContentSize().width, userLabel.getLineHeight());
        userLabel.setPosition(this.getContentSize().width/2, 50);
        this.infoLayer.addChild(userLabel,1);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "1.000V", cc.TEXT_ALIGNMENT_CENTER);
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(this.getContentSize().width/2, 20);
        this.infoLayer.addChild(goldLabel,1);

        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
        this.inviteBt = inviteBt;

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
    showChatMessage : function (message) {

    },
    setGold : function (gold) {
        this.goldLabel.setString(cc.Global.NumberFormat1(gold));
    },
    setUsername : function (name) {
        this.userLabel.setString(name);
    },
    setEnable : function (enable) {
        if(enable){
            this.infoLayer.visible = true;
            this.inviteBt.visible = false;
        }
        else{
            this.infoLayer.visible = false;
            this.inviteBt.visible = true;
        }
    },
    showInviteDialog : function () {
       // cc.log("showInviteDialog");
    },
    showInfoDialog : function () {
       // cc.log("showInfoDialog");
    },
});

var GamePlayerMe = GamePlayer.extend({
    ctor : function () {
        cc.Node.prototype.ctor.call(this);
        this.isMe = true;

        this.setContentSize(cc.size(300, 100));
        this.setAnchorPoint(cc.p(0.5, 0.5));

        var avt = UserAvatar.createMe();
        avt.setPosition(60,50);
        this.addChild(avt);

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, PlayerMe.username, cc.TEXT_ALIGNMENT_LEFT);
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(194, userLabel.getLineHeight());
        userLabel.setPosition(107, 70);
        this.addChild(userLabel);

        var goldIcon = new cc.Sprite("#ingame-goldIcon.png");
        goldIcon.setPosition(120, 30);
        this.addChild(goldIcon);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "99.999.999V", cc.TEXT_ALIGNMENT_CENTER);
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(140, 30);
        this.addChild(goldLabel);

        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
    },
    setEnable : function (enable) {

    }
});