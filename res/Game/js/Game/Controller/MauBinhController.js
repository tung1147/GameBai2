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
        var cards = [];
        for (var i = 0;i<param["1"].length;i++){
            cards.push(CardList.prototype.getCardWithId(param["1"][i]));
        }
        // param["1"].forEach(function (item,index) {
        //     cards.push(CardList.prototype.getCardWithId(item));
        // });
        this._view.performDealCards(cards);
    },

    onGameStatus: function(param){
        this._view.hideAllButton();
        switch (param["1"]){
            case 1:
                this._view.setStartBtVisible(this.isOwnerMe);
                break;

            case 2:
                this._view.setIngameButtonVisible(true);
                this._view.showTimeRemaining(param["2"]);
                break;

            case 3:
                // xep xong
                this._view.showTimeRemaining(0);
                this._view.onTimeOut();
                break;
        }
    },

    sendXepBaiXong : function (cards) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("451",{1:cards});
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