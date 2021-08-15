<?php
$action = $_REQUEST['action'];
switch ($action) {
    default:
        include_once $action.'.php';
        break;
}
