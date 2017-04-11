var HistoryPhien = IDialog.extend({
    ctor: function (data) {
        this._super();
        var thiz = this;
        var board_bg = new ccui.Scale9Sprite("board_bg.png", cc.rect(105, 105, 147, 147));
        board_bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(board_bg);
        this.board_bg = board_bg;
        this.initWithSize(cc.size(1080, 720));
        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "LỊCH SỬ PHIÊN " + data["idVan"]);
        title.setPosition(this.getContentSize().width / 2, this.getContentSize().height - 138);
        title.setColor(cc.color("#ffde00"));
        this.addChild(title);

        var lblDate = new cc.LabelTTF("1111",cc.res.font.Roboto_Condensed,20);
        lblDate.setColor(cc.color(196, 225, 255,255));
        lblDate.setPosition(this.getContentSize().width / 2,503 );
        this.addChild(lblDate);


        var lblCua = new cc.LabelTTF("TAI",cc.res.font.Roboto_Condensed,20);
        lblCua.setColor(cc.color(141, 232, 255,255));
        lblCua.setPosition(this.getContentSize().width / 2,470 );
        this.addChild(lblCua);

        for(var i=0; i< 3; i++){
            var xucxac = new cc.Sprite("#taixiu_dice_1.png");
            xucxac.setPosition(418 + 122 * i, 404);
            thiz.addChild(xucxac);
        }

        var line_ngang = new ccui.Scale9Sprite("lobby_bg_white.png",cc.rect(12, 12, 4, 4));
        line_ngang.setPreferredSize(cc.size(this.getContentSize().width - 200, 1));
        line_ngang.setPosition(this.getContentSize().width/2,355);
        line_ngang.setOpacity(30);
        this.addChild(line_ngang);

        var line_ngang1 = new ccui.Scale9Sprite("lobby_bg_white.png",cc.rect(12, 12, 4, 4));
        line_ngang1.setPreferredSize(cc.size(this.getContentSize().width - 200, 1));
        line_ngang1.setPosition(this.getContentSize().width/2,302);
        line_ngang1.setOpacity(30);
        this.addChild(line_ngang1);


        var line_doc = new ccui.Scale9Sprite("lobby_bg_white.png",cc.rect(12, 12, 4, 4));
        line_doc.setPreferredSize(cc.size(1, 270));
        line_doc.setAnchorPoint(0.5,0);
        line_doc.setPosition(this.getContentSize().width/2,82);
        line_doc.setOpacity(30);
        this.addChild(line_doc);

        var lblTai =  new cc.LabelTTF("TÀI", cc.res.font.Roboto_Condensed,30);
        lblTai.setColor(cc.color(119, 203, 238,255));
        lblTai.setPosition(this.getContentSize()/2 + 247,328);
        this.addChild(lblTai);

        var lblXiu =  new cc.LabelTTF("XỈU", cc.res.font.Roboto_Condensed,30);
        lblXiu.setColor(cc.color(255, 222, 0,255));
        lblXiu.setPosition(this.getContentSize()/2 - 247,328);
        this.addChild(lblXiu);

        var arrTitle = ["Trả lại" ,"Cược",  "Người chơi","Thời gian"];
        for(var i=0; i < 8; i++){
            var lbl1 = new cc.LabelTTF(arrTitle[i%4], cc.res.font.Roboto_Condensed,23);
            lbl1.setColor( cc.color(36, 67, 108,255));
            if(i%4 == 1 || i%4 == 2)
            {
                lbl1.setPosition(this.getContentSize().width/2 + (4 - i)*110 - 40,284);
            }
            else{
                lbl1.setPosition(this.getContentSize().width/2 + (4 - i)*110 -55,284);
            }
            thiz.addChild(lbl1);
        }
        this.arrTai = [];
        for(var i =0;i< 100;i++){
            var item = {
                time : "13212321",
                namePlayer : "nguyenvan",
                bet:1000,
                return: 2000
            };
            this.arrTai.push(item);
        }

        var listTai = new newui.TableView(cc.size(line_ngang1.getContentSize().width/2, 150), 1);
        listTai.setPadding(0);
        listTai.setMargin(0,0,0,0);
        listTai.addEventListener(function (selector,event) {
            cc.log(event);
        });
        listTai.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listTai.setBounceEnabled(true);
        listTai.setScrollBarEnabled(true);

        this.listTai = listTai;
        listTai.setPosition(this.getContentSize().width/2 - line_ngang1.getContentSize().width/2, this.getContentSize().height/2 - 165);
        this.addChild(listTai);
        for(var i=0; i < 5;i++){
            var bg_tiem = new  ccui.Widget();
            bg_tiem.setContentSize(cc.size(line_ngang1.getContentSize().width/2,50));
            var lbl = new cc.LabelTTF(i.toString(),cc.res.font.Roboto_Condensed,30);
            lbl.setPosition(bg_tiem.getContentSize().width/2, bg_tiem.getContentSize().height/2);
            bg_tiem.addChild(lbl);
            listTai.pushItem(bg_tiem);
         };
         this.isReplace = false;
        this.scheduleUpdate();

        var buttom = new ccui.Button("taixiu_dice_1.png","","",ccui.Widget.PLIST_TEXTURE);
        buttom.setPosition(this.getContentSize().width/2 - line_ngang1.getContentSize().width/2, this.getContentSize().height/2);
        buttom.addClickEventListener(function () {
            thiz.isReplace  = true;
        });
        this.addChild(buttom);
        this.indexOld = -100;
    },
    update:function (dt) {

        var indexNew = Math.floor(this.listTai.getInnerContainerPosition().y/50) * 50;
        if(this.indexOld != indexNew && this.isReplace && this.listTai.is)
        {
            cc.log(indexNew);

            // this.isReplace = false;
             var arr = this.listTai._allItems;
            var item = this.listTai._allItems[0];
            // delete this.listTai[ 0 ];
            this.listTai._allItems.splice(0, 1);
            this.listTai._allItems.push(item);
            this.listTai.removeItem(item);
            this.listTai.refreshView();
            this.indexOld =  Math.floor(this.listTai.getInnerContainerPosition().y/50) * 50;
            // item.removeFromParent(true);
            // this.listTai.pushItem(item);

        }
    },

    initWithSize: function (mSize) {
        this.board_bg.setPreferredSize(cc.size(mSize.width, mSize.height));
        this.setContentSize(this.board_bg.getContentSize());
    },
});