function buildPlot(){
    
    let url = `/plot`;
    // but displaying in /search
    
    d3.json(url).then(plot_data => {
        let hours_x = plot_data.hour;
        let crimeSeverity_y = plot_data.crimeSeverity;
    
        console.log(hours_x);
        console.log(crimeSeverity_y);
    
        let trace = [{
          x: hours_x,
          y: crimeSeverity_y,
          type: 'scatter',
        }];
    
        let layout = {
          title: `Crime Prediction Next 6 Hours`,
          yaxis: {
            autorange: true
          },
          xaxis: {
            autorange: true,
            title: `Time`
          },
          showlegend: true,
          height: 500,
          width: 900
        };
    
        Plotly.newPlot('my_dataviz', trace, layout);
      });
    };