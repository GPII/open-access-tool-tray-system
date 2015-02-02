<?php
include_once 'lib.php';

/***********************/
if (isset($globalDebug)) {
	define('DEBUG_PROCLOGIN',$globalDebug);
} else {
	define('DEBUG_PROCLOGIN',true);
}
if (DEBUG_PROCLOGIN) error_log("In process_login.php");
/***********************/

sec_session_start(false,true);

$loginFail = false;

//sanitize and validate
if (isset($_POST['email'], $_POST['p'])) {
	$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
	$password = filter_input(INPUT_POST, 'p', FILTER_SANITIZE_STRING);
	if (($email === false) || ($password === false)) {
		$loginFail = true;
	} else if (!($email = filter_var($email, FILTER_VALIDATE_EMAIL))) {
		$loginFail = true;
	} else {
		//use the hashed form of the password to sanitize/ defined length
		$password = hash('sha512', $password);
	}
} else {
	// The correct POST variables were not sent to this page. 
	header("Location: " . $baseURL . '/error.php?err=Could not process login');
	exit();
}
/*
//now check
if ((! $loginFail) && (login($email, $password, $mysqli) == true)) {
	// Login success 
	error_log("login success - session id = ".session_id());
	header("Location: " . $baseURL . '/main.php');
	exit();
*/	
if (! $loginFail) {
	$loginResp = login($email, $password, $mysqli);
	if ($loginResp == 'success') {
		// Login success 
		error_log("login success - session id = ".session_id());
		header("Location: " . $baseURL . '/main.php');
		exit();
	} else if ($loginResp == 'Lockout') {
		error_log("login failure - account locked-out");
		header("Location: " . $baseURL . '/login.php?error=5');
		exit();
	}
}
	
// Login failed 
error_log("login failure - process_login");
header("Location: " . $baseURL . '/login.php?error=1');
exit();
