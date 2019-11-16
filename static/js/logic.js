d3.json('/api/incidents').then(function(incidents){
    console.log("Starting Incidents")
    console.log(incidents);
});