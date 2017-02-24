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

    _setAvatar : function (avatarImg) {
        this.avatarImg.setSpriteFrame(avatarImg);
        var size = this.avatarImg.getContentSize();

        //scale down
        this.avatarImg.setScale(60/size.width);
        size.width = size.height = 60;
        //end of scale down

        this.setContentSize(size);
        this.avatarImg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
    },

    serAvatarId : function (avatarId) {
        this.avatarId = avatarId;
        if(avatarId >= 1 && avatarId <= 20){
            this._setAvatar("avatar"+ avatarId+".png");
        }
        else{
            this._setAvatar("avatarDefault.png");
        }
    }
});

UserAvatar.createMe = function () {
    var avt = new UserAvatar();
    avt.serAvatarId(PlayerMe.avatar);
    return avt;
};

UserAvatar.createAvatar = function () {
    var avt = new UserAvatar();
    avt.serAvatarId(0);
    return avt;
};

UserAvatar.createAvatarWithId = function (avatarId) {
    var avt = new UserAvatar();
    avt.serAvatarId(avatarId);
    return avt;
};
