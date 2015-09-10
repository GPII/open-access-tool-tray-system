<?php

include_once 'config/server.php';

/***********************/
if (isset($globalDebug)) {
	define('DEBUG_LIB',$globalDebug);
} else {
	define('DEBUG_LIB',true);
}
if (DEBUG_LIB) error_log('********************************************************************');
if (DEBUG_LIB) error_log("In lib.php");
/***********************/

if (SQL_SECURE) {
	$mysqli = mysqli_init();
	if (!mysqli_real_connect($mysqli, HOST, USER, PASSWORD, DATABASE,3306,NULL,MYSQLI_CLIENT_SSL)) {
		error_log("mysql_real_connect error");
		error_log('Connect error: '.$mysqli->connect_error);
		//should switch to guest mode
		header("Location: " . $baseURL . '/error.php?err=Unable to connect to MySQL');
		exit();
	} else {
		error_log("mysql mode: secure");
	}
} else {
	$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
	if ($mysqli->connect_error) {
		error_log("new mysqli error");
		error_log('Connect error: '.$mysqli->connect_error);
		//should switcht o guest mode
		header("Location: " . $baseURL . '/error.php?err=Unable to connect to MySQL');
		exit();
	} else {
		error_log("mysql mode: insecure");
	}
}

/****************************************************************************/
//regen - if true will generate a new session id
//update - if true will allow session last-accessed-time to be updated, thereby resetting the idle timeout
function sec_session_start($regen, $update) {

	global $baseURL;

	if (DEBUG_LIB) error_log("In function sec_session_start");
	
	/***********/
	if (DEBUG_LIB) {
		if ($_COOKIE) {
			ob_start();
			var_dump($_COOKIE);
			$result = ob_get_clean();
			error_log('cookie found =: '.$result);
			
			//session_id('abcdefghijvk');
			$tmpId = array_values($_COOKIE);
			ob_start();
			var_dump($tmpId);
			$result = ob_get_clean();
			error_log('cookie array =: '.$result);
		} else  {
			error_log('No cookie found');
		}

	}
	/***********/
	
	//make sure no bad session id passed in.
	if ($_COOKIE) {
		$tmpId = array_values($_COOKIE);
		//use values appropriate for our session_id
		if ( isset($tmpId[0]) && ($tmpId[0] <> '') && !preg_match('/^[a-v0-9]{103}$/', $tmpId[0])) {
			session_id('');
			if (DEBUG_LIB) error_log("sec_session_start: cookie session_id cleared");
		}
	}
	
	$session_name = 'oatts_session_id';	// Set a custom session name 
	$session_hash = 'sha512';			// Hash algorithm to use for the sessionid.
										// session id/file names become 108 chars long with sha512

	/****************************************/
	//Make session id a bit more complicated
	
	// Make sure hash is available
	if (in_array($session_hash, hash_algos())) {
		ini_set('session.hash_function', $session_hash);
	}
	// How many bits per character of the hash.
	// '5' (0-9, a-v), '6' (0-9, a-z, A-Z, "-", ",").
	ini_set('session.hash_bits_per_character', 5);

	// better session id's  - this is default in php 5.4
	ini_set('session.entropy_file', '/dev/urandom'); 
	ini_set('session.entropy_length', '512');
	
	//id's will be 128 chars with 4 bits
	//id's will be 103 chars with 5 bits
	/****************************************/
	
	// Force sessions to only use cookies.
	if (ini_set('session.use_only_cookies', 1) === FALSE) {
		header("Location: " . $baseURL . '/error.php?err=Could not initiate a safe session (ini_set)');
		exit();
	}

	//For this session, set garbage collection appropriately for devel or production environment
	// 10/100 =10%  increase or set a cron job for production environment
	ini_set('session.gc_probability', 10); 
	ini_set('session.gc_divisor', 100); 
	
	// Set the session name to our name for use in cookie
	session_name($session_name);

	// Gets current session cookies params
	$cookieParams = session_get_cookie_params();

	// Update settings for use when new cookie created
	session_set_cookie_params(
		MAX_COOKIE_LIFETIME,
		$cookieParams["path"],
		$cookieParams["domain"],
		SECURE,
		true); //secure and httponly

	/*****************/
	//Setup our own session handlers so we can save and track sessions of logged-in users in our database.
	//But first, we need to choose which form of session_write we will use.  One will write data and 
	//therefore update the timestamp.  The other won't write anything.  Use the 
	//latter for only reading session info without causing timestamp to update.
	
	if ($update) {
		session_set_save_handler("sess_open", "sess_close", "sess_read", "sess_write", "sess_destroy", "sess_gc");
	} else {
		session_set_save_handler("sess_open", "sess_close", "sess_read", "sess_nowrite", "sess_destroy", "sess_gc");
	}
	//We need to keep our globals active until after "write". PHP internally destroys objects on 
	//shutdown and may prevent the write and close from being called
	register_shutdown_function('session_write_close');
	//session_register_shutdown (); //>=v 5.4

	//load session vars
	session_start();
	
	if (DEBUG_LIB) error_log("session_start() returned with id: ". session_id());

	//If requested to generate a new session id, do it and destroy old one
	if ($regen) {
		createNewSessionId();
	} else {
		//Update expiration of an existing cookie
		$cookieParams = session_get_cookie_params();
		if ($_COOKIE) {
			setcookie(session_name(), session_id(), 
				time() + MAX_COOKIE_LIFETIME,
				$cookieParams["path"],
				$cookieParams["domain"],
				SECURE,
				true); //secure and httponly
				
			if (DEBUG_LIB) error_log("Cookie lifetime reset with session id: ". session_id());
		}
	}
}

/******************************************/
function createNewSessionId() {
	if (DEBUG_LIB) error_log("In function createNewSessionId");

	//generate a new session id and destroy old one
	session_regenerate_id(TRUE);    // regenerated the session, delete the old one.

	if (DEBUG_LIB) error_log("session_regenerated now id = : ". session_id());

	//Update expiration of an existing cookie (use new id)
	$cookieParams = session_get_cookie_params();
	if ($_COOKIE) {
		setcookie(session_name(), session_id(), 
			time() + MAX_COOKIE_LIFETIME,
			$cookieParams["path"],
			$cookieParams["domain"],
			SECURE,
			true); //secure and httponly
		if (DEBUG_LIB) error_log("Cookie lifetime reset with session id: ". session_id());
	}
}

/*
	if ($_COOKIE) {
	
		ob_start();
		var_dump($_COOKIE);
		$result = ob_get_clean();
		if (DEBUG_LIB) error_log('cookie =: '.$result);
	}
*/

/*Note to self:
The proper procedure order is: prepare -> bind_param -> execute -> store_result -> bind_result -> fetch */



/***********************************************/
/***********************************************/
function sess_open($session_path, $session_name) {
	if (DEBUG_LIB) error_log('**************');
	if (DEBUG_LIB) error_log('**          **');
	if (DEBUG_LIB) error_log('in sess_open: ');
	//if (DEBUG_LIB) error_log('sess_open:session_path: '.$session_path);
	//if (DEBUG_LIB) error_log('sess_open:session_name: '.$session_name);
	return true;
}

/***********************************************/
function sess_close() {
	if (DEBUG_LIB) error_log('in sess_close: ');
	if (DEBUG_LIB) error_log('**          **');
	if (DEBUG_LIB) error_log('**************');
	return true;
}

/***********************************************/
function sess_read($session_id) {
	if (DEBUG_LIB) error_log('sess_read: '.$session_id);
	global $mysqli;
	
	
	/*
	if ($stmt = $mysqli->prepare("SELECT sess_value, lastaccesstime
							FROM sessions 
							WHERE sid = ?
							")) {
		$stmt->bind_param('s', $session_id);
		if ($stmt->execute()) {
			$stmt->store_result();
			$stmt->bind_result($value, $last);
			$stmt->fetch();
			
			*/
			
			
	//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	//---###
	//---###   Note from JOE (Oct 2014):  should convert following code (back) to secure version database query.  (See code above.)
	//---###
	//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	if ($res = $mysqli->query("SELECT sess_value, lastaccesstime FROM sessions WHERE sid = '$session_id'")) {
		if ($res->num_rows) {
			$row = $res->fetch_assoc();
			if (!empty($row['sess_value'])) {
				//see if expired
				$last1 = strtotime($row['lastaccesstime']);
				if ($last1 + MAX_SESSION_IDLETIME < time()) {
					//session expired
					if (DEBUG_LIB) error_log('sess_read session expired: '.$last1);
					//clear data now
					//sess_write($session_id,'');
					return '';
				} else {
					//if (DEBUG_LIB) error_log('sess_read OK: ');
					return $row['sess_value'];
				}
			} else {
				//session is empty
				if (DEBUG_LIB) error_log('QQQQQQQ!!!!!QQQQQQ');
				return '';
			}
		} else {
			//new session
			if (DEBUG_LIB) error_log('sess_read NEW SESSION return null');
			return '';
		}
	} else {
		if (DEBUG_LIB) error_log('in sess_read: query err');
		if (DEBUG_LIB) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
		return '';
	}

	
	/*
				ob_start();
			var_dump($row);
			$result = ob_get_clean();
			if (DEBUG_LIB) error_log('res =: '.$result);
			
			
		if (!empty($value)) {
				$last1 = strtotime($last);
				if ($last1 + MAX_SESSION_IDLETIME < time()) {
					//session expired
					if (DEBUG_LIB) error_log('sess_read session expired: '.$last);
					//clear data now
					$tmp = '';
					sess_write($session_id,$tmp);
					return '';
				} else {
					if (DEBUG_LIB) error_log('sess_read return: '.$value);
					return $value;
				}
			} else {
				//new session
				if (DEBUG_LIB) error_log('sess_read NEW SESSION return null');
				return '';
			}
		} else {
			if (DEBUG_LIB) error_log('in sess_read: execute err');
			return '';
		}
	} else {
		if (DEBUG_LIB) error_log('in sess_read: prepare err');
		return '';
	}
	*/
}

/***********************************************/
function sess_write($session_id, $value) {
	if (DEBUG_LIB) error_log('sess_write session: '.$session_id);
	if (DEBUG_LIB) error_log('sess_write value: '.$value);
		ob_start();
		var_dump($value);
		$result = ob_get_clean();
		if (DEBUG_LIB) error_log('value =: '.$value);
		
	global $mysqli;

	//if value is blank, only write to database if session already there -i.e. erase session data.  We don't want to ADD blank entries.
	if ($value == '') {
		if (DEBUG_LIB) error_log('sess_write value blank');
		if ($updateStmt = $mysqli->prepare("UPDATE sessions
				set sess_value = ?
				WHERE sid=?")) {
			$updateStmt->bind_param('ss', $value, $session_id);
			if (! $updateStmt->execute()) {
				//error
				if (DEBUG_LIB) error_log('sess_write update execute err');
				if (DEBUG_LIB) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
			} else {
				//ok
				if (DEBUG_LIB) error_log('sess_write update execute OK');
			}
		} else {
			if (DEBUG_LIB) error_log('sess_write: update prepare err ');
			if (DEBUG_LIB) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
		}
	} else {
		if ($insert_stmt = $mysqli->prepare("INSERT INTO sessions (sid, sess_value) 
					VALUES (?, ? ) 
					ON DUPLICATE KEY 
					UPDATE sess_value = ?, lastaccesstime = NULL")) {
			$insert_stmt->bind_param('sss', $session_id, $value, $value);
			if (! $insert_stmt->execute()) {
				//error
				if (DEBUG_LIB) error_log('sess_write execute err');
				if (DEBUG_LIB) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
			} else {
				//ok
				if (DEBUG_LIB) error_log('sess_write execute OK');
			}
		} else {
			if (DEBUG_LIB) error_log('sess_write: prepare err ');
			if (DEBUG_LIB) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
		}
	}
	session_write_close();
	return true;
}

/***********************************************/
//this function writes nothing so lastaccesstime remains untouched
function sess_nowrite($session_id, $value) {
	if (DEBUG_LIB) error_log('sess_nowrite: '.$session_id);
	session_write_close();
	return true;
}

/***********************************************/
function sess_destroy($session_id) {
	if (DEBUG_LIB) error_log('sess_destroy: '.$session_id);

	global $mysqli;
	if ($stmt = $mysqli->prepare("DELETE 
							FROM sessions 
							WHERE sid = ?")) {
		$stmt->bind_param('s', $session_id);
		if (! $stmt->execute()) {
			//error
			if (DEBUG_LIB) error_log('sess_destroy execute err');
		} else {
			//ok
		}
	} else {
		if (DEBUG_LIB) error_log('sess_destroy: prepare err ');
	}
	
	//destroy cookie too
	setcookie(session_name(), "", time() - 3600);
	
	return true;
}

/***********************************************/
function sess_gc($session_maxlifetime) {
	if (DEBUG_LIB) error_log('sess_gc:');
	global $mysqli;

	if ($stmt = $mysqli->prepare("DELETE 
				FROM sessions 
				WHERE UNIX_TIMESTAMP(lastaccesstime) <  UNIX_TIMESTAMP(NOW()) - " . MAX_SESSION_IDLETIME)) { 
		if (! $stmt->execute()) {
			//error
			if (DEBUG_LIB) error_log('sess_gc execute err');
		} else {
			//ok
		}
	} else {
		if (DEBUG_LIB) error_log('sess_gc: prepare error ');
	}
	return true;
}


/****************************************************************************/
function login($email, $password, $mysqli_local) {
	if (DEBUG_LIB) error_log("In function login");
	
	$returnVal = 'fail'; //failed
	
	// See if matching email value in database
	if ($stmt = $mysqli_local->prepare("SELECT id, username, password, salt 
								FROM users 
								WHERE email = ?
								LIMIT 1")) {
		$stmt->bind_param('s', $email);  // Bind string "$email" to parameter.
		$stmt->execute();    // Execute the prepared query.
		$stmt->store_result();
		$stmt->bind_result($user_id, $username, $db_password, $salt);
		$stmt->fetch();

		//did we find a match?
		if ($stmt->num_rows == 1) {
			//Found the email in db.  Now check if the account is locked
			// from too many login attempts 
			$tmpTries = numPrevLoginAttempts($user_id, $mysqli_local);
			if ($tmpTries == -1) {
				// Account is locked 
				// FUTURE: Send an email to user saying their account is locked 
				// for now we unlock after x amount of time has passed
				
				$returnVal = 'Lockout';
			} else {
				//Account not locked.
				// Check if the password in the database matches 
				// the salted/hashed password the user submitted.
				$password = hash('sha512', $password . $salt);
				if ($db_password == $password) {
					// Password is correct! User has logged in

					//clear attempt database
					updateLoginAttemptDb($user_id, 0, $mysqli_local);
					
					// generate a new session ID so saving session info in new session
					createNewSessionId();

					//just to be sure...
					$user_id = preg_replace("/[^0-9]+/", "", $user_id);
					$username = preg_replace("/[^\w{}]+/", "", $username);
					
					$_SESSION['user_id'] = $user_id;
					$_SESSION['username'] = $username;
					
					//// Get the user-agent string of the user.
					//$user_browser = $_SERVER['HTTP_USER_AGENT'];
					//$_SESSION['login_string'] = hash('sha512', $password . $user_browser);
					//
					//Future: tie a variable that uses the password to the session so if user 
					//changes their password, all current sessions fail on login check.
					//User browser doesn't work consistently as proxies/certain browsers may screw this up
					//For now, use this:
					$user_browser = DEFAULT_USER_AGENT;
					$_SESSION['login_string'] = hash('sha512', $password . $user_browser);
					
					//future: bind user to this session in session database
					
					// Login successful. 
					$returnVal = 'success';
				} else {
					// Password is not correct 
					// We update the count and timestamp in the login attempt database
					$tmpTries++;
					// See if this was their last chance..
					if ($tmpTries >= MAX_LOGIN_ATTEMPTS) {
						//lock them out
						updateLoginAttemptDb($user_id, MAX_LOGIN_ATTEMPTS, $mysqli_local);
						$returnVal = 'Lockout';
					} else {
						//update count
						updateLoginAttemptDb($user_id, $tmpTries, $mysqli_local);
						$returnVal = 'fail';
					}
				}
			}
		} else {
			// No user exists. 
			if (DEBUG_LIB) error_log("No user exists");
			$returnVal = 'fail';
		}
	} else {
		// Could not create a prepared statement
		//trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $conn->errno . ' ' . $conn->error, E_USER_ERROR);
		header("Location: " . $baseURL . '/error.php?err=Database error: cannot prepare statement');
		exit();
	}
	
	return $returnVal;
}

/****************************************************************************/
//-1 = locked
//0 - Max-1
//if was locked but now expired, returns Max-1 to give one more chance

function numPrevLoginAttempts($userId, $mysqli_local) {

	global $baseURL;
	
	if (DEBUG_LIB) error_log("In function numPrevLoginAttempts");
		
	$returnVal = -1; //failed
	
	if ($stmt = $mysqli_local->prepare("SELECT attempts,lastaccess FROM login_attempts WHERE user_id = ?")) {
		$stmt->bind_param('s', $userId);
		if ($stmt->execute()) {
			$stmt->store_result();
			$stmt->bind_result($attempts, $last);
			$stmt->fetch();

			if (empty($attempts)) {
				//no previous attempts 
				if (DEBUG_LIB) error_log('numPrevLoginAttempts previous attempts= : '.$attempts);
				$returnVal = 0;
			} else {
				if (DEBUG_LIB) error_log('numPrevLoginAttempts previous attempts= : '.$attempts);
				if ($attempts < MAX_LOGIN_ATTEMPTS) {
					//have not reached limit.
					$returnVal = $attempts;
				} else {
					//reached limit of attempts, so see if enough time
					// has passed to unlock the account
					if ($last +  MIN_LOGIN_WAIT < time()) {
						//okay can try again
						$returnVal = MAX_LOGIN_ATTEMPTS-1;
					} else {
						//account still locked 
						$returnVal = -1;
					}
				}
			}
		} else {
			if (DEBUG_LIB) error_log('in numPrevLoginAttempts: execute err');
			if (DEBUG_LIB) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
			header("Location: " . $baseURL . '/error.php?err=Database error: cannot execute statement');
			exit();
		}
	} else {
		// Could not create a prepared statement
		if (DEBUG_LIB) error_log('in numPrevLoginAttempts: prepare err');
		if (DEBUG_LIB) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
		header("Location: " . $baseURL . '/error.php?err=Database error: cannot prepare statement');
		exit();
	}
	
	return $returnVal;
}

/****************************************************************************/
//
function updateLoginAttemptDb($userId, $attempts, $mysqli_local) {

	global $baseURL;
	if (DEBUG_LIB) error_log("In function updateLoginAttemptDb");
	
	$now = time();
	if ($attempts > 0) {
		$stmt = "INSERT INTO login_attempts (user_id, attempts, lastaccess) 
				VALUES (?, ?, ? )
				ON DUPLICATE KEY 
				UPDATE attempts = ? , lastaccess = ?";
	} else {
		$stmt ="DELETE from login_attempts where user_id = ?";
	}
	if (DEBUG_LIB) error_log("In function updateLoginAttemptDb: stmt: ".$stmt);
	if ($insert_stmt = $mysqli_local->prepare($stmt)) {
	
		if ($attempts > 0) $insert_stmt->bind_param('sssss', $userId, $attempts, $now, $attempts, $now);
		else $insert_stmt->bind_param('s', $userId);
		
		if (! $insert_stmt->execute()) {
			//error
			if (DEBUG_LIB) error_log('updateLoginAttemptDb execute err');
			header("Location: " . $baseURL . '/error.php?err=Database error');
			exit();
		} else {
			//ok
			if (DEBUG_LIB) error_log('updateLoginAttemptDb execute OK');
		}
	} else {
		if (DEBUG_LIB) error_log('updateLoginAttemptDb: prepare err ');
		header("Location: " . $baseURL . '/error.php?err=Database error: ');
		exit();
	}
}
	
/****************************************************************************/
//future: if not logged in, should destroy session and issue new one if not empty???
function login_check($mysqli_local) {

global $baseURL;
	if (DEBUG_LIB) error_log("In function login_check");
	
	$returnVal = false; //failed
	
	// Check if all session variables are set 
	if (isset($_SESSION['user_id'], $_SESSION['username'], $_SESSION['login_string'])) {
		$user_id = $_SESSION['user_id'];
		$username = $_SESSION['username'];
		$login_string = $_SESSION['login_string'];
		
		//// Get the user-agent string of the user.
		//$user_browser = $_SERVER['HTTP_USER_AGENT'];
		//SEE COMMENT above regarding login string
		$user_browser = DEFAULT_USER_AGENT;
		if (DEBUG_LIB) error_log($user_browser);
		
		//see if user in db
		if ($stmt = $mysqli_local->prepare("SELECT password 
									FROM users 
									WHERE id = ?
									LIMIT 1")) {
			$stmt->bind_param('i', $user_id);
			$stmt->execute();
			$stmt->store_result();

			if ($stmt->num_rows == 1) {
				// Found user.  Compare login string.
				$stmt->bind_result($password);
				$stmt->fetch();
				$login_check = hash('sha512', $password . $user_browser);
				
				if ($login_check == $login_string) {
					// Logged In!!!! 
					if (DEBUG_LIB) error_log("login string pass ");
					$returnVal = true;
				} else {
					// Not logged in 
					if (DEBUG_LIB) error_log("login string fail ");
					
					//Session password doesn't match user password. Perhaps user changed it. 
					//Throw session away- start new one
					// Unset all session values 
					$_SESSION = array();
					// generate a new session ID so saving session info in new session
					createNewSessionId();

					$returnVal = false;
				}
			} else {
				// Not logged in 
				if (DEBUG_LIB) error_log("user id fail- matches = " . $stmt->num_rows . "  ");
				
				//User doesn't exist. Perhaps it was deleted. Throw session away- start new one
				// Unset all session values 
				$_SESSION = array();
				// generate a new session ID so saving session info in new session
				createNewSessionId();

				$returnVal = false;
			}
		} else {
			// Could not prepare statement
			header("Location: " . $baseURL . '/error.php?err=Database error: cannot prepare statement');
			exit();
		}
	} else {
		// Not logged in 
		if (DEBUG_LIB) error_log("missing necessary session variables.  May be guest account");
		$returnVal = false;
	}
	
	return $returnVal;
}

/****************************************************************************/
function esc_url($url) {

	if ('' == $url) {
		return $url;
	}

	$url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);
	
	$strip = array('%0d', '%0a', '%0D', '%0A');
	$url = (string) $url;
	
	$count = 1;
	while ($count) {
		$url = str_replace($strip, '', $url, $count);
	}
	
	$url = str_replace(';//', '://', $url);

	$url = htmlentities($url);
	
	$url = str_replace('&amp;', '&#038;', $url);
	$url = str_replace("'", '&#039;', $url);

	if ($url[0] !== '/') {
		// We're only interested in relative links from $_SERVER['PHP_SELF']
		return '';
	} else {
		return $url;
	}
}
