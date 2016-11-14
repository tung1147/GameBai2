/**
 * Created by QuyetNguyen on 11/9/2016.
 */
/**
 * Created by Quyet Nguyen on 9/21/2016.
 */



var img_texture = img_texture || [

];

var s_frame_cache = [

];

// var g_resources =  g_resources || [];
// for (var i in res) {
//     g_resources.push(res[i]);
// }

cc.director.replaceScene = cc.director.replaceScene || function (scene) {
    cc.director.runScene(scene);
};

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        var label = new ccui.Text("Quyết đẹp trai", "arial", 30);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height/2;
        this.plistLoaded = 0;
        this.title = label;
        this.addChild(label);
    },
    onEnter : function () {
        this._super();
        
        cc.loader.resPath = "res/Game";
        this.schedule(this.startLoadResources, 0.3);
    },
    startLoadResources : function () {
        this.unschedule(this.startLoadResources);

        var thiz = this;
        cc.loader.load(img_texture,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
               // self._label.setString("Loading... " + percent + "%");
                cc.log("percent: "+percent);
            }, function () {
                cc.log("finished");
                thiz.loadTextureCache();
            });
    },
    loadTextureCache : function () {
        // if(this.plistLoaded >= frame_meta_file.length){
        //     this.nextScene();
        // }
        // else{
        //     var thiz = this;
        //     var url = frame_meta_file[this.plistLoaded];//cc.loader.getUrl(frame_meta_file[this.plistLoaded]);
        //     cc.loader.loadAliases(url, function () {
        //
        //         thiz.plistLoaded++;
        //         thiz.loadTextureCache();
        //     });
        // }

        for(var i=0;i<s_frame_cache.length;i++){
            var plist = s_frame_cache[i].plist;//cc.loader.getUrl(s_frame_cache[i].plist);
            cc.log("addPlist: "+plist);

           // var img = cc.loader.getRes(s_frame_cache[i].img);
           // var texture = cc.textureCache.addImage(img);
            cc.spriteFrameCache.addSpriteFrames(plist, s_frame_cache[i].img);
            //cc.spriteFrameCache.addSpriteFrames(plist, img);
        }
        this.nextScene();
    },
    nextScene : function () {
        cc.director.replaceScene(new HelloWorldScene());
    }
});