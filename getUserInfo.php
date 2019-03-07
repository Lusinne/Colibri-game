<?php
session_start();
//$_POST = ['first' => 'yea' , 'id' => 1];
require_once 'Classes/gameControl.php';
if(empty($_POST))die("You don't send information");
$obj = new gameControl;
if(isset($_POST['action']) && $_POST['action'] === 'topTen'){
    echo json_encode($obj->getTop10($_POST['gameId'],$_POST['type']));
    die;
}
if(!isset($_SESSION['user']['id'])){
    echo json_encode('guest');
    die;
}
$id = $_SESSION['user']['id'];
if(isset($_POST['first'])){
    echo json_encode($obj->getFirstInfo($id));
}
elseif (isset($_POST['addProgress'])){
    echo json_encode($obj->updateDetails($id,$_POST['gameId'],$_POST['time'],$_POST['progress'],$_POST['points']));
}
