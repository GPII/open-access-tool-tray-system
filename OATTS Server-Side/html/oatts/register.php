<?php
error_log("In register.php");
include './includes/path.php';
include_once ROOT_PATH . '/lib.php';
sec_session_start(true,true);
 
include_once ROOT_PATH . '/register.inc.php';

?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>OATTS Registration Form</title>
		<script type="text/JavaScript" src="js/forms.js?v=<?php echo time(); ?>"></script>
		<link rel="stylesheet" href="styles/style.css?v=<?php echo time(); ?>" />
	</head>
	<body>
		<?php echo "<p>[server = " . BASEIP . "]</p>";?>
		<!-- Registration form to be output if the POST variables are not
		set or if the registration script caused an error. -->
		<h1>OATTS Registration</h1>
		<?php
		if (!empty($error_msg)) {
			echo $error_msg;
		}
		?>
		<ul>
			<li>Usernames may contain only digits, upper and lower case letters and underscores</li>
			<li>Emails must have a valid email format</li>
			<li>Passwords must be at least 6 characters long</li>
			<li>Passwords must contain
				<ul>
					<li>At least one upper case letter (A..Z)</li>
					<li>At least one lower case letter (a..z)</li>
					<li>At least one number (0..9)</li>
				</ul>
			</li>
			<li>Your password and confirmation must match exactly</li>
		</ul>
		<form method="post" name="registration_form" action="<?php echo ($baseURL. "/register.php")?>">
			Username: <input type='text' name='username' id='username' />&nbsp;&nbsp;<span id="user" class="regMsg"></span><br>
			Email: <input type="text" name="email" id="email" />&nbsp;&nbsp;<span id="userEmail" class="regMsg"></span><br>
			Password: <input type="password"
							 name="p" 
							 id="password"/>&nbsp;&nbsp;<span id="userPass1" class="regMsg"></span><br>
			Confirm password: <input type="password" 
									 name="confirmpwd" 
									 id="confirmpwd" /><br>
			<input type="button" 
				   value="Register" 
				   onclick="return validateForm(this.form);" /> 
		</form>
		<p>Return to the <a <?php echo ("href=\"" .$baseURL. "/login.php")?>">login page</a>.</p>
	</body>
</html>
