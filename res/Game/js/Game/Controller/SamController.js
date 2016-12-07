/**
 * Created by QuyetNguyen on 11/23/2016.
 */
var SamController = TLMNGameController.extend({
    ctor : function (view) {
        this._super();
        this.initWithView(view);
    },

    getMaxSlot : function () {
        if(this.isSolo){
            return 2;
        }
        return 5;
    },

    onSFSExtension: function (messageType, content) {
        this._super(messageType, content);
        cc.log(JSON.stringify(content));
        if (content.c == "51") {
            this.onUserCallSam(content.p.u);
        }
        else if (content.c == "52") {
            this.onUserFoldSam(content.p.u);
        }
        else if (content.c == "53") {
            this.onChangeSamState(content.p["1"],content.p["2"]);
        }
        else if (content.c == "54") {
            this.onNotifiOne(content.p.u);
        }
    },

    onUserCallSam : function (username) {
        var msg = username == PlayerMe.username ? "Bạn" : ("Người chơi " + username);
        msg += " đã báo sâm thành công";
        this._view.alertMessage(msg);
        this._view.setSamBtVisible(false);
    },

    onUserFoldSam : function (username) {
        var msg = username == PlayerMe.username ? "Bạn" : ("Người chơi " + username);
        msg+= " đã hủy sâm thành công";
        this._view.alertMessage(msg);
        this._view.setSamBtVisible(false);
    },

    onChangeSamState: function (state, timeRemaining) {
        this._view.setSamBtVisible(state == 1);
        if (state == 1)
            this._view.showBaoSamTimeRemaining(timeRemaining);
    },

    onNotifiOne: function (username) {
        if (username != PlayerMe.username)
            this._view.alertMessage("Người chơi " + username + " chỉ còn lại 1 lá");
    },

    sendBaoSamRequest:function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("51", {});
    },

    sendHuySamRequest:function(){
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("52",{});
    }
});