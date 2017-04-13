/**
 * Created by Quyet Nguyen on 4/13/2017.
 */
var newui = newui || {};
newui.ListViewWithAdaptor = newui.CustomScrollView.extend({
    ctor : function (size) {
        this._super(size);

        this._sizeCallback = null;
        this._createCallback = null;
        this._itemAdaptor = null;
        this._padding = 0.0;
        this._marginLeft = 0.0;
        this._marginRight = 0.0;
        this._marginTop = 0.0;
        this._marginBottom = 0.0;
        this._direction = ccui.ScrollView.DIR_VERTICAL;
        this._refreshView = false;
    },

    setSizeCallback : function (c) {
        this._sizeCallback = c;
    },

    setCreateItemCallback : function (c) {
        this._createCallback = c;
    },

    setItemAdaptor : function (c) {
        this._itemAdaptor = c;
    },

    setPadding : function (padding) {
        this._padding = padding;
        this._refreshView = true;
    },

    setMargin : function (top, bot, left, right) {
        this._marginTop = top;
        this._marginBottom = bot;
        this._marginLeft = left;
        this._marginRight = right;
        this._refreshView = true;
    },

    refreshView : function () {
        this._refreshView = true;
    },
    
    _forceRefreshView : function () {

    }
});
