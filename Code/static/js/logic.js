
// store the earthquick api url
// Data used: All earthquick in the past day
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Creating the map object
let myMap = L.map("map", {
    center: [59.9816, -152.099],
    zoom: 6
});

// Adding the tile layer
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// read the data
d3.json(url).then(function (data) {
    console.log(data);
    marker(data.features);
});

// Create a fuction to make the markers
// reflect the magnitude of the earthquake by their size and the depth of the earthquake by color.
function marker(response) {
    // create a for loop based on the length of the data
    for (let i = 0; i < response.length; i++) {
        let earthquakeValue = response[i];

        // store the earthquick magnitude into a variable and calculate it
        let markerSize = earthquakeValue.properties.mag * 3;
        // create a marker for the color based on depth
        let depthValue = earthquakeValue.geometry.coordinates[2];
        // add the color function and assign to a variable
        let colorMarker = color(depthValue);

        // Create a circle marker based on the color and size we created
        let markerCircle = L.circleMarker([earthquakeValue.geometry.coordinates[1], earthquakeValue.geometry.coordinates[0]], {
            fillColor: colorMarker,
            radius: markerSize,
            color: "#000",
            weight: 1,
            opacity: .9,
            fillOpacity: 0.75
        }).addTo(myMap);

        // Giving each feature a popup with information that's relevant to it
        markerCircle.bindPopup(`<h3>Location: ${earthquakeValue.properties.place}</h3><hr><h3>Date and Time of earthquake: <br> ${new Date(earthquakeValue.properties.time)}</h3><hr><h3>Magnitude: ${earthquakeValue.properties.mag}</h3><h3>Depth: ${depthValue} km</h3>`);

    }


    // create a function to set the color depth marker
    function color(depthValue) {
        // if condition to set the color for each value range
        // it starts with green and as long as the depth increase it turns to red (Goes darker as the value increase)
        if (depthValue < 10) return '#2FFF0E';
        if (depthValue < 30) return '#9CFA48';
        if (depthValue < 50) return '#bffa37';
        if (depthValue < 70) return '#FACA48';
        if (depthValue < 90) return '#FA9948';
        else return '#fa4137';
    }

    // console.log(color(50))
    // create a legend
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
        let legendDiv = L.DomUtil.create('div', 'info legend i');
        let labels = []
        colorGrades = [-10, 10, 30, 50, 70, 90];

        // Loop through colorGrades and generate legend HTML
        for (let i = 0; i < colorGrades.length; i++) {
            let bgColor = color(colorGrades[i] + 1);
            let labelText = colorGrades[i] + (colorGrades[i + 1] ? '&ndash;' + colorGrades[i + 1] : '+');
            labels.push(
                '<i style="background:' + bgColor + '"></i> ' + labelText
            );
        }
        // Add legend items to legendDiv
        legendDiv.innerHTML += labels.join('<br>');
        console.log(legendDiv.innerHTML);
        // Style the legend
        legendDiv.style.backgroundColor = 'white';
        legendDiv.style.padding = '10px';

        return legendDiv;
    };
    // Add the legend to the map
    legend.addTo(myMap)
}