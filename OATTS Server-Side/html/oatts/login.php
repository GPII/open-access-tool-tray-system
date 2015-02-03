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
		<title>OATTS Tool</title>
		<link rel="stylesheet" href="styles/style.css" />
		<script type="text/JavaScript" src="js/forms.js"></script> 
	</head>
	<body>
		<?php
		echo '<h1 id="loginhead">OATTS Tool</h1>';
		if ($error == 5) {
			echo "<p class='error'>Too many invalid attempts.  Account temporarily locked.</p>";
		} else if ($error != 0) {
			echo "<p class='error'>Error Logging In!</p>";
		}
		if ($reg == REGISTERED) {
			echo '<p>Registration successful! You can now log in below.</p>';
		}
		?> 
		
		<form action="<?php echo ($baseURL. "/includes/process_login.php")?>" method="post" name="login_form">                      
			Email: <input type="text" name="email" />
			Password: <input type="password" 
							 name="p" 
							 id="password"/>
			<input type="button" 
				   value="Login" 
				   onclick="submit();" /> 
		</form>
		<p>If you don't have a login, please <a <?php echo ("href=\"" .$baseURL. "/register.php")?>">register</a> as a new user, or use the Demonstration option below.</p>

		<div id='guestdiv'>
		<form action="<?php echo ($baseURL. "/main.php")?>">
			<input type="submit" value="DEMO Mode">
		</form>
		<p>**Settings and changes won't be saved when using the Demonstration Mode</p>
		</div>

		
		<?php echo "<p>[server = " . $baseURL . "]</p>";?>
	</body>
</html>
