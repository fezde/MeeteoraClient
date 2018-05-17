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
var markers = [];
var map = null;
var apiLoaded = false;

function googleApiLoaded() {
    debug("Google API finished loading");
    apiLoaded = true;
}

/**
* TODO
**/
function initMap(position) {
    if(!apiLoaded){
        debug("Maps API not yet loaded. Need to wait");
        window.setTimeout(initMap,500);
    }else{
        debug("Maps API loaded!");
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        },
        zoom: 14,
        minZoom: 6,
        maxZoom: 15,
        disableDefaultUI: true
    });
    debug("Map sollte da sein");
    markersAdd(position.coords.latitude, position.coords.longitude, userName);
    debug("you where added");
}

function markersRemoveAll() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}


function markersAdd(lat, lng, name) {
    var pos = {
        lat: lat,
        lng: lng
    };
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        label: name
    });
    markers.push(marker);
}

function fitBoundsToVisibleMarkers() {

    var bounds = new google.maps.LatLngBounds();

    for (var i=0; i<markers.length; i++) {
        bounds.extend( markers[i].getPosition() );
    }

    map.fitBounds(bounds);

}
"use strict";
//import {debug} from "tools";

var COOKIE_NAME_UID = "SUERID";
var COOKIE_NAME_NAME = "USERNAM";
var PARAM_MAP_ID = "mapid";
var TIMEOUT = 5000;
var BASE_URL = "https://beta.meeteora.com/api/v1/";

var mapId = null;
var userId = null;
var userName = null;

loadMapId();

function loadMapId() {
    var promiseMapId = new Promise(function(resolve, reject) {
        // Load mapid
        debug("Loading MAP ID");
        var mapIdFromUrl = getUrlParameter(PARAM_MAP_ID);
        if(mapIdFromUrl === undefined){
            debug("Requesting new MapId");
            $.post({
                url: BASE_URL + "maps/",
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

        } else {
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
        var uidFromCookie = Cookies.get(COOKIE_NAME_UID);
        debug("UID from cookie: " + uidFromCookie);
        if(uidFromCookie === undefined){
            // UserID not stored in cookie
            debug("Before userID request");
            $.post({
                url: BASE_URL + "users/",
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
    debug("Trying to get position");
    var modal = $("#info_permission_required_en");
    navigator.geolocation.getCurrentPosition(function(position) {
        debug("Could get position");
        debug(position);
        loadName();
        initMap(position);

        modal.css("display","none");
    },
    function (error) {

        debug("you denied me :-(");
        debug(error);

        modal.css("display","block");

        $("button", modal).click(function(){
            debug("Click");
            loadLocationPermission();
        });

    },
    {
        timeout: 5000,
    });
}


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


var markers = [];
var map = null;
var apiLoaded = false;

function googleApiLoaded() {
    debug("Google API finished loading");
    apiLoaded = true;
}

/**
* TODO
**/
function initMap(position) {
    if(!apiLoaded){
        debug("Maps API not yet loaded. Need to wait");
        window.setTimeout(initMap,500);
    }else{
        debug("Maps API loaded!");
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        },
        zoom: 14,
        minZoom: 6,
        maxZoom: 15,
        disableDefaultUI: true
    });
    debug("Map sollte da sein");
    markersAdd(position.coords.latitude, position.coords.longitude, userName);
    debug("you where added");
}

function markersRemoveAll() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}


function markersAdd(lat, lng, name) {
    var pos = {
        lat: lat,
        lng: lng
    };
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        label: name
    });
    markers.push(marker);
}

function fitBoundsToVisibleMarkers() {

    var bounds = new google.maps.LatLngBounds();

    for (var i=0; i<markers.length; i++) {
        bounds.extend( markers[i].getPosition() );
    }

    map.fitBounds(bounds);

}
