<?php
session_start();
if(empty($_COOKIE['tkn'])){
    $_SESSION['user'] = ['name'=>'guest'];
    require_once 'login/index.php';
}
else{
    require_once 'Classes/User.php';
    $obj = new User;
    date_default_timezone_set('Asia/Yerevan');
    if($userId = $obj->checkCookie($_COOKIE['tkn'],time())){
        $_SESSION['user'] = $obj->getUserInfo($userId['userId'])[0];
        header('location:./Colibri-game');
    }else{
        $_SESSION['user'] = ['name'=>'guest'];
        header('location:./Colibri-game');
    }
}