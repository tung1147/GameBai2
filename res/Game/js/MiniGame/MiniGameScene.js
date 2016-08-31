/**
 * Created by Quyet Nguyen on 8/30/2016.
 */
var MiniGameScene = IScene.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this.sceneLayer.addChild(bg);
    },
    initAvatarMe : function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        playerMe.setUsername(PlayerMe.username);
        this.sceneLayer.addChild(playerMe,1);
    },
    initButton : function () {
        var gameTopbar = new GameTopBar();
        this.sceneLayer.addChild(gameTopbar);

        var tutorialBt = new ccui.Button("ingame-tutorialBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialBt.setPosition(1110, gameTopbar.backBt.y);
        gameTopbar.addChild(tutorialBt);

        var rankBt = new ccui.Button("ingame-rankBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rankBt.setPosition(1003, tutorialBt.y);
        gameTopbar.addChild(rankBt);

        var thiz = this;
        gameTopbar.backBt.addClickEventListener(function () {
            thiz.backButtonHandler();
        });
        tutorialBt.addClickEventListener(function () {
            thiz.tutorialButtonHandler();
        });
        rankBt.addClickEventListener(function () {
            thiz.rankButtonHandler();
        });
    },
    initChip : function (centerPosition) {
        var chipGroup = new ChipGroup();
        this.sceneLayer.addChild(chipGroup);
        this.chipGroup = chipGroup;

        var chip1 = new MiniGameChip(1);
        chip1.setPosition(centerPosition - 170.0 * cc.winSize.screenScale , 30.0 * cc.winSize.screenScale);
        chip1.setScale(cc.winSize.screenScale);
        chip1.originPoint = chip1.getPosition();
        chipGroup.addChip(chip1);

        var chip2 = new MiniGameChip(2);
        chip2.setPosition(centerPosition, chip1.y);
        chip2.setScale(cc.winSize.screenScale);
        chip2.originPoint = chip2.getPosition();
        chipGroup.addChip(chip2);

        var chip3 = new MiniGameChip(3);
        chip3.setPosition(centerPosition + 170 *cc.winSize.screenScale, chip1.y);
        chip3.setScale(cc.winSize.screenScale);
        chip3.originPoint = chip3.getPosition();
        chipGroup.addChip(chip3);
    },
    onEnter : function () {
        this._super();
        this.chipGroup.selectChipAtIndex(0, true);
    },
    tutorialButtonHandler : function () {
        
    },
    backButtonHandler : function () {
        
    },
    rankButtonHandler : function () {
        
    }
});