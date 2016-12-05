/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

var s_xocdia_slot_id = s_xocdia_slot_id || [0,1,2,3,4,5,6];
var s_xocdia_slot_position = s_xocdia_slot_position || [
        {x : 271, y : 407},
        {x : 1011, y : 407},
        {x : 150, y : 215},
        {x : 395, y : 215},
        {x : 640, y : 215},
        {x : 885, y : 215},
        {x : 1130, y : 215}
];

var XocDiaBettingSlot = cc.Node.extend({
    ctor : function (idx, parentNode) {
        this._super();
        this._chipNode = new cc.Node();
        this.addChild(this._chipNode);
        this._slotGold = 0;
        this._userGold = 0;

        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(s_xocdia_slot_position[idx]);

        var bg = new cc.Sprite("#xocdia_slot_" + (idx + 1)+".png");
        this.bg = bg;
        this.setContentSize(bg.getContentSize());
        bg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(bg);

        if(idx < 2){
            var slotGoldLabel = new cc.LabelBMFont("10.00.000", cc.res.font.Roboto_Condensed_25);
            slotGoldLabel.setColor(cc.color("#392d2e"));
            slotGoldLabel.setPosition(this.x - this.getContentSize().width/4, this.y - this.getContentSize().height/2 + 25);
            parentNode.addChild(slotGoldLabel,1);
            this.slotGoldLabel = slotGoldLabel;

            var userGoldLabel = new cc.LabelBMFont("1.00.000", cc.res.font.Roboto_CondensedBold_25 );
            userGoldLabel.setColor(cc.color("#392d2e"));
            userGoldLabel.setPosition(this.x + this.getContentSize().width/4, slotGoldLabel.y);
            parentNode.addChild(userGoldLabel,1);
            this.userGoldLabel = userGoldLabel;
        }
        else{
            var slotGoldLabel = new cc.LabelBMFont("100.000", cc.res.font.Roboto_Condensed_25);
            slotGoldLabel.setColor(cc.color("#767eb6"));
            slotGoldLabel.setPosition(this.x - this.getContentSize().width/4, this.y - this.getContentSize().height/2 + 20);
            slotGoldLabel.setScale(20.0/25.0);
            parentNode.addChild(slotGoldLabel,1);
            this.slotGoldLabel = slotGoldLabel;

            var userGoldLabel = new cc.LabelBMFont("100.000", cc.res.font.Roboto_CondensedBold_25);
            userGoldLabel.setColor(cc.color("#ffde00"));
            userGoldLabel.setPosition(this.x + this.getContentSize().width/4, slotGoldLabel.y);
            userGoldLabel.setScale(20.0/25.0);
            parentNode.addChild(userGoldLabel,1);
            this.userGoldLabel = userGoldLabel
        }

        this.reset();
        //
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
    setOpacity : function (opacity) {
        this._super();
        this.bg.setOpacity(opacity);
        this.slotGoldLabel.setOpacity(opacity);
        this.userGoldLabel.setOpacity(opacity);
    },
    reset : function () {
        this._chipNode.removeAllChildren(true);
        this.removeChip();
        this.setOpacity(255);

         this.setSlotGold(0);
         this.setUserGold(0);
    },
    setSlotGold : function (gold) {
        this._slotGold = gold;

        this.slotGoldLabel.stopAllActions();
        if(gold>0){
            this.slotGoldLabel.visible = true;
            var action = new quyetnd.ActionNumber(1.0, gold);
            this.slotGoldLabel.runAction(action);
        }
        else{
            this.slotGoldLabel.setString("0");
            this.slotGoldLabel.visible = false;
        }
    },
    setUserGold : function (gold) {
        this._userGold = gold;

        this.userGoldLabel.visible = true;
        if(gold>0){
            var action = new quyetnd.ActionNumber(1.0, gold);
            this.userGoldLabel.runAction(action);
        }
        else{
            this.userGoldLabel.setString("0");
            this.userGoldLabel.visible = false;
        }
    },
    getSlotPosition : function () {
        var padding =50.0;

        var w = Math.random() * (this.getContentSize().width - padding*2) + padding;
        var h = Math.random() * (this.getContentSize().height - padding*2) + padding;
        var x = this.x - this.getContentSize().width/2 + w;
        var y = this.y - this.getContentSize().height/2 + h;

        return cc.p(x,y);
    },
    addChip : function (chipSprite) {
        this._chips.push(chipSprite);
    },
    removeChip : function () {
        this._chips = [];
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

        var chipNode = new cc.Node();
        chipNode.setPosition(cc.p(0,0));
        this.sceneLayer.addChild(chipNode);
        this.chipNode = chipNode;

        this.initChipButton();
    },
    initController : function () {
        this._controller = new XocDiaController(this);
    },
    initBettingSlot : function () {
        this.bettingSlot = [];

        var slotNode = new cc.Node();
        slotNode.setPosition(cc.p(0,0));
        this.sceneLayer.addChild(slotNode);

        for(var i=0;i<7;i++){
            var slot = new XocDiaBettingSlot(i, slotNode);
            slotNode.addChild(slot);
            var slotIndex = s_xocdia_slot_id[i];
            slot.onTouchSlot = function (slotId) {
                //cc.log("touchSlot: "+slotId);
            };
            this.bettingSlot[slotIndex] = slot;
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

    onEnter : function () {
        this._super();
        this.chipGroup.selectChipAtIndex(0, true);
    },

    addChipToSlot : function (slotIndex, chipIndex, fromMe) {
        if(fromMe){
            var chipPosition = this.chipGroup.getChip(chipIndex).getPosition();
        }
        else{
            //from player button
            var chipPosition = cc.p(0,0);
        }

        var slot = this.bettingSlot[slotIndex];
        var thiz = this;

        var addChipHandler = function () {
            var chip = new cc.Sprite("#xocdia-chipSelected-" + (chipIndex+1) + ".png");
            chip.setPosition(chipPosition);

            thiz.chipNode.addChild(chip);
            slot.addChip(chip);

            //move
            var p = slot.getSlotPosition();
            var duration = cc.pLength(cc.pSub(chip.getPosition(), p)) / 1000.0;
            var moveAction = new cc.Spawn(
                new cc.MoveTo(duration, p),
                new cc.ScaleTo(duration, 0.3)
            );
            chip.runAction(new cc.EaseSineOut(moveAction));
        };

        if(fromMe){
            addChipHandler();
        }
        else{
            var delayTime = 0.5 + Math.random() * 1.0;
            this.chipNode.runAction(new cc.Sequence(
                new cc.DelayTime(delayTime),
                new cc.CallFunc(addChipHandler)
            ));
        }
    },

    updateSlotGold : function (slotId, gold) {
        var slot = this.bettingSlot[slotId];
        slot.setSlotGold(gold);
    },

    updateUserGold : function (slotId, gold) {
        var slot = this.bettingSlot[slotId];
        slot.setUserGold(gold);
    },

    updateUserCount : function (userCount) {

    },

    backButtonClickHandler : function () {
        // if(this._controller){
        //     this._controller.requestQuitRoom();
        // }
        var slot = Math.floor(Math.random()*7);
        var chip = Math.floor(Math.random()*4);

        this.addChipToSlot(slot, chip, true);
    },

    /*ignore*/
    processPlayerPosition : function () {

    },
    updateOwner : function () {

    }
});