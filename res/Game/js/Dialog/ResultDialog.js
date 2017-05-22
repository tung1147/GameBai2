/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var ResultDialog = Dialog.extend({
    ctor : function (size) {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("KẾT QUẢ");

        var n = size;
        if(n < 3){
            n = 3;
        }
        this.componentHeight = 100.0;
        this.componentPadding = 0.0;
        var height = 80.0 + (this.componentHeight * n) + this.componentPadding*(n+1);
        this.initWithSize(cc.size(870, height));

        var iconWinLose = new cc.Sprite("#result-icon-lose.png");
        iconWinLose.setAnchorPoint(cc.p(0.0,0.0));
        iconWinLose.setPosition(0, 0);
        iconWinLose.setVisible(false);
        this.dialogBgTitle.addChild(iconWinLose);
        this.iconWinLose = iconWinLose;
        this.isHoa = false;
        this.initComponent(size);
    },
    initComponent : function (size) {
        var padding = this.componentPadding;
        var top = this.dialogBg.getContentSize().height - 70.0 - padding;

        var h = this.componentHeight;
        var w = this.dialogBg.getContentSize().width - 60.0;
        var x = this.dialogBg.getContentSize().width/2;
        var y = top - h/2;

        var userLabel = [];
        var contentLabel = [];
        var goldLabel = [];
        var cardList = [];
        for(var i=0;i<size;i++){

            if(i%2)
            {
                var bg = cc.Scale9Sprite.createWithSpriteFrameName("dialog-cardList-bg.png", cc.rect(8,8,4,4));
                bg.setPreferredSize(cc.size(w, h));
                bg.setPosition(x,y);
                this.dialogBg.addChild(bg);
            }

            var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "username");
            label1.setAnchorPoint(cc.p(0.0, 0.5));
            label1.setPosition(50, y + h/2 - 25);
            this.dialogBg.addChild(label1, 1);
            userLabel.push(label1);

            var label2 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Thắng trắng");
            label2.setAnchorPoint(cc.p(0.0, 0.5));
            label2.setPosition(50, y + h/2 - 70);
            label2.setColor(cc.color("#77cbee"));
            this.dialogBg.addChild(label2, 1);
            contentLabel.push(label2);

            var label3 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "+800.000");
            label3.setAnchorPoint(cc.p(0.0, 0.5));
            label3.setPosition(210, label2.y);
            label3.setColor(cc.color("#cfcfcf"));
            this.dialogBg.addChild(label3, 1);
            goldLabel.push(label3);

            var cards = new CardList(cc.size(480,60));
            cards.setTouchEnable(false);
           // cards.addNewCard(cardTest);
            cards.setAnchorPoint(cc.p(0.0, 0.5));
            cards.setPosition(x - 90, y - h/2 + 50);
            this.dialogBg.addChild(cards, 2);
            cardList.push(cards);

            y -= (h + padding);
        }

        this.userLabel = userLabel;
        this.contentLabel = contentLabel;
        this.goldLabel = goldLabel;
        this.cardList = cardList;
    },

    setWinLose : function(isWin)
    {
        if(this.isHoa === true)
        {
            this.iconWinLose.setVisible(false);
        }
        else
        {
            this.iconWinLose.setVisible(true);
            this.iconWinLose.setSpriteFrame(isWin===true?"result-icon-win.png":"result-icon-lose.png");
        }

    }


});