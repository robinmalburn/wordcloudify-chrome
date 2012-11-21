/*
 *Copyright (c) 2012 Robin Malburn
 *See the file license.txt for copying permission.
 */

 /*jslint vars: true, white: true, browser: true, devel: true */ /*global  jQuery, chrome*/

 var selector = {};

//Object Collection
//=================
 selector.objects = {
    overlay : jQuery("<div />", {
        "id" : "wordcloudify-overlay"
    }),
    lightbox : jQuery("<div />", {
        "id" : "wordcloudify-lightbox"
        
    }),
    lightbox_contents : jQuery("<div />", {
        "id" : "wordcloudify-contents"
    })
};

//Build the lightbox
//==================
selector.objects.lightbox.append(selector.objects.lightbox_contents);

//Event Handlers
//==============
selector.handlers = {
    selector_mouseover_handler : function(e){
        "use strict";
    
        e.preventDefault();
        e.stopPropagation();
        jQuery(e.target).addClass("wordcloudify-selector");
    },
    selector_mouseout_handler : function(e){
        "use strict";
    
        e.preventDefault();
        e.stopPropagation();
        jQuery(e.target).removeClass("wordcloudify-selector");
    },
    selector_click_handler : function(e){
        "use strict";
    
        e.preventDefault();
        jQuery(".wordcloudify-selector").removeClass("wordcloudify-selector");
        jQuery("body").off(".wordcloudify-selector");

        selector.objects.lightbox_contents.wordcloudify("render", jQuery(e.target));
    
        selector.methods.show_wordcloud();
    },
    overlay_click_handler : function(){
        "use strict";
        selector.methods.hide_wordcloud();    
    }
};

//Methods
//=======
selector.methods = {
    hide_wordcloud : function(){
        "use strict";
    
        selector.objects.overlay.fadeOut();
        selector.objects.lightbox.fadeOut();
    
        selector.methods.destroy();
    
        chrome.extension.sendMessage({
            action: "unbound"
        });
    },
    show_wordcloud : function(){
        "use strict";
        selector.methods.center_elem(selector.objects.lightbox);
        selector.objects.overlay.fadeIn();
        selector.objects.lightbox.fadeIn();
    },
    init : function(){
        "use strict";

        //unbind all existing wordcloudify-selector bindings
        //to avoid mulitple accidental bindings
        jQuery("body").off(".wordcloudify-selector");
        selector.objects.overlay.off(".wordcloudify-selector");
    
        //Add the overlay + lightbox to the page in preparation
        jQuery("body").append(selector.objects.overlay);
        jQuery("body").append(selector.objects.lightbox);
    
        //bind events
        jQuery("body").on("mouseover.wordcloudify-selector", selector.handlers.selector_mouseover_handler);
        jQuery("body").on("mouseout.wordcloudify-selector", selector.handlers.selector_mouseout_handler);
        jQuery("body").on("click.wordcloudify-selector", selector.handlers.selector_click_handler);
        selector.objects.overlay.on("click.wordcloudify-selector", selector.handlers.overlay_click_handler);
    
        //Remove all wordcloudify-selector classes
        jQuery(".wordcloudify-selector").removeClass("wordcloudify-selector");
    
        selector.objects.lightbox_contents.wordcloudify({"cloud_limit" : 1000});
    },
    destroy : function(){
        "use strict";
    
        selector.objects.overlay.wordcloudify("destroy");
    
        jQuery(".wordcloudify-selector").removeClass("wordcloudify-selector");
    
        jQuery("body").off(".wordcloudify-selector");
        selector.objects.overlay.off(".wordcloudify-selector");

        selector.objects.overlay.remove();
        selector.objects.lightbox.remove();
    },
    center_elem : function(el){
        "use strict";

        var width = el.width();
        var height = el.height();
        var position = el.css("position");

        var window_width = jQuery(window).width();
        var window_height = jQuery(window).height();
        var scroll_top = jQuery(window).scrollTop();

        if(position === "fixed"){
            el.css({
                "top" : ((window_height / 2) - (height / 1.9))+"px",
                "left" : ((window_width / 2) - (width / 1.9))+"px"
            });
        }
        else if(position === "absolute"){
            el.css({
                "top" : (((window_height / 2) - (height / 1.9))+scroll_top)+"px",
                "left" : ((window_width / 2) - (width / 1.9))+"px"
            });    
        }

        
    }
};

chrome.extension.onMessage.addListener(
    function(request) {
        "use strict";
        
        if(request.action === "bind"){
            selector.methods.init();
        }
        else if(request.action === "unbind"){
            selector.methods.destroy();
        }
        else{
            console.log("invalid action", request.action);
        }
    });