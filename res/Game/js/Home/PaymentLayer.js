/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var payment_card_img = payment_card_img || ["#payment-card-mobi", "#payment-card-viettel", "#payment-card-vina", "#payment-card-gate", "#payment-card-vcoin", "#payment-card-bit"];
var payment_card_code = payment_card_code || ["Mã thẻ Mobi", "Mã thẻ Viettel", "Mã thẻ Vina", "Mã thẻ Gate", "Mã thẻ Vcoin", "Mã thẻ Bit"];
var payment_card_serial = payment_card_serial || ["Serial thẻ Mobi", "Serial thẻ Viettel", "Serial thẻ Vina", "Serial thẻ Gate", "Serial thẻ Vcoin", "Serial thẻ Bit"];
var payment_card_type = payment_card_type || ["VMS", "VTT", "VNP", "GATE", "VCOIN", "BIT"];

var PaymentCardLayer = cc.Node.extend({
    ctor: function () {
        this._super();


        var bg1 = new ccui.Scale9Sprite("lobby-text-input.png", cc.rect(10, 10, 4, 4));
        bg1.setPreferredSize(cc.size(360, 50));
        bg1.setPosition(cc.winSize.width/2 + 220, 390);
        this.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("lobby-text-input.png", cc.rect(10, 10, 4, 4));
        bg2.setPreferredSize(bg1.getContentSize());
        bg2.setPosition(bg1.x, 302);
        this.addChild(bg2);

        var maThe = new newui.EditBox(cc.size(bg1.getContentSize().width - 6, bg1.getContentSize().height - 2));
        maThe.setFont(cc.res.font.Roboto_Condensed, 18);
        maThe.setPlaceholderFont(cc.res.font.Roboto_Condensed, 18);
        maThe.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        maThe.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        maThe.setPlaceHolder("Mã thẻ");
        maThe.setPosition(bg1.getPosition());
        this.addChild(maThe, 1);
        this.maThe = maThe;
        this.type = payment_card_type[0];

        var serialThe = new newui.EditBox(cc.size(bg2.getContentSize().width - 6, bg2.getContentSize().height - 2));
        serialThe.setFont(cc.res.font.Roboto_Condensed, 18);
        serialThe.setPlaceholderFont(cc.res.font.Roboto_Condensed, 18);
        serialThe.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        serialThe.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        serialThe.setPlaceHolder("Serial thẻ");
        serialThe.setPosition(bg2.getPosition());
        this.addChild(serialThe, 1);
        this.serialThe = serialThe;

        var okButton = new ccui.Button("sublobby-button.png", "sublobby-button-2.png", "", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10, 10, 4, 4));
        okButton.setContentSize(cc.size(bg1.getContentSize().width, 55));
        okButton.setPosition(bg1.x, 192);
        okButton.setTitleText("Nạp vàng");
        okButton.setTitleFontName(cc.res.font.Roboto_Condensed);
        okButton.setTitleFontSize(25);
        okButton.setTitleColor(cc.color(255, 255, 255));
        this.addChild(okButton);

        var thiz = this;
        okButton.addClickEventListener(function () {
            var code = thiz.maThe.getString();
            var serial = thiz.serialThe.getString();
            var telco = thiz.type;
            var type = 1;//card
            var msg = {
                command: "cashin",
                code: code,
                serial: serial,
                telco: telco,
                type: type
            };
            cc.log(msg);
            LobbyClient.getInstance().send(msg);
        });

        this.initTiGia();
        this.initCardItem();
    },

    onRecvFetchItemExchange : function (event, data) {
        this.listTiGia.removeAllItems();
        var list = data["data"]["1"];
        for(var i=0;i<list.length;i++){
            var currency = list[i]["currency"];
            var gold = list[i]["gold"];
            var price = list[i]["price"];

            this.addTiGia(price, gold, currency);
        }
    },

    initCardItem: function () {
        this.cardSelected = 0;
        var card_img = ["#payment-card-mobi", "#payment-card-viettel", "#payment-card-vina", "#payment-card-gate", "#payment-card-vcoin", "#payment-card-bit"];

        var _boder = 15.0 * cc.winSize.screenScale;
        var _padding = (cc.winSize.width - _boder * 2 - 6.0 * 196.0 * cc.winSize.screenScale) / 5;
        var listItem = new newui.TableView(cc.size(cc.winSize.width, 150), 1);
        listItem.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listItem.setMargin(0, 0, _boder, _boder);
        listItem.setPadding(_padding);
        listItem.setScrollBarEnabled(false);
        listItem.setPosition(0, 447);
        this.addChild(listItem);
        var thiz = this;
        for (var i = 0; i < 6; i++) {
            (function () {
                var bg1 = new cc.Sprite(card_img[i] + ".png");
                bg1.setPosition(bg1.getContentSize().width / 2, bg1.getContentSize().height / 2);
                var container = new ccui.Widget();
                container.setContentSize(bg1.getContentSize());
                container.addChild(bg1);

                container.setScale(cc.winSize.screenScale);
                listItem.pushItem(container);
                container.maThe = payment_card_code[i];
                container.serialThe = payment_card_serial[i];
                container.type = payment_card_type[i];

                container.select = function () {
                    bg1.setOpacity(255);
                };
                container.unselect = function () {
                    bg1.setOpacity(255 * 0.4);
                };
                container.setTouchEnabled(true);
                container.addClickEventListener(function (item) {
                    thiz.selectCard(item);
                });

                container.unselect();
                if (i == 0) {
                    thiz.selectCard(container);
                }
            })();
        }
    },
    selectCard: function (card) {
        if (this.cardSelected) {
            this.cardSelected.setTouchEnabled(true);
            this.cardSelected.unselect();
        }
        this.cardSelected = card;
        this.cardSelected.setTouchEnabled(false);
        this.cardSelected.select();
        this.maThe.setPlaceHolder(this.cardSelected.maThe);
        this.serialThe.setPlaceHolder(this.cardSelected.serialThe);
        this.type = this.cardSelected.type;
    },
    initTiGia: function () {
        var bg = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg.setPreferredSize(cc.size(420, 260));
        bg.setAnchorPoint(cc.p(0.5, 0.5));
        bg.setPosition(370 * cc.winSize.screenScale, 290);
        this.addChild(bg);

        var listItem = new newui.TableView(cc.size(bg.getContentSize().width - 4, bg.getContentSize().height), 1);
        listItem.setMargin(10, 20, 0, 0);
        listItem.setScrollBarEnabled(false);
        listItem.setAnchorPoint(cc.p(0.5, 0.5));
        listItem.setPosition(bg.getPosition());
        this.addChild(listItem);
        this.listTiGia = listItem;

        // for (var i = 0; i < 10; i++) {
        //     this.addTiGia(20000, 20000);
        // }
    },
    addTiGia: function (money, gold, currency) {
        if(!currency){
            currency = "VND";
        }

        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listTiGia.getContentSize().width, 40));
        this.listTiGia.pushItem(container);

        var moneyLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, money + " " + currency);
        moneyLabel.setAnchorPoint(cc.p(1.0, 0.5));
        moneyLabel.setPosition(container.getContentSize().width / 2 - 20, container.getContentSize().height / 2);
        container.addChild(moneyLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, gold + " V");
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(container.getContentSize().width / 2 + 20, container.getContentSize().height / 2);
        container.addChild(goldLabel);

        var equalLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "=");
        equalLabel.setPosition(container.getContentSize().width / 2, container.getContentSize().height / 2);
        container.addChild(equalLabel);
    },
    onEnter : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchItemExchange", this.onRecvFetchItemExchange, this);
        LobbyClient.getInstance().send({
            command: "fetchItemExchange",
            cashInType: 1
        });
    },
    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var PaymentInAppLayer = cc.Node.extend({
    ctor: function () {
        this._super();

        var listItem = new newui.TableView(cc.size(cc.winSize.width, 450), 2);
        listItem.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listItem.setMargin(0, 0, 50, 50);
        listItem.setPadding(30.0);
        listItem.setScrollBarEnabled(false);
        listItem.setPosition(0, 130);
        this.addChild(listItem);
        this.listItem = listItem;

        // for (var i = 0; i < 10; i++) {
        //     this.addItem(i % 3 + 1, 1000000, 20000);
        // }
    },

    addItem: function (logoId, gold, price) {
        var bg = new cc.Sprite("#payment-inapp-bg.png");
        var container = new ccui.Widget();
        container.setContentSize(bg.getContentSize());
        bg.setPosition(container.getContentSize().width / 2, container.getContentSize().height/2);
        container.addChild(bg);

        var icon = new cc.Sprite("#payment-inapp-icon-" + logoId + ".png");
        icon.setPosition(bg.getPosition());
        container.addChild(icon);

        var goldIcon = new cc.Sprite("#payment-inapp-goldicon.png");
        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, cc.Global.NumberFormat1(gold) + "V");
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(100, 108);
        goldLabel.setColor(cc.color("#ffde00"));
        container.addChild(goldLabel);
      //  goldIcon.setPosition(goldLabel.x - goldLabel.getContentSize().width / 2 - goldIcon.getContentSize().width / 2, goldLabel.y);
     //   container.addChild(goldIcon);

        if (Number.isInteger(price)) { //sms
            var priceLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(price) + " VNĐ");
        }
        else {
            var priceLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, price + " VNĐ");
            //priceLabel = ccui.RichText.createWithXML("<font face='" + cc.res.font.Roboto_Condensed + "' size='25'><font color='#ffde00'>$</font>" + price + "</font>");
        }
        priceLabel.setAnchorPoint(cc.p(1.0, 0.5));
        priceLabel.setPosition(260,25);
        container.addChild(priceLabel, 1);
        container.setTouchEnabled(true);

        this.listItem.pushItem(container);
        return container;
    }
});

var PaymentSMSLayer = PaymentInAppLayer.extend({
    ctor: function () {
        this._super();
        var thiz = this;
        if (cc.Global.SMSList) {
            for (var i = 0; i < cc.Global.SMSList.length; i++) {
                var container = this.addItem(i % 3 + 1, cc.Global.SMSList[i].gold, cc.Global.SMSList[i].price);
                container.smsIndex = i;
                container.addClickEventListener(function (item) {
                    thiz.selectSMSPayment(item.smsIndex);
                });
            }
        }
    },
    selectSMSPayment: function (index) {
        //
        var paydialog = new SMSPayDialog();
        paydialog.bundleId = index;
        paydialog.buildSMSSyntax(index, 0);
        paydialog.showWithAnimationMove();
    }
});

var PaymentGiftcode = cc.Node.extend({
    ctor: function () {
        this._super();
        var bg = new ccui.Scale9Sprite("lobby-text-input.png", cc.rect(10, 10, 4, 4));
        bg.setPreferredSize(cc.size(420, 60));
        bg.setPosition(cc.winSize.width / 2, 420);
        this.addChild(bg);

        var giftCode = new newui.EditBox(cc.size(bg.getContentSize().width - 6, bg.getContentSize().height - 2));
        giftCode.setFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        giftCode.setPlaceholderFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        giftCode.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        giftCode.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        giftCode.setPlaceHolder("Nhập giftcode");
        giftCode.setPosition(bg.getPosition());
        this.addChild(giftCode, 1);

        var okButton = new ccui.Button("sublobby-button.png", "sublobby-button-2.png", "", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10, 10, 4, 4));
        okButton.setContentSize(cc.size(bg.getContentSize().width, 55));
        okButton.setPosition(bg.x, 300);
        okButton.setTitleText("Nạp vàng");
        okButton.setTitleFontName(cc.res.font.Roboto_Condensed);
        okButton.setTitleFontSize(25);
        okButton.setTitleColor(cc.color(255, 255, 255));
        this.addChild(okButton);

        okButton.addClickEventListener(function () {
            var code = giftCode.getString();
            var msg = {command: "cashin", code: code, type: 4};
            LobbyClient.getInstance().send(msg);
            giftCode.setString("");
        });

        LobbyClient.getInstance().addListener("cashin", this.onCashin, this);
    },
    onCashin: function (command, data) {
        var message = data["message"];
        var dialog = new MessageDialog();
        dialog.setMessage(message);
        dialog.showWithAnimationScale();
    },
    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var PaymentHistoryLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        var margin = 60.0 * cc.winSize.screenScale;
        var padding = 2.0;
        this.width1 = 173.0 * cc.winSize.screenScale;
        this.width2 = 213.0 * cc.winSize.screenScale;
        this.width4 = 173.0 * cc.winSize.screenScale;
        this.width5 = 173.0 * cc.winSize.screenScale;
        this.width3 = cc.winSize.width - this.width1 - this.width2 - this.width4 - this.width5 - margin * 2 - padding * 4;
        this.x1 = margin + this.width1 / 2;
        this.x2 = this.x1 + this.width1 / 2 + this.width2 / 2 + padding;
        this.x3 = this.x2 + this.width2 / 2 + this.width3 / 2 + padding;
        this.x4 = this.x3 + this.width3 / 2 + this.width4 / 2 + padding;
        this.x5 = this.x4 + this.width4 / 2 + this.width5 / 2 + padding;

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "THỜI GIAN");
        timeLabel.setPosition(this.x1, 576);
        timeLabel.setOpacity(0.2 * 255);
        this.addChild(timeLabel, 1);

        var typeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "LOẠI");
        typeLabel.setPosition(this.x2, 576);
        typeLabel.setOpacity(0.2 * 255);
        this.addChild(typeLabel, 1);

        var infoLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "THÔNG TIN");
        infoLabel.setPosition(this.x3, 576);
        infoLabel.setOpacity(0.2 * 255);
        this.addChild(infoLabel, 1);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "VÀNG");
        goldLabel.setPosition(this.x4, 576);
        goldLabel.setOpacity(0.2 * 255);
        this.addChild(goldLabel, 1);

        var priceLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "MỆNH GIÁ");
        priceLabel.setPosition(this.x5, 576);
        priceLabel.setOpacity(0.2 * 255);
        this.addChild(priceLabel, 1);

        var _top = 554.0;
        var _bottom = 126.0;
        var itemList = new newui.TableView(cc.size(cc.winSize.width, _top - _bottom), 1);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setPadding(10);
        itemList.setMargin(10, 10, 0, 0);
        itemList.setPosition(cc.p(0, _bottom));
        this.addChild(itemList, 1);
        this.itemList = itemList;

        LobbyClient.getInstance().addListener("fetchCashinItems", this.onRecvHistory, this);
    },
    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.itemList.removeAllItems();
            var request = {command: "fetchCashinItems"};
            LobbyClient.getInstance().send(request);
        }
    },
    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },
    onRecvHistory: function (cmd, data) {
        data = data["data"];
        if(data.length > 0){
            this.itemList.removeAllItems();

            for (var i = 0; i < data.length; i++) {
                var d = new Date(data[i]["createdTime"] * 1000);
                var timeString = cc.Global.DateToString(d);
                var type = data[i]["cashInType"];
                var info = data[i]["detail"];
                var gold = data[i]["gold"];
                var price = data[i]["price"];
                this.addItem(timeString, type, info, gold, price);
            }
        }
    },
    addItem: function (time, type, info, gold, price) {
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, time, cc.TEXT_ALIGNMENT_CENTER, this.width1);
        var typeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, type);
        var infoLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, info);
        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, gold);
        var priceLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Thành công");
        var height = 80.0;
        if (timeLabel.getContentSize().height > height) {
            height = timeLabel.getContentSize().height;
        }
        if (typeLabel.getContentSize().height > height) {
            height = typeLabel.getContentSize().height;
        }
        if (infoLabel.getContentSize().height > height) {
            height = infoLabel.getContentSize().height;
        }
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.itemList.getContentSize().width, height));
        this.itemList.pushItem(container);

        var bg1 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg1.setPreferredSize(cc.size(this.width1, container.getContentSize().height));
        bg1.setPosition(this.x1, container.getContentSize().height / 2);
        container.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg2.setPreferredSize(cc.size(this.width2, container.getContentSize().height));
        bg2.setPosition(this.x2, container.getContentSize().height / 2);
        container.addChild(bg2);

        var bg3 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg3.setPreferredSize(cc.size(this.width3, container.getContentSize().height));
        bg3.setPosition(this.x3, container.getContentSize().height / 2);
        container.addChild(bg3);

        var bg4 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg4.setPreferredSize(cc.size(this.width4, container.getContentSize().height));
        bg4.setPosition(this.x4, container.getContentSize().height / 2);
        container.addChild(bg4);

        var bg5 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg5.setPreferredSize(cc.size(this.width5, container.getContentSize().height));
        bg5.setPosition(this.x5, container.getContentSize().height / 2);
        container.addChild(bg5);


        timeLabel.setScale(20.0 / 25.0);
        timeLabel.setPosition(bg1.getPosition());
        container.addChild(timeLabel);


        typeLabel.setPosition(bg2.getPosition());
        typeLabel.setScale(20.0 / 25.0);
        container.addChild(typeLabel);

        infoLabel.setPosition(bg3.getPosition());
        infoLabel.setScale(20.0 / 25.0);
        container.addChild(infoLabel);

        goldLabel.setPosition(bg4.getPosition());
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setScale(20.0 / 25.0);
        container.addChild(goldLabel);

        // if (price == 0) {
        //     priceLabel.setString("Thành công");
        //     priceLabel.setColor(cc.color("#ffde00"));
        // }
        // else {
        //     priceLabel.setString("Thất bại");
        //     priceLabel.setColor(cc.color("#9e9e9e"));
        // }
        priceLabel.setString(price);
        priceLabel.setPosition(bg5.getPosition());
        priceLabel.setScale(20.0 / 25.0);
        container.addChild(priceLabel);
    }
});

var PaymentLayer = LobbySubLayer.extend({
    ctor: function () {
        this._super("#lobby-title-payment.png");


        if(cc.sys.isNative){
            var allLayer = [
                new PaymentCardLayer(),
                new PaymentInAppLayer(),
                new PaymentGiftcode(),
                new PaymentSMSLayer(),
                new PaymentHistoryLayer()
            ];

            var payment_tab_1 = [
                "#payment-tab-1.png",
                //"#payment-tab-2.png",
                "#payment-tab-3.png",
                "#payment-tab-4.png",
                "#payment-tab-5.png",
                "#payment-tab-6.png"
            ];

            var payment_tab_2 = [
                "#payment-tab-selected-1.png",
                //"#payment-tab-selected-2.png",
                "#payment-tab-selected-3.png",
                "#payment-tab-selected-4.png",
                "#payment-tab-selected-5.png",
                "#payment-tab-selected-6.png"
            ];
        }
        else{
            var allLayer = [
                new PaymentCardLayer(),
                //new PaymentInAppLayer(),
                //new PaymentInAppLayer(),
                new PaymentGiftcode(),
                new PaymentSMSLayer(),
                new PaymentHistoryLayer()
            ];

            var payment_tab_1 = [
                "#payment-tab-1.png",
                "#payment-tab-4.png",
                "#payment-tab-5.png",
                "#payment-tab-6.png"
            ];

            var payment_tab_2 = [
                "#payment-tab-selected-1.png",
                "#payment-tab-selected-4.png",
                "#payment-tab-selected-5.png",
                "#payment-tab-selected-6.png"
            ];
        }

        for (var i = 0; i < allLayer.length; i++) {
            this.addChild(allLayer[i]);
        }

        this._initTab(payment_tab_1, payment_tab_2, allLayer);
    },

    onEnter: function () {
        this._super();
        this.mToggle.selectItem(0);
    },

    onExit: function () {
        this._super();
    }
});