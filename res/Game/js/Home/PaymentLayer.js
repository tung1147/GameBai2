/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var payment_card_img = payment_card_img || ["#payment-card-mobi","#payment-card-viettel","#payment-card-vina","#payment-card-gate","#payment-card-vcoin","#payment-card-bit"];
var payment_card_code = payment_card_code || ["Mã thẻ Mobi", "Mã thẻ Viettel", "Mã thẻ Vina", "Mã thẻ Gate", "Mã thẻ Vcoin", "Mã thẻ Bit"];
var payment_card_serial = payment_card_serial || ["Serial thẻ Mobi", "Serial thẻ Viettel", "Serial thẻ Vina", "Serial thẻ Gate", "Serial thẻ Vcoin", "Serial thẻ Bit"];
var PaymentCardLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("lobby-text-input.png",cc.rect(10,10,4,4));
        bg1.setPreferredSize(cc.size(420 * cc.winSize.screenScale, 60));
        bg1.setPosition(920.0 * cc.winSize.screenScale, 390);
        this.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("lobby-text-input.png",cc.rect(10,10,4,4));
        bg2.setPreferredSize(bg1.getContentSize());
        bg2.setPosition(bg1.x, 302);
        this.addChild(bg2);

        var maThe = new newui.EditBox(cc.size(bg1.getContentSize().width - 6, bg1.getContentSize().height-2));
        maThe.setFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        maThe.setPlaceholderFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        maThe.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        maThe.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        maThe.setPlaceHolder("Mã thẻ");
        maThe.setPosition(bg1.getPosition());
        this.addChild(maThe, 1);
        this.maThe = maThe;

        var serialThe = new newui.EditBox(cc.size(bg2.getContentSize().width - 6, bg2.getContentSize().height-2));
        serialThe.setFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        serialThe.setPlaceholderFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        serialThe.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        serialThe.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        serialThe.setPlaceHolder("Serial thẻ");
        serialThe.setPosition(bg2.getPosition());
        this.addChild(serialThe, 1);
        this.serialThe = serialThe;

        var okButton = new ccui.Button("sublobby-button.png","sublobby-button-2.png","", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(cc.size(bg1.getContentSize().width, 55));
        okButton.setPosition(bg1.x, 192);
        okButton.setTitleText("Nạp vàng");
        okButton.setTitleFontName(cc.res.font.Roboto_Condensed);
        okButton.setTitleFontSize(25);
        okButton.setTitleColor(cc.color(255,255,255));
        this.addChild(okButton);

        this.initTiGia();
        this.initCardItem();
    },

    initCardItem : function () {
        this.cardSelected = 0;
        var card_img = ["#payment-card-mobi","#payment-card-viettel","#payment-card-vina","#payment-card-gate","#payment-card-vcoin","#payment-card-bit"];

        var _boder = 30.0 * cc.winSize.screenScale;
        var _padding = (cc.winSize.width - _boder*2 - 6.0*186.0 * cc.winSize.screenScale)/5;
        var listItem = new newui.TableView(cc.size(cc.winSize.width, 150), 1);
        listItem.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listItem.setMargin(0,0,_boder, _boder);
        listItem.setPadding(_padding);
        listItem.setScrollBarEnabled(false);
        listItem.setPosition(0,447);
        this.addChild(listItem);
        var thiz = this;
        for(var i=0;i<6;i++){
            var bg1 = new cc.Sprite(card_img[i] +"-1.png");
            bg1.setOpacity(0.3 * 255);
            bg1.setPosition(bg1.getContentSize().width/2, bg1.getContentSize().height/2);
            var bg2 = new cc.Sprite(card_img[i] +"-2.png");
            bg2.setPosition(bg1.getPosition());
            bg2.visible = false;
            var contaner = new ccui.Widget();
            contaner.setContentSize(bg1.getContentSize());
            contaner.addChild(bg1);
            contaner.addChild(bg2);
            contaner.setScale(cc.winSize.screenScale);
            listItem.pushItem(contaner);
            contaner.bg1 = bg1;
            contaner.bg2 = bg2;
            contaner.maThe = payment_card_code[i];
            contaner.serialThe = payment_card_serial[i];
            contaner.select = function () {
                this.bg1.visible = false;
                this.bg2.visible = true;
            };
            contaner.unselect = function () {
                this.bg1.visible = true;
                this.bg2.visible = false;
            };
            contaner.setTouchEnabled(true);
            contaner.addClickEventListener(function (item) {
                thiz.selectCard(item);
            });
            if(i==0){
                this.selectCard(contaner);
            }
        }
    },
    selectCard : function (card) {
        if(this.cardSelected){
            this.cardSelected.setTouchEnabled(true);
            this.cardSelected.unselect();
        }
        this.cardSelected = card;
        this.cardSelected.setTouchEnabled(false);
        this.cardSelected.select();
        this.maThe.setPlaceHolder(this.cardSelected.maThe);
        this.serialThe.setPlaceHolder(this.cardSelected.serialThe);
    },
    initTiGia : function () {
        var bg = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 78));
        bg.setPreferredSize(cc.size(420, 260));
        bg.setAnchorPoint(cc.p(0.5, 0.5));
        bg.setPosition(370 * cc.winSize.screenScale, 290);
        this.addChild(bg);

        var listItem = new newui.TableView(cc.size(bg.getContentSize().width - 4, bg.getContentSize().height), 1);
        listItem.setMargin(10,20,0,0);
        listItem.setScrollBarEnabled(false);
        listItem.setAnchorPoint(cc.p(0.5,0.5));
        listItem.setPosition(bg.getPosition());
        this.addChild(listItem);
        this.listTiGia= listItem;

        for(var i=0;i<10;i++){
            this.addTiGia(20000, 20000);
        }
    },
    addTiGia : function (money, gold) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listTiGia.getContentSize().width, 40));
        this.listTiGia.pushItem(container);

        var moneyLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(money) + " VNĐ");
        moneyLabel.setAnchorPoint(cc.p(1.0,0.5));
        moneyLabel.setPosition(container.getContentSize().width/2 - 20, container.getContentSize().height/2);
        container.addChild(moneyLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(gold) + " V");
        goldLabel.setAnchorPoint(cc.p(0.0,0.5));
        goldLabel.setPosition(container.getContentSize().width/2 + 20, container.getContentSize().height/2);
        container.addChild(goldLabel);

        var equalLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "=");
        equalLabel.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
        container.addChild(equalLabel);
    }
});

var PaymentInAppLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var listItem = new newui.TableView(cc.size(cc.winSize.width, 450), 1);
        listItem.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listItem.setMargin(0,0,50,50);
        listItem.setPadding(30.0);
        listItem.setScrollBarEnabled(false);
        listItem.setPosition(0, 130);
        this.addChild(listItem);
        this.listItem= listItem;

        for(var i =0;i<10;i++){
            this.addItem(i%3 + 1,1000000, 0.99, "bundleID");
        }
    },

    addItem : function (logoId, gold, price, bundleId) {
        var bg = new cc.Sprite("#payment-inapp-bg.png");
        var container = new ccui.Widget();
        container.setContentSize(cc.size(bg.getContentSize().width, bg.getContentSize().height + 56));
        bg.setPosition(container.getContentSize().width/2, container.getContentSize().height - bg.getContentSize().height/2);
        container.addChild(bg);

        var bg2 = new cc.Sprite("#payment-inapp-bg-2.png");
        bg2.setPosition(bg.x, bg2.getContentSize().height/2);
        container.addChild(bg2);

        var icon = new cc.Sprite("#payment-inapp-icon-"+logoId+".png");
        icon.setPosition(bg.getPosition());
        container.addChild(icon);

        var goldIcon = new cc.Sprite("#payment-inapp-goldicon.png");
        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, cc.Global.NumberFormat1(gold) + "V");
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(bg.x + goldIcon.getContentSize().width/2, bg.y - 104);
        container.addChild(goldLabel);
        goldIcon.setPosition(goldLabel.x - goldLabel.getContentSize().width/2 - goldIcon.getContentSize().width/2, goldLabel.y);
        container.addChild(goldIcon);

        var priceLabel = ccui.RichText.createWithXML("<font face='"+cc.res.font.Roboto_Condensed+"' size='25'><font color='#ffde00'>$</font>"+price+"</font>");
        priceLabel.setPosition(bg2.getPosition());
        container.addChild(priceLabel,1);

        this.listItem.pushItem(container);
    }
});

var PaymentGiftcode = cc.Node.extend({
    ctor : function () {
        this._super();
        var bg = ccui.Scale9Sprite.createWithSpriteFrameName("lobby-text-input.png",cc.rect(10,10,4,4));
        bg.setPreferredSize(cc.size(420, 60));
        bg.setPosition(cc.winSize.width/2, 420);
        this.addChild(bg);

        var giftCode = new newui.EditBox(cc.size(bg.getContentSize().width - 6, bg.getContentSize().height-2));
        giftCode.setFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        giftCode.setPlaceholderFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        giftCode.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        giftCode.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        giftCode.setPlaceHolder("Nhập giftcode");
        giftCode.setPosition(bg.getPosition());
        this.addChild(giftCode, 1);

        var okButton = new ccui.Button("sublobby-button.png","sublobby-button-2.png","", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(cc.size(bg.getContentSize().width, 55));
        okButton.setPosition(bg.x, 300);
        okButton.setTitleText("Nạp vàng");
        okButton.setTitleFontName(cc.res.font.Roboto_Condensed);
        okButton.setTitleFontSize(25);
        okButton.setTitleColor(cc.color(255,255,255));
        this.addChild(okButton);
    }
});


var PaymentLayer = LobbySubLayer.extend({
    ctor : function () {
        this._super();

        var layer = new PaymentInAppLayer();
        this.addChild(layer);

        var title = new cc.Sprite("#lobby-title-payment.png");
        title.setPosition(cc.winSize.width/2, 720.0 - 63 * cc.winSize.screenScale);
        this.addChild(title);
        title.setScale(cc.winSize.screenScale);

        var icon_img1 = ["#lobby-start-1.png", "#lobby-hearts-1.png", "#lobby-clubs-1.png", "#lobby-spades-1.png", "#lobby-diamonds-1.png"];
        var icon_img2 = ["#lobby-start-2.png", "#lobby-hearts-2.png", "#lobby-clubs-2.png", "#lobby-spades-2.png", "#lobby-diamonds-2.png"];

        var bottomBar = new cc.Node();
        this.addChild(bottomBar);
        bottomBar.setScale(cc.winSize.screenScale);

        var tabBg = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-tab-bg.png", cc.rect(10,0,4,82));
        tabBg.setPreferredSize(cc.size(1100, 82));
        tabBg.setPosition(1280.0/2, tabBg.getContentSize().height/2);
        bottomBar.addChild(tabBg);

        var dx = tabBg.getContentSize().width/5;
        var x = tabBg.x -  tabBg.getContentSize().width/2 + dx/2;

        var selectBar = new cc.Sprite("#sublobby-tab-selected.png");
        bottomBar.addChild(selectBar);
        if(selectBar.getContentSize().width > dx){
            selectBar.setScaleX(dx/selectBar.getContentSize().width);
        }

        var selectBg = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-tab-selected-bg.png", cc.rect(10,10,4,4));
        selectBg.setPreferredSize(cc.size(dx, tabBg.getContentSize().height));
        bottomBar.addChild(selectBg);

        var mToggle = new ToggleNodeGroup();
        bottomBar.addChild(mToggle);

        for(var i=0;i<5;i++){
            var icon1 = new cc.Sprite(icon_img1[i]);
            var icon2 = new cc.Sprite(icon_img2[i]);
            icon1.setAnchorPoint(cc.p(0.5,0.0));
            icon2.setAnchorPoint(cc.p(0.5,0.0));
            icon1.setPosition(x, 0);
            icon2.setPosition(icon1.getPosition());
            bottomBar.addChild(icon1);
            bottomBar.addChild(icon2);

            var text1 = new cc.Sprite("#payment-tab-"+(i+1)+".png");
            var text2 = new cc.Sprite("#payment-tab-selected-"+(i+1)+".png");
            text1.setPosition(x, tabBg.y);
            text2.setPosition(text1.getPosition());
            bottomBar.addChild(text1,1);
            bottomBar.addChild(text2,1);

            var toggleItem = new ToggleNodeItem(selectBg.getContentSize());
            toggleItem.icon1 = icon1;
            toggleItem.icon2 = icon2;
            toggleItem.text1 = text1;
            toggleItem.text2 = text2;
            toggleItem.setPosition(x, tabBg.y);
            toggleItem.onSelect = function (isForce) {
                if(isForce){
                    selectBg.setPosition(this.getPosition());
                    selectBar.setPosition(selectBg.getPosition());
                }
                else{
                    selectBg.stopAllActions();
                    selectBar.stopAllActions();
                    selectBg.runAction(new cc.MoveTo(0.1, this.getPosition()));
                    selectBar.runAction(new cc.MoveTo(0.1, this.getPosition()));
                }

                this.icon1.visible = false;
                this.icon2.visible = true;
                this.text1.visible = false;
                this.text2.visible = true;
            };
            toggleItem.onUnSelect = function () {
                this.icon1.visible = true;
                this.icon2.visible = false;
                this.text1.visible = true;
                this.text2.visible = false;
            };
            x += dx;
            mToggle.addItem(toggleItem);
        }
        this.mToggle = mToggle;
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
    }
});