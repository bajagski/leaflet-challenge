var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";


function markerSize(mag) {
    return mag * 30000;
}

function markerColor(mag) {
    if (mag <= 1) {
        return "#98ee00";
    } else if (mag <= 2) {
        return "#d4ee00";
    } else if (mag <= 3) {
        return "#eecc00";
    } else if (mag <= 4) {
        return "#ee9c00";
    } else if (mag <= 5) {
        return "#ea822a";
    } else {
        return "#ea2c2c";
    }
  }
  
 // Grabbing our GeoJSON data..
 d3.json(link, function(earthquakeData) {
    plotEarthquake(earthquakeData.features);
});

function plotEarthquake(data){
    var geoJson = L.geoJSON(data,{
    onEachFeature : function (feature, layer) {
            // Setting various mouse events to change style when different events occur
            layer.on({
                // On mouse over, make the feature (neighborhood) more visible
                mouseover: function(event) {
                  layer = event.target;
                  layer.setStyle({
                    fillOpacity: 0.9
                  });
                },
                // Set the features style back to the way it was
                mouseout: function(event) {
                    geoJson.resetStyle(event.target);
                },
              });
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>");
        },    
         pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: markerSize(feature.properties.mag),
              fillColor: markerColor(feature.properties.mag),
              fillOpacity: 1,
              stroke: false,
          })
        } 
    }); 
    
    createMap(geoJson);

}

function createMap(earthquakes){
      
     var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY
    });

    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Locations Map": lightMap,
    "Satellite Map ": satelliteMap,
  };

  var overlayMaps = {
    "Earthquakes": earthquakes,  
  };
  
    // Create our map layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71],
      zoom: 3,
      layers: [lightMap, earthquakes]
    }); 

  
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);


// Add colors for legend


//   //Create a legend on the bottom left
  var legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
      var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822a",
        "#ea2c2c"
      ];
        var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5];

    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background: ' + colors[i] + '"></i> ' + 
    + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');

    }

    return div;
  };

  legend.addTo(myMap);

}