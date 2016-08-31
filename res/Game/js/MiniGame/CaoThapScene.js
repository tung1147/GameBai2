/**
 * Created by Quyet Nguyen on 8/30/2016.
 */

var CaoThapScene = MiniGameScene.extend({
    ctor : function () {
        this._super();

        this.initAvatarMe();
        this.initButton();
        this.initChip(cc.winSize.width/2);
    }
});