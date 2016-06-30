
var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var winSize = cc.winSize;
        var thiz = this;


        var button = new ccui.Button("10b.png","","", ccui.Widget.PLIST_TEXTURE);
        button.x = winSize.width/2;
        button.y = winSize.height/2;
        button.addClickEventListener(function () {
            FacebookPlugin.getInstance().showLogin();
        });
        this.addChild(button);



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

