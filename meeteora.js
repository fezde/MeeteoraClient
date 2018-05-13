var COOKIE_NAME_UID = "SUERID";
var COOKIE_NAME_NAME = "USERNAM";
var PARAM_MAP_ID = "mapid";
var TIMEOUT = 5000;

var mapId = null;
var userId = null;
var userName = null;

loadMapId();

function loadMapId(){
    var promiseMapId = new Promise(function(resolve, reject) {
        // Load mapid
        debug("Loading MAP ID");
        var mapIdFromUrl = getUrlParameter(PARAM_MAP_ID);
        if(mapIdFromUrl === undefined){
            debug("Requesting new MapId");
            $.post({
                url: "https://beta.meeteora.com/api/v1/maps/",
                timeout: TIMEOUT,

            })
            .done(function(data){
                debug("Got answer for map ID");
                debug(data);
                resolve(data.mapid);
            })
            .fail(function(xhr){
                debug("Error in mapID request");
                reject(new Error(xhr));
            });

        }else{
            debug("MapID was set by URL");
            debug("User is joining a map => show info");
            $("#info .headline").html("You are joining a meeteora map");
            $("#info .content").html("Some info");
            $("#info").css("display","block");
            $("#info .button").click(function(){
                debug("click");
                $("#info").css("display","none");
                resolve(mapIdFromUrl);
            });
            //
        }
    })
    .then(function(data, showInfo){
        debug("MapID set to: " + data);

        loadUserId();


    })
    .catch(function(error){
        debug(error);
        $("#error .headline").html("Network error");
        $("#error .content").html("Could not load map ID. Please reload this page");
        $("#error").css("display","block");
    });
}

function loadUserId(){
    var promiseUserId = new Promise(function(resolve, reject) {
        uidFromCookie = Cookies.get(COOKIE_NAME_UID);
        debug("UID from cookie: " + uidFromCookie);
        if(uidFromCookie === undefined){
            // UserID not stored in cookie
            debug("Before userID request");
            $.post({
                url: "https://beta.meeteora.com/api/v1/users/",
                timeout: TIMEOUT,
            })
            .done(function(data){
                debug("Success in userID request");
                resolve(data.userid);
            })
            .fail(function(xhr){
                debug("Error in userID request");
                reject(new Error(xhr));
            });
            debug("After userID request");
        }else{
            // UserID Loaded from Cookie
            resolve(uidFromCookie);
        }

    })
    .then(function(data){
        debug("UserID Promise done. data: " + data);
        userId = data;
        Cookies.set(COOKIE_NAME_UID, data);
        loadLocationPermission();
    })
    .catch(function(error){
        debug(error);
        $("#error .headline").html("Network error");
        $("#error .content").html("Could not load user ID. Please reload this page");
        $("#error").css("display","block");
    });
}

function loadName(){
    var name = Cookies.get(COOKIE_NAME_NAME);
    debug("Name from cookie: " + name);
    if(name === undefined){
        name = randomString();
    }else{
        debug("Name read from cookie");
    }
    debug("Name is: " + name);
    userName = name;
    Cookies.set(COOKIE_NAME_NAME, name);
}

function loadLocationPermission(){


    navigator.geolocation.getCurrentPosition(function(position) {
        debug("Could get position");
        debug(position);
        loadName();
        initMap(position);
        //fitBoundsToVisibleMarkers();
    },
    function (error) {

        debug("you denied me :-(");
        debug(error);
        $("#info .headline").html("Permission required");
        $("#info .content").html("info");
        $("#info").css("display","block");
        $("#info .button").html("Retry");
        $("#info .button").click(function(){
            loadLocationPermission();
        });

    },
    {
        timeout: 5000,
    });
}
