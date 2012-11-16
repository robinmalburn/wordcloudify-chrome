/*
 *Copyright (c) 2012 Robin Malburn
 *See the file license.txt for copying permission.
*/
 
/*jslint vars: true, white: true, browser: true, devel: true */ /*global $, jQuery*/

(function($){
    "use strict";

    var defaults = {
        "stop_words" :["a","about","above","after","again","against","all","am","an","and","any","are","aren\'t","as","at","be","because","been","before","being","below","between"
        ,"both","but","by","can\'t","can","cannot","could","couldn\'t","did","didn\'t","do","does","doesn\'t","doing","don\'t","down","during","each","few","for","from","further","had","hadn\'t",
        "has","hasn\'t","have","haven\'t","having","he","he\'d","he\'ll","he\'s","her","here","here\'s","hers","herself","him","himself","his","how","how\'s","i","i\'d","i\'ll","i\'m","i\'ve",
        "if","into","in","isn\'t","is","it\'s","it","its","itself","let\'s","me","more","most","mustn\'t","my","myself","no","nor","not","of","off","on","once","only","or","other","ought",
        "our","ours ","ourselves","out","over","own","same","shan\'t","she","she\'d","she\'ll","she\'s","should","shouldn\'t","so","some","such","than","that","that\'s","the","their","theirs",
        "them","themselves","then","there","there\'s","these","they","they\'d","they\'ll","they\'re","they\'ve","this","those","through","to","too","under","until","up","very","was","wasn\'t"
        ,"we","we\'d","we\'ll","we\'re","we\'ve","were","weren\'t","what","what\'s","when","when\'s","where","where\'s","which","while","who","who\'s","whom","why","why\'s","with","won\'t","would"
        ,"wouldn\'t","you","you\'d","you\'ll","you\'re","you\'ve","your","yours","yourself","yourselves"],
        "cloud_limit" : 20,
        "min_font" : 0.75,
        "max_font" : 2.25,
        "font_unit" : "em"
    };
    
    var overlay = $("<div />", {
        "id" : "wordcloudify-overlay"
    });
                
    var lightbox = $("<div />", {
        "id" : "wordcloudify-lightbox"
    });
            
    var lightbox_contents = $("<div />",{
        "id" : "wordcloudify-contents"
    });
    
    /**
     * Get the x and y cordinates to centre the lightbox
     * @var number width
     * @var number height
     * @returns object
     */
    function get_centre_x_y(width, height){
        var page_height = $(window).height();
        var page_width = $(window).width();
        
        var x_pos = (page_width / 2) - (width / 1.9);
        var y_pos = (page_height / 2) - (height / 1.9);
        
        return {
            x : x_pos,
            y : y_pos
        };
    }
    
    /**
     * Sort array by word weight, or alphabetical if words share weight
     * @var object a
     * @var object b
     * @returns int
     */
    function array_sort_weight(a, b){
        if(a.weight === b.weight){
            return a.word > b.word ? 1 : a.word < b.word ? -1 : 0;
        }
                
        return a.weight < b.weight ? 1 : -1;
    }
    
    /**
     * Simple random-ish array sort.  
     * Should probably be a Fisher-Yates shuffle, but for now this will do
     * @var object a
     * @var object b
     * @returns number
     */
    function array_sort_random(a, b){
        return 0.5 - Math.random();
    }
    
    /**
     * Sorts array placing words with apostrophes at the top of the list, and then sorting alphabetically
     * @var object a
     * @var object b
     * @returns int
     */
    function array_sort_stop_words(a, b){
        
        if(a.toLowerCase()[0] === b.toLowerCase()[0]){
        
            var a_index = a.indexOf("'");
            var b_index = b.indexOf("'");
        
            if(a_index !== -1 && b_index === -1){
                return -1;
            }
            else if(a_index === -1 && b_index !== -1){
                return 1;
            }
            else if(a > b){
                return 1;
            }
            else if(a < b){
                return -1;
            }
            else{
                return 0;
            }
        }
        else{
            if(a > b){
                return 1;
            }
            else if(a < b){
                return -1;
            }
            else{
                return 0;
            }
        }

    }
    
    var methods = {
        init : function(options){

            var settings = $.extend(true, {}, defaults, options);
            
            settings.stop_words = settings.stop_words.sort(array_sort_stop_words);
            
            return this.each(function(){
                $(this).data("wordcloudify.settings", settings);
            });
        },
        render : function(selector){
            
            var settings = $(this).data("wordcloudify.settings") || defaults;
            
            settings.stop_words = settings.stop_words.sort(array_sort_stop_words);
            
            var text = "";
            
            var results = false;

            selector.each(function(){
                text += $(this).text();
            });

            if(typeof settings.stop_words === "object" && settings.stop_words.length > 0){
                var stop_words_regex = new RegExp("\\b("+settings.stop_words.join("|")+")\\b", "gi");
                text = text.replace(stop_words_regex, "");
            }
        
            var words = text.match(/\b[a-z]+('[a-z])?\b/gi);
                       
            if(words !== null && words.length > 0){
                
                var tmp_weighted_words = {};
                var weighted_words = [];
            
                for(var i = 0; i < words.length; i++){
                    if(tmp_weighted_words[words[i].toLowerCase()] === undefined){
                        tmp_weighted_words[words[i].toLowerCase()] = 1;
                    }
                    else{
                        tmp_weighted_words[words[i].toLowerCase()] += 1;
                    }
                }
                
                for(var word in tmp_weighted_words){
                    weighted_words.push({
                        "word" : word, 
                        "weight" :tmp_weighted_words[word]
                    });
                }
            
                weighted_words.sort(array_sort_weight);
            
                if(weighted_words.length > 0){
                    if(settings.cloud_limit > 0){
                        results = weighted_words.slice(0, settings.cloud_limit);
                    }
                    else{
                        results = weighted_words;
                    }
                }
            }
            
            lightbox.append(lightbox_contents);
            overlay.append(lightbox);
            $("body").append(overlay);

            var output = "";
        
            if(typeof results === "object" && results.length > 0){
            
                var min_val = results.slice(-1)[0].weight;
                var max_val = results.slice(0,1)[0].weight;
                var font_step = (settings.max_font - settings.min_font) / (max_val - min_val);
                
                results = results.sort(array_sort_random);
                            
                output += "<ul class='wordcloudify-result'>"
                for(var word in results){
                    output += "<li style='font-size:"+(settings.min_font+(font_step*(results[word].weight-min_val)))+settings.font_unit+"'>"+results[word].word+" </li>"
                }
                output += "</ul>"
            }
            else{
                output = "No valid words";
            }
                
            lightbox_contents.html(output);
                
            $("body").append(lightbox);
        
            var coords = get_centre_x_y(lightbox.width(), lightbox.height());
        
            lightbox.css({
                "top" : coords.y,
                "left" : coords.x
            });

            overlay.fadeIn(
                "fast", 
                function(){ 
                    lightbox.fadeIn("fast"); 
                });
    
            $("#wordcloudify-overlay").on("click.wordcloudify", methods.destroy);
            
            return this;
        },
        destroy : function(){
            $("#wordcloudify-lightbox").fadeOut("fast", function(){
                $("#wordcloudify-lightbox").remove();
                $("#wordcloudify-overlay").fadeOut("fast", function(){
                    $("#wordcloudify-overlay").remove();
                    $("#wordcloudify-overlay").off("click.wordcloudify");
                    $("body").trigger("removed.wordcloudify");
                });
            });

            
            

                
        }
    };

    $.fn.wordcloudify = function(method){
        if(methods[method]){
            return methods[method].apply(this, Array.prototype.slice.call(arguments,1));
        }
        else if(typeof method === 'object' || ! method){
            return methods.init.apply(this, arguments);
        }
        else{
            $.error("Method "+method+" does not exist on jQuery.wordcloudify");
        }
    };

})(jQuery);
