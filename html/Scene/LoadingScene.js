/**
 * Created by QuyetNguyen on 11/9/2016.
 */


cc.director.replaceScene = cc.director.replaceScene || function (scene) {
    cc.director.runScene(scene);
};

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        var label = new ccui.Text("Quyết đẹp trai", "arial", 30);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height/2;
        this.title = label;
        this.addChild(label);

        this.gameLaucher = new GameLaucher();
    },

    onEnter : function () {
        this._super();
        if(cc.game.CC_DEBUG_ENABLE){
            cc.loader.resPath = "res/Game";
        }
        else{
            cc.loader.resPath = "";
        }
        this.schedule(this.startLoadResources, 0.3);
    },
    onExit : function () {
        this._super();
        this.gameLaucher.stop();
        this.gameLaucher = null;
    },
    startLoadResources : function () {
        this.unschedule(this.startLoadResources);
        this.gameLaucher.start();
    },

    nextScene : function () {
        cc.director.replaceScene(new HomeScene());
    },

    updateLoadResources : function (current, target) {
        cc.log("updateLoadResources: "+current +"/"+target);
    },
    updateLoadTexture : function (current, target) {
        cc.log("updateLoadTexture: "+current +"/"+target);
    },
    onUpdateStatus : function (status) {
        cc.log("onUpdateStatus: "+status);
        if(status == LaucherStatus.OnLoadFinished){
            this.nextScene();
        }
    }
});