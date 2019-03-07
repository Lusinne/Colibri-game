<?php
session_start();
if(!isset($_COOKIE['tkn']) ){
    $_SESSION['user'] = ['name'=>'guest'];
}else if(isset($_COOKIE['tkn']) && !isset($_SESSION['user'])){
    header('location:../index.php');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="js/promise.js"></script>
    <script src="js/promise.auto.js"></script>
    <script type="text/javascript" src="js/jquery-1.12.1.min.js"></script>
    <script type="text/javascript" src="js/sudoku.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    <script type="text/javascript" src="js/questions.js"></script>
    <link rel="icon" href="../images/colibri.jpg" type="image/x-icon">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="css/sudoku.css">
    <link rel="stylesheet" type="text/css" href="css/questions.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>

<!-- from .. -->
<?php if($_SESSION['user']['name'] !== 'guest') echo "<div class='userName'>".$_SESSION['user']['name']."</div>" ?>
<?= ($_SESSION['user']['name'] !== 'guest') ? '<a href="../exit.php" id="logOut">Դուրս գալ</a>' : '<a href="../index.php" id="logOut">Մուտք</a>' ?>
<!-- .. to -->

<div class="container">
    <div class="stages"><img src="images/1.png" alt="star" title = "1 game"><h3> Puzzle</h3></div>
    <div class="stages"><img src="images/2.png" alt="star" title = "2 game"><h3> Number Game</h3></div>
    <div class="stages"><img src="images/1.png" alt="star" title = "3 game" ><h3> Ballons</h3></div>
    <div class="stages"><img src="images/2.png" alt="star" title = "4 game"><h3> Sudoku</h3></div>
    <div class="stages"><img src="images/2.png" alt="star" title = "5 game" ></div>
    <div class="stages"><img src="images/1.png" alt="star" title = "6 game" ></div>
    <div class="stages"><img src="images/1.png" alt="star" title = "7 game" ></div>
</div>
</body>
</html>