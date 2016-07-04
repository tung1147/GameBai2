/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var HomeScene = IScene.extend({
    homeLayer:null,
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this.sceneLayer.addChild(bg);

       // this.homeLayer = new HomeLayer();
        //this.sceneLayer.addChild(this.homeLayer);

        this.topBar = new LobbyTopBar();
        this.sceneLayer.addChild(this.topBar);

        this.userInfo = new LobbyBottomBar();
        this.sceneLayer.addChild(this.userInfo);
    }


});