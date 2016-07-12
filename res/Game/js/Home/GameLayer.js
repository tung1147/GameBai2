/**
 * Created by Quyet Nguyen on 7/5/2016.
 */

var GameLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        this.allLayer = [];
        this.initGame();
    },

    initGame : function () {
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

            this.addChild(listGame,1);
            this.allLayer.push(listGame);

            var toggleItem = new ToggleNodeItem(icon2.getContentSize());
            toggleItem.icon1 = icon1;
            toggleItem.icon2 = icon2;
            toggleItem.listGame = listGame;
            toggleItem.setPosition(x,y);
            toggleItem.onSelect = function () {
                this.icon1.visible = false;
                this.icon2.visible = true;
                this.listGame.visible = true;
            };
            toggleItem.onUnSelect = function () {
                this.icon1.visible = true;
                this.icon2.visible = false;
                this.listGame.visible = false;
            };
            mToggle.addItem(toggleItem);
            x += dx;
        }
        this.mToggle = mToggle;

        for(var i=0;i<this.allLayer.length;i++){
            for(var j =0;j<s_game_id[i].length;j++){
                this.addGameToList(s_game_id[i][j], this.allLayer[i]);
            }
        }
    },

    addGameToList : function (gameId, listGame) {
        var gameButton = new ccui.Button("lobby-game"+ gameId +".png", "", "", ccui.Widget.PLIST_TEXTURE);
        listGame.pushItem(gameButton);
        gameButton.addClickEventListener(function () {
            if(gameId == GameType.MiniGame_CaoThap){

            }
            else if(gameId == GameType.MiniGame_ChanLe){

            }
            else if(gameId == GameType.MiniGame_Pocker){

            }
            else if(gameId == GameType.GAME_VongQuayMayMan){

            }
            else{
                var homeScene = cc.director.getRunningScene();
                homeScene.startLobby(gameId);
            }
        });
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
    },
    
    startAnimation : function () {
        this.mToggle.selectItem(0);
        this.allLayer[0].runMoveEffect(3000,0.1,0.0);
    }
});