/**
 * Created by QuyetNguyen on 11/25/2016.
 */

var LobbyRoomCell = ccui.Widget.extend({
    ctor : function () {
        this._super();
        var bg = new cc.Sprite("#lobby-roomBg.png");
        this.setContentSize(bg.getContentSize());
        bg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(bg);

        this.allSlot = [];
        this.slot = null;
        this.initSlot(2);
        this.initSlot(4);
        this.initSlot(5);
        this.initSlot(9);

        var bettingLabel = new cc.LabelBMFont("1.000.000", cc.res.font.Roboto_CondensedBold_25);
        bettingLabel.setPosition(bg.x, bg.y - 2);
        bettingLabel.setColor(cc.color("#ffde00"));
        this.addChild(bettingLabel);
        this.bettingLabel = bettingLabel;
    },
    initSlot : function (maxSlot) {
        var slotNode = new cc.Node();
        this.addChild(slotNode);
        this.allSlot.push(slotNode);
        slotNode.maxSlot = maxSlot;
        slotNode.allSlot = [];

        var emptySprite = new cc.Sprite("#slot-empty-" + maxSlot + ".png");
        emptySprite.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        slotNode.addChild(emptySprite);

        for(var i=0;i<maxSlot;i++){
            var activeSprite = new cc.Sprite("#slot-active-" + maxSlot +"-" + (i + 1) + ".png");
            activeSprite.setPosition(emptySprite.getPosition());
            slotNode.addChild(activeSprite);
            slotNode.allSlot.push(activeSprite);
        }
    },

    setMaxSlot : function (maxSlot) {
        this.slot = null;

        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].maxSlot == maxSlot){
                this.slot = this.allSlot[i].allSlot;
                this.allSlot[i].visible = true;
            }
            else{
                this.allSlot[i].visible = false;
            }
        }

        if(this.slot){

        }
    },
    setBetting : function (betting) {
        if(this.bettingLabel){
            this.bettingLabel.setString(cc.Global.NumberFormat1(betting));
        }
    },
    setUserCount : function (userCount) {
        if(userCount > 9){
            if(userCount == 30){
                userCount = 9;
            }
            else{
                userCount = 8;
            }
        }

        if(this.slot){
            for(var i=0;i<this.slot.length;i++){
                if(i < userCount){
                    this.slot[i].visible = true;
                }
                else{
                    this.slot[i].visible = false;
                }
            }
        }
    }
});

LobbyRoomCell.createCell = function (maxSlot) {
    var cell = new LobbyRoomCell();
    cell.setMaxSlot(maxSlot);
    return cell;
};
