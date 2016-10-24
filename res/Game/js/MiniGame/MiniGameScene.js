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

        var bottomBar = new cc.Sprite("#game-bottom-bar.png");
        bottomBar.setAnchorPoint(cc.p(0,0));
        bottomBar.setPosition(cc.p(0,0));
        this.sceneLayer.addChild(bottomBar);
    },
    initAvatarMe : function () {
        var bg = new cc.Sprite("#game-userinfo-bg.png");
        bg.setPosition(360, 560);
        this.sceneLayer.addChild(bg);

        var goldBg = new ccui.Scale9Sprite("home-bar-bg1.png", cc.rect(20,0,4,27));
        goldBg.setPreferredSize(cc.size(202.0, 27.0));
        goldBg.setPosition(274, 96);
        bg.addChild(goldBg);

        var startIcon = new cc.Sprite("#home-start-icon.png");
        startIcon.setPosition(cc.p(182, goldBg.y));
        bg.addChild(startIcon);

        var goldLabel = cc.Label.createWithBMFont("res/fonts/lobby_gold_number.fnt", "500.000");
        goldLabel.setPosition(goldBg.x, goldBg.y + 2);
        bg.addChild(goldLabel,1);

        var levelBar = new cc.ProgressTimer(new cc.Sprite("#home-level-bar.png"));
        levelBar.setType(cc.ProgressTimer.TYPE_BAR);
        levelBar.setMidpoint(cc.p(0.0, 0.5));
        levelBar.setBarChangeRate(cc.p(1.0,0.0));
        levelBar.setPosition(goldBg.x, 56);
        levelBar.setPercentage(50.0);
        bg.addChild(levelBar);

        var levelBarBg = new ccui.Scale9Sprite("home-bar-bg1.png", cc.rect(20,0,4,27));
        levelBarBg.setPreferredSize(cc.size(202.0, 27.0));
        levelBarBg.setPosition(levelBar.getContentSize().width/2, levelBar.getContentSize().height/2);
        levelBar.addChild(levelBarBg, -1);
        var startIcon2 = new cc.Sprite("#home-start-icon2.png");
        startIcon2.setPosition(cc.p(182, levelBar.y));
        bg.addChild(startIcon2);

        var level = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Lv.50");
        level.setPosition(levelBar.x, levelBar.y-1);
        level.setColor(cc.color.WHITE);
        bg.addChild(level, 1);

        var avt =  UserAvatar.createMe();
        avt.setPosition(80, 90);
        bg.addChild(avt, 0);

        this.playerMe = this;
        this.playerMe.setGold = function (gold) {
            goldLabel.setString(cc.Global.NumberFormat1(gold));
            this.gold = gold;
        };
        this.playerMe.setGold(PlayerMe.gold);
    },
    onChangeAssets : function(){
        this.playerMe.setGold(PlayerMe.gold);
    },
    initButton : function () {
        var backBt = new ccui.Button("game-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(60, cc.winSize.height - 50);
        this.sceneLayer.addChild(backBt);

        var settingBt = new ccui.Button("game-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setPosition(cc.winSize.width - backBt.x, backBt.y);
        this.sceneLayer.addChild(settingBt);

        var thiz = this;
        backBt.addClickEventListener(function () {
            thiz.backButtonHandler();
        });
        settingBt.addClickEventListener(function () {
            thiz.settingButtonHandler();
        });
    },
    initChip : function (centerPosition) {
        var chipGroup = new ChipGroup();
        this.sceneLayer.addChild(chipGroup);
        this.chipGroup = chipGroup;

        var thiz = this;

        var chip1 = new MiniGameChip(1);
        chip1.setPosition(centerPosition - 150.0 * cc.winSize.screenScale , 70.0);
        chip1.setScale(cc.winSize.screenScale);
        chip1.originPoint = chip1.getPosition();
        chip1.onSelect = function () {
            thiz.onSelectChip(1);
        };
        chipGroup.addChip(chip1);

        var chip2 = new MiniGameChip(2);
        chip2.setPosition(centerPosition, chip1.y);
        chip2.setScale(cc.winSize.screenScale);
        chip2.originPoint = chip2.getPosition();
        chip2.onSelect = function () {
            thiz.onSelectChip(2);
        };
        chipGroup.addChip(chip2);

        var chip3 = new MiniGameChip(3);
        chip3.setPosition(centerPosition + 150 *cc.winSize.screenScale, chip1.y);
        chip3.setScale(cc.winSize.screenScale);
        chip3.originPoint = chip3.getPosition();
        chip3.onSelect = function () {
            thiz.onSelectChip(3);
        };
        chipGroup.addChip(chip3);
    },
    onSelectChip : function (chipIndex) {

    },
    onEnter : function () {
        this._super();
        this.chipGroup.selectChipAtIndex(0, true);
    },
    tutorialButtonHandler : function () {
        // var rank = Math.floor(1 +  Math.random() * 12);
        // this.addHistory({
        //     rank : rank,
        //     suit : CardSuit.Diamonds
        // });
    },
    backButtonHandler : function () {
        var homeScene = new HomeScene();
        homeScene.startGame();
        cc.director.replaceScene(homeScene);
    },
    rankButtonHandler : function () {
        
    },
    settingButtonHandler : function () {
        
    }
});