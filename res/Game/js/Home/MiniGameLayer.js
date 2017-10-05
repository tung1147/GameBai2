/**
 * Created by Quyet Nguyen on 7/6/2016.
 */

var s_JackpotName = s_JackpotName || {};
s_JackpotName[GameType.MiniGame_Poker] = "MiniPoker";
s_JackpotName[GameType.MiniGame_VideoPoker] = "VideoPoker";
s_JackpotName[GameType.GAME_VongQuayMayMan] = "Vòng quay";
s_JackpotName[GameType.MiniGame_CaoThap] = "Cao Thấp";
s_JackpotName[GameType.MiniGame_ChanLe] = "Mini Tài xỉu";
s_JackpotName[GameType.MiniGame_RungMaQuai] = "Rừng ma quái";

var home_jackpot_betting = home_jackpot_betting ||[
    100,
    1000,
    10000
];

var home_jackpotList = home_jackpotList || {};
home_jackpotList[100] = [
    GameType.MiniGame_Poker,
    GameType.MiniGame_VideoPoker,
    GameType.MiniGame_CaoThap,
    GameType.MiniGame_ChanLe,
    GameType.MiniGame_RungMaQuai,
    GameType.GAME_VongQuayMayMan
];

home_jackpotList[1000] = [
    GameType.MiniGame_Poker,
    GameType.MiniGame_VideoPoker,
    GameType.MiniGame_CaoThap,
    GameType.MiniGame_ChanLe,
    GameType.MiniGame_RungMaQuai,
    GameType.GAME_VongQuayMayMan
];

home_jackpotList[10000] = [
    GameType.MiniGame_Poker,
    GameType.MiniGame_VideoPoker,
    GameType.MiniGame_CaoThap,
    GameType.MiniGame_ChanLe,
    GameType.MiniGame_RungMaQuai,
    GameType.GAME_VongQuayMayMan
];

var MiniGameLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        LobbyClient.getInstance().addListener("miniGame", this.onSocketMessage, this);

        this.tabSelectedIndex = 0;
        this.allMiniLayer = [];

        this.initMiniGame();

        // this.setContentSize(cc.size(1280, 720));
        // this.setAnchorPoint(cc.p(0.5, 0.5));
        // this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        // this.setScale(cc.winSize.screenScale);
    },

    initMiniGame: function () {
        var thiz = this;

        var top = 540.0;
        var bottom = 80.0 * cc.winSize.screenScale;
        var left = 0;
        var right = 280;

        var bg = new cc.Sprite("#home-minigame-bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        bg.setPosition(0, 0);
        this.addChild(bg,1);

        var goldTitle = cc.Label.createWithBMFont("res/fonts/fnt_tien2.fnt", "1000");
        goldTitle.setPosition(160, 580);
        this.addChild(goldTitle);
        this.goldTitle = goldTitle;

        var coinIcon = new cc.Sprite("#home_goldIcon.png");
        coinIcon.setPosition(60, goldTitle.y);
        this.addChild(coinIcon);

        var leftBt = new ccui.Button("home-minigame-leftBt.png","","", ccui.Widget.PLIST_TEXTURE);
        leftBt.setPosition((right - left) / 2 - 121, goldTitle.y);
        this.addChild(leftBt);

        var rightBt = new ccui.Button("home-minigame-leftBt.png","","", ccui.Widget.PLIST_TEXTURE);
        rightBt.setPosition((right - left) / 2 + 123, leftBt.y);
        rightBt.setFlippedX(true);
        this.addChild(rightBt);

        //add pageview
        var miniGameLayer = new ccui.PageView();
        miniGameLayer.setContentSize(cc.size(right-left, top-bottom));
        miniGameLayer.setAnchorPoint(cc.p(0.0, 0.0));
        miniGameLayer.setBounceEnabled(true);
        miniGameLayer.setPosition(left, bottom);
        this.addChild(miniGameLayer);
        this.miniGameLayer = miniGameLayer;

        for (var i = 0; i < home_jackpot_betting.length; i++) {
            var listGame = new newui.TableView(miniGameLayer.getContentSize(), 1);
            listGame.setDirection(ccui.ScrollView.DIR_VERTICAL);
            listGame.setBounceEnabled(true);
            listGame.setScrollBarEnabled(false);
            miniGameLayer.addPage(listGame);
            this.allMiniLayer.push(listGame);

            var betting = home_jackpot_betting[i];
            var gameList = home_jackpotList[betting];

            for (var j = 0; j < gameList.length; j++) {
                this.addItem(listGame, gameList[j], betting);
            }
        }

        miniGameLayer.addEventListener(function () {
            var i = miniGameLayer.getCurrentPageIndex();
            thiz.selectTab(i, false);
        });

        leftBt.addClickEventListener(function () {
            thiz.selectTab(thiz.tabSelectedIndex - 1, true);
        });

        rightBt.addClickEventListener(function () {
            thiz.selectTab(thiz.tabSelectedIndex + 1, true);
        });
    },

    selectTab: function (index, selectTab) {
        this.tabSelectedIndex = index;
        if(this.tabSelectedIndex < 0){
            this.tabSelectedIndex = home_jackpot_betting.length - 1;
        }
        else if(this.tabSelectedIndex >= home_jackpot_betting.length){
            this.tabSelectedIndex = 0;
        }

        if(selectTab){
            this.miniGameLayer.scrollToPage(this.tabSelectedIndex);
        }

        this.goldTitle.setString(cc.Global.NumberFormat1(home_jackpot_betting[this.tabSelectedIndex]));
    },

    onEnter: function () {
        this._super();
        this.selectTab(0, true);
        this.startAnimation();
    },

    onExit: function () {
        this._super();
    },

    startAnimation: function () {
        this.allMiniLayer[this.tabSelectedIndex].runMoveEffect(-2000, 0.1, 0.1);
    },

    addItem : function (m_list, gameId, betting) {
        // if(s_game_available.indexOf(gameId) === -1){
        //     return;
        // }

        var container = new ccui.Widget();
        container.setContentSize(cc.size(m_list.width, 70));
        if(m_list.size() % 2){
            var bg = new cc.Sprite("#home-minigame-bg-1.png");
        }
        else{
            var bg = new cc.Sprite("#home-minigame-bg-2.png");
        }
        bg.setPosition(container.width/2, container.height/2);
        container.addChild(bg);

        var gameIcon = new cc.Sprite("#minigame_icon_" + gameId.toString() + ".png");
        gameIcon.setPosition(40, container.height/2);
        gameIcon.setScale(0.85);
        container.addChild(gameIcon);

        var lb_tenhu = cc.Label.createWithBMFont("res/fonts/fnt_seagull_80.fnt", s_JackpotName[gameId]);
        lb_tenhu.setScale(0.3);
        lb_tenhu.setAnchorPoint(cc.p(0, 0.5));
        lb_tenhu.setPosition(cc.p(89, 49));
        container.addChild(lb_tenhu);

        var _coin = new cc.Sprite("#home_goldIcon.png");
        _coin.setPosition(cc.p(100, 22));
        _coin.setScale(0.74);
        container.addChild(_coin);

        var lb_moneyhu = cc.Label.createWithBMFont("res/fonts/fnt_tien2.fnt", "0");
        lb_moneyhu.setScale(0.8);
        lb_moneyhu.setAnchorPoint(cc.p(0, 0.5));
        lb_moneyhu.setPosition(cc.p(_coin.x + 18, _coin.y));
        container.addChild(lb_moneyhu);

        m_list.pushItem(container);

        var thiz = this;
        container._jackpotValue = 0;
        container.gameId = gameId;
        container.betting = betting;
        container._gameNameLabel = lb_tenhu;
        container._jackpotLabel = lb_moneyhu;
        container._setJackpot = function (value) {
            container._jackpotValue = value;
            lb_moneyhu.setString(cc.Global.NumberFormat1(container._jackpotValue));
        };
       // JackpotEvent.addEventForTarget(container);

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var gId = this.gameId;
            cc.log("Game: " + gId);
        });
    }
});