"use strict";
var pathImage = 'assets/image/';

ymaps.ready(function () {
    initMapLight();
});

var map;
if(typeof mapObjects == "undefined") {
    var mapObjects = [];
}

var clusterer;
var geoObjects;

function initMapLight() {

    var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #004391; font-weight: bold;">$[properties.iconContent]</div>'
    );

    map = new ymaps.Map('map-light', {
        center: [59.9410,30.3148],
        zoom: 11,
        behaviors: ['default']
    });

    map.behaviors.disable('scrollZoom');
    map.behaviors.disable('dblClickZoom');

    clusterer = new ymaps.Clusterer({
        clusterIcons: [{
            href: pathImage + 'marker-large.png',
            size: [32, 40],
            offset: [-16, -20]
        }],
        clusterIconContentLayout: MyIconContentLayout,
        groupByCoordinates: false
    });

    geoObjects = [];


    if (mapObjects !== undefined && mapObjects.length) {
        mapObjects.forEach(function(item, i, arr) {
            let $geo = item;
            if ($geo.lat && $geo.lng) {
                let lat = parseFloat($geo.lat);
                let lng = parseFloat($geo.lng);
                let href = $geo.href;
                addMarker(lat, lng, $geo);
            }
        });

        clusterer.add(geoObjects);
        map.geoObjects.add(clusterer);

        if (geoObjects.length === 1) {
            let bounds = map.geoObjects.getBounds();
            let boundsLat = bounds[0][0];
            let boundsLng = bounds[0][1];
            map.setCenter([boundsLat, boundsLng], 12, {checkZoomRange: true});
        }
        else {
            map.setBounds(map.geoObjects.getBounds(),{checkZoomRange: true, zoomMargin: 150});
        }
    }
}

function addMarker(lat, lng, geo) {

    let image = geo.image;
    let href = geo.href;
    let title = geo.title;

    let balloonContent = '<div class="object__mapcard object__mapcard--light">';

    if (image) {
        balloonContent += '<div class="object__mapcard__image">\n' +
                '<img src="' + image + '">\n' +
            '</div>';
    }

    balloonContent += '<div class="object__mapcard__content">\n';

    if (title) {
        balloonContent += '<div class="object__mapcard__title p3 p3--bold">' + title + '</div>';
    }

    if (geo.adres) {
        balloonContent += '<div class="p4 color--gray--middle">' + geo.adres + '</div>';
    }

    balloonContent += '</div></div>';

    var marker = new ymaps.Placemark(
        [lat, lng],
        {
            balloonContentBody: balloonContent,
            clusterCaption: 'метка <strong>' + 1 + '</strong>'
        },
        {
            iconLayout: 'default#imageWithContent',
            iconImageHref: pathImage + 'marker.png',
            iconImageSize: [20, 25],
            iconImageOffset: [-10, -13],
        }
    );

    if (href) {
        $(href).on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('html, body').animate({
                scrollTop: ($('#map-light').offset().top)
            }, 500);

            marker.balloon.open();
        });
    }

    geoObjects.push(marker);
}
