var HistoryChanLe = IDialog.extend({
    ctor: function () {
        this._super();
        var board_bg = new ccui.Scale9Sprite("board_bg.png", cc.rect(105, 105, 147, 147));
        board_bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(board_bg);
        this.board_bg = board_bg;
        this.initWithSize(cc.size(1060, 700));
        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "LỊCH SỬ ĐẶT CƯỢC");
        title.setPosition(this.getContentSize().width / 2, this.getContentSize().height - 138);
        title.setColor(cc.color("#ffde00"));
        this.addChild(title);

        var arrTitle = ["Phiên","Thời gian","Cửa","Cược","Kết quả", "Trả lại","Thắng"];
        var arrPos = [164, 290, 415, 520, 627, 750, 864];
        for(var i =0; i < arrTitle.length; i++){
            var lblTitle = new cc.LabelTTF(arrTitle[i], cc.res.font.Roboto_Condensed,23);
            lblTitle.setColor(cc.color(196, 225, 255,255));
            lblTitle.setPosition(arrPos[i],492);
            this.addChild(lblTitle);
        }

    },
    onSFSExtension: function (messageType, content) {

        if(content.c == 703){

        }
    },
    onEnter: function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "703", null);
    },
    onExit: function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },
    initWithSize: function (mSize) {
        this.board_bg.setPreferredSize(cc.size(mSize.width, mSize.height));
        this.setContentSize(this.board_bg.getContentSize());
    },
});