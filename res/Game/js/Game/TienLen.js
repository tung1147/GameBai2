/**
 * Created by Quyet Nguyen on 7/21/2016.
 */

var TienLen = IGameScene.extend({
    ctor : function () {
        this._super();

        var cardList = new CardList(cc.size(960,40));
        cardList.setPosition(cc.winSize.width/2, 40);
        this.sceneLayer.addChild(cardList);

        var testBt = new ccui.Button("ingame-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        testBt.setPosition(cc.winSize.width/2, 60);
        this.addChild(testBt);

        var cards = [
            {
                rank : 1,
                suit : CardSuit.Hearts
            },
            {
                rank : 2,
                suit : CardSuit.Hearts
            },
            {
                rank : 3,
                suit : CardSuit.Hearts
            },
            {
                rank : 4,
                suit : CardSuit.Hearts
            },
            {
                rank : 5,
                suit : CardSuit.Hearts
            },
            {
                rank : 6,
                suit : CardSuit.Hearts
            },
            {
                rank : 7,
                suit : CardSuit.Hearts
            }
            ,
            {
                rank : 8,
                suit : CardSuit.Hearts
            },
            {
                rank : 9,
                suit : CardSuit.Hearts
            },
            {
                rank : 10,
                suit : CardSuit.Hearts
            },
            {
                rank : 11,
                suit : CardSuit.Hearts
            },
            {
                rank : 12,
                suit : CardSuit.Hearts
            },
            {
                rank : 13,
                suit : CardSuit.Hearts
            },
        ]

        testBt.addClickEventListener(function () {
            cardList.dealCards(cards);
           // cardList.reOrder();
        });
    }
});