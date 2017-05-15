/**
 * Created by Quyet Nguyen on 4/6/2017.
 */

var TransferGoldHistory = Dialog.extend({
    ctor : function () {
        this._super();

        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("LỊCH SỬ CHUYỂN VÀNG");
        this.initWithSize(cc.size(960, 540));
        this._initView();
    },

    _initView : function () {
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Thời gian");
        timeLabel.setColor(cc.color("#77cbee"));
        timeLabel.setAnchorPoint(cc.p(0.0, 0.5));
        timeLabel.setPosition(47, 425);
        this.addChild(timeLabel);

        var typeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Loại");
        typeLabel.setColor(cc.color("#77cbee"));
        typeLabel.setAnchorPoint(cc.p(0.0, 0.5));
        typeLabel.setPosition(215, timeLabel.y);
        this.addChild(typeLabel);

        var recvLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Người nhận");
        recvLabel.setColor(cc.color("#77cbee"));
        recvLabel.setAnchorPoint(cc.p(0.0, 0.5));
        recvLabel.setPosition(346, timeLabel.y);
        this.addChild(recvLabel);
        this.recvLabel = recvLabel;

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Vàng");
        goldLabel.setColor(cc.color("#77cbee"));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(520, timeLabel.y);
        this.addChild(goldLabel);

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Nội dung");
        contentLabel.setColor(cc.color("#77cbee"));
        contentLabel.setAnchorPoint(cc.p(0.0, 0.5));
        contentLabel.setPosition(650, timeLabel.y);
        this.addChild(contentLabel);

        var listItem = new newui.TableView(cc.size(900, 400), 1);
        listItem.setBounceEnabled(true);
        listItem.setMargin(30,30,0,0);
        listItem.setScrollBarEnabled(false);
        listItem.setAnchorPoint(cc.p(0.5, 0.0));
        listItem.setPosition(this.getContentSize().width/2, 0);
        this.addChild(listItem);
        this.listItem = listItem;

        // for(var i=0;i<20;i++){
        //     this.addItem("time", "type", "user", "gold", "content");
        // }
    },
    
    addItem : function (time, type, recvUser, gold, content) {
        var container = new ccui.Widget();
        container.setContentSize(this.listItem.getContentSize().width, 60);
        this.listItem.pushItem(container);

        if(this.listItem.size() % 2){
            var bg = new ccui.Scale9Sprite("dialog_cell_bg.png", cc.rect(10,10,4,4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);
        }

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, time, cc.TEXT_ALIGNMENT_CENTER, 200);
        timeLabel.setAnchorPoint(cc.p(0.0, 0.5));
        timeLabel.setPosition(16, container.getContentSize().height/2);
        container.addChild(timeLabel);

        var typeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, type);
        typeLabel.setAnchorPoint(cc.p(0.0, 0.5));
        typeLabel.setPosition(187, container.getContentSize().height/2);
        container.addChild(typeLabel);

        var recvLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, recvUser);
        recvLabel.setAnchorPoint(cc.p(0.0, 0.5));
        recvLabel.setPosition(321, container.getContentSize().height/2);
        container.addChild(recvLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, gold);
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(489, container.getContentSize().height/2);
        container.addChild(goldLabel);

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, content);
        contentLabel.setAnchorPoint(cc.p(0.0, 0.5));
        contentLabel.setPosition(618, container.getContentSize().height/2);
        container.addChild(contentLabel);
    },

    onRecvData : function (cmd, data) {
        var items = data["data"];
        if(items.length > 0){
            for(var i=0;i<items.length;i++){
                var time = items[i]["createdTime"];
                var type = items[i]["transferType"];
                var recv = items[i]["toUsername"];
                var gold = items[i]["value"];
                var content = items[i]["description"];
                this.addItem(cc.Global.DateToString(new Date(time * 1000)), type, recv, gold, content);
            }
        }
    },

    onEnter : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchTransferLog", this.onRecvData, this);
        this.requestGetHistory();
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    requestGetHistory : function () {
        var request = {
            command : "fetchTransferLog"
        };
        LobbyClient.getInstance().send(request);
    }
});

var TransferGoldMerchantHistory = TransferGoldHistory.extend({
    ctor : function () {
        this._super();
        this.recvLabel.setString("Thông tin đại lý");
    },

    requestGetHistory : function () {
        var request = {
            command : "fetchTransferLog",
            type : 3
        };
        LobbyClient.getInstance().send(request);
    },

    onRecvData : function (cmd, data) {
        var items = data["data"];
        if(items.length > 0){
            for(var i=0;i<items.length;i++){
                var time = items[i]["createdTime"];
                var type = items[i]["transferType"];
                var recv = items[i]["info"];
                var gold = items[i]["value"];
                var content = items[i]["description"];
                this.addItem(cc.Global.DateToString(new Date(time * 1000)), type, recv, gold, content);
            }
        }
    },
});