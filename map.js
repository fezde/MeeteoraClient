var markers = [];
var map = null;
var apiLoaded = false;

function googleApiLoaded() {
    debug("Google API finished loading");
    apiLoaded = true;
}

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