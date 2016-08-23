/**
 * Created by Quyet Nguyen on 6/23/2016.
 *
 *
 *
 */
var LobbyClient = (function() {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.allListener = {};
                this.host = "10.0.1.106";
                this.port = 9999;
                this.isKicked = false;
                this.lobbySocket = new socket.LobbyClient(socket.LobbyClient.TCP);
                this.loginHandler = null;
                this.isReconnected = false;

                var thiz = this;
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);
                };
                cc.director.getScheduler().scheduleUpdateForTarget(this,0,false);
            }
        },
        update : function (dt) {
            if(this.isReconnected){
                if(this.reconnectTimeout > 0.0){
                    this.reconnectTimeout -= dt;
                }
                else{
                    this.onRequestTimeout();
                    this.isReconnected = false;
                }
            }
        },
        send: function(message) {
            if(this.lobbySocket){
                this.lobbySocket.send(JSON.stringify(message));
            }
        },
        close: function() {
            this.isReconnected = false;
            if(this.lobbySocket){
                this.lobbySocket.close();
            }
        },
        connect : function () {
            if(this.lobbySocket){
                this.isKicked = false;
                this.lobbySocket.connect(this.host, this.port);
            }
        },
        onEvent : function (messageName, data) {
            if(messageName == "socketStatus"){
                this.postEvent("LobbyStatus", data);
            }
            else if(messageName == "message"){
                var messageData = JSON.parse(data);
                if(messageData.command == "error"){
                    LobbyClient.ErrorHandle(messageData.errorCode);
                }

                this.postEvent(messageData.command, messageData);
            }
        },
        prePostEvent : function (command, event) {
            if(command === "LobbyStatus"){
                if(event === "Connected"){
                    this.isReconnected = false;
                    if(this.loginHandler){
                        this.loginHandler();
                    }
                }
                else if(event === "ConnectFailure"){
                    if(this.isReconnected){
                        this.connect();
                    }
                    else{
                        LoadingDialog.getInstance().hide();
                        MessageNode.getInstance().show("Lỗi kết nối máy chủ");
                    }
                }
                else if(event === "LostConnection"){
                    if(!this.isKicked){
                        this.reconnect();
                    }
                }
            }
            else if(command === "kicked"){
                this.isKicked = true;
                var runningScene = cc.director.getRunningScene();
                LoadingDialog.getInstance().hide();
                var message = "Bạn bị sút khỏi máy chủ";
                if(event.code == 1){
                    message = "Tài khoản đăng nhập tại thiết bị khác";
                }
                if(runningScene.type == "HomeScene"){
                    runningScene.startHome();
                    MessageNode.getInstance().show(message);
                }
                else{
                    var homeScene = new HomeScene();
                    homeScene.startHome();
                    cc.director.replaceScene(homeScene);
                    MessageNode.getInstance().showWithParent(message, homeScene.popupLayer);
                }
                LobbyClient.getInstance().close();
                SmartfoxClient.getInstance().close();
            }
            else if(command === "login"){
                if(event.status == 0){
                    this.onLoginEvent(event);
                    if(this.loginSuccessHandler){
                        this.loginSuccessHandler();
                        this.loginSuccessHandler = null;
                    }
                }
            }
            else if (command === "register"){
                if(this.loginSuccessHandler){
                    this.loginSuccessHandler();
                    this.loginSuccessHandler = null;
                }
            }
            else if(command === "getGameServer"){
                var data = event.data;
                if(this.betting == data.betting){
                    PlayerMe.SFS.betting = data.betting;
                    PlayerMe.gameType = data.gameType;
                    SmartfoxClient.getInstance().findAndJoinRoom(data.host, data.port);
                };
            }
            else if(command === "verifyCode"){
                PlayerMe.verify = true;
                PlayerMe.phoneNumber = event.data.telephone;
            }
        },
        onLoginEvent : function (event) {
            var data = event.data;
            GameConfig.broadcastMessage = event.data.broadcast;
            LevelData = data.config.levelData;
            VipData = data.config.vipData;
            PlayerMe.gold = data.userAssets.gold;
            PlayerMe.exp = data.userAssets.exp;
            PlayerMe.vipExp = data.userAssets.vipExp;
            PlayerMe.spin = data.userAssets.spin;
            PlayerMe.phoneNumber = data.telephone;
            PlayerMe.SFS.info = data.info;
            PlayerMe.SFS.signature = event.signature;

            var userinfo = JSON.parse(data.info);
            PlayerMe.username = userinfo.username;

            var lastSessionInfo = data.lastSessionInfo;
            PlayerMe.gameType = "";
            PlayerMe.SFS.betting = 0;
            if(lastSessionInfo.ip && lastSessionInfo.port){ // reconnect
                LoadingDialog.getInstance().setMessage("Đang vào lại phòng chơi");
                SmartfoxClient.getInstance().findAndJoinRoom(lastSessionInfo.ip, lastSessionInfo.port);
            }
            else{
                LoadingDialog.getInstance().hide();
                var runningScene = cc.director.getRunningScene();
                if(runningScene.type == "HomeScene"){
                    if(runningScene.homeLocation == 1){
                        runningScene.startGame();
                    }
                }
            }
        },
        postEvent : function (command, event) {
            this.prePostEvent(command, event);
            var arr = this.allListener[command];
            if(arr){
                this.isBlocked = true;
                for(var i=0;i<arr.length;){
                    var target = arr[i];
                    if(target){
                        target.listener.apply(target.target, [command, event]);
                    }
                    else{
                        arr.splice(i,1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }
        },
        addListener : function (command, _listener, _target) {
            var arr = this.allListener[command];
            if(!arr){
                arr = [];
                this.allListener[command] = arr;
            }
            for(var i=0;i<arr.length;i++){
                if(arr[i].target == _target){
                    return;
                }
            }
            arr.push({
                listener : _listener,
                target : _target
            });
        },
        removeListener : function (target) {
            for (var key in this.allListener) {
                if(!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for(var i=0;i<arr.length;){
                    if(arr[i].target == target){
                        if(this.isBlocked){
                            arr[i] = null;
                        }
                        else{
                            arr.splice(i,1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        },
        /*****/
        checkIMEI : function () {
            if(!PlayerMe.IMEI){
                PlayerMe.IMEI = SystemPlugin.getInstance().getDeviceUUIDWithKey(PlayerMe.DeviceIDKey);
                if(!PlayerMe.IMEI){
                    MessageNode.getInstance().show("Bạn phải đăng nhập tài khoản Google");
                    LoadingDialog.getInstance().hide();
                    return false;
                }
            }
            return true;
        },
        login : function (username, password,redirectFromSignup) {
            var thiz = this;
            this.loginHandler = function () {
                var loginRequest = {
                    command : "login",
                    platformId : ApplicationConfig.PLATFORM,
                    bundleId : ApplicationConfig.BUNBLE,
                    version : ApplicationConfig.VERSION,
                    imei : PlayerMe.IMEI,
                    type : "normal",
                    username : username,
                    password : password
                };
                thiz.send(loginRequest);
            };
            if(redirectFromSignup){
                LoadingDialog.getInstance().setMessage("Đang đăng nhập");
                this.loginHandler();
            }
            else{
                this.connect();
            }
        },
        loginNormal : function (username, password,isSave) {
            if(!this.checkIMEI()){
                return;
            }

            var thiz = this;
            this.loginSuccessHandler = function () {
                if(isSave){
                    cc.Global.SetSetting("username", username);
                    cc.Global.SetSetting("password", password);
                }
                else{
                    cc.Global.SetSetting("username", "");
                    cc.Global.SetSetting("password", "");
                }
            };
            this.login(username, password);
        },
        quickLogin : function () {
            if(!this.checkIMEI()){
                return;
            }
            this.loginSuccessHandler = null;
        },
        loginFacebook : function () {
            if(!this.checkIMEI()){
                return;
            }
            this.loginSuccessHandler = null;
        },
        signup : function (username, password) {
            if(!this.checkIMEI()){
                return;
            }
            this.loginSuccessHandler = null;
            var thiz = this;
            this.loginHandler = function () {
                thiz.loginSuccessHandler = function () {
                    thiz.login(username, password, true);
                    if(cc.Global.GetSetting("savePassword", true)){
                        cc.Global.SetSetting("username", username);
                        cc.Global.SetSetting("password", password);
                    }
                };
                var loginRequest = {
                    command : "register",
                    platformId : ApplicationConfig.PLATFORM,
                    bundleId : ApplicationConfig.BUNBLE,
                    version : ApplicationConfig.VERSION,
                    imei : PlayerMe.IMEI,
                    username : username,
                    password : password
                };
                thiz.send(loginRequest);
            };
            this.connect();
        },
        reconnect : function () {
            var runningScene = cc.director.getRunningScene();
            if(runningScene.type == "HomeScene"){
                if(runningScene.homeLocation == 1){
                    if(LoadingDialog.getInstance().isShow()){
                        LoadingDialog.getInstance().hide();
                        MessageNode.getInstance().show("Mất kết nối máy chủ");
                        LobbyClient.getInstance().close();
                        SmartfoxClient.getInstance().close();
                    }
                    return;
                }
                else{
                    //reconnect with loading
                    LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                }
               // MessageNode.getInstance().show("Hết thời gian kết nối máy chủ");
            }
            else{
                //reconnect not loading
            }

            this.reconnectTimeout = 30.0;
            this.isReconnected = true;
            this.connect();
        },
        onRequestTimeout : function () {
            LoadingDialog.getInstance().hide();
            var runningScene = cc.director.getRunningScene();
            if(runningScene.type == "HomeScene"){
                if(runningScene.homeLocation != 1){
                    runningScene.startHome();
                }
                MessageNode.getInstance().show("Hết thời gian kết nối máy chủ");
            }
            else{
                var scene = new HomeScene();
                scene.startHome();
                MessageNode.getInstance().showWithParent("Hết thời gian kết nối máy chủ",  scene.popupLayer);
                cc.director.replaceScene(scene);
            }
            LobbyClient.getInstance().close();
            SmartfoxClient.getInstance().close();
        },
        subscribe : function (gameId) {
            PlayerMe.gameType = s_games_chanel[gameId];
            var request = {
                command : "subscribeChannel",
                gameType : PlayerMe.gameType
            };
            this.send(request);
        },
        unSubscribe : function () {
            var request = {
                command : "unsubscribeChannel",
                gameType : PlayerMe.gameType
            };
            this.send(request);
        },
        requestGetServer : function (betting) {
            this.betting = betting;
            var request = {
                command : "getGameServer",
                gameType : PlayerMe.gameType,
                betting : betting
            };
            this.send(request);
        }
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    }

    return Clazz;
})();