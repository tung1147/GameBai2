/**
 * Created by Quyet Nguyen on 5/31/2017.
 */
var TextureDownloader = TextureDownloader || {};

TextureDownloader.load = function (url, callback) {
    var textureInCache = cc.textureCache.getTextureForKey(url);
    if(textureInCache){
        callback(textureInCache);
    }

    if(cc.sys.isNative){
        quyetnd.ResourcesDownloader.loadTexture(url, function (texture) {
            callback(texture);
        });
    }
    else{
        cc.loader.loadImg(url, function (err, texture) {
            cc.textureCache.cacheImage(url, texture);
            callback(texture);
        });
    }
};