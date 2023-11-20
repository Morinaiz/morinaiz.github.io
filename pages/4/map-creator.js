document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('map').setView([43.716219, 10.399800], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        zoomSnap: 0,
        minZoom: 11,
        maxZoom: 17,    
        continuousWorld: true,
        noWrap: true,
        updateWhenIdle: true,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var heatmapLayer = new HeatmapOverlay({
        radius: 0.00052,
        blur: 1,
        maxOpacity: 0.8,
        scaleRadius: true,
        useLocalExtrema: false,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'value',
        gradient: {
            0.15: '#45DCF3',
            0.2: '#84F05E',
            0.5: '#FFFF46',
            1: '#FF3939'
        }
    });
    map.addLayer(heatmapLayer);

    map.on('zoomstart', function() {
        heatmapLayer.setOptions({ maxOpacity: 0 }); // Set heatmap opacity to 0
    });

    map.on('zoomend', function() {
        heatmapLayer.setOptions({ maxOpacity: 0.8 }); // Reset heatmap opacity to original value
    });

    Papa.parse("data.csv", {
        download: true,
        header: true,
        delimiter: ";",
        skipEmptyLines: true,
        complete: function(results) {
            var data = results.data.map(function(item) {
                var densityValue = parseFloat(item.density);

                return {
                    lat: parseFloat(item.latitude),
                    lng: parseFloat(item.longitude),
                    value: densityValue > 0 ? densityValue / 15 : 0
                };
            });
            heatmapLayer.setData({
                max: 1,
                data: data
            });
        }
    });
});