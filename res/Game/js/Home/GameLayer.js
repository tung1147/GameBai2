/**
 * Created by Quyet Nguyen on 7/5/2016.
 */

var GameType = GameType || {};
GameType.GAME_MauBinh = 0;
GameType.GAME_TienLenMN = 1;
GameType.GAME_Phom = 2;
GameType.GAME_Sam = 3;
GameType.GAME_BaCay = 4;
GameType.GAME_XocDia = 5;
GameType.GAME_TaiXiu = 6;
GameType.GAME_VongQuayMayMan = 7;
GameType.GAME_TLMN_Solo = 8;
GameType.GAME_Sam_Solo = 9;
GameType.GAME_Lieng = 10;
GameType.GAME_BaCayChuong = 11;
GameType.MiniGame_ChanLe = 12;
GameType.MiniGame_CaoThap = 13;
GameType.MiniGame_Pocker = 14;

var s_game_id = [
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.MiniGame_CaoThap, GameType.MiniGame_Pocker,
        GameType.GAME_XocDia, GameType.GAME_TaiXiu,
        GameType.GAME_Sam_Solo, GameType.GAME_Sam,
        GameType.GAME_Phom, GameType.GAME_BaCay,
        GameType.GAME_VongQuayMayMan, GameType.MiniGame_ChanLe,
        GameType.GAME_MauBinh
    ],
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.GAME_Sam_Solo, GameType.GAME_Sam,
        GameType.GAME_Phom, GameType.GAME_BaCay,
        GameType.GAME_MauBinh
    ],
    [
        GameType.MiniGame_CaoThap, GameType.MiniGame_Pocker,
        GameType.MiniGame_ChanLe
    ],
    [
        GameType.GAME_VongQuayMayMan
    ],
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.MiniGame_CaoThap, GameType.MiniGame_Pocker
    ]
];

var GameLayer = cc.Node.extend({
    allLayer : [],
    ctor : function () {
        this._super();

        var x = 422.0 * cc.winSize.screenScale;
        var y = 180.0;
        var dx = 186.0 * cc.winSize.screenScale;
        var left = 310.0 * cc.winSize.screenScale;
        var right = cc.winSize.width;

        var padding = 20.0;// (winSize.width - 284.0f * 4) / 5;
        if (padding < 0){
            padding = 0;
        }

        var gameNav = new cc.Sprite("#home-gameNav-bg.png");
        gameNav.setPosition(791.0 * cc.winSize.screenScale, y);
        gameNav.setScale(cc.winSize.screenScale);
        this.addChild(gameNav);

        var mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        for(var i=0;i<5;i++){
            var icon1 = new cc.Sprite("#home-game-tab"+ (i+1) +".png");
            icon1.setPosition(x,y);
            icon1.setScale(cc.winSize.screenScale);
            this.addChild(icon1);

            var icon2 = new cc.Sprite("#home-game-tab"+ (i+1) +"-2.png");
            icon2.setPosition(x,y);
            icon2.setScale(cc.winSize.screenScale);
            this.addChild(icon2);

            var listGame = new newui.TableView(cc.size(right - left, 360), 2);
            listGame.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
            listGame.setPadding(padding);
            listGame.setBounceEnabled(true);
            listGame.setScrollBarEnabled(false);
            listGame.setPosition(left, 220.0);

            this.addChild(listGame);
            this.allLayer.push(listGame);

            var toggleItem = new ToggleNodeItem(icon2.getContentSize());
            toggleItem.icon1 = icon1;
            toggleItem.icon2 = icon2;
            toggleItem.listGame = listGame;
            toggleItem.setPosition(x,y);
            toggleItem.setCallback(function (target, select, force) {
                //cc.log("unSelect: " + i);
                if(select == TOGGLE_SELECT){
                    this.icon1.visible = false;
                    this.icon2.visible = true;
                    this.listGame.visible = true;
                }
                else{
                    this.icon1.visible = true;
                    this.icon2.visible = false;
                    this.listGame.visible = false;
                }
            });
            mToggle.addItem(toggleItem);
            x += dx;
        }
        this.mToggle = mToggle;
        this.initGame();
    },

    initGame : function () {
        for(var i=0;i<this.allLayer.length;i++){
            log("initGame: " + i);
            for(var j =0;j<s_game_id[i].length;j++){
                this.addGameToList(s_game_id[i][j], this.allLayer[i]);
            }
        }
    },

    addGameToList : function (gameId, listGame) {
        log("addGameToList: " + gameId);
        var gameButton = new ccui.Button("lobby-game"+ gameId +".png", "", "", ccui.Widget.PLIST_TEXTURE);
        listGame.pushItem(gameButton);
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
    }
});