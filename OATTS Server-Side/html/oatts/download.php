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
		
		<?php
		print "	<p><a href='" . $fileName . "'>Download the latest OATTS beta (" . SERVER_CONTEXT_LABEL . ") version of the OATTS Chrome App</a></p>";
		?>

	</body>
</html>
