document.addEventListener("DOMContentLoaded", function() {
    var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 12,
        maxZoom: 17,    
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
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

    map.on('zoomstart', function(e) {
        map.removeLayer(heatmapLayer);
    });

    map.on('zoomend', function(e) {
        map.addLayer(heatmapLayer);
    });

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend'),
            grades = [0, 4, 8, 12, 16],
            lineHTML = '<div class="thermometer-line"></div>',
            markersHTML = '';
    
            for (var i = 0; i < grades.length; i++) {
                var position = (i / (grades.length - 1)) * 80 + 10;
                markersHTML += '<div class="marker" style="left: calc(' + position + '%);"><span>' + grades[i] + '</span></div>';
            }
        div.innerHTML = lineHTML + markersHTML;
        return div;
    };

    legend.addTo(map);

    function getGradientColor(value) {
        var colors = {
            0: '#45DCF3',
            4: '#84F05E',
            8: '#FFFF46',
            12: '#FF943F',
            16: '#FF3939'
        };

        return colors[value] || '#FFEDA0';
    }

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