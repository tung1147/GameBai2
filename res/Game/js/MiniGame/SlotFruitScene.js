/**
 * Created by QuyetNguyen on 12/20/2016.
 */
//var s_ChanLeLayer = null;

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
    ctor: function (isTrue) {
        this._super(isTrue);
        var withMay = 690;
        this.itemWidth = withMay/5;
        this.disHCell = 127;
        this.setContentSize(cc.size(this.itemWidth,this.disHCell));

        var num = "#slot_fruit_"+(Math.floor(Math.random()*22)+1 ).toString()+".png";
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
    setWin:function (isWin) {
        this.slot_bg_win.setVisible(isWin);
        this.bg.setVisible(isWin);
    }
});
var SlotFruit = SlotLayer.extend({
    ctor: function () {
        this._super();
        this.nodeSlot.setContentSize(cc.size(792,418));
    },
    newItem:function (isTrue) {
        return new ItemFruit(isTrue);
    },
    showLineWin:function (line) {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {
            var isWin = false;
           for(var j = 0; j < LINE_SLOT[line].length; j++){
               if(i == LINE_SLOT[line][j]){
                   isWin = true;
                   break;
               }
           }
            this.arrResuft[i].setWin(isWin);
            this.arrResuft[i].spriteHoaQua.setOpacity(isWin?255:150);
        }

    }

});

var POS_BUT_DUP = [{x: 267, y: 166},    {x: 733, y: 166},      {x: 787, y: 299},{x: 681, y: 299},{x: 316, y: 299},{x: 212, y: 299}];
var IMG_BUT_DUP = ["slot_x2_btn_do.png","slot_x2_btn_den.png", "slot_x2_x4t.png","slot_x2_x4b.png", "slot_x2_x4r.png", "slot_x2_x4c.png"];

var SelectLine =  cc.Node.extend({
    ctor:function () {
        this._super();
        var dialogBg = new ccui.Scale9Sprite("dialog-bg.png", cc.rect(120,186,4,4));
        dialogBg.setPreferredSize(cc.size(1060,823));
        dialogBg.setAnchorPoint(cc.p(0,0));
        dialogBg.setPosition((cc.winSize.width - 1060)/2 , (cc.winSize.height-823)/2);
        this.addChild(dialogBg);

        var nodeLine = new ccui.Widget();
        nodeLine.setContentSize(cc.size(700, 440));
        nodeLine.setPosition(1060/2,823/2);
        dialogBg.addChild(nodeLine)


        for(var i = 0; i < 20; i++){
            (function () {

            })();
            var xP =  80+ 140*(i%5) ;
            var yP =  80+ 110*Math.floor(i/5);
            var bg = new cc.Sprite("#slot_sl_bg.png");
            var lol = 0;
            if(i<10)
             {
                 lol = (3- Math.floor(i/5))*5;
             }

            var num = lol + i%5;
            var lbl = new cc.LabelTTF((num+1).toString(), cc.res.font.Roboto_CondensedBold,16);
            lbl.setPosition(bg.getContentSize().width/2, -25);
            bg.addChild(lbl);

            nodeLine.addChild(bg);
            bg.setPosition(cc.p(xP,yP));

        }
        // this.initView();
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
        bg.setPreferredSize(cc.size(995,654));
        bg.setScale(cc.winSize.screenScale);
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(bg);
        var lbl = new cc.LabelTTF("Đoán màu cây bài để X2 hoặc chất cây bài để X4 tiền thắng. \n                  Chọn nhận thưởng để dừng chơi.",cc.res.font.Roboto_Condensed,24);
        lbl.setPosition(500,429);
        bg.addChild(lbl);
        for(var i = 0; i < 6; i++){
            var btnX = new ccui.Button(IMG_BUT_DUP[i], "", "", ccui.Widget.PLIST_TEXTURE);
            btnX.setPosition(POS_BUT_DUP[i]);
            bg.addChild(btnX);
        }
        var wgGive = new ccui.Widget();
        wgGive.setContentSize(cc.size(130,130));
        wgGive.setTouchEnabled(true);
        wgGive.setPosition(877,536);
        bg.addChild(wgGive);

        var btnGive = new cc.Sprite("#slot_btn_nt2.png");
        btnGive.setPosition(65,65);
        wgGive.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_ENDED){
                cc.log("touch here");
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
        bg_give.setPreferredSize(cc.size(280,50));
        bg_give.setPosition(500, 501);
        bg.addChild(bg_give);

        var lblMoney = new cc.LabelTTF("10.000",cc.res.font.Roboto_CondensedBold,30);
        lblMoney.setColor(cc.color(255,222,0));
        lblMoney.setPosition(140,25);
        bg_give.addChild(lblMoney);

        var cardUp = new cc.Sprite("#slot_cardup.png");
        cardUp.setPosition(500,255);
        bg.addChild(cardUp);

    },
});

var DuplicateGold =  cc.Node.extend({
   ctor:function () {
       this._super();

   //    (8,8)
       this.initView();
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
        bg.setPreferredSize(cc.size(995,654));
        bg.setScale(cc.winSize.screenScale);
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(bg);
        var lbl = new cc.LabelTTF("Đoán màu cây bài để X2 hoặc chất cây bài để X4 tiền thắng. \n                  Chọn nhận thưởng để dừng chơi.",cc.res.font.Roboto_Condensed,24);
        lbl.setPosition(500,429);
        bg.addChild(lbl);
        for(var i = 0; i < 6; i++){
            var btnX = new ccui.Button(IMG_BUT_DUP[i], "", "", ccui.Widget.PLIST_TEXTURE);
            btnX.setPosition(POS_BUT_DUP[i]);
            bg.addChild(btnX);
        }
        var wgGive = new ccui.Widget();
        wgGive.setContentSize(cc.size(130,130));
        wgGive.setTouchEnabled(true);
        wgGive.setPosition(877,536);
        bg.addChild(wgGive);

        var btnGive = new cc.Sprite("#slot_btn_nt2.png");
        btnGive.setPosition(65,65);
        wgGive.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_ENDED){
              cc.log("touch here");
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
        bg_give.setPreferredSize(cc.size(280,50));
        bg_give.setPosition(500, 501);
        bg.addChild(bg_give);

        var lblMoney = new cc.LabelTTF("10.000",cc.res.font.Roboto_CondensedBold,30);
        lblMoney.setColor(cc.color(255,222,0));
        lblMoney.setPosition(140,25);
        bg_give.addChild(lblMoney);

        var cardUp = new cc.Sprite("#slot_cardup.png");
        cardUp.setPosition(500,255);
        bg.addChild(cardUp);

    },
});

var NumberSlot  = ccui.Button.extend({
    ctor:function (s) {
        this._super("slot_bg_number2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var lblBel = new cc.LabelTTF(s, cc.res.font.Roboto_CondensedBold,18);
        lblBel.setColor(cc.color(95,115,217));
        lblBel.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2));
        this.addChild(lblBel);
        this.lblBel = lblBel;

    },
    visibleNew:function (isVisible) {
        this.loadTextureNormal( (isVisible)?"slot_bg_number1.png":"slot_bg_number2.png",ccui.Widget.PLIST_TEXTURE) ;
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
        this._forceDelta = 200.0;

        this._torqueStart = -8.0;
        this._torqueDelta = 16.0;

        this._timeStart = 2.0;
        this._timeDelta = 1.0;

        this._startPosition = cc.p(cc.winSize.width/2, 800);
        this._startPositionDelta = cc.p(40, 10);

        this._super();
        this._initPhysics();
        this.addAllCoin();
    },
    _initPhysics:function() {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -1200);
        this.space.sleepTimeThreshold = 0.5;

        var floorShape = new cp.SegmentShape(this.space.staticBody, cp.v(0, 0), cp.v(cc.winSize.width*2, 0), 0);
        floorShape.setElasticity(1);
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

        var forceVector = cc.pRotateByAngle(cc.p(0, force), cc.p(0,0), cc.degreesToRadians(rotate));

        var time = this._timeStart + (Math.random() * this._timeDelta);
        var x = this._startPosition.x + (-this._startPositionDelta.x + Math.random() * this._startPositionDelta.x * 2);
        var y = this._startPosition.y + (-this._startPositionDelta.y + Math.random() * this._startPositionDelta.y * 2);

        var coin = new CoinSprite(this.space);
        coin.setPosition(x, y);
        coin.setScale(startScale);
        coin._force = cp.v(forceVector.x, forceVector.y);
        coin._torque = torque;

        this.addChild(coin);
        coin.startWithDuration(time, endScale);


    },
    addAllCoin : function () {
        this.removeAllChildren();
        var n = 50 + Math.floor(Math.random()* 20);
        for(var i=0; i<n ;i++){
            this._addCoin();
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

var SlotFruitScene = IScene.extend({
    ctor: function () {
        this._super();


        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bg);

        this.initView();
        this.setTextHuThuong("1.000.000");
        this.setTextBet("10.000");
        this.setTextWin("10.000");
    },

    initView:function () {
        var thiz = this;
        var bgSlot =  new cc.Sprite("res/slot_bg.png");
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
            // thiz.backButtonHandler();
            // slotfui.stopSlotWithResuft();
            // slotfui.showLineWin();
            // thiz.setActiveBt(btnQuay,false);


            thiz.rotateRequest();
        });
        var btnAuto = new ccui.Button("slot_btnAuto.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnAuto.setPosition(cc.p(804,80));
        bgSlot.addChild(btnAuto);

        btnAuto.addClickEventListener(function () {
            for(var i = 0;i<20;i++){
                thiz.arrLine[i].setVisible(false);
                thiz.arrNum[i].visibleNew(false);
            }
            thiz.setActiveBt(thiz.btnQuay,true);
            slotfui.rotate();
        });

        var btn20Row = new ccui.Button("slot_btn_row.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn20Row.setPosition(cc.p(200,65));
        bgSlot.addChild(btn20Row);

        btn20Row.addClickEventListener(function () {

           // for(var i = 0; i < 2;i++){
           //     (function () {
           //         var inew = i;
           //         var coinNode = new CoinNode();
           //         setTimeout(function () {
           //             coinNode.show();
           //         }, inew*0.5);
           //     })();
           //
           // }

        });

        this.initLabel();

        var btnX2 = new ccui.Button("slot_btnX2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnX2.setPosition(cc.p(1060,150));
        bgSlot.addChild(btnX2);

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
            thiz.dup.setVisible(true);
        });

        this.initTopBar();
        this.initBetButtons();
        this.initLine();
        var dup = new DuplicateGold();
        thiz.addChild(dup,3);
        this.dup = dup;
        dup.setVisible(false);

        var selectLine = new SelectLine();
        this.addChild(selectLine);

    },
    rotateRequest:function () {
        this.slotfui.rotate();
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
        }
    },

    setTextHuThuong:function (value) {
        this.lblHu.setString("Hũ thưởng  "+ value);
        var posX =  290/2 - (this.lblHu.getContentSize().width/2 - this.txtHu.getContentSize().width);
        this.lblHu.setString(value);
        this.txtHu.setPosition(posX,this.txtHu.getPositionY());
        this.lblHu.setPosition(posX+2,this.txtHu.getPositionY());
    },
    setTextBet:function (value) {
        this.lblBet.setString("Cược: "+ value);
        var posX =  220/2 - (this.lblBet.getContentSize().width/2 - this.txtBet.getContentSize().width);
        this.lblBet.setString(value);
        this.txtBet.setPosition(posX,this.txtBet.getPositionY());
        this.lblBet.setPosition(posX+2,this.txtBet.getPositionY());
    },
    setTextWin:function (value) {
        this.lblWin.setString("Thắng: "+ value);
        var posX =  220/2 - (this.lblWin.getContentSize().width/2 - this.txtWin.getContentSize().width);
        this.lblWin.setString(value);
        this.txtWin.setPosition(posX,this.txtWin.getPositionY());
        this.lblWin.setPosition(posX+2,this.txtWin.getPositionY());
    },

    initLabel:function () {
        //hu thuong
        var bgHu = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        bgHu.setPreferredSize(cc.size(290, 46));
        bgHu.setPosition(cc.p(504,560));
        this.bgSlot.addChild(bgHu,100);

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

        var txtBet = new cc.LabelTTF("Cược:", cc.res.font.Roboto_Condensed,24);
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

        var lblWin = new cc.LabelTTF("10.000", cc.res.font.Roboto_CondensedBold,24);
        lblWin.setColor(cc.color(255,222,0,255));
        lblWin.setAnchorPoint(cc.p(0,0.5));
        lblWin.setPosition(102,23);
        bgWin.addChild(lblWin);
        this.lblWin = lblWin;

        var lblID = new cc.LabelTTF("ID: 112222211", cc.res.font.Roboto_CondensedBold,24);
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
                btnBet.setPosition(cc.p(-50,250 + i*121));
                btnBet.addClickEventListener(function () {
                    thiz.setlectButtonBet(inew);
                });
                thiz.bgSlot.addChild(btnBet);
                thiz.arrButBet.push(btnBet);
            })();

        }
        this.setlectButtonBet(0);
    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    },


    setlectButtonBet:function (index) {
        for(var i = 0; i< this.arrButBet.length;i++){
            var name = ((i==index)?"slot_bet_a":"slot_bet_d")+(i+1).toString()+".png";
            this.arrButBet[i].loadTextureNormal( name,ccui.Widget.PLIST_TEXTURE) ;
        }
    },
    initTopBar:function () {
        var backBt = new ccui.Button("ingame-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(54, 666);
        this.addChild(backBt);

        var settingBt = new ccui.Button("ingame-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setPosition(1220, backBt.y);
        settingBt.addClickEventListener(function () {
            var dialog = new SettingDialog();
            dialog.showWithAnimationMove();
        });
        this.addChild(settingBt);

        var hisBt = new ccui.Button("slot_btn_his.png", "", "", ccui.Widget.PLIST_TEXTURE);
        hisBt.setPosition(1120, backBt.y);
        hisBt.addClickEventListener(function () {
            var his = new HistoryFruit();
            his.show();
        });
        this.addChild(hisBt);

        var tutorialBt = new ccui.Button("slot_btn_tutorial.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialBt.setPosition(1020, backBt.y);
        tutorialBt.addClickEventListener(function () {

            var tutorialDialog = TutorialDialog.getTutorial(GameType.GAME_SLOT_FRUIT);
            tutorialDialog.show();
            SoundPlayer.playSound("mini_clickButton");
        });
        this.addChild(tutorialBt);
    },

    onFinishQuay:function () {


        var line = Math.floor(Math.random()*20);
        for(var i = 0;i<20;i++){
            this.arrLine[i].setVisible(i==line);
            this.arrNum[i].visibleNew(i==line);
        }
        this.slotfui.showLineWin(line);
    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    },

    initController: function () {
        this._controller = new SlotFruitController(this);
    }
});


