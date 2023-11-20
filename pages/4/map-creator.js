document.addEventListener("DOMContentLoaded", function() {
    var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 17,    
        attribution: '© OpenStreetMap contributors'
    })

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

    var map = L.map('map', {
        center: [43.716219, 10.399800],
        zoom: 14,
        zoomSnap: 0,
        continuousWorld: true,
        noWrap: true,
        updateWhenIdle: true,
        layers: [baseLayer, heatmapLayer]
    })

    map.on('zoom', function(e) {
        heatmapLayer._reset();
        heatmapLayer._update();
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