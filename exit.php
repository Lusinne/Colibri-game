<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
require_once 'Classes/User.php';
session_start();

$obj = new User;
$obj->deleteCookie($_SESSION['user']['id'], $_COOKIE['tkn']);
session_destroy();
header('location:index.php');
