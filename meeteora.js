var mapId = null;
var userId = null;
var userName = null;



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
    if(mapId === null){
        debug("MapID not yet set => do not request positions");
        window.setTimeout(updateMyPosition,5000);
        return;
    }
    if(userId === null){
        debug("userId not yet set => do not request positions");
        window.setTimeout(updateMyPosition,5000);
        return;
    }
    if(userName === null){
        debug("userName not yet set => do not request positions");
        window.setTimeout(updateMyPosition,5000);
        return;
    }
    setSharingUrl();
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
            //TODO add errorhandling (msg? retry?)
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

function initMapId(){
    if(mapId === null){
        var mapIdFromUrl = getUrlParameter('mapid');
        if(mapIdFromUrl === undefined){
            mapIdRequest();
            return;
        }else{
            debug("MapID was set by URL")
        }
        mapId = mapIdFromUrl;
    }else{
        debug("MapID already set")

    }
    //TODO show "What is this info" because user joined this map and might not know what is going on
    debug("MapID: " + mapId);
}

function mapIdRequest(){
    debug("Requesting new MapId");
    $.post({
        url: "https://beta.meeteora.com/api/v1/maps/",
        success: mapIdSuccess,
        //TODO add errorhandling (msg? retry?)
    });
}
function mapIdSuccess(data){
    mapId = data.mapid;
    debug("New Map ID is: " + mapId)
}

