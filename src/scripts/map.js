"use strict";
var pathImage = 'assets/image/';

ymaps.ready(function () {
    initMap();
});

var map;
var clusterer;
var geoObjects;
if(typeof mapObjects == "undefined") {
    var mapObjects = [];
    var mapSpecial = {
        "lat": 59.9568,
        "lng": 30.3451,
        "href": "/history/"
    };
}

function initMap() {

    var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #004391; font-weight: bold;">$[properties.iconContent]</div>'
    );

    map = new ymaps.Map('map', {
        center: [59.9410,30.3148],
        zoom: 11,
        behaviors: ['default']
    });

    map.behaviors.disable('scrollZoom');
    map.behaviors.disable('dblClickZoom');

    clusterer = new ymaps.Clusterer({
        clusterIcons: [
            {
                href: ($('input').is('[name="markerLarge"]') && $('[name="markerLarge"]').val()) ? $('[name="markerLarge"]').val() : pathImage + 'marker-large.png',
                size: [32, 40],
                offset: [-16, -20]
            },
        ],
        clusterIconContentLayout: MyIconContentLayout,
        groupByCoordinates: false,
    });

    geoObjects = [];

    if (mapSpecial) {
        let lat = parseFloat(mapSpecial.lat);
        let lng = parseFloat(mapSpecial.lng);
        let href = mapSpecial.href;

        if (lat && lng) {
            var markerSpecial = new ymaps.Placemark([lat, lng], {
                iconContent: ($('input').is('[name="markerSpecialContent"]') && $('[name="markerSpecialContent"]').val()) ? $('[name="markerSpecialContent"]').val() : ''
            }, {
                iconLayout: 'default#imageWithContent',
                iconImageHref: ($('input').is('[name="markerSpecial"]') && $('[name="markerSpecial"]').val()) ? $('[name="markerSpecial"]').val() : pathImage + 'marker-special.png',
                iconImageSize: [32, 40],
                iconImageOffset: [-16, -20],
                // Смещение слоя с содержимым относительно слоя с картинкой.
                iconContentOffset: [9, 8]
            });

            if (href) {
                markerSpecial.events.add('click', function (e) {
                    location.href = href;
                });
            }

            map.geoObjects.add(markerSpecial);
        }

    }

    map.geoObjects.add(clusterer);

    addMarkersHidden();
    map.setBounds(map.geoObjects.getBounds(),{checkZoomRange: true});
    clusterer.removeAll();

    let layer = map.layers.get(0).get(0);
    // Отслеживаем событие окончания отрисовки тайлов.
    waitForTilesLoad(layer).then(function() {
        addMarkers();
    });

}

function addMarkers() {
    if (mapObjects && mapObjects.length) {

        let coordsSpecial = [];
        coordsSpecial[0] = mapSpecial.lat;
        coordsSpecial[1] = mapSpecial.lng;

        for (let i = 0; i < mapObjects.length; i++) {
            let $geo = mapObjects[i];
            if ($geo.lat && $geo.lng) {
                let marker_coords = [];
                marker_coords[0] = parseFloat($geo.lat);
                marker_coords[1] = parseFloat($geo.lng);
                let a = marker_coords[0] - coordsSpecial[0];
                let b = marker_coords[1] - coordsSpecial[1];
                let c = Math.sqrt( a*a + b*b );
                mapObjects[i].rad = c;
            }
        }

        mapObjects.sort(function (a, b) {
            if (a.rad > b.rad) { return 1; }
            if (a.rad < b.rad) { return -1; }
            return  0;
        });

        for (let i = 0; i < mapObjects.length; i++) {
            let $geo = mapObjects[i];
            if ($geo.lat && $geo.lng) {
                let lat = parseFloat($geo.lat);
                let lng = parseFloat($geo.lng);
                let marker = addMarker(lat, lng, $geo, true);
                setTimeout(function () {
                    clusterer.add(marker);
                }, i * 700);
            }
        }
    }
}


function addMarkersHidden() {
    if (mapObjects && mapObjects.length) {
        for (let i = 0; i < mapObjects.length; i++) {
            let $geo = mapObjects[i];
            if ($geo.lat && $geo.lng) {
                let lat = parseFloat($geo.lat);
                let lng = parseFloat($geo.lng);
                let marker = addMarker(lat, lng, $geo, false);
                clusterer.add(marker);
            }
        }
    }
}

// Получить слой, содержащий тайлы
function getTileContainer(layer) {
    for (var k in layer) {
        if (layer.hasOwnProperty(k)) {
            if (
                layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
                || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
            ) {
                return layer[k];
            }
        }
    }
    return null;
}

// Определить, все ли тайлы загружены
function waitForTilesLoad(layer) {
    return new ymaps.vow.Promise(function (resolve, reject) {
        var tc = getTileContainer(layer), readyAll = true;
        tc.tiles.each(function (tile, number) {
            if (!tile.isReady()) {
                readyAll = false;
            }
        });
        if (readyAll) {
            resolve();
        } else {
            tc.events.once("ready", function() {
                resolve();
            });
        }
    });
}


function addMarker(lat, lng, geo, visibility) {

    let image = geo.image;
    let href = geo.href;
    let title = geo.title;
    let linkMap = geo.linkmap;

    let balloonContent = '<div class="object__mapcard">';

    if (image && href) {
        balloonContent += '<div class="object__mapcard__image">\n' +
                            '<a href="' + href + '">\n' +
                                '<img src="' + image + '">\n' +
                            '</a>\n' +
                        '</div>';
    }

    balloonContent += '<div class="object__mapcard__content">\n';

    if (title && href) {
        balloonContent += '<a class="object__mapcard__title p3 p3--bold" href="' + href + '">' + title + '</a>';
    }
    else if (title) {
        balloonContent += '<div class="object__mapcard__title p3 p3--bold">' + title + '</div>';
    }

    if (geo.adreses && geo.adreses.length) {
        geo.adreses.forEach(function(item, i, arr) {
            if (item.text) {
                balloonContent += '<div class="p4 color--gray--middle">' + item.text + '</div>';
            }
        });
    }

    balloonContent += '</div></div>';

    var marker = new ymaps.Placemark(
        [lat, lng],
        {
            balloonContentBody: balloonContent,
            clusterCaption: 'метка <strong>' + 1 + '</strong>',
        },
        {
            iconLayout: 'default#imageWithContent',
            iconImageHref: ($('input').is('[name="marker"]') && $('[name="marker"]').val()) ? $('[name="marker"]').val() : pathImage + 'marker.png',
            iconImageSize: [20, 25],
            iconImageOffset: [-10, -13],
            syncOverlayInit: true,
            visible: visibility,
        }
    );

    if (linkMap) {
        $(linkMap).on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('html, body').animate({
                scrollTop: ($('#map').offset().top)
            }, 500);

            map.setCenter([lat, lng], 15, {
                checkZoomRange: true,
            });

            setTimeout(function () {
                marker.balloon.open();
            }, 100);

        });
    }

    //geoObjects.push(marker);
    return marker;
}
