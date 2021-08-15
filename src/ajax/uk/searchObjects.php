
<?php

$data = $_REQUEST;

$tmp = rand(0,1);


if ($tmp) {
    $result['data'] = '<div class="search-hint__list"><a class="search-hint__item" href="#">пр. Космонавтов, д.65, корп.6, лит. А</a><a class="search-hint__item" href="#">пр. Космонавтов, д.65, корп.11, лит. А</a><a class="search-hint__item" href="#">пр. Космонавтов, д.65, корп.12, лит. А</a></div>';
}
else {
    $result['data'] = '';
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);


