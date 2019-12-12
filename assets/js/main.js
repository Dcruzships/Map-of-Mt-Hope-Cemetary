"use strict";

let map;
let infoWindow;
let coords;
let latM;
let lngM;
let deadMarkers = [];
let symbolMarkers = [];
let emilyMarkers = [];
let masterPath = [];
let trail;

function initMap() {
  let mapOptions = {
    center: {
      lat: 43.128658,
      lng: -77.620677
    },
    disableDefaultUI: true,
    minZoom: 15,
    maxZoom: 80,
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles:
    [
      {
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
        north: 43.1394,
        south: 43.1231,
        west: -77.6309
      },
      strictBounds: true,
    }
  };

  coords = document.querySelector("#coords");

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

  google.maps.event.addListener(map, 'mousemove', function(event) {
    displayCoordinates(event.latLng);
  });
}

function toggleButton(id) {
  let butt = document.querySelector(id);

  if (butt.value == "off")
  {
    butt.value = "on";

    if (id == "#deadButton") {
      butt.innerHTML = "🐶🐤🐟";
      addMarkers(dead);
    }
    if (id == "#symbologyButton") {
      butt.innerHTML = "🕸👌💯";
      addMarkers(symbols);
    }
    if (id == "#emilyButton") {
      butt.innerHTML = "📸💃🤳";
      addMarkers(emily);
    }
    if (id == "#trailsButton") {
      butt.innerHTML = "- - - - - -";
      showTrails();
    }
  } else {
    butt.value = "off";
    butt.innerHTML = "x x x x x";
    if (id == "#deadButton") {
      removeMarkers(deadMarkers);
    }
    if (id == "#symbologyButton") {
      removeMarkers(symbolMarkers);
    }
    if (id == "#emilyButton") {
      removeMarkers(emilyMarkers);
    }
    if (id == "#trailsButton") {
      removeTrails();
    }
  }
}

function displayCoordinates(pnt) {

  latM = pnt.lat();
  latM = latM.toFixed(4);
  lngM = pnt.lng();
  lngM = lngM.toFixed(4);

  coords.innerHTML = `x: ${lngM}, y: ${latM}`;
}

function makeInfoWindow(position, category, title, pic, body) {
  // Close old InfoWindow if it's up
  if (infoWindow) {
    infoWindow.close();
  }

  // Make a new InfoWindow
  infoWindow = new google.maps.InfoWindow({
    map: map,
    position: position
  });

  if (title == "Dollie" || (category == "emily" && (title != "em08" || title != "em15"))) {
    infoWindow.setContent(`<div id='infoLand' class='info'><h1><b><u>${title}</u></b></h1>${pic}<br><br><p>${body}</p><br></div>`);
  } else {
    infoWindow.setContent(`<div id='infoPort' class='info'><h1><b><u>${title}</u></b></h1>${pic}<br><br><p>${body}</p><br></div>`);
  }
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

  marker.setTitle(name);

  if (category == "dead") {
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    deadMarkers.push(marker);
  }
  if (category == "symbology") {
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    symbolMarkers.push(marker);
  }
  if (category == "emily") {
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/pink-dot.png');
    emilyMarkers.push(marker);
  }

  // Add a listener for the click event
  google.maps.event.addListener(marker, 'click', function(e) {
    // window.open(this.url);
    makeInfoWindow(this.position, category, name, pic, body);
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

    if(cat == "emily" || cat == "symbology")
    {
      // let rand = Math.random();
      // lat = 43.128658;
      // long = -77.620677;
      // rand = rand / 1000;
      // if((rand * 2000) > 1)
      // {
      //   rand = -rand;
      // }
      //
      // lat += rand * 5;
      // long += rand * 5;

      // name = id;
      // body = "where am i?";
    }

    if(id == "em14" || id == "em22")
    {
      pic = `<img src='assets/img/${cat}/${id}.gif'>`;
    }
    makeMarker(id, name, cat, lat, long, body, pic);
  }
}

function removeMarkers(set) {
  for (let i = 0; i < set.length; i++) {
    set[i].setMap(null);
  }
  set.length = 0;
}

function showTrails()
{
  if(emilyMarkers.length != 0)
  {
    for(let x = 0; x < emilyMarkers.length; x++)
    {
      masterPath.push(emilyMarkers[x]);
    }
  }
  if(deadMarkers.length != 0)
  {
    for(let y = 0; y < deadMarkers.length; y++)
    {
      masterPath.push(deadMarkers[y]);
    }
  }
  if(symbolMarkers.length != 0)
  {
    for(let z = 0; z < symbolMarkers.length; z++)
    {
      masterPath.push(symbolMarkers[z]);
    }
  }

  let coords = [];

  for(let i = 0; i < masterPath.length; i++)
  {
    let pathNode = masterPath[Math.floor(Math.random()*masterPath.length)];
    coords.push(new google.maps.LatLng(pathNode.internalPosition.lat(), pathNode.internalPosition.lng()));
  }

  trail = new google.maps.Polyline({
    path: coords,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  trail.setMap(map);
}

function removeTrails()
{
  masterPath = [];
  trail.setMap(null);
}
