if (ajaxPath === undefined) {
    var ajaxPath = 'http://localhost/ajax/uk/';
}

const mobileWidth = 670;
const tabletWidth = 960;
const desktopWidth = 1280;
const heightTabContainer = 540;
const heightTabContainerDesktop = 450;
const heightTabContainerTablet = 390;


$(function () {

    $('.slider--main').slick({
        lazyLoad: 'ondemand',
        arrows: true,
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: tabletWidth,
                settings: {
                    arrows: false,
                    adaptiveHeight: true,
                }
            },
        ]
    });

    let $sliders = $('.slider--desktop');
    $sliders.each(function () {
        let $slider = $(this);
        let $sliderItems = $slider.find('.slider__item');
        if ($sliderItems && $sliderItems.length > 1) {
            $slider.slick({
                arrows: true,
                dots: true,
                infinite: true,
                speed: 300,
                variableWidth: true,
                responsive: [
                    {
                        breakpoint: desktopWidth,
                        settings: {
                            arrows: false,
                            dots: false,
                        }
                    },
                ]
            });
        }
    });



    $('.slider--content').slick({
        arrows: true,
        dots: true,
        infinite: true,
        speed: 300,
        responsive: [
            {
                breakpoint: tabletWidth,
                settings: {
                    arrows: false,
                }
            },
        ]
    });


    // Инициализация навигационного блока
    $('body').scrollspy({
        target: '#nav-content' ,
        offset: 200
    });

    $(".form-control-select").select2({
        minimumResultsForSearch: Infinity
    });

    $("input.form-control-phone").mask("+7 (999) 999-99-99");

    AjaxForm.initialize({
        'formSelector':'.ajax-form',
        'actionUrl': ajaxPath ,
    });

    $('[data-views-counter]').on('click', function () {
        let viewId = $(this).data('views-counter');
        if (viewId) {
            $.post(ajaxPath, {action:'views-counter', id: viewId});
            $(this).data('views-counter', '');
        }
    });

    scrollInfoblocks();

    svg4everybody();
});



window.addEventListener("load", function() {
    checkSizes();
    checkMobileSrc();
}, false);

window.addEventListener("resize", function() {
    checkSizes();
    checkMobileSrc();
}, false);

window.addEventListener("orientationchange", function() {
    checkSizes();
    checkMobileSrc();
}, false);

// Прерывает collapse на десктопной версии
$('body').on('hide.bs.collapse', '.footer__link__list', function() {
    if (document.body.clientWidth > mobileWidth) {
        return false;
    }
});

// Обработка collapse для документов
$('.docblock__content__all').on('shown.bs.collapse', function () {
    let $link = $(this).siblings('.document__link__all');
    if ($link.length) {
        $link.html('Скрыть');

        if ($link.hasClass('collapse--specializations')) {
            $link.html('Скрыть специальности');
        }

        if ($link.hasClass('collapse--objects')) {
            $link.html('Скрыть дома');
        }

        if ($link.hasClass('collapse--documents')) {
            $link.html('Скрыть документы');
        }

        $link.addClass('shown');
    }
});

$('.docblock__content__all').on('hidden.bs.collapse', function () {
    let $link = $(this).siblings('.document__link__all');

    if ($link.length) {

        $link.html('Показать все');

        if ($link.hasClass('collapse--specializations')) {
            $link.html('Показать все специальности');
        }

        if ($link.hasClass('collapse--objects')) {
            $link.html('Все дома');
        }

        if ($link.hasClass('collapse--documents')) {
            $link.html('Показать все документы');
        }

        $link.removeClass('shown');
    }
});

$('body').on('click', '.collapse--objects--map', function() {
    let $content = $(this).siblings('.collapse__content--objects');
    $content.collapse('toggle');

    $(this).toggleClass('shown');

    if ($(this).hasClass('shown')) {
        $link.html('Скрыть дома');
    }
    else {
        $link.html('Еще дома');
    }

});

// Скрыть/Показать всё
$('body').on('click', '.footer__content__toggle', function() {

    let $toggle = $(this);
    let $idBlock = $toggle.data('content');
    let $contentBlock = $($idBlock);

    $contentBlock.toggleClass('content--hide');
    $toggle.toggleClass('open');
    if ($contentBlock.hasClass('content--hide')) {
        $toggle.html('Показать все');
    } else {
        $toggle.html('Скрыть');
    }
});

$('body').on('click', '.category__content__toggle', function() {

    let $toggle = $(this);
    let $idBlock = $toggle.data('content');
    let $contentBlock = $($idBlock);

    $contentBlock.toggleClass('content--hide');
    $toggle.toggleClass('open');
    if ($contentBlock.hasClass('content--hide')) {
        $toggle.html('Показать все');
    } else {
        $toggle.html('Скрыть');
    }
});


// Lightbox - галерея и одиночные фото
$('body').on('click', '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    let typeFooter = $(this).data('footer-type');
    $(this).ekkoLightbox({
        onShown: function() {
            let $ekkoFooter= $(this)[0]['_$modalFooter'];
            $ekkoFooter.addClass(typeFooter);
        },
    });
});

$('body').on('click', '#callbackModal [data-target="#feedbackModal"]', function(event) {
    let $modal = $(this).closest('.modal');
    $modal.modal('hide');
});


$('.feedback_form').on('show.bs.modal', function (e) {
    let formPageName = jQuery(e.relatedTarget).attr('data-title');
    $(this).find('[name=page_name]').val(formPageName);
});


// Перенос контента услуги при открытие вкладки
$('a.service__tab[data-toggle="tab"]').on('show.bs.tab', function (e) {
    let $tab = $(this);
    let $tabActive = $(e.target);
    let $tabContainer = $tabActive.closest('.nav-item').find('.tab-content-container');
    let $tabContent = $('.tab-content');

    if ($tabContainer.length && $tabContent) {

        let $tabContainerContent = $tabContainer.find('.tab-content');

        if ($tabContainerContent && $tabContainerContent.html() !== $tabContent.html()) {
            $tabContainer.html($tabContent);
        }

        $tabContainer.css('height', heightTabContainer);

        if (document.body.clientWidth < desktopWidth) {
            $tabContainer.css('height', heightTabContainerDesktop);
        }
        if (document.body.clientWidth < tabletWidth) {
            $tabContainer.css('height', heightTabContainerTablet);
        }

        $tabContent.removeClass('d-none');
        $tab.addClass('tab-show');
    }

});

// Перенос контента услуги при закрытии вкладки
$('a.service__tab[data-toggle="tab"]').on('hide.bs.tab', function (e) {
    let $tab = $(this);
    let $tabActive = $(e.target);
    let $tabContainer = $tabActive.closest('.nav-item').find('.tab-content-container');
    let $tabContent = $('.tab-content');

    $tabContainer.css('height', 0);
    $tabContent.addClass('d-none');
    $tab.removeClass('tab-show');
});

$('a.service__tab[data-toggle="tab"]').on('click', function (e) {
    let $tabActive = $(this);
    if ($tabActive && $tabActive.hasClass('tab-show')) {
        $tabActive.trigger('hide.bs.tab');
    }
    else {
        $tabActive.trigger('show.bs.tab');
    }
});

// Кнопка скролла наверх
$(window).scroll(function() {

    let $mobileMenu = $('#menu__toggle:checked ~ .menu__box');

    if($(this).scrollTop() > 400) {
        if (!$mobileMenu.length) {
            $('#toTop').fadeIn();
        }
    } else {
        $('#toTop').fadeOut();
    }
});


$('#toTop').click(function() {
    $('body,html').animate({scrollTop:0},800);
});


$('#menu__toggle').click(function () {
    let $mobileMenu = $('#menu__toggle:checked ~ .menu__box');

    if ($mobileMenu.length) {
        $('#toTop').fadeOut();
    }
});


// Переключатель сортировки по алфавиту
$('#sortAbc').click(function () {
    let $sort = $(this);
    let sortDirection = 'desc';
    if ($sort.prop('checked')) {
        sortDirection = 'asc';
    }
    sortMeBy("data-sort", '#listObjects', ".object__item", sortDirection);
});

$('.form-control-search--header').on('click', function () {
    $('body').addClass('body-search-open');
    $('.header__top__background').addClass('search-open');
    let $form = $(this).closest('form');
    $form.addClass('form-search-open');
});

let arrVisible = [];
$('.infoblock').each(function () {
    arrVisible.push(null);
});
let scrollTopPrev = $(window).scrollTop();

function scrollInfoblocks() {
    let scrollTop = $(window).scrollTop();
    $('.infoblock').each(function(index, value) {

        let $block = $(this);
        let offsetTop = $block.offset().top;
        let heightBlock = $block.outerHeight();
        let heightWindow = $(window).height();
        let offsetBottom = heightBlock + offsetTop;
        let scrollBottom = heightWindow + scrollTop;

        if ( ( ((scrollTop - scrollTopPrev) > -1) && (scrollTop < offsetTop) ) || ( (scrollBottom - 500 < offsetBottom) && ((scrollTop - scrollTopPrev) < 0) ) ) {

            arrVisible[index] = 'visible';

            $.each(arrVisible, function(key, value) {
                if (key !== index) {
                    arrVisible[key] = null;
                    $('.infoblock').eq(key).removeClass('animated');
                }
            });


            if (!$block.hasClass('animated')) {

                infoblockCount($block);

                $('.infoblock__icon__value').each(function() {
                    let $cifres = $(this);
                    animateCounter($cifres);
                    $block.addClass('animated');
                });
            }

            return false;
        }

        else {
            arrVisible[index] = null;
            $block.removeClass('animated');
        }

    });


    scrollTopPrev = scrollTop;
}


$(window).on('scroll', function () {
    scrollInfoblocks();
});


// Сокрытие подсказки поиска
$(document).mouseup(function (e){
    let $div = $(".search-hint.search-hint--active");
    let $div2 = $div.siblings(".form-control-search");
    if (!$div.is(e.target) && $div.has(e.target).length === 0) {
        if (!$div2.is(e.target) && $div2.has(e.target).length === 0) {
            $div.removeClass('search-hint--active');
        }
    }
});


$(document).mouseup(function (e){
    let $div = $(".form-control-search--header");
    if (!$div.is(e.target) && $div.has(e.target).length === 0) {
        $('.body-search-open').removeClass('body-search-open');
        $('.search-open').removeClass('search-open');
        $('.form-search-open').removeClass('form-search-open');
    }
});


// Прикрепление файла
let inputs = $('.form-control-file');
inputs.each(function () {
    let input = $(this);
    let label	 = input.next('label');
    let labelVal = label.html();

    input.on('change', function (e) {
        let fileName = '';

        if (this.files) {
            if( this.files.length > 1 ) {
                let textCountFiles = num2str( this.files.length, ['файл', 'файла', 'файлов']);
                fileName = "Выбрано " + this.files.length + " " + textCountFiles;
            }
            else {
                switch(this.files.length) {
                    case 1:
                        fileName = e.target.value.split( '\\' ).pop();
                        break;
                    case 0:
                        fileName = 'Выбрать файл';
                        break;
                }
            }
        }
        else {

        }

        if( fileName )
            label.html(fileName);
        else
            label.html(labelVal);
    });
});


function checkSizes() {

    let $slidersTablet = $(".slider--tablet");
    $slidersTablet.each(function () {
        let $slider = $(this);
        let init = $slider.hasClass('slick-initialized');
        if (document.body.clientWidth < desktopWidth) {
            if (!init) {
                initSlider($slider);
            }
        }
        else {
            if (init) {
                destroySlider($slider);
            }
        }
    });

    let $slidersMobile = $(".slider--mobile");
    $slidersMobile.each(function () {
        let $slider = $(this);
        let init = $slider.hasClass('slick-initialized');
        if (document.body.clientWidth < mobileWidth) {
            if (!init) {
                initSlider($slider);
            }
        }
        else {
            if (init) {
                destroySlider($slider);
            }
        }
    });



    if (document.body.clientWidth < mobileWidth) {
        drawFooterMobile();
    }
    else  {
        drawFooterDesktop();
    }

}

function drawFooterMobile() {
    $('.footer__link__list').collapse('hide');
}

function drawFooterDesktop() {
    let $footerBlocks = $('.footer__content__block');
    $footerBlocks.each(function () {
        let $footerBlock = $(this);
        let $footerBlockItems = $footerBlock.find('.footer__item');
        if ($footerBlockItems.length > 4) {
            let footerBlockHeight = 0;
            for (let i = 0; i < 4; i++) {
                let $footerItem = $($footerBlockItems[i]);
                footerBlockHeight += $footerItem.outerHeight(true);
            }
            $footerBlock.css('height', footerBlockHeight);
        }
    });

    $('.footer__link__list').collapse('show');
}

function initSlider($slider) {
    $slider.slick({
        arrows: false,
        dots: false,
        infinite: true,
        speed: 300,
        variableWidth: true,
    });
}

function destroySlider($slider) {
    $slider.slick('unslick');
    $slider.removeClass('slick-initialized');
}


// Проверить, есть ли мобильная версия картинки для слайдера
function checkMobileSrc() {

    let $mobileImages = $('[data-src-mobile]');
    $mobileImages.each(function () {
        let $image = $(this);
        if ($image.data('src-mobile') && $image.data('src-desktop')) {

            if (document.body.clientWidth < mobileWidth) {
                $image.prop('src', $image.data('src-mobile'));
            }
            else  {
                $image.prop('src', $image.data('src-desktop'));
            }

        }
    });

    $('.slider--main').slick('reinit');

}


// Функция сортировки
function sortMeBy(arg, sel, elem, order) {
    var $selector = $(sel),
        $element = $selector.children(elem);
    $element.sort(function(a, b) {
        var an = a.getAttribute(arg),
            bn = b.getAttribute(arg);
        if (order == "asc") {
            if (an > bn)
                return 1;
            if (an < bn)
                return -1;
        } else if (order == "desc") {
            if (an < bn)
                return 1;
            if (an > bn)
                return -1;
        }
        return 0;
    });
    $element.detach().appendTo($selector);
}


// Подсказка для поиска
function hintSearch($hintSearch, formdata) {
    let res = $.post( ajaxPath, formdata,  function( json ) {

        $hintSearch.html('Ничего не найдено');

        if (json && json.data && json.data.length) {
            $hintSearch.html(json.data);
        }

        $hintSearch.addClass('search-hint--active');

    }, 'json');

    return (res);
}

// Подсветка для поиска
function highlight(container, word) {

    let $container = $(container);
    let $children = $container.find('*');

    if (!$children.length) {
        $children = $container;
    }

    $children.each(function () {
        let $childElem = $(this);
        if ( ($childElem.children().length === 0) || ($childElem.children('br').length > 0) ) {

            let re;
            let text = $childElem.html();
            re = new RegExp(word.replace(/[её]/g, "[её]"), 'gi');
            if (re.test(text)) {
                text = text.replace(re, '<span class="highlight">$&</span>');
            }
            $childElem.html(text);
        }
    });

}

// Модальное сообщение после отправки формы

function highlight2(container, str) {
    let $container = $(container);
    let $children = $container.find('*');

    if (!$children.length) {
        $children = $container;
    }

    $children.each(function () {
        let $childElem = $(this);

        if ($childElem.children().length === 0 || $childElem.children('br').length > 0) {
            let re;
            let text = $childElem.html();

            let arr = str.split(" ");
            arr.forEach(function(word, i, arr) {
                if (word.length > 0) {
                    re = new RegExp(word.replace(/[её]/g, "[её]"), 'gi');

                    if (re.test(text)) {
                        text = text.replace(re, '<span class="highlight">$&</span>');
                    }
                }
            });

            $childElem.html(text);
        }
    });
}


function notificationMessage(status, message) {
    console.log(message);
    if (message && message.length) {
        let $modal = $('#callbackModal');
        $modal.find('.modal-body').html(message);
        $modal.modal('show');
    }
}

function animateCounter($item) {  // Анимация счетчика чисел
    let count = parseInt( $item.attr('counter') );

    $item.prop('counter', count).animate({
        counter: parseInt($item.text())
    }, {
        duration: 500,
        easing: 'swing',
        step: function(now) {
            let nowData = parseInt(now).toString();
            nowData = nowData.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
            $item.text(nowData);
        }
    });
}

function infoblockCount($block) {  // Переключение на параметры текущего блока

    let $blockInfo = $('#nav-content-info');

    let blockTitle = $block.find('.infoblock__title').html();
    let peoples =  parseInt( $block.data('peoples') );
    let houses = parseInt( $block.data('houses') );
    let metres = parseInt( $block.data('metres') );
    let employers = parseInt( $block.data('employers') );

    let $peoplesItem = $blockInfo.find('[data-name="peoples"]');
    let $housesItem = $blockInfo.find('[data-name="houses"]');
    let $metresItem = $blockInfo.find('[data-name="metres"]');
    let $employersItem = $blockInfo.find('[data-name="employers"]');

    $blockInfo.find('.h2').html(blockTitle);

    $peoplesItem.closest('.list-group-item').addClass('d-none');
    if ($peoplesItem && peoples) {
        $peoplesItem.html(peoples);
        $peoplesItem.closest('.list-group-item').removeClass('d-none');
        if (peoples % 1 === 0) {
            $peoplesItem.removeAttr('counter');
        }
    }

    $housesItem.closest('.list-group-item').addClass('d-none');
    if ($housesItem && houses) {
        $housesItem.html(houses);
        $housesItem.closest('.list-group-item').removeClass('d-none');
        if (houses % 1 === 0) {
            $housesItem.removeAttr('counter');
        }
    }

    $metresItem.closest('.list-group-item').addClass('d-none');
    if ($metresItem && metres) {
        $metresItem.html(metres);
        $metresItem.closest('.list-group-item').removeClass('d-none');
        if (metres % 1 === 0) {
            $metresItem.removeAttr('counter');
        }
    }

    $employersItem.closest('.list-group-item').addClass('d-none');
    if ($employersItem && employers) {
        $employersItem.html(employers);
        $employersItem.closest('.list-group-item').removeClass('d-none');
        if (employers % 1 === 0) {
            $employersItem.removeAttr('counter');
        }
    }
}



// Аякс-формы
let AjaxForm = {
    initialize: function (afConfig) {
        $(document).on('submit', afConfig['formSelector'], function (e) {
            $(this).ajaxSubmit({
                dataType: 'json',
                url: afConfig['actionUrl'],
                beforeSerialize: function (form) {
                    //Валидация
                    let $form = $(form);
                    if (!validateForm($form)) {
                        return false;
                    }
                },
                beforeSubmit: function (fields, form) {
                    if (typeof(afValidated) != 'undefined' && afValidated == false) {
                        return false;
                    }
                    form.find('.invalid-feedback').html('');
                    form.find('.is-invalid').removeClass('is-invalid');
                    form.find('input,textarea,select,button').attr('disabled', true);
                    return true;
                },
                success: function (response, status, xhr, form) {
                    form.find('input,textarea,select,button').attr('disabled', false);
                    form.removeClass('was-validated');
                    response.form = form;
                    var dataForm = $(form).attr('data-form');
                    $('#callbackModal').on('click', '.resp-btns .recall-form', function(){
                        $('#feedbackModal'+dataForm).modal('show');
                    });
                    $(document).trigger('af_complete', response);
                    if (!response.success) {
                        if (response.data) {
                            var key, value;
                            for (key in response.data) {
                                if (response.data.hasOwnProperty(key)) {
                                    let input = $(form).find('[name="' + key + '"]');
                                    value = response.data[key];
                                    input.siblings('.invalid-feedback').html(value);
                                    input.addClass('is-invalid');
                                }
                            }
                        }
                    }
                    else {
                        let $modal = form.closest('.modal');
                        if ($modal.length) { // если форма внтури модального окна, то закрыть это окно
                            form.resetForm();
                            $modal.modal('hide');
                        }
                        $('#callbackModal').find('.resp-btns .recall-form').data('target', '#feedbackModal'+dataForm);

                        $('#callbackModal').find('.resp-btns .recall-form').data('target', '#feedbackModal' + dataForm);
                        form.find('.is-invalid').removeClass('is-invalid');
                        form[0].reset();
                        if (typeof(grecaptcha) != 'undefined') {
                            grecaptcha.reset();
                        }
                        AjaxForm.Message.success(response.message);
                    }

                }
            });
            e.preventDefault();
            return false;
        });

        $(document).on('reset', afConfig['formSelector'], function () {
            AjaxForm.Message.close();
        });
    },
    Message: {
        success: function (message) {
            notificationMessage('success', message);
        },
        error: function (message) {
            notificationMessage('error', message);
        },
        close: function () {
        }

    }
};



// Валидация
function validateForm($form) {

    $form.find('.is-invalid').removeClass('is-invalid');
    $form.find('.is-valid').removeClass('is-valid');
    let inputs = $form.find('.form-control:input:not(.no-validate)');

    inputs.each(function () {

        let input = (this);

        if (input.checkValidity() === false) {
            let inputCustomValidation = new CustomValidation();
            inputCustomValidation.checkValidity(input);
            let customValidityMessage = inputCustomValidation.getInvalidities();
            let $invalidFeedback = $(input).parents('.form-group').find('.invalid-feedback');
            $invalidFeedback.html(customValidityMessage);

        }

    });

    $form.addClass('was-validated');

    let $errorInput = $form.find('.form-control:invalid:not(.no-validate)');

    return !$errorInput.length;

}

function CustomValidation() { }

CustomValidation.prototype = {
    invalidities: [],

    checkValidity: function(input) {

        this.invalidities = [];

        var validity = input.validity;

        if (validity.patternMismatch) {
            let placeholder = $(input).attr('placeholder');
            this.addInvalidity('Введите данные в виде ' + placeholder);
        }

        if (validity.rangeOverflow) {
            let max = $(input).attr('max');
            this.addInvalidity('Максимальное значение ' + max);
        }

        if (validity.rangeUnderflow) {
            let min = $(input).attr('min');
            this.addInvalidity('Мимальное значение ' + min);
        }

        if (validity.stepMismatch) {
            this.addInvalidity('Значение не соответствует указаному шагу');
        }

        if (validity.tooLong) {
            let max = $(input).attr('maxlength');
            let textCount = num2str( max, ['символ', 'символа', 'символов']);
            this.addInvalidity('Максимум ' + max + ' ' + textCount);
        }

        if (validity.tooShort) {
            let min = $(input).attr('minlength');
            let textCount = num2str( min, ['символ', 'символа', 'символов']);
            this.addInvalidity('Минимум ' + min + ' ' + textCount);
        }

        if (validity.typeMismatch) {
            let type = $(input).attr('type');
            this.addInvalidity('Некорректный ' + type);
        }

        if (validity.valueMissing) {
            this.addInvalidity('Обязательное поле');
        }
    },

    addInvalidity: function(message) {
        this.invalidities.push(message);
    },

    getInvalidities: function() {
        return this.invalidities.join('. \n');
    }
};


$(document).ready(function(){
    $('.nav-tabs .nav-link').each(function() {
        let tabName = $(this).attr('aria-controls');
        if(0 == $('.tab-pane#' + tabName).length) $(this).siblings('.tab-content-container').remove();
    });

    let url = window.location.href;
    let hash = url.substring(url.indexOf("#")+1);
    let navLink = $('.nav-link[href="#' + hash + '"]');
    if('undefined' !== typeof navLink && null != navLink) navLink.tab('show');

    $( ".footer__link__list" ).each(function( index ) {
        $(this).attr('data-count', $(this).children().length);
    });
    $('#newsFilter select').on('change', function() {
        $(this).closest('form').submit();
    })

});

$(document).on('af_complete', function(event, response) {
    if(!response.success) response.message = 'Ошибка заполнения!';
});

function num2str(n, text_forms) {
    n = Math.abs(n) % 100; var n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}


function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

if( !getCookie('closemp')) {
    $('.b-header__wrap-app').addClass('open');
}


$('.j-header-app-close').on('click', function(){
    let $form = $(this).closest('.b-header__wrap-app');
    $form.removeClass('open');
    setCookie('closemp', 'true', {secure: true, 'max-age': 3600});
});



