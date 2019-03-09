<?php

if(!isset($_POST) || empty($_POST)){
    header('location:index.php');
    die;
}

spl_autoload_register(function ($class_name) {
    require_once 'Classes/' . $class_name . '.php';
});

session_start();

if(count($_POST) >= 6){
    $obj = new SignUp($_POST);
    if($answer = $obj->registration($_POST)){
        $_SESSION['user'] = $answer;
//        echo ' asdasd';
//        die;
        header('location:index.php');
        die;
    }
//    else{
//        echo 'vvvv';
//    }
    else{
        header('location:registration/index.html');
        die;
    }
}
elseif(count($_POST) === 2){
    $obj = new SignIn($_POST);
    $answer = $obj->sign($_POST);
    if($answer){
        $_SESSION['user'] = $answer[0];
        header('location:colibri-game');
        die;
    }else{
        $_SESSION['error'] = $_POST;
        header('location:index.php');
        die;
    }
}
else{
    header('location:index.php');
}
