/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var IScene = cc.Scene.extend({
    sceneLayer:null,
    winSize:null,
    screenScale:null,
    ctor : function () {
        this._super();
        this.winSize = cc.winSize;
        this.screenScale = this.winSize.width / 1280.0;

        this.sceneLayer = new cc.Layer();
        this.addChild(this.sceneLayer);
    }
})