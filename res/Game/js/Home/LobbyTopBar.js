/**
 * Created by Quyet Nguyen on 7/1/2016.
 */
var LobbyTopBar = cc.Node.extend({
    ctor : function () {
        this._super();

        this.settingBt = new ccui.Button("home-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.settingBt.setPosition(60, cc.winSize.height - 60);
        this.addChild(this.settingBt);

        this.rankBt = new ccui.Button("home-rankBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.rankBt.setPosition(cc.winSize.width -  this.settingBt.x, this.settingBt.y);
        this.addChild(this.rankBt);
    }
});