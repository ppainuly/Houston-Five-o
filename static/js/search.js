


// Map via Mapbox GL

$(document).ready(init);

function init(jQuery) {
  CurrentYear();
  initMap();
  $("#data1").hide()
  $("#data2").hide()
  $("#data3").hide()

  /*
  // user clicks some button
  $('#someButton').on('click', function () {
      // do something here
  });

  */
}

function CurrentYear() {
  var thisYear = new Date().getFullYear()
  $("#currentYear").text(thisYear);
}

var mapCoordinates = [42.885441,-78.878464];
var mapZoom = 11;

// the key from the Mapbox examples (not mine)
var mapAccessToken = "pk.eyJ1IjoibWV0cmljb24iLCJhIjoiY2l3eTQxMWl3MDBmYTJ6cWg3YmZtdjdsMSJ9.2vDbTw3ysscpy3YWkHo6aA";

var map = null;
var geocoder = null;

function initMap() {
  map = MapGL();
}

function MapGL() {
  mapboxgl.accessToken = mapAccessToken;

  // initialize map
  var newMap = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/mapbox/streets-v11", //stylesheet location
      center: [-95.3698, 29.7604], // starting position
      zoom: 11 // starting zoom
  });

  // geocoding
  // newMap.addControl(new MapboxGeocoder({
  //   accessToken: mapboxgl.accessToken
  // }));
  newMap.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
    }));
  
  // event handlers
  newMap.on("load", mapLoaded);
    return newMap;
}

function mapLoaded() {
  // do stuff here

  map.on('click', function (e) {
    console.log(e)
    console.log(e['lngLat']);
    console.log(e['lngLat']['lng'])
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .addTo(map);

    console.log('clicked')
    $("#data1").show();
    $("#data2").show();
    $("#data3").show();

    });
     

  
}
var trace1 = {
  x: [1, 2, 3, 4],
  y: [0, 2, 3, 5],
  fill: 'tozeroy',
  type: 'scatter'
};


var data = [trace1];

Plotly.newPlot('myDiv', data);



$('.mapboxgl-ctrl-geocoder mapboxgl-ctrl').on('keypress',function(e) {
  if(e.which == 13) {
      alert('You pressed enter!');
      console.log(e.target.value);
      console.log($('mapboxgl-ctrl-geocoder mapboxgl-ctrl').val());
      $("#data1").show();
      $("#data2").show();
      $("#data3").show();
  }
});

//const cells = table.getElementsByTagName('td')

// $(document).on('keypress',function(e) {
//   if(e.which == 13) {
//       //alert('You pressed enter!');
//       //console.log(e.target.value);
//       //console.log($('mapboxgl-ctrl-geocoder mapboxgl-ctrl').val());
//       //address = document.getElementsByTagName(input).value
//       p = $('.mapboxgl-ctrl-geocoder mapboxgl-ctrl');
//       console.log(p);
//       p1 = d3.select('.mapboxgl-ctrl-geocoder mapboxgl-ctrl');
//       console.log(p1);
//       console.log(p1.text);
//       //add = p.getElementsByTagName('input')[0].value;
//       //console.log(add)
//       //console.log(address)
//       $("#data1").show();
//       $("#data2").show();
//       $("#data3").show();
//   }
// });


