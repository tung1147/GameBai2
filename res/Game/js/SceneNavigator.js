/**
 * Created by Quyet Nguyen on 8/9/2016.
 */

var SceneNavigator = SceneNavigator || {};
SceneNavigator.toHome = function (message) {
    LobbyClient.getInstance().close();
    SmartfoxClient.getInstance().close();

    if(arguments.length == 0){
        var runningScene = cc.director.getRunningScene();
        if (runningScene.type == "HomeScene") {
            runningScene.startHome();
        }
        else {
            var homeScene = new HomeScene();
            homeScene.startHome();
            cc.director.replaceScene(homeScene);
        }
    }
    else{
        var runningScene = cc.director.getRunningScene();
        if (runningScene.type == "HomeScene") {
            runningScene.startHome();
            MessageNode.getInstance().show(message);
        }
        else {
            var homeScene = new HomeScene();
            homeScene.startHome();
            cc.director.replaceScene(homeScene);
            MessageNode.getInstance().showWithParent(message, homeScene.popupLayer);
        }
    }
};

SceneNavigator.toGame = function (message) {
    // if(arguments.length == 0){
    //     var runningScene = cc.director.getRunningScene();
    //     if (runningScene.type == "HomeScene") {
    //         runningScene.startHome();
    //     }
    //     else {
    //         var homeScene = new HomeScene();
    //         homeScene.startHome();
    //         cc.director.replaceScene(homeScene);
    //     }
    // }
    // else{
    //     var runningScene = cc.director.getRunningScene();
    //     if (runningScene.type == "HomeScene") {
    //         runningScene.startHome();
    //         MessageNode.getInstance().show(message);
    //     }
    //     else {
    //         var homeScene = new HomeScene();
    //         homeScene.startHome();
    //         cc.director.replaceScene(homeScene);
    //         MessageNode.getInstance().showWithParent(message, homeScene.popupLayer);
    //     }
    // }
};

SceneNavigator.toLobby = function (gameId,message) {

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
};
