/**
 * Created by Quyet Nguyen on 3/21/2017.
 */

_arrPosHisotyVQ = [51, 301, 479, 650];

var STRING_VONG_LON = ["","500","1,000","2,000","5,000","10,000","20,000","50,000","100,000","200,000","500,000","100 EXP","Goodluck!"];

var STRING_VONG_NHO = ["","500","1,000","5,000", "10,000", "50,000","100,000","100 EXP","Thêm lượt"];


var HistoryVongQuay = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("LỊCH SỬ");
        this.initWithSize(cc.size(860, 520));
        var listItem = new newui.TableView(cc.size(this.getContentSize().width - 28 * 2, 370), 1);
        listItem.setPosition(cc.p(28, 18));
        this.addChild(listItem);
        this.listItem = listItem;
        var arrName = ["Giờ","ID","Vòng lớn" , "Vòng nhỏ"] ;
        for(var i = 0; i < 4; i++){
            var timeLaybel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, arrName[i]);
            timeLaybel.setAnchorPoint(cc.p(0,0.5));
            timeLaybel.setPosition(_arrPosHisotyVQ[i],403);
            timeLaybel.setColor(cc.color("#77cbee"));
            this.addChild(timeLaybel);
        }
        // for(var i= 0; i<20;i++){
        //     this.addItem("1","aaa",1000,1000);
        // }
    },
    onSFSExtension: function (messageType, content) {

        if(content.c == 505){
            var arr = content.p[1];
            for(var i = 0; i < arr.length; i++){
                var temp = arr[i];
                var name = temp[1];
                if (name.length > 15)
                    name = name.substring(0, 15) ;
                if (name.length > 3 && name != PlayerMe.username)
                    name = name.substring(0, name.length - 3) + "***";
                    this.addItem(temp[3],name,STRING_VONG_LON[temp[4]],STRING_VONG_NHO[temp[5]]);
            }
        }
    },
    addItem:function (timeCreate, userName,gold,gold2) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width, 60));
        this.listItem.pushItem(container);
        if(this.listItem.size()%2)
        {
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(cc.size(container.width, 60));
            bg.setColor(cc.color("#000000"));
            bg.setOpacity(100);
            bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
            container.addChild(bg);
        }


        var timeLaybel =  cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, timeCreate);
        timeLaybel.setPosition(_arrPosHisotyVQ[0] - 28,30);
        container.addChild(timeLaybel);
        timeLaybel.setAnchorPoint(cc.p(0,0.5));

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, userName);
        nameLabel.setPosition(_arrPosHisotyVQ[1] - 28,30);
        container.addChild(nameLabel);
        nameLabel.setAnchorPoint(cc.p(0,0.5));

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, gold);
        goldLabel.setColor(cc.color(255, 194, 0,255));
        goldLabel.setPosition(_arrPosHisotyVQ[2] - 28,30);
        container.addChild(goldLabel);
        goldLabel.setAnchorPoint(cc.p(0,0.5));

        var goldLabel2 = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, gold2);
        goldLabel2.setColor(cc.color(255, 194, 0,255));
        goldLabel2.setPosition(_arrPosHisotyVQ[3] - 28,30);
        container.addChild(goldLabel2);
        goldLabel2.setAnchorPoint(cc.p(0,0.5));


    },

    onEnter : function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
    },

    onExit : function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    }
});

