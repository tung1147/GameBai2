/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var IScene = cc.Scene.extend({
    sceneLayer:null,
    popupLayer:null,
    winSize:null,
    screenScale:null,
    ctor : function () {
        this._super();
        this.type = "IScene";
        this.winSize = cc.winSize;
        this.screenScale = this.winSize.width / 1280.0;

        this.sceneLayer = new cc.Node();
        this.addChild(this.sceneLayer);

        this.popupLayer = new cc.Node();
        this.addChild(this.popupLayer);
    },

    onExit : function () {
        this._super();
        this.popupLayer.removeAllChildren(true);
    }
})