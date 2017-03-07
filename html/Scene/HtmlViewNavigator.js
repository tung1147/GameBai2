/**
 * Created by Quyet Nguyen on 3/7/2017.
 */

var ViewNavigator = cc.Class.extend({
    ctor : function () {
       this._initListener();
    },

    _initListener : function () {
        LobbyClient.getInstance().addListener("login", this._onLoginFinished, this);
        LobbyClient.getInstance().addListener("error", this._onError, this);
        LobbyClient.getInstance().addListener("LobbyStatus", this._onLobbyStatusHandler, this);
        LobbyClient.getInstance().addListener("kicked", this._onKicked, this);
    },

    _removeListener : function (cmd, event) {
        LobbyClient.getInstance().removeListener(this);
        cc.log("_removeListener 111");
    },

    _onLoginFinished : function (cmd, event) {
        this._removeListener();
        if (event.status == 0) { //login ok
            this._onLoginSuccess();
        }
    },

    _onError : function (cmd, event) {
        this._removeListener();
    },

    _onKicked : function (cmd, event) {
        this._removeListener();
    },

    _onLobbyStatusHandler : function (cmd, event) {
        if (event === "ConnectFailure" || event === "LostConnection") {
            this._removeListener();
        }
    },

    _onLoginSuccess : function () {

    },

    execute : function () {
     //   if(LobbyClient.getInstance().isLogined

        var loginType = cc.Global.GetSetting("lastLoginType", "");
        if(loginType == "normalLogin"){
            var username = cc.Global.getSaveUsername();
            var password = cc.Global.getSavePassword();
            if(username != "" && password != ""){
                LobbyClient.getInstance().loginNormal(username, password, true);
            }
            else{
                this._removeListener();
                var dialog = new LoginDialog();
                dialog.show();
            }
        }
        else if(loginType == "facebookLogin"){
            FacebookPlugin.getInstance().showLogin();
        }
        else{
            var dialog = new LoginDialog();
            dialog.show();
            this._removeListener();
        }
    }
});

var ViewNavigatorLobby = ViewNavigator.extend({
    ctor : function (gameId) {
        this._super();
        this.gameId = gameId;
    },

    _onLoginSuccess : function () {
        this._super();

        var homeScene = cc.director.getRunningScene();
        homeScene.onTouchGame(this.gameId);
    }
});

var ViewNavigatorManager = ViewNavigatorManager || {};
ViewNavigatorManager.execute = function () {
    // window.onhashchange = function () {
    //     ViewNavigatorManager.execute();
    // };

    var hash = window.location.hash;
    if(hash == "#lobby"){
        var view = new ViewNavigator();
        view.execute();
        return true;
    }
    else if(hash == "#tlmn"){
        var view = new ViewNavigatorLobby(GameType.GAME_TienLenMN);
        view.execute();
        return true;
    }
    else if(hash == "#tlmn_solo"){
        var view = new ViewNavigatorLobby(GameType.GAME_TLMN_Solo);
        view.execute();
        return true;
    }
    else if(hash == "#sam"){
        var view = new ViewNavigatorLobby(GameType.GAME_Sam);
        view.execute();
        return true;
    }
    else if(hash == "#sam_solo"){
        var view = new ViewNavigatorLobby(GameType.GAME_Sam_Solo);
        view.execute();
        return true;
    }
    else if(hash == "#bacay"){
        var view = new ViewNavigatorLobby(GameType.GAME_BaCay);
        view.execute();
        return true;
    }
    else if(hash == "#taixiu"){
        var view = new ViewNavigatorLobby(GameType.GAME_TaiXiu);
        view.execute();
        return true;
    }
    else if(hash == "#xocdia"){
        var view = new ViewNavigatorLobby(GameType.GAME_XocDia);
        view.execute();
        return true;
    }

    else if(hash == "#maubinh"){
        var view = new ViewNavigatorLobby(GameType.GAME_MauBinh);
        view.execute();
        return true;
    }

    return false;
};

