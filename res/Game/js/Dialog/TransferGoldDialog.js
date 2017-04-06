/**
 * Created by Quyet Nguyen on 4/5/2017.
 */

var s_transferGoldToggle = s_transferGoldToggle || ["Người gửi chịu phí", "Người nhận chịu phí"];

var TransferGoldDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Chuyển vàng");
        this.initWithSize(cc.size(578,518));
        this._initView();
    },

    _initView : function () {
        var thiz = this;

        var bg1 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg1.setPreferredSize(cc.size(280, 44));
        bg1.setPosition(this.getContentSize().width/2, 489);
        this.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg2.setPreferredSize(cc.size(280, 44));
        bg2.setPosition(this.getContentSize().width/2, 419);
        this.addChild(bg2);

        var recvUser = new newui.TextField(cc.size(262,44), cc.res.font.Roboto_Condensed_18);
        recvUser.setPlaceHolder("Người nhận");
        recvUser.setPlaceHolderColor(cc.color("#787878"));
        recvUser.setTextColor(cc.color("#c4e1ff"));
        recvUser.setPosition(bg1.getPosition());
        this.addChild(recvUser, 1);
        this.recvUser = recvUser;

        var goldTransfer = new newui.TextField(cc.size(262,44), cc.res.font.Roboto_Condensed_18);
        goldTransfer.setPlaceHolder("Số tiền chuyển");
        goldTransfer.setPlaceHolderColor(cc.color("#787878"));
        goldTransfer.setTextColor(cc.color("#fede01"));
        goldTransfer.setPosition(bg2.getPosition());
        this.addChild(goldTransfer, 1);
        this.goldTransfer = goldTransfer;

        var userCorrectIcon = new cc.Sprite("#dialog_correct.png");
        userCorrectIcon.setPosition(recvUser.x + 120, recvUser.y);
        this.addChild(userCorrectIcon);
        this.userCorrectIcon = userCorrectIcon;

        var goldCorrectIcon = new cc.Sprite("#dialog_correct.png");
        goldCorrectIcon.setPosition(goldTransfer.x + 120, goldTransfer.y);
        this.addChild(goldCorrectIcon);
        this.userCorrectIcon = goldCorrectIcon;

        var label1 = new ccui.RichText();
        label1.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, "Còn lại ", cc.res.font.Roboto_Condensed, 18));
        label1.pushBackElement(new ccui.RichElementText(1, cc.color("#ffde00"), 255, "100,000 V", cc.res.font.Roboto_CondensedBold, 18));
        label1.setPosition(cc.p(bg1.x, 360));
        this.addChild(label1, 1);
        this.label1 = label1;

        var label2 = new ccui.RichText();
        label2.pushBackElement(new ccui.RichElementText(0, cc.color("#77cbee"), 255, "Name ", cc.res.font.Roboto_CondensedBold, 18));
        label2.pushBackElement(new ccui.RichElementText(1, cc.color("#ffffff"), 255, "Nhận ", cc.res.font.Roboto_Condensed, 18));
        label2.pushBackElement(new ccui.RichElementText(2, cc.color("#ffde00"), 255, "100,000 V", cc.res.font.Roboto_CondensedBold, 18));
        label2.setPosition(cc.p(bg1.x, 330));
        this.addChild(label2, 1);
        this.label2 = label2;

        var  mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        this.mToggle = mToggle;
        for(var i=0;i<s_transferGoldToggle.length;i++){
            (function () {
                var icon1 = new cc.Sprite("#dialog_toggle_1.png");
                icon1.setPosition(219 + 188 * i, 291);
                thiz.addChild(icon1);

                var icon2 = new cc.Sprite("#dialog_toggle_2.png");
                icon2.setPosition(icon1.getPosition());
                thiz.addChild(icon2);

                var label = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, s_transferGoldToggle[i]);
                label.setColor(cc.color("#72acd6"));
                label.setAnchorPoint(cc.p(0.0, 0.5));
                label.setPosition(icon1.x + 17, icon1.y);
                thiz.addChild(label, 1);

                var toggleItem = new ToggleNodeItem(icon1.getContentSize());
                toggleItem.setPosition(icon2.getPosition());
                mToggle.addItem(toggleItem);
                toggleItem.onSelect = function () {
                    icon2.visible = true;
                    thiz._updateGold();
                };

                toggleItem.onUnSelect = function () {
                    icon2.visible = false;
                };
            })();
        }

        var okButton = new ccui.Button("dialog-button-1.png","","",ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(cc.size(280, 44));
        okButton.setZoomScale(0.01);
        okButton.setPosition(this.getContentSize().width/2, 209);
        this.addChild(okButton);

        var okLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "CHUYỂN VÀNG");
        okLabel.setColor(cc.color("#682e2e"));
        okLabel.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okLabel);

        var padding = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18,"|");
         padding.setColor(cc.color("#72acd6"));
        padding.setPosition(this.getContentSize().width/2, 132);
        this.addChild(padding,1);

        var historyLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18,"LỊCH SỬ");
        historyLabel.setColor(cc.color("#72acd6"));
        historyLabel.setPosition(this.getContentSize().width/2 - 10 - historyLabel.getContentSize().width/2, padding.y);
        this.addChild(historyLabel,1);

        var tutorialLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18,"HƯỚNG DẪN");
        tutorialLabel.setColor(cc.color("#72acd6"));
        tutorialLabel.setPosition(this.getContentSize().width/2 + 10 + tutorialLabel.getContentSize().width/2, padding.y);
        this.addChild(tutorialLabel,1);

        var historyBt = new WidgetButton(historyLabel.getContentSize());
        historyBt.setPosition(historyLabel.getPosition());
        this.addChild(historyBt);
        historyBt.addClickEventListener(function () {
            var dialog = new TransferGoldHistory();
            dialog.show();
        });

        var tutorialBt = new WidgetButton(tutorialLabel.getContentSize());
        tutorialBt.setPosition(tutorialLabel.getPosition());
        this.addChild(tutorialBt);
        tutorialBt.addClickEventListener(function () {
            cc.log("tutorialBt");
        });
    },

    _updateName : function () {
        var userName = this.recvUser.getText();
        this.label2.removeElement(0);
        this.label2.insertElement(new ccui.RichElementText(0, cc.color("#77cbee"), 255, userName, cc.res.font.Roboto_CondensedBold, 18), 0);
    },

    _updateGold : function () {
      //  this.mToggle.itemClicked._fee * GameConfig.fee
        var goldStr = this.goldTransfer.getText();
        if(goldStr && goldStr != ""){
            var gold = parseInt(goldStr);
        }
        else{
            var gold = 0;
        }

        this.label2.removeElement(2);
        this.label2.insertElement(new ccui.RichElementText(2, cc.color("#ffde00"), 255, cc.Global.NumberFormat1(gold) + " V", cc.res.font.Roboto_CondensedBold, 18),2);

        var currentGold = PlayerMe.gold - gold;
        this.label1.removeElement(1);
        this.label1.insertElement(new ccui.RichElementText(1, cc.color("#ffde00"), 255, cc.Global.NumberFormat1(currentGold) + " V", cc.res.font.Roboto_CondensedBold, 18),1);
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);

        this._updateName();
        this._updateGold();
    }
});