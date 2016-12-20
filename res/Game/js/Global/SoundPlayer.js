/**
 * Created by QuyetNguyen on 12/19/2016.
 */

var SoundPlayer = SoundPlayer || {};

SoundPlayer._playSingleSound = function (sound, loop, cb) {
    var soundUrl = "res/Sound/" + sound + ".mp3";

    if(cc.sys.isNative){
        var audio = jsb.AudioEngine.play2d(soundUrl, loop);
        if(cb){
            jsb.AudioEngine.setFinishCallback(audio, function () {
                cb();
            });
        }
    }
    else{
        var audio = cc.audioEngine.playEffect(soundUrl, loop, cb);
    }
    return audio;
};

SoundPlayer._playMultiSound = function (soundList, index) {
    if(index >= soundList.length){
        return;
    }

    var audio = SoundPlayer._playSingleSound(soundList[index], false, function () {
        SoundPlayer._playMultiSound(soundList, (index + 1));
    });
};

SoundPlayer.playSound = function (sound, loop) {
    if(cc.isArray(sound)){
        if(sound.length == 1){
            SoundPlayer._playSingleSound(sound[0], false);
        }
        SoundPlayer._playMultiSound(sound, 0);
    }
    else{
        var soundLoop = loop ? true : false;
        SoundPlayer._playSingleSound(sound, soundLoop);
    }
};

SoundPlayer.stopAllSound = function () {
    if(cc.sys.isNative){
        jsb.AudioEngine.stopAll();
    }
    else{
        cc.audioEngine.stopAllEffects();
    }
};