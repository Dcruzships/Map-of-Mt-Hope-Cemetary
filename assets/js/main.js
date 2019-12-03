"use strict";

let map;
let infoWindow;

function initMap() {
  let mapOptions = {
    center: {
      lat: 43.128658,
      lng: -77.620677
    },
    minZoom: 15,
    maxZoom: 80,
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{
        elementType: 'geometry',
        stylers: [{
          color: '#242f3e'
        }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#242f3e'
        }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#746855'
        }]
      },
      {
        elementType: 'labels.icon',
        stylers: [{
          "visibility": "off"
        }]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d59563'
        }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#020502"
          },
          {
            "lightness": 21
          },
          {
            "visibility": "on"
          }
        ]
      },

      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: '#746855'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#1f2835'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#f3d19c'
        }]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 16
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [{
            "visibility": "on"
          },
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{
            "visibility": "on"
          },
          {
            "color": "#422111"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#011424"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#422111"
          },
          {
            "weight": "1.71"
          },
          {
            "lightness": "8"
          }
        ]
      },
    ],
    restriction: {
      latLngBounds: {
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
  google.maps.event.addListener(map, 'click', function(e) {
    // Close old InfoWindow if it's up
    if (infoWindow) {
      infoWindow.close();
    }
  });

  addMarkers(dead);
  addMarkers(symbols);
}

function makeInfoWindow(position, title, pic, body) {
  // Close old InfoWindow if it's up
  if (infoWindow) {
    infoWindow.close();
  }

  // Make a new InfoWindow
  infoWindow = new google.maps.InfoWindow({
    map: map,
    position: position,
    content: `<b><u>${title}</u></b><br><br>${pic}<br><br>${body}`
  });
}

function makeMarker(id, name, category, latitude, longitude, body, pic) {
  let position = {
    lat: latitude,
    lng: longitude
  };
  let marker = new google.maps.Marker({
    position: position,
    map: map
  });
  if (category == "dead") {
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png')
  }
  if (category == "symbology") {
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
  }
  marker.setTitle(name);

  // Add a listener for the click event
  google.maps.event.addListener(marker, 'click', function(e) {
    // window.open(this.url);
    makeInfoWindow(this.position, name, pic, body);
  });
}

function addMarkers(set) {
  for (let i = 0; i < set.length; i++) {
    let id = set[i].id;
    let name = set[i].name;
    let cat = set[i].category;
    let lat = set[i].latitude;
    let long = set[i].longitude;
    let body = set[i].body;
    let pic = `<img src='assets/img/${cat}/${id}.png'>`;
    console.log(body);

    makeMarker(id, name, cat, lat, long, body, pic);
  }
}
