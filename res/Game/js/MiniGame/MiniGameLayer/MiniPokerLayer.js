/**
 * Created by QuyetNguyen on 12/20/2016.
 */

var MiniPokerLayer = MiniGamePopup.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("#minipoker_bg.png");
        bg.setAnchorPoint(cc.p(0,0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(bg);

        this._boudingRect = cc.rect(30, 47, 930, 510);
    //    this.setScale(0.5);
    }
});