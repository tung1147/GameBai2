/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

require("js/Game/XocDiaChip.js");

var s_xocdia_slot_type = s_xocdia_slot_type || [1,1,2,2,2,2,2];
var s_xocdia_slot_id = s_xocdia_slot_id || [1,2,3,4,5,6,7];
var s_xocdia_slot_position = s_xocdia_slot_position || [
        {x : 340, y : 434},
        {x : 940, y : 434},
        {x : 300, y : 230},
        {x : 470, y : 230},
        {x : 640, y : 230},
        {x : 810, y : 230},
        {x : 980, y : 230}
];

var XocDiaBettingSlot = cc.Node.extend({
    ctor : function (slotIndex, parentNode) {
        this._super();
        var type = s_xocdia_slot_type[slotIndex];
        if(type == 1){
            this.initType1(slotIndex, parentNode);
        }
        else {
            this.initType2(slotIndex, parentNode);
        }

        var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "100.000 V");
        label1.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        label1.setColor(cc.color("#ffde00"));
        this.addChild(label1);

        var label2 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "100.000 V");
        label2.setPosition(this.getContentSize().width/2, label1.y - 40);
        this.addChild(label2);

        //add Touch
        var rectTouch = cc.rect(0,0, this.getContentSize().width, this.getContentSize().height);
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if(cc.rectContainsPoint(rectTouch, p)){
                    if(thiz.onTouchSlot){
                        thiz.onTouchSlot(s_xocdia_slot_id[slotIndex]);
                    }
                    return true;
                }
                return false;
            },
        }, this);
    },
    initType1 : function (slotIndex, parentNode) {
        var bg = ccui.Scale9Sprite.createWithSpriteFrameName("xocdia-bg-1.png", cc.rect(16,16,4,4));
        bg.setPreferredSize(cc.size(240,160));

        this.setContentSize(bg.getContentSize());
        bg.setPosition(cc.p(0,0));
        bg.setAnchorPoint(cc.p(0,0));
        this.addChild(bg);

        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(s_xocdia_slot_position[slotIndex]);
        parentNode.addChild(this);
    },
    initType2 : function (slotIndex, parentNode) {
        var bg = ccui.Scale9Sprite.createWithSpriteFrameName("xocdia-bg-2.png", cc.rect(38,38,4,4));
        bg.setPreferredSize(cc.size(160,160));

        this.setContentSize(bg.getContentSize());
        bg.setPosition(cc.p(0,0));
        bg.setAnchorPoint(cc.p(0,0));
        this.addChild(bg);

        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(s_xocdia_slot_position[slotIndex]);
        parentNode.addChild(this);
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
        this.initChipButton();
    },
    initBettingSlot : function () {
        this.bettingSlot = [];
        var xocdiaNode = new cc.Node();
        xocdiaNode.setPosition(cc.p(0,0));
        this.sceneLayer.addChild(xocdiaNode);

        for(var i=0;i<7;i++){
            var slot = new XocDiaBettingSlot(i, xocdiaNode);
            slot.onTouchSlot = function (slotId) {
                cc.log("touchSlot: "+slotId);
            };
            this.bettingSlot[i] = slot;
        }
    },
    initChipButton : function () {
        var chipGroup = new ChipGroup();
        this.sceneLayer.addChild(chipGroup);
        this.chipGroup = chipGroup;
        var centerPosition = cc.winSize.width/2;

        var chip1 = new XocDiaChip(1);
        chip1.setPosition(centerPosition - 255.0 * cc.winSize.screenScale , 30.0 * cc.winSize.screenScale);
        chip1.setScale(cc.winSize.screenScale);
        chip1.originPoint = chip1.getPosition();
        chipGroup.addChip(chip1);

        var chip2 = new XocDiaChip(2);
        chip2.setPosition(centerPosition - 85.0 * cc.winSize.screenScale, chip1.y);
        chip2.setScale(cc.winSize.screenScale);
        chip2.originPoint = chip2.getPosition();
        chipGroup.addChip(chip2);

        var chip3 = new XocDiaChip(3);
        chip3.setPosition(centerPosition + 85.0 * cc.winSize.screenScale, chip1.y);
        chip3.setScale(cc.winSize.screenScale);
        chip3.originPoint = chip3.getPosition();
        chipGroup.addChip(chip3);

        var chip4 = new XocDiaChip(4);
        chip4.setPosition(centerPosition + 255.0 *cc.winSize.screenScale, chip1.y);
        chip4.setScale(cc.winSize.screenScale);
        chip4.originPoint = chip4.getPosition();
        chipGroup.addChip(chip4);
    },
    onSFSExtension : function (messageType, content){
        this._super();

    },

    onEnter : function () {
        this._super();
        this.chipGroup.selectChipAtIndex(0, true);
    },
    /*ignore*/
    processPlayerPosition : function () {

    },
    updateOwner : function () {

    }
});