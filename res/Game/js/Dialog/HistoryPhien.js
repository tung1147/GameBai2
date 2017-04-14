var HistoryPhien = Dialog.extend({
    ctor : function (data) {
        this._super();
        cc.log(data);
        this.sessionId = data["idVan"];
        var thiz = this;

        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Lịch sử phiên");
        this.initWithSize(cc.size(1035, 597));

        var lblDate = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "");
        lblDate.setColor(cc.color("#c4e1ff"));
        lblDate.setPosition(this.getContentSize().width / 2, 596 );
        this.addChild(lblDate);

        var typeStr = data["data"] === 1 ? "TÀI" : "XỈU";
        var lblCua = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, typeStr + " " + data["number"]);
        lblCua.setColor(cc.color("#77cbee"));
        lblCua.setPosition(this.getContentSize().width / 2, 561 );
        this.addChild(lblCua);

        for(var i=0; i< 3; i++){
            var xucxac = new cc.Sprite("#taixiu_dice_1.png");
            xucxac.setPosition(418 + 122 * i, 498);
            thiz.addChild(xucxac);
        }

        var line_ngang = new ccui.Scale9Sprite("lobby_bg_white.png",cc.rect(12, 12, 4, 4));
        line_ngang.setPreferredSize(cc.size(this.getContentSize().width - 200, 2));
        line_ngang.setPosition(this.getContentSize().width/2,448);
        line_ngang.setOpacity(30);
        this.addChild(line_ngang);

        var line_ngang1 = new ccui.Scale9Sprite("lobby_bg_white.png",cc.rect(12, 12, 4, 4));
        line_ngang1.setPreferredSize(cc.size(this.getContentSize().width - 200, 2));
        line_ngang1.setPosition(this.getContentSize().width/2,395);
        line_ngang1.setOpacity(30);
        this.addChild(line_ngang1);

        var line_doc = new ccui.Scale9Sprite("lobby_bg_white.png",cc.rect(12, 12, 4, 4));
        line_doc.setPreferredSize(cc.size(2, 348));
        line_doc.setAnchorPoint(0.5,0);
        line_doc.setPosition(this.getContentSize().width/2, 100);
        line_doc.setOpacity(30);
        this.addChild(line_doc);

        var lblTai = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "TÀI");
        lblTai.setColor(cc.color("#77cbee"));
        lblTai.setPosition(this.getContentSize().width/2 + 247, 420);
        this.addChild(lblTai);

        var lblXiu =  cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "XỈU");
        lblXiu.setColor(cc.color("#ffde00"));
        lblXiu.setPosition(this.getContentSize().width/2 - 247, 420);
        this.addChild(lblXiu);

        this._createTai();
        this._createXiu();
    },

    _createTai : function () {
        var mSize = cc.size(492, 255);
        var dx = 0.0;
        var thiz = this;

        this.arrTai = [];

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Thời gian");
        timeLabel.setColor(cc.color("#c4e1ff"));
        timeLabel.setPosition(dx + 167, 375);
        this.addChild(timeLabel);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Người chơi");
        nameLabel.setColor(cc.color("#c4e1ff"));
        nameLabel.setPosition(dx + 293, timeLabel.y);
        this.addChild(nameLabel);

        var bettingLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Cược");
        bettingLabel.setColor(cc.color("#c4e1ff"));
        bettingLabel.setPosition(dx + 415, timeLabel.y);
        this.addChild(bettingLabel);

        var returnLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Trả lại");
        returnLabel.setColor(cc.color("#c4e1ff"));
        returnLabel.setPosition(dx + 543, timeLabel.y);
        this.addChild(returnLabel);

        var listTai = new newui.ListViewWithAdaptor(mSize);
        listTai.setPosition(dx + 109, 98);
        this.addChild(listTai);
        listTai.setCreateItemCallback(function () {
            return thiz._createCell();
        });
        listTai.setSizeCallback(function () {
            return thiz.arrTai.length;
        });
        listTai.setItemAdaptor(function (idx, view) {
            thiz._setData(view, thiz.arrTai[idx]);
        });
    },

    _createXiu : function () {
        var mSize = cc.size(492, 255);
        var dx = this.getContentSize().width/2 - 98;
        var thiz = this;

        this.arrXiu = [];

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Thời gian");
        timeLabel.setColor(cc.color("#c4e1ff"));
        timeLabel.setPosition(dx + 167, 375);
        this.addChild(timeLabel);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Người chơi");
        nameLabel.setColor(cc.color("#c4e1ff"));
        nameLabel.setPosition(dx + 293, timeLabel.y);
        this.addChild(nameLabel);

        var bettingLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Cược");
        bettingLabel.setColor(cc.color("#c4e1ff"));
        bettingLabel.setPosition(dx + 415, timeLabel.y);
        this.addChild(bettingLabel);

        var returnLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Trả lại");
        returnLabel.setColor(cc.color("#c4e1ff"));
        returnLabel.setPosition(dx + 543, timeLabel.y);
        this.addChild(returnLabel);

        var listXiu = new newui.ListViewWithAdaptor(mSize);
        listXiu.setPosition(dx + 109, 98);
        this.addChild(listXiu);
        listXiu.setCreateItemCallback(function () {
            return thiz._createCell();
        });
        listXiu.setSizeCallback(function () {
            return thiz.arrXiu.length;
        });
        listXiu.setItemAdaptor(function (idx, view) {
            thiz._setData(view, thiz.arrXiu[idx]);
        });
    },

    _createCell : function () {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(484, 60));

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        timeLabel.setPosition(54, 30);
        container.addChild(timeLabel);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        nameLabel.setPosition(180, timeLabel.y);
        container.addChild(nameLabel);

        var bettingLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        bettingLabel.setPosition(302, timeLabel.y);
        container.addChild(bettingLabel);

        var returnLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        returnLabel.setPosition(430, timeLabel.y);
        container.addChild(returnLabel);

        return container;
    },
    
    _setData : function (view, data) {
        
    },

    _recvData : function (cmd, data) {
        cc.log(data);
    },

    onEnter : function () {
        this._super();
        SmartfoxClient.getInstance().addExtensionListener("707", this._recvData, this);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "707", {1 : this.sessionId});
    },

    onExit : function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    }
});