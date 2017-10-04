/**
 * Created by Quyet Nguyen on 7/1/2016.
 */

var s_home_bottom_bar_game_position = s_home_bottom_bar_game_position || [
    cc.p(82,70),
    cc.p(200,70),
    cc.p(320,80),
    cc.p(954,78),
    cc.p(1072,78),
    cc.p(1192,78)
];

var s_home_bottom_bar_game_id = s_home_bottom_bar_game_id || [
    GameType.MiniGame_Poker,
    GameType.MiniGame_VideoPoker,
    GameType.MiniGame_ChanLe,
    GameType.MiniGame_CaoThap,
    GameType.MiniGame_RungMaQuai,
    GameType.GAME_VongQuayMayMan
];

var LobbyBottomBar = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setAnchorPoint(cc.p(0,0));
        this.setScale(cc.winSize.screenScale);

        var bg = new cc.Sprite("#bot_bar_bg.png");
        bg.setAnchorPoint(cc.p(0,0));
        bg.setPosition(cc.p(0,0));
        this.addChild(bg);

        var paymentButton = new ccui.Button("home_paymentBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        paymentButton.setPosition(640, 35);
        this.addChild(paymentButton);

        this._initAllMiniGame();
    },

    _initAllMiniGame : function () {
        var thiz = this;
        for(var i=0;i<s_home_bottom_bar_game_id.length;i++){
            (function () {
                var gameid = s_home_bottom_bar_game_id[i];
                var iconName = "minigame_icon_" + gameid.toString() + ".png";
                var gameIcon = new ccui.Button(iconName, "", "", ccui.Widget.PLIST_TEXTURE);
                gameIcon.setPosition(s_home_bottom_bar_game_position[i]);
                thiz.addChild(gameIcon);

                var gameLabel = new cc.Sprite("#minigame_label-" + gameid.toString() +".png");
                gameLabel.setPosition(gameIcon.x, 35);
                thiz.addChild(gameLabel);

                gameIcon.addClickEventListener(function () {
                    SceneNavigator.toGame(gameid);
                });
            })();

        }
    }
});