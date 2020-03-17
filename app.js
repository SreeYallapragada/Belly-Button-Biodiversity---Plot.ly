//Build the metadata panel  
function buildSampleMetadata(incomingSampleData) {

    // Define a variable for the HTML element
    var sampleMetadataPanel = d3.select("#sample-metadata");

    //Clears any existing information 
    sampleMetadataPanel.html("");
   
    //d3 reads in the JSON
    d3.json("data/samples.json").then(function(data) {
        //console.log(sampleMetadataPanel);

        // Array of Objects
        var metadataSamples = data.metadata;

        var metadataResultArray = metadataSamples.filter(sampleObj => sampleObj.id == incomingSampleData);
        var sampleMetadata = metadataResultArray[0];

        //Add each key/value pair to the panel and append the information into it
        Object.entries(sampleMetadata).forEach(function([key, value]) {
            console.log(key, value);
            d3.select("#sample-metadata").property("value");

            var panelTag = sampleMetadataPanel.append("p")
            panelTag.text(`${key}: ${value}`);
        });
    
    console.log(sampleMetadata.wfreq);
    
    //Attempting the bonus part: making the gauge, but unfortunately, no red arrow. Just the basics of the graph which is interactive!
    var washingGauge = [
        {
            domain: { x: [0], y:[9] },
            value: sampleMetadata.wfreq,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number+delta"
        }
    ];
    //Establishes the layout of the gauge
    var gaugeLayout = { width: 500, height: 400, margin: { t: 10, b: 0} };

    //Plotly will display the gauge
    Plotly.newPlot("gauge", washingGauge, gaugeLayout);

    });
};


//Function to build the charts (bar graph and bubble chart)
function buildSiteCharts(incomingSampleData) {
    console.log(incomingSampleData);
    
    d3.json("data/samples.json").then(function(data) {

        //Array of objects
        var samples = data.samples;
        
        //Filter through the array for the incoming sample and use it for the site charts
        var resultArray = samples.filter(sampleObj => sampleObj.id == incomingSampleData);
        var sampleData = resultArray[0];
        
        // Here: bar chart ------------------

        //Initialize x/y variables for the bar chart
        var otuID = sampleData.otu_ids.slice(0,10).reverse();
        var sampleValues = sampleData.sample_values.slice(0,10).reverse();
        var hoverLabels = sampleData.otu_labels.slice(0,10).reverse();

        // y value
        otuMicrobes = []
        otuID.forEach(function(id) {
            var otuMicrobeName = `OTU ${id}`;
            otuMicrobes.push(otuMicrobeName);
        });

        //Bar chart trace 
        var samplesBarChart = [{
            type: "bar", 
            x: sampleValues,
            y: otuMicrobes,
            hovertext: hoverLabels,
            orientation: "h"
        }];

        //Layout of the bar chart and other design elements
        var barChartLayout = {
            title: "Microbe Bar Chart",
            height: 700,
            width: 500,
            xaxis: { autorange: true},
            hoverlabel: { bgcolor: "#459BD9"} 
        };

        //Plotly displays the bar chart
        Plotly.newPlot("bar", samplesBarChart, barChartLayout);

        //Here: bubble chart -------------------------

        //Initlialize x/y variables for the bubble chart
        var otuIDXAxis = sampleData.otu_ids;
        var sampleValuesYAxis = sampleData.sample_values;
        var otuTextValues = sampleData.otu_labels;

        //Bubble chart trace
        var bubbleChart = [{
            x: otuIDXAxis,
            y: sampleValuesYAxis,
            text: otuTextValues,
            mode: "markers", 
            marker: {
                colorscale: "Earth",
                size: sampleValuesYAxis,
                color: otuIDXAxis
            }
        }];

        // Bubble Chart Layout
        var bubbleChartLayout = {
            title: "Microbe Bubble Chart" ,
            xaxis: {title: "Sample OTU ID"},
            yaxis: {title: "Sample Values"}
        };

        //Plotly displays the bubble chart
        Plotly.newPlot("bubble", bubbleChart, bubbleChartLayout);  
        
    });

};

// Initial loading, where d3 selects the drop down selector to append the sample IDs
function init() {
    
    var dropDownSelector = d3.select("#selDataset");
    console.log(dropDownSelector);

    //List of Sample names
    d3.json("data/samples.json").then(function(nameOfSamples) {
        console.log(nameOfSamples);
        Object.entries(nameOfSamples).forEach(function([key, value]) {
            console.log([key, value]);
            
            if (key == "names") {
                value.forEach((incomingSampleData) => {  
                    dropDownSelector
                        .append("option")
                        .text(incomingSampleData)
                        .property("value", incomingSampleData);
            
                });

                //The first sample in the entire dataset is used to build the charts (like creating a default)
                buildSiteCharts(value[0]);
                buildSampleMetadata(value[0]);
            };
        });
        
    });

};

//Update all the charts for the next sample
function optionChanged(nextSample) {
    buildSiteCharts(nextSample);
    buildSampleMetadata(nextSample);
};

//Initialize the dashboard for the user
init();