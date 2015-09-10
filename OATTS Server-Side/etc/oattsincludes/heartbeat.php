<?php
include_once 'lib.php';

/***********************/
if (isset($globalDebug)) {
	define('DEBUG_HEARTBEAT',$globalDebug);
} else {
	define('DEBUG_HEARTBEAT',true);
}
if (DEBUG_HEARTBEAT) error_log("In heartbeat.php");
/***********************/

sec_session_start(false,false); //don't regenerate session id; DON'T touch timestamp

if (login_check($mysqli) != true) {
	if (DEBUG_HEARTBEAT) error_log('not logged in - heartbeat.php');
	//http_response_code(401); //unauthorized
	echo '{"error":"0", "status":"0","reason":"Not Logged In"}';
	exit();
} else {
	if (DEBUG_HEARTBEAT) error_log('Logged in - hearbeat.php');
	echo '{"error":"0", "status":"0","reason":"Logged In","user": "'.$_SESSION['username'].'"}';
	exit();
}
