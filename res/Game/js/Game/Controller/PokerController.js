/**
 * Created by VGA10 on 1/19/2017.
 */

 PK_ACTION_PLAYER_VIEW = 0;
     PK_ACTION_PLAYER_BET = 1;
     PK_ACTION_PLAYER_ALL_IN = 2;
     PK_ACTION_PLAYER_FOLD = 3;
     PK_ACTION_PLAYER_RAISE = 4;
     PK_ACTION_PLAYER_CALL = 5;
     PK_ACTION_PLAYER_CHECK = 6;
     PK_ACTION_PLAYER_NONE = 7;


var PokerController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("653", this._onUserSitDownHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._onGameStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("660", this._onGameInfoHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("655", this._onBetStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("656", this._onNewRoundHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("658", this._onUserStandupHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("7", this._onTurnChangedHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("3", this._onStartGameHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("11", this._onRoomOwnerChangedHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("659", this._onActionPlayer, this);
    },

    // onReconnect : function (params) {
    //     this._super(params);
    // },

    _createUserInfo : function (data) {
        if(!data){
            return {
                money:0,
                moneyBet:0,
                isPlaying:false,
                idAction:PK_ACTION_PLAYER_NONE,
                isDealer:false,
                isBigBlind:false,
                isSmallBlind:false
            };
        }

        return {
            money:data["10"],
            moneyBet:data["12"],
            isPlaying:!data["2"],
            idAction:data["11"],
            isDealer:false,
            isBigBlind:false,
            isSmallBlind:false
        };
    },

    _updateDeadler : function (username) {
        for(var i=0;i<this.playerSlot.length;i++){
            if(this.playerSlot[i].username == username){
                this.playerSlot[i].info.isDealer = true;
            }
            else{
                this.playerSlot[i].info.isDealer = false;
            }

            this._view.updatePlayerInfo(this.playerSlot[i]);
        }
    },

    _updateBigBlind : function (username) {
        for(var i=0;i<this.playerSlot.length;i++){
            if(this.playerSlot[i].username == username){
                this.playerSlot[i].info.isBigBlind = true;
            }
            else{
                this.playerSlot[i].info.isBigBlind = false;
            }

            this._view.updatePlayerInfo(this.playerSlot[i]);
        }
    },

    _updateRoomInfo : function (params) {
        if(params){
            this._updateBigBlind(params["3"]);
            this._updateSmallBlind(params["2"]);
            this._updateDeadler(params["1"]);
        }
    },

    _updateSmallBlind : function (username) {
        for(var i=0;i<this.playerSlot.length;i++){
            if(this.playerSlot[i].username == username){
                this.playerSlot[i].info.isSmallBlind = true;
            }
            else{
                this.playerSlot[i].info.isSmallBlind = false;
            }

            this._view.updatePlayerInfo(this.playerSlot[i]);
        }
    },

    _onUserStandupHandler : function (cmd, data) {
       // cc.log(data);
        if(data.p.u == PlayerMe.username){
            var newSlot = [];
            for(var i=0;i<this.playerSlot.length;i++){
                var idx = this.playerSlot[i].userIndex;
                if(idx < 0){
                    idx += maxSlot;
                }
                newSlot[idx] = this.playerSlot[i];
            }
            this.playerSlot = newSlot;
        }
        this._onUserExit(data.p.u);
        this._view.fillPlayerToSlot(this.playerSlot);
        this._view.updateInviteButton();
    },

    _onUserSitDownHandler: function (cmd, content) {
        this.onUserSitDown(content.p);
    },

    _onGameStatusHandler: function (cmd, content) {
        this.onGameStatus(content.p);
    },
    _onRoomOwnerChangedHandler: function (cmd, content) {
        this.onRoomOwnerChanged(content.p);
    },

    _onGameInfoHandler: function (cmd, content) {
        this.onGameInfo(content.p);
    },

    _onBetStatusHandler: function (cmd, content) {

    },

    _onStartGameHandler: function (cmd, content) {
        this.onStartGame(content.p);
    },

    _onNewRoundHandler: function (cmd, content) {
        this.onNewRound(content.p);
    },

    _onTurnChangedHandler: function (cmd, content) {
        this.onTurnChanged(content.p);
    },
    _onActionPlayer:function (cmd, content) {
        this.onActionPlayer(content.p);
    },
    getSlotPlayerByUsername:function (username) {

        for(var i = 0; i < this.playerSlot.length; i++){
            if(this.playerSlot[i].username ==  username)
            {
                return this.playerSlot[i];
            }
        }
        return null;
    },
    onActionPlayer : function (param) {

        var username = param["u"];
        var money = param["3"];
        var moneyExchange = param["2"];
        var action = param["1"];
        this._view.updateActionPlayer(username, money, moneyExchange, action);
        var slot = this.getSlotPlayerByUsername(username);
        if(slot)
        {
            slot.info.idAction = action;
        }
    },

    onJoinRoom : function (param) {
        this._super(param);
        this._updateRoomInfo(param["12"]);
        this._view.updateInviteButton();
    },

    onReconnect: function (param) {
        this._super(param);
        this._updateRoomInfo(param["1"]["12"]);
        this._view.updateInviteButton();
    },

    onRoomOwnerChanged: function (param) {
        this.isOwnerMe = param.u == PlayerMe.username;
    },

    onNewRound: function (param) {
        var turnId = param["1"];
        var publicCards = param["2"];
        if(!param["3"])
        {
            SoundPlayer.stopAllSound();
            if(turnId==1)
            {
                SoundPlayer.playSound("pk_dealer_flop");
            }
            else if(turnId==2)
            {
                SoundPlayer.playSound("pk_dealer_turn");
            }
            else if(turnId==3)
            {
                SoundPlayer.playSound("pk_dealer_river");
            }
        }
        if(turnId==0)
        {
            this._view.cardMix.removeAll();
        }
        var cards = [];
        for (var i = 0; i < publicCards.length; i++) {
            cards.push(CardList.prototype.getCardWithId(publicCards[i]));
        }

        if(turnId>0)
        {
            this._view.dealPublicCards(cards);
        }

    },

    sendActionRequest: function (action, money) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("659", {1: action, 2: money});
    },

    onStartGame: function (param) {
        var cards = param["1"];
        var cardObjs = [];
        for (var i = 0; i < cards.length; i++) {
            cardObjs.push(CardList.prototype.getCardWithId(cards[i]));
        }
        this._view.performDealCards(cardObjs, true);
    },

    onTurnChanged: function (param) {
        var username = param.u;
        var availableActions = param["2"];
        var minimalBetAmount = param["3"];

        this._view.onUpdateTurn(username);
        this._view.handleButtons(availableActions);

    },

    onGameInfo: function (param) {
        var dealer = param["1"];
        var smallBlind = param["2"];
        var bigBlind = param["3"];
        var currentPlayer = param["4"];
        var currentTime = param["5"];
        var publicCards = param["6"];
        var roundTypeId = param["7"];
        var maxTimeTurn = param["8"];
    },

    onUserJoinRoom: function (p) {
        // var slotIndex = p["4"];
        // var username = p["u"];
        // for(var i=0;i<this.playerSlot.length;i++){
        //     if(this.playerSlot[i].userIndex == slotIndex){
        //         this.playerSlot[i].username = username;
        //         break;
        //     }
        // }
        //
        // var userInfo = {
        //     index: slotIndex,
        //     username: username,
        //     gold: p["3"],
        //     avt: p["avtUrl"]
        // };
        //
        // this._view.userJoinRoom(userInfo);
    },

    onUserSitDown: function (param) {
        //this.onUserJoinRoom(param);

        var slotIndex = param["4"];
        var username = param["u"];
        var gold = param["10"];
        var spectator = param["2"];
        var avt = param["avtUrl"];
        for(var i=0;i<this.playerSlot.length;i++){
            if(this.playerSlot[i].userIndex == slotIndex){
                this.playerSlot[i].username = username;
                this.playerSlot[i].gold = gold;
                this.playerSlot[i].spectator = spectator;
                this.playerSlot[i].avt = avt;
                this.playerSlot[i].info = this._createUserInfo(param);
                break;
            }
        }

        // this.playerSlot[slot].username = players[i]["u"];
        // this.playerSlot[slot].gold = players[i]["3"];
        // this.playerSlot[slot].spectator = players[i]["2"];
        // this.playerSlot[slot].avt = players[i]["avtUrl"];

        // var userInfo = {
        //     index: slotIndex,
        //     username: username,
        //     gold: p["3"],
        //     avt: p["avtUrl"]
        // };

        if(PlayerMe.username == param.u){
            var maxSlot = this.getMaxSlot();
            var newSlot = [];
            for(var i=0;i<this.playerSlot.length;i++){
                var idx = this.playerSlot[i].userIndex - slotIndex;
                if(idx < 0){
                    idx += maxSlot;
                }
                newSlot[idx] = this.playerSlot[i];
            }
            this.playerSlot = newSlot;
            this._view.fillPlayerToSlot(this.playerSlot);
        }
        else{
            var userInfo = {
                index: slotIndex,
                username: username,
                gold: param["3"],
                avt: param["avtUrl"]
            };

            this._view.userJoinRoom(userInfo);
        }
       // this._view.onUserSitDown(param.u);

        this._view.updateInviteButton();
    },

    onGameStatus: function (param) {

    },

    getMaxSlot: function () {
        return 5;
    },

    sendSitDownRequest: function (index, betting) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("653", {1: index, 2: betting});
    },

    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },

    requestStandup : function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("657", null);
    }
});