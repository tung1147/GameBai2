/**
 * Created by Quyet Nguyen on 7/5/2016.
 */

var s_home_gameList = s_home_gameList || [
    GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
    GameType.GAME_Poker, GameType.GAME_MauBinh,
    GameType.GAME_Sam_Solo, GameType.GAME_Sam,
    GameType.GAME_Phom, GameType.GAME_SLOT_FRUIT,
    GameType.GAME_XocDia, GameType.GAME_TaiXiu,
    GameType.MiniGame_ChanLe, GameType.MiniGame_Poker,
    GameType.MiniGame_VideoPoker, GameType.MiniGame_CaoThap,
    GameType.GAME_VongQuayMayMan,GameType.GAME_BaCay

];

var GameLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var left = 492.0;
        var right = 1280.0;
        var top = 570.0;
        var bottom = 135.0;

        var listGame = new newui.TableView(cc.size(right - left, (top - bottom)), 2);
        listGame.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listGame.setPadding(19);
        listGame.setBounceEnabled(true);
        listGame.setMargin(0,0,30,30);
        listGame.setScrollBarEnabled(false);
        listGame.setPosition(left, bottom);
        this.listGame = listGame;
        this.addChild(listGame);

        for(var i=0;i<s_home_gameList.length;i++){
            this.addGameToList(s_home_gameList[i], listGame);
        }
    },

    addGameToList : function (gameId, listGame) {
        var thiz = this;

        var gameButton = new ccui.Widget();
        gameButton.setContentSize(cc.size(190, 190));
        gameButton.setTouchEnabled(true);

        listGame.pushItem(gameButton);

        var gameIcon = new cc.Sprite("#lobby_gameIcon_"+ gameId +".png");//new ccui.Button("lobby-game"+ gameId +".png", "", "", ccui.Widget.PLIST_TEXTURE);
        gameIcon.setPosition(gameButton.getContentSize().width/2 , gameButton.getContentSize().height/2);
        gameButton.addChild(gameIcon);

        gameButton.addClickEventListener(function () {
            thiz.onTouchGame(gameId);
        });
    },

    onEnter : function () {
        this._super();
        this.startAnimation();
    },
    
    startAnimation : function () {
        this.listGame.runMoveEffect(3000,0.1,0.0);
    },
    
    onTouchGame : function (gameId) {
        cc.log("onTouchGame: " + gameId);
    }
});