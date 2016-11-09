/**
 * Created by QuyetNguyen on 11/9/2016.
 */
/**
 * Created by Quyet Nguyen on 9/21/2016.
 */

var res = {
   // HelloWorld_png : "res/HelloWorld.png",
};

var g_resources =  g_resources || [];
for (var i in res) {
    g_resources.push(res[i]);
}

cc.director.replaceScene = cc.director.replaceScene || function (scene) {
    cc.director.runScene(scene);
};

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        var label = new ccui.Text("Quyết đẹp trai", "arial", 30);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height/2;
        this.title = label;
        this.addChild(label);
    },
    onEnter : function () {
        this._super();
        this.schedule(this.startLoadResources, 0.3);
    },
    startLoadResources : function () {
        this.unschedule(this.startLoadResources);

        var thiz = this;
        cc.loader.load(g_resources,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
               // self._label.setString("Loading... " + percent + "%");
                cc.log("percent: "+percent);
            }, function () {
                cc.log("finished");
                thiz.nextScene();
            });
    },
    nextScene : function () {
        cc.director.replaceScene(new HelloWorldScene());
    }
});