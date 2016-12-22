/**
 * Created by anhvt on 12/21/2016.
 */

var MiniLayerChip = ChipButton.extend({
    ctor : function (index) {
        this._super();

        var normalSprite = new cc.Sprite("#minilayer-chip-"+index+".png");
        var selectedSprite = new cc.Sprite("#minilayer-chipSelected-"+index+".png");
        this.addChild(normalSprite);
        this.addChild(selectedSprite);
        this.normalSprite = normalSprite;
        this.selectedSprite = selectedSprite;
        this.chipIndex = index;

        var s = normalSprite.getContentSize();
        this.rectTouch = cc.rect(-s.width/2, -s.height/2, s.width, s.height);

        selectedSprite.visible = false;
    },
    select : function (isForce) {
        this._super();
        this.normalSprite.visible = false;
        this.selectedSprite.visible = true;
    },
    unSelect : function (isForce) {
        this._super();
        this.normalSprite.visible = true;
        this.selectedSprite.visible = false;
    }
});