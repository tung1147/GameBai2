/**
 * Created by VGA10 on 1/19/2017.
 */
var PokerController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("653", this._onUserSitDownHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._onGameStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("660", this._onGameInfoHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("655", this._onBetStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("656", this._onNewRoundHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("7", this._onTurnChangedHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("3", this._onStartGameHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("11", this._onRoomOwnerChangedHandler, this);
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

    onReconnect: function (param) {
        this._super(param);
        if (!param["ct"])
            return;
        var cards = param["3"];
        var cardObjs = [];
        var minBetValue = param["ct"]["3"];
        var availableAction = param["ct"]["2"];
        for (var i = 0; i < cards.length; i++)
            cardObjs.push(CardList.prototype.getCardWithId(cards[i]));

        this._view.performDealCards(cardObjs);

        for (var i = 0; i < availableAction.length; i++) {
            this._view.setActionVisible(availableAction[i]);
        }

    },

    onRoomOwnerChanged: function (param) {
        this.isOwnerMe = param.u == PlayerMe.username;
    },

    onNewRound: function (param) {
        var turnId = param["1"];
        var publicCards = param["2"];
        if (turnId == 0)
            this._view.hideAllButton();
        var cards = [];
        for (var i = 0; i < publicCards.length; i++) {
            cards.push(CardList.prototype.getCardWithId(publicCards[i]));
        }
        this._view.dealPublicCards(cards);
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

        this._view.hideAllButton();

        if (availableActions) {
            for (var i = 0; i < availableActions.length; i++) {
                this._view.setActionVisible(availableActions[i]);
            }
        }
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

    onUserSitDown: function (param) {
        this.onUserJoinRoom(param);
        this._view.onUserSitDown(param.u);
    },

    onGameStatus: function (param) {
        this._view.hideAllButton();
        var state = param["1"];
        this._view.setStartBtVisible(state == 1 && this.isOwnerMe);
    },

    getMaxSlot: function () {
        return 9;
    },

    sendSitDownRequest: function (index, betting) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("653", {1: index, 2: betting});
    },

    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    }
});