/**
 * Created by Quyet Nguyen on 6/23/2016.
 *
 *
 *
 */

if (cc.sys.isNative) { //mobile
    var s_lobbyServer = s_lobbyServer || [
        {
            host: "42.112.25.169",
            port: 9999
        }
    ];r
}
else { //websocket
    var s_lobbyServer = s_lobbyServer || [
        "ws://125.212.193.172:8887/websocket"
    ];
}

var LobbyClient = (function () {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,
        ctor: function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                var thiz = this;

                this.allListener = {};
                this.serverIndex = 0;
                this.isKicked = false;
                this.loginHandler = null;
                this.isReconnected = false;
                this.isLogined = false;

                this.lobbySocket = new socket.LobbyClient(socket.LobbyClient.TCP);
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);
                };
                cc.director.getScheduler().scheduleUpdateForTarget(this, 0, false);

                this.addListener("LobbyStatus", this._onLobbyStatusHandler, this);
                this.addListener("error", this._onErrorHandler, this);
                this.addListener("popupMessage", this._onPopupMessage, this);
                this.addListener("kicked", this._onKickedHandler, this);
                this.addListener("login", this._onLoginHandler, this);
                this.addListener("register", this._onRegisterHandler, this);
                this.addListener("getGameServer", this._onGetGameServerHandler, this);
                this.addListener("verifyCode", this._onVerifyCodeHandler, this);
                this.addListener("verifyCodeBySms", this._onVerifyCodeBySmsHandler, this);
                this.addListener("changeAsset", this._onChangeAssetHandler, this);
                this.addListener("inventory", this._onInventoryHandler, this);
                this.addListener("updateItem", this._onUpdateItemHandler, this);
                this.addListener("inboxMessage", this._onInboxMessageHandler, this);
                this.addListener("news", this._onNewsHandler, this);
                this.addListener("markReadedMessageInbox", this._onMarkReadedMessageInboxHandler, this);
                this.addListener("fetchProducts", this._onFetchProductsHandler, this);
                this.addListener("fetchCashinProductItems", this._onFetchCashinProductItemsHandler, this);
            }
        },
        update: function (dt) {
            if (this.isReconnected) {
                if (this.reconnectTimeout > 0.0) {
                    this.reconnectTimeout -= dt;
                }
                else {
                    //  this.onRequestTimeout();
                    this.isReconnected = false;
                }
            }
        },
        send: function (message) {
            if (this.lobbySocket) {
                cc.log(message);
                this.lobbySocket.send(JSON.stringify(message));
            }
        },
        close: function () {
            this.isReconnected = false;
            if (this.lobbySocket) {
                this.lobbySocket.close();
            }
        },
        connect: function () {
            if (this.lobbySocket) {
                this.isLogined = false;
                PlayerMe.avatar = "";

                if(this.serverIndex >= s_lobbyServer.length){
                    this.serverIndex = 0;
                }

                this.isKicked = false;
                if (cc.sys.isNative) {
                    this.lobbySocket.connect(s_lobbyServer[this.serverIndex].host, s_lobbyServer[this.serverIndex].port);
                }
                else {
                    this.lobbySocket.connect(s_lobbyServer[this.serverIndex]);
                }

                this.serverIndex++;
            }
        },
        onEvent: function (messageName, data) {
            if (messageName == "socketStatus") {
                this.postEvent("LobbyStatus", data);
            }
            else if (messageName == "message") {
                var messageData = JSON.parse(data);
                // if (messageData.command == "error") {
                //     LobbyClient.ErrorHandle(messageData.errorCode);
                // }

                this.postEvent(messageData.command, messageData);
            }
        },

        _onLobbyStatusHandler : function (cmd, event) {
            this.isLogined = false;
            if (event === "Connected") {
                this.isReconnected = false;
                if (this.loginHandler) {
                    this.loginHandler();
                }
            }
            else if (event === "ConnectFailure") {
                if (this.isReconnected) {
                    this.connect();
                }
                else {
                    LoadingDialog.getInstance().hide();
                    MessageNode.getInstance().show("Lỗi kết nối máy chủ");
                }
            }
            else if (event === "LostConnection") {
                if (!this.isKicked) {
                    this.reconnect();
                }
            }
        },

        _onErrorHandler : function (cmd, event) {
            var errMsg = event["errorMessage"];
            if(errMsg && errMsg != ""){
                LoadingDialog.getInstance().hide();
                MessageNode.getInstance().show(errMsg);
            }
            else{
                LobbyClient.ErrorHandle(event.errorCode);
            }
        },

        _onPopupMessage : function (cmd, event) {
            var data = event.data;
            var title = data.title;
            if(!title || title == ""){
                title = "Thông báo";
            }
            var msg = data["message"];

            var dialog = new MessageDialog();
            dialog.setTitle(title);
            dialog.setMessage(msg);
            dialog.showWithAnimationScale();
        },

        _onKickedHandler : function (cmd, event) {
            this.isKicked = true;
            var runningScene = cc.director.getRunningScene();
            LoadingDialog.getInstance().hide();
            var message = "Bạn bị sút khỏi máy chủ";
            if (event.code == 1) {
                message = "Tài khoản đăng nhập tại thiết bị khác";
            }
            else if(event.code == 2){
                message = "Bạn bị kicked bởi admin";
            }
            else if(event.code == 5){
                message = "Tài khoản đã bị khóa";
            }

            SceneNavigator.toHome(message);
        },

        _onLoginHandler : function (cmd, event) {
            if (event.status == 0) {
                this.isLogined = true;
                if(this.lastRequestLogin){
                    cc.Global.SetSetting("lastLoginType", this.lastRequestLogin);
                }

               // this.onLoginEvent(event);
                PlayerMe.messageCount = 0;

                var data = event.data;
                //   GameConfig.broadcastMessage = event.data.broadcast;
//            LevelData = data.config.levelData;
                //           VipData = data.config.vipData;
                PlayerMe.gold = data.userAssets.gold;
                PlayerMe.exp = data.userAssets.exp;
                PlayerMe.vipExp = data.userAssets.vipExp;
                PlayerMe.spin = data.userAssets.spin;
                PlayerMe.phoneNumber = data.telephone;
                PlayerMe.SFS.info = data.info;
                PlayerMe.SFS.signature = event.signature;
                var userinfo = JSON.parse(data.info);
                PlayerMe.username = userinfo.username;
                PlayerMe.gameType = "";
                PlayerMe.SFS.betting = 0;

                //server list
                var serverData = data["server"];
                if (serverData) {
                    this.SFSServerInfo = {};
                    for (var i = 0; i < serverData.length; i++) {
                        var serverInfo = this.createServerInfo(serverData[i]);
                        serverInfo.serverId = serverData[i].serverId;
                        this.SFSServerInfo[serverInfo.serverId] = serverInfo;
                    }
                }

                //minigame server
                var miniGameServer = data["miniGameInfo"];
                PlayerMe.miniGameInfo = this.createServerInfo(miniGameServer);

                var lastSessionInfo = data.lastSessionInfo;
                if (lastSessionInfo.ip && lastSessionInfo.port) { // reconnect
                    this.reconnectSmartfox(this.createServerInfo(lastSessionInfo));
                }
                else { // to Home
                    LoadingDialog.getInstance().hide();
                    SceneNavigator.toLobby();
                }

                if (this.loginSuccessHandler) {
                    this.loginSuccessHandler();
                    this.loginSuccessHandler = null;
                }
            }
            else{
                var message = event["statusMessage"];
                if(!message){
                    var errorHandler = LobbyClient.Error[event.status];
                    if(errorHandler){
                        message = errorHandler.message;
                    }
                }

                if(message){
                    SceneNavigator.toHome(message);
                }
                else{
                    SceneNavigator.toHome();
                }
            }
        },

        _onRegisterHandler : function (cmd, event) {
            if (this.loginSuccessHandler) {
                this.loginSuccessHandler();
                this.loginSuccessHandler = null;
            }
        },

        _onGetGameServerHandler : function (cmd, event) {
            var data = event.data;
            if (this.betting == data.betting) {
                PlayerMe.SFS.betting = data.betting;
                PlayerMe.gameType = data.gameType;

                if (cc.sys.isNative) {
                    var _port = data.port;
                }
                else {
                    var _port = data.webSocketPort;
                }
                SmartfoxClient.getInstance().findAndJoinRoom(data.host, _port, data.betting, data.gameType);
            }
        },

        _onVerifyCodeHandler : function (cmd, event) {
            PlayerMe.verify = true;
            PlayerMe.phoneNumber = event.data.telephone;
        },

        _onVerifyCodeBySmsHandler : function (cmd, event) {
            PlayerMe.verify = true;
            PlayerMe.phoneNumber = event.data.telephone;
        },

        _onChangeAssetHandler : function (cmd, event) {
            PlayerMe.gold = event["data"]["userAssets"]["gold"];
        },

        _onInventoryHandler : function (cmd, event) {
            var items = event["data"];
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == 1) {
                    PlayerMe.avatar = items[i]["avtUrl"];
                }
            }
        },

        _onUpdateItemHandler : function (cmd, event) {
            var data = event["data"];
            if(data && data["avtUrl"]){
                PlayerMe.avatar = data["avtUrl"];
            }
        },

        _onInboxMessageHandler : function (cmd, event) {
            PlayerMe.messageCount = event["data"]["numberMessUnread"];
        },

        _onNewsHandler : function (cmd, event) {
            var broadcast = event["data"]["broadcast"];
            if (broadcast) {
                GameConfig.broadcastMessage = broadcast;
            }
        },

        _onMarkReadedMessageInboxHandler : function (cmd, event) {
            var msgCount = event["data"]["numberMessUnread"];
            PlayerMe.messageCount = msgCount;
        },

        _onFetchCashinProductItemsHandler : function (cmd, event) {
            var data = event["data"]["2"];
            cc.Global.SMSList = [];
            for (var i = 0; i < data.length; i++) {
                var currency = data[i]["currency"];
                var smsGateway = data[i]["detail"]["smsGateway"];
                var vmsContent = data[i]["detail"]["vmsContent"];
                var vnpContent = data[i]["detail"]["vnpContent"];
                var vttContent = data[i]["detail"]["vttContent"];
                var gold = data[i]["gold"];
                var id = data[i]["id"];
                var price = data[i]["price"];
                cc.Global.SMSList.push({
                    currency: currency,
                    smsGateway: smsGateway,
                    vmsContent: vmsContent,
                    vnpContent: vnpContent,
                    vttContent: vttContent,
                    gold: parseInt(gold.replace(",", "")),
                    id: id,
                    price: parseInt(price)
                });
            }
        },

        _onFetchProductsHandler : function (cmd, event) {
            cc.Global.thecaoData = event["data"]["1"];
            cc.Global.tienmatData = event["data"]["2"];
            cc.Global.dailyData = event["data"]["3"];
            cc.Global.vatphamData = event["data"]["4"];
        },


        prePostEvent: function (command, event) {
            // if (command === "LobbyStatus") {
            //     if (event === "Connected") {
            //         this.isReconnected = false;
            //         if (this.loginHandler) {
            //             this.loginHandler();
            //         }
            //     }
            //     else if (event === "ConnectFailure") {
            //         if (this.isReconnected) {
            //             this.connect();
            //         }
            //         else {
            //             LoadingDialog.getInstance().hide();
            //             MessageNode.getInstance().show("Lỗi kết nối máy chủ");
            //         }
            //     }
            //     else if (event === "LostConnection") {
            //         if (!this.isKicked) {
            //             this.reconnect();
            //         }
            //     }
            // }
            // else if (command === "kicked") {
            //     this.isKicked = true;
            //     var runningScene = cc.director.getRunningScene();
            //     LoadingDialog.getInstance().hide();
            //     var message = "Bạn bị sút khỏi máy chủ";
            //     if (event.code == 1) {
            //         message = "Tài khoản đăng nhập tại thiết bị khác";
            //     }
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
            //     LobbyClient.getInstance().close();
            //     SmartfoxClient.getInstance().close();
            // }
            // else if (command === "login") {
            //     if (event.status == 0) {
            //         this.onLoginEvent(event);
            //         if (this.loginSuccessHandler) {
            //             this.loginSuccessHandler();
            //             this.loginSuccessHandler = null;
            //         }
            //     }
            // }
            // else if (command === "register") {
            //     if (this.loginSuccessHandler) {
            //         this.loginSuccessHandler();
            //         this.loginSuccessHandler = null;
            //     }
            // }
            // else if (command === "getGameServer") {
            //     var data = event.data;
            //     if (this.betting == data.betting) {
            //         PlayerMe.SFS.betting = data.betting;
            //         PlayerMe.gameType = data.gameType;
            //
            //         if (cc.sys.isNative) {
            //             var _port = data.port;
            //         }
            //         else {
            //             var _port = data.webSocketPort;
            //         }
            //         SmartfoxClient.getInstance().findAndJoinRoom(data.host, _port, data.betting, data.gameType);
            //     }
            // }
            // else if (command === "verifyCode") {
            //     PlayerMe.verify = true;
            //     PlayerMe.phoneNumber = event.data.telephone;
            // }
            // else if (command === "verifyCodeBySms") {
            //     PlayerMe.verify = true;
            //     PlayerMe.phoneNumber = event.data.telephone;
            // }
            // else if (command === "changeAsset") {
            //     PlayerMe.gold = event["data"]["userAssets"]["gold"];
            //     // cc.log("Lobbyclient : " + PlayerMe.gold);
            // }
            // else if (command === "inventory") {
            //     var items = event["data"];
            //     for (var i = 0; i < items.length; i++) {
            //         if (items[i].id == 1) {
            //             PlayerMe.avatar = items[i]["avtId"];
            //         }
            //     }
            // }
            // else if (command === "inboxMessage") {
            //     PlayerMe.messageCount = event["data"]["numberMessUnread"];
            // }
            // else if (command === "news") {
            //     var broadcast = event["data"]["broadcast"];
            //     if (broadcast) {
            //         GameConfig.broadcastMessage = broadcast;
            //     }
            // }
            // else if (command === "markReadedMessageInbox") {
            //     var msgCount = event["data"]["numberMessUnread"];
            //     PlayerMe.messageCount = msgCount;
            // }
            // else if (command === "fetchProducts") {
            //     cc.Global.thecaoData = event["data"]["1"];
            //     cc.Global.tienmatData = event["data"]["2"];
            //     cc.Global.dailyData = event["data"]["3"];
            //     cc.Global.vatphamData = event["data"]["4"];
            // }
            // else if (command === "fetchCashinProductItems") {
            //     var data = event["data"]["2"];
            //     cc.Global.SMSList = [];
            //     for (var i = 0; i < data.length; i++) {
            //         var currency = data[i]["currency"];
            //         var smsGateway = data[i]["detail"]["smsGateway"];
            //         var vmsContent = data[i]["detail"]["vmsContent"];
            //         var vnpContent = data[i]["detail"]["vnpContent"];
            //         var vttContent = data[i]["detail"]["vttContent"];
            //         var gold = data[i]["gold"];
            //         var id = data[i]["id"];
            //         var price = data[i]["price"];
            //         cc.Global.SMSList.push({
            //             currency: currency,
            //             smsGateway: smsGateway,
            //             vmsContent: vmsContent,
            //             vnpContent: vnpContent,
            //             vttContent: vttContent,
            //             gold: parseInt(gold.replace(",", "")),
            //             id: id,
            //             price: parseInt(price)
            //         });
            //     }
            // }
        },
        onLoginEvent: function (event) {
            //  cc.log(event);
//             PlayerMe.messageCount = 0;
//
//             var data = event.data;
//             //   GameConfig.broadcastMessage = event.data.broadcast;
// //            LevelData = data.config.levelData;
//             //           VipData = data.config.vipData;
//             PlayerMe.gold = data.userAssets.gold;
//             PlayerMe.exp = data.userAssets.exp;
//             PlayerMe.vipExp = data.userAssets.vipExp;
//             PlayerMe.spin = data.userAssets.spin;
//             PlayerMe.phoneNumber = data.telephone;
//             PlayerMe.SFS.info = data.info;
//             PlayerMe.SFS.signature = event.signature;
//             PlayerMe.miniGameInfo = data.miniGameInfo;
//
//             var userinfo = JSON.parse(data.info);
//             PlayerMe.username = userinfo.username;
//
//             var lastSessionInfo = data.lastSessionInfo;
//             PlayerMe.gameType = "";
//             PlayerMe.SFS.betting = 0;
//             if (lastSessionInfo.ip && lastSessionInfo.port) { // reconnect
//                 this.reconnectSmartfox(lastSessionInfo.ip, lastSessionInfo.port);
//             }
//             else { // to Home
//                 LoadingDialog.getInstance().hide();
//                 var runningScene = cc.director.getRunningScene();
//                 if (runningScene.type == "HomeScene") {
//                     if (runningScene.homeLocation == 1) {
//                         runningScene.startGame();
//                     }
//                 }
//             }
//
//             var serverData = data["server"];
//             if (serverData) {
//                 this.SFSServerInfo = {};
//                 for (var i = 0; i < serverData.length; i++) {
//                     var serverId = serverData[i].serverId;
//                     var host = serverData[i].host;
//                     if (cc.sys.isNative) {
//                         var port = serverData[i].port;
//                     }
//                     else {
//                         var port = serverData[i].websocketPort;
//                     }
//
//                     var serverInfo = {
//                         serverId: serverId,
//                         host: host,
//                         port: port
//                     };
//                     this.SFSServerInfo[serverId] = serverInfo;
//                 }
//             }
        },
        postEvent: function (command, event) {
           // this.prePostEvent(command, event);
            var arr = this.allListener[command];
            if (arr) {
                this.isBlocked = true;
                for (var i = 0; i < arr.length;) {
                    var target = arr[i];
                    if (target) {
                        target.listener.apply(target.target, [command, event]);
                    }
                    else {
                        arr.splice(i, 1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }
        },
        addListener: function (command, _listener, _target) {
            var arr = this.allListener[command];
            if (!arr) {
                arr = [];
                this.allListener[command] = arr;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].target == _target) {
                    return;
                }
            }
            arr.push({
                listener: _listener,
                target: _target
            });
        },
        removeListener: function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i] && arr[i].target == target) {
                        if (this.isBlocked) {
                            arr[i] = null;
                        }
                        else {
                            arr.splice(i, 1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        },
        /*****/
        checkIMEI: function () {
            if (!PlayerMe.IMEI) {
                PlayerMe.IMEI = SystemPlugin.getInstance().getDeviceUUIDWithKey(PlayerMe.DeviceIDKey);
                if (!PlayerMe.IMEI) {
                    MessageNode.getInstance().show("Bạn phải đăng nhập tài khoản Google");
                    LoadingDialog.getInstance().hide();
                    return false;
                }
            }
            return true;
        },
        login: function (username, password, redirectFromSignup) {
            var thiz = this;
            this.loginHandler = function () {
                var loginRequest = {
                    command: "login",
                    platformId: ApplicationConfig.PLATFORM,
                    bundleId: ApplicationConfig.BUNDLE,
                    version: ApplicationConfig.VERSION,
                    imei: PlayerMe.IMEI,
                    displayType: ApplicationConfig.DISPLAY_TYPE,
                    type: "normal",
                    username: username,
                    password: password
                };
                cc.log(loginRequest);
                thiz.send(loginRequest);
            };
            if (redirectFromSignup) {
                LoadingDialog.getInstance().setMessage("Đang đăng nhập");
                this.loginHandler();
            }
            else {
                this.connect();
            }
        },
        loginNormal: function (username, password, isSave) {
            this.lastRequestLogin = "normalLogin";

            if (!this.checkIMEI()) {
                return;
            }

            var thiz = this;
            this.loginSuccessHandler = function () {
                if (isSave) {
                    cc.Global.setSaveUsername(username);
                    cc.Global.setSavePassword(password);
                }
                else {
                    cc.Global.setSaveUsername("");
                    cc.Global.setSavePassword("");
                }
            };
            this.login(username, password);
        },
        quickLogin: function () {
            this.lastRequestLogin = "quickLogin";
            if (!this.checkIMEI()) {
                return;
            }
            this.loginSuccessHandler = null;
        },
        loginFacebook: function (accessToken) {
            this.lastRequestLogin = "facebookLogin";
            if (!this.checkIMEI()) {
                return;
            }

            this.loginSuccessHandler = null;

            var thiz = this;
            this.loginHandler = function () {
                var loginRequest = {
                    command: "login",
                    platformId: ApplicationConfig.PLATFORM,
                    bundleId: ApplicationConfig.BUNDLE,
                    version: ApplicationConfig.VERSION,
                    imei: PlayerMe.IMEI,
                    displayType: ApplicationConfig.DISPLAY_TYPE,
                    type: "facebook",
                    username: "",
                    password: "",
                    accessToken: accessToken
                };
                cc.log(loginRequest);
                thiz.send(loginRequest);
            };

            this.connect();
        },

        tokenLogin : function (token) {
            this.lastRequestLogin = "tokenLogin";
            if (!this.checkIMEI()) {
                return;
            }

            this.loginSuccessHandler = null;

            var thiz = this;
            this.loginHandler = function () {
                var loginRequest = {
                    command: "login",
                    platformId: ApplicationConfig.PLATFORM,
                    bundleId: ApplicationConfig.BUNDLE,
                    version: ApplicationConfig.VERSION,
                    imei: PlayerMe.IMEI,
                    displayType: ApplicationConfig.DISPLAY_TYPE,
                    type: "token",
                    accessToken: token
                };
                cc.log(loginRequest);
                thiz.send(loginRequest);
            };

            this.connect();
        },

        signup: function (username, password, telephone, gender) {
            if (!this.checkIMEI()) {
                return;
            }
            this.loginSuccessHandler = null;
            var thiz = this;
            var _username = username;
            var _password = password;
            var _telephone = telephone;
            var _gender =  gender;

            this.loginHandler = function () {
                thiz.loginSuccessHandler = function () {
                    thiz.login(username, password, true);
                    if (cc.Global.GetSetting("savePassword", true)) {
                        cc.Global.setSavePassword(_password);
                        cc.Global.setSaveUsername(_username);
                    }
                };
                var signupRequest = {
                    command: "register",
                    platformId: ApplicationConfig.PLATFORM,
                    bundleId: ApplicationConfig.BUNDLE,
                    version: ApplicationConfig.VERSION,
                    imei: PlayerMe.IMEI,
                    username: _username,
                    password: _password
                };
                if(_telephone && _telephone != ""){
                    signupRequest.telephone = _telephone;
                }
                signupRequest.gender = _gender ? "male" : "female";
                thiz.send(signupRequest);
            };
            this.connect();
        },
        reconnect: function () {
            var runningScene = cc.director.getRunningScene();
            if (runningScene.type == "HomeScene") {
                if (runningScene.homeLocation == 1) {
                    if (LoadingDialog.getInstance().isShow()) {
                        LoadingDialog.getInstance().hide();
                        MessageNode.getInstance().show("Mất kết nối máy chủ");
                        LobbyClient.getInstance().close();
                        SmartfoxClient.getInstance().close();
                    }
                    return;
                }
                else {
                    //reconnect with loading
                    LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                }
                // MessageNode.getInstance().show("Hết thời gian kết nối máy chủ");
            }
            else {
                //reconnect not loading
            }

            this.reconnectTimeout = 30.0;
            this.isReconnected = true;
            this.connect();
        },

        reconnectSmartfox: function (serverInfo) {
            if (SmartfoxClient.getInstance().isConnected()) {
                LoadingDialog.getInstance().hide();
            }
            else {
                LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                SmartfoxClient.getInstance().connect(serverInfo);
            }
        },
        subscribe: function (gameId, group) {
            //      cc.log("send subscribeChannel: "+gameId);
            PlayerMe.gameType = s_games_chanel[gameId];
            var request = {
                command: "subscribeChannel",
                gameType: PlayerMe.gameType
            };
            if (PlayerMe.gameType == "ShakeDisk" || PlayerMe.gameType == "TaiXiu") {

            }
            else {
                if (group) {
                    PlayerMe.lastGroupSelected = group;
                }
                if (PlayerMe.lastGroupSelected) {
                    request.group = PlayerMe.lastGroupSelected;
                }
            }

            this.send(request);
        },
        unSubscribe: function () {
            var request = {
                command: "unsubscribeChannel",
                gameType: PlayerMe.gameType
            };
            this.send(request);
        },
        requestGetServer: function (betting) {
            this.betting = betting;
            var request = {
                command: "getGameServer",
                gameType: PlayerMe.gameType,
                betting: betting
            };
            this.send(request);
        },
        requestGetLastSessionInfo: function () {
            var request = {
                command: "getLastSessionInfo"
            };
            this.send(request);
        },

        createServerInfo : function (serverData) {
            var serverInfo = {};
            var host = serverData["host"];
            if(!host){
                host = serverData["ip"];
            }

            if (cc.sys.isNative) {
                var port = serverData.port;
                serverInfo.host = host;
                serverInfo.port = port;
                serverInfo.serverUrl = host + ":" + port;
            }
            else {
                var url = serverData["wssPath"];
                if(!url){
                    var port = serverData["websocketPort"];
                    if(!port){
                        port = serverData["webSocketPort"];
                    }
                    if(!port){
                        port = serverData.port;
                    }
                    url = "ws://" + host + ":" + port + "/websocket";
                }
                serverInfo.webSocketUrl = url;
                serverInfo.serverUrl = url;

                // var port = serverData["websocketPort"];
                // if(!port){
                //     port = serverData["webSocketPort"];
                // }
                // if(!port){
                //     port = serverData["port"];
                // }
                // var url = "ws://" + host + ":" + port + "/websocket";
                // serverInfo.webSocketUrl = url;
                // serverInfo.serverUrl = url;
            }
            return serverInfo;
        },
    });

    Clazz.getInstance = function () {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };

    return Clazz;
})();