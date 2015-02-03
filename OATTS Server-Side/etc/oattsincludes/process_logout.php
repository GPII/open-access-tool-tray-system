<?php
error_log("In process_logout.php");

include_once 'lib.php';
sec_session_start(false,true);

//include_once 'dbconnect.php';
 
// Unset all session values 
$_SESSION = array();
 
// get session parameters 
$params = session_get_cookie_params();
 
// Delete the actual cookie. 
setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
 
// Destroy session 
session_destroy();
header("Location: " . $baseURL . '/index.html');
exit();
