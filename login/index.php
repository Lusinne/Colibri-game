<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Մուտք</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/png" href="login/images/colibri.jpg"/>
	<link rel="stylesheet" type="text/css" href="login/vendor/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="login/fonts/font-awesome-4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="login/fonts/iconic/css/material-design-iconic-font.min.css">
	<link rel="stylesheet" type="text/css" href="login/vendor/animate/animate.css">
	<link rel="stylesheet" type="text/css" href="login/vendor/css-hamburgers/hamburgers.min.css">
	<link rel="stylesheet" type="text/css" href="login/vendor/animsition/css/animsition.min.css">
	<link rel="stylesheet" type="text/css" href="login/vendor/select2/select2.min.css">
	<link rel="stylesheet" type="text/css" href="login/vendor/daterangepicker/daterangepicker.css">
	<link rel="stylesheet" type="text/css" href="login/css/util.css">
	<link rel="stylesheet" type="text/css" href="login/css/main.css">
</head>
<body>
	<?php $error = (isset($_SESSION['error'])) ? array_values($_SESSION['error']) : null; ?>
	<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
				<form class="login100-form validate-form" action="check.php" method="post">
					<span class="login100-form-title p-b-26">
						Մուտք գործել
					</span>
					<span class="login100-form-title p-b-48">
						<i class="zmdi zmdi-font"></i>
					</span>

					<div class="wrap-input100 validate-input" data-validate = "Վավեր Էլ. հասցե կամ մուտքանուն չէ">
						<input class="input100 <?= ($error) ? 'has-val' : '' ?>" type="text" name="login" value="<?= ($error) ? $error[0] : '' ?>">
						<span class="focus-input100" data-placeholder="Էլ․ փոստ "></span>
					</div>

					<div class="wrap-input100 validate-input" data-validate="Մւտքագրեք գաղտնաբառը">
						<span class="btn-show-pass">
							<i class="zmdi zmdi-eye"></i>
						</span>
						<input class="input100 <?= ($error) ? 'has-val' : '' ?>" type="password" name="pass" value="<?= ($error) ? $error[1] : '' ?>">
						<span class="focus-input100" data-placeholder="Գաղտնաբառ"></span>
					</div>

					<div class="container-login100-form-btn">
						<div class="wrap-login100-form-btn">
							<div class="login100-form-bgbtn"></div>
							<button class="login100-form-btn">
								Մուտք գործել
							</button>
						</div>
					</div>

					<div class="text-center p-t-70">
                        <?= ($error) ? "<div>Սխալ մուտքանուն կամ գաղտնաբառ</div>" : ''?>
						<span class="txt1">
							Դեռ գրանցված չե՞ք:
						</span>

						<a class="txt2" href="registration/index.html">
							Սեղմեք այստեղ
						</a>
					</div>
                    <div class="text-center p-t-15">
                        <a class="txt2" href="colibri-game/index.php">
                            Մուտք գործել որպես հյուր
                        </a>
                    </div>
				</form>
			</div>
		</div>
	</div>
	
    <?php unset($_SESSION['error']) ?>
	<div id="dropDownSelect1"></div>
	
	<script src="login/vendor/jquery/jquery-3.2.1.min.js"></script>
	<script src="login/vendor/animsition/js/animsition.min.js"></script>
	<script src="login/vendor/bootstrap/js/popper.js"></script>
	<script src="login/vendor/bootstrap/js/bootstrap.min.js"></script>
	<script src="login/vendor/select2/select2.min.js"></script>
	<script src="login/vendor/daterangepicker/moment.min.js"></script>
	<script src="login/vendor/daterangepicker/daterangepicker.js"></script>
	<script src="login/vendor/countdowntime/countdowntime.js"></script>
	<script src="login/js/main.js"></script>

</body>
</html>