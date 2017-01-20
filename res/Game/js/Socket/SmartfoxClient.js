/**
 * Created by Quyet Nguyen on 6/23/2016.
 */

var SmartfoxClient = (function () {
    var instance = null;
    var Clazz = cc.Class.extend({
        sfsSocket: null,

        ctor: function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.allListener = {};
                this.sfsSocket = new socket.SmartfoxClient();
                var thiz = this;
                this.sfsSocket.onEvent = function (eventName) {
                    thiz.onEvent(eventName);
                };
                this.sfsSocket.onMessage = function (messageType, data) {
                    thiz.onMessage(messageType, data);
                };

                this.addListener(socket.SmartfoxClient.Handshake, this._onHankShakeHandler, this);
                this.addListener(socket.SmartfoxClient.Login, this._onLoginHandler, this);
                this.addListener(socket.SmartfoxClient.JoinRoom, this._onJoinRoomHandler, this);
                this.addListener(socket.SmartfoxClient.UserExitRoom, this._onUserExitRoomHandler, this);
                this.addExtensionListener("1", this._onStartGameHandler, this);
                this.addExtensionListener("13", this._onReconnectHandler, this);
                this.addExtensionListener("262", this._onReconnectMiniGameHandler, this);
                this.addExtensionListener("fullRoom", this._onFullRoomHandler, this);
            }
        },

        isConnected: function () {
            if (this.sfsSocket) {
                return (this.sfsSocket.getStatus() == socket.SmartfoxClient.Connected);
            }
            return false;
        },
        sendHandShake: function () {
            var content = {
                cl: "C++ API",
                api: "1.6.3",
                bin: true,
                // rt : "reconnectionToken"
            };
            this.send(socket.SmartfoxClient.Handshake, content);
        },
        sendLogin: function () {
            var content = {
                zn: "GBVCity",
                un: "",
                pw: "",
                p: {
                    info: PlayerMe.SFS.info,
                    signature: PlayerMe.SFS.signature
                }
            };
            this.send(socket.SmartfoxClient.Login, content);
        },
        _sendFindAndJoinRoom: function (gameType, betting, roomId) {
            var params = {};
            if(gameType){
                params.gameType = gameType;
            }
            if(betting){
                params.betting = betting;
            }
            if(roomId){
                params.roomId = roomId;
            }
            this.sendExtensionRequest(-1, "findAndJoinGame", params);
        },
        sendLogout: function () {
            this.send(socket.SmartfoxClient.Logout, null);
        },
        sendJoinRoom: function (room) {
            var content = {};
            if (room.isString()) {
                if (room != "") {
                    content.n = room; //roomName
                }
            }
            else if (room.isNumber()) {
                if (room > -1) {
                    content.i = room; //roomId
                }
            }

            content.p = ""; //roomPass
            content.rl = 0; //roomIdToLeave
            content.sp = false; //asSpectator
            this.send(socket.SmartfoxClient.JoinRoom, content);
        },
        sendLeaveRoom: function (roomId) {
            var content = {
                r: roomId
            };
            this.send(socket.SmartfoxClient.LeaveRoom, content);
        },
        sendExtensionRequest: function (roomId, command, params) {
            if (params == null) {
                params = {};
            }
            var content = {
                r: roomId,
                c: command,
                p: params
            };
            this.send(socket.SmartfoxClient.CallExtension, content);
        },
        sendExtensionRequestCurrentRoom: function (command, params) {
            this.sendExtensionRequest(PlayerMe.SFS.roomId, command, params);
        },

        send: function (messageType, message) {
            if (this.sfsSocket) {
                if (message) {
                    this.sfsSocket.send(messageType, JSON.stringify(message));
                }
                else {
                    this.sfsSocket.send(messageType, "");
                }
            }
        },

        close: function () {
            if (this.sfsSocket) {
                this.sfsSocket.close();
            }
        },
        findAndJoinRoom: function (serverInfo, gameType, betting, roomId) {
            var thiz = this;
            this.connect(serverInfo, function () {
                thiz._sendFindAndJoinRoom(gameType, betting, roomId);
            });
        },
        joinMiniGame: function (serverInfo, joinCommand) {
            var thiz = this;
            this.connect(serverInfo, function () {
                thiz.sendExtensionRequest(-1, joinCommand, null);
            });
        },

        connect: function (serverInfo, afterLoginCallback) {
            this.lastRoomInfo = null;
            this._loginHandler = afterLoginCallback;

            if (this.sfsSocket) {
                if(this.sfsSocket.getStatus() == socket.SmartfoxClient.Connected){
                    if (this.currentServer == serverInfo.serverUrl) {
                        if (this._loginHandler) {
                            this._loginHandler();
                            this._loginHandler = null;
                        }
                        return;
                    }
                    else {
                        this.sfsSocket.close();
                    }
                }

                this.currentServer = serverInfo.serverUrl;
                if (cc.sys.isNative) {
                    this.sfsSocket.connect(serverInfo.host, serverInfo.port);
                }
                else {
                    //var url = "ws://" + host + ":" + port + "/websocket";
                    this.sfsSocket.connect(serverInfo.webSocketUrl);
                }
            }
        },
        onEvent: function (eventName) {
            if (eventName == "Connected") {
                //send handshake
                this.sendHandShake();
            }
            else if (eventName == "ConnectFailure") {
                LoadingDialog.getInstance().hide();
                MessageNode.getInstance().show("Lỗi kết nối máy chủ");
            }
            else if (eventName == "LostConnection") {
                var runningScene = cc.director.getRunningScene();
                if (runningScene.type != "GameScene") {
                    LoadingDialog.getInstance().hide();
                    MessageNode.getInstance().show("Mất kết nối máy chủ");
                }
            }
            this.postEvent(socket.SmartfoxClient.SocketStatus, eventName);
        },

        onMessage: function (messageType, data) {
            var content = JSON.parse(data);

            //ext
            if(messageType === socket.SmartfoxClient.CallExtension){
                var cmd = "ext_" + content.c;
                this.postEvent(cmd, content);
            }

            this.postEvent(messageType, content);
        },
        addListener: function (messageType, _listener, _target) {
            var arr = this.allListener[messageType];
            if (!arr) {
                arr = [];
                this.allListener[messageType] = arr;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].target == _target) {
                    return;
                }
            }
            arr.push({
                listener: _listener,
                target: _target
            });
        },

        addExtensionListener : function (command, _listener, _target) {
            var msgType = "ext_" + command;
            this.addListener(msgType, _listener, _target);
        },

        removeListener: function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i]&& arr[i].target == target) {
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
        postEvent: function (messageType, params) {
            cc.log("messageType : " + messageType);
            cc.log(params);

            var arr = this.allListener[messageType];
            if (arr) {
                this.isBlocked = true;
                for (var i = 0; i < arr.length;) {
                    var target = arr[i];
                    if (target) {
                        target.listener.apply(target.target, [messageType, params]);
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
        _createGameSceneWithGameType: function (gameType) {
            PlayerMe.gameType = gameType;

            if (gameType == s_games_chanel[GameType.GAME_TienLenMN]) {
                return new TienLen();
            }
            else if (gameType == s_games_chanel[GameType.GAME_Sam]) {
                return new Sam();
            }
            else if (gameType == s_games_chanel[GameType.GAME_Phom]) {
                return new Phom();
            }
            else if (gameType == s_games_chanel[GameType.GAME_TLMN_Solo]) {
                return new TLMNSolo();
            }
            else if (gameType == s_games_chanel[GameType.GAME_Sam_Solo]) {
                return new SamSolo();
            }
            else if (gameType == s_games_chanel[GameType.GAME_XocDia]) {
                return new XocDiaScene();
            }
            else if (gameType == s_games_chanel[GameType.GAME_TaiXiu]) {
                return new TaiXiuScene();
            }
            else if (gameType == s_games_chanel[GameType.GAME_BaCay]) {
                return new BaCay();
            }
            else if (gameType == s_games_chanel[GameType.GAME_MauBinh]){
                return new MauBinh();
            }
            else if (gameType == s_games_chanel[GameType.GAME_Poker]){
                return new Poker();
            }
            return null;
        },

        _onHankShakeHandler : function (messageType, contents) {
            if (contents.tk && contents.tk.length > 0) {
                this.sendLogin();
            }
        },

        _onLoginHandler : function (messageType, contents) {
            if (contents.ec) { //login error
                LoadingDialog.getInstance().hide();
                var scene = cc.director.getRunningScene();
                if (scene.type == "GameScene") {
                    //return home
                }
                else {
                    MessageNode.getInstance().show("Lỗi đăng nhập máy chủ");
                }
            }
            else {
                PlayerMe.SFS.userId = contents.id;
                if (this._loginHandler) {
                    this._loginHandler();
                    this._loginHandler = null;
                }
            }
        },

        _onJoinRoomHandler : function (messageType, contents) {
            if(contents.ec){

            }
            else{
                PlayerMe.SFS.roomId = contents.r[0];
            }
        },

        _onUserExitRoomHandler : function (messageType, contents) {
            var userId = contents.u;
            if (PlayerMe.SFS.userId == userId) {
                PlayerMe.SFS.roomId = -1;
            }
        },

        _onStartGameHandler : function (cmd, contents) {
            LoadingDialog.getInstance().hide();

            var scene = cc.director.getRunningScene();
            if (scene.type == "GameScene") {
                cc.log("return");
                return false;
            }
            var gameInfo = contents.p;
            var gameName = gameInfo["r"];
            var gameType = gameInfo["g"];
            var gameScene = this._createGameSceneWithGameType(gameType);
            if (gameScene) {
                LoadingDialog.getInstance().hide();
                cc.director.replaceScene(new cc.TransitionFade(0.5, gameScene, cc.color("#000000")));
            }
        },

        _onReconnectHandler : function (cmd, contents) {
            LoadingDialog.getInstance().hide();

            var scene = cc.director.getRunningScene();
            if (scene.type == "GameScene") {
                return false;
            }
            var gameInfo = contents.p["1"];
            var gameName = gameInfo["r"];
            var gameType = gameInfo["g"];

            var gameScene = this._createGameSceneWithGameType(gameType);

            if (gameScene) {
                cc.director.replaceScene(gameScene);
            }

            PlayerMe.gameType = gameType;
        },

        _onReconnectMiniGameHandler : function (cmd, contents) {
            LoadingDialog.getInstance().hide();

            var scene = cc.director.getRunningScene();
            if (scene.type == "GameScene") {
                return false;
            }
            var gameScene;
            var group = contents.p["group"];
            if (group == "mini.caothap") {
                //gameScene = new CaoThapScene();
                // PlayerMe.gameType = GameType.MiniGame_CaoThap;
                SceneNavigator.toMiniGame(GameType.MiniGame_CaoThap,true);
                LoadingDialog.getInstance().hide();
            }
            else if (group == "mini.videopoker") {
                //gameScene = new VideoPockerScene();
                //PlayerMe.gameType = GameType.MiniGame_VideoPoker;
                SceneNavigator.toMiniGame(GameType.MiniGame_VideoPoker,true);
                LoadingDialog.getInstance().hide();
            }
            if (gameScene) {
                gameScene.isReconnect = true;
                cc.director.replaceScene(gameScene);
            }
        },

        _onFullRoomHandler : function (cmd, contents) {
            LoadingDialog.getInstance().hide();
            MessageNode.getInstance().show("Phòng đầy");
        },


        prePostEvent: function (messageType, contents) {
            cc.log("messageType : " + messageType);
            cc.log("contents : ", contents);
            // if (messageType === socket.SmartfoxClient.Handshake) {
            //     if (contents.tk && contents.tk.length > 0) {
            //         this.sendLogin();
            //     }
            // }
            // else if (messageType === socket.SmartfoxClient.Login) {
            //     if (contents.ec) { //login error
            //         LoadingDialog.getInstance().hide();
            //         var scene = cc.director.getRunningScene();
            //         if (scene.type == "GameScene") {
            //             //return home
            //         }
            //         else {
            //             MessageNode.getInstance().show("Lỗi đăng nhập máy chủ");
            //         }
            //     }
            //     else {
            //         PlayerMe.SFS.userId = contents.id;
            //         if (this._loginHandler) {
            //             this._loginHandler();
            //             this._loginHandler = null;
            //         }
            //     }
            // }
            // else if (messageType === socket.SmartfoxClient.JoinRoom) {
            //     PlayerMe.SFS.roomId = contents.r[0];
            //     // contents.roomData = SmartfoxUtils.getRoomInfo(contents.r);
            //     // contents.userList = [];
            //     // var ul = contents["ul"];
            //     // for(var i=0;i<ul.length;i++){
            //     //     contents.userList.push(SmartfoxUtils.getUserInfo(ul[i]));
            //     // }
            //     //
            //     // this.lastRoomInfo = contents.roomData;
            //     // this.lastRoomInfo.userList = contents.userList;
            // }
            // // else if(messageType === socket.SmartfoxClient.UserEnterRoom){
            // //     contents.userInfo = SmartfoxUtils.getUserInfo(contents.u);
            // //     this.lastRoomInfo.userList.push(contents.userInfo);
            // // }
            // else if (messageType === socket.SmartfoxClient.UserExitRoom) {
            //     var userId = contents.u;
            //     if (PlayerMe.SFS.userId == userId) {
            //         PlayerMe.SFS.roomId = -1;
            //       //  this.lastRoomInfo = null;
            //     }
            //     // else{
            //     //     var userList = this.lastRoomInfo.userList;
            //     //     for(var i=0;i<userList.length;i++){
            //     //         if(userList[i].userId === userId){
            //     //             userList.splice(i, 1);
            //     //             break;
            //     //         }
            //     //     }
            //     // }
            // }
            // else if (messageType === socket.SmartfoxClient.CallExtension) {
            //     if (contents.c == "1") { //startgame
            //         var scene = cc.director.getRunningScene();
            //         if (scene.type == "GameScene") {
            //             cc.log("return");
            //             return false;
            //         }
            //         var gameInfo = contents.p;
            //         var gameName = gameInfo["r"];
            //         var gameType = gameInfo["g"];
            //         var gameScene = this._createGameSceneWithGameType(gameType);
            //         if (gameScene) {
            //             LoadingDialog.getInstance().hide();
            //             cc.director.replaceScene(new cc.TransitionFade(0.5, gameScene, cc.color("#000000")));
            //         }
            //     }
            //     else if (contents.c == "13") { //reconnect
            //         var scene = cc.director.getRunningScene();
            //         if (scene.type == "GameScene") {
            //             return false;
            //         }
            //         var gameInfo = contents.p["1"];
            //         var gameName = gameInfo["r"];
            //         var gameType = gameInfo["g"];
            //
            //         var gameScene = this._createGameSceneWithGameType(gameType);
            //
            //         if (gameScene) {
            //             cc.director.replaceScene(gameScene);
            //         }
            //
            //         PlayerMe.gameType = gameType;
            //         // LobbyClient.getInstance().gameChannel = gameType;
            //         //  PlayerMe.SFS.gameType = gameType;
            //     }
            //     else if (contents.c == "262") { // reconnect mini game
            //         var scene = cc.director.getRunningScene();
            //         if (scene.type == "GameScene") {
            //             return false;
            //         }
            //         var gameScene;
            //         var group = contents.p["group"];
            //         if (group == "mini.caothap") {
            //             //gameScene = new CaoThapScene();
            //             // PlayerMe.gameType = GameType.MiniGame_CaoThap;
            //             SceneNavigator.toMiniGame(GameType.MiniGame_CaoThap,true);
            //             LoadingDialog.getInstance().hide();
            //         }
            //         else if (group == "mini.videopoker") {
            //             //gameScene = new VideoPockerScene();
            //             //PlayerMe.gameType = GameType.MiniGame_VideoPoker;
            //             SceneNavigator.toMiniGame(GameType.MiniGame_VideoPoker,true);
            //             LoadingDialog.getInstance().hide();
            //         }
            //         if (gameScene) {
            //             gameScene.isReconnect = true;
            //             cc.director.replaceScene(gameScene);
            //         }
            //     }
            //     else if (contents.c == "fullRoom") {
            //         // full room
            //         LoadingDialog.getInstance().hide();
            //         MessageNode.getInstance().show("Room đã đầy");
            //     }
            // }
            return false;
        }
    });

    Clazz.getInstance = function () {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };

    return Clazz;
})();