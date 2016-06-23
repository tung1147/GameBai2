
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var winSize = cc.winSize;
        var button = ccui.Text("Button", "arial", 30);
        button.x = winSize.width/2;
        button.y = winSize.height/2;
        this.addChild(button);
        button.setTouchEnabled(true);
        button.addClickEventListener(function () {
            LobbyClient.getInstance().connect("10.0.1.88", 9999);
        });

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

