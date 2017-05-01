var map;
var service;
var infowindow;

function initialize() {
  //var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);
 var yourPos = new google.maps.LatLng(pos);
  

  map = new google.maps.Map(document.getElementById('map'), {
   //center: pyrmont,
      center: yourPos,
      zoom: 15
    });

  var request = {
    //location: pyrmont,
    location: yourPos,
    radius: '5000',
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

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }

}