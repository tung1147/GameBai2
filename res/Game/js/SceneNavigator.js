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
