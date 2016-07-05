/**
 * Created by Quyet Nguyen on 7/5/2016.
 */

var TOGGLE_SELECT = 1;
var TOGGLE_UNSELECT = 2;

var ToggleNodeItem = ccui.Widget.extend({
    callback :null,
    ctor : function (size) {
        this._super();
        this.setContentSize(size);
        this.setTouchEnabled(true);
    },
    setCallback : function (callback) {
        this.callback = callback;
    },
    select : function () {
        if(this.callback){
            this.callback(this, TOGGLE_SELECT, false);
        }
    },
    
    unSelect : function () {
        if(arguments.length == 0){
            if(this.callback){
                this.callback(this, TOGGLE_UNSELECT, false);
            }
        }
        else{
            if(this.callback){
                this.callback(this, TOGGLE_UNSELECT, arguments[0]);
            }
        }
    }
});

var ToggleNodeGroup = cc.Node.extend({
    mItem : [],
    itemClicked : null,
    ctor : function () {
        this._super();
    },
    
    addItem : function (item) {
        this.mItem.push(item);
        this.addChild(item);
        var thiz = this;
        item.addClickEventListener(function (item) {
            thiz.onClickedItem(item);
        });
    },

    onClickedItem : function (item) {
        if(this.itemClicked){
            this.itemClicked.unSelect();
            this.itemClicked = null;
        }
        this.itemClicked = item;
        this.itemClicked.select();
    },
    
    selectItem : function (index) {
        this.onClickedItem(this.mItem[index]);
    },

    onEnter : function () {
        this._super();
        itemClicked = null;
        for(var i=0; i<this.mItem.length; i++){
            this.mItem[i].unSelect(true);
        }
    }
});