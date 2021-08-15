"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var markArray = [];
var myMap = [];
var header = document.querySelector('.header__bottom');
var body = document.querySelector('body'),
    css = body.style;
var sticky = header.offsetTop;
var width = screen.width;
var clientWidth = document.body.clientWidth;
var intervalID;

window.onscroll = function () {
  stickyAdd();
};

function stickyAdd() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
    css.marginTop = '4rem'; //header.parentElement.css('margin-top', '4rem');
  } else {
    header.classList.remove("sticky");
    css.marginTop = '0';
  }
}

function drawMap(id, param) {
  ymaps.ready(function () {
    var map = getMap(id, param.lat, param.lng, param.zoom);
    myMap[id] = map;
    showMarkers(map, param.markers);
  });
}

function getMap(id, lat, lng, zoom) {
  var map = new ymaps.Map(document.getElementById(id), {
    center: [parseFloat(lat), parseFloat(lng)],
    zoom: parseInt(zoom),
    controls: ['zoomControl']
  });
  map.behaviors.disable('scrollZoom');
  return map;
}

function showMarkers(map, markers) {
  $.each(markers, function (i) {
    var icon = this.image ? {
      iconLayout: 'default#image',
      iconImageHref: this.image,
      iconImageSize: [20, 25]
    } : {
      iconColor: 'red',
      preset: 'islands#icon'
    };
    var placemark = new ymaps.Placemark([parseFloat(this.lat), parseFloat(this.lng)], {
      balloonContent: this.desc,
      hintContent: this.desc,
      iconCaption: this.title
    }, icon);
    markArray[i] = placemark;
    map.geoObjects.add(placemark);
  });
}

function show_point(mapId, pointId) {
  var placemark = markArray[pointId];
  var map = myMap[mapId];

  if (_typeof(placemark) === 'object' && _typeof(map) === 'object') {
    placemark.balloon.open();
    map.setCenter(placemark.geometry.getCoordinates());
  }
}

function onScroll(event) {
  var scrollPos = $(document).scrollTop();
  $('.menu__link').each(function () {
    var currLink = $(this);
    var refElement = $(currLink.attr("href"));

    if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
      currLink.addClass("menu-active");
    } else {
      currLink.removeClass("menu-active");
    }
  });
}

function checkComagic() {
  if ($('.comagic-widget').length) {
    if ($('.comagic-c-consultant-label').length) {
      showCallTouch();
    }
  }
}

function showCallTouch() {
  clearInterval(intervalID);
  var $sitephone = $('.comagic-c-sitephone-label');
  $sitephone.addClass('comagic-js-sitephone-label--hidden');
  var $calltouch = $('.calltouch');
  $calltouch.css({
    "width": $('.comagic-c-consultant-label').width(),
    "height": $('.comagic-c-consultant-label').width(),
    "bottom": $('.comagic-c-consultant-label').width() * 2,
    "left": $('.comagic-c-consultant-label').offset().left
  });
  $calltouch.fadeIn('slow');
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  options = {
    path: '/'
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (var optionKey in options) {
    updatedCookie += "; " + optionKey;
    var optionValue = options[optionKey];

    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

if (getCookie('closemp') == 'true') {
  $('.b-header__wrap-app').addClass('close');
}

$(function () {
  $('.place__renders').slick({
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    dots: true,
    arrows: true,
    speed: 1000,
    pauseOnHover: false,
    useTransform: true
  });

  if (width <= 768) {
    $('.build__items').slick({
      autoplay: true,
      autoplaySpeed: 5000,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      dots: true,
      arrows: true,
      speed: 1000,
      pauseOnHover: false,
      useTransform: true
    });
  }

  $('.header__burger').on('click', function (e) {
    $('.mobile_dropdown').addClass('visible');
    $(this).removeClass('visible');
    $(this).addClass('hidden');
    $('.header__close').removeClass('hidden');
    $('.header__close').addClass('visible');
  });
  $('.header__close').on('click', function (e) {
    $('.mobile_dropdown').removeClass('visible');
    $(this).removeClass('visible');
    $(this).addClass('hidden');
    $('.header__burger').removeClass('hidden');
    $('.header__burger').addClass('visible');
  });
  svg4everybody();
  $(".jumbotron__arrow-link").on("click", function (e) {
    var anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $(anchor.attr('href')).offset().top
    }, 777);
    e.preventDefault();
    return false;
  });
  $(".build__link").fancybox({
    openEffect: 'none',
    closeEffect: 'none'
  });
  $(document).on("scroll", onScroll);
  $('.menu__link, .header__logo, .mobile_dropdown a').on('click', function (e) {
    e.preventDefault();
    $(document).off("scroll");
    $('.menu__link').each(function () {
      $(this).removeClass('menu-active');
    });
    if (!$(this).hasClass('header__logo')) $(this).addClass('menu-active');
    var target = this.hash,
        menu = target;
    var $target = $(target);
    $('html, body').stop().animate({
      'scrollTop': $target.offset().top - 30
    }, 500, 'swing', function () {
      window.location.hash = target;
      $(document).on("scroll", onScroll);
    });
  });
  $(".btn-primary,.btn-red").fancybox();
  $('a[href="#cond-fulltext"]').on('click', function () {
    var $modal = $('#cond-fulltext');
    var $parent = $(this).closest('.conditions__item');
    $modal.find('.modal__title').text($parent.find('.conditions__name').text());
    $modal.find('.modal__body').html($parent.find('.conditions__fulltext').html());
  });
  $('.number').mask("+7 (999) 999 99-99");
  $('.tel').mask("+7 (999) 999 99-99");
  $(document).on('submit', '.form', function (e) {
    e.preventDefault();
    var $label = $('label[for="callbackConfirm"]');
    $label.removeClass('text-red');

    if ($('#callbackConfirm').prop('checked') !== true) {
      $label.addClass('text-red');
      return false;
    }

    var tel = $('.tel');

    if (tel.val().length == 18) {
      Comagic.addOfflineRequest({
        phone: tel.val()
      }, function (resp) {
        console.log(resp);
        var obj = JSON.parse(JSON.stringify(resp));
      });
      $('.form').html('<p class="modal__success">Ваш запрос отправлен.<br> В ближайшее время с Вами свяжется наш специалист.</p>');
      yaCounter6447445.reachGoal('spb_landing_zayavka');
    } else {
      tel.css('border', '1px solid #cf1b3c');
    }

    return false;
  });

  if (clientWidth <= 850) {
    intervalID = setInterval(function () {
      checkComagic();
    }, 1000);
  }

  $('.j-header-app-close').on('click', function () {
    var $form = $(this).closest('.b-header__wrap-app');
    $form.addClass('close');
    setCookie('closemp', 'true', {
      secure: true,
      'max-age': 3600
    });
  });
  $(".qr_link").fancybox({
    openEffect: 'none',
    closeEffect: 'none'
  });
});