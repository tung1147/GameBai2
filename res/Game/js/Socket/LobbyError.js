/**
 * Created by Quyet Nguyen on 7/20/2016.
 */

//require("js/Socket/LobbyClient.js");
//require("js/Socket/SmartfoxClient.js");

var LobbyClient = LobbyClient || {};
LobbyClient.Error = {
    6 : {
        message : "Tài khoản không tồn tại",
        closeSocket : true,
        toHome : false,
    },
    7 : {
        message : "Sai mật khẩu", //change password
        closeSocket : false,
        toHome : false,
    },
    28 : {
        message : "Sai mật khẩu", //login
        closeSocket : true,
        toHome : false,
    },
    10 : {
        message : "Tài khoản đã tồn tại",
        closeSocket : true,
        toHome : false,
    },
    15 : {
        message : "Bạn không thể gửi yêu cầu trong 5 phút",
        closeSocket : false,
        toHome : false,
    }
};

LobbyClient.ErrorHandle = function (errorCode) {
    LoadingDialog.getInstance().hide();
    var errorHandler = LobbyClient.Error[errorCode];
    if(!errorHandler){
        errorHandler = {
            message : "Có lỗi xảy ra [" + errorCode +"]",
            closeSocket : true,
            toHome : true
        }
    }
    if(errorHandler.toHome){
        var runningScene = cc.director.getRunningScene();
        if(runningScene.type == "HomeScene"){
            if(runningScene.homeLocation != 1){
                runningScene.startHome();
            }
            MessageNode.getInstance().show(errorHandler.message);
        }
        else{
            var scene = new HomeScene();
            scene.startHome();
            MessageNode.getInstance().showWithParent(errorHandler.message,  scene.popupLayer);
            cc.director.replaceScene(scene);
        }
    }
    else{
        MessageNode.getInstance().show(errorHandler.message);
    }
    if(errorHandler.closeSocket){
        LobbyClient.getInstance().close();
        SmartfoxClient.getInstance().close();
    }
};

