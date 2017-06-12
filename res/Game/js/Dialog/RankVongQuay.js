/**
 * Created by Quyet Nguyen on 3/21/2017.
 */

_arrPosRankVQ = [64, 231, 481];
var RankVongQuay = Dialog.extend({
    ctor : function () {
        this._super();


        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("BẢNG XẾP HẠNG");
        this.initWithSize(cc.size(860, 520));

        var listItem = new newui.TableView(cc.size(this.getContentSize().width - 45 * 2, 360), 1);
        listItem.setPosition(cc.p(45, 26));
        this.addChild(listItem);
        this.listItem = listItem;
        var arrName = ["Top","Người chơi","Số vàng thắng"] ;
        for(var i = 0; i < 3; i++){
            var timeLaybel =  cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, arrName[i]);
            timeLaybel.setAnchorPoint(cc.p(0.0, 0.5));
            timeLaybel.setPosition(_arrPosRankVQ[i],403);
            timeLaybel.setColor(cc.color("#77cbee"));
            this.addChild(timeLaybel);
        }
        // for(var i= 0; i<20;i++){
        //     this.addItem("1","aaa",1000);
        // }
    },
    onSFSExtension: function (messageType, content) {

        if(content.c == 506){
                var arr = content.p[1];
            for(var i= 0; i<arr.length;i++){
                var name = arr[i][1];
                if (name.length > 15)
                    name = name.substring(0, 15) ;
                if (name.length > 3 && name != PlayerMe.username)
                    name = name.substring(0, name.length - 3) + "***";

                this.addItem(i+1,name,arr[i][2]);
            }
        }
    },
    addItem:function (timeCreate, userName,gold) {
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
        timeLaybel.setAnchorPoint(cc.p(0.0, 0.5));
        timeLaybel.setPosition(_arrPosRankVQ[0] - 38,30);
        container.addChild(timeLaybel);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, userName);
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(_arrPosRankVQ[1] - 45,30);
        container.addChild(nameLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, cc.Global.NumberFormat1(parseInt(gold)));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(_arrPosRankVQ[2] - 45,30);
        container.addChild(goldLabel);


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

