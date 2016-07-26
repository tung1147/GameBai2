/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

var CardSuit = CardSuit || {};
CardSuit.Hearts = "c";
CardSuit.Diamonds = "r";
CardSuit.Clubs = "t";
CardSuit.Spades = "b";

var Card = cc.Sprite.extend({
    ctor : function (rank, suit) {
        this.canTouch = true;
        this.rank = rank;
        this.suit = suit;
        this._super("#"+rank + suit +".png");
        this.touchRect = cc.rect(0,0,this.getContentSize().width, this.getContentSize().height);
        this.cardDistance = this.getContentSize().width;

        this.origin = cc.p();
        this.isTouched = false;
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            },
            onTouchEnded : function (touch, event) {
                thiz.onTouchEnded(touch, event);
            },
            onTouchMoved :  function (touch, event){
                thiz.onTouchMoved(touch, event);
            }
        }, this);
    },
    moveToOriginPosition : function () {
        if(!this.isTouched){
            this.stopAllActions();
            var thiz = this;
            var beforeMove = new cc.CallFunc(function () {
                thiz.getParent().reorderChild(thiz, thiz.cardIndex + 100);
            });
            var afterMove = new cc.CallFunc(function () {
                thiz.getParent().reorderChild(thiz, thiz.cardIndex);
            });
            var move = new cc.MoveTo(0.1, cc.p(this.origin.x, this.origin.y));
            this.runAction(new cc.Sequence(beforeMove,move,afterMove));
        }
    },
    setSelected : function (selected) {
        if(selected){
            this.y = this.origin.y + 50;
        }
        else {
            this.y = this.origin.y;
        }
    },
    isSelected : function () {
        return (this.x > this.origin.y);
    },
    onTouchBegan : function (touch, event) {
        if(this.canTouch && !this.isTouched){
            var p = this.convertToNodeSpace(touch.getLocation());
           // var rect = this.getBoundingBox();
            if(cc.rectContainsPoint(this.touchRect, p)){
                this.isTouched = true;
                this.isMoved = false;
                this.preTouchPoint = touch.getLocation();
                return true;
            }
        }
        return false;
    },
    onTouchEnded : function (touch, event) {
        this.isTouched = false;

        if(this.isMoved){
            this.moveToOriginPosition();
            this.getParent().reorderChild(this, this.cardIndex);
        }
        else{
            if(this.y > this.origin.y){
                this.y = this.origin.y;
            }
            else{
                this.y = this.origin.y + 50.0;
            }
        }
    },
    onTouchMoved : function (touch, event) {
        var p = touch.getLocation();
        if(!this.isMoved){
            if(cc.pDistance(this.preTouchPoint, p) < 5.0){
                return;
            }
            else{
                this.getParent().reorderChild(this, 200);
                this.isMoved = true;
            }
        }

        this.x += p.x - this.preTouchPoint.x;
        this.y += p.y - this.preTouchPoint.y;
        this.preTouchPoint = p;

        var dx = this.x - this.origin.x;
        if(Math.abs(dx) > this.cardDistance){
            if(dx > 0){
                this.getParent().swapCardRight(this.cardIndex);
            }
            else{
                this.getParent().swapCardLeft(this.cardIndex);
            }
        }
    }
});

var CardList = cc.Node.extend({
    ctor : function (size) {
        this.canTouch = true;

        this._super();
        this.cardList = [];
        this.setContentSize(size);
        this.setAnchorPoint(cc.p(0.5,0.5));
    },
    reOrder : function () {
        if(this.cardList.length > 0){
            var width = this.cardSize.width * this.cardList.length;
            if(width > this.getContentSize().width){
                width = this.getContentSize().width;
            }
            var dx = width / this.cardList.length;
            var x = this.getContentSize().width/2 - width/2 + dx/2;
            var y = this.getContentSize().height/2;
            for(var i=0;i<this.cardList.length;i++){
                var card = this.cardList[i];
                card.origin = cc.p(x, y);
                card.cardIndex = i;
                card.cardDistance = dx;
                this.reorderChild(card, i);
                card.moveToOriginPosition();
                x += dx;
            }
        }
    },
    onEnter : function () {
        this._super();
        this.deckPoint = this.convertToNodeSpace(cc.p(cc.winSize.width/2, cc.winSize.height/2));
    },
    addCard : function (card) {
        if(!this.cardSize){
            this.cardSize = card.getContentSize();
        }
        card.cardIndex = this.cardList.length;
        card.origin = cc.p(0, 0);
        card.canTouch = this.canTouch;
        this.addChild(card, this.cardList.length);
        this.cardList.push(card);
    },
    setTouchEnable : function (touch) {
        this.canTouch = touch;
        for(var i=0;i<this.cardList.length;i++) {
            this.cardList[i].canTouch = this.canTouch;
        }
    },
    dealCards : function (cards) {
        this.removeAll();
        for(var i=0;i<cards.length;i++){
            var card = new Card(cards[i].rank, cards[i].suit);
            card.setPosition(this.deckPoint);
            this.addCard(card);
        }

        var width = this.cardSize.width * this.cardList.length;
        if(width > this.getContentSize().width){
            width = this.getContentSize().width;
        }
        var dx = width / this.cardList.length;
        var x = this.getContentSize().width/2 - width/2 + dx/2;
        var y = this.getContentSize().height/2;
        for(var i=0;i<this.cardList.length;i++){
            this.reorderChild(this.cardList[i], i);
            var card = this.cardList[i];
            card.origin = cc.p(x, y);
            card.cardDistance = dx;
            card.visible = false;
            var delayAction = new cc.DelayTime(0.02 * i);
            var beforeAction = new cc.CallFunc(function (target) {
                target.visible = true;
            }, card);
            var moveAction = new cc.MoveTo(0.2, cc.p(x, y));
            card.runAction(new cc.Sequence(delayAction, beforeAction, moveAction));
            x += dx;
        }
    },
    containsWithCard : function (card) {
        var cardRect = card.getCardBounding();

        for(var i=0;i<this.cardList.length;i++){
            if(this.cardList[i] != card){
                var rect = this.cardList[i].getCardBounding();
                if(cc.rectIntersectsRect(cardRect, rect)){
                    return this.cardList[i];
                }
            }
        }
        return null;
    },
    swapCardLeft : function (index) {
        if(index > 0){
            var cardMove = this.cardList[index];
            var cardSwap = this.cardList[index-1];
            this.swapCard(cardMove, cardSwap);
        }
    },
    swapCardRight : function (index) {
        if(index < this.cardList.length - 1){
            var cardMove = this.cardList[index];
            var cardSwap = this.cardList[index+1];
            this.swapCard(cardMove, cardSwap);
        }
    },
    swapCard : function (card1, card2) {
        var _origin = card1.origin;
        var _cardIndex = card1.cardIndex;

        card1.origin = card2.origin;
        card1.cardIndex = card2.cardIndex;

        card2.origin = _origin;
        card2.cardIndex = _cardIndex;

        card1.moveToOriginPosition();
        card2.moveToOriginPosition();

        this.cardList[card1.cardIndex] = card1;
        this.cardList[card2.cardIndex] = card2;
    },
    removeCard : function (card) {
        for(var i=0;i<cards.length;i++){
            if(this.cardList[i] == card){
                this.removeCardAtIndex(i);
                return;
            }
        }
    },
    removeCardAtIndex : function (index) {
        var card = this.cardList[index];
        this.removeChild(card);
        this.cardList.splice(index, 1);
    },
    removeCardWithRank : function (rank,suit) {
        
    },
    removeAll : function () {
        this.removeAllChildren(true);
        this.cardList = [];
    },
    getCardAtIndex : function (index) {
        return this.cardList[index];
    },
    getCardByRank : function (rank, suit) {

    },
    getCardSelected : function () {
        var cardSelected = [];
        for(var i=0;i<this.cardList.length;i++){
            if(this.cardList[i].isSelected()){
                cardSelected.push(this.cardList[i]);
            }
        }
        return cardSelected;
    }
});