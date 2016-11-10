/**
 * Created by QuyetNguyen on 11/9/2016.
 */
/**
 * Created by Quyet Nguyen on 9/21/2016.
 */



var img_texture = img_texture || [
        "res/avatar.plist",
        "res/bg-minigame-1.png",
        "res/bg_xocdia.png",
        "res/bigsmall_bg.png",
        "res/CaoThap.plist",
        "res/CaoThap.png",
        "res/Card.plist",
        "res/Card.png",
        "res/data/LevelData.json",
        "res/data/VipData.json",
        "res/dialog.plist",
        "res/dialog.png",
        "res/effectMini.plist",
        "res/effectMini.png",
        "res/FloatButton.plist",
        "res/FloatButton.png",
        "res/fonts/bigsmall_number_font.fnt",
        "res/fonts/bigsmall_number_font.png",
        "res/fonts/game-result-font1.fnt",
        "res/fonts/game-result-font1.png",
        "res/fonts/game-result-font2.fnt",
        "res/fonts/game-result-font2.png",
        "res/fonts/minigame-number-1.fnt",
        "res/fonts/minigame-number-1.png",
        "res/fonts/Roboto-BoldCondensed.ttf",
        "res/fonts/Roboto-Condensed.ttf",
        "res/fonts/RobotoBoldCondensed_25.fnt",
        "res/fonts/RobotoBoldCondensed_25.png",
        "res/fonts/RobotoBoldCondensed_30.fnt",
        "res/fonts/RobotoBoldCondensed_30.png",
        "res/fonts/RobotoBoldCondensed_40.fnt",
        "res/fonts/RobotoBoldCondensed_40.png",
        "res/fonts/RobotoCondensed_25.fnt",
        "res/fonts/RobotoCondensed_25.png",
        "res/fonts/RobotoCondensed_30.fnt",
        "res/fonts/RobotoCondensed_30.png",
        "res/fonts/Roboto_BoldCondensed_36_Glow.fnt",
        "res/fonts/Roboto_BoldCondensed_36_Glow.png",
        "res/fonts/UTM-AvoBold.ttf",
        "res/fonts/UTMAvoBold_25.fnt",
        "res/fonts/UTMAvoBold_25.png",
        "res/fonts/UTMAvoBold_30.fnt",
        "res/fonts/UTMAvoBold_30.png",
        "res/fonts/UTMAvoBold_40.fnt",
        "res/fonts/UTMAvoBold_40.png",
        "res/fonts/videoPokerRewardFont.fnt",
        "res/fonts/videoPokerRewardFont.png",
        "res/game-bg.jpg",
        "res/GameList.plist",
        "res/GameList.png",
        "res/gamemini.plist",
        "res/gamemini.png",
        "res/GameScene.plist",
        "res/GameScene.png",
        "res/gold-icon.png",
        "res/gp_table.png",
        "res/HDList.plist",
        "res/hilo_bg.png",
        "res/home.plist",
        "res/home.png",
        "res/lobby.plist",
        "res/lobby.png",
        "res/MiniPoker.plist",
        "res/MiniPoker.png",
        "res/mnpk_bg.png",
        "res/Sound/bellopen.mp3",
        "res/Sound/call2.mp3",
        "res/Sound/chia_bai.mp3",
        "res/Sound/chuyen_view.mp3",
        "res/Sound/danh_bai.mp3",
        "res/Sound/end_vongquay.mp3",
        "res/Sound/join_room.mp3",
        "res/Sound/losing.mp3",
        "res/Sound/lucky_wheel.mp3",
        "res/Sound/multichip.mp3",
        "res/Sound/open_card.mp3",
        "res/Sound/singlechip.mp3",
        "res/Sound/winning.mp3",
        "res/videopoker.plist",
        "res/videopoker.png",
        "res/VongQuay.plist",
        "res/VongQuay.png"
];

var s_frame_cache = [
    {plist:"res/VongQuay.plist",img:"res/VongQuay.png"},
    {plist:"res/videopoker.plist",img:"res/videopoker.png"},
    {plist:"res/MiniPoker.plist",img:"res/MiniPoker.png"},
    {plist:"res/lobby.plist",img:"res/lobby.png"},
    {plist:"res/home.plist",img:"res/home.png"},
    {plist:"res/GameScene.plist",img:"res/GameScene.png"},
    {plist:"res/gamemini.plist",img:"res/gamemini.png"},
    {plist:"res/GameList.plist",img:"res/GameList.png"},
    {plist:"res/FloatButton.plist",img:"res/FloatButton.png"},
    {plist:"res/effectMini.plist",img:"res/effectMini.png"},
    {plist:"res/Card.plist",img:"res/Card.png"},
    {plist:"res/dialog.plist",img:"res/dialog.png"},
    {plist:"res/CaoThap.plist", img:"res/CaoThap.png"}
]

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
        cc.director.replaceScene(new HomeScene());
    }
});