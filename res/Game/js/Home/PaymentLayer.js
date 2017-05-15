/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var s_currency_icon = s_currency_icon || {};
s_currency_icon["USD"] = "$";

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

        this.initItems();
    },

    initItems : function () {
        var data = cc.Global.inAppBillingData;
        if (data) {
            var thiz = this;
            for (var i = 0; i < data.length; i++) {
                (function () {
                    var gold = data[i]["gold"];
                    var price = data[i]["price"];

                    var currency = s_currency_icon[data[i]["currency"]];
                    if(!currency){
                        currency = data[i]["currency"];
                    }
                    if(!currency){
                        currency = "VNĐ";
                    }

                    var inappId = data[i]["id"];
                    var container = thiz.addItem(i % 3 + 1, gold + " V", price + " " + currency);
                    container.addClickEventListener(function (item) {
                        thiz._selectInappItem(inappId);
                    });
                })();
            }
        }
    },

    _selectInappItem : function (inappId) {
        if(!LoadingDialog.getInstance().isShow()){
            LoadingDialog.getInstance().show("Đang thanh toán");
            SystemPlugin.getInstance().buyIAPItem(inappId);
        }
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

        //var goldIcon = new cc.Sprite("#payment-inapp-goldicon.png");
        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, gold);
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(100, 108);
        goldLabel.setColor(cc.color("#ffde00"));
        container.addChild(goldLabel);

        var priceLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, price);
        priceLabel.setAnchorPoint(cc.p(1.0, 0.5));
        priceLabel.setPosition(260,25);
        container.addChild(priceLabel, 1);
        container.setTouchEnabled(true);

        this.listItem.pushItem(container);
        return container;
    }
});

var PaymentLayer = LobbySubLayer.extend({
    ctor: function () {
        this._super("#lobby-title-payment.png");

        if(cc.sys.isNative) {
            this.addChild(new PaymentInAppLayer());
        }
    },

    onEnter: function () {
        this._super();
    },

    onExit: function () {
        this._super();
    }
});