/**
 * Created by Quyet Nguyen on 7/16/2016.
 */

var UserAvatar = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.avatarId = 0;

        var avatarImg = new cc.Sprite();
        this.addChild(avatarImg);
        this.avatarImg = avatarImg;
    },

    setAvatar : function (avatarImg) {
        this.avatarImg.setSpriteFrame(avatarImg);
        this.setContentSize(this.avatarImg.getContentSize());
        this.avatarImg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
    },

    serAvatarId : function (avatarId) {
        this.avatarId = avatarId;
        var idx = 1 + (avatarId % 20);
        this.setAvatar("avatar"+ idx+".png");
    }
});

UserAvatar.createMe = function () {
    var avt = new UserAvatar();
    avt.serAvatarId(PlayerMe.avatar);
   // avt.setAvatar("lobby-avt.png");
    return avt;
};

UserAvatar.createAvatar = function () {
    var avt = new UserAvatar();
    avt.setAvatar("lobby-avt.png");
    return avt;
};

UserAvatar.createAvatarWithId = function (avatarId) {
    var avt = new UserAvatar();
    avt.serAvatarId(avatarId);
   // avt.setAvatar("lobby-avt.png");
    return avt;
};
