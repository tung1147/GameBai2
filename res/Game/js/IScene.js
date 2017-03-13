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
        this.addChild(this.sceneLayer, 0);

        this.popupLayer = new cc.Node();
        this.addChild(this.popupLayer, 100);

        this.messageLayer = new cc.Node();
        this.addChild(this.messageLayer, 101);
    },

    onExit : function () {
        this._super();
        this.popupLayer.removeAllChildren(true);
        this.messageLayer.removeAllChildren(true);
    }
});