/**
 * Created by anhvt on 12/5/2016.
 */

var MiniGameController = cc.Class.extend({
    ctor: function () {

    },

    initWithView: function (view) {
        this._view = view;
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.SocketStatus, this.onSmartfoxSocketStatus, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
        LobbyClient.getInstance().addListener("getLastSessionInfo", this.onGetLastSessionInfo, this);
    },

    releaseController: function () {
        this.requestQuitRoom();
        SmartfoxClient.getInstance().removeListener(this);
        LobbyClient.getInstance().removeListener(this);
    },

    onSmartfoxSocketStatus: function (type, eventName) {
        if (eventName == "LostConnection") {
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            LobbyClient.getInstance().requestGetLastSessionInfo();
        }
    },

    onSFSExtension: function (messageType, content) {
        switch (content.c) {
            case "260": // thong tin game
                this._view.setupMucCuoc(content.p.data["1"]); // cac muc cuoc
                this._view.performChangeRewardFund(content.p.data["2"]); // thay doi hu thuong
                break;

            case "100002": // danh sach cao thu
                this._view.showTopPlayersDialog(content.p.data["1"]);
                break;

            case "100001": // lich su no hu
                this._view.showExplosionHistoryDialog(content.p.data["1"]);
                break;

            case "100003": // lich su nguoi choi
                this._view.showHistoryDialog(content.p.data["1"]);
                break;

            case "0": // thay doi vang
                this._view.onChangeAssets(content.p["2"],content.p["1"]);
        }
    },

    onGetLastSessionInfo: function (command, eventData) {
        var info = eventData.data.lastSessionInfo;
        if (info) {
            var host = info.ip;
            var port = info.port;
            if (host && port) {
                //LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                SmartfoxClient.getInstance().findAndJoinRoom(host, port);
                return;
            }
        }
        this._view.backToHomeScene();
    },

    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "405", null);
    },

    sendJoinGame: function () {
        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo.ip, 8888, "404");
    },

    sendGetTopRequest : function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "402", null);
    },

    sendGetExplosionHistory : function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1,"403",null);
    },

    sendGetUserHistory : function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1,"401",null);
    }
});