/**
 * Created by Quyet Nguyen on 7/21/2016.
 */

var GameTopBar = cc.Node.extend({
    ctor : function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.UserExitRoom, this.onUserExitRoom, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onExtensionCommand, this);

        var bg = new cc.Sprite("#home-top-bar.png");
        bg.setAnchorPoint(0.0, 1.0);
        bg.setPosition(0.0, cc.winSize.height);
        this.addChild(bg);

        this.backBt = new ccui.Button("ingame-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.backBt.setPosition(65, 653);
        this.addChild(this.backBt);

        this.settingBt = new ccui.Button("ingame-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.settingBt.setPosition(1220, this.backBt.y);
        this.addChild(this.settingBt);

        this.setAnchorPoint(0.0, 1.0);
        this.setContentSize(1280.0, 720.0);
        this.setPosition(0.0, 720.0);
        this.setScale(cc.winSize.screenScale);
    },
    onExit : function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },
    onUserExitRoom : function (messageType, contents) {
        if(PlayerMe.SFS.userId ==  contents.u){
            var homeScene = new HomeScene();
            var gameId = s_games_chanel_id[PlayerMe.SFS.gameType]
            homeScene.startLobby(gameId);
            cc.director.replaceScene(homeScene);
        }
    },
    onExtensionCommand : function (messageType, contents) {
        
    }
});


var IGameScene = IScene.extend({
    ctor : function () {
        this._super();
        this.type = "GameScene";
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this.sceneLayer.addChild(bg);

        var gameTopBar = new GameTopBar();
        this.addChild(gameTopBar);
        gameTopBar.backBt.addClickEventListener(function(){
           cc.log("gameTopBar addClickEventListener");
            SmartfoxClient.getInstance().sendExtensionRequest(PlayerMe.SFS.roomId,"quitRoom", null);
        });
    },
    onExit : function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },
    onSFSExtension : function (messageType, content) {
        if(content.c == "1"){ //startGame
            this.processPlayerPosition(content);
        }
        else if (content.c == "2"){ //user joinRoom
            this.processPlayerPosition(content);
        }
        else if (content.c == "9"){ //user exit
            this.processPlayerPosition(content);
        }
        else if (content.c == "13"){//reconnect
            this.processPlayerPosition(content);
        }
    },
    processPlayerPosition : function (content) {
        if(content.c == "1"){ //startGame
            var userList = content.p["5"];
            this.setPlayerWithPosition(userList);

            for(var i=0;i<this.allSlot.length;i++){
                this.allSlot[i].setEnable(false);
            }
            for(var i=0;i<userList.length;i++){
                var idx = userList[i]["4"];
                this.allSlot[idx].setEnable(true);
                this.allSlot[idx].setUsername(userList[i].u);
                this.allSlot[idx].setGold(userList[i]["3"]);
            }
        }
        else if (content.c == "2"){ //user joinRoom
            var idx = content.p["4"];
            this.allSlot[idx].setEnable(true);
            this.allSlot[idx].setUsername(content.p.u);
            this.allSlot[idx].setGold(content.p["3"]);
        }
        else if (content.c == "9"){ //user exit
            if(content.p.u != PlayerMe.username){
                for(var i=0;i<this.allSlot.length;i++){
                    if(this.allSlot[i].username == content.p.u){
                        this.allSlot[i].setEnable(false);
                        break;
                    }
                }
            }
            else{
                //me
            }
        }
        else if (content.c == "13"){//reconnect
            var userList = content.p["1"]["5"];
            this.setPlayerWithPosition(userList);

            for(var i=0;i<this.allSlot.length;i++){
                this.allSlot[i].setEnable(false);
            }
            for(var i=0;i<userList.length;i++){
                var idx = userList[i]["4"];
                this.allSlot[idx].setEnable(true);
                this.allSlot[idx].setUsername(userList[i].u);
                this.allSlot[idx].setGold(userList[i]["3"]);
            }
        }
    },
    setPlayerWithPosition : function (players) {
        //find me
        var idx = 0;
        for(var i=0;i<players.length;i++){
            if(players[i].u == PlayerMe.username){
                idx = players[i]["4"];
                break;
            }
        }
        var allSlot = [];
        for(var i=0;i<this.playerView.length;i++){
            allSlot[idx] = this.playerView[i];
            idx++;
            if(idx >= this.playerView.length){
                idx = 0;
            }
        }
        this.allSlot = allSlot;
    },
});