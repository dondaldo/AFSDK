pageInstance = {}
console = {
log:function(){
    var argStrings = _.map(arguments, function(item){return item.toString()});
    af_scope.log(argStrings.join(", "));
}
}

extend = function(className, ParentClass){
    Base[className] = function(){
        ParentClass.apply(this, arguments);
    }
    Base[className].prototype = Object.create(ParentClass.prototype);
    return Base[className];
}

var UIDGenerator = function(){
    this.count = 0;
}

UIDGenerator.prototype.generate = function(){
    this.count++;
    return this.count;
}

var LocalDataProvider = function(){
    this.uidGenerator = new UIDGenerator();
    this.$localdataCallbacks = {};
}
var localDataProvider = new LocalDataProvider();

LocalDataProvider.prototype.setLocalData = function(key, value, callback, expTime){
    var callbackId = this.uidGenerator.generate();
    if(callback){
        this.$localdataCallbacks[callbackId] = callback;
    }
    if(!expTime){
        expTime=0;
    }
    af_scope.send("local-set", {key:key, value:value, expTime:expTime, callbackId:callbackId});
}

LocalDataProvider.prototype.onCallback = function(callbackId, response){
    if(this.$localdataCallbacks[callbackId]){
        if(response){
            this.$localdataCallbacks[callbackId](response)
        } else {
            this.$localdataCallbacks[callbackId]();
        }
        delete this.$localdataCallbacks[callbackId];
    }
}
LocalDataProvider.prototype.getLocalData = function(key, callback){
    var callbackId = this.uidGenerator.generate();
    this.$localdataCallbacks[callbackId] = callback;
    af_scope.send("local-get", {key:key, callbackId:callbackId});
}

LocalDataProvider.prototype.userDelete = function(callback){
    var callbackId = this.uidGenerator.generate();
    this.$localdataCallbacks[callbackId] = callback;
    af_scope.send("user-delete", {callbackId:callbackId});
    
}

LocalDataProvider.prototype.deleteLocalData = function(key,callback){
    var callbackId = this.uidGenerator.generate();
    this.$localdataCallbacks[callbackId] = callback;
    af_scope.send("local-delete", {key:key, callbackId:callbackId});
}

LocalDataProvider.prototype.removeLocalData = function(callback){
    var callbackId = this.uidGenerator.generate();
    this.$localdataCallbacks[callbackId] = callback;
    af_scope.send("local-clear", {callbackId:callbackId});
}

LocalDataProvider.prototype.userGet = function(callback){
    var callbackId = this.uidGenerator.generate();
    this.$localdataCallbacks[callbackId] = callback;
    af_scope.send("user-get", {callbackId:callbackId});
}

LocalDataProvider.prototype.userSet = function(value, callback){
    var callbackId = this.uidGenerator.generate();
    this.$localdataCallbacks[callbackId] = callback;
    af_scope.send("user-set", { value:value, callbackId:callbackId});
}

var Base = function(){
    this.$callbackFunctions = {};
}

Base.prototype.setLocalData= localDataProvider.setLocalData.bind(localDataProvider);
Base.prototype.getLocalData= localDataProvider.getLocalData.bind(localDataProvider);
Base.prototype.removeLocalData= localDataProvider.removeLocalData.bind(localDataProvider);
Base.prototype.deleteLocalData= localDataProvider.deleteLocalData.bind(localDataProvider);
Base.prototype.userGet= localDataProvider.userGet.bind(localDataProvider);
Base.prototype.userSet= localDataProvider.userSet.bind(localDataProvider);
Base.prototype.userDelete= localDataProvider.userDelete.bind(localDataProvider);


Base.prototype.sendAsync = function(intentString, intentData, callback){
    var key = intentString+JSON.stringify(intentData);
    pageInstance.$callbackFunctions[key] = callback;
    intentData.$tagData = key;
    af_scope.send("bg-intent", {intent:intentString,intentData:intentData});
}

Base.prototype.send = function(intentString, intentData, progressViewClass, progressItemData){
    var itemDataRef = pageInstance.uidGenerator.generate();
    pageInstance.$dataRefs[itemDataRef] = progressItemData;
    af_scope.send("intent", {intent:intentString,intentData:intentData, progressView:{className:progressViewClass, itemDataRef:itemDataRef}});
}

Base.prototype.sendWithStack = function(intentString, intentData, transactionStateIdentifier, progressViewClass, progressItemData){
    var itemDataRef = pageInstance.uidGenerator.generate();
    pageInstance.$dataRefs[itemDataRef] = progressItemData;
    af_scope.send("intent", {intent:intentString,intentData:intentData, transactionStateIdentifier:transactionStateIdentifier, progressView:{className:progressViewClass, itemDataRef:itemDataRef}});
}

Base.prototype.onAsyncData = function(response){
    var tag = response.$tagData;
    if(this.$callbackFunctions[tag]){
        this.$callbackFunctions[tag].call(this,null,response);
        delete this.$callbackFunctions[tag]
    }
}

Base.Page = function(_viewData, _state, _props){
    Base.call(this);
    this.viewData = _viewData;
    this.state = _state;
    this.viewParams = {};
    this.props = _props;
    this.virtualView = null;
    this.subPages = [];
    this.uidGenerator = new UIDGenerator();
    if(this.onCreatePage){
        (this.onCreatePage).call(this);
    }
    this.$webInterceptCallbacks = {};
    this.$datePickerCallbacks = {};
    this.$dataRefs = {};
    
}
Base.Page.prototype = Object.create(Base.prototype);

Base.Page.prototype.createRef = function(val){
    var itemDataRef = this.uidGenerator.generate();
    this.$dataRefs[itemDataRef] = val;
    return itemDataRef;
}

Base.Page.prototype.createRefArray = function(vals){
    return _.map(vals, function(item){
                 return this.createRef(item);
                 }.bind(this));
}

Base.Page.prototype.createRefWithKeys = function(vals){
    return _.map(vals, function(item){
                 return {"refId":this.createRef(item.item), "type":item.type};
                 }.bind(this));
}

Base.Page.prototype.popNavigation = function(){
    af_scope.send("pop-stack",{});
}

Base.Page.prototype.clearNavigationTill = function(identifier){
    af_scope.send("clear-stack",{identifier:identifier});
}

Base.Page.prototype.showPopUp = function(className,itemData){
    var itemDataRef = pageInstance.uidGenerator.generate();
    pageInstance.$dataRefs[itemDataRef] = itemData;
    af_scope.send("pop-up", {className:className,itemDataRef:itemDataRef});
}

Base.Page.prototype.showBottomSheet = function(className,itemData, fullscreen){
    var itemDataRef = pageInstance.uidGenerator.generate();
    pageInstance.$dataRefs[itemDataRef] = itemData;
    af_scope.send("pop-up", {className:className,itemDataRef:itemDataRef, alertType:"bottom-sheet"});
}

Base.Page.prototype.dismissPopUp = function(){
    af_scope.send("dismiss-alert",{alertType:"pop-up"});
}

Base.Page.prototype.dismissBottomSheet = function(){
    af_scope.send("dismiss-alert", {alertType:"bottom-sheet"});
}
Base.Page.prototype.dismissWebIntercept = function(){
    af_scope.send("dismiss-webintercept", {alertType:"web-intercept"});
}

Base.Page.prototype.setResult = function(postData){
    af_scope.send("set-result",{postData:postData});
}

Base.Page.prototype.dismissMicroApp = function(postData){
    if(postData){
        af_scope.send("dismiss", {postData:postData, dismissType:"close"});
    }else{
        af_scope.send("dismiss", {dismissType:"close"});
    }
}

Base.Page.prototype.handOffMicroApp = function(postData){
    af_scope.send("dismiss", {postData:postData, dismissType:"hand-off"});
}

Base.Page.prototype.launchMicroApp = function(options){
    af_scope.send("open-microapp", options);
}

Base.Page.prototype.openWebIntercept = function(options,interceptCallback,cancelCallback){
    var callbackId = pageInstance.uidGenerator.generate();
    pageInstance.$webInterceptCallbacks[callbackId] = {};
    if(cancelCallback){
        pageInstance.$webInterceptCallbacks[callbackId].onCancelCallback = cancelCallback;
    }
    pageInstance.$webInterceptCallbacks[callbackId].interceptCallback = interceptCallback;
    options.callbackId = callbackId;
    af_scope.send("web-intercept", options);
}

Base.Page.prototype.onWebIntercept = function(callbackId, url){
    if(pageInstance.$webInterceptCallbacks[callbackId]){
        pageInstance.$webInterceptCallbacks[callbackId].interceptCallback(url);
    }
    delete pageInstance.$webInterceptCallbacks[callbackId];
}

Base.Page.prototype.onCancelWebIntercept = function(callbackId){
    if(pageInstance.$webInterceptCallbacks[callbackId].onCancelCallback){
        pageInstance.$webInterceptCallbacks[callbackId].onCancelCallback();
    }
    return false
}

Base.Page.prototype.pickDate = function(options, callback){
    var callbackId = pageInstance.uidGenerator.generate();
    pageInstance.$datePickerCallbacks[callbackId] = callback;
    options.callbackId = callbackId;
    af_scope.send("date-picker", options);
}

Base.Page.prototype.onDatePicked = function(callbackId, arg1, arg2){
    pageInstance.$datePickerCallbacks[callbackId](arg1,arg2);
    delete pageInstance.$datePickerCallbacks[callbackId];
}

Base.Page.prototype.raiseEvent = function(eventName,payload){
    af_scope.send("raise-app-event", {eventName:eventName,payload:payload});
}

Base.Page.prototype.raiseTransactionEvent = function(eventName,payload){
    af_scope.send("raise-transaction-event", {eventName:eventName,payload:payload});
}

Base.Page.prototype.updateUserData = function(payload){
    af_scope.send("raise-user-event", {payload:payload});
}

Base.Body = function(_viewData, _state, _props){
    Base.Page.call(this, _viewData, _state, _props);
}
Base.Body.prototype = Object.create(Base.Page.prototype);

Base.Header = function(_viewData, _state, _props){
    Base.Page.call(this, _viewData, _state, _props);
}
Base.Header.prototype = Object.create(Base.Page.prototype);

Base.Footer = function(_viewData, _state, _props){
    Base.Page.call(this, _viewData, _state, _props);
}
Base.Footer.prototype = Object.create(Base.Page.prototype);

Base.Pop = function(_viewData, _state, _props, itemData){
    Base.Page.call(this, _viewData, _state, _props);
    this.itemData = itemData;
}
Base.Pop.prototype = Object.create(Base.Page.prototype);

Base.Cell = function(_viewData, _state, _props, index, itemData, sourceDataLength){
    Base.Page.call(this, _viewData, _state, _props);
    this.index = index;
    this.itemData = itemData;
    this.sourceDataLength = sourceDataLength;
}
Base.Cell.prototype = Object.create(Base.Page.prototype);

var calculateDiffNUpdateIds = function(newView, oldView, diffs){
    diffs = diffs || {added:[], deleted:[], changed:[]};
    if(newView.item === oldView.item){
        newView.$viewId = oldView.$viewId;
        if(!_.isEqual(oldView.props, newView.props)){
            diffs.changed.push({item:newView.item,props:newView.props,$viewId:newView.$viewId});
        }
        if(newView.children && oldView.children){
            _.each(newView.children, function(newItem, index){
                   calculateDiffNUpdateIds(newItem, oldView.children[index], diffs);
                   });
        }
    }
    return diffs;
}

var generateViewIds = function(virtualView, uidGenerator){
    if(virtualView.item){
        virtualView.$viewId = uidGenerator.generate();
    }
    if(virtualView.children){
        _.each(virtualView.children, function(item){
               generateViewIds(item, uidGenerator);
               });
    }
}

var updateDynamicViews = function(virtualView){
    if(virtualView.item == "af-listview" || virtualView.item == "af-slideview" || virtualView.item == "af-static-listview"){
        virtualView.cells = {};
        if(virtualView.children.length==1){
            virtualView.cells.cell = virtualView.children[0];
        }
        else{
            _.each(virtualView.children, function(item){
                   virtualView.cells[item.props["cell-type"]] = item;
                   });
        }
        delete virtualView.children;
    }
    if(virtualView.children){
        _.each(virtualView.children, function(item){
               updateDynamicViews(item);
               });
    }
}

Base.Page.prototype.virtualRender = function(){
    updateDynamicViews(this.viewData);
    this.virtualView = generateProps(this.viewData, this);
    generateViewIds(this.virtualView, this.uidGenerator);
    if(this.init){this.init();}
    return this.virtualView;
}

var generateProps = function(viewData, data){
    var viewObj = JSON.parse(JSON.stringify(viewData));
    if(viewObj.props){
        try{
            viewObj.props = JSON.parse((_.template(JSON.stringify(viewData.props))(data)).replaceAll("\n","\\n"));
        }catch(err){
            if(viewData.props.visible){
                try{
                    viewObj.props.visible = _.template(viewData.props.visible)(data);
                }catch(err){
                    viewObj.props.visible = false;
                }
            }
        }
    }
    viewObj.children = _.map(viewData.children, function(item){
                             return generateProps(item, data);
                             });
    return viewObj;
}

Base.Page.prototype.commitChanges = function(sourceId){
    var newVirtualView = generateProps(this.viewData, this);
    var __state = this.state;
    var viewChanges = calculateDiffNUpdateIds(newVirtualView, this.virtualView);
    this.virtualView = newVirtualView;
    _.each(this.subPages,function(subPage){
           var newVirtualView = generateProps(subPage.viewData, subPage);
           viewChanges = calculateDiffNUpdateIds(newVirtualView, subPage.virtualView, viewChanges);
           subPage.virtualView = newVirtualView;
           });
    if(viewChanges.added.length==0 && viewChanges.deleted.length==0 && viewChanges.changed.length==0){
        return;
    }
    if(sourceId){
        af_scope.updateWithSource(viewChanges, sourceId);
    }
    else{
        af_scope.update(viewChanges);
    }
}

// commitStateChanges is to be deprecated soon
Base.Page.prototype.commitStateChanges = function(sourceId){
    var newVirtualView = generateProps(this.viewData, this);
    var __state = this.state;
    var viewChanges = calculateDiffNUpdateIds(newVirtualView, this.virtualView);
    this.virtualView = newVirtualView;
    _.each(this.subPages,function(subPage){
           var newVirtualView = generateProps(subPage.viewData, subPage);
           viewChanges = calculateDiffNUpdateIds(newVirtualView, subPage.virtualView, viewChanges);
           subPage.virtualView = newVirtualView;
           });
    if(viewChanges.added.length==0 && viewChanges.deleted.length==0 && viewChanges.changed.length==0){
        return;
    }
    if(sourceId){
        af_scope.updateWithSource(viewChanges, sourceId);
    }
    else{
        af_scope.update(viewChanges);
    }
}

Base.Page.prototype.createCellPage = function(viewData, index, itemDataRef, sourceDataLength) {
    var itemData = this.$dataRefs[itemDataRef];
    var className = (viewData.props||{})["class-name"];
    var Class = Base.Cell;
    if(className){
        if(Base[className]){
            Class = Base[className];
        }
    }
    var subPage = new Class(viewData, this.state, this.props, index, itemData, sourceDataLength);
    subPage.uidGenerator = this.uidGenerator;
    subPage.pageInstance = pageInstance;
    this.subPages.push(subPage);
    return {subPageId:this.subPages.length-1,viewData:subPage.virtualRender()};
}

Base.Page.prototype.createPopPage = function(viewData, itemDataRef){
    var itemData = pageInstance.$dataRefs[itemDataRef];
    var className = (viewData.props||{})["class-name"];
    var Class = Base.Pop;
    if(className){
        if(Base[className]){
            Class = Base[className];
        }
    }
    var subPage = new Class(viewData, this.state, this.props, itemData);
    subPage.uidGenerator = this.uidGenerator;
    subPage.pageInstance = pageInstance;
    this.subPages.push(subPage);
    return {subPageId:this.subPages.length-1,viewData:subPage.virtualRender()};
}

Base.Page.prototype.createHeaderPage = function(viewData){
    var className = (viewData.props||{})["class-name"];
    var Class = Base.Header;
    if(className){
        if(Base[className]){
            Class = Base[className];
        }
    }
    var subPage = new Class(viewData, this.state, this.props);
    subPage.uidGenerator = this.uidGenerator;
    subPage.pageInstance = pageInstance;
    this.subPages.push(subPage);
    return {subPageId:this.subPages.length-1,viewData:subPage.virtualRender()};
}

Base.Page.prototype.createFooterPage = function(viewData){
    var className = (viewData.props||{})["class-name"];
    var Class = Base.Footer;
    if(className){
        if(Base[className]){
            Class = Base[className];
        }
    }
    var subPage = new Class(viewData, this.state, this.props);
    subPage.uidGenerator = this.uidGenerator;
    subPage.pageInstance = pageInstance;
    this.subPages.push(subPage);
    return {subPageId:this.subPages.length-1,viewData:subPage.virtualRender()};
}

var createPage = function(viewData, state, props){
    if(Base.prepareData){
        state = Base.prepareData(state);
    }
    pageInstance = new Base.Body(viewData, state, props);
}

Base.prototype.onResume = function(){}
Base.prototype.onPause = function(){}


Base.Page.prototype.openLink = function(link){
    af_scope.send("open-link", {"link":link});
}


String.prototype.capitalize = function() {
    var splits = this.split(" ")
    return _.map(splits, function(item){return item.charAt(0).toUpperCase() + item.slice(1)}).join(" ");
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
