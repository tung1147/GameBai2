/**
 * Created by Quyet Nguyen on 7/6/2016.
 */

var MiniGameCell = ccui.Widget.extend({
    ctor : function (size, gameId, gameName) {
        this._super();
        this.setContentSize(size);
        this.miniGameTab = [];
        this.allMiniLayer = [];

        var gameIcon = new cc.Sprite("#lobby-minigame"+ (gameId) +".png");
        gameIcon.setPosition(46, this.getContentSize().height/2);
        this.addChild(gameIcon);

        var gameGold = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0V");
        gameGold.setAnchorPoint(cc.p(0.0, 0.5));
        gameGold.setPosition(92.0, this.getContentSize().height/2 - 18.0);
        gameGold.setColor(cc.color(255, 222, 0));
        this.addChild(gameGold);

        var gameName = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, gameName);
        gameName.setAnchorPoint(cc.p(0.0, 0.5));
        gameName.setPosition(92.0, this.getContentSize().height/2 + 18.0);
        this.addChild(gameName);

        this.gameGold = gameGold;
        this.gameId = gameId;
    },

    setGold : function (gold) {

    }
});


var MiniGameLayer = cc.Node.extend({
    miniGameTab : [],
    allMiniLayer : [],
    ctor : function () {
        this._super();
        this.initMiniGame();
    },

    initMiniGame : function () {
        var miniGameBar = new cc.Sprite("#home-minigame-bar.png");
        miniGameBar.setPosition(162.0 * cc.winSize.screenScale, 170.0);
        miniGameBar.setScale(cc.winSize.screenScale);
        this.addChild(miniGameBar);

        var miniGame_top = 580.0;
        var miniGame_bottom = miniGameBar.y + miniGameBar.getContentSize().height / 2 * miniGameBar.getScaleY();
        var miniGame_left = 20.0 * cc.winSize.screenScale;
        var miniGame_right = 300.0 * cc.winSize.screenScale;

        var minigameBg = ccui.Scale9Sprite.createWithSpriteFrameName("home-minigame-bg.png", cc.rect(8, 0, 4, 384));
        minigameBg.setPreferredSize(cc.size(miniGame_right - miniGame_left + 4.0, 384));
        minigameBg.setAnchorPoint(cc.p(0,0));
        minigameBg.setPosition(miniGame_left, miniGame_bottom);
        this.addChild(minigameBg);

        //add pageview
        var miniGameToggle = new ccui.PageView();
        miniGameToggle.setContentSize(cc.size(miniGameBar.getContentSize().width - 10,  miniGameBar.getContentSize().height));
        miniGameToggle.setAnchorPoint(cc.p(0.5,0.5));
        miniGameToggle.setPosition(miniGameBar.getPosition());
        miniGameToggle.setScale(cc.winSize.screenScale);
        this.addChild(miniGameToggle);

        for(var i=0;i<3;i++){
            var listGame = new newui.TableView(cc.size(miniGame_right - miniGame_left, minigameBg.getContentSize().height - 4), 1);
            listGame.setDirection(ccui.ScrollView.DIR_VERTICAL);
            listGame.setPosition(miniGame_left + 2, miniGame_bottom + 2);
            listGame.setBounceEnabled(true);
            listGame.setScrollBarEnabled(false);
            listGame.setVisible(false);
            this.addChild(listGame, 1);
            this.allMiniLayer.push(listGame);

            var iconNormal = new cc.Sprite("#home-minigamebar-"+ (i+1) +"-1.png");
            var iconSelect = new cc.Sprite("#home-minigamebar-"+ (i+1) +"-2.png");
            iconNormal.setPosition(iconNormal.getContentSize().width/2, iconNormal.getContentSize().height/2);
            iconSelect.setPosition(iconNormal.getPosition());

            var container = new newui.Widget(iconNormal.getContentSize());
            container.iconNormal = iconNormal;
            container.iconSelect = iconSelect;
            container.addChild(iconNormal);
            container.addChild(iconSelect);

            miniGameToggle.addPage(container);
            this.miniGameTab.push(container);

            for(var j=0;j<s_mini_game_id.length;j++){
                this.addMiniGame(s_mini_game_id[j], listGame);
            }
        }

        // this.allMiniLayer[0].setAnimationHandler(function (action, item) {
        //     if(action == 1){ //start
        //
        //     }
        //     else if(action == 2){
        //
        //     }
        // });

        var thiz = this;
        miniGameToggle.addEventListener(function () {
            var index = miniGameToggle.getCurrentPageIndex();
            thiz.selectTab(index);
        });

        this.miniGameToggle = miniGameToggle;

        var shadow = new cc.Sprite("#home-minigame-bar-2.png");
        shadow.setPosition(miniGameBar.getPosition());
        shadow.setScale(cc.winSize.screenScale);
        this.addChild(shadow);
    },

    addMiniGame : function (gameId, listGame) {
        var size = cc.size(280.0, 92.0);
        var cell = new MiniGameCell(size, gameId, "Hũ thưởng");
        cell.setScale(cc.winSize.screenScale);
        listGame.pushItem(cell);
    },

    selectTab : function (index) {
        for(var i=0;i< this.miniGameTab.length; i++){
            if(i == index){
                this.miniGameTab[i].iconNormal.visible = false;
                this.miniGameTab[i].iconSelect.visible = true;
                this.allMiniLayer[i].visible = true;
            }
            else{
                this.miniGameTab[i].iconNormal.visible = true;
                this.miniGameTab[i].iconSelect.visible = false;
                this.allMiniLayer[i].visible = false;
            }
        }
    },

    onEnter : function () {
        this._super();;
        this.miniGameToggle.setCurrentPageIndex(0);
        this.selectTab(0);
    },

    startAnimation : function () {
        this.miniGameToggle.setCurrentPageIndex(0);
        this.selectTab(0);
        this.allMiniLayer[0].runMoveEffect(-2000, 0.1, 0.1);
    }
});