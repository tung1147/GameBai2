/**
 * Created by Quyet Nguyen on 7/5/2016.
 */

var GameLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        this.allLayer = [];
        this.initGame();
    },

    initGame: function () {
        var x = 300.0 * cc.winSize.screenScale;
        var y = 175.0;
        var dx = 184.0 * cc.winSize.screenScale;
        var left = 300.0 * cc.winSize.screenScale;
        var right = cc.winSize.width - 60;

        var padding = 0;// (winSize.width - 284.0f * 4) / 5;
        if (padding < 0) {
            padding = 0;
        }

        var gameNav = new cc.Sprite("#home-gameNav-bg.png");
        gameNav.setPosition(x + gameNav.width / 2 * cc.winSize.screenScale, y);
        gameNav.setScale(cc.winSize.screenScale);
        this.addChild(gameNav);

        var selectedNav = new cc.Sprite("#home-game-nav.png");
        selectedNav.setAnchorPoint(cc.p(0.0,0.5));
        selectedNav.setPosition(x,y);
        this.addChild(selectedNav);
        this.selectedNav = selectedNav;

        var mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        var thiz = this;
        for (var i = 0; i < 5; i++) {
            var icon1 = new cc.Sprite("#home-game-tab" + (i + 1) + ".png");
            icon1.setPosition(x + 92, y + 7);
            icon1.setScale(cc.winSize.screenScale);
            this.addChild(icon1);

            var icon2 = new cc.Sprite("#home-game-tab" + (i + 1) + "-2.png");
            icon2.setPosition(icon1.getPosition());
            icon2.setScale(cc.winSize.screenScale);
            this.addChild(icon2);

            var listGame = new newui.TableView(cc.size(right - left, 404), 2);
            listGame.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
            listGame.setPadding(padding);
            listGame.setBounceEnabled(true);
            listGame.setMargin(0, 0, 10, 10);
            listGame.setScrollBarEnabled(false);
            listGame.setPosition(left, 216.0);

            this.addChild(listGame, 1);
            this.allLayer.push(listGame);

            var toggleItem = new ToggleNodeItem(icon2.getContentSize());
            toggleItem.icon1 = icon1;
            toggleItem.icon2 = icon2;
            toggleItem.listGame = listGame;
            toggleItem.setPosition(x, y);
            toggleItem.onSelect = function () {
                this.icon1.visible = false;
                this.icon2.visible = true;
                this.listGame.visible = true;
                thiz.moveSelectedNav(this.icon1.x-92);
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

        for (var i = 0; i < this.allLayer.length; i++) {
            for (var j = 0; j < s_game_id[i].length; j++) {
                this.addGameToList(s_game_id[i][j], this.allLayer[i]);
            }
        }
    },

    moveSelectedNav : function (x) {
        if (!this.selectedNav)
            return;

        this.selectedNav.stopAllActions();
        var moveAction = new cc.MoveTo (0.15,cc.p(x,this.selectedNav.y));
        this.selectedNav.runAction(moveAction);
    },

    addGameToList: function (gameId, listGame) {
        var gameButton = new ccui.Widget();
        gameButton.setContentSize(cc.size(180, 20));
        gameButton.setTouchEnabled(true);

        listGame.pushItem(gameButton);

        var gameIcon = new cc.Sprite("#lobby-game" + gameId + ".png");//new ccui.Button("lobby-game"+ gameId +".png", "", "", ccui.Widget.PLIST_TEXTURE);
        gameIcon.setScale(150 / 190);
        gameIcon.setPosition(gameButton.getContentSize().width / 2, gameButton.getContentSize().height / 2);
        gameButton.addChild(gameIcon);

        gameButton.addClickEventListener(function () {
            var homeScene = cc.director.getRunningScene();
            homeScene.onTouchGame(gameId);
        });
    },

    onEnter: function () {
        this._super();
        this.mToggle.selectItem(0);
    },

    startAnimation: function () {
        this.mToggle.selectItem(0);
        this.allLayer[0].runMoveEffect(3000, 0.1, 0.0);
    }
});