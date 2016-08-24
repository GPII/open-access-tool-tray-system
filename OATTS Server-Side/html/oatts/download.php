<?php
include './includes/path.php';

$fileName = "OATTS_Client(" . SERVER_CONTEXT_LABEL . ").crx";
?>

<!DOCTYPE html>
<html>
	<head>
		<title>OATTS App download page</title>
	</head>

	<body>
		<h1 style="font-size: 1.5em;">Download page for OATTS Chrome App</h1>
		
		<p style="margin:2em 1em 2em 1em;">DISCLAIMER: <br>
		This software is provided "as is" without warranty of any kind. <br>
		The software is under development and functionality may change at any time.
		</p>

		<?php
		print "	<p><a href='" . $fileName . "'>Download the latest OATTS beta (" . SERVER_CONTEXT_LABEL . ") version of the OATTS Chrome App</a></p>";
		?>
		
	</body>
</html>
