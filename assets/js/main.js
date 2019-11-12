"use strict";

let map;
let infoWindow;

function initMap()
{
  let mapOptions =
  {
    center: {lat:43.128658, lng:-77.620677},
    minZoom: 10,
    maxZoom: 50,
    zoom:18,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    restriction:
    {
      latLngBounds:
      {
        east: -77.6068,
        north: 43.1374,
        south: 43.1231,
        west: -77.6309
      },
      strictBounds: true,
    }
  };

  // Bounds for North America
  let strictBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(28.70, -127.50),
    new google.maps.LatLng(48.85, -55.90)
  );

  map = new google.maps.Map(document.querySelector("#map"), mapOptions);

  for (let i = 0; i < trash.length; i++)
  {
    let lat = trash[i].latitude;
    let long = trash[i].longitude;
    let name = trash[i].title;
    let pic = trash[i].url;

    addMarker(lat, long, name, pic);
  }
}

function makeInfoWindow(position, msg)
{
  // Close old InfoWindow if it's up
  if(infoWindow) {infoWindow.close();}

  // Make a new InfoWindow
  infoWindow = new google.maps.InfoWindow({
    map: map,
    position: position,
    content: "<b>" + msg + "</b>"
  });
}

function addMarker(latitude, longitude, title, url)
{
  let position = {lat: latitude, lng: longitude};
  let marker = new google.maps.Marker({position: position, map: map, url: url});
  marker.setTitle(title);

  // Add a listener for the click event
  google.maps.event.addListener(marker, 'click', function(e)
  {
    // window.open(this.url);
    makeInfoWindow(this.position, this.title);
  });
}
