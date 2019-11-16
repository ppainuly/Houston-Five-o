var map, featureList, boroughSearch = [], theaterSearch = [], museumSearch = [];
let latlon = []
let markerArray = []
let popup = []
let incidentType = []

map = L.map("map", {
  center: [29.8204, -95.3298],
  zoom: 10
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiYW5kZXJzamgiLCJhIjoiY2sxODNlMDBzMDZ6cTNvcDFwZTh0eGJnNyJ9.UOYs4mSt5CSEuifzIxu1tA"
}).addTo(map);

// /* Basemap Layers */
var streetMap= L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiYW5kZXJzamgiLCJhIjoiY2sxODNlMDBzMDZ6cTNvcDFwZTh0eGJnNyJ9.UOYs4mSt5CSEuifzIxu1tA"
});
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: "pk.eyJ1IjoiYW5kZXJzamgiLCJhIjoiY2sxODNlMDBzMDZ6cTNvcDFwZTh0eGJnNyJ9.UOYs4mSt5CSEuifzIxu1tA"
});

var baseLayers = {
  "Street Map": streetMap,
  "Aerial Imagery": satellite
};

// var layerControl = L.control.groupedLayers(baseLayers,  {
//   collapsed: isCollapsed
// }).addTo(map);


$(window).resize(function() {
  sizeLayerControl();
});

// $(document).on("click", ".feature-row", function(e) {
//   $(document).off("mouseout", ".feature-row", clearHighlight);
//   sidebarClick(parseInt($(this).attr("id"), 10));
// });

// if ( !("ontouchstart" in window) ) {
//   $(document).on("mouseover", ".feature-row", function(e) {
//     highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
//   });
// }

// $(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});




$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

// $("#login-btn").click(function() {
//   $("#loginModal").modal("show");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

// function clearHighlight() {
//   highlight.clearLayers();
// }

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}


d3.json("https://moto.data.socrata.com/resource/p6kq-vsa3.json").then(function(response){

  let markers = L.markerClusterGroup();
  
  console.log("Starting Marker");
  console.log(response);
  
      // Loop through data
    for (var i = 0; i <= 1000; i++) {

      if(response[i]){
       incident = response[i]
      //var location = 
       //if(incident.location )//&& incident."coordinates && incident.parent_incident_type && incident.address_1 && incident_datetime){

      //             // Add a new marker to the cluster group and bind a pop-up
        coord = []
        if((typeof incident.latitude !== "undefined") && (typeof incident.longitude !== "undefined" &&  (typeof incident.parent_incident_type !== "undefined"))){
          //console.log(i);
          coord.push(incident.latitude);
          coord.push(incident.longitude);
          //console.log("latitude")
          //console.log(incident.latitude);
          //console.log("longitude")
          //console.log(incident.longitude);
          markerArray.push(L.marker(coord));
          markers.addLayer(L.marker(coord)
                    .bindPopup("<h2>" + incident.parent_incident_type +
           "</h2><hr><p>" + incident.address_1 + "</p>" + incident.incident_datetime + "<hr>Zip: " + incident.zip));
        }
      }
           //.bindPopup("<h2>" + incident.parent_incident_type +
           //"</h2><hr><p>" + incident.address_1 + "<p>" + incident.incident_datetime));
        //console.log(incident.location);
       // }
        //map.addLayer(markers);

      //}
    
        // Check for location property
      //if (location) {
    
           //Add a new marker to the cluster group and bind a pop-up
        // markers.addLayer(L.marker([response[i].coordinates[1], response[i].coordinates[0]])
        //   .bindPopup("<h2>" + response[i].parent_incident_type +
        //   "</h2><hr><p>" + response[i].address_1 + "<p>" + response[i].incident_datetime));
        // }
    
      
    
      // Add our marker cluster layer to the map
    
    
    //}
    }
    map.addLayer(markers);

  });




  /* Add Live crime incidents to the Sidebar and the map*/
  // $("#feature-list tbody").empty();
  // /* Loop through theaters layer and add only features which are in the map bounds */
  // incidents.forEach(function (incident, i) {

  //       let type = "";
  //       latlon.push(incident.location)
  //       //$('.list-group').httml = ""
  //       incidentType.push(incident.type)
  //       var iconurl = "";

  //       if(incident.type.startsWith("CRASH")){
  //           $("#feature-list tbody").append('<tr class="feature-row" id="'+ i + 'lat="' + incident.location[0] + '" lng="' + incident.location[1]+ '"><td style="vertical-align: middle;"><img width="22" height="22" src="../static/img/icons8-car-100v2.png"></td><td class="feature-name">' + incident.address );
  //           iconurl = "../static/img/icons8-car-100v2.png";
  //       } else if(incident.type.startsWith("TRAFFIC")){
  //           $("#feature-list tbody").append('<tr class="feature-row" id="'+ i + 'lat="' + incident.location[0] + '" lng="' + incident.location[1]+ '"><td style="vertical-align: middle;"><img width="22" height="22" src="../static/img/icons8-under-construction-64.png"></td><td class="feature-name">' + incident.address );
  //           iconurl = "../static/img/icons8-under-construction-64.png";
  //       } else{
  //           $("#feature-list tbody").append('<tr class="feature-row" id="'+ i + 'lat="' + incident.location[0] + '" lng="' + incident.location[1]+ '"><td style="vertical-align: middle;"><img width="22" height="22" src="../static/img/icons8-handcuffs-50.png"></td><td class="feature-name">' + incident.address );
  //           iconurl = "../static/img/icons8-handcuffs-50.png";
  //       }
  //       var icon = new L.Icon({
  //         iconUrl: iconurl,
  //         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  //         iconSize: [32, 32],
  //         iconAnchor: [12, 41],
  //         popupAnchor: [1, -34],
  //         shadowSize: [37, 37]
  //        });  
  //       L.marker(incident.location, {icon: icon})
  //        .bindPopup("<h3>" + incident.type + "</h3>   <hr><h4>" + incident.address.toUpperCase() + "</h4> <hr> <h4>" + incident.time + "</h4>")
  //        .addTo(map);
  //      popup.push("<h3>" + incident.type + "</h3> <hr> <h4>" + incident.address.toUpperCase() + "</h4> <hr> <h4>" + incident.time + "</h4>");
  //      markerArray.push(L.marker(incident.location))

  //   });

    let markerActive;


    // $('.feature-row').bind('mouseover',function(){
    //   console.log("Event clicked")
    //   var index = $( ".feature-row" ).index( this );
    //   console.log(index)
    //   latlang = markerArray[index].getLatLng()
    //   // var numMarker = L.ExtraMarkers.icon({
    //   //   icon: 'fa-number',
    //   //   number: index,
    //   //   markerColor: 'yellow'
    //   //   }); icons8-car-100hover.png
    //   if(incidentType[index].startsWith("CRASH")){

    //   var iconHover = new L.Icon({
    //     iconUrl: '../static/img/icons8-car-100v2hover.png',
    //     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    //     iconSize: [32, 32],
    //     iconAnchor: [11, 41],
    //     popupAnchor: [1, -34],
    //     shadowSize: [46, 46],
    //    });  

    // }else if(incidentType[index].startsWith("TRAFFIC")){
    //   var iconHover = new L.Icon({
    //     iconUrl: '../static/img/icons8-under-construction-64hover.png',
    //     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    //     iconSize: [32, 32],
    //     iconAnchor: [11, 41],
    //     popupAnchor: [1, -34],
    //     shadowSize: [46, 46],
    //    });  
    // } else{
    //   var iconHover = new L.Icon({
    //     iconUrl: '../static/img/icons8-handcuffs-50hover.png',
    //     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    //     iconSize: [32, 32],
    //     iconAnchor: [11, 41],
    //     popupAnchor: [1, -34],
    //     shadowSize: [46, 46],

    //   });
    // }
    // markerActive = new L.Marker(latlang, {icon: iconHover});
    // map.addLayer(markerActive);
    // map.panTo(latlang);
    // markerActive.bindPopup(popup[index]).openPopup();

  

    //   });
    //   $('.feature-row').bind('mouseout',function(){
    //     console.log("Event unclicked")
    //     console.log("Marker active")
    //     console.log(markerActive)
    //     var index = $( "a" ).index( this );
    //     map.removeLayer(markerActive)
    //     });

/* Search for the incident table for a keyword(particular address or street) */
var $rows = $('.table tr');
$('.form-control').keyup(function() {
    
    var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        reg = RegExp(val, 'i'),
        text;
    
    $rows.show().filter(function() {
        text = $(this).text().replace(/\s+/g, ' ');
        return !reg.test(text);
    }).hide();
});

// SHow entire map window with markers
$("#full-extent-btn").click(function() {
  var group = new L.featureGroup(markerArray);
  map.fitBounds(group.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});




// /* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});



var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

// /* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 2,
    opacity: 0.7,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 2,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "Your location is within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

// /* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}





$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});




var stations = [
  {
    stationName: "Bush IAH Airport", 
    location: [29.987264528300944, -95.34582612004576], 
    address: "3100 Terminal Road North", 
    legend: "Airport-IAH Division - Districts 21 - 3100 Terminal Rd. North - (281) 230-6800"
  }, 
  {
    stationName: "Central", 
    location: [29.764874534712266, -95.3707253452462], 
    address: "61 Riesner St", 
    legend: "Central Division - Districts 1 & 2 - 61 Riesner St. - (713) 247-440"
  },
  {
    stationName: "Central", 
    location: [29.764874534712266, -95.3707253452462], 
    address: "61 Riesner St", 
    legend: "Central Division - Districts 1 & 2 - 61 Riesner St. - (713) 247-440"
  },

  {
    stationName: "Clear Lake", 
    location: [29.57953957534573, -95.10646398910244], 
    address: "2855 Bay Area Blvd", 
    legend: "Clear Lake Division - District 12 - 2855 Bay Area Blvd. - (832) 395-1777"
  },

  {
    stationName: "Downtown", 
    location: [29.7537251915145, -95.35601230351529], 
    address: "1900 Rusk St", 
    legend: "Downtown Division - Beat 1A10 -  1900 Rusk - (832) 394-0000"
  },

  {
    stationName: "Eastside", 
    location: [29.73430910602781, -95.29004563881392], 
    address: "7525 Sherman", 
    legend: "Eastside Division - District 11 - 7525 Sherman - (832) 395-1580"
  },

  {
    stationName: "Kingwood", 
    location: [30.05463728306788, -95.18825960279793], 
    address: "3915 Rustic Woods Dr", 
    legend: "Kingwood Division - District 24 - 3915 Rustic Wood Dr. - (832) 395-1800"
  },

  {
    stationName: "Midwest", 
    location: [29.71667641699483, -95.51153144965537], 
    address: "7277 Regency Square Blvd", 
    legend: "Midwest Division - District 18 - 7277 Regency Square Blvd - (832) 394-1200"
  },

  {
    stationName: "North", 
    location: [29.879534160445672, -95.4469385491213], 
    address: "9455 W Montgomery Rd", 
    legend: "North Division - Districts 3 & 6 - 9455 W. Montgomery - (832) 394 -3800"
  },

  {
    stationName: "North Belt",
    location: [29.95147068350088, -95.4199241978885], 
    address: "100 Glenborough Dr", 
    legend: "North Belt Division - District 22 - 100 Glenborough Dr - (832) 394-4900"
  },

  {
    stationName: "Northeast", 
    location: [29.83226408342705, -95.27337679363981], 
    address: "8301 Ley Rd", 
    legend: "Northeast Division - Districts 7,  8, & 9 - 8301 Ley Rd. - (832) 395-1500"
  },

  {
    stationName: "Northwest", 
    location: [29.857041766092586, -95.5398015093995], 
    address: "6000 Teague Road", 
    legend: "Northwest Division - Districts 4 & 5 - 6000 Teague Rd. - (832) 394-5500"
  },

  {
    stationName: "Police Headquarters", 
    location: [29.755772339900112, -95.36751369860828], 
    address: "1200 Travis St", 
    legend: "Police Headquarters - 1200 Travis - (713) 308-1200"
  },

  {
    stationName: "South Central", 
    location: [29.742877655942078, -95.3628099860077], 
    address: "2202 St. Emanuel", 
    legend: "South Central Division - District 10 - 2202 St. Emanuel - (832) 394-0300"
  },

  {
    stationName: "South Gessner", 
    location: [29.649543810405692, -95.52840400465658], 
    address: "8605 Westplace Dr", 
    legend: "South Gessner Division - District 17 - 8605 West Place Dr. - (832) 394-4700"
  },

  {
    stationName: "Southeast", 
    location: [29.657384448022874, -95.3168111128208], 
    address: "8300 Mykawa", 
    legend: "Southeast Division - Districts 13 & 14 - 8300 Mykawa - (832) 394-1600"
  },

  {
    stationName: "Southwest", 
    location: [29.63704163472314, -95.45711234272345], 
    address: "13097 Nitida St", 
    legend: "Southwest Division - Districts 15 & 16 - 13097 Nitida St.  - (832) 394-0400"
  },

  {
    stationName: "Westside", 
    location: [29.727476147598914, -95.60486678242556], 
    address: "3203 S Dairy Ashford", 
    legend: "Westside Division - Districts 19 & 20 - 3203 S. Dairy Ashford - (832) 394-5600"
  },

  {
    stationName: "William P. Hobby Airport", 
    location: [29.65408531758694, -95.27665426232514], 
    address: "7800 Airport Blvd", 
    legend: "Airport-Hobby Division - Districts 23 - 7800 Airport Blvd - (713) 845-6800"
  }
];


for (var i = 0; i < stations.length; i++) {
  var station = stations[i];
  var policeWomanIcon = new L.Icon({
   iconUrl: '../static/img/icons8-policeman-female-40.png',
   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
   iconSize: [30, 30],
   iconAnchor: [12, 41],
   popupAnchor: [1, -34],
   shadowSize: [35, 35]
  });  
  console.log(station.location)
  L.marker(station.location, {icon: policeWomanIcon}) 
    .bindPopup("<h1>" + station.stationName + "</h1> <hr> <h4>Address & Info - </h4><p>" + station.legend + "</p>")
    .addTo(map);
}

// d3.json('/api/incidents').then(function(incidents){
//   console.log("Starting Incidents")
//   console.log(incidents);
// });