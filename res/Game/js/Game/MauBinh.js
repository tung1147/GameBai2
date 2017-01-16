/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

s_sfs_error_msg[212] = "Không phải lượt xếp bài";

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

var MauBinhCardList = cc.Node.extend({
    ctor: function (pos, displayResultRight) {
        this._super();
        this.setContentSize(90 * 5, 115 * 3); // 5 columns, 3 rows
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
            this.setScale(1);
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
        var dx = 88;
        var dy = 115;
        for (var i = 0; i < rows.length; i++) {
            var basex = 0 - (rows[i].length - 1) / 2 * dx; // tan cung` ben trai
            var basey = dy * (i - 1);

            for (var j = 0; j < rows[i].length; j++) {
                var cardObj = new MauBinhCard(rows[i][j].rank, rows[i][j].suit);
                cardObj.cardIndex = index;
                cardObj.origin = cc.p(basex + j * dx, basey);
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
        resultLabel.setScale(1 / this.getScale());
        resultLabel.setPosition(this.displayResultRight ? 300 : -300, (index - 1) * 115);
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
        this.sceneLayer.addChild(table_bg);

        this.initScene();

        this.initPlayer();
        this.initButton();

    },


    initScene: function () {
        var huThuongBg = ccui.Scale9Sprite.createWithSpriteFrameName("bacayhuthuong_bg.png", cc.rect(15, 15, 4, 4));
        huThuongBg.setPreferredSize(cc.size(322, 47));
        huThuongBg.setPosition(cc.winSize.width / 2, 525);
        this.sceneLayer.addChild(huThuongBg);

        var huThuongLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "HŨ MẬU BINH: ");
        huThuongLabel.setPosition(huThuongBg.x - 75, huThuongBg.y);
        huThuongLabel.setColor(cc.color("#c1ceff"));
        this.sceneLayer.addChild(huThuongLabel);

        var huThuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
        huThuongValueLabel.setPosition(huThuongBg.x + 60, huThuongBg.y);
        huThuongValueLabel.setColor(cc.color("#ffde00"));
        this.sceneLayer.addChild(huThuongValueLabel);
        this.huThuongValueLabel = huThuongValueLabel;

        var timeLabel = new cc.LabelBMFont("", cc.res.font.Roboto_BoldCondensed_36_Glow);
        timeLabel.setPosition(huThuongBg.x, huThuongBg.y - 100);
        timeLabel.setScale(2.0);
        this.sceneLayer.addChild(timeLabel);
        this.timeLabel = timeLabel;

        var chatBt = new ccui.Button("ingame-chatBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        chatBt.setPosition(1120, 653);
        this.gameTopBar.addChild(chatBt);
        var thiz = this;
        chatBt.addClickEventListener(function () {
            var dialog = new ChatDialog();
            dialog.onTouchMessage = function (message) {
                thiz.sendChatMessage(message);
            };
            dialog.show();
        });
    },

    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50);
        playerMe.cardList = new MauBinhCardList(cc.p(cc.winSize.width / 2, 200));
        this.sceneLayer.addChild(playerMe.cardList, 2);
        this.sceneLayer.addChild(playerMe, 1);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120 / cc.winSize.screenScale, 360);
        player1.cardList = new MauBinhCardList(cc.p(-80, 150));
        player1.cardList.setScale(0.5);
        player1.infoLayer.addChild(player1.cardList, 2);
        this.sceneLayer.addChild(player1, 1);

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width / 2, 650);
        player2.cardList = new MauBinhCardList(cc.p(-120,80));
        player2.cardList.setScale(0.5);
        player2.infoLayer.addChild(player2.cardList, 2);
        this.sceneLayer.addChild(player2, 1);

        var player3 = new GamePlayer();
        player3.setPosition(120 * cc.winSize.screenScale, 360);
        player3.cardList = new MauBinhCardList(cc.p(240, 150));
        player3.cardList.setScale(0.5);
        player3.cardList.displayResultRight = true;
        player3.infoLayer.addChild(player3.cardList, 2);
        this.sceneLayer.addChild(player3, 1);

        this.playerView = [playerMe, player1, player2, player3];
    },

    initButton: function () {
        var xepbaiBt = new ccui.Button("game-xepbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        xepbaiBt.setPosition(cc.winSize.width - 110, 50);
        this.xepbaiBt = xepbaiBt;
        this.sceneLayer.addChild(xepbaiBt);

        var xongBt = new ccui.Button("game-xongBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        xongBt.setPosition(cc.winSize.width - 310, 50);
        this.xongBt = xongBt;
        this.sceneLayer.addChild(xongBt);

        var startBt = new ccui.Button("game-startBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(xepbaiBt.getPosition());
        this.startBt = startBt;
        this.sceneLayer.addChild(startBt);

        var thiz = this;

        startBt.addClickEventListener(function () {
            thiz._controller.sendStartRequest();
        });

        xongBt.addClickEventListener(function () {
            thiz.xepBaiXong();
        });

        xepbaiBt.addClickEventListener(function () {
            thiz._controller.sendXepBaiLai();
        });

        this.setIngameButtonVisible(false);
        this.setStartBtVisible(false);

        this.allButtons = [xepbaiBt, xongBt, startBt];
    },

    initController: function () {
        this._controller = new MauBinhController(this);
    },

    xepBaiXong: function () {
        var cards = [];
        this._controller.sendXepBaiXong(this.playerView[0].cardList.getCardsId());
    },

    setIngameButtonVisible: function (visible) {
        this.xepbaiBt.visible = visible;
        this.xongBt.visible = visible;
    },

    setStartBtVisible: function (visible) {
        this.startBt.visible = visible;
    },

    showTimeRemaining: function (timeRemaining) {
        if (timeRemaining > 0) {
            this.timeRemaining = timeRemaining;
            if (this.timeInterval) {
                clearInterval(this.timeInterval)
            }
            var thiz = this;
            thiz.timeLabel.setString(timeRemaining);
            thiz.timeRemaining--;
            this.timeInterval = setInterval(function () {
                if (thiz.timeRemaining <= 0) {
                    thiz.timeLabel.setString("");
                    clearInterval(thiz.timeInterval);
                } else {
                    thiz.timeLabel.setString(thiz.timeRemaining);
                    thiz.timeRemaining--;
                }
            }, 1000);
        } else {
            this.timeLabel.setString("");
            this.timeRemaining = null;
        }
    },

    onTimeOut: function () {

    },
    performDealCards: function (cards, animation) {
        if (this.cleanTimeout) {
            clearTimeout(this.cleanTimeout);
            this.cleanTimeout = null;
        }
        var cardArray = [];
        for (var i = 0; i < cards.length; i++) {
            cardArray.push(CardList.prototype.getCardWithId(cards[i]));
        }
        for (var j = 0; j < this.playerView.length; j++) {
            this.playerView[j].cardList.dealCards(cardArray, j == 0, animation);
        }
    },

    hideAllButton: function () {
        this.allButtons.forEach(function (item, index) {
            item.setVisible(false);
        })
    },

    onUserXepBaiStatus: function (username, isDone) {

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
    performSoChi: function (username, index, rankChi, exMoney, cardArray, delay) {
        var thiz = this;
        setTimeout(function () {
            var slot = thiz.getSlotByUsername(username);
            if (username == PlayerMe.username) {
                slot.cardList.showResultChi(index, rankChi, 5);
            } else {
                slot.cardList.revealChi(index, cardArray, rankChi);
            }
            thiz.showMoneyChange(slot.getPosition(), exMoney);
        }, delay);
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
            }

            dialog.showWithAnimationMove();

            thiz.resultEntries = [];
        }, delay);
    },

    setArrangeEnable: function (enabled) {
        this.playerView[0].cardList.setArrangeEnable(enabled);
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
        var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        var changeText = (amount >= 0 ? "+" : "") + amount;
        changeSprite.setString(changeText);
        changeSprite.setColor(cc.color(amount >= 0 ? "#ffde00" : "#ff0000"));
        changeSprite.setPosition(pos);
        this.addChild(changeSprite, 420);

        changeSprite.runAction(new cc.Sequence(new cc.MoveTo(2.0, cc.p(pos.x, pos.y + 100)), new cc.CallFunc(function () {
            changeSprite.removeFromParent(true);
        })));
    }
});