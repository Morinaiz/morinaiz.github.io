document.addEventListener("DOMContentLoaded", function() {
    // Set initial view to Pisa's coordinates
    var map = L.map('map').setView([43.716219, 10.399800], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 17,    
        continuousWorld: true,
        noWrap: true,
        updateWhenIdle: true,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var heatmapLayer = new HeatmapOverlay({
        radius: 0.00052,  // Reduced radius for a smaller heatmap area
        blur: 1,
        maxOpacity: 0.8,
        scaleRadius: true,
        useLocalExtrema: false,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'value',
        gradient: {
            //0.2: '#4872FF',
            0.15: '#45DCF3',
            0.2: '#84F05E',
            0.5: '#FFFF46',
            1: '#FF3939'
        }
    });
    map.addLayer(heatmapLayer);

    Papa.parse("data.csv", {
        download: true,
        header: true,
        delimiter: ";",
        skipEmptyLines: true,
        complete: function(results) {
            var data = results.data.map(function(item) {
                var densityValue = parseFloat(item.density);

                // Applying logarithmic transformation
                // Ensure that densityValue is positive and non-zero
                var logValue = densityValue > 0 ? densityValue / 15 : 0;

                return {
                    lat: parseFloat(item.latitude),
                    lng: parseFloat(item.longitude),
                    value: logValue
                };
            });
            heatmapLayer.setData({
                max: 1,
                data: data
            });
        }
    });
});

