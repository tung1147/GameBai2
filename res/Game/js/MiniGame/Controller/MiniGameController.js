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
        this._view = null;
        SmartfoxClient.getInstance().removeListener(this);
        LobbyClient.getInstance().removeListener(this);

        this.requestQuitRoom();
    },

    onSmartfoxSocketStatus: function (type, eventName) {
        if (eventName == "LostConnection") {
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            LobbyClient.getInstance().requestGetLastSessionInfo();
        }
    },

    onSFSExtension: function (messageType, content) {
        switch (content.c) {
            case "100000":
                this._view.performChangeRewardFund(content.p.data["1"]);
                break;
            case "260": // thong tin game
                //this._view.setupMucCuoc(content.p.data["bts"]); // cac muc cuoc
                this._view.performChangeRewardFund(content.p.data["pbs"]); // thay doi hu thuong
                break;

            case "262": // reconnect
                this.onReconnect(content.p);
                break;

            case "0": // thay doi vang
                this.onChangeAssets(content.p["2"], content.p["1"]);
                break;
            case "___err___":
                this._view.onError(content.p);
                break;
        }
    },

    onReconnect: function (param) {

    },

    onChangeAssets: function (gold, changeAmount) {
        this._view.onChangeAssets(gold, changeAmount);
    },

    onGetLastSessionInfo: function (command, eventData) {
        var info = eventData.data.lastSessionInfo;
        if (info) {
            var host = info.ip;
            var port = info.port;
            if (host && port) {
                LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                SmartfoxClient.getInstance().connect(host, port);
                return;
            }
        }
        this._view.backToHomeScene();
    },

    requestQuitRoom: function () {
    },

    sendJoinGame: function () {
    },

    sendGetTopRequest: function () {
    },

    sendGetExplosionHistory: function () {
    },

    sendGetUserHistory: function () {
    }
});