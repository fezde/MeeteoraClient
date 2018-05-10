var mapId = "1f5586d3c03c4f56bdfc459de560eeee";
var userId = "-1";
var userName = "";

function debug(msg){
    //console.log(new Date() + " - " + msg);
    console.log(msg);
}

function updateMyPosition() {
    debug("Start updating my position position");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionsRequest);
    } else {
        debug("ERROR! NO GEOLOCATION!");
        window.setTimeout(updateMyPosition,5000);
    }
}

function positionsRequest(position){
    debug("Requesting positions");

    var url = "https://beta.meeteora.com/api/v1/maps/"+mapId+"/positions/";
    var data = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude,
        "userid": userId,
        "name": userName
    };
    debug("Updating");
    debug(data);
    $.post({
        url: url,
        contentType:"application/json",
        dataType: "json",
        data: JSON.stringify(data),
        success: positionsRender,
        error: positionsError,
    });
}

function positionsError(){
    debug("Error getting positions");
    window.setTimeout(updateMyPosition,5000);
}

function positionsRender(data){
    debug(data);
    debug("Renderding positions");
    markersRemoveAll();

    var users = data.users;
    for(i=0; i<users.length; i++){
        debug("User " + i);
        usr = users[i];
        markersAdd(usr.lat, usr.lng, usr.name);
    }
    fitBoundsToVisibleMarkers();
    window.setTimeout(updateMyPosition,5000);
}


function userIdRequest(){
    uidFromCookie = Cookies.get("MEETEORA_UID");
    debug("UID from cookie: " + uidFromCookie);
    if(uidFromCookie === undefined){

        $.post({
            url: "https://beta.meeteora.com/api/v1/users/",
            success: userIdSuccess,
        });
    }else{
        userId = uidFromCookie;
        updateMyPosition();
    }
}

function userIdSuccess(data){
    userId = data.userid;
    //userId =
    debug("userId is " + userId)
    uidFromCookie = Cookies.set("MEETEORA_UID", userId);
    updateMyPosition();
}

function initName(){
    var name = Cookies.get("MEETEORA_NAME");
    debug("Name from cookie: " + name);
    if(name === undefined){
        name = randomString();
    }else{
        debug("Name read from cookie");
    }
    debug("Name is: " + name);
    userName = name;
    Cookies.set("MEETEORA_NAME", name);
}

function randomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    debug("RandomString => " + text);
    return text;
}