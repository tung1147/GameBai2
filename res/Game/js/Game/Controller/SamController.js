/**
 * Created by QuyetNguyen on 11/23/2016.
 */

s_sfs_error_msg[34] = "Không được để 2 cuối";

var SamController = TLMNGameController.extend({
    ctor : function (view) {
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("51", this._onUserCallSamHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("52", this._onUserFoldSamHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("53", this._onChangeSamStateHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("54", this._onNotifiOneHandler, this);
    },

    getMaxSlot : function () {
        if(this.isSolo){
            return 2;
        }
        return 5;
    },

    // onSFSExtension: function (messageType, content) {
    //     this._super(messageType, content);
    //   //  cc.log(JSON.stringify(content));
    //     if (content.c == "51") {
    //         this.onUserCallSam(content.p.u);
    //     }
    //     else if (content.c == "52") {
    //         this.onUserFoldSam(content.p.u);
    //     }
    //     else if (content.c == "53") {
    //         this.onChangeSamState(content.p["1"],content.p["2"]);
    //     }
    //     else if (content.c == "54") {
    //         this.onNotifiOne(content.p.u);
    //     }
    // },

    _onUserCallSamHandler : function (cmd, content) {
        this.onUserCallSam(content.p.u);
    },

    _onUserFoldSamHandler : function (cmd, content) {
        this.onUserFoldSam(content.p.u);
    },

    _onChangeSamStateHandler : function (cmd, content) {
        this.onChangeSamState(content.p["1"],content.p["2"]);
    },

    _onNotifiOneHandler : function (cmd, content) {
        this.onNotifiOne(content.p.u);
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
        if (PlayerMe.username == username){
            this._view.setSamBtVisible(false);
        }
    },

    onChangeSamState: function (state, timeRemaining) {
        this._view.setSamBtVisible(state == 1);
        if (state == 1)
            this._view.showBaoSamTimeRemaining(Math.round(timeRemaining/1000));
        else
            this._view.showBaoSamTimeRemaining(0);
    },

    onGameFinished : function (params) {
        this._super(params);
        this._view.hideAllNotifyOne();
    },

    onNotifiOne: function (username) {
        if (username != PlayerMe.username){
            this._view.notifyOne(username);
        }
    },

    sendBaoSamRequest:function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("51", {});
    },

    sendHuySamRequest:function(){
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("52",{});
    }
});