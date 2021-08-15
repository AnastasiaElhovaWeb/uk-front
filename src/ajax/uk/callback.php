
<?php

$data = $_REQUEST;

$tmp = rand(0,1);

if ($tmp) {
    $result['success'] = false;
    $result['message'] = 'Что-то пошло не так';
    $result['data'] = [
        "fio" => "ФИО должно быть длиннее",
        "phone" => "Ошибка с номером телефона",
    ];
}
else {
    $result['success'] = true;
    $result['message'] = '<div class="modal-title mb-2">Ваше обращение зарегистрировано под&nbsp;номером <b class="color--red">№23412</b></div> <p class="p2">С вами свяжутся по&nbsp;указанному телефону.</p><div class="row mt-6"><button class="btn btn-primary mr-3" data-dismiss="modal">Закрыть форму</button><button class="btn btn-primary-stroked" data-toggle="modal" data-target="#feedbackModal">Подать еще одно обращение</button></div></div>';
    $result['data'] = [];
}

sleep(5);

echo json_encode($result, JSON_UNESCAPED_UNICODE);


