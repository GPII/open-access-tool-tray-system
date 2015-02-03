<?php
include_once 'lib.php';

/***********************/
if (isset($globalDebug)) {
	define('DEBUG_DATASAVE',$globalDebug);
} else {
	define('DEBUG_DATASAVE',true);
}
if (DEBUG_DATASAVE) error_log("In datasave.php");
/***********************/

sec_session_start(false, true); // don't regenerate session id; DO touch timestamp

if (login_check($mysqli) != true) {
	if (DEBUG_DATASAVE) error_log('not logged in - datasave.php');
	//http_response_code(401); //unauthorized
	echo '{"error":"0", "reason":"Not Logged In"}';
	exit();
} else {
	if (DEBUG_DATASAVE) error_log('Logged in - datasave.php');

	$data = "[]";
	$tmpData = "";
	$trayData = "[]";
	$favData = "[]";
	$settingsData = "{}";
	$userid = "";
	$stmt = "UPDATE oatts SET ";
	$dataArray = array();
	
	if (isset($_POST['tray'])) {
		$trayData = $_POST['tray'];
		if ($trayData != "NONE") {
			//---### $trayData = base64_decode(strtr($trayData, "_!", "=/"));   // decode Tray data (was encoded to avoid tripping server-side ModSecurity)
			$trayData = base64_decode($trayData);   // decode Tray data (was encoded to avoid tripping server-side ModSecurity)
			CheckData($trayData, "Tray");
			array_push($dataArray, $trayData);
			if (count($dataArray) > 1) $stmt .= ",";
			$stmt .= "tray=?";
		}
	}
	if (isset($_POST['favorites'])) {
		$favData = $_POST['favorites'];
		if ($favData != "NONE") {
			//---### $favData = base64_decode(strtr($favData, "_!", "=/"));   // decode Favorites data (was encoded to avoid tripping server-side ModSecurity)
			$favData = base64_decode($favData);   // decode Favorites data (was encoded to avoid tripping server-side ModSecurity)
			CheckData($favData, "Favorites");
			array_push($dataArray, $favData);
			if (count($dataArray) > 1) $stmt .= ",";
			$stmt .= "providers=?";
		}
	}
	if (isset($_POST['settings'])) {
		$settingsData = $_POST['settings'];
		if ($settingsData != "NONE") {
			CheckData($settingsData, "Settings");
			array_push($dataArray, $settingsData);
			if (count($dataArray) > 1) $stmt .= ",";
			$stmt .= "settings=?";
		}
	}
	
	if (count($dataArray) == 0) {
		if (DEBUG_DATASAVE) error_log('Error: No data passed to datasave.php');
		echo '{"error":"10", "reason":"No data to save"}';
		exit();
	}
	
	$stmt .= " WHERE userId=?";
	$userid = $_SESSION['user_id'];
	
	// Update data
	if ($insert_stmt = $mysqli->prepare($stmt)) {
		if (count($dataArray) == 1) $insert_stmt->bind_param('si', $dataArray[0], $userid);
		else if (count($dataArray) == 2) $insert_stmt->bind_param('ssi', $dataArray[0], $dataArray[1], $userid);
		else $insert_stmt->bind_param('sssi', $dataArray[0], $dataArray[1], $dataArray[2], $userid);
		
		if (DEBUG_DATASAVE) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
		
		// Execute the prepared query.
		if (! $insert_stmt->execute()) {
			if (DEBUG_DATASAVE) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
			//---### echo '{"error":"4", "reason":"datasave failure"}';
			echo '{"error":"4", "message":"Could not save data (error 4).", "reason":"datasave failure"}';   //---###
			exit();
		} else {
			if (DEBUG_DATASAVE) error_log("Providers updated in datasave");
		}
	} else {
		// Could not create a prepared statement
		if (DEBUG_DATASAVE) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
		//---### echo '{"error":"5", "reason":"datasave failure"}';
		echo '{"error":"5", "message":"Could not save data (error 5).", "reason":"datasave failure"}';   //---###
		exit();
	}

	echo '{"error":"0", "reason":"Logged In", "user": "'.$_SESSION['username'].'"}';
}

// Validate data.
function CheckData($dataToCheck, $sectionName) {
	if (!is_string($dataToCheck)) {
		//---### echo '{"error":"1", "param":"', $sectionName, '", "reason":"datasave failure"}';
		echo '{"error":"1", "message":"', $sectionName, ' data not valid (error 1).", "reason":"datasave failure"}';   //---###
		exit();
	}
	if (strlen($dataToCheck) > DATA_SIZE_LIMIT) {   // Make sure it doesn't exceed a "reasonable" size limit
		//---### echo '{"error":"2", "param":"', $sectionName, '", "reason":"datasave failure"}';
		echo '{"error":"2", "message":"Too much ', $sectionName, ' data (error 2).", "reason":"datasave failure"}';   //---###
		exit();
	}
	@json_decode($dataToCheck);
	if (json_last_error() !== JSON_ERROR_NONE) {
		//---### echo '{"error":"3", "param":"', $sectionName, '", "reason":"datasave failure"}';
		echo '{"error":"3", "message":"', $sectionName, ' data structure not valid (error 3).", "reason":"datasave failure"}';   //---###
		exit();
	}
}
