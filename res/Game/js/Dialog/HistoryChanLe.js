
_arrPosHisoty = [64, 218, 329, 439, 560, 670, 780];
var HistoryChanLe = IDialog.extend({
    ctor: function () {
        this._super();
        var board_bg = new ccui.Scale9Sprite("dialog-bg.png", cc.rect(20, 20, 4, 4));
        board_bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(board_bg);
        this.board_bg = board_bg;
        this.initWithSize(cc.size(860, 600));

        var dialogBgTitle = new cc.Scale9Sprite("dialog-bg-title.png", cc.rect(20, 0, 4, 60));
        dialogBgTitle.setAnchorPoint(cc.p(0.5, 1.0));
        dialogBgTitle.setPreferredSize(cc.size(board_bg.width, 60));
        dialogBgTitle.setPosition(cc.p(board_bg.width/2, board_bg.height));
        this.addChild(dialogBgTitle);


        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "THỐNG KÊ");
        title.setPosition(dialogBgTitle.x, dialogBgTitle.y - 30);
        title.setColor(cc.color("#77cbee"));
        this.addChild(title);
        this._createHistory();

    },

    _createHistory : function () {
        var mSize = cc.size(860, 460);
        var dx = 0.0;
        var thiz = this;

        this.arrHis = [];
        var arrTitle = ["Phiên","Thời gian","Cửa","Cược","Kết quả", "Trả lại","Thắng"];

        for(var i =0; i < arrTitle.length; i++){
            var lblTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, arrTitle[i]);
            lblTitle.setColor(cc.color("#24436c"));
            lblTitle.setPosition(_arrPosHisoty[i],492);
            this.addChild(lblTitle);
        }

        var listTai = new newui.ListViewWithAdaptor(mSize);
        listTai.setPosition(dx, 0);
        this.addChild(listTai);
        listTai.setCreateItemCallback(function () {
            return thiz._createCell();
        });
        listTai.setSizeCallback(function () {
            return thiz.arrHis.length;
        });
        listTai.setItemAdaptor(function (idx, view) {
            thiz._setData(view, thiz.arrHis[idx]);
        });
        this.listHis = listTai;
    },
    _setData : function (view, data) {
        view.phienLabel.setString(data["phien"]);
        view.timeLabel.setString(data["time"]);
        if(data["idCua"] == TX_CUA_TAI){
            view.cuaLabel.setString("Tài");
            view.cuaLabel.setColor(cc.color("#77cbee"));
        }
        else {
            view.cuaLabel.setString("Xỉu");
            view.cuaLabel.setColor(cc.color("#ffde00"));
        }

        view.bettingLabel.setString(cc.Global.NumberFormat1(data["betting"]));

        if(data["ketqua"] == TX_CUA_TAI){
            view.resuftabel.setString("Tài");
            view.resuftabel.setColor(cc.color("#77cbee"));
        }
        else {
            view.resuftabel.setString("Xỉu");
            view.resuftabel.setColor(cc.color("#ffde00"));
        }


        view.returnLabel.setString(cc.Global.NumberFormat1(data["tra"]));
        view.receiewLabel.setString(cc.Global.NumberFormat1(data["nhan"]));
    },
    _createCell : function () {

        // var _arrPos = [61, 211, 362, 477, 605, 733, 857];
        var _arrPos = _arrPosHisoty ;
        var container = new ccui.Widget();
        container.setContentSize(cc.size(860, 64));


        if(this.listHis._allItems.length % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);
        }


        var phienLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time", cc.TEXT_ALIGNMENT_CENTER, 100);
        phienLabel.setColor(cc.color("#77cbee"));
        phienLabel.setPosition(_arrPos[0], 32);
        container.addChild(phienLabel);


        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time", cc.TEXT_ALIGNMENT_CENTER, 100);
        timeLabel.setPosition(_arrPos[1], 32);
        timeLabel.setColor(cc.color("#77cbee"));
        container.addChild(timeLabel);

        var cuaLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        cuaLabel.setPosition(_arrPos[2], timeLabel.y);
        container.addChild(cuaLabel);

        var bettingLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        bettingLabel.setPosition(_arrPos[3], timeLabel.y);
        bettingLabel.setColor(cc.color("#77cbee"));
        container.addChild(bettingLabel);

        var resuftabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        resuftabel.setPosition(_arrPos[4], timeLabel.y);
        container.addChild(resuftabel);

        var returnLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        returnLabel.setPosition(_arrPos[5], timeLabel.y);
        returnLabel.setColor(cc.color("#77cbee"));
        container.addChild(returnLabel);


        var receiewLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        receiewLabel.setPosition(_arrPos[6], timeLabel.y);
        container.addChild(receiewLabel);

        container.phienLabel = phienLabel;
        container.timeLabel = timeLabel;
        container.cuaLabel = cuaLabel;
        container.bettingLabel = bettingLabel;
        container.resuftabel = resuftabel;
        container.returnLabel = returnLabel;
        container.receiewLabel = receiewLabel;

        return container;
    },
    onSFSExtension: function (messageType, content) {

        if(content.c == 703){
            var items = content.p["1"];
            for(var i=0;i<items.length;i++){
                var arrPhien = items[i]["3"]["1"];
                var phien = items[i]["2"];
                var ketqua = items[i]["3"]["2"]["1"];
                for(var j=0; j < arrPhien.length; j++){
                    var idCua = parseInt(arrPhien[j]["2"]);
                    var betting = parseInt(arrPhien[j]["5"]);
                    var nhan = parseInt(arrPhien[j]["4"]);
                    var tra = parseInt(arrPhien[j]["6"]);
                    var time = arrPhien[j]["7"];
                    var obj = {
                        ketqua:ketqua,
                        phien : phien,
                        time :  cc.Global.DateToString(new Date(time)),
                        nhan : nhan,
                        tra : tra,
                        betting:betting,
                        idCua:idCua
                    };
                    this.arrHis.push(obj);
                }

            }

            this.listHis.refreshView();
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