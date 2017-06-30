/**
 * Created by anhvt on 12/5/2016.
 */


// s_sfs_error_msg[10] = "Không đủ tiền để quay";
s_sfs_error_msg[0] = "Hack detected";

var SlotFruitController = cc.Class.extend({
    ctor: function (view) {

        this.initWithView(view);
    },

    initWithView: function (view) {
        this._view = view;
        this.gameGroup = "mini.fruitsslot";
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.SocketStatus, this.onSmartfoxSocketStatus, this);

        SmartfoxClient.getInstance().addExtensionListener("___err___", this.onSFSError, this);
        SmartfoxClient.getInstance().addExtensionListener("100000", this._onPerformChangeRewardFund, this);
        SmartfoxClient.getInstance().addExtensionListener("1008", this._onJoinGame, this);
        SmartfoxClient.getInstance().addExtensionListener("1010", this._onReconnect, this);
        SmartfoxClient.getInstance().addExtensionListener("1011", this._onFreeSpin, this);
        SmartfoxClient.getInstance().addExtensionListener("1001", this._onResuftRotate, this);
        SmartfoxClient.getInstance().addExtensionListener("1012", this._onResuftTry, this);
        SmartfoxClient.getInstance().addExtensionListener("1009", this._onExitGame, this);
        SmartfoxClient.getInstance().addExtensionListener("1003", this._onNhanThuong, this);
        SmartfoxClient.getInstance().addExtensionListener("-1", this.onSFSChangeAssets, this);
        SmartfoxClient.getInstance().addExtensionListener("1002", this._onBonus, this);
        SmartfoxClient.getInstance().addExtensionListener("100005", this._onNohu, this);
        SmartfoxClient.getInstance().addExtensionListener("1004", this._onLucky, this);
        LobbyClient.getInstance().addListener("getLastSessionInfo", this.onGetLastSessionInfo, this);
    },

    releaseController: function () {
        this._view = null;
        SmartfoxClient.getInstance().removeListener(this);
        LobbyClient.getInstance().removeListener(this);

        this.requestQuitRoom();
    },

    onSFSError: function (messageType, content) {
        var params = content["p"];
        var gameName = params["groupName"];
        if(gameName === this.gameGroup){
            this._view.onError(params);

            return true;
        }
        return false;
    },

    onSFSChangeAssets: function (messageType, content) {
        var params = content.p;
        var reason = params["r"];
        if(reason >= 0){
            if(params["1"] !== null & params["1"] !== undefined){
                this._view.updateGold( params["1"]);
                this._view.changeGoldEffect( params["d"]);
            }
        }
    },

    onSmartfoxSocketStatus: function (type, eventName) {
        if (eventName === "LostConnection") {
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            LobbyClient.getInstance().requestGetLastSessionInfo();
           // this._view.backToHomeScene();
        }
    },
    
        _onPerformChangeRewardFund : function (messageType, content) {
        if (content.p.group !== this.gameGroup){
            return;
        }

        this._view.performChangeRewardFund(content.p.data["1"]);
    },

    _onJoinGame : function(messageType, content){
        if (content.p.group !== this.gameGroup){
            return;
        }



       this._view.initHuThuong(content.p.data["pbs"]); // thay doi hu thuong
        cc.log(content);
        this._view.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
            LoadingDialog.getInstance().hide();
        })));
    },
    _onFreeSpin:function (messageType, content) {
        this.onFreeSpin(content.p["data"]);
    },

    _onReconnect : function (messageType, content) {
        if (content.p.group !== this.gameGroup){
            return;
        }
        this._view.initHuThuong(content.p.data["pbs"]);
        this.onReconnect(content.p["data"]);
        this._view.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
            LoadingDialog.getInstance().hide();
        })));
    },
    _onNhanThuong:function (messageType, content) {
        this._view.onNhanThuong();
    },
    _onNohu:function (messageType, content) {

        this._view.showJackpot ();
    },
    _onLucky:function (messageType, content) {

        this.onLucky(content.p["data"]);
    },

    _onBonus:function (messageType, content) {

        this.onBonus(content.p["data"]);
    },

    _onExitGame:function (messageType, content) {
        this._view.exitToGame();
    },
    _onResuftRotate:function (messageType, content) {
        cc.log("aaaa");
        if (content.p.group !== this.gameGroup){
            return;
        }
        this.onResuftRotate(content.p["data"]);
    },
    _onResuftTry:function (messageType, content) {
        cc.log("aaaa");
        if (content.p.group !== this.gameGroup){
            return;
        }
        this.onResuftTry(content.p["data"]);
    },

    onSFSExtension: function (messageType, content) {
        // switch (content.c) {
        //
        //     case "100000":
        //         this._view.performChangeRewardFund(content.p.data["1"]);
        //         break;
        //     case "260": // thong tin game
        //         //this._view.setupMucCuoc(content.p.data["bts"]); // cac muc cuoc
        //         this._view.performChangeRewardFund(content.p.data["pbs"]); // thay doi hu thuong
        //         cc.log(content);
        //         break;
        //
        //     case "262": // reconnect
        //         this.onReconnect(content.p);
        //         break;
        // }
    },
    onResuftRotate:function (param) {
        this._view.lblID.setString("ID: "+ param[1]);

        this._view.handleResuftZ(false,param);
    },
    onResuftTry:function (param) {
        this._view.lblID.setString("ID: "+ param[1]);

        this._view.handleResuftZ(false,param);
    },

    onFreeSpin:function (param) {

        this._view.onFreeSpin(param);
    },
    onReconnect: function (param) {
        var arrItem = param["10"]["2"];
        var arrLine = param["10"]["3"]["1"];
        this._view.lblID.setString("ID: "+  param["10"]["1"]);
       // this._view.handleResuft(true,arrItem,arrLine,param["10"]["4"],param["10"]["5"]);

        var arrLineSelect = param["10"]["8"];
        this._view.showNumLineReconnect(arrLineSelect,param["10"]["7"]-1);
        this._view.handleResuftZ(true,param["10"]);
    },
    onBonus:function (param) {
        this._view.onBonus(param[1],param[2],param[3]);
    },
    onLucky:function (param) {
        if(param[3])
        {
            this._view.openAllLucky(param[3],param[4]);
        }
        else {
            this._view.openOneLucky(param[2],param[1]);
        }

    },

    onChangeAssets: function (gold, changeAmount) {
        if (changeAmount < 0) {
            return;
        }
        this._view.onChangeAssets(gold, changeAmount);
    },

    onGetLastSessionInfo: function (command, eventData) {
        var info = eventData.data.lastSessionInfo;
        if (info && info.ip && info.port) {
            var serverInfo = LobbyClient.getInstance().createServerInfo(info);
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            SmartfoxClient.getInstance().connect(serverInfo);
            return;
        }
        else {
            //LoadingDialog.getInstance().hide();
        }
        this._view.exitToGame();
    },

    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1009", null);
    },

    sendJoinGame: function () {

        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo, "1008");
    },
    sendRouteRequest:function (lineBets,indexBet) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1001", {2: lineBets, 1: indexBet});//,3:1  7 bonus -1 no hu 8 la free
    },
    sendRouteRequest3:function (lineBets,indexBet,line1,line2,line3) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1001", {2: lineBets, 1: indexBet,4:line1,5:line2,6:line3});//,3:1  7 bonus -1 no hu 8 la free
    },
    sendRouteRequestCh:function (lineBets,indexBet,id) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1001", {2: lineBets, 1: indexBet,3:id});//,3:1  7 bonus -1 no hu 8 la free
    },
    sendRouteRequestTry:function (lineBets,indexBet,id) {
        cc.log("id gui " + id);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1012", {2: lineBets, 1: indexBet,3:id});//,3:1  7 bonus -1 no hu 8 la free
    },
    sendBonus:function (idBonus) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1002", {1: idBonus});
    },
    sendGetTopRequest: function () {
    },
    sendGiveGold:function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1003", null);
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1007", null);
    },
    sendHistory:function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1005", null);
    },
    sendGetUserHistory: function () {
    }
});