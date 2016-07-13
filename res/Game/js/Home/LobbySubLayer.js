/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var LobbySubLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var topBar = new cc.Node();
        topBar.setContentSize(cc.size(1280.0, 720.0));
        topBar.setPosition(cc.p(0.0, 720.0));
        topBar.setAnchorPoint(cc.p(0.0, 1.0));
        this.addChild(topBar);
        topBar.setScale(cc.winSize.screenScale);

        var bg = new cc.Sprite("#home-top-bar.png");
        bg.setAnchorPoint(0.0, 1.0);
        bg.setPosition(0.0, cc.winSize.height);
        topBar.addChild(bg);

        this.backBt = new ccui.Button("home-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.backBt.setPosition(65, 653);
        topBar.addChild(this.backBt);

        this.settingBt = new ccui.Button("home-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.settingBt.setPosition(1220, this.backBt.y);
        topBar.addChild(this.settingBt);
    }
});