/**
 * Created by Quyet Nguyen on 7/5/2016.
 */

var GameLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        this.allLayer = [];
        this.initGame();

        this.setContentSize(cc.size(1280, 720));
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.setScale(cc.winSize.screenScale);


        var ret = "";

        if(cc.sys.os === cc.sys.IOS)
        {
            ret = jsb.reflection.callStaticMethod("TrackingIDFA",
                "identifierForAdvertising");
        }
        else if(cc.sys.os === cc.sys.ANDROID)
        {
            ret = jsb.reflection.callStaticMethod("vn/quyetnguyen/plugin/system/SystemPlugin",
                "getGAID", "()Ljava/lang/String;");
        }
        var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Lưu mật khẩu      |" + ret);
        label1.setAnchorPoint(1.0, 0.5);
        label1.setColor(cc.color("#000000"));
        label1.setPosition(this.getContentSize().width/2, 200);
        this.addChild(label1,1);

    },

    initGame : function () {
        var thiz = this;

        var left = 290.0;
        var right = 1280.0;
        var top = 550.0;
        var bottom = 160.0;

        var gameNav = new cc.Sprite("#home-gameNav-bg.png");
        gameNav.setPosition((right + left) / 2, 137);
        this.addChild(gameNav);

        var dx = gameNav.getContentSize().width / 5;
        var x = gameNav.x - gameNav.getContentSize().width / 2 + dx / 2;

        // var selectSprite = new ccui.Scale9Sprite("home-gameNav-selected.png", cc.rect(4,4,4,4));
        // selectSprite.setPreferredSize(cc.size(dx, gameNav.getContentSize().height));
        // selectSprite.setPosition(0, gameNav.y);
        // this.addChild(selectSprite, 1);

        var mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        for(var i=0;i<5;i++){
            (function () {
                var icon1 = new cc.Sprite("#home-game-tab"+ (i+1) +".png");
                icon1.setPosition(x + dx * i, 137);
                thiz.addChild(icon1);

                var icon2 = new cc.Sprite("#home-game-tab"+ (i+1) +"-2.png");
                icon2.setPosition(icon1.getPosition());
                thiz.addChild(icon2);

                var listGame = new newui.TableView(cc.size(right - left, (top - bottom)), 2);
                listGame.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
                // listGame.setPadding(60);
                listGame.setBounceEnabled(true);
                listGame.setPadding(20);
                listGame.setMargin(0,0,-2,0);
                listGame.setScrollBarEnabled(false);
                listGame.setPosition(left, bottom);

                thiz.addChild(listGame,1);
                thiz.allLayer.push(listGame);

                var toggleItem = new ToggleNodeItem(icon1.getContentSize());
                toggleItem.setPosition(icon1.x, icon1.y);
                toggleItem.onSelect = function (isForce) {
                    icon1.visible = false;
                    icon2.visible = true;
                    listGame.visible = true;

                    // selectSprite.stopAllActions();
                    // if(isForce){
                    //     selectSprite.x = icon1.x;
                    // }
                    // else{
                    //     selectSprite.runAction(new cc.MoveTo(0.1, cc.p(icon1.x, selectSprite.y)));
                    // }
                };
                toggleItem.onUnSelect = function () {
                    icon1.visible = true;
                    icon2.visible = false;
                    listGame.visible = false;
                };
                mToggle.addItem(toggleItem);
            })();
        }
        this.mToggle = mToggle;

        for(var i=0;i<this.allLayer.length;i++){
            for(var j =0;j<s_game_id[i].length;j++){
                this.addGameToList(s_game_id[i][j], this.allLayer[i]);
            }
        }
    },

    addGameToList : function (gameId, listGame) {
        var gameButton = new ccui.Widget();
        gameButton.setContentSize(cc.size(214, 145));
        gameButton.setTouchEnabled(true);

        listGame.pushItem(gameButton);

        var gameIcon = new cc.Sprite("#lobby-game"+ gameId +".png");//new ccui.Button("lobby-game"+ gameId +".png", "", "", ccui.Widget.PLIST_TEXTURE);
        gameIcon.setPosition(gameButton.getContentSize().width/2 , gameButton.getContentSize().height/2);
        gameButton.addChild(gameIcon);

        gameButton.addClickEventListener(function () {
            var homeScene = cc.director.getRunningScene();
            homeScene.onTouchGame(gameId);
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