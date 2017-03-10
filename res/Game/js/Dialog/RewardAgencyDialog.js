/**
 * Created by QuyetNguyen on 11/30/2016.
 */

var s_RewardAgencyDialog_Tab = ["MIỀN BẮC", "MIỀN TRUNG", "MIỀN NAM"];

var RewardAgencyDialog = Dialog.extend({
    ctor : function () {
        this._super();

        this.initWithSize(cc.size(600,680));
        this.title.setString("Danh sách đại lý");
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        var mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        this.mToggle = mToggle;

        var content = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Nội dung đổi thưởng", cc.TEXT_ALIGNMENT_CENTER, this.getContentSize().width);
        content.setColor(cc.color("#ffffff"));
        content.setPosition(this.getContentSize().width/2, this.getContentSize().height - 230);
        this.addChild(content, 1);
        this.contentLabel = content;

        var dx = (this.getContentSize().width - this._marginLeft - this._marginRight)/s_RewardAgencyDialog_Tab.length;
        var x = this._marginLeft + dx/2;
        var y = this.getContentSize().height - 290.0;

        var top = y - 40;
        var bottom = 100.0;
        var left = 100.0;
        var right = this.getContentSize().width - 100.0;

        this.allListItem = [];

        var thiz = this;
        for(var i=0;i<s_RewardAgencyDialog_Tab.length;i++){
            (function () {
                var tabLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, s_RewardAgencyDialog_Tab[i]);
                tabLabel.setColor(cc.color("#ffffff"));
                tabLabel.setPosition(x, y);
                thiz.addChild(tabLabel,1);

                var itemList = new newui.TableView(cc.size(right - left, top - bottom), 1);
                itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
                itemList.setScrollBarEnabled(false);
                itemList.setPadding(20);
                itemList.setMargin(20, 20, 0, 0);
                itemList.setPosition(cc.p(left, bottom));
                thiz.addChild(itemList,0);
                thiz.allListItem.push(itemList);

                var toggleItem = new ToggleNodeItem(tabLabel.getContentSize());
                toggleItem.setPosition(tabLabel.getPosition());
                toggleItem.onSelect = function () {
                    tabLabel.setColor(cc.color("#32b1dd"));
                    itemList.setVisible(true);
                };
                toggleItem.onUnSelect = function () {
                    tabLabel.setColor(cc.color("#ffffff"));
                    itemList.setVisible(false);
                };
                mToggle.addItem(toggleItem);

                x += dx;
            })();
        }

        //
        for(var i=0 ; i< this.allListItem.length; i++){
            var list = this.allListItem[i];
            for(var j=0;j<10;j++){
                this.addItem(list, "name", (i+j), "address", "012345678", "facebook");
            }
        }
    },

    addItem : function (listItem, name, agencyId, address, phone, facebook) {
        var bg = new cc.Sprite("#agency_cell_bg.png");
        var container = new ccui.Widget();
        container.setContentSize(bg.getContentSize());
        container.addChild(bg);
        bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
        listItem.pushItem(container);

        var nameLabel = new cc.LabelTTF(name, cc.res.font.Roboto_CondensedBold, 20);
        nameLabel.setColor(cc.color("#30beec"));
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(60.0, 124);
        container.addChild(nameLabel);

        var idLabel = new cc.LabelTTF("Mã đại lý: "+agencyId, cc.res.font.Roboto_Condensed, 20);
        idLabel.setAnchorPoint(cc.p(0.0, 0.5));
        idLabel.setPosition(nameLabel.x, nameLabel.y - 25);
        container.addChild(idLabel);

        var addressLabel = new cc.LabelTTF("Địa chỉ: "+address, cc.res.font.Roboto_Condensed, 20);
        addressLabel.setAnchorPoint(cc.p(0.0, 0.5));
        addressLabel.setPosition(nameLabel.x, idLabel.y - 25);
        container.addChild(addressLabel);

        var phoneLabel = new cc.LabelTTF("Điện thoại: "+phone, cc.res.font.Roboto_Condensed, 20);
        phoneLabel.setAnchorPoint(cc.p(0.0, 0.5));
        phoneLabel.setPosition(nameLabel.x, addressLabel.y - 25);
        container.addChild(phoneLabel);

        var fbLabel1 = new cc.LabelTTF("Facebook: ", cc.res.font.Roboto_Condensed, 20);
        fbLabel1.setAnchorPoint(cc.p(0.0, 0.5));
        fbLabel1.setPosition(nameLabel.x, phoneLabel.y - 25);
        container.addChild(fbLabel1);

        var fbLabel2 = new cc.LabelTTF(facebook, cc.res.font.Roboto_Condensed, 20);
        fbLabel2.setAnchorPoint(cc.p(0.0, 0.5));
        fbLabel2.setColor(cc.color("#000360"));
        fbLabel2.setPosition(fbLabel1.x + fbLabel1.getContentSize().width, fbLabel1.y);
        container.addChild(fbLabel2);

        var thiz = this;
        var fbTouch = new ccui.Widget();
        fbTouch.setContentSize(fbLabel2.getContentSize());
        fbTouch.setPosition(fbLabel2.x + fbLabel2.getContentSize().width/2, fbLabel2.y);
        container.addChild(fbTouch);
        fbTouch.setTouchEnabled(true);
        fbTouch.addClickEventListener(function () {
            thiz.onTouchFacebookLabel(facebook);
        });

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            if(thiz.onTouchCell){
                thiz.onTouchCell(name, agencyId, address, phone, facebook);
            }
        });
    },

    onTouchFacebookLabel : function (facebook) {
        cc.log("onTouchFacebookLabel: "+facebook);
    },

    onTouchCell : function (name, agencyId, address, phone, facebook) {

    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
    },
    
    setInfo : function (cashOut, gold) {
        var text = "Bạn đang đổi thưởng "+cc.Global.NumberFormat1(gold) + "V thành "+cc.Global.NumberFormat1(cashOut) +"VNĐ\n Vui lòng chọn đại lý";
        this.contentLabel.setString(text);
    }
});