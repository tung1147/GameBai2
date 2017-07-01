/**
 * Created by QuyetNguyen on 11/9/2016.
 */

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        var bg = new cc.Sprite("res/loading_bg.jpg");
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(bg);

        this._loadingBarPercentage = 0.0;
        var loadingBar = new cc.ProgressTimer(new cc.Sprite("res/lg_separator_load.png"));
        loadingBar.setType(cc.ProgressTimer.TYPE_BAR);
        loadingBar.setMidpoint(cc.p(0.0, 0.5));
        loadingBar.setBarChangeRate(cc.p(1.0, 0.0));
        loadingBar.setPosition(cc.winSize.width/2, 130);
        this.addChild(loadingBar,2);
        this.loadingBar = loadingBar;
        loadingBar.setPercentage(50);
        loadingBar.setVisible(false);

        var loadingBarBg = new cc.Sprite("res/lg_bg_load.png");
        loadingBarBg.setPosition(loadingBar.getContentSize().width/2, loadingBar.getContentSize().height/2);
        loadingBar.addChild(loadingBarBg, -1);
        
        var label = new cc.LabelTTF("", "arial", 20);
        label.setPosition(cc.winSize.width/2, 200);
        this.title = label;
        this.addChild(label);

        this.gameLaucher = new GameLaucher();
    },

    onEnter : function () {
        cc.director.replaceScene = cc.director.replaceScene || function (scene) {
            cc.director.runScene(scene);
        };

        this._super();
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
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL){
            var tex = cc.textureCache.getTextureForKey("res/Card.png");
            tex.generateMipmap();
            tex.setAntiAliasTexParameters();
            tex.setTexParameters(gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);
        }

        this.backgroundLoading();
        cc.director.replaceScene(new HomeScene());
        //cc.director.replaceScene(new Phom());
    },

    updateLoadResources : function (current, target) {
        cc.log("updateLoadResources: "+current +"/"+target);
        this.title.setString("Đang tải tài nguyên ["+ Math.round(current / target * 100) + "%]");
        this.loadingBar.setVisible(true);
        this.loadingBar.setPercentage(100 * current / target);
    },

    onUpdateStatus : function (status) {
        cc.log("onUpdateStatus: "+status);
        if(status === LaucherStatus.OnLoadFinished){
            this.nextScene();
        }
    },

    backgroundLoading : function () {
        setTimeout(function () {
            cc.loader.load(s_sound,
                function (result, count, loadedCount) {

                }, function () {

                });
        }, 1000);
    },
});