function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    console.log(data);
    var samplesArray = data.samples;
    console.log(samplesArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectSamples = samplesArray.filter(data => data.id === sample);
    console.log(selectSamples);
    //  5. Create a variable that holds the first sample in the array.

    var firstSample = selectSamples[0];
    console.log(firstSample);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(id => 'OTU' + id).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        ticktext: yticks
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: -0.25,
        yanchor: 'center',
        text: 'A horizontal bar chart to display the top 10 bacterial species ',
        showarrow: false
      }]
    }
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});


    // Bar and Bubble charts
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        opacity: [1, 1,1, 1],
        colorscale: "Picnic"
      }
    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: {title: "OTU ID", automargin: true},
      yaxis: {automargin: true},
      hovermode: "closest",
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: .5,
        xanchor: 'center',
        y: 1,
        yanchor: 'center',
        text: "A bubble chart that will display the bacteria culture per sample",
        showarrow: false
      }]
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(data => data.id == sample);
    console.log('Metadata array', metadataArray);
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMetadataSample = metadataArray[0];
    console.log(firstMetadataSample);
    // 3. Create a variable that holds the washing frequency.
    var washingFreq = firstMetadataSample.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [null, 10],
            tickmode: "array",
            tickwidth: 1,
            tickcolor: "darkblue"
          },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "green" },
            { range: [8, 10], color: "blue" }]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      autosize: true,
      showarrow: false,
      width: 600, height: 450,
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 0,
        yanchor: 'center',
        text: "A gauge chart that displays the weekly washing frequency's value",
        showarrow: false
      }]
  
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});


  });
}






