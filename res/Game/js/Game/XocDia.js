/**
 * Created by Quyet Nguyen on 7/25/2016.
 */


var s_xocdia_slot_type = s_xocdia_slot_type || [1,1,2,2,2,2,2];
var s_xocdia_slot_id = s_xocdia_slot_id || [1,2,3,4,5,6,7];
var s_xocdia_slot_position = s_xocdia_slot_position || [
        {x : 10, y : 10},
        {x : 10, y : 10},
        {x : 10, y : 10},
        {x : 10, y : 10},
        {x : 10, y : 10},
        {x : 10, y : 10},
        {x : 10, y : 10}
];

var XocDiaBettingSlot = cc.Node.extend({
    ctor : function (slotIndex, parentNode) {
        this._super();

    },
    runWinEffect : function () {

    },
    reset : function () {

    },
    testFunc : function (param) {

    }
});



var XocDiaScene = IGameScene.extend({
    ctor : function () {
        this._super();

        /* init me */
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        this.sceneLayer.addChild(playerMe,1);
        this.playerView = [playerMe];

        this.initBettingSlot();
    },
    initBettingSlot : function () {
        this.bettingSlot = [];
        var xocdiaNode = new cc.Node();
        this.sceneLayer.addChild(xocdiaNode);

        for(var i=0;i<7;i++){
            var slot = new XocDiaBettingSlot(i, xocdiaNode);
            this.bettingSlot[i] = slot;
        }
    },
    onSFSExtension : function (messageType, content){
        this._super();

    },

    /**/
    processPlayerPosition : function () {

    },
    updateOwner : function () {

    }
});