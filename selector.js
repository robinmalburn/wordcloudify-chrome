/*
 *Copyright (c) 2012 Robin Malburn
 *See the file license.txt for copying permission.
*/

/*jslint vars: true, white: true, browser: true, devel: true */ /*global  $, chrome*/

$("body").on("removed.wordcloudify", function(){
    "use strict";
    chrome.extension.sendMessage({
        action: "unbound"
    });
});

function bind_selector(){
    "use strict";
    
    //unbind all wordcloudify events to prevent duplicating bindings if using the extension multiple times
    $("body").off(".wordcloudify-selector");
    
    $("body").wordcloudify();

    $("body").on("mouseover.wordcloudify-selector", function(e){
        e.preventDefault();
        e.stopPropagation();
        $(e.target).addClass("wordcloudify-selector");
    });

    $("body").on("mouseout.wordcloudify-selector", function(e){
        e.preventDefault();
        e.stopPropagation();
        $(e.target).removeClass("wordcloudify-selector");
    });

    $("body").on("click.wordcloudify-selector", function(e){
        e.preventDefault();
        $(".wordcloudify-selector").removeClass("wordcloudify-selector");
        $("body").unbind(".wordcloudify-selector");

        $("body").wordcloudify("render", $(e.target));
    });
}
    
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        "use strict";
        
        if(request.action === "bind"){
            bind_selector();
        }
        else if(request.action === "unbind"){
            $("body").unbind(".wordcloudify-selector");
            $("body").wordcloudify("destroy");
            $(".wordcloudify-selector").removeClass("wordcloudify-selector");
        }
        else{
            console.log("invalid action", request.action);
        }
    });