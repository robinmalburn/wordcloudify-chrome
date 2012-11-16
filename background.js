/*
 *Copyright (c) 2012 Robin Malburn
 *See the file license.txt for copying permission.
*/

/*jslint vars: true, white: true, browser: true, devel: true */ /*global  chrome*/

var instances = {
    tabs : []
};

instances.methods = {
    load : function(tabID){
        "use strict";
        instances.tabs[tabID].active = true;
        chrome.browserAction.setIcon({
            "path" : {
                "19" : "cloud_on_19.png",
                "38" : "cloud_on_38.png"
            },
            "tabId" : tabID
        });
        chrome.tabs.sendMessage(tabID, {
            action: "bind"
        });
    },
    unload : function(tabID, noMessage){
        "use strict";
        instances.tabs[tabID].active = false;
        chrome.browserAction.setIcon({
            "path" : {
                "19" : "cloud_off_19.png",
                "38" : "cloud_off_38.png"
            },
            "tabId" : tabID
        });
        if(!noMessage){
            chrome.tabs.sendMessage(tabID, {
                action: "unbind"
            });
        }
    }
};

instances.handlers = {
    click : function(tab){
        "use strict";
        
        //Prevent loading on Chrome's "special" pages
        if (tab.url.indexOf("chrome") === 0 || 
            tab.url.indexOf("file") === 0 || 
            tab.url.indexOf("https://chrome.google.com/extensions") === 0 || 
            tab.url.indexOf("https://chrome.google.com/webstore") === 0){
            return false;
        }
        
        if(tab.status === "complete"){               
            if(!instances.tabs[tab.id]){
                instances.tabs[tab.id] = {
                    loaded: false,
                    active: false
                };
            }
        
            if(!instances.tabs[tab.id].loaded){
                    chrome.tabs.executeScript(
                    null, 
                    {
                        file : "jquery-1.8.2.min.js"
                    }, 
                    function(){
                        chrome.tabs.executeScript(null, {
                            file : "wordcloudify.js"
                        });
                        chrome.tabs.insertCSS(null, {
                            file : "app.css"
                        });
                        chrome.tabs.executeScript(null, {
                            file : "selector.js"
                        }, function(){
                            instances.tabs[tab.id].loaded = true;
                            instances.methods.load(tab.id);
                        });
                    }
                );

            }
            else{
                if(instances.tabs[tab.id].active){
                    instances.methods.unload(tab.id);
                }
                else{
                    instances.methods.load(tab.id);
                }
            }
        }
    },
    removed : function(tabID){
        "use strict";
        if(instances.tabs[tabID]){
            instances.tabs[tabID] = {
                loaded : false,
                active : false
            };
        }
    },
    updated : function(tabID){
        "use strict";
        if(instances.tabs[tabID]){
            chrome.browserAction.setIcon({
                "path" : {
                    "19" : "cloud_off_19.png",
                    "38" : "cloud_off_38.png"
                },
                "tabId" : tabID
            });
            delete instances.tabs[tabID];
        }
    }
};


chrome.browserAction.onClicked.addListener(instances.handlers.click);

chrome.tabs.onRemoved.addListener(instances.handlers.removed);

chrome.tabs.onUpdated.addListener(instances.handlers.updated);

//Message listener
chrome.extension.onMessage.addListener(function(request, sender){
    "use strict";
    if(request.action === "unbound"){
        instances.methods.unload(sender.tab.id, true);
    } 
});