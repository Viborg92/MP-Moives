var map;
var service;
var infowindow;
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var latLng;
//sets the posititon to a default location
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      var latLng = new google.maps.LatLng(pos.latitude, pos.longitude) //Line I added 
      // console.debug(latLng);
      infoWindow.setPosition(latLng);
      infoWindow.setContent('You are here.');
      infoWindow.open(map);
      map.setCenter(latLng);
      initialize(latLng, map);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, latLng) {
  infoWindow.setPosition(latLng);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


// Google places API starts

function initialize(latLng, map) {
  //var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316)
  var local = latLng;
  var request = {
    //location: pyrmont,
    location: local,
    radius: '20000',
    types: ['movie_theater']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
    
    let infowindow = new google.maps.InfoWindow({
      content: place.name
    });
    marker.addListener('click', function () {
      infowindow.open(map, marker);
    });
  }
}
