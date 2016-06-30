
var HelloWorldLayer = cc.Layer.extend({
    //sprite:null,
    ctor:function () {
        this._super();
        var winSize = cc.winSize;
        var thiz = this;


        var button = new ccui.Button("10b.png","","", ccui.Widget.PLIST_TEXTURE);
        button.x = winSize.width/2;
        button.y = winSize.height/2;
        button.addClickEventListener(function () {
            if(sprite){
                sprite.removeFromParent(true);
                sprite = null;
            }
        });
        this.addChild(button);

        var action = new quyetnd.ActionShake2D(10.0, cc.p(10, 10));
        button.runAction(action);

        return true;
    },
    
    onEvent : function (obj) {
        data = obj.getUserData().name;
        cc.log("onevent" + data);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

