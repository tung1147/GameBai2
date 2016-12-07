/**
 * Created by Quyet Nguyen on 8/30/2016.
 */
var MiniGameScene = IScene.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bg);
        this.stat_board = new StatisticBoard();
        this.initController();
    },
    initAvatarMe: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        playerMe.setUsername(PlayerMe.username);
        this.sceneLayer.addChild(playerMe, 1);

        this.playerMe = playerMe;
        this.playerMe.setGold(PlayerMe.gold);
    },
    onChangeAssets: function (gold, changeAmount) {
        PlayerMe.gold = gold;
        this.playerMe.setGold(PlayerMe.gold);
        if (changeAmount == 0)
            return;
        var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        var changeText = (changeAmount >= 0 ? "+" : "") + changeAmount;
        changeSprite.setString(changeText);
        changeSprite.setColor(cc.color(changeAmount >= 0 ? "#ffde00" : "#ff0000"));
        changeSprite.setPosition(this.playerMe.avt.getPosition());
        this.addChild(changeSprite, 420);

        changeSprite.runAction(new cc.Sequence(new cc.MoveTo(1.0, changeSprite.x, changeSprite.y + 50), new cc.CallFunc(function () {
            changeSprite.removeFromParent(true);
        })));
    },

    initController: function () {
        this._controller = new MiniGameController(this);
    },

    setGameId: function () {

    },

    setupMucCuoc: function () {

    },

    performChangeRewardFund: function (data) {
        this.rewardFund = data;
    },

    initButton: function () {
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
    initChip: function (centerPosition) {
        var chipGroup = new ChipGroup();
        this.sceneLayer.addChild(chipGroup);
        this.chipGroup = chipGroup;

        var thiz = this;

        var chip1 = new MiniGameChip(1);
        chip1.setPosition(centerPosition - 170.0 * cc.winSize.screenScale, 30.0 * cc.winSize.screenScale);
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
        chip3.setPosition(centerPosition + 170 * cc.winSize.screenScale, chip1.y);
        chip3.setScale(cc.winSize.screenScale);
        chip3.originPoint = chip3.getPosition();
        chip3.onSelect = function () {
            thiz.onSelectChip(3);
        };
        chipGroup.addChip(chip3);
    },
    onSelectChip: function (chipIndex) {

    },
    onEnter: function () {
        this._super();
        this.chipGroup.selectChipAtIndex(0, true);
        this._controller.sendJoinGame();
    },

    onExit: function () {
        this._super();
        this._controller.releaseController();
    },
    tutorialButtonHandler: function () {
        // var rank = Math.floor(1 +  Math.random() * 12);
        // this.addHistory({
        //     rank : rank,
        //     suit : CardSuit.Diamonds
        // });
    },
    backButtonHandler: function () {
        var homeScene = new HomeScene();
        homeScene.startGame();
        cc.director.replaceScene(homeScene);
    },
    rankButtonHandler: function () {
        this._controller.sendGetTopRequest();
        this._controller.sendGetExplosionHistory();
        this._controller.sendGetUserHistory();
        this.stat_board.showWithAnimationScale();
    },
    backToHomeScene: function () {
        this.backButtonHandler();
    },

    showTopPlayersDialog: function (data) {
        for (var i = 0; i < data.length; i++) {
            this.stat_board.addTopEarningEntry(i + 1, data[i]["1"], data[i]["2"]);
        }
    },

    showExplosionHistoryDialog: function (data) {
        for (var i = 0; i < data.length; i++) {
            this.stat_board.addRewardFundEntry(data[i]["1"], data[i]["2"],
                data[i]["3"], data[i]["4"]);
        }
    },
    showHistoryDialog: function (data) {
        for (var i = 0; i < data.length; i++) {
            this.stat_board.addHistoryEntry(data[i]["2"], data[i]["3"],
                data[i]["4"], data[i]["5"]);
        }
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
});