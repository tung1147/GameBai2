/**
 * Created by VGA10 on 1/11/2017.
 */

var MauBinhController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("3",this._onStartGameHandler,this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._onGameStatusHandler, this);

    },
    _onStartGameHandler: function (cmd,content) {
        this.onStartGame(content.p);
    },

    _onGameStatusHandler : function (cmd,content) {
        this.onGameStatus(content.p);
    },

    onStartGame : function (param) {
        cc.log(param);
    },

    onGameStatus: function(param){
        switch (param["1"]){
            case 1:
                this._view.setStartBtVisible(this.isOwnerMe);
                break;

            case 2:

                break;
        }
    },

    getMaxSlot: function () {
        return 4;
    },

    onJoinRoom : function (param) {
        this._super(param);

        var huThuongValue = param["11"]["2"];
        this._view.performChangeRewardFund(huThuongValue);
    },

    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },
});