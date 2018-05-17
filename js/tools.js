function debug(msg){
    if(msg === undefined){
        msg = "null";
    }
    console.log(msg);
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

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
