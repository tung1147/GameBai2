/**
 * Created by QuyetNguyen on 12/20/2016.
 */
var MiniGamePopup = cc.Node.extend({
    ctor: function () {
        this._super();
        //  this.setScale(0.6);
        this.initController();

        this.rewardFund = [];

        var closeButton = new ccui.Button("caothap_closeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(895, 407);
        this.addChild(closeButton, 5);

        var tutorialButton = new ccui.Button("caothap_tutorialBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialButton.setPosition(769, 426);
        this.addChild(tutorialButton);

        var historyButton = new ccui.Button("caothap_historyBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        historyButton.setPosition(694, 430);
        this.addChild(historyButton);

        var jackpotLabel = new cc.LabelBMFont("100.000", cc.res.font.Roboto_CondensedBold_30);
        jackpotLabel.setColor(cc.color("#ffea00"));
        jackpotLabel.setPosition(500, 462);
        this.jackpotLabel = jackpotLabel;
        this.addChild(jackpotLabel, 1);

        this.initChip(cc.p(91, 260));

        var thiz = this;
        closeButton.addClickEventListener(function () {
            thiz.hide();
        });

        historyButton.addClickEventListener(function () {
            thiz.stat_board.showWithAnimationScale();
        });

        this._controller.sendJoinGame();
    },

    onEnter: function () {
        this._super();

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            },
            onTouchMoved: function (touch, event) {
                thiz.onTouchMoved(touch, event);
            },
            onTouchEnded: function (touch, event) {
                thiz.onTouchEnded(touch, event);
            }
        }, this);
    },

    initController: function () {

    },

    performChangeRewardFund: function (data) {
        this.rewardFund = data;
        var betAmountID = this.chipGroup.chipSelected.chipIndex;
        if (!this.rewardFund || this.rewardFund.length < 3)
            return;
        this.jackpotLabel.setString(this.rewardFund[betAmountID - 1]["2"]);
    },

    getCardWithId: function (cardId) {
        var rankCard = (cardId % 13) + 3;
        if (rankCard > 13) {
            rankCard -= 13;
        }
        return {
            rank: rankCard,
            suit: Math.floor(cardId / 13)
        };
    },
    onChangeAssets: function (gold, changeAmount) {
        PlayerMe.gold = gold;
        if (changeAmount == 0)
            return;

        var parent = this.getParent();

        var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        var changeText = (changeAmount >= 0 ? "+" : "") + changeAmount;
        changeSprite.setString(changeText);
        changeSprite.setColor(cc.color(changeAmount >= 0 ? "#ffde00" : "#ff0000"));
        changeSprite.setPosition(50,70);
        parent.addChild(changeSprite, 420);

        changeSprite.runAction(new cc.Sequence(new cc.MoveTo(1.0, changeSprite.x, changeSprite.y + 50), new cc.CallFunc(function () {
            changeSprite.removeFromParent(true);
        })));
    },

    initChip: function (centerPosition) {
        var chipGroup = new ChipGroup();
        this.addChild(chipGroup, 5);
        this.chipGroup = chipGroup;

        var thiz = this;
        var chip1 = new MiniLayerChip(1);
        chip1.setPosition(centerPosition.x + 21, centerPosition.y + 105);
        chip1.setScale(cc.winSize.screenScale);
        chip1.originPoint = chip1.getPosition();
        chip1.onSelect = function () {
            thiz.onSelectChip(1);
        };
        chipGroup.addChip(chip1);

        var chip2 = new MiniLayerChip(2);
        chip2.setPosition(centerPosition.x, centerPosition.y);
        chip2.setScale(cc.winSize.screenScale);
        chip2.originPoint = chip2.getPosition();
        chip2.onSelect = function () {
            thiz.onSelectChip(2);
        };
        chipGroup.addChip(chip2);

        var chip3 = new MiniLayerChip(3);
        chip3.setPosition(centerPosition.x + 19, centerPosition.y - 105);
        chip3.setScale(cc.winSize.screenScale);
        chip3.originPoint = chip3.getPosition();
        chip3.onSelect = function () {
            thiz.onSelectChip(3);
        };
        chipGroup.addChip(chip3);

        chipGroup.selectChipAtIndex(0);
    },

    onSelectChip: function (chipIndex) {
        if (this.rewardFund.length < 3)
            return;
        this.jackpotLabel.setString("" + this.rewardFund[chipIndex - 1]["2"]);
    },

    onExit: function () {
        this._super();
        this._controller.releaseController();
    },

    onTouchBegan: function (touch, event) {
        if (this._touchStartPoint) {
            return false;
        }

        this._touchStartPoint = touch.getLocation();
        var p = this.convertToNodeSpace(this._touchStartPoint);
        if (cc.rectContainsPoint(this._boudingRect, p)) {
            return true;
        }
        this._touchStartPoint = null;
        return false;
    },

    onTouchMoved: function (touch, event) {
        if (!this._touchStartPoint) {
            return;
        }
        var p = touch.getLocation();
        this.moveNode(cc.p(p.x - this._touchStartPoint.x, p.y - this._touchStartPoint.y));
        this._touchStartPoint = p;
    },

    onTouchEnded: function (touch, event) {
        this._touchStartPoint = null;
    },

    moveNode: function (ds) {
        this.x += ds.x;
        this.y += ds.y;

        var lb = this.convertToWorldSpace(cc.p(this._boudingRect.x, this._boudingRect.y));
        var rt = this.convertToWorldSpace(cc.p(this._boudingRect.x + this._boudingRect.width, this._boudingRect.y + this._boudingRect.height));

        if (lb.x < 0) {
            this.x -= lb.x;
        }
        if (rt.x > cc.winSize.width) {
            this.x -= (rt.x - cc.winSize.width);
        }
        if (lb.y < 0) {
            this.y -= lb.y;
        }
        if (rt.y > cc.winSize.height) {
            this.y -= (rt.y - cc.winSize.height);
        }
    },

    show: function () {
        this.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        var bg = new cc.LayerColor(cc.color(0, 0, 0, 0));
        bg.addChild(this);

        var runningScene = cc.director.getRunningScene();
        if (runningScene) {
            if (runningScene.popupLayer) {
                runningScene.popupLayer.addChild(bg)
            }
            else {
                runningScene.addChild(bg);
            }

            // cc.eventManager.addListener({
            //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //     swallowTouches:true,
            //     onTouchBegan : function () {
            //         return true;
            //     }
            // }, bg);
        }
    },
    backToHomeScene: function () {
        this.hide();
    },

    hide: function () {
        this.getParent().removeFromParent(true);
    }
});