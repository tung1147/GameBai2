var cc=cc||{};cc._tmp=cc._tmp||{};cc._LogInfos={};var _p=window,_p=Object.prototype,_p=null;cc.ORIENTATION_PORTRAIT=0;cc.ORIENTATION_PORTRAIT_UPSIDE_DOWN=1;cc.ORIENTATION_LANDSCAPE_LEFT=2;cc.ORIENTATION_LANDSCAPE_RIGHT=3;cc._drawingUtil=null;cc._renderContext=null;cc._supportRender=!1;cc._canvas=null;cc.container=null;cc._gameDiv=null;cc.newElement=function(a){return document.createElement(a)};
cc.each=function(a,b,c){if(a)if(a instanceof Array)for(var f=0,h=a.length;f<h&&!1!==b.call(c,a[f],f);f++);else for(f in a)if(!1===b.call(c,a[f],f))break};cc.extend=function(a){var b=2<=arguments.length?Array.prototype.slice.call(arguments,1):[];cc.each(b,function(b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])});return a};cc.isFunction=function(a){return"function"===typeof a};cc.isNumber=function(a){return"number"===typeof a||"[object Number]"===Object.prototype.toString.call(a)};
cc.isString=function(a){return"string"===typeof a||"[object String]"===Object.prototype.toString.call(a)};cc.isArray=function(a){return Array.isArray(a)||"object"===typeof a&&"[object Array]"===Object.prototype.toString.call(a)};cc.isUndefined=function(a){return"undefined"===typeof a};cc.isObject=function(a){return"object"===typeof a&&"[object Object]"===Object.prototype.toString.call(a)};
cc.isCrossOrigin=function(a){if(!a)return cc.log("invalid URL"),!1;var b=a.indexOf("://");if(-1===b)return!1;b=a.indexOf("/",b+3);return(-1===b?a:a.substring(0,b))!==location.origin};
cc.AsyncPool=function(a,b,c,f,h){var k=this;k._srcObj=a;k._limit=b;k._pool=[];k._iterator=c;k._iteratorTarget=h;k._onEnd=f;k._onEndTarget=h;k._results=a instanceof Array?[]:{};k._errors=a instanceof Array?[]:{};cc.each(a,function(a,e){k._pool.push({index:e,value:a})});k.size=k._pool.length;k.finishedSize=0;k._workingSize=0;k._limit=k._limit||k.size;k.onIterator=function(a,e){k._iterator=a;k._iteratorTarget=e};k.onEnd=function(a,e){k._onEnd=a;k._onEndTarget=e};k._handleItem=function(){var a=this;if(!(0===
a._pool.length||a._workingSize>=a._limit)){var e=a._pool.shift(),d=e.value,b=e.index;a._workingSize++;a._iterator.call(a._iteratorTarget,d,b,function(d,e){a.finishedSize++;a._workingSize--;d?a._errors[this.index]=d:a._results[this.index]=e;a.finishedSize===a.size?a._onEnd&&a._onEnd.call(a._onEndTarget,0===a._errors.length?null:a._errors,a._results):a._handleItem()}.bind(e),a)}};k.flow=function(){if(0===this._pool.length)this._onEnd&&this._onEnd.call(this._onEndTarget,null,[]);else for(var a=0;a<this._limit;a++)this._handleItem()}};
cc.async={series:function(a,b,c){a=new cc.AsyncPool(a,1,function(a,b,k){a.call(c,k)},b,c);a.flow();return a},parallel:function(a,b,c){a=new cc.AsyncPool(a,0,function(a,b,k){a.call(c,k)},b,c);a.flow();return a},waterfall:function(a,b,c){var f=[],h=[null],k=new cc.AsyncPool(a,1,function(b,e,d){f.push(function(b){f=Array.prototype.slice.call(arguments,1);a.length-1===e&&(h=h.concat(f));d.apply(null,arguments)});b.apply(c,f)},function(a){if(b){if(a)return b.call(c,a);b.apply(c,h)}});k.flow();return k},
map:function(a,b,c,f){var h=b;"object"===typeof b&&(c=b.cb,f=b.iteratorTarget,h=b.iterator);a=new cc.AsyncPool(a,0,h,c,f);a.flow();return a},mapLimit:function(a,b,c,f,h){a=new cc.AsyncPool(a,b,c,f,h);a.flow();return a}};
cc.path={normalizeRE:/[^\.\/]+\/\.\.\//,join:function(){for(var a=arguments.length,b="",c=0;c<a;c++)b=(b+(""===b?"":"/")+arguments[c]).replace(/(\/|\\\\)$/,"");return b},extname:function(a){return(a=/(\.[^\.\/\?\\]*)(\?.*)?$/.exec(a))?a[1]:null},mainFileName:function(a){if(a){var b=a.lastIndexOf(".");if(-1!==b)return a.substring(0,b)}return a},basename:function(a,b){var c=a.indexOf("?");0<c&&(a=a.substring(0,c));c=/(\/|\\\\)([^(\/|\\\\)]+)$/g.exec(a.replace(/(\/|\\\\)$/,""));if(!c)return null;c=c[2];
return b&&a.substring(a.length-b.length).toLowerCase()===b.toLowerCase()?c.substring(0,c.length-b.length):c},dirname:function(a){return a.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/,"$2")},changeExtname:function(a,b){b=b||"";var c=a.indexOf("?"),f="";0<c&&(f=a.substring(c),a=a.substring(0,c));c=a.lastIndexOf(".");return 0>c?a+b+f:a.substring(0,c)+b+f},changeBasename:function(a,b,c){if(0===b.indexOf("."))return this.changeExtname(a,b);var f=a.indexOf("?"),h="";c=c?this.extname(a):"";0<f&&(h=a.substring(f),
a=a.substring(0,f));f=a.lastIndexOf("/");return a.substring(0,0>=f?0:f+1)+b+c+h},_normalize:function(a){var b;a=String(a);do b=a,a=a.replace(this.normalizeRE,"");while(b.length!==a.length);return a}};
cc.loader=function(){var a={},b={},c={},f={},h={},k=RegExp("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))|(?:localhost))(?::\\d{2,5})?(?:/\\S*)?$","i");return{resPath:"",audioPath:"",cache:{},getXMLHttpRequest:function(){return window.XMLHttpRequest?
new window.XMLHttpRequest:new ActiveXObject("MSXML2.XMLHTTP")},_getArgs4Js:function(a){var e=a[0],d=a[1],b=a[2],c=["",null,null];if(1===a.length)c[1]=e instanceof Array?e:[e];else if(2===a.length)"function"===typeof d?(c[1]=e instanceof Array?e:[e],c[2]=d):(c[0]=e||"",c[1]=d instanceof Array?d:[d]);else if(3===a.length)c[0]=e||"",c[1]=d instanceof Array?d:[d],c[2]=b;else throw Error("arguments error to load js!");return c},isLoading:function(a){return void 0!==h[a]},loadJs:function(b,e,d){var c=this,
g=c._getArgs4Js(arguments),f=g[0],h=g[1],g=g[2];-1<navigator.userAgent.indexOf("Trident/5")?c._loadJs4Dependency(f,h,0,g):cc.async.map(h,function(d,e,b){d=cc.path.join(f,d);if(a[d])return b(null);c._createScript(d,!1,b)},g)},loadJsWithImg:function(a,e,d){var b=this._loadJsImg(),c=this._getArgs4Js(arguments);this.loadJs(c[0],c[1],function(d){if(d)throw Error(d);b.parentNode.removeChild(b);if(c[2])c[2]()})},_createScript:function(b,e,d){var c=document,g=document.createElement("script");g.async=e;a[b]=
!0;cc.game.config.noCache&&"string"===typeof b?this._noCacheRex.test(b)?g.src=b+"&_t="+(new Date-0):g.src=b+"?_t="+(new Date-0):g.src=b;g.addEventListener("load",function(){g.parentNode.removeChild(g);this.removeEventListener("load",arguments.callee,!1);d()},!1);g.addEventListener("error",function(){g.parentNode.removeChild(g);d("Load "+b+" failed!")},!1);c.body.appendChild(g)},_loadJs4Dependency:function(a,b,d,c){if(d>=b.length)c&&c();else{var e=this;e._createScript(cc.path.join(a,b[d]),!1,function(g){if(g)return c(g);
e._loadJs4Dependency(a,b,d+1,c)})}},_loadJsImg:function(){var a=document,b=a.getElementById("cocos2d_loadJsImg");if(!b){b=document.createElement("img");cc._loadingImage&&(b.src=cc._loadingImage);a=a.getElementById(cc.game.config.id);a.style.backgroundColor="transparent";a.parentNode.appendChild(b);var d=getComputedStyle?getComputedStyle(a):a.currentStyle;d||(d={width:a.width,height:a.height});b.style.left=a.offsetLeft+(parseFloat(d.width)-b.width)/2+"px";b.style.top=a.offsetTop+(parseFloat(d.height)-
b.height)/2+"px";b.style.position="absolute"}return b},loadTxt:function(a,b){if(cc._isNodeJs)require("fs").readFile(a,function(a,d){a?b(a):b(null,d.toString())});else{var d=this.getXMLHttpRequest(),c="load "+a+" failed!";d.open("GET",a,!0);/msie/i.test(navigator.userAgent)&&!/opera/i.test(navigator.userAgent)?(d.setRequestHeader("Accept-Charset","utf-8"),d.onreadystatechange=function(){4===d.readyState&&(200===d.status?b(null,d.responseText):b({status:d.status,errorMessage:c},null))}):(d.overrideMimeType&&
d.overrideMimeType("text/plain; charset=utf-8"),d.onload=function(){4===d.readyState&&(200===d.status?b(null,d.responseText):b({status:d.status,errorMessage:c},null))},d.onerror=function(){b({status:d.status,errorMessage:c},null)});d.send(null)}},_loadTxtSync:function(a){if(cc._isNodeJs)return require("fs").readFileSync(a).toString();var b=this.getXMLHttpRequest();b.open("GET",a,!1);/msie/i.test(navigator.userAgent)&&!/opera/i.test(navigator.userAgent)?b.setRequestHeader("Accept-Charset","utf-8"):
b.overrideMimeType&&b.overrideMimeType("text/plain; charset=utf-8");b.send(null);return 200!==b.status?null:b.responseText},loadCsb:function(a,b){var d=new XMLHttpRequest,c="load "+a+" failed!";d.open("GET",a,!0);d.responseType="arraybuffer";d.onload=function(){var a=d.response;a&&(window.msg=a);4===d.readyState&&(200===d.status?b(null,d.response):b({status:d.status,errorMessage:c},null))};d.onerror=function(){b({status:d.status,errorMessage:c},null)};d.send(null)},loadJson:function(a,b){this.loadTxt(a,
function(d,c){if(d)b(d);else{try{var e=JSON.parse(c)}catch(w){throw Error("parse json ["+a+"] failed : "+w);}b(null,e)}})},_checkIsImageURL:function(a){return null!=/(\.png)|(\.jpg)|(\.bmp)|(\.jpeg)|(\.gif)/.exec(a)},loadImg:function(a,b,d){var c={isCrossOrigin:!0};void 0!==d?c.isCrossOrigin=void 0===b.isCrossOrigin?c.isCrossOrigin:b.isCrossOrigin:void 0!==b&&(d=b);var e=this.getRes(a);if(e)return d&&d(null,e),e;if(b=h[a])return b.callbacks.push(d),b.img;e=new Image;c.isCrossOrigin&&"file://"!==location.origin&&
(e.crossOrigin="Anonymous");var g=function(){this.removeEventListener("load",g,!1);this.removeEventListener("error",t,!1);k.test(a)||(cc.loader.cache[a]=e);var d=h[a];if(d){for(var b=d.callbacks,c=0;c<b.length;++c){var f=b[c];f&&f(null,e)}d.img=null;delete h[a]}},f=this,t=function(){this.removeEventListener("error",t,!1);if(e.crossOrigin&&"anonymous"===e.crossOrigin.toLowerCase())c.isCrossOrigin=!1,f.release(a),cc.loader.loadImg(a,c,d);else{var b=h[a];if(b){for(var g=b.callbacks,k=0;k<g.length;++k){var v=
g[k];v&&v("load image failed")}b.img=null;delete h[a]}}};h[a]={img:e,callbacks:d?[d]:[]};e.addEventListener("load",g);e.addEventListener("error",t);e.src=a;return e},_loadResIterator:function(a,c,d){var e=this,f=null,g=a.type;g?(g="."+g.toLowerCase(),f=a.src?a.src:a.name+g):(f=a,g=cc.path.extname(f));if(c=e.getRes(f))return d(null,c);c=null;g&&(c=b[g.toLowerCase()]);if(!c)return cc.error("loader for ["+g+"] not exists!"),d();g=f;k.test(f)||(g=c.getBasePath?c.getBasePath():e.resPath,g=e.getUrl(g,f));
cc.game.config.noCache&&"string"===typeof g&&(g=e._noCacheRex.test(g)?g+("&_t="+(new Date-0)):g+("?_t="+(new Date-0)));c.load(g,f,a,function(a,b){a?(cc.log(a),e.cache[f]=null,delete e.cache[f],d({status:520,errorMessage:a},null)):(e.cache[f]=b,d(null,b))})},_noCacheRex:/\?/,getUrl:function(a,e){var d=cc.path;if(void 0!==a&&void 0===e){e=a;var g=d.extname(e),g=g?g.toLowerCase():"";a=(g=b[g])?g.getBasePath?g.getBasePath():this.resPath:this.resPath}e=cc.path.join(a||"",e);if(e.match(/[\/(\\\\)]lang[\/(\\\\)]/i)){if(c[e])return c[e];
d=d.extname(e)||"";e=c[e]=e.substring(0,e.length-d.length)+"_"+cc.sys.language+d}return e},load:function(a,b,d){var c=this,e=arguments.length;if(0===e)throw Error("arguments error!");3===e?"function"===typeof b&&(b="function"===typeof d?{trigger:b,cb:d}:{cb:b,cbTarget:d}):2===e?"function"===typeof b&&(b={cb:b}):1===e&&(b={});a instanceof Array||(a=[a]);e=new cc.AsyncPool(a,0,function(a,d,e,g){c._loadResIterator(a,d,function(a){var d=Array.prototype.slice.call(arguments,1);b.trigger&&b.trigger.call(b.triggerTarget,
d[0],g.size,g.finishedSize);e(a,d[0])})},b.cb,b.cbTarget);e.flow();return e},_handleAliases:function(a,b){var d=[],c;for(c in a){var e=a[c];f[c]=e;d.push(e)}this.load(d,b)},loadAliases:function(a,b){var d=this,c=d.getRes(a);c?d._handleAliases(c.filenames,b):d.load(a,function(a,c){d._handleAliases(c[0].filenames,b)})},register:function(a,c){if(a&&c){if("string"===typeof a)return b[a.trim().toLowerCase()]=c;for(var d=0,e=a.length;d<e;d++)b["."+a[d].trim().toLowerCase()]=c}},getRes:function(a){return this.cache[a]||
this.cache[f[a]]},_getAliase:function(a){return f[a]},release:function(a){var b=this.cache,d=h[a];d&&(d.img=null,delete h[a]);delete b[a];delete b[f[a]];delete f[a]},releaseAll:function(){var a=this.cache,b;for(b in a)delete a[b];for(b in f)delete f[b]}}}();
cc.formatStr=function(){var a=arguments,b=a.length;if(1>b)return"";var c=a[0],f=!0;"object"===typeof c&&(f=!1);for(var h=1;h<b;++h){var k=a[h];if(f)for(;;){var g;if("number"===typeof k&&(g=c.match(/(%d)|(%s)/))){c=c.replace(/(%d)|(%s)/,k);break}c=(g=c.match(/%s/))?c.replace(/%s/,k):c+("    "+k);break}else c+="    "+k}return c};
(function(){function a(a){var d=cc.game.CONFIG_KEY,b=parseInt(a[d.renderMode])||0;if(isNaN(b)||2<b||0>b)a[d.renderMode]=0;cc._renderType=cc.game.RENDER_TYPE_CANVAS;cc._supportRender=!1;0===b?cc.sys.capabilities.opengl?(cc._renderType=cc.game.RENDER_TYPE_WEBGL,cc._supportRender=!0):cc.sys.capabilities.canvas&&(cc._renderType=cc.game.RENDER_TYPE_CANVAS,cc._supportRender=!0):1===b&&cc.sys.capabilities.canvas?(cc._renderType=cc.game.RENDER_TYPE_CANVAS,cc._supportRender=!0):2===b&&cc.sys.capabilities.opengl&&
(cc._renderType=cc.game.RENDER_TYPE_WEBGL,cc._supportRender=!0)}function b(a){cc.game.CC_DEBUG_ENABLE=a[cc.game.CONFIG_KEY.debugMode]!=cc.game.DEBUG_MODE_NONE;cc._initDebugSetting&&cc._initDebugSetting(a[cc.game.CONFIG_KEY.debugMode]);cc._engineLoaded=!0;cc.log(cc.ENGINE_VERSION);e&&e()}function c(a){cc.Class?b(a):cc.loader.loadJsWithImg(["engine.js"],function(d){if(d)throw d;b(a)})}function f(){this.removeEventListener("load",f,!1);c(cc.game.config)}var h=document.createElement("canvas"),k=document.createElement("canvas");
cc.create3DContext=function(a,b){for(var d=["webgl","experimental-webgl","webkit-3d","moz-webgl"],c=null,e=0;e<d.length;++e){try{c=a.getContext(d[e],b)}catch(t){}if(c)break}return c};(function(){cc.sys={};var a=cc.sys;a.LANGUAGE_ENGLISH="en";a.LANGUAGE_CHINESE="zh";a.LANGUAGE_FRENCH="fr";a.LANGUAGE_ITALIAN="it";a.LANGUAGE_GERMAN="de";a.LANGUAGE_SPANISH="es";a.LANGUAGE_DUTCH="du";a.LANGUAGE_RUSSIAN="ru";a.LANGUAGE_KOREAN="ko";a.LANGUAGE_JAPANESE="ja";a.LANGUAGE_HUNGARIAN="hu";a.LANGUAGE_PORTUGUESE=
"pt";a.LANGUAGE_ARABIC="ar";a.LANGUAGE_NORWEGIAN="no";a.LANGUAGE_POLISH="pl";a.LANGUAGE_UNKNOWN="unkonwn";a.OS_IOS="iOS";a.OS_ANDROID="Android";a.OS_WINDOWS="Windows";a.OS_MARMALADE="Marmalade";a.OS_LINUX="Linux";a.OS_BADA="Bada";a.OS_BLACKBERRY="Blackberry";a.OS_OSX="OS X";a.OS_WP8="WP8";a.OS_WINRT="WINRT";a.OS_UNKNOWN="Unknown";a.UNKNOWN=-1;a.WIN32=0;a.LINUX=1;a.MACOS=2;a.ANDROID=3;a.IPHONE=4;a.IPAD=5;a.BLACKBERRY=6;a.NACL=7;a.EMSCRIPTEN=8;a.TIZEN=9;a.WINRT=10;a.WP8=11;a.MOBILE_BROWSER=100;a.DESKTOP_BROWSER=
101;a.BROWSER_TYPE_WECHAT="wechat";a.BROWSER_TYPE_ANDROID="androidbrowser";a.BROWSER_TYPE_IE="ie";a.BROWSER_TYPE_QQ="qqbrowser";a.BROWSER_TYPE_MOBILE_QQ="mqqbrowser";a.BROWSER_TYPE_UC="ucbrowser";a.BROWSER_TYPE_360="360browser";a.BROWSER_TYPE_BAIDU_APP="baiduboxapp";a.BROWSER_TYPE_BAIDU="baidubrowser";a.BROWSER_TYPE_MAXTHON="maxthon";a.BROWSER_TYPE_OPERA="opera";a.BROWSER_TYPE_OUPENG="oupeng";a.BROWSER_TYPE_MIUI="miuibrowser";a.BROWSER_TYPE_FIREFOX="firefox";a.BROWSER_TYPE_SAFARI="safari";a.BROWSER_TYPE_CHROME=
"chrome";a.BROWSER_TYPE_LIEBAO="liebao";a.BROWSER_TYPE_QZONE="qzone";a.BROWSER_TYPE_SOUGOU="sogou";a.BROWSER_TYPE_UNKNOWN="unknown";a.isNative=!1;var b=window,c=b.navigator,e=document,f=e.documentElement,g=c.userAgent.toLowerCase();a.isMobile=-1!==g.indexOf("mobile")||-1!==g.indexOf("android");a.platform=a.isMobile?a.MOBILE_BROWSER:a.DESKTOP_BROWSER;var l=c.language,l=(l=l?l:c.browserLanguage)?l.split("-")[0]:a.LANGUAGE_ENGLISH;a.language=l;var q=l=!1,r="",u=0,m=/android (\d+(?:\.\d+)+)/i.exec(g)||
/android (\d+(?:\.\d+)+)/i.exec(c.platform);m&&(l=!0,r=m[1]||"",u=parseInt(r)||0);if(m=/(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(g))q=!0,r=m[2]||"",u=parseInt(r)||0;m=a.OS_UNKNOWN;-1!==c.appVersion.indexOf("Win")?m=a.OS_WINDOWS:q?m=a.OS_IOS:-1!==c.appVersion.indexOf("Mac")?m=a.OS_OSX:-1!==c.appVersion.indexOf("X11")&&-1===c.appVersion.indexOf("Linux")?m=a.OS_UNIX:l?m=a.OS_ANDROID:-1!==c.appVersion.indexOf("Linux")&&(m=a.OS_LINUX);a.os=m;a.osVersion=r;a.osMainVersion=u;a.browserType=a.BROWSER_TYPE_UNKNOWN;
(function(){var b=/qqbrowser|chrome|safari|firefox|opr|oupeng|opera/i,c=/mqqbrowser|sogou|qzone|liebao|micromessenger|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|trident|miuibrowser/i.exec(g);c||(c=b.exec(g));b=c?c[0]:a.BROWSER_TYPE_UNKNOWN;"micromessenger"===b?b=a.BROWSER_TYPE_WECHAT:"safari"===b&&g.match(/android.*applewebkit/)?b=a.BROWSER_TYPE_ANDROID:"trident"===b?b=a.BROWSER_TYPE_IE:"360 aphone"===b?b=a.BROWSER_TYPE_360:"mxbrowser"===b?b=a.BROWSER_TYPE_MAXTHON:
"opr"===b&&(b=a.BROWSER_TYPE_OPERA);a.browserType=b})();a.browserVersion="";(function(){var b=/(msie |rv:|firefox|chrome|ucbrowser|oupeng|opera|opr|safari|miui)(mobile)?(browser)?\/?([\d.]+)/i,c=g.match(/(micromessenger|qq|mx|maxthon|baidu|sogou)(mobile)?(browser)?\/?([\d.]+)/i);c||(c=g.match(b));a.browserVersion=c?c[4]:""})();l=window.devicePixelRatio||1;a.windowPixelResolution={width:l*(window.innerWidth||document.documentElement.clientWidth),height:l*(window.innerHeight||document.documentElement.clientHeight)};
a._checkWebGLRenderMode=function(){if(cc._renderType!==cc.game.RENDER_TYPE_WEBGL)throw Error("This feature supports WebGL render mode only.");};a._supportCanvasNewBlendModes=function(){var a=h;a.width=1;a.height=1;a=a.getContext("2d");a.fillStyle="#000";a.fillRect(0,0,1,1);a.globalCompositeOperation="multiply";var b=k;b.width=1;b.height=1;var c=b.getContext("2d");c.fillStyle="#fff";c.fillRect(0,0,1,1);a.drawImage(b,0,0,1,1);return 0===a.getImageData(0,0,1,1).data[0]}();cc.sys.isMobile&&(l=document.createElement("style"),
l.type="text/css",document.body.appendChild(l),l.textContent="body,canvas,div{ -moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;-khtml-user-select: none;-webkit-tap-highlight-color:rgba(0,0,0,0);}");try{var n=a.localStorage=b.localStorage;n.setItem("storage","");n.removeItem("storage");n=null}catch(x){n=function(){cc.warn("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option")},a.localStorage={getItem:n,setItem:n,removeItem:n,clear:n}}n=!!h.getContext("2d");
l=!1;if(b.WebGLRenderingContext){q=document.createElement("CANVAS");try{if(cc.create3DContext(q,{stencil:!0})&&(l=!0),l&&a.os===a.OS_ANDROID){var p=parseFloat(a.browserVersion);switch(a.browserType){case a.BROWSER_TYPE_MOBILE_QQ:case a.BROWSER_TYPE_BAIDU:case a.BROWSER_TYPE_BAIDU_APP:l=6.2<=p?!0:!1;break;case a.BROWSER_TYPE_CHROME:l=30<=p?!0:!1;break;case a.BROWSER_TYPE_ANDROID:a.osMainVersion&&5<=a.osMainVersion&&(l=!0);break;case a.BROWSER_TYPE_UNKNOWN:case a.BROWSER_TYPE_360:case a.BROWSER_TYPE_MIUI:case a.BROWSER_TYPE_UC:l=
!1}}}catch(x){}q=null}p=a.capabilities={canvas:n,opengl:l};if(void 0!==f.ontouchstart||void 0!==e.ontouchstart||c.msPointerEnabled)p.touches=!0;void 0!==f.onmouseup&&(p.mouse=!0);void 0!==f.onkeyup&&(p.keyboard=!0);if(b.DeviceMotionEvent||b.DeviceOrientationEvent)p.accelerometer=!0;a.garbageCollect=function(){};a.dumpRoot=function(){};a.restartVM=function(){};a.cleanScript=function(a){};a.isObjectValid=function(a){return a?!0:!1};a.dump=function(){var a;a=""+("isMobile : "+this.isMobile+"\r\n");a+=
"language : "+this.language+"\r\n";a+="browserType : "+this.browserType+"\r\n";a+="browserVersion : "+this.browserVersion+"\r\n";a+="capabilities : "+JSON.stringify(this.capabilities)+"\r\n";a+="os : "+this.os+"\r\n";a+="osVersion : "+this.osVersion+"\r\n";a+="platform : "+this.platform+"\r\n";a+="Using "+(cc._renderType===cc.game.RENDER_TYPE_WEBGL?"WEBGL":"CANVAS")+" renderer.\r\n";cc.log(a)};a.openURL=function(a){window.open(a)}})();k=h=null;cc.log=cc.warn=cc.error=cc.assert=function(){};var g=
!1,e=null;cc._engineLoaded=!1;cc.initEngine=function(b,h){if(g){var d=e;e=function(){d&&d();h&&h()}}else e=h,!cc.game.config&&b?cc.game.config=b:cc.game.config||cc.game._loadConfig(),b=cc.game.config,a(b),document.body?c(b):cc._addEventListener(window,"load",f,!1),g=!0}})();
cc.game={DEBUG_MODE_NONE:0,DEBUG_MODE_INFO:1,DEBUG_MODE_WARN:2,DEBUG_MODE_ERROR:3,DEBUG_MODE_INFO_FOR_WEB_PAGE:4,DEBUG_MODE_WARN_FOR_WEB_PAGE:5,DEBUG_MODE_ERROR_FOR_WEB_PAGE:6,EVENT_HIDE:"game_on_hide",EVENT_SHOW:"game_on_show",EVENT_RESIZE:"game_on_resize",EVENT_RENDERER_INITED:"renderer_inited",RENDER_TYPE_CANVAS:0,RENDER_TYPE_WEBGL:1,RENDER_TYPE_OPENGL:2,_eventHide:null,_eventShow:null,CONFIG_KEY:{width:"width",height:"height",engineDir:"engineDir",modules:"modules",debugMode:"debugMode",showFPS:"showFPS",
frameRate:"frameRate",id:"id",renderMode:"renderMode",jsList:"jsList"},_paused:!0,_prepareCalled:!1,_prepared:!1,_rendererInitialized:!1,_renderContext:null,_intervalId:null,_lastTime:null,_frameTime:null,frame:null,container:null,canvas:null,config:null,onStart:null,onStop:null,setFrameRate:function(a){this.config[this.CONFIG_KEY.frameRate]=a;this._intervalId&&window.cancelAnimationFrame(this._intervalId);this._paused=!0;this._setAnimFrame();this._runMainLoop()},step:function(){cc.director.mainLoop()},
pause:function(){this._paused||(this._paused=!0,cc.audioEngine&&(cc.audioEngine.stopAllEffects(),cc.audioEngine.pauseMusic()),this._intervalId&&window.cancelAnimationFrame(this._intervalId),this._intervalId=0)},resume:function(){this._paused&&(this._paused=!1,cc.audioEngine&&cc.audioEngine.resumeMusic(),this._runMainLoop())},isPaused:function(){return this._paused},restart:function(){cc.director.popToSceneStackLevel(0);cc.audioEngine&&cc.audioEngine.end();cc.game.onStart()},end:function(){close()},
prepare:function(a){var b=this,c=b.config,f=b.CONFIG_KEY;this._loadConfig();this._prepared?a&&a():this._prepareCalled||(cc._engineLoaded?(this._prepareCalled=!0,this._initRenderer(c[f.width],c[f.height]),cc.view=cc.EGLView._getInstance(),cc.director=cc.Director._getInstance(),cc.director.setOpenGLView&&cc.director.setOpenGLView(cc.view),cc.winSize=cc.director.getWinSize(),this._initEvents(),this._setAnimFrame(),this._runMainLoop(),(c=c[f.jsList])?cc.loader.loadJsWithImg(c,function(c){if(c)throw Error(c);
b._prepared=!0;a&&a()}):a&&a()):cc.initEngine(this.config,function(){b.prepare(a)}))},run:function(a,b){"function"===typeof a?cc.game.onStart=a:(a&&("string"===typeof a?(cc.game.config||this._loadConfig(),cc.game.config[cc.game.CONFIG_KEY.id]=a):cc.game.config=a),"function"===typeof b&&(cc.game.onStart=b));this.prepare(cc.game.onStart&&cc.game.onStart.bind(cc.game))},_setAnimFrame:function(){this._lastTime=new Date;this._frameTime=1E3/cc.game.config[cc.game.CONFIG_KEY.frameRate];cc.sys.os===cc.sys.OS_IOS&&
cc.sys.browserType===cc.sys.BROWSER_TYPE_WECHAT||60!==cc.game.config[cc.game.CONFIG_KEY.frameRate]?(window.requestAnimFrame=this._stTime,window.cancelAnimationFrame=this._ctTime):(window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||this._stTime,window.cancelAnimationFrame=window.cancelAnimationFrame||window.cancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||
window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.webkitCancelRequestAnimationFrame||window.msCancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.oCancelAnimationFrame||this._ctTime)},_stTime:function(a){var b=(new Date).getTime(),c=Math.max(0,cc.game._frameTime-(b-cc.game._lastTime)),f=window.setTimeout(function(){a()},c);cc.game._lastTime=b+c;return f},_ctTime:function(a){window.clearTimeout(a)},_runMainLoop:function(){var a=
this,b,c=cc.director;c.setDisplayStats(a.config[a.CONFIG_KEY.showFPS]);b=function(){a._paused||(c.mainLoop(),a._intervalId&&window.cancelAnimationFrame(a._intervalId),a._intervalId=window.requestAnimFrame(b))};window.requestAnimFrame(b);a._paused=!1},_loadConfig:function(){if(this.config)this._initConfig(this.config);else if(document.ccConfig)this._initConfig(document.ccConfig);else{var a={};try{for(var b=document.getElementsByTagName("script"),c=0;c<b.length;c++){var f=b[c].getAttribute("cocos");
if(""===f||f)break}var h,k,g;if(c<b.length){if(h=b[c].src)g=/(.*)\//.exec(h)[0],cc.loader.resPath=g,h=cc.path.join(g,"/project.json");k=cc.loader._loadTxtSync(h)}k||(k=cc.loader._loadTxtSync("project.json"));a=JSON.parse(k)}catch(e){cc.log("Failed to read or parse project.json")}this._initConfig(a)}},_initConfig:function(a){var b=this.CONFIG_KEY,c=a[b.modules];a[b.showFPS]="undefined"===typeof a[b.showFPS]?!0:a[b.showFPS];a[b.engineDir]=a[b.engineDir]||"frameworks/cocos2d-html5";null==a[b.debugMode]&&
(a[b.debugMode]=0);a[b.frameRate]=a[b.frameRate]||60;null==a[b.renderMode]&&(a[b.renderMode]=0);null==a[b.registerSystemEvent]&&(a[b.registerSystemEvent]=!0);c&&0>c.indexOf("core")&&c.splice(0,0,"core");c&&(a[b.modules]=c);this.config=a},_initRenderer:function(a,b){if(!this._rendererInitialized){if(!cc._supportRender)throw Error("The renderer doesn't support the renderMode "+this.config[this.CONFIG_KEY.renderMode]);var c=this.config[cc.game.CONFIG_KEY.id],f=window,c=cc.$(c)||cc.$("#"+c),h,k;"CANVAS"===
c.tagName?(a=a||c.width,b=b||c.height,this.canvas=cc._canvas=h=c,this.container=cc.container=k=document.createElement("DIV"),h.parentNode&&h.parentNode.insertBefore(k,h)):("DIV"!==c.tagName&&cc.log("Warning: target element is not a DIV or CANVAS"),a=a||c.clientWidth,b=b||c.clientHeight,this.canvas=cc._canvas=h=document.createElement("CANVAS"),this.container=cc.container=k=document.createElement("DIV"),c.appendChild(k));k.setAttribute("id","Cocos2dGameContainer");k.appendChild(h);this.frame=k.parentNode===
document.body?document.documentElement:k.parentNode;h.addClass("gameCanvas");h.setAttribute("width",a||480);h.setAttribute("height",b||320);h.setAttribute("tabindex",99);cc._renderType===cc.game.RENDER_TYPE_WEBGL&&(this._renderContext=cc._renderContext=cc.webglContext=cc.create3DContext(h,{stencil:!0,antialias:!cc.sys.isMobile,alpha:!1}));this._renderContext?(cc.renderer=cc.rendererWebGL,f.gl=this._renderContext,cc.renderer.init(),cc.shaderCache._init(),cc._drawingUtil=new cc.DrawingPrimitiveWebGL(this._renderContext),
cc.textureCache._initializingRenderer(),cc.glExt={},cc.glExt.instanced_arrays=f.gl.getExtension("ANGLE_instanced_arrays"),cc.glExt.element_uint=f.gl.getExtension("OES_element_index_uint")):(cc._renderType=cc.game.RENDER_TYPE_CANVAS,cc.renderer=cc.rendererCanvas,this._renderContext=cc._renderContext=new cc.CanvasContextWrapper(h.getContext("2d")),cc._drawingUtil=cc.DrawingPrimitiveCanvas?new cc.DrawingPrimitiveCanvas(this._renderContext):null);cc._gameDiv=k;cc.game.canvas.oncontextmenu=function(){if(!cc._isContextMenuEnable)return!1};
this.dispatchEvent(this.EVENT_RENDERER_INITED,!0);this._rendererInitialized=!0}},_initEvents:function(){var a=window,b,c;this._eventHide=this._eventHide||new cc.EventCustom(this.EVENT_HIDE);this._eventHide.setUserData(this);this._eventShow=this._eventShow||new cc.EventCustom(this.EVENT_SHOW);this._eventShow.setUserData(this);this.config[this.CONFIG_KEY.registerSystemEvent]&&cc.inputManager.registerSystemEvent(this.canvas);cc.isUndefined(document.hidden)?cc.isUndefined(document.mozHidden)?cc.isUndefined(document.msHidden)?
cc.isUndefined(document.webkitHidden)||(b="webkitHidden",c="webkitvisibilitychange"):(b="msHidden",c="msvisibilitychange"):(b="mozHidden",c="mozvisibilitychange"):(b="hidden",c="visibilitychange");var f=function(){cc.eventManager&&cc.game._eventHide&&cc.eventManager.dispatchEvent(cc.game._eventHide)},h=function(){cc.eventManager&&cc.game._eventShow&&cc.eventManager.dispatchEvent(cc.game._eventShow)};b?document.addEventListener(c,function(){document[b]?f():h()},!1):(a.addEventListener("blur",f,!1),
a.addEventListener("focus",h,!1));-1<navigator.userAgent.indexOf("MicroMessenger")&&(a.onfocus=function(){h()});"onpageshow"in window&&"onpagehide"in window&&(a.addEventListener("pagehide",f,!1),a.addEventListener("pageshow",h,!1));cc.eventManager.addCustomListener(cc.game.EVENT_HIDE,function(){cc.game.pause()});cc.eventManager.addCustomListener(cc.game.EVENT_SHOW,function(){cc.game.resume()})}};
Function.prototype.bind=Function.prototype.bind||function(a){if(!cc.isFunction(this))throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,f=function(){},h=function(){return c.apply(this instanceof f&&a?this:a,b.concat(Array.prototype.slice.call(arguments)))};f.prototype=this.prototype;h.prototype=new f;return h};
cc._urlRegExp=RegExp("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))|(?:localhost))(?::\\d{2,5})?(?:/\\S*)?$","i");
