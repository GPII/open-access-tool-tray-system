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
		<title>OATTS Registration Form</title>
		
		<meta charset="UTF-8">
		
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
		
		<h1 class="signin-header">OATTS Registration</h1>
		
		<!-- Registration form to be output if the POST variables are not
		set or if the registration script caused an error. -->
		<?php
		if (!empty($error_msg)) {
			echo $error_msg;
		}
		?>
		
		<ul id="rules-list">
			<li>Usernames may only contain letters, digits, underscores, and curly braces.</li>
			<li>Passwords must be at least 6 characters long, and must contain both upper and lower case letters, and at least one digit.</li>
		</ul>
		<form method="post" name="registration_form" action="<?php echo ($baseURL. "/register.php")?>">
			<div class="signin-entry-field">
				Username: <input type='text' name='username' id='username' title="Enter user name" /><span id="user" class="regMsg"></span><br>
			</div>
			<div class="signin-entry-field">
				Email: <input type="text" name="email" id="email" title="Enter email address" /><span id="userEmail" class="regMsg"></span><br>
			</div>
			<div class="signin-entry-field password-entry-field">
				Password: <input type="password" name="p" id="password" title="Enter password" /><span id="userPass1" class="regMsg"></span><br>
			</div>
			<div class="signin-entry-field password-entry-field">
				Confirm password: <input type="password" name="confirmpwd" id="confirmpwd" title="Retype password" /><span id="userPass2" class="regMsg"></span>
			</div>
			<p>
				<input type="button" value="Register" title="Submit OATTS registration" style="padding-left: 0.5em; padding-right: 0.5em; margin-right: 0.6em;" onclick="return validateForm(this.form);" />or return to the <a title="Return to login screen" href="<?php echo $baseURL . "/login.php"?>">login page</a>.
			</p>
			
		</form>
		
		<script src="js/jquery.js" ></script>
		<script src="js/ui/jquery-ui.js" ></script>
		<script type="text/JavaScript" src="js/forms.js?v=<?php echo time(); ?>"></script>
		
	</body>
	
</html>
