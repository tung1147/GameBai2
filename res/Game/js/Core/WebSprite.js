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
            this.addChild(imgSprite);
            this.imgSprite = imgSprite;
        }
    },

    initFromTexture : function (texture) {
        if(this.imgSprite){
            this.imgSprite.removeFromParent(true);
            this.imgSprite = null;
        }

        var imgSprite = new cc.Sprite(texture);
        if(this._fixSize){
            var ratioX = this.getContentSize().width / imgSprite.getContentSize().width;
            var ratioY = this.getContentSize().width / imgSprite.getContentSize().width;
            var ratio = ratioX < ratioY ? ratioX : ratioY;
            if(ratio < 1.0){
                imgSprite.setScale(ratio);
            }
        }
        else{
            this.setContentSize(imgSprite.getContentSize());
        }

        imgSprite.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(imgSprite);
        this.imgSprite = imgSprite;
    },

    setFixSize : function (size) {
        this._fixSize = true;
        this.setContentSize(size);
    },

    reloadFromURL : function (url) {
        var thiz = this;

        if(cc.sys.isNative){

        }
        else{
            url = "http://125.212.192.5/images/sonyx-1o.png";
            cc.loader.loadImg(url, function (err, texture) {
                thiz.initFromTexture(texture);
            });
        }
    }
});