/**
 * Created by Quyet Nguyen on 8/9/2016.
 */

var SceneNavigator = SceneNavigator || {};
SceneNavigator.toHome = function (message) {
   // LobbyClient.getInstance().close();
   // SmartfoxClient.getInstance().close();

    var homeScene = cc.director.getRunningScene();
    if (homeScene.type == "HomeScene") {
        homeScene.startHome();
    }
    else {
        homeScene = new HomeScene();
        homeScene.startHome();
        cc.director.replaceScene(homeScene);
    }

    if(message){
        MessageNode.getInstance().showWithParent(message, homeScene.messageLayer);
    }

    if(s_MiniPokerLayer){
        s_MiniPokerLayer.hide();
    }

    if(s_VideoPokerLayer){
        s_VideoPokerLayer.hide();
    }

    if(s_CaoThapLayer){
        s_CaoThapLayer.hide();
    }
};

SceneNavigator.toLobby = function (message) {
    SmartfoxClient.getInstance().close();

    var homeScene = cc.director.getRunningScene();
    if (homeScene.type == "HomeScene") {
        homeScene.startGame();
    }
    else {
        homeScene = new HomeScene();
        homeScene.startGame();
        cc.director.replaceScene(homeScene);
    }

    if(message){
        MessageNode.getInstance().showWithParent(message, homeScene.messageLayer);
    }

    if(s_MiniPokerLayer){
        s_MiniPokerLayer.hide();
    }

    if(s_VideoPokerLayer){
        s_VideoPokerLayer.hide();
    }

    if(s_CaoThapLayer){
        s_CaoThapLayer.hide();
    }
};

SceneNavigator.toGame = function (message) {

};

SceneNavigator.toGame = function (gameId,message) {

};

SceneNavigator.toMiniGame = function (gameId, isReconnect) {
    // if (gameId == GameType.GAME_VongQuayMayMan) {
    //     var vongquay = new VongQuayScene();
    //     cc.director.replaceScene(new cc.TransitionFade(0.5, vongquay, cc.color("#000000")));
    // }
    // if (gameId == GameType.MiniGame_CaoThap) {
    //     var caothap = new CaoThapScene();
    //     cc.director.replaceScene(new cc.TransitionFade(0.5, caothap, cc.color("#000000")));
    // }
    // else if (gameId == GameType.MiniGame_Poker) {
    //     var minipoker = new MiniPokerScene();
    //     cc.director.replaceScene(new cc.TransitionFade(0.5, minipoker, cc.color("#000000")));
    // }
    // else if (gameId == GameType.MiniGame_VideoPoker) {
    //     var videopoker = new VideoPockerScene();
    //     cc.director.replaceScene(new cc.TransitionFade(0.5, videopoker, cc.color("#000000")));
    // }

    //new minigame
    if (gameId == GameType.GAME_VongQuayMayMan) {
        var vongquay = new VongQuayScene();
        cc.director.replaceScene(new cc.TransitionFade(0.5, vongquay, cc.color("#000000")));
        return;
    }
    if (gameId == GameType.MiniGame_CaoThap) {
        // var popup = new CaoThapLayer();
        // popup.show();
        CaoThapLayer.showPopup();
    }
    else if (gameId == GameType.MiniGame_Poker) {
        // var popup = new MiniPokerLayer();
        // popup.show();
        MiniPokerLayer.showPopup();
    }
    else if (gameId == GameType.MiniGame_VideoPoker) {
        // var popup = new VideoPokerLayer();
        // popup.show();
        VideoPokerLayer.showPopup();
    }

    if(isReconnect){
        LobbyClient.getInstance().postEvent("miniGameReconnect", null);
    }
};

SceneNavigator.showLoginNormal = function () {
    var dialog = new LoginDialog();
    dialog.show();
};

SceneNavigator.showLoginFacebook = function () {
    FacebookPlugin.getInstance().showLogin();
};

SceneNavigator.showSignup = function () {
    var dialog = new SignupDialog();
    dialog.show();
};