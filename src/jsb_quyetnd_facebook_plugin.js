/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var FacebookPlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                 this.plugin = new quyetnd.FacebookPlugin();
                 this.plugin.setTarget(this);
            }
        },
        
        showLogin : function () {
            this.plugin.showLogin();
        },

        onLoginFinished : function (returnCode, userId, accessToken) {
            cc.log(returnCode + " " + userId + " "+ accessToken);
        }
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    }
    return Clazz;
})();