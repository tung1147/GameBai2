/**
 * Created by QuyetNguyen on 12/1/2016.
 */

var WebSprite = cc.Node.extend({
    ctor : function (sprite) {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this._fixSize = false;

        if(sprite){
            var imgSprite = new cc.Sprite(sprite);
            this.setContentSize(imgSprite.getContentSize());
            imgSprite.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        }
    },

    setFixSize : function (size) {
        this._fixSize = true;
        this.setContentSize(size);
    },

    reloadFromURL : function (url) {
        cc.loader.loadImg(url, function () {
            cc.log("request from url");
        });
    }
});