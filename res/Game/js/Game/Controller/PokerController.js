/**
 * Created by VGA10 on 1/19/2017.
 */
var PokerController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("653", this._onUserSitDownHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("651", this._onSmallBlind, this);
        SmartfoxClient.getInstance().addExtensionListener("652", this._onBigBlind, this);
    },

    _onUserSitDownHandler: function (cmd, content) {
        this.onUserSitDown(content.p);
    },

    _onSmallBlind: function (cmd, content) {
        this.onSmallBlind(content.p);
    },

    _onBigBlind: function (cmd, content) {
        this.onBigBlind(content.p);
    },

    onUserSitDown: function (param) {
        this.onUserJoinRoom(param);
    },

    onSmallBlind: function (param) {
        cc.log("ON SMALL BLIND : " + param.u);
    },

    onBigBlind: function (param) {
        cc.log("ON BIG BLIND : " + param.u);
    },

    getMaxSlot: function () {
        return 9;
    },

    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    }
});