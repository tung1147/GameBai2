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
                }
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
        sendFindAndJoinRoom: function () {
            if (PlayerMe.SFS.roomId) {
                var params = {
                    gameType: PlayerMe.gameType,//PlayerMe.SFS.gameType,
                    betting: PlayerMe.SFS.betting,
                    roomId: PlayerMe.SFS.roomId
                };
                this.sendExtensionRequest(-1, "findAndJoinGame", params);
                PlayerMe.SFS.roomId = null;
            }
            else {
                var params = {
                    gameType: PlayerMe.gameType,//PlayerMe.SFS.gameType,
                    betting: PlayerMe.SFS.betting,
                };
                this.sendExtensionRequest(-1, "findAndJoinGame", params);
            }
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
            var content = {
                r: roomId,
                c: command
            };
            if (params) {
                content.p = params;
            }
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
        findAndJoinRoom: function (host, port) {
            if (this.sfsSocket.getStatus() == socket.SmartfoxClient.Connected) {
                if (this.currentHost == host && this.currentPort == port) {
                    this.sendFindAndJoinRoom();
                }
                else {
                    this.sfsSocket.close();
                    this.connect(host, port);
                }
            }
            else {
                this.connect(host, port);
            }
        },
        connect: function (host, port) {
            if (this.sfsSocket) {
                this.currentHost = host;
                this.currentPort = port;
                this.sfsSocket.connect(host, port);
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
        removeListener: function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i].target == target) {
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
            this.prePostEvent(messageType, params);
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
        prePostEvent: function (messageType, contents) {
            cc.log("messageType : " + messageType);
            cc.log("contents : ", contents);
            if (messageType === socket.SmartfoxClient.Handshake) {
                if (contents.tk && contents.tk.length > 0) {
                    this.sendLogin();
                }
            }
            else if (messageType === socket.SmartfoxClient.Login) {
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
                    var isReconnect = contents.p.isReconnect;
                    if (isReconnect == false) {
                        this.sendFindAndJoinRoom();
                    }
                }
            }
            else if (messageType === socket.SmartfoxClient.JoinRoom) {
                PlayerMe.SFS.roomId = contents.r[0];
            }
            else if (messageType === socket.SmartfoxClient.UserExitRoom) {
                if (PlayerMe.SFS.userId == contents.u) {
                    PlayerMe.SFS.roomId = -1;
                }
            }
            else if (messageType === socket.SmartfoxClient.CallExtension) {
                if (contents.c == "1") { //startgame
                    var scene = cc.director.getRunningScene();
                    if (scene.type == "GameScene") {
                        cc.log("return");
                        return false;
                    }
                    var gameInfo = contents.p;
                    var gameName = gameInfo["r"];
                    var gameType = gameInfo["g"];
                    var gameScene = null;
                    if (gameType == "tlmn_tudo") {
                        gameScene = new TienLen();
                    }
                    else if (gameType == "sam_tudo" || gameType == "sam_solo")
                        gameScene = new Sam();

                    if (gameScene) {
                        LoadingDialog.getInstance().hide();
                        cc.director.replaceScene(new cc.TransitionFade(0.5, gameScene, cc.color("#000000")));
                    }
                }
                else if (contents.c == "13") { //reconnect
                    var scene = cc.director.getRunningScene();
                    if (scene.type == "GameScene") {
                        return false;
                    }
                    var gameInfo = contents.p["1"];
                    var gameName = gameInfo["r"];
                    var gameType = gameInfo["g"];

                    var gameScene = null;
                    if (gameType == "tlmn_tudo") {
                        gameScene = new TienLen();
                    }
                    else if (gameType == "sam_tudo" || gameType == "sam_solo")
                        gameScene = new Sam();
                    if (gameScene) {
                        cc.director.replaceScene(gameScene);
                    }

                    PlayerMe.gameType = gameType;
                    // LobbyClient.getInstance().gameChannel = gameType;
                    //  PlayerMe.SFS.gameType = gameType;
                }
                else if (contents.c == "fullRoom"){
                    // full room
                    LoadingDialog.getInstance().hide();
                    MessageNode.getInstance().show("Room đã đầy");
                }
            }
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