/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

MB_CHI_DAU = 0;
MB_CHI_GIUA = 1;
MB_CHI_CUOI = 2;

s_sfs_error_msg[212] = "Không phải lượt xếp bài";

var TimeOutMB = cc.Node.extend({
    ctor:function () {
        this._super();
        var bg = new cc.Sprite("#xocdia_timer_2.png");
        bg.setColor(cc.color(0,0,0,255));
        this.setContentSize(cc.size(800,800));

        bg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(bg);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        var timer = new cc.ProgressTimer(new cc.Sprite("#xocdia_timer_2.png"));
        timer.setColor(cc.color(255,201,15,255));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer.setPosition(bg.getPosition());
        timer.setPercentage(0.0);
        this.addChild(timer);
        this.timer = timer;

        var lbl = new cc.LabelTTF("",cc.res.font.Roboto_CondensedBold,50);
        lbl.setPosition(bg.getPosition());
        this.addChild(lbl);
        this.lblTime = lbl;
        this._timeCount = 0;
        this.isAlert = false;
        this.setVisible(false);
        // this.startCoutDown(10,80);

    },
    update:function (dt) {
        this._timeCount -=dt;
        if(this._timeCount < 0){
            this.stop();
        }
        else{

            this.lblTime.setString(Math.floor(this._timeCount));
            if(this._timeCount <= 5 && this.isAlert)
            {
                this.isAlert = false;
                this.lblTime.stopAllActions();
                this.timer.setColor(cc.color(255,0,0,255));
                this.lblTime.setColor(cc.color(255,0,0,255));
                this.lblTime.runAction(new cc.RepeatForever(
                    new cc.Sequence(
                        new cc.FadeTo(0.2,50),
                        new cc.FadeTo(0.2,255)
                    )
                ));
            }
        }
    },
    startCoutDown:function (timeRemain, timeMax) {

        if(timeMax==0){return};
        this.timer.setColor(cc.color(255,201,15,255));
        this.isAlert = true;
        this._timeCount = timeRemain;
        this.scheduleUpdate();
        this.setVisible(true);
        var thiz = this;
        this.lblTime.setColor(cc.color(255,255,255,255));
        this.timer.setPercentage(timeRemain*100/timeMax);
        this.timer.runAction(new cc.ProgressTo(timeRemain,0));

    },
    stop:function () {
        this.isAlert = false;
        this.unscheduleUpdate();
        this.stopAllActions();
        this.setVisible(false);
    }
    
});

var MauBinhCard = Card.extend({
    setSelected: null,
    isSelected: null,
    onTouchEnded: function (touch, event) {
        this.isTouched = false;

        if (this.isMoved) {
            this.getParent().performSwapCardInPoint(this, touch.getLocation());
            this.moveToOriginPosition();
            this.getParent().reorderChild(this, this.cardIndex);
        }
        else {
        }
    },
    onTouchMoved: function (touch, event) {
        var p = touch.getLocation();
        if (!this.isMoved) {
            if (cc.pDistance(this.preTouchPoint, p) < 5.0) {
                return;
            }
            else {
                this.getParent().reorderChild(this, 200);
                this.isMoved = true;
            }
        }

        this.x += p.x - this.preTouchPoint.x;
        this.y += p.y - this.preTouchPoint.y;
        this.preTouchPoint = p;
    }
});


var ListChiMB = cc.Node.extend({

    ctor: function (pos) {
        this._super();
        this.setContentSize(90 * 5, 115 * 3); // 5 columns, 3 rows
        this.cardList = [];
        this.setPosition(pos);

        this.resultLabels = [];
    },
    getCardsId: function () {
        var result = [];
        for (var i = 0; i < this.cardList.length; i++) {
            result.push(CardList.prototype.getCardIdWithRank(this.cardList[i].rank, this.cardList[i].suit));
        }
        return result;
    },
    removeAll: function () {
        this.removeAllChildren(true);
        this.cardList = [];
    },
    onEnter: function () {
        this._super();
        this.deckPoint = this.convertToNodeSpace(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
    },
    addCard: function (card,index) {
        if (this.deckPoint)
            card.setPosition(this.deckPoint);
        this.addChild(card,index);
    },
    dealCards: function (cards, isMe, animation) {
        this.removeAll();
        var rows = [];

        //split into rows
        if (cards && cards.length == 13) {
            for (var i = 0; i < 3; i++) {
                rows.push(cards.slice(i * 5, i * 5 + 5));
            }
        }

        //deal dem rows
        var index = 0;
        var dx = 50;
        var dy = 80;
        for (var i = 0; i < rows.length; i++) {
            var basex = 0 - (rows[i].length - 1) / 2 * dx ; // tan cung` ben trai
            var basey = dy * (i - 1);
            var lengt =  rows[i].length;
            for (var j = 0; j < rows[i].length; j++) {
                var cardObj = new MauBinhCard(rows[i][j].rank, rows[i][j].suit);
                cardObj.cardIndex = index;
                cardObj.origin = cc.p(basex + j * dx, basey);
                cardObj.origin.y -= Math.abs(j- Math.floor(lengt/2))*(8 + (Math.abs(j-Math.floor(lengt/2)) - 1)*8);
                cardObj.cardDistance = dx;
                cardObj.canTouch = false;
                var conerRotate = (j- Math.floor(lengt/2))*15;
                cardObj.setRotation(conerRotate);
                if (!isMe) {
                    cardObj.setSpriteFrame("gp_card_up.png");
                }
                this.cardList.push(cardObj);
                this.addCard(cardObj,3-i);

                if (animation) {
                    cardObj.visible = false;
                    var delayAction = new cc.DelayTime(0.02 * index);
                    var beforeAction = new cc.CallFunc(function (target) {
                        target.visible = true;
                    }, cardObj);
                    var moveAction = new cc.MoveTo(0.2, cardObj.origin);
                    var soundAction = new cc.CallFunc(function () {
                        if (isMe) {
                            SoundPlayer.playSound("chia_bai");
                        }
                    });
                    cardObj.runAction(new cc.Sequence(delayAction,soundAction, beforeAction, moveAction));
                } else {
                    cardObj.setPosition(cardObj.origin);
                }
                index++;
            }
        }

    },

    setNameChi:function (chi,typeChi) {
        this.removeChildByTag(1234);
        var bg_name = new cc.Sprite("#mb_bg_text1.png");
        bg_name.setScale(1.3);
        bg_name.setPosition(0,-160 + 80*chi);
        bg_name.setTag(1234);
        this.addChild(bg_name,1234);
        var nameChi = new cc.LabelTTF(maubinh_chitypes[typeChi],cc.res.font.Roboto_Condensed,30);
        nameChi.setPosition(bg_name.getContentSize().width/2, bg_name.getContentSize().height/2);
        bg_name.addChild(nameChi);


    },
    latChi:function (chi, arrCard, isReconnect,typeChi) {
        var cardArray = [];

                for (var i = 0; i < arrCard.length; i++) {
                    cardArray.push(CardList.prototype.getCardWithId(arrCard[i]));
                }

        if(this.cardList.length == 13){
            var  thiz = this;
            this.setNameChi(chi,typeChi);
            var zLocal1 = 3;
            var zLocal2 = 2;
            var zLocal3 = 1;
            if(chi == MB_CHI_GIUA){
                 zLocal1 = 2;
                 zLocal2 = 3;
            } else if(chi == MB_CHI_CUOI){
                 zLocal1 = 2;
                 zLocal2 = 1;
                 zLocal3 = 3;
            }
            for(var i =0; i < this.cardList.length; i++){
                if(i<5)//chi dau
                {
                    this.cardList[i].setLocalZOrder(zLocal1);
                }else if(i<10)
                {
                    this.cardList[i].setLocalZOrder(zLocal2);
                }
                else {
                    this.cardList[i].setLocalZOrder(zLocal3);
                }

            };

            for(var i = 0; i < cardArray.length; i++){
                (function () {
                    var card = thiz.cardList[chi*5+i];
                    // card.setLocalZOrder(1);
                    card.stopAllActions();
                    var orgScale = card.getScale();

                    var nameCard = cardArray[i].rank + s_card_suit[cardArray[i].suit] + ".png";
                    if(isReconnect){
                        var changeFrame = new cc.CallFunc(function () {
                            card.setSpriteFrame(nameCard);
                        });
                        var scale1 = new cc.ScaleTo(0.2,0,orgScale) ;
                        var scale2 = new cc.ScaleTo(0.2,orgScale,orgScale) ;
                        card.runAction(new cc.Sequence(scale1,changeFrame,scale2));
                    }
                    else{
                        card.setSpriteFrame(nameCard);
                    }

                })();


            };
        }
    },

});

var MauBinhCardList = cc.Node.extend({
    ctor: function (pos, displayResultRight) {
        this._super();
        this.setContentSize(90 * 5, 200 * 3); // 5 columns, 3 rows
        this.cardList = [];
        this.setPosition(pos);

        this.displayResultRight = displayResultRight;
        this.resultLabels = [];
    },

    addCard: function (card) {
        if (this.deckPoint)
            card.setPosition(this.deckPoint);
        this.addChild(card);
    },

    dealCards: function (cards, isMe, animation) {
        this.removeAll();
        if (isMe) {
            this.setScale(1.3);
        }
        var rows = [];

        //split into rows
        if (cards && cards.length == 13) {
            for (var i = 0; i < 3; i++) {
                rows.push(cards.slice(i * 5, i * 5 + 5));
            }
        }

        //deal dem rows
        var index = 0;
        var dx = 95;
        var dy = 125;
        for (var i = 0; i < rows.length; i++) {
            var basex = 0 - (rows[i].length - 1) / 2 * dx; // tan cung` ben trai
            var basey = dy * (i - 1);
            var dnew = (i==2)?dx:0;
            for (var j = 0; j < rows[i].length; j++) {
                var cardObj = new MauBinhCard(rows[i][j].rank, rows[i][j].suit);
                cardObj.cardIndex = index;
                cardObj.origin = cc.p(basex + j * dx - dnew, basey);
                cardObj.cardDistance = dx;
                cardObj.canTouch = isMe;
                if (!isMe) {
                    cardObj.setSpriteFrame("gp_card_up.png");
                }
                this.cardList.push(cardObj);
                this.addCard(cardObj);

                if (animation) {
                    cardObj.visible = false;
                    var delayAction = new cc.DelayTime(0.02 * index);
                    var beforeAction = new cc.CallFunc(function (target) {
                        target.visible = true;
                    }, cardObj);
                    var moveAction = new cc.MoveTo(0.2, cardObj.origin);
                    var soundAction = new cc.CallFunc(function () {
                        if (isMe) {
                            SoundPlayer.playSound("chia_bai");
                        }
                    });
                    cardObj.runAction(new cc.Sequence(delayAction, soundAction, beforeAction, moveAction));
                } else {
                    cardObj.setPosition(cardObj.origin);
                }
                index++;
            }
        }

        if (isMe)
            this.refreshChiType();
    },

    getChiType: function (cards) {
        var rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var suitFreq = [0, 0, 0, 0];

        var isSanh = false, isThung = false;
        var sanhRank = 0;

        for (var i = 0; i < cards.length; i++) {
            rankFreq[cards[i].rank]++;
            suitFreq[cards[i].suit]++;
        }

        //check thung sanh
        isThung = suitFreq.indexOf(cards.length) != -1;
        rankFreq[14] = rankFreq[1];
        if (cards.length == 5) {
            for (var i = 0; i <= 10; i++) {
                if (rankFreq[i] && rankFreq[i + 1] && rankFreq[i + 2]
                    && rankFreq[i + 3] && rankFreq[i + 4]) {
                    sanhRank = i;
                    isSanh = true;
                    break;
                }
            }
        } else if (cards.length == 3) {
            for (var i = 0; i <= 12; i++) {
                if (rankFreq[i] && rankFreq[i + 1] && rankFreq[i + 2]) {
                    sanhRank = i;
                    isSanh = true;
                    break;
                }
            }
        }
        rankFreq.splice(14, 1);

        //check loai chi tu cao xuong thap

        if (isSanh && isThung && sanhRank == 10 && cards.length == 5) {
            return 10; // sanh rong
        }

        if (isSanh && isThung && cards.length == 5) {
            return 9; // thung pha sanh
        }

        if (rankFreq.indexOf(4) != -1) {
            return 8; // tu quy
        }

        if (rankFreq.indexOf(3) != -1 && rankFreq.indexOf(2) != -1) {
            return 7; // cu lu
        }

        if (isThung) {
            return 6; // thung
        }

        if (isSanh) {
            return 5; // sanh
        }

        if (rankFreq.indexOf(3) != -1) {
            return 4; // xam chi
        }

        var index = rankFreq.indexOf(2);
        if (index != -1) {
            if (rankFreq.indexOf(2, index + 1) != -1) {
                return 3; // thu'
            }
            return 2;// doi
        }

        return 1; // mau thau
    },

    onEnter: function () {
        this._super();
        this.deckPoint = this.convertToNodeSpace(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
    },

    getCardsId: function () {
        var result = [];
        for (var i = 0; i < this.cardList.length; i++) {
            result.push(CardList.prototype.getCardIdWithRank(this.cardList[i].rank, this.cardList[i].suit));
        }
        return result;
    },
    removeAll: function () {
        this.removeAllChildren(true);
        this.cardList = [];
    },

    showResultChi: function (index, rankChi, duration) {
        if (this.resultLabels[index]) {
            this.resultLabels[index].removeFromParent(true);
            this.resultLabels[index] = undefined;
        }
        var resultLabel = new cc.LabelBMFont(maubinh_chitypes[rankChi], cc.res.font.Roboto_CondensedBold_30);
        // resultLabel.setScale(1 / this.getScale());
        resultLabel.setAnchorPoint(1,0.5);
        resultLabel.setColor(cc.color(255,238,92,255));
        resultLabel.setPosition(this.displayResultRight ? 500 : -250, (index - 1) * 115);
        this.addChild(resultLabel);
        if (duration) {
            var delayAction = new cc.DelayTime(duration);
            var removeAction = new cc.CallFunc(function (target) {
                target.removeFromParent(true);
            }, resultLabel);
            resultLabel.runAction(new cc.Sequence(delayAction, removeAction));
        } else {
            this.resultLabels[index] = resultLabel;
        }
    },

    showThangTrang: function (winType, duration) {
        var thangTrangLabel = new cc.LabelBMFont(maubinh_wintypes[winType], cc.res.font.Roboto_CondensedBold_40);
        thangTrangLabel.setScale(2);
        thangTrangLabel.setColor(cc.color("#ff0000"));

        this.addChild(thangTrangLabel, 420);
        if (duration) {
            var delayAction = new cc.DelayTime(duration);
            var removeAction = new cc.CallFunc(function (target) {
                target.removeFromParent(true);
            }, thangTrangLabel);
        }
    },

    swapCard: function (card1, card2) {
        var _origin = card1.origin;
        var _cardIndex = card1.cardIndex;

        card1.origin = card2.origin;
        card1.cardIndex = card2.cardIndex;

        card2.origin = _origin;
        card2.cardIndex = _cardIndex;

        // card1.moveToOriginPosition();
        card2.moveToOriginPosition();

        this.cardList[card1.cardIndex] = card1;
        this.cardList[card2.cardIndex] = card2;
    },

    performSwapCardInPoint: function (card, touchPoint) {
        for (var i = 0; i < this.cardList.length; i++) {
            var destCard = this.cardList[i];
            if (cc.rectContainsPoint(destCard.touchRect, destCard.convertToNodeSpace(touchPoint))) {
                //source card
                if (destCard === card) {
                    continue;
                }

                //swap card
                this.swapCard(card, destCard);
                break;
            }
        }

        this.refreshChiType();
    },

    refreshChiType: function () {
        for (var i = 0; i < 3; i++) {
            var subCards = this.cardList.slice(i * 5, i * 5 + 5);
            var rankChi = this.getChiType(subCards);
            this.showResultChi(i, rankChi);
        }
    },

    revealCards: function (cardArray) {
        for (var i = 0; i < this.cardList.length; i++) {
            var card = cardArray[i];
            if (!this.cardList[i]) {
                cc.log("Clgv deo hieu sao");
                continue;
            }
            this.cardList[i].setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
        }
    },

    revealChi: function (index, cardArray, rankChi) {
        for (var i = 0; i < cardArray.length; i++) {
            var card = CardList.prototype.getCardWithId(cardArray[i]);
            this.cardList[index * 5 + i].setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
        }
        this.showResultChi(index, rankChi, 5);
    },

    setArrangeEnable: function (enabled) {
        this.setScale(enabled ? 1 : 0.8);
        this.setPositionY(enabled ? 200 : 150);
        for (var i = 0; i < this.cardList.length; i++) {
            this.cardList[i].canTouch = enabled;
            this.cardList[i].setOpacity(enabled ? 255 : 200);
        }
        for (var j = 0; j < 3; j++) {
            if (this.resultLabels[i])
                this.resultLabels[i].setScale(1 / this.getScale());
        }
    }
});

var MauBinh = IGameScene.extend({
    ctor: function () {
        this._super();
        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        table_bg.setScale(cc.winSize.screenScale);
        this.table_bg = table_bg;
        this.sceneLayer.addChild(table_bg);

        this.initScene();

        this.initPlayer();

        this.initButton();
        var thiz = this;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(2),
            new cc.CallFunc(function () {
                var cardArray = [];

                var cards = [1,2,3,4,5,6,7,8,9,10,11,12,13];
                for (var i = 0; i < cards.length; i++) {
                    cardArray.push(CardList.prototype.getCardWithId(cards[i]));
                }
               for (var j = 0; j < thiz.playerView.length; j++) {
                thiz.playerView[j].infoLayer.setVisible(true);

                    thiz.playerView[j].cardList.dealCards(cardArray, j==0, true);
               }
            }),
            new cc.DelayTime(2),
            new cc.CallFunc(function () {
                var cardArray = [];

                var cards = [1,2,3,4,5];
                // for (var i = 0; i < cards.length; i++) {
                //     cardArray.push(CardList.prototype.getCardWithId(cards[i]));
                // }
                thiz.playerView[1].cardList.latChi(MB_CHI_CUOI,cards,true,3);
            })
        ));


    },


    initScene: function () {
        var huThuongBg = new ccui.Scale9Sprite("bacayhuthuong_bg.png", cc.rect(15, 15, 4, 4));
        huThuongBg.setPreferredSize(cc.size(322, 47));
        huThuongBg.setPosition(this.table_bg.getContentSize().width / 2, 100);
        this.table_bg.addChild(huThuongBg);

        var huThuongLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "HŨ MẬU BINH: ");
        huThuongLabel.setPosition(huThuongBg.x - 75, huThuongBg.y);
        huThuongLabel.setColor(cc.color("#c1ceff"));
        this.table_bg.addChild(huThuongLabel);

        var huThuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
        huThuongValueLabel.setPosition(huThuongBg.x + 60, huThuongBg.y);
        huThuongValueLabel.setColor(cc.color("#ffde00"));
        this.table_bg.addChild(huThuongValueLabel);
        this.huThuongValueLabel = huThuongValueLabel;

        // var timeLabel = new cc.LabelBMFont("", cc.res.font.Roboto_BoldCondensed_36_Glow);
        // timeLabel.setPosition(huThuongBg.x, huThuongBg.y - 100);
        // timeLabel.setScale(2.0);
        // this.table_bg.addChild(timeLabel);
        // this.timeLabel = timeLabel;


        var timeOutGame = new TimeOutMB();
        timeOutGame.setScale(0.6);
        timeOutGame.setPosition( this.table_bg.getContentSize().width/2,this.table_bg.getContentSize().height/2  );
        this.table_bg.addChild(timeOutGame);
        this.timeOutGame = timeOutGame;

        // var chatBt = new ccui.Button("ingame-chatBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // chatBt.setPosition(1120, 653);
        // this.gameTopBar.addChild(chatBt);
        // var thiz = this;
        // chatBt.addClickEventListener(function () {
        //     var dialog = new ChatDialog();
        //     dialog.onTouchMessage = function (message) {
        //         thiz.sendChatMessage(message);
        //     };
        //     dialog.show();
        // });


    },
    initLayerArrangement:function () {
        var nodeArrange = new cc.Node();
        nodeArrange.setContentSize(cc.size(1024,720));
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,150),1280,720);
        nodeArrange.addChild(layerBlack);
        this.arrangeLayer = nodeArrange;
        this.addChild(nodeArrange);


        //touch
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(nodeArrange.visible){
                    return true;
                }
                return false;
            },

            onTouchEnded : function (touch, event) {
            }
        }, this);

        var listCardMe = new MauBinhCardList(cc.p(732-44, 250));
        this.listCardMe = listCardMe;
        nodeArrange.addChild(listCardMe);
        nodeArrange.setVisible(false);
        // listCardMe.setScale(5);
        //         var cardArray = [];
        //         var cards = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        //         for (var i = 0; i < cards.length; i++) {
        //             cardArray.push(CardList.prototype.getCardWithId(cards[i]));
        //         }
        //
        // listCardMe.dealCards(cardArray, true, false);
        //
        //
        var timeOutMe = new TimeOutMB();
        timeOutMe.setPosition(860,450)
        nodeArrange.addChild(timeOutMe);
        this.timeOutMe = timeOutMe;
    },
    initPlayer: function () {
        var playerMe = new GamePlayer();
        playerMe.setPosition(this.table_bg.getContentSize().width/2 - 120, -110);
        playerMe.cardList = new ListChiMB(cc.p(240, 140));
        playerMe.setPositionInfo(PL_POSITION_LEFT);

        playerMe.cardList.setScale(0.7);
        playerMe.infoLayer.addChild(playerMe.cardList, 2);
        this.table_bg.addChild(playerMe, 1);

        var player1 = new GamePlayer();
        player1.setPosition(this.table_bg.getContentSize().width/2 + 500 / cc.winSize.screenScale, this.table_bg.getContentSize().height/2);
        player1.cardList = new ListChiMB(cc.p(-80, 150));
        player1.inviteBt.setPosition(player1.inviteBt.getPositionX()-30,player1.inviteBt.getPositionY());
        player1.setPositionInfo(PL_POSITION_BOTTOM);
        player1.cardList.setScale(0.7);
        player1.infoLayer.addChild(player1.cardList, 2);
        this.table_bg.addChild(player1, 1);

        var player2 = new GamePlayer();
        player2.setPosition(this.table_bg.getContentSize().width / 2 - 120, this.table_bg.getContentSize().height +25);
        player2.cardList = new ListChiMB(cc.p(240,100));
        player2.inviteBt.setPosition(player2.inviteBt.getPositionX()+110,player2.inviteBt.getPositionY());

        player2.setPositionInfo(PL_POSITION_LEFT);
        player2.cardList.setScale(0.7);
        player2.infoLayer.addChild(player2.cardList, 2);
        this.table_bg.addChild(player2, 1);

        var player3 = new GamePlayer();
        player3.setPosition(this.table_bg.getContentSize().width/2 - 500, this.table_bg.getContentSize().height/2);
        player3.setPositionInfo(PL_POSITION_BOTTOM);
        player3.inviteBt.setPosition(player3.inviteBt.getPositionX()+30,player3.inviteBt.getPositionY());

        player3.cardList = new ListChiMB(cc.p(240,150 ));
        player3.cardList.setScale(0.7);
        player3.cardList.displayResultRight = true;
        player3.infoLayer.addChild(player3.cardList, 2);
        this.table_bg.addChild(player3, 1);

        this.playerView = [playerMe, player1, player2, player3];
    },

    showNodeArrangement:function (isVisible) {
        this.arrangeLayer.setVisible(isVisible);
        this.timeOutGame.setVisible(!isVisible);
        this.allSlot[0].setVisible(!isVisible);
    },

    initButton: function () {


        var startBt = new ccui.Button("game-startBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(cc.winSize.width - 110,55);
        this.startBt = startBt;
        this.sceneLayer.addChild(startBt);

        this.initLayerArrangement();

        var xongBt = new ccui.Button("game-xongBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        xongBt.setPosition(1170, 46);
        this.xongBt = xongBt;
        this.arrangeLayer.addChild(xongBt);

        var xepLaiBt = new ccui.Button("game-xepbaiBt", "", "", ccui.Widget.PLIST_TEXTURE);
        xepLaiBt.setPosition(cc.winSize.width - 100, 50+70);
        this.xepLaiBt = xepLaiBt;

        var thiz = this;

        startBt.addClickEventListener(function () {
            thiz._controller.sendStartRequest();
        });

        xongBt.addClickEventListener(function () {

            thiz.xepBaiXong();
        });

        xepLaiBt.addClickEventListener(function () {
            thiz._controller.sendXepBaiLai();
        });

        // this.setIngameButtonVisible(false);
        // this.setStartBtVisible(false);

        this.allButtons = [xepLaiBt, xongBt, startBt];
        xongBt.setVisible(true);
    },

    initController: function () {
        this._controller = new MauBinhController(this);
    },

    xepBaiXong: function () {
        var cards = [];
        this.showNodeArrangement(false);
        var cardArray = [];
        var cardIDMe = this.listCardMe.getCardsId();
        for (var i = 0; i < cardIDMe.length; i++) {
            cardArray.push(CardList.prototype.getCardWithId(cardIDMe[i]));
        }
        this.allSlot[0].cardList.dealCards(cardArray,true,false);
        this._controller.sendXepBaiXong(cardIDMe);
    },

    setIngameButtonVisible: function (visible) {

        this.xongBt.visible = visible;
    },

    setStartBtVisible: function (visible) {
        this.startBt.visible = visible;
    },

    showTimeRemaining: function (timeRemaining) {
        // if (timeRemaining > 0) {
        //     this.timeRemaining = timeRemaining;
        //     if (this.timeInterval) {
        //         clearInterval(this.timeInterval)
        //     }
        //     var thiz = this;
        //     thiz.timeLabel.setString(timeRemaining);
        //     thiz.timeRemaining--;
        //     this.timeInterval = setInterval(function () {
        //         if (thiz.timeRemaining <= 0) {
        //             thiz.timeLabel.setString("");
        //             clearInterval(thiz.timeInterval);
        //         } else {
        //             thiz.timeLabel.setString(thiz.timeRemaining);
        //             thiz.timeRemaining--;
        //         }
        //     }, 1000);
        // } else {
        //     this.timeLabel.setString("");
        //     this.timeRemaining = null;
        // }
        this.timeOutMe.startCoutDown(timeRemaining,timeRemaining);
        this.timeOutGame.startCoutDown(timeRemaining,timeRemaining);
    },

    onTimeOut: function () {

        this.showNodeArrangement(false);
        this.timeOutMe.stop();
        this.timeOutGame.stop();
        for (var  i = 0; i < this.allSlot.length; i++){
            this.allSlot[i].stopAllActions();
        }
    },
    performDealCards: function (cards, animation) {
        var thiz = this;
        if (this.cleanTimeout) {
            clearTimeout(this.cleanTimeout);
            this.cleanTimeout = null;
        }
        var cardArray = [];
        for (var i = 0; i < cards.length; i++) {
            cardArray.push(CardList.prototype.getCardWithId(cards[i]));
        }
        this.listCardMe.dealCards(cardArray,true,false);

        for (var j = 0; j < this.playerView.length; j++) {
            this.playerView[j].cardList.dealCards(cardArray, j == 0, animation);
        }
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.5),
            new cc.CallFunc(function () {
                thiz.showNodeArrangement(true);
            })
        ))
    },

    hideAllButton: function () {
        this.allButtons.forEach(function (item, index) {
           item.setVisible(false);
        })
    },

    onUserXepBaiStatus: function (username, isDone) {
        if(isDone){
            if(username == PlayerMe.username){
               this.xepLaiBt.setVisible(true);
                this.showNodeArrangement(false);
            }else {

            }
        }
        else{
            if(username == PlayerMe.username){
                this.xepLaiBt.setVisible(false);
                this.showNodeArrangement(true);
            }else {

            }
        }


    },
    performAnnounce: function (username, announceStr) {

    },
    performRevealCard: function (username, cardArray, winType, exMoney, delay) {
        var thiz = this;
        setTimeout(function () {
            var slot = thiz.getSlotByUsername(username);
            var cardObjects = [];
            for (var i = 0; i < cardArray.length; i++) {
                cardObjects.push(CardList.prototype.getCardWithId(cardArray[i]));
            }
            if (username != PlayerMe.username) {
                slot.cardList.revealCards(cardObjects);
            }
            slot.cardList.showThangTrang(winType, 5);
        }, delay);

    },
    performSoChi: function (username, index, rankChi, exMoney, cardArray,moneyPlayer,txtSap) {
        cc.log("=========" + username);
        var thiz = this;
        // setTimeout(function () {
            var slot = thiz.getSlotByUsername(username);
        if(slot){

            slot.cardList.latChi(index, cardArray,true, rankChi);
            thiz.showMoneyChange(slot.getPosition(), exMoney);
        }
          //  if (username == PlayerMe.username) {
         //       slot.cardList.showResultChi(index, rankChi, 5);
         //   } else {

        //    }

        // }, delay);
    },
    performSummaryChange: function (username, winType, exMoney, delay) {
        var thiz = this;
        setTimeout(function () {
            cc.log("User " + username + "  " + maubinh_wintypes[winType] + "\nchangeGold : " + exMoney);
        }, delay);
    },

    addResultEntry: function (username, winType, soChiWin, cards, newMoney, moneyChange) {
        if (!this.resultEntries) {
            this.resultEntries = [];
        }
        this.resultEntries.push({
            username: username, winType: winType, soChiWin: soChiWin,
            newMoney: newMoney, moneyChange: moneyChange, cards: cards
        });
    },

    performShowResult: function (delay) {

        var thiz = this;
        setTimeout(function () {
            if (!thiz.resultEntries.length) {
                cc.log("No result entry found");
                return;
            }

            var dialog = new ResultDialog(thiz.resultEntries.length);
            for (var i = 0; i < thiz.resultEntries.length; i++) {
                var username = thiz.resultEntries[i].username;
                if (username.length > 3 && (username != PlayerMe.username)) {
                    username = username.substring(0, username.length - 3) + "***";
                }
                dialog.userLabel[i].setString(username);

                var goldStr = thiz.resultEntries[i].moneyChange >= 0 ? "+" : "-";
                goldStr += (cc.Global.NumberFormat1(Math.abs(thiz.resultEntries[i].moneyChange)) + " V");
                dialog.goldLabel[i].setString(goldStr);
                dialog.goldLabel[i].setColor(thiz.resultEntries[i].moneyChange >= 0 ?
                    cc.color("#ffde00") : cc.color("#ff0000"));

                if (thiz.resultEntries[i].soChiWin) {
                    var sochi = thiz.resultEntries[i].soChiWin;
                    if (sochi > 0)
                        dialog.contentLabel[i].setString("Thắng " + sochi + " chi");
                    else
                        dialog.contentLabel[i].setString("Thua " + (-sochi) + " chi");
                }
                else {
                    dialog.contentLabel[i].setString(maubinh_wintypes[thiz.resultEntries[i].winType]);
                }

                for (var j = 0; j < thiz.resultEntries[i].cards.length; j++) {
                    var cardData = CardList.prototype.getCardWithId(thiz.resultEntries[i].cards[j]);
                    var card = new Card(cardData.rank, cardData.suit);
                    dialog.cardList[i].addCard(card);
                }

                dialog.cardList[i].reOrderWithoutAnimation();

                thiz.performAssetChange(thiz.resultEntries[i].moneyChange,null,thiz.resultEntries[i].username);
            }

            dialog.show();

            thiz.resultEntries = [];
        }, delay);
    },



    cleanBoard: function (delay) {
        var thiz = this;
        delay = delay || 1;
        this.cleanTimeout = setTimeout(function () {
            for (var i = 0; i < thiz.playerView.length; i++) {
                thiz.playerView[i].cardList.removeAll();
            }
        }, delay);
    },

    showMoneyChange: function (pos, amount) {
        var lol = parseInt(amount);
        var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        var changeText = cc.Global.NumberFormat1(lol);
        changeSprite.setString(changeText);
        changeSprite.setColor(cc.color(amount >= 0 ? "#ffde00" : "#ff0000"));
        changeSprite.setPosition(pos);
        this.table_bg.addChild(changeSprite, 420);

        changeSprite.runAction(new cc.Sequence(new cc.MoveTo(2.0, cc.p(pos.x, pos.y + 100)), new cc.CallFunc(function () {
            changeSprite.removeFromParent(true);
        })));
    }
});