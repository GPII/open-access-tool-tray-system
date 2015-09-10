<?php
error_log("In register.inc.php");

 
$error_msg = "";
 
if (isset($_POST['username'], $_POST['email'], $_POST['p'])) {
	// Sanitize and validate the data passed in
	//filter_var($username, FILTER_SANITIZE_STRING, FILTER_SANITIZE_ENCODED);
	$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
	//restrict length
	$username = strlen($username) > 25 ? substr($username, 0, 25) : $username;
	//further limit username to only alphanumberic, underscores, and curly braces - delete others
	$username = preg_replace("/[^\w{}]+/", "", $username);
	
	//use hashed version of username to be safe
	//$username = hash('sha512', $username);
	
	$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
	if (!($email = filter_var($email, FILTER_VALIDATE_EMAIL))) {
		// Not a valid email
		$error_msg .= '<p class="error">The email address you entered is not valid</p>';
	}

	$password = filter_input(INPUT_POST, 'p', FILTER_SANITIZE_STRING);
	//hash the password to sanitize for later processing
	$password = hash('sha512', $password);

	if ($stmt = $mysqli->prepare("SELECT id FROM users WHERE email = ? LIMIT 1")) {
		$stmt->bind_param('s', $email);
		$stmt->execute();
		$stmt->store_result();
 
		if ($stmt->num_rows == 1) {
			// A user with this email address already exists
			$error_msg .= '<p class="error">A user with this email address already exists.</p>';
		}
	} else {
		$error_msg .= '<p class="error">Database error</p>';
	}

	if (empty($error_msg)) {
		// Create a random salt
		$random_salt = hash('sha512', uniqid(openssl_random_pseudo_bytes(16), TRUE));
 
		// Create salted password 
		$password = hash('sha512', $password . $random_salt);
 
		// Insert the new user into the database 
		if ($insert_stmt = $mysqli->prepare("INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)")) {
			$insert_stmt->bind_param('ssss', $username, $email, $password, $random_salt);
			// Execute the prepared query.
			if (! $insert_stmt->execute()) {
				header("Location: " . $baseURL . '/error.php?err=Registration failure: INSERT');
				exit();
			}
		} else {
			// Could not create a prepared statement
			header("Location: " . $baseURL . '/error.php?err=Database error: cannot prepare statement');
			exit();
		}
		//now create oatts record
		// first get id
		$prep_stmt = "SELECT id FROM users WHERE email = ? LIMIT 1";
		if ($stmt = $mysqli->prepare($prep_stmt)) {
			$stmt->bind_param('s', $email);
			$stmt->execute();
			$stmt->store_result();
	 
			if ($stmt->num_rows == 1) {
				// get variables from result.
				$stmt->bind_result($user_id);
				$stmt->fetch();

				$tray = '[]';
				$providers = '[]';
				$settings = "";
				//create row in oatts table
				if ($insert_stmt = $mysqli->prepare("INSERT INTO oatts (userId, tray, providers, settings) VALUES (?, ?, ?, ?)")) {
					$insert_stmt->bind_param('isss', $user_id, $tray, $providers, $settings);
					// Execute the prepared query.
					if (! $insert_stmt->execute()) {
						header("Location: " . $baseURL . '/error.php?err=Registration failure: INSERT in oatts');
						exit();
					} else {
						error_log("created record in oatts table");
					}
				} else {
					// Could not create a prepared statement
					header("Location: " . $baseURL . '/error.php?err=Database error: cannot prepare statement for insert into oatts');
					exit();
				}
			} else {
				// problem with user database
				header("Location: " . $baseURL . '/error.php?err=Database error: cannot get user id from users');
				exit();
			}
		} else {
			header("Location: " . $baseURL . '/error.php?err=Database error: cannot prepare statement for to get user id ');
			exit();
		}

		header("Location: " . $baseURL . '/login.php?registered='.REGISTERED);
		exit();
	} else {
		error_log("an error of some sort in register inc ");
	}
} else {
	error_log("no posted paramaters yet ");
}
