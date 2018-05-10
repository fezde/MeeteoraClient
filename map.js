var markers = [];
var map = null;

function initMap(){
     map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
     console.log("Map sollte da sein");
     userIdRequest();
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