


// Map via Mapbox GL

let latCoord;
let lngCoord;

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
    console.log(e['lngLat']['lat'])

    latCoord = e['lngLat']['lat'];
    lngCoord = e['lngLat']['lng'];

    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .addTo(map);

    $('#address1').text(`Co-ordinates - (${latCoord}, ${lngCoord})`);

    //console.log('clicked')

    //console.log("beginning");
    //console.log(latCoord)
    //console.log(lngCoord)

    // Build severity plot
    d3.json(`/plot/${latCoord}/${lngCoord}`).then(function(plot_data){ 
      console.log("starting method")

      var layout = {
        margin: {
          pad: 10
        },
          title: {
            text:'Predicted Crime Severity by Hour',
            font: {
              family: 'Arial, sans-serif',
              size: 24,
              color: 'rgb(90, 90, 90)'
            }
          },
          yaxis: {
            autorange: true,
            title: `Crime Severity`,
            titlefont: {
              family: 'Arial, sans-serif',
              size: 18,
              color: 'rgb(180, 180, 180)'
            },
            tickfont: {
              family: 'Arial, sans-serif',
              size: 14,
              color: 'rgb(110, 110, 110)'
            },
            zeroline: false
          },
          xaxis: {
            autorange: true,
            title: `Hour`,
            titlefont: {
              family: 'Arial, sans-serif',
              size: 18,
              color: 'rgb(180, 180, 180)'
            },
            tickfont: {
              family: 'Arial, sans-serif',
              size: 14,
              color: 'rgb(110, 110, 110)'
            },
            showgrid: false,
            zeroline: false,
            showline: false,
            tickformat: '%H',
            nticks: 6            
          }
      };
                
    console.log("post layout");
    Plotly.newPlot("my_dataviz", plot_data, layout);
    console.log("plotted");
    });
    $("#data3").show();

    console.log('Starting neighbourhood json call');

    d3.json(`/neighbourhood/${latCoord}/${lngCoord}`).then(function(area_list){ 
      console.log('Starting neighbourhood loop');

      // console.log(area_list);
      // var layout = {
      //   title: 'Number of incidents for this location for each hour - '
      // };
      // console.log(data1)
      var layout = {
        title: 'Number of incidents for this location for each hour - '
      };
       Plotly.newPlot('myDiv', area_list,layout);
      // console.log('inside json FUnc')
      // h = ['12AM','1AM', '2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM', '4PM','5PM','6PM','7PM','8PM', '9PM', '10PM','11PM']
      // c = [211.776666666667,
      //   221.354057971015,
      //   230.931449275362,
      //   240.50884057971,
      //   250.086231884058,
      //   259.663623188406,
      //   269.241014492754,
      //   278.818405797101,
      //   288.395797101449,
      //   297.973188405797,
      //   307.550579710145,
      //   317.127971014493,
      //   326.705362318841,
      //   336.282753623188,
      //   345.860144927536,
      //   355.437536231884,
      //   365.014927536232,
      //   374.59231884058,
      //   384.169710144928,
      //   393.747101449275,
      //   403.324492753623,
      //   412.901884057971,
      //   422.479275362319,
      //   432.056666666667]

      
      //Plotly.newPlot('myDiv', data);

    });

    $("#data1").show();
    $("#data2").show();
    //$("#data3").show();

    });
     

  
}






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



