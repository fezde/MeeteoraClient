"use strict";

var DEBUG_MODE = 0;
function debug(msg){
    if(msg === undefined){
        msg = "null";
    }

    switch(DEBUG_MODE){
        case "1":
            // only console
            console.log(msg);
            break;
        case "2":
            var content = $("#debug_output_box_content");
            var container = $("#debug_output_box");

            container.css("display","block");
            console.log(msg);
            content.append("<p>" + JSON.stringify(msg) + "</p>");
            //content.append("<p>" + msg.toString() + "</p>");
            container.scrollTop(content[0].scrollHeight);
            break;
    }
}


var getUrlParameter = function getUrlParameter(sParam) {
    debug("Trying to get Url Param: " + sParam);
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            var returnValue = sParameterName[1] === undefined ? true : sParameterName[1];
            debug("Value of Parameter is: " + returnValue);
            return returnValue;
        }
    }
};

/**
* Creates a random String of length 5
**/
function randomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    debug("RandomString => " + text);
    return text;
}


function setSharingUrl(){
    if(addthis !== undefined){
        var url = window.location.href;
        if(url.includes("mapid")){
            return;
        }
        var delim = "?";
        if(url.includes("?")){
            delim = "&";
        }
        url = url + delim + "mapid=" + mapId;
        debug("New sharing URL: " + url);
        addthis.update('share', 'url', url);
    }
}

DEBUG_MODE = getUrlParameter("debug");
debug("Debug mode set to " + DEBUG_MODE);
