/**
 * Created by QuyetNguyen on 12/20/2016.
 */
//var s_ChanLeLayer = null;
s_sfs_error_msg[1001] = "Bạn không đủ điều kiện chơi bonus";
s_sfs_error_msg[1000] = "Chưa hết thời gian chọn bonus!";
var TuyenItem = cc.Sprite.extend({

    ctor: function () {
        this._super("#slot_fruit_7.png");
        this.moveSpeed =  1500.0;
        var y1 = 500;//ban dau
        var y3 = -100;//cuoi
        var y2 = 30; //biendo*2
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.setPosition(100,y1);
        var s = Math.abs(y1 - y3) + y2*2 ;
        this.timeElapsed = 0.0;
        this.acceleration = -(this.moveSpeed*this.moveSpeed) / (s*2);
        this.maxTime = s*2 / this.moveSpeed;
        this.isRun = false;



        var scale1 = new cc.ScaleTo(0.2,1,1) ;
        var scale2 = new cc.ScaleTo(0.2,0,1) ;
        var scale3 = new cc.ScaleTo(0.2,-1,1) ;
        var scale4 = new cc.ScaleTo(0.2,0,1) ;
        var scale5 = new cc.ScaleTo(0.2,1,1) ;
        this.runAction(new cc.RepeatForever(new cc.Sequence(scale1,scale2,scale3,scale4,scale5)));

    },

    update:function (dt) {
        // if(this.isRun){
        //     this.timeElapsed += dt;
        //     if(this.timeElapsed >= this.maxTime){
        //         this.timeElapsed = this.maxTime;
        //         this.isRun = false;
        //
        //     }
        //     var y = this.y2  + this.moveSpeed*this.timeElapsed + (this.acceleration*this.timeElapsed*this.timeElapsed)/2;
        //     cc.log("aaa "+ y);
        //     var yNew = this.y1 + this.y2 -y;
        //     if(yNew < this.y3 - this.y2){
        //         yNew = 2*(this.y3 - this.y2)  -yNew;
        //     }
        //     this.setPosition(this.x,yNew);
        // }
    },

    onEnter : function () {
        this._super();
        this.scheduleUpdate();
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    },

});
var ItemFruit = SlotItem.extend({
    ctor: function (idItem) {
        this._super();
        var withMay = 690;
        this.itemWidth = withMay/5;
        this.disHCell = 127;
        this.setContentSize(cc.size(this.itemWidth,this.disHCell));

        var num = "#slot_fruit_"+ idItem.toString()+".png";
        var spriteHoaQua = new cc.Sprite(num);
        spriteHoaQua.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        spriteHoaQua.setVisible(true);
        this.addChild(spriteHoaQua);
        this.spriteHoaQua = spriteHoaQua;


        var slot_bg_win = new cc.Sprite("#slot_bg_win.png");
        slot_bg_win.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        slot_bg_win.setVisible(false);
        this.addChild(slot_bg_win,-1);
        this.slot_bg_win = slot_bg_win;

        slot_bg_win.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(0.3,100),
                new cc.FadeTo(0.3,255)
            )
        ));


        var bg = new cc.Sprite("#slot_bg_item.png");
        bg.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        bg.setVisible(false);
        this.bg = bg;
        this.addChild(bg,-2);
    },
    setWin:function (isWin,isLigth) {
        this.slot_bg_win.setVisible(isLigth);
        this.bg.setVisible(isWin);
    }
});
var SlotFruit = SlotLayer.extend({
    ctor: function () {
        this._super();
        this.nodeSlot.setContentSize(cc.size(792,418));
        this.arrResuft = [];
    },
    newItem:function (idItem) {
        return new ItemFruit(idItem);
    },
    showLineWin:function (line,mask) {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {
            var isWin = false;
            var isLight = false;
           for(var j = 0; j < LINE_SLOT[line].length; j++){
               if(i == LINE_SLOT[line][j]){
                   isLight = ((mask >> j) & 1);
                   isWin = true;
                   // break;
               }
           }
            this.arrResuft[i].setWin(isWin,isLight);
            this.arrResuft[i].spriteHoaQua.setOpacity(isWin?255:150);
        }

    },
    initRandom:function () {
        this.clearAll();
        for (var i = 0; i < 5; i++) { // cot

            var subItem = [];
            for (var j = 0 ; j < 4; j++) { // hang
                var randomItem = Math.floor(Math.random()*6);
                var item = this.newItem(randomItem);
                item.createItem(i,j,0);
                item.isRunning = false;
                this.nodeSlot.addChild(item);

                subItem.push(item);

            }
            this.arrItems.push(subItem);
        }
    },
    clearAllItemInLine:function () {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {

            this.arrResuft[i].setWin(false,false);
            this.arrResuft[i].spriteHoaQua.setOpacity(255);
        }

    }

});

var POS_BUT_DUP = [{x: 267, y: 166},    {x: 733, y: 166},      {x: 787, y: 310},{x: 681, y: 310},{x: 316, y: 310},{x: 212, y: 310}];
var POS_LAL_DUP = [{x: 267, y: 166},    {x: 733, y: 166},      {x: 733, y: 234},{x: 267, y: 234},{x: 316, y: 234},{x: 212, y: 234}];
var IMG_BUT_DUP = ["slot_x2_btn_do.png","slot_x2_btn_den.png", "slot_x2_x4t.png","slot_x2_x4b.png", "slot_x2_x4r.png", "slot_x2_x4c.png"];
var ID_BONUS = [5,6, 3,4, 2, 1];
var SelectLine =  cc.Node.extend({
    ctor:function () {
        this._super();
        var thiz = this;
        var dialogBg = new ccui.Scale9Sprite("dialog-bg.png", cc.rect(120,186,4,4));
        dialogBg.setPreferredSize(cc.size(1000,823));
        dialogBg.setAnchorPoint(cc.p(0,0));
        dialogBg.setPosition((cc.winSize.width - 1060)/2 , (cc.winSize.height-823)/2);

        var closeButton = new ccui.Button("dialog-button-close.png","","", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(cc.p(870,700));
        closeButton.addClickEventListener(function () {
            thiz.setLineSend();
        });
        var lbl = new cc.LabelTTF("CHỌN DÒNG", cc.Roboto_CondensedBold,28);
        lbl.setPosition(dialogBg.getContentSize().width/2,695);
        lbl.setColor(cc.color(196,225,255));
        dialogBg.addChild(lbl);

        this.addChild(dialogBg);
        dialogBg.addChild(closeButton);

        var nodeLine = new ccui.Widget();
        nodeLine.setContentSize(cc.size(700, 440));
        nodeLine.setPosition(1060/2,823/2);
        dialogBg.addChild(nodeLine)
        this.arrLine = [];
        this.arrNumLine = [];
        for(var i = 0; i < 20; i++){
            (function () {
                var xP =  40+ 140*(i%5) ;
                var yP =  80+ 110*Math.floor(i/5);
                var bg = new ccui.Button("slot_sl_bg.png", "", "", ccui.Widget.PLIST_TEXTURE);

                // var bg = new cc.Sprite("#slot_sl_bg.png");
                var lol = (3-Math.floor(i/5))*5;
                var num = lol + i%5;

                var bg_num = new cc.Sprite("#slot_sl_bg_num.png");
                bg_num.setPosition(bg.getContentSize().width/2, -20);
                bg.addChild(bg_num);

                var line = new cc.Sprite("#slot_sl_"+(num+1).toString() +".png");
                line.setTag(2);
                line.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
                bg.addChild(line);
                thiz.arrNumLine.push(num+1);
                var lbl = new cc.LabelTTF((num+1).toString(), cc.res.font.Roboto_CondensedBold,16);
                lbl.setColor(cc.color(111,133,168));
                bg_num.setTag(1);
                lbl.setPosition(bg_num.getContentSize().width/2, bg_num.getContentSize().height/2);
                bg_num.addChild(lbl);

                nodeLine.addChild(bg);
                bg.setPosition(cc.p(xP,yP));
                bg.addClickEventListener(function () {
                    thiz.handleClickLine(num);
                });
                thiz.arrLine.push({"line":bg,"isActive":true,"id":num});
            })();



        }
        var okChan = s_Dialog_Create_Button1(cc.size(122, 50), "CHẴN");
        dialogBg.addChild(okChan);
        okChan.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?false:true);
            }

        });
        okChan.setPosition(222,150);

        var okLe = s_Dialog_Create_Button1(cc.size(122, 50), "LẺ");
        okLe.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?true:false);
            }
        });
        dialogBg.addChild(okLe);
        okLe.setPosition(364,150);

        var okAll = s_Dialog_Create_Button1(cc.size(122, 50), "TẤT CẢ");
        dialogBg.addChild(okAll);
        okAll.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],true);
            }
        });
        okAll.setPosition(505,150);


        var okDone = s_Dialog_Create_Button1(cc.size(122, 50), "XONG");
        dialogBg.addChild(okDone);
        okDone.addClickEventListener(function () {
            thiz.setLineSend();
        });
        okDone.setPosition(784,150);
          this.initView();
    },

    setLineReconnect:function (arrLineSeLect) {

        for(var j = 0; j < this.arrLine.length; j++){
               var isActive = false;
               for(var i = 0; i < arrLineSeLect.length; i++){
                 if(this.arrLine[j]["id"] == arrLineSeLect[i]-1){
                     isActive = true;
                    break;
                 }
                }
               this.setActiveBt(this.arrLine[j],isActive);
        }
        var thiz = this;
        this.arrNumLine = [];
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                this.arrNumLine.push(this.arrLine[i]["id"]+1);
            }
        }
        // if(thiz._lineReconnect){
        //     thiz._lineReconnect();
        // }
    },
    setLineSend:function () {
        var thiz = this;
        this.arrNumLine = [];
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                this.arrNumLine.push(this.arrLine[i]["id"]+1);
            }
        }
        this.setVisible(false);
        if(thiz._lineClickHandler){
            thiz._lineClickHandler();
        }
    },
    initView:function () {
        var thiz = this;
        this.mTouch = cc.rect(cc.winSize.width/2 - (800/2)*cc.winSize.screenScale,cc.winSize.height/2 - (623/2)*cc.winSize.screenScale ,800,623);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,127),cc.winSize.width,cc.winSize.height);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(!thiz.isVisible())
                {
                    return false;
                }
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if(!cc.rectContainsPoint(thiz.mTouch, p)){
                    thiz.setLineSend();
                    // thiz.setVisible(false);
                    // thiz.removeFromParent(true);
                }
                return true;
            },
        }, this);
        this.addChild(layerBlack,-1);


    },
    getLines:function () {
        return this.arrNumLine;
    },
    setActiveBt : function(btnClick,enabled){
        btnClick["line"].setOpacity(enabled?255:80);
        // btnClick["line"].setEnabled(enabled);
        btnClick["line"].getChildByTag(1).setOpacity(enabled?255:80);
        btnClick["line"].getChildByTag(2).setOpacity(enabled?255:80);
        btnClick["isActive"] = enabled;
    },
    handleClickLine:function (num) {
        cc.log(num);
        var thiz = this;
        var numLineActive = 0;
        var btnClick = null;
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                numLineActive++;
            }
            if(this.arrLine[i]["id"] == num){
                btnClick = this.arrLine[i];
            }
        }
        if(numLineActive>1){
            this.setActiveBt(btnClick,!btnClick["isActive"]);
            if(thiz._clickOneLine){
                thiz._clickOneLine(num,btnClick["isActive"]);
            }
        }else{

            // MessageNode.getInstance().show("Bạn phải chọn ít nhất 1 line!");
            if(thiz._clickOneLine){
                thiz._clickOneLine(num,true);
            }
            this.setActiveBt(btnClick,true);
        }

    }
});
var CardBobus = TrashCardOnTable.extend({
    ctor: function (width_Phom, height_Phom, typeArrange) {

        this._super(width_Phom, height_Phom, typeArrange);
    },

    addCard: function (card, noAnimation) {
        var oldParent = card.getParent();
        card.retain();
        if(oldParent){
            var p = oldParent.convertToWorldSpace(card.getPosition());
            card.removeFromParent(true);
        }
        else{
            var p = card.getPosition();
        }
        var newP = this.convertToNodeSpace(p);
        card.setPosition(newP);
        this.addChild(card);
        card.release();

        var animationDuration = 0.1;

        if (!this.cardSize)
            this.cardSize = card.getContentSize();

        card.canTouch = false;
        this.cardList.push(card);
        card.setScale(this.height_Phom / this.cardSize.height);
        // card.runAction(new cc.ScaleTo(0.1,this.height_Phom / this.cardSize.height));
        // var moveAction = new cc.MoveTo(animationDuration, this.getNewPostionCard(this.cardList.length - 1));

        // var thiz = this;
        // var delay = new cc.DelayTime(animationDuration);
        // var orderAgain = new cc.CallFunc(function () {
        //     thiz.reOrder(noAnimation);
        // });

        // thiz.runAction(new cc.Sequence(delay, orderAgain));
        this.reOrder(noAnimation);
    },
    removeCardFirst: function () {
        var retVal = this.cardList[0];
        retVal.removeFromParent(true);
        this.cardList.splice(0, 1);
        this.reOrder(false);
    },

});

var DuplicateGold =  cc.Node.extend({
   ctor:function () {
       this._super();
       this.initView();
       this.enableTouchZ = true;
       this.isTry = false;
       this.moneyWin = 0;
   },
    initView:function () {
        var thiz = this;
        this.mTouch = cc.rect(cc.winSize.width/2 - (905/2)*cc.winSize.screenScale,cc.winSize.height/2 - (464/2)*cc.winSize.screenScale ,905,464);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,127),cc.winSize.width,cc.winSize.height);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(!thiz.isVisible())
                {
                    return false;
                }
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if(!cc.rectContainsPoint(thiz.mTouch, p)){
                    thiz.setVisible(false);
                    // thiz.removeFromParent(true);
                }
                return true;
            },
        }, this);
        this.addChild(layerBlack);
        var bg = new ccui.Scale9Sprite("slot_bg_x2.png",cc.rect(113,113,4,4));
        bg.setPreferredSize(cc.size(995,754));
        bg.setScale(cc.winSize.screenScale);
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.bg = bg;
        this.addChild(bg);
        var lbl = new cc.LabelTTF("Đoán màu cây bài để X2 hoặc chất cây bài để X4 tiền thắng. \n                        Chọn nhận thưởng để dừng chơi.",cc.res.font.Roboto_Condensed,24);
        lbl.setPosition(500,529);
        bg.addChild(lbl);
        this.arrButtonBonus = [];
        this.arrLabelBonus = [];
        for(var i = 0; i < 6; i++){
            (function () {
                var iNew = i;
                var btnX = new ccui.Button(IMG_BUT_DUP[i], "", "", ccui.Widget.PLIST_TEXTURE);
                btnX.setPosition(POS_BUT_DUP[i]);
                btnX.addClickEventListener(function () {
                    thiz.handelBonusClick(iNew);
                });

                bg.addChild(btnX);


                thiz.arrButtonBonus.push(btnX);
                if(i<4){
                    var lbl = new cc.LabelTTF("80",cc.res.font.Roboto_CondensedBold,24);
                    lbl.setPosition(POS_LAL_DUP[i]);
                    lbl.setColor(cc.color(255,222,0));
                    bg.addChild(lbl);
                    thiz.arrLabelBonus.push(lbl);
                }


            })();

        }

        var btnClose = new ccui.Button("slot_close.png","","",ccui.Widget.PLIST_TEXTURE)
        btnClose.addClickEventListener(function () {
            thiz.setVisible(false);
        });
        btnClose.setPosition(877,636);
        bg.addChild(btnClose);

        var wgGive = new ccui.Widget();
        wgGive.setContentSize(cc.size(130,130));
        wgGive.setTouchEnabled(true);
        wgGive.setPosition(877,636);
        bg.addChild(wgGive);
        thiz.wgGive = wgGive;

        var btnGive = new cc.Sprite("#slot_btn_nt2.png");
        btnGive.setPosition(65,65);
        wgGive.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_ENDED){
              cc.log("touch here");
                thiz.setVisible(false);
                if(thiz._handeGiveClick){
                    thiz._handeGiveClick(parseInt(thiz.moneyWin));
                }
            } ;
            if(event == ccui.Widget.TOUCH_BEGAN)
            {
                btnGive.runAction(new cc.ScaleTo(0.2,1.1));
            }else{
                btnGive.stopAllActions();
                btnGive.runAction(new cc.ScaleTo(0.2,1));
            }
        });

        wgGive.addChild(btnGive);

        var bg_give = new ccui.Scale9Sprite("slot_x2_bg_money.png",cc.rect(10,10,4,4));
        bg_give.setPreferredSize(cc.size(380,50));
        bg_give.setPosition(500, 601);
        bg.addChild(bg_give);

        var lblMoney = new cc.LabelTTF("10.000",cc.res.font.Roboto_CondensedBold,30);
        lblMoney.setColor(cc.color(255,222,0));
        lblMoney.setPosition(190,25);
        bg_give.addChild(lblMoney);
        this.lblMoney = lblMoney;

        var bg_card = new ccui.Scale9Sprite("slot_bg_card.png",cc.rect(40,40,4,4));
        bg_card.setPreferredSize(cc.size(180,230));
        bg.addChild(bg_card);
        bg_card.setPosition(500,255);

        var cardDefualt = new cc.Sprite("#slot_cardup.png");
        cardDefualt.setPosition(500,255);
        bg.addChild(cardDefualt);
        this.cardDefualt = cardDefualt;




        var cardUp = new cc.Sprite("#slot_cardup.png");
        cardUp.setPosition(cardDefualt.getPosition());
        bg.addChild(cardUp);




        cardUp.setVisible(false);
        this.cardUp = cardUp;
        var scale1 = new cc.ScaleTo(0.5, 0.0, 1);
        var scale2 = new cc.ScaleTo(0.5, 1, 1);
        cardUp.runAction(new cc.RepeatForever( new cc.Sequence(scale1, scale2)));
        var bgTrash = new ccui.Scale9Sprite("bg_card_trash.png", cc.rect(10, 10, 4, 4));
        bgTrash.setPreferredSize(cc.size(680, 90));
        bgTrash.setPosition(500,440);
        bg.addChild(bgTrash);

        var cards = [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2];
        var trashCards = new CardBobus(660,80,POSITION_PHOM_LEFT);
        // for (var j = 0; j < cards.length; j++) {
        //     var card = CardList.prototype.getCardWithId(cards[j]);
        //     trashCards.addCard(new Card(card.rank, card.suit),true);
        // }
        this.trashCards = trashCards;
        trashCards.setPosition(cc.p(680/2,5));
        bgTrash.addChild(trashCards);

    },
    setVisibleArrButton:function (isVisble) {
        for(var  i = 0; i < this.arrButtonBonus.length; i++)
            this.setActiveBt(this.arrButtonBonus[i],isVisble);
             this.enableTouchZ = isVisble;
    },

    setMoneyLabel:function (moneyWin) {
        //
            for(var i = 0; i < this.arrLabelBonus.length; i++){
                if(moneyWin != "0") {

                    var zzz = parseInt(moneyWin) * 4;
                    if (i == 0 || i == 1) {
                        zzz = parseInt(moneyWin) * 2;
                    }
                    if(this.arrLabelBonus[i].getString() == ""){
                        this.arrLabelBonus[i].setString("0");
                    }
                    var action = new quyetnd.ActionNumber(0.4, zzz);
                    this.arrLabelBonus[i].runAction(action);
                }
                else {
                    this.arrLabelBonus[i].setString("");
                }
            }
        // }

    },

    handelResuft:function (idCard,type,moneyWin) {
        var thiz = this;
        this.setCard(idCard) ;
        thiz.typezzz = type;
        this.lblMoney.runAction(new cc.Sequence(new cc.DelayTime(0.0),
        new cc.CallFunc(function () {

            if(type == 3){
                SoundPlayer.playSound("losing");
                thiz.wgGive.setVisible(false);
                thiz.lblMoney.setString("Chúc bạn may mắn lần sau!");
                thiz.lblMoney.setColor(cc.color(255,255,255,255));
            }
            else {
                SoundPlayer.playSound("NormalWin");
                var action = new quyetnd.ActionNumber(0.3, parseInt(moneyWin));
                thiz.lblMoney.runAction(action);

                thiz.lblMoney.setColor(cc.color(255,222,0,255));
                // var goldMini = new  cc.ParticleSystem("res/SelectCard.plist");
                // goldMini.setPosition(cc.p(670, 621));
                // thiz.addChild(goldMini);
            }
              thiz.setMoneyLabel(moneyWin);

        }
        ),
            new cc.DelayTime(1),
            new cc.CallFunc(function () {
                thiz.setVisibleArrButton(thiz.typezzz!=3);
            })
        ));

        // setTimeout(function () {
        //
        // }, 0.4);


    },
    setMoney:function (moneyWin) {
        this.lblMoney.setString(cc.Global.NumberFormat1(parseInt(moneyWin)));
        this.lblMoney.setColor(cc.color(255,222,0,255));
        // this.bg.removeChildByTag(7);

        this.setMoneyLabel(moneyWin);

        this.cardUp.setVisible(false);
        this.cardDefualt.setVisible(true);
        // this.enableTouchZ = true;
        this.setVisibleArrButton(true);
        this.moneyWin = moneyWin;
    },
    setCard:function (idCard) {
        var thiz = this;
        this.cardUp.setVisible(false);
        var dataCard = CardList.prototype.getCardWithId(idCard);
        var cardNew = new Card(dataCard.rank, dataCard.suit);
        cardNew.setSpriteFrame("gp_card_up2.png");
        cardNew.canTouch = false;
        cardNew.setPosition(this.cardUp.getPosition());
        cardNew.setTag(7);
        var orgScale = this.cardDefualt.getContentSize().height/cardNew.getContentSize().height + 0.1;

        cardNew.setScale(orgScale);
        this.bg.addChild(cardNew,1);
        var nameCard = dataCard.rank + s_card_suit[dataCard.suit] + ".png";
        var changeFrame = new cc.CallFunc(function () {
            cardNew.setSpriteFrame(nameCard);
        });
        var scale1 = new cc.ScaleTo(0.2,0,orgScale) ;
        var scale2 = new cc.ScaleTo(0.2,orgScale,orgScale) ;
        cardNew.runAction(new cc.Sequence(scale1,changeFrame,scale2));

        thiz.runAction(new cc.Sequence(new cc.DelayTime(1),
            new cc.CallFunc(function () {

                if(thiz.trashCards.cardList.length>19){
                    thiz.trashCards.removeCardFirst();
                }
                thiz.cardDefualt.setVisible(true);
                thiz.trashCards.addCard(cardNew,false);

             })

        ));



    },
    handelBonusClick:function (i) {
        cc.log(i);
        if(!this.enableTouchZ)
        {
            return;
        }
        // var goldMini = new  cc.ParticleSystem("res/ring2.plist");
        // goldMini.setPosition(cc.p(POS_BUT_DUP[i].x,POS_BUT_DUP[i].y));
        if(i!=5 && i!=0){
            // goldMini.setPosition(cc.p(POS_BUT_DUP[i].x,POS_BUT_DUP[i].y+20));
        }
        // this.bg.addChild(goldMini);

        this.setVisibleArrButton(false);
        this.cardDefualt.setVisible(false);
        this.cardUp.setVisible(false);//here
        var card = this.bg.getChildByTag(7);
        if(this.isTry){
            var idCard = Math.floor(cc.rand()%51);
            var dataCard = CardList.prototype.getCardWithId(idCard);

            if( i == 0 && (s_card_suit[dataCard.suit] == "r" || s_card_suit[dataCard.suit] == "c")){// do
                this.moneyWin = this.moneyWin*2;
            } else  if( i == 1 && (s_card_suit[dataCard.suit] == "t" || s_card_suit[dataCard.suit] == "b")){ //den
                this.moneyWin = this.moneyWin*2;
            } else  if( i == 2 && s_card_suit[dataCard.suit] == "t" ){ //tep
                this.moneyWin = this.moneyWin*4;
            }
            else  if( i == 3 && s_card_suit[dataCard.suit] == "b" ){ //bich
                this.moneyWin = this.moneyWin*4;
            }
            else  if( i == 4 && s_card_suit[dataCard.suit] == "r" ){ //ro
                this.moneyWin = this.moneyWin*4;
            }
            else  if( i == 5 && s_card_suit[dataCard.suit] == "c" ){ //co
                this.moneyWin = this.moneyWin*4;
            }
            else {
                this.moneyWin = 0;
            }
            if(this._resuftDupVitual){
                this._resuftDupVitual(idCard,(this.moneyWin!=0)?1:3,this.moneyWin);
            }
            // this.handelResuft(idCard,(this.moneyWin!=0)?1:3,this.moneyWin);
        }else {
            if(this._clickButHandler){
                this._clickButHandler(ID_BONUS[i]);
            }
        }

    },
    setTry:function(isTry){
      this.isTry = isTry;
    },
    show:function () {
        this.setVisible(true);
        this.wgGive.setVisible(true);


    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    }
});

var BonusLucky =  cc.Node.extend({
    ctor:function () {
        this._super();
        this.initView();
        this.enableTouchZ = true;
        this.isShow = false;
        this.timeRemaining = 10;
        this.numSelect = 0;
        this.isTry = false;
       // for(var i = 0; i < 100; i++){
       //      this.createRandom();
       //  }
    },
    setTry:function(isTry){
        this.isTry = isTry;
        if(isTry){

        }
    },
    initView:function () {
        var thiz = this;
        this.mTouch = cc.rect(cc.winSize.width/2 - (900/2),cc.winSize.height/2 - (450/2),900,450);
        this.mTouch2 = cc.rect(cc.winSize.width/2 - (580/2),cc.winSize.height/2 - (300/2),580,300);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,127),cc.winSize.width,cc.winSize.height);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(!thiz.isVisible())
                {
                    return false;
                }
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if(!cc.rectContainsPoint(thiz.mTouch2, p) && thiz.group2.isVisible()){
                    thiz.group2.setVisible(false);
                    return true;
                }

                if(!cc.rectContainsPoint(thiz.mTouch, p) && thiz.numSelect == 4){
                    thiz.setVisible(false);
                }

                return true;
            },
        }, this);
        this.addChild(layerBlack);
        var bg = new ccui.Scale9Sprite("bg_bonus12.png",cc.rect(7,7,4,4));
        bg.setPreferredSize(cc.size(900,450));
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.bg = bg;
        this.addChild(bg);



        var lblBonus = new cc.LabelTTF("BONUS",cc.res.font.Roboto_CondensedBold,36);
        lblBonus.setColor(cc.color(255,222,0));
        lblBonus.setPosition(450,400);
        bg.addChild(lblBonus);
        var group1 = new ccui.Widget();
        group1.setContentSize(cc.size(900,450));
        group1.setPosition(450,235);
        bg.addChild(group1);
        this.group1 = group1;

        var lbl = new cc.LabelTTF("Bạn được mở 3 ô phần thưởng",cc.res.font.Roboto_Condensed,24);
        lbl.setPosition(450,350);
        group1.addChild(lbl);

        var lblCount = new cc.LabelTTF("Hệ thống sẽ tự động chọn ngẫu nhiên sau 10s nếu bạn không tương tác",cc.res.font.Roboto_Condensed,24);
        lblCount.setPosition(450,320);
        group1.addChild(lblCount);
        this.lb_count = lblCount;
        this.arrButton = [];
        for(var i = 0; i < 12; i++){
            (function () {
                var iNew = i;
                var spritebg =  new cc.Sprite("#slot_bonus_item3.png");
                spritebg.setPosition( (i%6)*144 + 96, Math.floor(i/6)*144+ 86);
                group1.addChild(spritebg);

                var btnX = new ccui.Button("slot_bonus_item1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnX.setPosition(spritebg.getPosition());
                btnX.addClickEventListener(function () {
                    thiz.handelBonusClick(iNew);
                });

                group1.addChild(btnX);
                thiz.arrButton.push(btnX);



                // var lbl = new cc.LabelTTF("80",cc.res.font.Roboto_CondensedBold,24);
                // lbl.setPosition(POS_LAL_DUP[i]);
                // lbl.setColor(cc.color(255,222,0));
                // bg.addChild(lbl);

            })();

        }

        var group2 = new ccui.Widget();
        group2.setContentSize(cc.size(900,450));
        group2.setPosition(450,225);
        bg.addChild(group2);

        var slot_bonus_bgtotal =  new cc.Scale9Sprite("slot_bonus_bgtotal.png",cc.rect(49,38,2,2));//new cc.Scale9Sprite("slot_bg_freeSpin.png",cc.rect(8, 8, 2, 2)); //
        slot_bonus_bgtotal.setPreferredSize(cc.size(580,360));
        slot_bonus_bgtotal.setPosition(450,225);
        group2.addChild(slot_bonus_bgtotal);


        var lbl2 = new cc.LabelTTF("Chúc mừng bạn nhận được",cc.res.font.Roboto_Condensed,30);
        lbl2.setPosition(450,173);
        group2.addChild(lbl2);

        var lbl3 = new cc.LabelTTF("300.000 V",cc.res.font.Roboto_CondensedBold,48);
        lbl3.setColor(cc.color(255,222,0));
        lbl3.setPosition(450,130);
        group2.addChild(lbl3);
        this.lblTotal = lbl3;
        var spriteWin =  new cc.Sprite("#slot_bonus_hom.png");
        spriteWin.setPosition( 450, 290);
        group2.addChild(spriteWin);

        // var closeButton = new ccui.Button("dialog-button-close.png","","", ccui.Widget.PLIST_TEXTURE);
        // closeButton.setPosition(cc.p(870,420));
        // closeButton.addClickEventListener(function () {
        //     thiz.setVisible(false);
        // });
        // group2.addChild(closeButton);
        group2.setVisible(false);
        this.group2 = group2;
        this.arrItemWin = [];
    },
    createItemWin:function(idItem,money, isOpen){
        if(parseInt(money)!=0){
            var spritebg =  new cc.Sprite(isOpen?"#slot_bonus_item2.png":"#slot_bonus_hom1.png");
            spritebg.setTag(idItem);
            spritebg.setPosition( (idItem%6)*144 + 96 - 12, Math.floor(idItem/6)*144+ 86+7);
            var lbl = new cc.LabelTTF( cc.Global.NumberFormat1(parseInt(money)),cc.res.font.Roboto_CondensedBold,24);
            lbl.setPosition(70,-20);
            lbl.setColor(isOpen?cc.color(255,222,0,255):cc.color(127,127,127,255));
            spritebg.addChild(lbl);
            this.arrItemWin.push(spritebg);
            this.group1.addChild(spritebg);
        }
        else {
            var lbl = new cc.LabelTTF("Không có gì",cc.res.font.Roboto_CondensedBold,24);
            lbl.setPosition((idItem%6)*144 + 96 , Math.floor(idItem/6)*144+ 86+7-70);
            lbl.setColor(isOpen?cc.color(255,222,0,255):cc.color(127,127,127,255));
            this.arrItemWin.push(lbl);
            this.group1.addChild(lbl);
        }

    },
    createRandom:function () {
        var arrValuew = ["0","0","0","500000","500000","500000","500000","1000000","1000000","1000000","2000000","5000000"];
        this.arrValueTry = [];
        this.arr12 = [0,1,2,3,4,5,6,7,8,9,10,11];
        for(var i = 0; i < 12; i++){
            var index = Math.floor(cc.rand()%arrValuew.length);
            this.arrValueTry.push(arrValuew[index]);
            arrValuew.splice(index,1);
        }
       // cc.log("mang la" + arrNew.toString());
    },
    openAllItem:function (arrBonus, arrRandom) {

        var thiz = this;
        thiz.numSelect = 4;
        var totalMoney = 0;
        var totalTry = 0;
        for(var i = 0; i < arrBonus.length; i++){
           var isOpen = false;
            var isCreate = false;
            if(this.group1.getChildByTag(i) == null){
                isCreate =  true;
            }
            for(var j = 0; j < arrRandom.length; j++){
            if(arrRandom[j] == i){
                totalMoney+= parseInt(arrBonus[i]);
                if(isCreate  && thiz.isTry){
                    totalTry+= parseInt(arrBonus[i]);
                }

                isOpen = true;
                break;
            }
            }
            if(isCreate)
            {
                this.createItemWin(i,arrBonus[i],isOpen);
            }


        }
        if(thiz.isTry){
            if(this._onBonusVitual){
                this._onBonusVitual(totalTry);
            }
        }
        for(var i = 0; i <    this.arrButton.length;i++){
            this.arrButton[i].setVisible(false);
        }
        this.lblTotal.setString(cc.Global.NumberFormat1(totalMoney) + " V");
        this.runAction(new cc.Sequence(new cc.DelayTime(2),new cc.CallFunc(function () {

            thiz.group2.setVisible(true);
        })));

    },

    openItem:function (id,money) {
        this.arrButton[id].setVisible(false);
        this.createItemWin(id,money,true);
    },

    handelBonusClick:function (i) {
        if(this.numSelect>2){
            return;
        }
        SoundPlayer.playSound("DoubleOrNothing");
        this.numSelect++;
        this.arrButton[i].setVisible(false);
        if(this.isTry){

            this.openItem(i,this.arrValueTry[i]);
            if(this._onBonusVitual){
                this._onBonusVitual(this.arrValueTry[i]);
            }
            // this.arrRandom.push(i);
            for(var j = 0 ; j < this.arr12.length; j++){
                if(this.arr12[j] == i ){
                    this.arrRandom.push(i);
                    this.arr12.splice(j,1);
                    break;
                }
            }
            if(this.arrRandom.length == 3){
                this.openAllItem(this.arrValueTry,this.arrRandom);
            }
        }else {
            SmartfoxClient.getInstance().sendExtensionRequest(-1, "1004",{"1":i});
        }
    },
    show:function () {
        // this.scheduleUpdate();
        if(this.isTry){
            this.createRandom();
            this.arrRandom = [];
        }
        this.stopAllActions();
        var thiz =  this;
        this.numSelect = 0;
        this.group2.setVisible(false);
        this.timeRemaining = 10;
        for(var i = 0; i <    this.arrButton.length;i++){
            this.arrButton[i].setVisible(true);
        }
        for(var i = 0; i <   this.arrItemWin.length;i++)
            this.arrItemWin[i].removeFromParent(true);

        this.arrItemWin = [];
        // this.group1.removeChildByTag(4);
        this.setVisible(true);
        this.runAction(new cc.Sequence(new cc.DelayTime(10), new cc.CallFunc(function () {
            if(thiz.isTry){
                if(thiz.arrRandom.length<3){
                    var thieu = 3-thiz.arrRandom.length;
                    for(var j = 0; j < thieu; j++){
                        var index = Math.floor(cc.rand()%thiz.arr12.length);
                        thiz.arrRandom.push(thiz.arr12[index]);
                        thiz.arr12.splice(index,1);
                    }

                    thiz.openAllItem(thiz.arrValueTry,thiz.arrRandom);
                }

            }
            thiz.numSelect = 4;
        })));
    },
    update : function (dt) {

            if(this.timeRemaining >= 0){
                this.timeRemaining -= dt;
                //mod
                this.bg.setVisible(true);
                this.lb_count.setString("Hệ thống sẽ tự động chọn ngẫu nhiên sau "+ Math.round(this.timeRemaining)+"s nếu bạn không tương tác");

            }

    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    }

});

var NumberSlot  = cc.Sprite.extend({// ccui.Button.extend({
    ctor:function (s) {
      //  this._super("slot_bg_number2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this._super("#slot_bg_number2.png");
        var lblBel = new cc.LabelTTF(s, cc.res.font.Roboto_CondensedBold,18);
        lblBel.setColor(cc.color(95,115,217));
        lblBel.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2));
        this.addChild(lblBel);
        this.lblBel = lblBel;

    },
    visibleNew:function (isVisible) {
        //this.loadTextureNormal( (isVisible)?"slot_bg_number1.png":"slot_bg_number2.png",ccui.Widget.PLIST_TEXTURE) ;
        this.setSpriteFrame( (isVisible)?"slot_bg_number1.png":"slot_bg_number2.png") ;
        this.lblBel.setColor((isVisible)?cc.color(255,222,0):cc.color(95,115,217));
    },
});


var CoinNode = cc.Node.extend({
    ctor : function () {
        this._scaleStart = 0.5;
        this._scaleDelta = 0.1;

        this._scaleEnd = 0.7;
        this._scaleEndDelta = 0.4;

        this._rotateStart = -15.0;
        this._rotateDelta = 30.0;

        this._forceStart = 900.0;
        this._forceDelta = 700.0;

        this._torqueStart = -8.0;
        this._torqueDelta = 16.0;

        this._timeStart = 2.0;
        this._timeDelta = 1.0;

        // this._startPosition = cc.p(cc.winSize.width/2, cc.winSize.height+100);
        // this._startPositionDelta = cc.p(cc.winSize.width-300, 80);

        this._startPosition = cc.p(cc.winSize.width/2, cc.winSize.height/2);
        this._startPositionDelta = cc.p(100, 10);

        this._super();
        this._initPhysics();
        this.addAllCoin();
    },
    _initPhysics:function() {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -2000);
        this.space.sleepTimeThreshold = 0.5;

        var floorShape = new cp.SegmentShape(this.space.staticBody, cp.v(0, 0), cp.v(cc.winSize.width*2, 0), 0);
        floorShape.setElasticity(1.2);
        floorShape.setFriction(1);
        floorShape.setLayers(~0);
        this.space.addStaticShape(floorShape);

        // debug
        // this._debugNode = new cc.PhysicsDebugNode(this.space);
        // this.addChild( this._debugNode, 1);

    },
    _addCoin : function () {

        var startScale = this._scaleStart + (Math.random() * this._scaleDelta);
        var endScale = this._scaleEnd + (Math.random() * this._scaleEndDelta);

        var force = this._forceStart + (Math.random() * this._forceDelta);
        var rotate = this._rotateStart + (Math.random() * this._rotateDelta);
        var torque = this._torqueStart + (Math.random() * this._torqueDelta);

        var dongshit =100- Math.random()*200;

        var forceVector = cc.pRotateByAngle(cc.p(dongshit, force), cc.p(0,0), cc.degreesToRadians(rotate));

        var time = this._timeStart + (Math.random() * this._timeDelta);
        var x = this._startPosition.x + (-this._startPositionDelta.x + Math.random() * this._startPositionDelta.x * 2);
        var y = this._startPosition.y + (-this._startPositionDelta.y + Math.random() * this._startPositionDelta.y * 2);

        var coin = new CoinSprite(this.space);
        coin.setPosition(x, y);
        coin.setScale(startScale);
        coin._force = cp.v(forceVector.x, forceVector.y);
        coin._torque = torque;

        coin.setScale(0.4+Math.random()*0.6);

        this.addChild(coin);
        coin.startWithDuration(time, endScale);


    },
    addAllCoin : function () {
        this.removeAllChildren();
        var n = 150 + Math.floor(Math.random()* 20);
        // var ran = Math.random()*1.5;
        var thiz = this;
        for(var i=0; i<n ;i++){
            // this.runAction(new cc.Sequence(new cc.DelayTime(ran),new cc.CallFunc(function () {
                thiz._addCoin();
            // })))

        }

        var thiz = this;
        var maxTime = this._timeStart + this._timeDelta + 5.0;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(maxTime),
            new cc.CallFunc(function () {
                thiz.removeFromParent(true);
            })
        ));
    },
    update : function (dt) {
        this.space.step(dt);
    },

    onEnter : function () {
        this._super();
        this.scheduleUpdate();
    },

    onExit : function () {
        this._super();
        this.unscheduleUpdate();
    },
    show : function () {
        var runningScene = cc.director.getRunningScene();
        runningScene.addChild(this, 1000);
    }
});

var LINE_SLOT = [[1,4,7,10,13], [2,5,8,11,14],[0,3,6,9,12],[1,4,8,10,13],[1,4,6,10,13],
                [2,3,8,9,14],[0,5,6,11,12],[1,5,6,11,13],[2,5,7,11,14],[0,3,7,9,12],
                [1,3,7,11,13],[1,5,7,9,13],[0,4,8,10,12],[2,4,6,10,14],[0,3,7,11,14],
                [2,4,7,10,14],[1,5,8,11,13],[1,3,6,9,13],[0,4,7,10,12],[2,5,7,9,12]];

var ARR_BET_SLOT = [100,1000,10000];

var GamePlaySlot = GamePlayerMe.extend({
    setGold: function (gold) {
        this.goldLabel.stopAllActions();
        if(this.gold >= gold){
            this.goldLabel.setString(cc.Global.NumberFormat1(gold));
        }
        else {
            var action = new quyetnd.ActionNumber(0.5,gold);
            this.goldLabel.runAction(action);
        }

        this.gold = gold;
    },
    setGoldTry: function (goldTry,gold) {
        this.goldLabel.stopAllActions();
        if(goldTry >= gold){
            this.goldLabel.setString(cc.Global.NumberFormat1(gold));
        }
        else {
            var action = new quyetnd.ActionNumber(0.5,gold);
            this.goldLabel.runAction(action);
        }
    }
});

var SlotFruitScene = IScene.extend({
    ctor: function () {
        this._super();
        this.isHaveData = true;
        var thiz = this;
        this.isTry = false;
        this.isAutoRotate = false;
        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bg);
        this.arrButBet = [];
        this.initView();
        this.setTextHuThuong("1000000");
        this.setTextBet("10.000");
        this.setTextWin("0");
        this.initController();
        this.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
        LoadingDialog.getInstance().show("Loading...");
        })));
        this._controller.sendJoinGame();
        this.enableAutoRotate(false);
        this.isFreeSpin = 0;

        var bonusLucky = new BonusLucky();
        bonusLucky._onBonusVitual = function (money) {
            thiz.setGoldVituarl(parseInt(money));
            thiz.changeGoldEffect(money);
        },
        this.addChild(bonusLucky,3);
        this.bonusLucky = bonusLucky;
        this.bonusLucky.setVisible(false);

        // for(var i = 0; i < 200; i++){
        //   var aaa =    Math.floor(cc.rand()%12);
        //     cc.log(aaa);
        // }

    },

    initView:function () {

        var thiz = this;
        var bgSlot =  new cc.Sprite("res/slot_bg.png");
        bgSlot.setScale(cc.winSize.screenScale);
        bgSlot.x = cc.winSize.width / 2;
        bgSlot.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bgSlot);
        this.bgSlot = bgSlot;

        var slotfui = new SlotFruit();
        slotfui.setPosition(cc.p(157,145));
        bgSlot.addChild(slotfui);
        var thiz = this;
        slotfui._finishedHandler = function () {
            thiz.onFinishQuay();
        };
        this.slotfui = slotfui;
        var btnQuay = new ccui.Button("slot_btnRotate.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnQuay.setPosition(cc.p(925,80));
        bgSlot.addChild(btnQuay);
        this.btnQuay = btnQuay;

        btnQuay.addClickEventListener(function () {
            thiz.enableAutoRotate(false);
            thiz.rotateRequest();
        });


        var free_spin = new cc.Scale9Sprite("slot_bg_freeSpin.png",cc.rect(8, 8, 2, 2));
        free_spin.setAnchorPoint(cc.p(0,0));
        free_spin.setPosition(cc.p(-48, -2));
        free_spin.setPreferredSize(cc.size(790 , 420));
        slotfui.addChild(free_spin,-1);
        free_spin.setVisible(false);
        this.free_spin = free_spin;

        var bg_choithu = new cc.Scale9Sprite("slot_bg_choithu.png",cc.rect(8, 8, 2, 2));
        bg_choithu.setAnchorPoint(cc.p(0,0));
        bg_choithu.setPosition(cc.p(-48, -2));
        bg_choithu.setPreferredSize(cc.size(790 , 420));
        slotfui.addChild(bg_choithu,-1);
        bg_choithu.setVisible(false);
        this.bg_choithu = bg_choithu;


        var btnGive = new ccui.Button("slot_btn_nt1.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnGive.setPosition(cc.p(925,80));
        bgSlot.addChild(btnGive);
        btnGive.setVisible(false);
        this.btnGive = btnGive;

        btnGive.addClickEventListener(function () {
            if(thiz.nodeBigWin != undefined && thiz.nodeBigWin != null){
                thiz.nodeBigWin.removeFromParent(true);
                thiz.nodeBigWin = null;
            }
            thiz.enableAutoRotate(false);
            thiz.btnX2.setVisible(false);
            btnGive.setVisible(false);
            if(thiz.isTry){
                thiz.setGoldVituarl(parseInt(thiz.dataSlot["3"]["4"]));
                thiz.changeGoldEffect(thiz.dataSlot["3"]["4"]);
                thiz.onNhanThuong();
            }else{
                thiz._controller.sendGiveGold();
            }

        });

        var btnStop = new ccui.Button("slot_btn_stop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnStop.setPosition(cc.p(925,80));
        bgSlot.addChild(btnStop);
        btnStop.setVisible(false);
        this.btnStop = btnStop;

        btnStop.addClickEventListener(function () {
            thiz.handelStopButton();
        });


        var btnAuto = new ccui.Button("slot_btnAuto.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnAuto.setPosition(cc.p(804,80));
        bgSlot.addChild(btnAuto);
        this.btnAuto = btnAuto;
        this.isAutoRotate = false;
        btnAuto.addClickEventListener(function () {
            thiz.clickAutoQuay();
        });

        var slot_chambi = new cc.Sprite("#slot_chambi.png");
        slot_chambi.setPosition(btnAuto.getPosition());
        slot_chambi.runAction(new cc.RepeatForever(
            new cc.RotateBy(1,360)));
        this.slot_chambi = slot_chambi;
        bgSlot.addChild(slot_chambi);

        var btn20Row = new ccui.Button("slot_btn_row.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn20Row.setPosition(cc.p(200,65));
        bgSlot.addChild(btn20Row);
        var lblRowNumber = new cc.LabelTTF("20", cc.res.font.Roboto_CondensedBold, 24);
        lblRowNumber.setPosition(btn20Row.getContentSize().width/2,btn20Row.getContentSize().height/2+15);
        btn20Row.addChild(lblRowNumber);

        this.btn20Row = btn20Row;

        this.lblRowNumber = lblRowNumber;

        var lblDong = new cc.LabelTTF("DÒNG", cc.res.font.Roboto_CondensedBold, 24);
        lblDong.setPosition(btn20Row.getContentSize().width/2,btn20Row.getContentSize().height/2-15);
        btn20Row.addChild(lblDong);

        btn20Row.addClickEventListener(function () {
            thiz.selectLine.setVisible(true);
            thiz.enableAutoRotate(false);
            // thiz.bonusLucky.show();
            // thiz.showJackpot();
        });

        this.initLabel();

        var btnX2 = new ccui.Button("slot_btnX2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnX2.setPosition(cc.p(1060,150));
        bgSlot.addChild(btnX2);
        btnX2.setVisible(false);
        this.btnX2 = btnX2;

        var slot_btnx2_bg = new cc.Sprite("#slot_btnx2_bg.png");
        slot_btnx2_bg.setPosition(cc.p(btnX2.getContentSize().width/2,btnX2.getContentSize().height/2));
        btnX2.addChild(slot_btnx2_bg);
        slot_btnx2_bg.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(0.5,30),
                new cc.FadeTo(0.5,255)
            )
        ));

        btnX2.addClickEventListener(function () {
            SoundPlayer.playSound("DoubleOrNothing");
            if(thiz.nodeBigWin != undefined && thiz.nodeBigWin != null){
                thiz.nodeBigWin.removeFromParent(true);
                thiz.nodeBigWin = null;
            }
            thiz.dup.show(true);
            thiz.enableAutoRotate(false);
        });

        this.initTopBar();

        this.initLine();
        var dup = new DuplicateGold();
        thiz.addChild(dup,3);
        this.dup = dup;
        dup._clickButHandler = function (i) {
            cc.log(i);
            thiz._controller.sendBonus(i);
        };
        dup._handeGiveClick = function (money) {
            if(thiz.isTry){
                thiz.setGoldVituarl(money);
                thiz.changeGoldEffect(money);
                thiz.onNhanThuong();
            }
            else {
                thiz._controller.sendGiveGold();
            }

        };
        dup._resuftDupVitual = function (idCard,type,moneyWin) {
            thiz.onBonus(idCard,type,moneyWin);
        };
        dup.setVisible(false);

        var selectLine = new SelectLine();
        this.addChild(selectLine);
        selectLine._lineClickHandler = function () {
            thiz.stopAllActions();
            thiz.clearAllLine();
            thiz.onSetTextBet();

            for(var i = 0; i < thiz.arrNum.length; i++){
                thiz.arrNum[i].visibleNew(false);
            }
            var lines = selectLine.getLines();
            for(var i = 0; i < lines.length; i++){
                    thiz.arrNum[lines[i]-1].visibleNew(true);

            }

        };
        // selectLine._lineReconnect = function () {
        //     thiz.onSetTextBet();
        // },
        selectLine._clickOneLine = function (line,isShow) {
            thiz.arrNum[line].visibleNew(isShow);
        };
        selectLine.setVisible(false);
        this.selectLine = selectLine;
        this.initBetButtons();
        var playerMe = new GamePlaySlot();
        playerMe.setPosition(150, 50.0);
        this.addChild(playerMe, 1);
        this.playerMe =  playerMe;

        // var lblMoneyLine =  new cc.LabelBMFont("",  "res/fonts/Roboto_GoldSlot.fnt");
        // lblMoneyLine.setPosition(thiz.bgSlot.getContentSize().width/2,thiz.bgSlot.getContentSize().height/2-15);
        // thiz.bgSlot.addChild(lblMoneyLine);
        // this.lblMoneyLine = lblMoneyLine;


        var wgFree = new ccui.Widget();
        wgFree.setContentSize(btnStop.getContentSize());
        wgFree.setTouchEnabled(true);
        wgFree.setPosition(btnStop.getPosition());
        bgSlot.addChild(wgFree,1);
        wgFree.setVisible(false);
        this.btnFree = wgFree;
        var btnFree = new cc.Sprite("#slot_btn_spin.png");
        btnFree.setPosition(btnStop.getContentSize().width/2, btnStop.getContentSize().height/2);

        wgFree.addChild(btnFree,1);

        var lblFree = new cc.LabelBMFont("15", "res/fonts/fontFreeSpin.fnt");
        lblFree.setPosition(btnFree.getContentSize().width/2,btnFree.getContentSize().height/2+20);
        btnFree.addChild(lblFree);
        this.lblFree = lblFree;





        // var cheatNo = s_Dialog_Create_Button1(cc.size(120, 60), "Nohu");
        // cheatNo.setPosition(200,cc.winSize.height -100);
        // cheatNo.addClickEventListener(function () {
        //     thiz.rotateRequestCh(-1);
        // }),
        // this.addChild(cheatNo);
        //
        // var cheatFree = s_Dialog_Create_Button1(cc.size(120, 60), "Free");
        // cheatFree.setPosition(200,cc.winSize.height-200);
        // cheatFree.addClickEventListener(function () {
        //     thiz.rotateRequestCh(8);
        // }),
        //     this.addChild(cheatFree);
        // var cheatBonus = s_Dialog_Create_Button1(cc.size(120, 60), "Lucky");
        // cheatBonus.setPosition(200,cc.winSize.height-300);
        // cheatBonus.addClickEventListener(function () {
        //     thiz.rotateRequestCh(7);
        // }),
        //     this.addChild(cheatBonus);
        //
        // var line1 = new newui.TextField(cc.size(300, 80), cc.res.font.Roboto_CondensedBold_25);
        // line1.setPlaceHolder("line 1");
        // line1.setPlaceHolderColor(cc.color("#909090"));
        // line1.setPosition(cc.winSize.width-100,240);
        //
        // this.addChild(line1);
        //
        // var line2 = new newui.TextField(cc.size(300, 80), cc.res.font.Roboto_CondensedBold_25);
        // line2.setPlaceHolder("line 2");
        // line2.setPlaceHolderColor(cc.color("#909090"));
        // line2.setPosition(cc.winSize.width-100,300);
        //
        // this.addChild(line2);
        //
        //
        // var line3 = new newui.TextField(cc.size(300, 80), cc.res.font.Roboto_CondensedBold_25);
        // line3.setPlaceHolder("line 3");
        // line3.setPlaceHolderColor(cc.color("#909090"));
        // line3.setPosition(cc.winSize.width-100,400);
        //
        // this.addChild(line3);
        //
        //
        // var rotasteaa = s_Dialog_Create_Button1(cc.size(120, 60), "QuayZ");
        // rotasteaa.setPosition(200,cc.winSize.height-400);
        // rotasteaa.addClickEventListener(function () {
        //     thiz.rotateRequest3(line1.getText(),line2.getText(),line3.getText());
        // }),
        //     this.addChild(rotasteaa);




    },
    rotateRequestCh:function (index) {
        if(this.nodeBigWin != undefined && this.nodeBigWin != null){
            this.nodeBigWin.removeFromParent(true);
            this.nodeBigWin = null;
        }
        // this.lblMoneyLine.stopAllActions();
        // this.lblMoneyLine.setString("");
        this.activeButtonNewGame(false);

        this.free_spin.setVisible(false);
        this.clearLineDraw();
        this.stopAllActions();

        if(PlayerMe.gold < this.selectLine.getLines().length*ARR_BET_SLOT[this.indexBet]){
            MessageNode.getInstance().show("Bạn không đủ tiền để quay tiếp !");
            this.isHaveData = true;
            this.activeButtonNewGame(true);
            this.enableAutoRotate(false);

            return;
        }
        this.slotfui.rotate();
        this.isHaveData = false;
        this._controller.sendRouteRequestCh(this.indexBet+1,this.selectLine.getLines(),index);
    },
    rotateRequest3:function (line1,line2,line3) {
        if(this.nodeBigWin != undefined && this.nodeBigWin != null){
            this.nodeBigWin.removeFromParent(true);
            this.nodeBigWin = null;
        }
        // this.lblMoneyLine.stopAllActions();
        // this.lblMoneyLine.setString("");
        this.activeButtonNewGame(false);

        this.free_spin.setVisible(false);
        this.clearLineDraw();
        this.stopAllActions();

        if(PlayerMe.gold < this.selectLine.getLines().length*ARR_BET_SLOT[this.indexBet]){
            MessageNode.getInstance().show("Bạn không đủ tiền để quay tiếp !");
            this.isHaveData = true;
            this.activeButtonNewGame(true);
            this.enableAutoRotate(false);

            return;
        }
        this.slotfui.rotate();
        this.isHaveData = false;
        this._controller.sendRouteRequest3(this.indexBet+1,this.selectLine.getLines(),line1,line2,line3);
    },

    enableAutoRotate:function (isEnable) {
        // this.setActiveBt(this.btnAuto,!isEnable);
        this.isAutoRotate = isEnable;
        this.slot_chambi.setVisible(isEnable);


    },
    rotateRequest:function () {

        if(this.nodeBigWin != undefined && this.nodeBigWin != null){
            this.nodeBigWin.removeFromParent(true);
            this.nodeBigWin = null;
        }
        // this.lblMoneyLine.stopAllActions();
        // this.lblMoneyLine.setString("");
        this.setTextWin("0");
        this.activeButtonNewGame(false);
        this.btnX2.setVisible(false);
        this.free_spin.setVisible(false);
        this.clearLineDraw();
        this.stopAllActions();

        if(PlayerMe.gold < this.selectLine.getLines().length*ARR_BET_SLOT[this.indexBet] && !this.isTry){
            MessageNode.getInstance().show("Bạn không đủ tiền để quay tiếp !");
            this.isHaveData = true;
            this.activeButtonNewGame(true);
            this.enableAutoRotate(false);

            return;
        }
        this.slotfui.rotate();
        this.isHaveData = false;
        if(this.isTry){
            var yy = parseInt(this.lblHu.getString().replace(/[.,]/g,''));
            this.setGoldVituarl(-10000*this.selectLine.getLines().length);
            this.setTextHuThuong(yy +0.01*10000*this.selectLine.getLines().length);
           if(this.numberTry.length > 0){
               this.setActiveBt(this.btnTry,false);
               var randomTry = Math.floor(cc.rand()%this.numberTry.length);

               this._controller.sendRouteRequestTry(3,this.selectLine.getLines(), this.numberTry[randomTry]);
               this.numberTry.splice(randomTry,1);
           }else {
               this._controller.sendRouteRequestTry(3,this.selectLine.getLines(),-1);
           }


        }
        else {
            this._controller.sendRouteRequest(this.indexBet+1,this.selectLine.getLines());
        }

      this._soundRotate =   SoundPlayer.playSoundLoop("quayrepeat");


    },
    initLine:function () {
        this.arrLine = [];
        for(var i = 0; i< 20;i++){
            var line = new cc.Sprite("#slot_line" + (i+1).toString()+ ".png");
            line.setPosition(cc.p(line.getContentSize().width/2,line.getContentSize().height/2));
            line.setVisible(false);
            this.bgSlot.addChild(line);
            this.arrLine.push(line);
        }
        this.arrNum = [];
        for(var i = 0; i < 20; i++){
            var buttonNumer = new NumberSlot((i+1).toString());
            buttonNumer.setPosition(cc.p((i%2==0)?85:925,535 - Math.floor(i/2)*41));
            this.bgSlot.addChild(buttonNumer);
            this.arrNum.push(buttonNumer);
            buttonNumer.visibleNew(true);
        }
    },

    setTextHuThuong:function (value) {

        this.lblHu.stopAllActions();
        this.txtHu.setString("Hũ thưởng  "+ value);
        var a = this.txtHu.getContentSize().width/2;
        this.txtHu.setString("Hũ thưởng");
        var posX =  290/2 - (a - this.txtHu.getContentSize().width);
        // this.lblHu.setString(value);
        var zz =  parseInt(value);
        var yy = parseInt(this.lblHu.getString().replace(/[.,]/g,''));
        if(yy != zz)
        {
            var action = new quyetnd.ActionNumber(0.3,zz);
            this.lblHu.runAction(action);
        }

        this.txtHu.setPosition(posX,this.txtHu.getPositionY());
        this.lblHu.setPosition(posX+4,this.txtHu.getPositionY());
    },
    setTextBet:function (value) {
        this.lblBet.setString("Tổng Cược: "+ value);
        var posX =  225/2 - (this.lblBet.getContentSize().width/2 - this.txtBet.getContentSize().width);
        this.lblBet.setString(value);
        this.txtBet.setPosition(posX,this.txtBet.getPositionY());
        this.lblBet.setPosition(posX+2,this.txtBet.getPositionY());
    },
    setTextWin:function (value) {

       var zz =  cc.Global.NumberFormat1(parseInt(value));

       var posX =  220/2 - ((71 + zz.length*12)/2 - this.txtWin.getContentSize().width);
        this.lblWin.stopAllActions();
        if(parseInt(value)==0){
            this.lblWin.setString(value);
        }
        else{
            var action = new quyetnd.ActionNumber(0.5, parseInt(value));
            this.lblWin.runAction(action);
        }

        this.txtWin.setPosition(posX,this.txtWin.getPositionY());
        this.lblWin.setPosition(posX+2,this.txtWin.getPositionY());
    },
    onNhanThuong:function () {
        this.setTextWin("0");
        // this.lblMoneyLine.setVisible(false);
        var thiz = this;
        var from = this.lblWin.getParent().convertToWorldSpace(this.lblWin.getPosition());
        var to = this.playerMe.avt.getParent().convertToWorldSpace(this.playerMe.avt.getPosition());
        this.move4Chip(from, to);
        this.btnX2.setVisible(false);
        this.btnGive.setVisible(false);
        this.activeButtonNewGame(true);

        //var randeom = Math.floor(Math.random()*8);
        // if(randeom !=2){
        //     return;
        // }
        // for(var i = 0; i < 5; i++){
        //     (function () {
        //         var iNew = i;
        //         thiz.btnX2.runAction(new cc.Sequence(
        //             new cc.DelayTime(iNew*0.2),
        //             new cc.CallFunc(function () {
        //                 var coin =  new CoinNode();
        //                 coin.show();
        //             })
        //         ))
        //
        //     })();
        // }
    },
    initLabel:function () {
        //hu thuong

        var bgHu = new ccui.Button("slot_bg_hu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgHu.setScale9Enabled(true);
        bgHu.setCapInsets(cc.rect(12, 0, 4, 46));
        bgHu.setContentSize(cc.size(290, 46));
        bgHu.setPosition(cc.p(504,560));
        this.bgSlot.addChild(bgHu,100);
        bgHu.addClickEventListener(function () {
           cc.log("Lich su no hu");
            var his = new HistoryNoHuFruit();
            his.show();
        });



        // var bgHu = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        // bgHu.setPreferredSize(cc.size(290, 46));
        // bgHu.setPosition(cc.p(504,560));
        // this.bgSlot.addChild(bgHu,100);

        var txtHu = new cc.LabelTTF("Hũ thưởng", cc.res.font.Roboto_Condensed,24);
        txtHu.setColor(cc.color(186,194,249,255));
        txtHu.setAnchorPoint(cc.p(1,0.5));
        txtHu.setPosition(142,23);
        bgHu.addChild(txtHu);
        this.txtHu = txtHu;

        var lblHu = new cc.LabelTTF("10.000", cc.res.font.Roboto_CondensedBold,24);
        lblHu.setColor(cc.color(255,222,0,255));
        lblHu.setAnchorPoint(cc.p(0,0.5));
        lblHu.setPosition(144,23);
        bgHu.addChild(lblHu);
        this.lblHu = lblHu;

        // muc cuoc
        var bgBet = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        bgBet.setPreferredSize(cc.size(220, 46));
        bgBet.setPosition(cc.p(504-115,140));
        this.bgSlot.addChild(bgBet);

        var txtBet = new cc.LabelTTF("Tổng Cược:", cc.res.font.Roboto_Condensed,24);
        txtBet.setColor(cc.color(186,194,249,255));
        txtBet.setAnchorPoint(cc.p(1,0.5));
        txtBet.setPosition(108,23);
        this.txtBet = txtBet;
        bgBet.addChild(txtBet);

        var lblBet = new cc.LabelTTF("10.000", cc.res.font.Roboto_CondensedBold,24);
        lblBet.setColor(cc.color(255,222,0,255));
        lblBet.setAnchorPoint(cc.p(0,0.5));
        lblBet.setPosition(110,23);
        bgBet.addChild(lblBet);
        this.lblBet = lblBet;

        // tien win
        var bgWin = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        bgWin.setPreferredSize(cc.size(220, 46));
        bgWin.setPosition(cc.p(504+110,140));
        this.bgSlot.addChild(bgWin);

        var txtWin = new cc.LabelTTF("Thắng:", cc.res.font.Roboto_Condensed,24);
        txtWin.setColor(cc.color(186,194,249,255));
        txtWin.setAnchorPoint(cc.p(1,0.5));
        txtWin.setPosition(100,23);
        this.txtWin = txtWin;
        bgWin.addChild(txtWin);

        var lblWin = new cc.LabelTTF("0", cc.res.font.Roboto_CondensedBold,24);
        lblWin.setColor(cc.color(255,222,0,255));
        lblWin.setAnchorPoint(cc.p(0,0.5));
        lblWin.setPosition(102,23);
        bgWin.addChild(lblWin);
        this.lblWin = lblWin;

        var lblID = new cc.LabelTTF("", cc.res.font.Roboto_CondensedBold,24);
        lblID.setColor(cc.color(225,177,255,255));
        lblID.setPosition(504,85);
        this.bgSlot.addChild(lblID);
        this.lblID = lblID;
    },
    initBetButtons:function () {
        var  thiz = this;
        this.arrButBet = [];
        for(var i = 0; i< 3;i++){
            (function () {
                var inew = i;
                var btnBet = new ccui.Button("slot_bet_a1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnBet.setPosition(cc.p(-50,170 + i*121));
                btnBet.addClickEventListener(function () {
                    thiz.setlectButtonBet(inew);
                });
                thiz.bgSlot.addChild(btnBet);
                btnBet.setVisible(false);
                thiz.arrButBet.push(btnBet);
            })();

        }
        var play_vitual = new ccui.Button("btn_choithu.png","","" ,ccui.Widget.PLIST_TEXTURE);
        play_vitual.setPosition(-50,170 + 3*121);
        play_vitual.addClickEventListener(function () {
            thiz.isTry = !thiz.isTry;
            var nameText = (thiz.isTry)?"btn_choithu2.png":"btn_choithu.png";
            play_vitual.loadTextureNormal(nameText,ccui.Widget.PLIST_TEXTURE);
            thiz.bg_choithu.setVisible(thiz.isTry);
            thiz.dup.setTry(thiz.isTry);
            thiz.bonusLucky.setTry(thiz.isTry);
            for(var  i = 0;i < thiz.arrButBet.length; i++){
                thiz.arrButBet[i].setVisible(!thiz.isTry);//   thiz.setActiveBt(thiz.arrButBet[i],!thiz.isTry);
            }
            if(thiz.isTry)  {
                thiz.goldVitual = 50000000;
                thiz.playerMe.setGoldTry(thiz.goldVitual,thiz.goldVitual);
                thiz.numberTry = [1,2,3,4,5,6,7,8];
                thiz.btnGive.setVisible(false);
                thiz.setTextHuThuong("10000000");
                thiz.setTextBet(cc.Global.NumberFormat1(thiz.selectLine.getLines().length*10000));
            }
            else {
                thiz.setTextBet(cc.Global.NumberFormat1(thiz.selectLine.getLines().length*ARR_BET_SLOT[thiz.indexBet]));
                thiz.setlectButtonBet(thiz.indexBet);
                thiz.btnGive.setVisible(false);
                thiz.btnX2.setVisible(false);
                thiz.activeButtonNewGame(true);
                thiz.playerMe.setGold(PlayerMe.gold);
            }

        });
        thiz.bgSlot.addChild(play_vitual);
        this.btnTry = play_vitual;

    },
    setModePlay:function (isTry) {
        this.isTry = false;
        this.dup.setTry(this.isTry);
        this.bonusLucky.setTry(this.isTry);
        this.btnTry.loadTextureNormal("btn_choithu.png",ccui.Widget.PLIST_TEXTURE);
        this.setActiveBt( this.btnTry,true);
        this.bg_choithu.setVisible(false);

        for(var i = 0; i < this.arrButBet.length; i++)
            this.arrButBet[i].setVisible(true);

    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    },

    onSetTextBet:function () {
        this.setTextBet(cc.Global.NumberFormat1(this.selectLine.getLines().length*ARR_BET_SLOT[this.isTry?2:this.indexBet]));
        this.lblRowNumber.setString(this.selectLine.getLines().length.toString() );
    },

    setlectButtonBet:function (index) {
        this.enableAutoRotate(false);
        this.indexBet = index;
        for(var i = 0; i< this.arrButBet.length;i++){
            var name = ((i==index)?"slot_bet_a":"slot_bet_d")+(i+1).toString()+".png";
            this.arrButBet[i].loadTextureNormal( name,ccui.Widget.PLIST_TEXTURE) ;
        }
        this.onSetTextBet();
        if(this.arrHuThuong.length > 2){
            this.setTextHuThuong(parseInt(this.arrHuThuong[index]));
        }
    },
    initTopBar:function () {
        var thiz = this;
        var backBt = new ccui.Button("ingame-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setScale(cc.winSize.screenScale);
        backBt.setPosition(54*cc.winSize.screenScale, 666);
        this.addChild(backBt);
        backBt.addClickEventListener(function () {
            thiz.backButtonClickHandler();
        });

        var settingBt = new ccui.Button("ingame-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setScale(cc.winSize.screenScale);
        settingBt.setPosition(1220*cc.winSize.screenScale, backBt.y);
        settingBt.addClickEventListener(function () {
            var dialog = new SettingDialog();
            dialog.showWithAnimationMove();
        });
        this.addChild(settingBt);

        var hisBt = new ccui.Button("slot_btn_his.png", "", "", ccui.Widget.PLIST_TEXTURE);
        hisBt.setScale(cc.winSize.screenScale);
        hisBt.setPosition(1120*cc.winSize.screenScale, backBt.y);
        hisBt.addClickEventListener(function () {
            var his = new HistoryFruit();
            his.show();
        });
        this.addChild(hisBt);

        var tutorialBt = new ccui.Button("slot_btn_tutorial.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialBt.setScale(cc.winSize.screenScale);
        tutorialBt.setPosition(1020*cc.winSize.screenScale, backBt.y);
        tutorialBt.addClickEventListener(function () {

            var tutorialDialog = TutorialDialog.getTutorial(GameType.GAME_SLOT_FRUIT);
            tutorialDialog.show();
            SoundPlayer.playSound("mini_clickButton");
        });
        this.addChild(tutorialBt);
    },
    exitToGame: function (message) {
        var homeScene = new HomeScene();
        homeScene.startGame();
        cc.director.replaceScene(homeScene);
        if (message) {
            MessageNode.getInstance().show(message, null, homeScene);
        }
        return homeScene;
    },
    handleResuft:function(isReconnect,arrItem,obArrLine,moneyWin,isX2){
        this.isHaveData = true;
        this.moneyWin = moneyWin;
        this.dup.setMoney(moneyWin);
        this.isX2 = isX2;
        if(moneyWin == null){
            this.moneyWin = "0";
        }
        if(isX2 == null){
            this.isX2 = false;
        }



        var thiz =  this;

        this.obArrLine = obArrLine;
        this.arrItem = arrItem;
        if(arrItem.length > 0){
            this.btnStop.setVisible(true);
        }
        if(isReconnect){
            this.slotfui.showNotEffect(arrItem);
            thiz.onFinishQuay();
        }else {
            this.slotfui.stopSlotWithResuft(arrItem);
        }

    },
    handleResuftZ:function(isReconnect,param){
        if(!isReconnect){
            this.runAction(new cc.Sequence(new cc.DelayTime(0.05), new cc.CallFunc(function () {
                SoundPlayer.stopSoundLoop(thiz._soundRotate);
                thiz._rollingSound = null;

            })));

        }
        this.dataSlot = param;
        var arrItem = param["2"];
        var moneyWin = param["3"]["4"];
        this.isHaveData = true;
        this.dup.setMoney(moneyWin);
        if(moneyWin == null){
            this.moneyWin = "0";
        }

        if(param["3"]["6"]){
            this.onFreeSpin(param["3"]["6"]);
        }
        var thiz =  this;

        if(arrItem.length > 0 && this.isFreeSpin == 0){
            this.btnStop.setVisible(true);
        }
        if(isReconnect){
            this.arrFreeSpin = [];
            this.isFreeSpin = 0;
            this.slotfui.showNotEffect(arrItem);
            thiz.onFinishQuay();
        }else {
            this.slotfui.stopSlotWithResuft(arrItem);
        }

    },
    handelStopButton:function () {
        this.enableAutoRotate(false);
        this.slotfui.stopNow(this.dataSlot["2"]);
    },
    onFinishQuay:function () {


        var  thiz =  this;
        var moneyWin =   this.dataSlot["3"]["4"];
        this.setTextWin(moneyWin);
        var isBonus =  this.dataSlot["3"]["2"];
        if(isBonus){
            thiz.enableAutoRotate(false);
            this.bonusLucky.show(true);
        }
        if(this.isFreeSpin>0 && !this.free_spin.isVisible())
        {
            thiz.enableAutoRotate(false);
            MessageNode.getInstance().show("Bạn có " + this.isFreeSpin + " lượt quay miễn phí!");
            this.free_spin.setVisible(true);

        }

        // this.free_spin.setVisible((this.isFreeSpin>0)?true:false);
        this.btnFree.setVisible((this.isFreeSpin>0)?true:false);
        this.setActiveBt(this.btnAuto,(this.isFreeSpin>0)?false:true);
        if(this.isFreeSpin>0 && thiz.arrFreeSpin != undefined ){

            var zzz = thiz.isFreeSpin;
            if(this.isFreeSpin!=1){
                thiz.showAllLineWin();
            }
            this.runAction(new cc.Sequence(new cc.DelayTime(1), new cc.CallFunc(function () {
                thiz.slotfui.rotate();
                thiz.clearLineDraw();
                // thiz.stopAllActions();
                //
                    thiz.lblFree.setString( (zzz- 1).toString());
                    thiz.handleResuftZ(false,thiz.arrFreeSpin[thiz.arrFreeSpin.length-zzz ]);

            })

            ));
            thiz.isFreeSpin--;
            this.btnX2.setVisible(false);
            return;
        }

        if(parseInt(moneyWin) > 10*this.selectLine.getLines().length*ARR_BET_SLOT[(thiz.isTry)?2:this.indexBet])
        {
            this.onBigwin(moneyWin);
        }
        var isX2 = this.dataSlot["3"]["5"];
        if(isX2 == null || isX2 == undefined){
            isX2 = false;
        }
        if(isX2){
            if(thiz.isTry){

                this.isAutoRotate = false;
                this.btnX2.setVisible(true);
                this.btnGive.setVisible(true);
                if(this.isFreeSpin == 0){
                    this.setActiveBt(this.btnTry,true);
                }
                if(this.dataSlot["3"]["3"]){
                    var yy = parseInt(this.lblHu.getString().replace(/[.,]/g,''));
                    thiz.setTextHuThuong(Math.floor(yy/2).toString());
                    thiz.showJackpot();
                    thiz.setGoldVituarl(Math.floor(yy/2));
                }
            }
            else {
                this.btnX2.setVisible(true);
                this.btnGive.setVisible(true);
                this.activeButtonNewGame(false);
            }
        }

        else {
                this.activeButtonNewGame(true);

        }

        if(thiz.btnX2.isVisible() ){
            this.runAction(new cc.Sequence(new cc.DelayTime(0.5), new cc.CallFunc(function () {
                SoundPlayer.playSound("slot_win");
            })));

        }
        this.btnStop.setVisible(false);


         this.runAction(new cc.Sequence(new cc.CallFunc(function () {
                thiz.showAllLineWin();
            }),
            new cc.DelayTime(this.isAutoRotate?0.5:1),
            new cc.CallFunc(function () {
               thiz.clearAllLine();
                }),
            new cc.CallFunc(function () {
               thiz.showOneLine();
            })
              ));

        if(this.isAutoRotate){
            this.runAction(new cc.Sequence(new cc.DelayTime(2.7),new cc.CallFunc(function () {
                if(!thiz.isHaveData){
                    return;
                }
                if(thiz.isAutoRotate){

                    thiz.btnGive.setVisible(false);
                    thiz.rotateRequest();
                }

            })));

        }
    },
    clearLineDraw:function () {
        for(var i = 0;i<20;i++){
            this.arrLine[i].setVisible(false);
            // this.arrNum[i].visibleNew(false);

        }
    },
    clearAllLine:function () {
        this.clearLineDraw();
        this.slotfui.clearAllItemInLine();
    },

    showNumLineReconnect:function (arrLine,index) {

        this.setModePlay();

        this.indexBet = index;
        this.setlectButtonBet(index);
        this.selectLine.setLineReconnect(arrLine);
        this.onSetTextBet();
        for(var i = 0; i < this.arrNum.length; i++){
            this.arrNum[i].visibleNew(false);
        }
        for(var i = 0; i < arrLine.length; i++){
            this.arrNum[arrLine[i]-1].visibleNew(true);
        }
    //
    //     for(var i = 0; i < arrLine.length; i++){
    //         this.arrNum[arrLine-1].visibleNew(true);
    //     }
    },
    setGoldVituarl:function (goldAdd) {
          var thiz = this;
            var moneyCurrent = thiz.goldVitual +  goldAdd;
            thiz.playerMe.setGoldTry(thiz.goldVitual,moneyCurrent);
            thiz.goldVitual = moneyCurrent;
        },
    showAllLineWin:function(){
        var obArrLine = this.dataSlot["3"]["1"];

        for(var i = 0; i < obArrLine.length  ; i++){
            var line = obArrLine[i];
            var idLine =  line["1"]-1;
            this.arrLine[idLine].setVisible(true);
            this.arrNum[idLine].visibleNew(true);
            this.slotfui.showLineWin(idLine,line["3"]);
        }
        // this.lblMoneyLine.stopAllActions();
        // this.lblMoneyLine.setVisible(true);
        // this.lblMoneyLine.setString("0");
        // if(parseInt(this.dataSlot["4"])== 0){
        //     this.lblMoneyLine.setString("");
        // }
        // else{
        //     this.lblMoneyLine.runAction(new quyetnd.ActionNumber(this.isAutoRotate?0.25:0.5, parseInt(this.dataSlot["4"])));
        // }

    },
    showOneLine:function () {
        var thiz = this;
        var arrAction  = [];
        var obArrLine = this.dataSlot["3"]["1"];
        var money1Line = 0;
        this.isPlaySound = true;
        for(var i = 0; i < obArrLine.length  ; i++){

            (function () {
                var iNew = i;
                var line = obArrLine[iNew];
                var idLine =  line["1"]-1;
                money1Line += parseInt(line["4"]);
                var zzz = money1Line;
                var actionLine = new cc.CallFunc(function () {
                    thiz.arrLine[idLine].setVisible(true);
                    // thiz.lblMoneyLine.stopAllActions();
                    // if(iNew==0 ){
                    //     thiz.lblMoneyLine.setString("0");
                    // }
                    // if(obArrLine.length>1)
                    // {
                    //     thiz.lblMoneyLine.runAction(new quyetnd.ActionNumber(0.25, zzz));
                    // }
                    // else {
                    //     thiz.lblMoneyLine.setString(cc.Global.NumberFormat1(zzz));
                    // }
                    // if(obArrLine.length == iNew+1){
                    //     thiz.lblMoneyLine.setVisible(false);
                    // }

                    thiz.slotfui.showLineWin(idLine,line["3"]);
                    if(thiz.isPlaySound){
                        SoundPlayer.playSound("slot_line");
                    }

                    if(iNew ==obArrLine.length-1 ){
                        thiz.isPlaySound = false;
                    }
                });
               var clearzzz =  new cc.CallFunc(function () {
                    thiz.clearAllLine();
                });
                var delayTime = new cc.DelayTime(1);

                arrAction.push(actionLine);
                arrAction.push(delayTime);
                arrAction.push(clearzzz);
            })();

        }
        if(arrAction.length!=0){
            this.runAction(new cc.RepeatForever(new cc.Sequence(arrAction)));
        }


    },
    initHuThuong: function (data) {
        // LoadingDialog.getInstance().hide();
        this.arrHuThuong = [];

        for(var i =0; i < data.length; i++){
            this.arrHuThuong.push(data[i]["2"]);
        }
        this.setlectButtonBet(0);
        this.showArrButtonBet();
        this.slotfui.initRandom();
    },
    performChangeRewardFund:function (data) {
        if(!this.isTry){
            if(this.arrHuThuong && this.arrHuThuong.length>0){
                for(var i =0; i < this.arrHuThuong.length; i++){
                    this.arrHuThuong[i] = data[i][2];
                }
                this.setTextHuThuong(parseInt(this.arrHuThuong[this.indexBet]));
            }
        }


    },
    showArrButtonBet:function () {
        for (var  i = 0; i < this.arrButBet.length; i ++){
            this.arrButBet[i].setVisible(true);
        }
    },
    clickAutoQuay:function () {
        if(this.isTry){
            MessageNode.getInstance().show("Chỉ hỗ trợ ở chế độ chơi thật");
            return;
        }

        if(!this.isHaveData || this.isFreeSpin > 0 || this.isAutoRotate){
            return;
        }

        this.enableAutoRotate(true);

        this.rotateRequest();
    },
    onBonus:function(idCard,type,moneyWin){
        this.dup.handelResuft(idCard,type,moneyWin);
        this.setTextWin(moneyWin);
        if(type == 3){
            this.btnX2.setVisible(false);
            this.btnGive.setVisible(false);

            this.activeButtonNewGame(true);
        }

    },

    updateGold: function ( gold) {
        var goldNumber = gold;
        if (typeof gold === "string") {
            goldNumber = parseInt(gold);
        }

        this.playerMe.setGold(goldNumber);

    },
    changeGoldEffect: function ( deltaGold) {
      if(parseInt(deltaGold)>0){
          this.playerMe.runChangeGoldEffect(deltaGold);
      }

    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        SoundPlayer.stopAllSound();
        if (this._controller) {
            this._controller.releaseController();
            this._controller = null;
        }
    },

    setModeChoiThu:function () {

    },

    onEnter : function () {
        this._super();
        var thiz = this;
        this.scheduleUpdate();
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if(cc.sys.isNative){
                    if (parseKeyCode(keyCode) === cc.KEY.back) {
                        thiz.backButtonClickHandler();
                    }
                }
                else{
                    if(keyCode === cc.KEY.escape){
                        thiz.backButtonClickHandler();
                    }
                }
            }
        }, this);

        MiniGameNavigator.showAll();
        FloatButton.getInstance().show(this.floatButtonLayer);
        FloatButton.getInstance().setVisible(true);
    },
    backButtonClickHandler: function () {
        // var thiz = this;
        // if (LoadingDialog.getInstance().isShow()) {
        //     return;
        // }
        // if (this.popupLayer.getChildren().length > 0) {
        //     this.popupLayer.removeAllChildren();
        //     return;
        // }
        // var dialog = new MessageConfirmDialog();
        // dialog.setMessage("Bạn muốn thoát ra khỏi phòng ?");
        // dialog.okButtonHandler = function () {
        //     if (this._controller) {
        //         this._controller.requestQuitRoom();
        //     }
        this.exitToGame();
        // };
        // dialog.cancelButtonHandler = function () {
        //     dialog.hide();
        // };
        // dialog.show();


    },
    move4Chip:function (from, to) {
        // var distance = cc.pDistance(from,to);
        // var timeRun = distance/380;
        SoundPlayer.playSound("mini_betchip");
        var thiz = this;
        for(var i = 0; i < 4; i++ ){
            (function () {
                var a = i;
                var chip = new cc.Sprite("#pk_xeng.png");
                chip.setPosition(from);
                chip.setVisible(true);
                chip.runAction(new cc.Sequence(
                    new cc.DelayTime(0.05*i),
                    new cc.EaseSineIn(new cc.MoveTo(0.7, to)),
                    new cc.CallFunc(function () {
                        chip.removeFromParent(true);
                    })
                ));
                thiz.sceneLayer.addChild(chip,10);
            })();

        }

    },

    showJackpot: function () {
        var spritNo = new cc.Sprite("#slot_nohu.png");
        spritNo.setVisible(true);
        spritNo.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 170);
        this.addChild(spritNo,2);
        var layer = new JackpotLayer();

        layer.show();
        spritNo.runAction(new cc.Sequence(

            new cc.DelayTime(4),
            new cc.CallFunc(function () {
                spritNo.removeFromParent(true);
            })
        ));
    },
    activeButtonNewGame:function (isActive) {

        this.setActiveBt(this.btnTry,isActive);
        this.setActiveBt(this.btn20Row,isActive);
        this.setActiveBt(this.btnQuay,isActive);
        if(!this.isTry){
            for(var  i = 0;i < this.arrButBet.length; i++)
                this.setActiveBt(this.arrButBet[i],isActive);
        }

    },
    onError:function(params){
        SoundPlayer.stopAllSound();
        if(params["code"] == 10){
            this.slotfui.clearAll();
            this.isHaveData = true;
            this.activeButtonNewGame(true);
            this.enableAutoRotate(false);
        }
    },

    onFreeSpin:function (param) {
        var thiz = this;
        this.arrFreeSpin = param[1];
        this.isFreeSpin = this.arrFreeSpin.length;
        //MessageNode.getInstance().show("Bạn có " + this.isFreeSpin + " lượt quay miễn phí!");
        this.lblFree.setString( this.isFreeSpin.toString());
        this.btnFree.setVisible(true);
    },

    onBigwin:function (moneyWin) {
      var nodeBigWin = new cc.Node();
        //this.nodeBigWin = nodeBigWin;
        var spriHom = new cc.Sprite("#slot_hom_do.png");
        var cardBg = new cc.Sprite("#slot_bg_hom.png");
        cardBg.setPosition(spriHom.getContentSize().width/2+20, spriHom.getContentSize().height/2-20);
        spriHom.addChild(cardBg,-1);



        cardBg.runAction(new cc.RepeatForever(new cc.RotateBy(2,360)));

        var spWin = new cc.Sprite("#slot_winbig.png");
        spWin.setPosition(spriHom.getContentSize().width/2, spriHom.getContentSize().height/2-90);
        spriHom.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1)
            )
        ));
        spWin.setScale(0.4);
        spriHom.addChild(spWin);
        // spriHom.setAnchorPoint(0.5,1);
        spriHom.setPosition(cc.winSize.width/2,cc.winSize.height+100);
        spriHom.runAction(new cc.EaseBounceOut(new cc.MoveTo(1,cc.p(cc.winSize.width/2,cc.winSize.height/2+50))));
        nodeBigWin.addChild(spriHom);
        spriHom.runAction(new cc.Sequence(new cc.DelayTime(0.4),new cc.CallFunc(function () {
            spWin.runAction(new cc.ScaleTo(0.5,1));
            var coin = new CoinNode();
            coin.show();
        })));
        var lblMoneyW = new cc.LabelTTF("0",cc.res.font.Roboto_CondensedBold,45);
        lblMoneyW.setPosition(spriHom.getContentSize().width/2+10, spriHom.getContentSize().height/2-160);
        lblMoneyW.setColor(cc.color(255,240,0,255));
        var action = new quyetnd.ActionNumber(2, parseInt(moneyWin));
        lblMoneyW.runAction(action);
        spriHom.addChild(lblMoneyW);

        this.addChild(nodeBigWin,2);
        nodeBigWin.setPosition(-40*cc.winSize.screenScale,0);
        nodeBigWin.runAction(new cc.Sequence(new cc.DelayTime(4),new cc.CallFunc(function () {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan : function (touch, event) {

                    nodeBigWin.removeFromParent(true);

                    return true;
                },
            }, nodeBigWin);
        }),
            new cc.DelayTime(2),
            new cc.CallFunc(function () {
                nodeBigWin.removeFromParent(true);
            })
        ));




    },
    openAllLucky:function(arrBonus, arrRandom){
        this.bonusLucky.openAllItem(arrBonus, arrRandom);
    },
    openOneLucky:function(idItem, money){
        this.bonusLucky.openItem(idItem, money);
    },
    initController: function () {
        this._controller = new SlotFruitController(this);
    }
});


