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
    markersAdd(position.coords.latitude, position.coords.longitude, userName, 0);
    debug("you where added");
}

function markersRemoveAll() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}


function markersAdd(lat, lng, name, age) {

    var pos = {
        lat: lat,
        lng: lng
    };

    var icon = {
        url: "img/meeteora-bubble.svg", // url
        scaledSize: new google.maps.Size(55, 50), // scaled size
        origin: new google.maps.Point(-5,4), // origin
        anchor: new google.maps.Point(27, 25) // anchor
    };

    var opacity = 1.0;
    var fifteenMins = 15.0 * 60.0;
    if(age < fifteenMins ){
        debug("Adding marker for user " + name);
        if(age > 120){
            opacity = (fifteenMins-age) / fifteenMins;
        }

        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            label: name,
            icon: icon,
            opacity: opacity,
        });
        markers.push(marker);
    }


}

function fitBoundsToVisibleMarkers() {

    var bounds = new google.maps.LatLngBounds();

    for (var i=0; i<markers.length; i++) {
        bounds.extend( markers[i].getPosition() );
    }

    map.fitBounds(bounds);

}
