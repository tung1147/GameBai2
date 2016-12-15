/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var newui = newui || {};
newui.TableView = ccui.ScrollView.extend({
    ctor : function (size, columnCount) {
        this._super();

        this.animationHandler = null
        this._parentIsPageView = false;
        this._checkParentPageView = false;
        this._allItems = [];
        this._padding = 0.0;
        this._marginLeft = 0.0;
        this._marginRight = 0.0;
        this._marginTop = 0.0;
        this._marginBottom = 0.0;
        this._direction = ccui.ScrollView.DIR_VERTICAL;
        this._refreshView = false;
        this._moveByTouch = false;
        this._columnCount = columnCount;

        this.setContentSize(size);
        this.setBounceEnabled(true);
        this.setScrollBarEnabled(false);

        this._contentRect = cc.rect(0,0,size.width, size.height);

        if ('mouse' in cc.sys.capabilities) {
            this._initMouseScrollEvent();
        }
    },

    _initMouseScrollEvent : function () {
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseScroll: function (event) {
                if(thiz._checkViewVisible() && thiz.isRunning() && !thiz._isInterceptTouch && !this._moveByTouch){
                    var delta = cc.sys.isNative ? event.getScrollY() * 6 : -event.getScrollY();
                    var p = thiz.convertToNodeSpace(event.getLocation());
                    if(cc.rectContainsPoint(thiz._contentRect, p)){
                        return thiz.onMouseScrolling(delta);
                    }
                }
                return false;
            }
        }, this);
    },

    _checkViewVisible : function () {
        var node = this;
        while(node){
            if(!node.isVisible()){
                return false;
            }
            node = node.getParent();
        }
        return true;
    },

    onMouseScrolling : function (delta) {
        if(this._direction == ccui.ScrollView.DIR_VERTICAL){
            var maxDelta = this.getContentSize().height/10;
        }
        else{
            var maxDelta = this.getContentSize().width/10;
        }
        if(Math.abs(delta) > maxDelta){
            if(delta > 0){
                delta = maxDelta;
            }
            else{
                delta = -maxDelta;
            }
        }


        if(this._direction == ccui.ScrollView.DIR_VERTICAL){
            var pDelta = cc.p(0, delta);
            // var outOfBoundary = this._getHowMuchOutOfBoundary(pDelta);
            // if(!this._fltEqualZero(outOfBoundary)) {
            //     pDelta.x += outOfBoundary.x;
            //     pDelta.y += outOfBoundary.y;
            // }
            this._moveInnerContainer(pDelta, true);
        }
        else{
            var pDelta = cc.p(delta, 0);
            // var outOfBoundary = this._getHowMuchOutOfBoundary(pDelta);
            // if(!this._fltEqualZero(outOfBoundary)) {
            //     pDelta.x += outOfBoundary.x;
            //     pDelta.y += outOfBoundary.y;
            // }
            this._moveInnerContainer(pDelta, true);
        }
        return true;
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
        if(this._refreshView) {
            this.forceRefreshView();
        }
    },
    forceRefreshView : function () {
        if(this._direction == ccui.ScrollView.DIR_VERTICAL){
            this.refreshViewVertical();
        }
        else{
            this.refreshViewHorizontal();
        }
        this._refreshView = false;
    },
    refreshViewHorizontal : function () {
        cc.log("refreshViewVertical");
        var containerWidth = 0.0;
        var containerHeight = this.getContentSize().height;

        if(this._allItems.length > 0){
            var itemSize = this._allItems[0].getContentSize();
            var col = Math.ceil(this._allItems.length / this._columnCount);
            containerWidth = itemSize.width * col + this._padding*(col - 1) + this._marginLeft + this._marginRight;

            var rowPadding = (containerHeight - this._marginTop - this._marginBottom - (this._columnCount * itemSize.height)) / (this._columnCount + 1);
            if(rowPadding < 0.0){
                rowPadding = 0.0;
            }

            var columnIndex = 0;
            var x = this._marginLeft + itemSize.width/2;
            var y = containerHeight - this._marginTop - itemSize.height/2 - rowPadding;

            for(var i=0; i<this._allItems.length;i++){
                this._allItems[i].setPosition(x, y);
               // cc.log(x + " - "+ y);

                columnIndex++;
                if(columnIndex >= this._columnCount){
                    columnIndex = 0;
                    y = containerHeight - this._marginTop - itemSize.height/2 - rowPadding;
                    x += (this._padding + itemSize.width);
                }
                else{
                    y -= (rowPadding + itemSize.height);
                }
            }
        }

        if(containerWidth < this.getContentSize().width){
            containerWidth = this.getContentSize().width;
        }
        this.setInnerContainerSize(cc.size(containerWidth, containerHeight));
    },
    refreshViewVertical : function () {
        var containerWidth = this.getContentSize().width;
        var containerHeight = 0.0;

        if(this._allItems.length > 0){
            var itemSize = this._allItems[0].getContentSize();
            var row = Math.ceil(this._allItems.length / this._columnCount);
            containerHeight = itemSize.height * row + this._padding*(row - 1) + this._marginTop + this._marginBottom;
            if(containerHeight < this.getContentSize().height){
                containerHeight = this.getContentSize().height;
            }

          //  var padding = 0.0;
            var colPadding = (containerWidth - this._marginLeft - this._marginRight - (this._columnCount * itemSize.width)) / (this._columnCount + 1);
            // if(colPadding < 0.0){
            //     colPadding = 0.0;
            // }

            var rowIndex = 0;
            var x = this._marginLeft + colPadding + itemSize.width/2;
            var y = containerHeight - this._marginTop - itemSize.height/2;

            for(var i=0; i<this._allItems.length;i++){
                this._allItems[i].setPosition(x, y);
               // cc.log(x + " - "+ y);

                rowIndex++;
                if(rowIndex >= this._columnCount){
                    rowIndex = 0;

                    x = this._marginLeft + colPadding + itemSize.width/2;
                    y -= (this._padding + itemSize.height);
                }
                else{
                    x += (colPadding + itemSize.width);
                }
            }

        }

        this.setInnerContainerSize(cc.size(containerWidth, containerHeight));
    },
    getRowItems :function(rowIndex){
        var items = [];
        if(this._direction == ccui.ScrollView.DIR_VERTICAL){
            for(var i=0;i<this._columnCount;i++){
                var idx = rowIndex*this._columnCount + i;
                if(idx < this._allItems.length){
                    items.push(this._allItems[idx]);
                }
            }
        }
        else{
            var col = Math.ceil(this._allItems.length / this._columnCount);
            for(var i=0; i<col; i++){
                var idx = rowIndex + i * this._columnCount;
                if(idx < this._allItems.length){
                    items.push(this._allItems[idx]);
                }
            }
        }

        return items;
    },
    runMoveEffect : function (moveSpeed, delayPerColumn, delayPerRow) {
        this.forceRefreshView();
        if(this._allItems.length <= 0){
            return;
        }

        var row = this._columnCount;
        if(this._direction == ccui.ScrollView.DIR_HORIZONTAL){
            var col = Math.ceil(this._allItems.length / this._columnCount);
            row = Math.ceil(this._allItems.length / col);
        }
        else{
            row = Math.ceil(this._allItems.length / this._columnCount);
        }

        var itemSize = this._allItems[0].getContentSize();
        var dx = this.getContentSize().width + itemSize.width/2;
        var duration = dx/moveSpeed;
        if(moveSpeed < 0){
            dx = -dx;
            duration = -duration;
        }

        var delayTime1 = 0.0;
        var delayTime2 = 0.0;
        var maxDelayTime = 0.0;
        var thiz = this;
        for(var i=0; i<row; i++){
            var items = this.getRowItems(i);

            delayTime1 = 0.0;
            for(var j=0;j<items.length;j++){
                var item = items[j];
                item.x += dx;
                var delayTime = delayTime1 + delayTime2;
                if(delayTime > maxDelayTime){
                    maxDelayTime = delayTime;
                }
                item.stopAllActions();
                this.startItemAnimation(item);
                (function (item) {
                    item.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.EaseCircleActionOut(new cc.MoveBy(duration, cc.p(-dx, 0))), new cc.CallFunc(function () {
                        thiz.finishedItemAnimation(item);
                    })));
                })(item);

                delayTime1 += delayPerColumn;
            }
            delayTime2 += delayPerRow;
        }

        var thiz = this;
        thiz.setEnabled(false);
        this.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.CallFunc(function () {
            thiz.setEnabled(true);
        })));
    },

    startItemAnimation : function (item) {
       // cc.log("startItemAnimation: "+item);
    },
    finishedItemAnimation : function (item) {
       // cc.log("finishedItemAnimation: "+item);
    },

    setDirection : function (direction) {
        this._super(direction);
        this._refreshView = true;
    },

    insertItem : function (item, index) {
        item.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(item);

        this._allItems.splice(index, 0, item);
        this._refreshView = true;
    },

    getItem : function (index) {
        return this._allItems[index];
    },

    size : function () {
        return this._allItems.length;
    },

    removeAllItems : function () {
        this.removeAllChildrenWithCleanup(true);
        this._refreshView = true;
    },

    pushItem : function (item) {
        item.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(item);
        this._allItems.push(item);
        this._refreshView = true;
    },

    removeItem : function(item) {
        this._refreshView = true;
    },

    setAnimationHandler : function (func) {
        this.animationHandler = func;
    },

    removeAllChildrenWithCleanup : function (cleanup) {
        this._allItems = [];
        //update container size
        this._super(cleanup);
    },

    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            return new newui.TableView.WebGLRenderCmd(this);
        else
            return new newui.TableView.CanvasRenderCmd(this);
    },
    onTouchBegan: function (touch, event) {
        if (!this._checkParentPageView){
            if (this._direction == ccui.ScrollView.DIR_VERTICAL){
                var parent = this.getParent();
                if (parent instanceof ccui.Layout){
                    parent = parent.getParent();
                    if (parent instanceof ccui.PageView){
                        this._parentIsPageView = true;
                    }
                }
            }
            this._checkParentPageView = true;
        }

        if (!this._parentIsPageView){
            var ret = ccui.ScrollView.prototype.onTouchBegan.call(this,touch,event);
            if(ret){
                this._moveByTouch = true;
            }
            return ret;
        }

        this._propagateTouchEvents = true;
        var bret = ccui.ScrollView.prototype.onTouchBegan.call(this,touch,event);
        this._propagateTouchEvents = false;
        if (bret){
            this._startPoint = touch.getLocation();
            this._moveThis = false;
            this._moveParent = false;
            this._moveByTouch = true;
        }
        return bret;
    },

    onTouchMoved: function (touch, event) {
        if (this._parentIsPageView){
            if (!this._moveThis && !this._moveParent){
                var p =  cc.pSub(touch.getLocation(), this._startPoint);
                if (cc.pLength(p) > 10.0){
                    if (Math.abs(p.x) > Math.abs(p.y)){
                        this._moveParent = true;
                    }
                    else{
                        this._moveThis = true;
                    }
                }
            }

            if (this._moveThis){
                ccui.ScrollView.prototype.onTouchMoved.call(this,touch,event);
            }
            else if (this._moveParent){
                this._propagateTouchEvents = true;
                ccui.Layout.prototype.onTouchMoved.call(this,touch,event);
                this._propagateTouchEvents = false;
            }
        }
        else{
            ccui.ScrollView.prototype.onTouchMoved.call(this,touch,event);
        }
    },
    onTouchEnded: function (touch, event) {
        this._moveByTouch = false;
        if (this._parentIsPageView){
            this._propagateTouchEvents = true;
            ccui.ScrollView.prototype.onTouchEnded.call(this,touch,event);
            this._propagateTouchEvents = false;
        }
        else{
            ccui.ScrollView.prototype.onTouchEnded.call(this,touch,event);
        }
    },
    onTouchCancelled: function (touch, event) {
        if (this._parentIsPageView){
            this._propagateTouchEvents = true;
            ccui.ScrollView.prototype.onTouchCancelled.call(this,touch,event);
            this._propagateTouchEvents = false;
        }
        else{
            ccui.ScrollView.prototype.onTouchCancelled.call(this,touch,event);
        }
    },
    visit : function (parentCmd) {
        if (!this._visible){
            return;
        }
        this.refreshView();
        this._super(parentCmd);
    }
});

/* create render cmd */
(function(){
    if(!ccui.ProtectedNode.CanvasRenderCmd)
        return;
    newui.TableView.CanvasRenderCmd = function(renderable){
        ccui.ScrollView.CanvasRenderCmd.call(this, renderable);
        //this._needDraw = true;
        this._dirty = false;
    };

    var proto = newui.TableView.CanvasRenderCmd.prototype = Object.create(ccui.ScrollView.CanvasRenderCmd.prototype);
    proto.constructor = newui.TableView.CanvasRenderCmd;

    proto.visit = function(parentCmd) {
        var node = this._node;
        if (!node._visible)
            return;
        var currentID = node.__instanceId;

        cc.renderer.pushRenderCommand(this);
        //cc.renderer._turnToCacheMode(currentID);

        node.visit(parentCmd);
        this.layoutVisit(parentCmd);

        this._dirtyFlag = 0;
        //cc.renderer._turnToNormalMode();
    };

    proto.rendering = function (ctx) {
        var currentID = this._node.__instanceId;
        var locCmds = cc.renderer._cacheToCanvasCmds[currentID], i, len,
            scaleX = cc.view.getScaleX(),
            scaleY = cc.view.getScaleY();
        var context = ctx || cc._renderContext;
        context.computeRealOffsetY();

        this._node.updateChildren();

        for (i = 0, len = locCmds.length; i < len; i++) {
            var checkNode = locCmds[i]._node;
            if(checkNode instanceof newui.TableView)
                continue;
            if(checkNode && checkNode._parent && checkNode._parent._inViewRect === false)
                continue;
            locCmds[i].rendering(context, scaleX, scaleY);
        }
    };
})();

(function(){
    if(!ccui.ProtectedNode.WebGLRenderCmd)
        return;
    newui.TableView.WebGLRenderCmd = function(renderable){
        ccui.ScrollView.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._dirty = false;
    };

    var proto = newui.TableView.WebGLRenderCmd.prototype = Object.create(ccui.ScrollView.WebGLRenderCmd.prototype);
    proto.constructor = newui.TableView.WebGLRenderCmd;

    proto.visit = function(parentCmd) {
        var node = this._node;
        if (!node._visible)
            return;
        var currentID = this._node.__instanceId;

        cc.renderer.pushRenderCommand(this);
        cc.renderer._turnToCacheMode(currentID);

        node.visit(parentCmd);
        this.layoutVisit(parentCmd);
        // Need to update children after do layout
        node.updateChildren();

        this._dirtyFlag = 0;
        cc.renderer._turnToNormalMode();
    };

    proto.rendering = function(ctx){
        var currentID = this._node.__instanceId,
            locCmds = cc.renderer._cacheToBufferCmds[currentID],
            i, len, checkNode, cmd,
            context = ctx || cc._renderContext;
        if (!locCmds) {
            return;
        }

        this._node.updateChildren();

        // Reset buffer for rendering
        context.bindBuffer(gl.ARRAY_BUFFER, null);

        for (i = 0, len = locCmds.length; i < len; i++) {
            cmd = locCmds[i];

            checkNode = cmd._node;
            if(checkNode instanceof newui.TableView)
                continue;
            if(checkNode && checkNode._parent && checkNode._parent._inViewRect === false)
                continue;

            if (cmd.uploadData) {
                cc.renderer._uploadBufferData(cmd);
            }
            else {
                cc.renderer._batchRendering();
                if (cmd._batchingSize > 0) {
                    cc.renderer._batchRendering();
                }
                cmd.rendering(context);
            }
        }
        cc.renderer._batchRendering();
    };
})();