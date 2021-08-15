
<?php

$data = $_REQUEST;

$tmp = rand(0,1);


if ($tmp) {
    $result['data'] = '<div class="search-hint__list"><div class="search-hint__title">Услуги</div><a class="search-hint__item" href="#">Сантехнические услуги с вызовом сантехника на дом...</a><a class="search-hint__item" href="#">Демонтаж унитаза со&nbsp;сливным бачком</a><a class="search-hint__item" href="#">Услуги сантехника любой сложности</a><a class="search-hint__item" href="#">Установка унитаза типа «Компакт»</a></div><div class="search-hint__list"><div class="search-hint__title">Наши мастера</div><a class="search-hint__item" href="#">Юрий Котов, сантехник ...</a><a class="search-hint__item" href="#">Иван Кайнелайнен, сантехник ...</a><a class="search-hint__item" href="#">Роман Тармаков, сантехник ...</a><a class="search-hint__item" href="#">Установка унитаза типа «Компакт»</a><a class="search-hint__item" href="#">Иван Кайнелайнен, сантехник ...</a><a class="search-hint__item" href="#">Роман Тармаков, сантехник ...</a><a class="search-hint__item" href="#">Установка унитаза типа «Компакт»</a></div>';
}
else {
    $result['data'] = '';
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);


