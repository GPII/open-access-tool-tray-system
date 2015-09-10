<?php
/*some references looked at
//lib/mysql.php';
//http://www.wikihow.com/Create-a-Secure-Login-Script-in-PHP-and-MySQL 
//https://github.com/defuse/password-hashing/blob/master/compatible/test.php
//http://www.alexlaird.com/2012/02/secure-php-login/
//http://www.acros.si/papers/session_fixation.pdf

//On all pages, check if user logged in.  If not, redirect to login page.  If logged in, go to desired page.
//use sessions(server) and/or cookies(client) to determine if logged in
*/

include './includes/path.php';
include_once ROOT_PATH . '/lib.php';

/***********************/
if (isset($globalDebug)) {
	define('DEBUG_LOGIN',$globalDebug);
} else {
	define('DEBUG_LOGIN',true);
}
if (DEBUG_LOGIN) error_log("In login.php");
/***********************/

sec_session_start(false,true);  //don't regen session id; update if already there

if (login_check($mysqli) == true) {
	header("Location: " . $baseURL . '/main.php');
	exit();
} else {
	$reg = 0;
	$error = 0;
	if (isset($_GET['registered'])) {
		$tmp = filter_input(INPUT_GET, 'registered', FILTER_SANITIZE_NUMBER_INT);
		if (filter_var($tmp, FILTER_VALIDATE_INT)) $reg = $tmp;
	}
	if (isset($_GET['error'])) {
		$tmp = filter_input(INPUT_GET, 'error', FILTER_SANITIZE_NUMBER_INT);
		if (filter_var($tmp, FILTER_VALIDATE_INT)) $error = $tmp;
	}
}

?>
<!DOCTYPE html>
<html>

	<head>
		<title>OATTS Login Page</title>
		
		<link rel="stylesheet" type="text/css" href="styles/normalize.css?v=<?php echo time(); ?>" />
		<link rel="stylesheet" type="text/css" href="js/ui/jquery-ui.css?v=<?php echo time(); ?>" />
		<link rel="stylesheet" type="text/css" id="traystyles" href="styles/style.css?v=<?php echo time(); ?>" />
	</head>
	
	<body class="signin-body" style="display: none;">
		
		<div id="signin-zoom">
			<span id="zoom-buttons">
				<button type="button" id="zoomout" class="zoom-letter" title="Zoom Smaller (Ctrl -)" onclick="zoomSmaller();">A<sup>-</sup></button>
				<button type="button" id="zoomdefault" class="zoom-letter" title="Zoom to 100% (Ctrl 0)" onclick="zoomDefault();">A</button>
				<button type="button" id="zoomin" class="zoom-letter" title="Zoom Bigger (Ctrl +)" onclick="zoomBigger();">A<sup>+</sup></button>
			</span>
		</div>
	
		<h1 class="signin-header">OATTS Login Page</h1>
		
		<?php
		if ($error == 5) {
			echo "<p class='error'>Too many invalid attempts.  Account temporarily locked.</p>";
		} else if ($error != 0) {
			echo "<p class='error'>Error Logging In!</p>";
		}
		if ($reg == REGISTERED) {
			echo '<p>Registration successful! You can now log in below.</p>';
		}
		?> 
		
		<form action="<?php echo ($baseURL . "/includes/process_login.php") ?>" method="post" name="login_form">
			<div class="signin-entry-field">
				Email: <input type="text" title="Enter email address" name="email" />
			</div>
			<div class="signin-entry-field password-entry-field">
				Password: <input type="password" title="Enter password" name="p" id="password" />
			</div>
			<p>
				<input type="button" value="Log In" title="Log in to OATTS" style="padding-left: 1em; padding-right: 1em;" onclick="submit();" /> 
			</p>
		</form>
		
		<p>If you don't have a login, please <a title="Register as a new user" href="<?php echo ($baseURL . "/register.php") ?>">register</a> as a new user, or use the Demonstration mode below.</p>
		
		<form action="<?php echo ($baseURL . "/main.php") ?>">
			<input type="submit" value="Demo Mode" title="Run OATTS in Demo mode" style="padding-left: 0.5em; padding-right: 0.5em; margin-right: 0.6em;" />(Settings and changes are not saved in Demo mode.)
		</form>
		
		<!--
		<?php echo "<p>[server = " . $baseURL . "]</p>";?>
		-->
		
		<script src="js/jquery.js" ></script>
		<script src="js/ui/jquery-ui.js" ></script>
		<script type="text/JavaScript" src="js/forms.js?v=<?php echo time(); ?>"></script>
		
	</body>
	
</html>
