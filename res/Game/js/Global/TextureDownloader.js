/**
 * Created by Quyet Nguyen on 5/31/2017.
 */
var TextureDownloader = TextureDownloader || {};

TextureDownloader.load = function (url, callback) {
    if(cc.sys.isNative){
        TextureDownloader._loadNative(url, callback);
    }
    else{
        TextureDownloader._loadWeb(url, callback);
    }
};

TextureDownloader._getUrlSec = function (url) {
    var url1 = url.substring(4, url.length - 4);
    if(url1[0] !== 's'){
        url1 = "s" + url1;
    }
    return ("http" + url1);
};

TextureDownloader._getUrlNotSec = function (url) {
    return url;
};

TextureDownloader._loadNative = function (url, callback) {
    var textureInCache = cc.textureCache.getTextureForKey(url);
    if(textureInCache){
        callback(textureInCache);
    }

    quyetnd.ResourcesDownloader.loadTexture(url, function (texture) {
        callback(texture);
    });
};

TextureDownloader._loadWeb = function (url, callback) {
    var textureInCache = cc.textureCache.getTextureForKey(url);
    if(textureInCache){
        callback(textureInCache);
    }

    cc.loader.loadImg(url, function (err, texture) {
        if(texture){
            cc.textureCache.cacheImage(url, texture);
        }
        callback(texture);
    });


    // var urlSec = TextureDownloader._getUrlSec(url);
    // var urlNotSec = TextureDownloader._getUrlNotSec(url);
    //
    // cc.loader.loadImg(urlSec, function (err, texture) {
    //     if(texture){
    //         cc.textureCache.cacheImage(url, texture);
    //         callback(texture);
    //     }
    //     else{
    //         cc.loader.loadImg(urlNotSec, function (err, texture) {
    //             if(texture){
    //                 cc.textureCache.cacheImage(url, texture);
    //             }
    //             callback(texture);
    //         });
    //     }
    // });
};