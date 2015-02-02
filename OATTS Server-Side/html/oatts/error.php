<?php
include './includes/path.php';
include_once ROOT_PATH . '/lib.php';

$error = filter_input(INPUT_GET, 'err', FILTER_SANITIZE_STRING);
if (! $error) {
	$error = 'Oops! An unknown error happened.';
} else {
	filter_var($error, FILTER_SANITIZE_ENCODED);
}

?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Secure Login: Error</title>
        <link rel="stylesheet" href="styles/style.css" />
    </head>
    <body>
		<?php echo "<p>[server = " . $baseURL . "]</p>";?>

        <h1>There was a problem</h1>
        <p class="error"><?php echo $error; ?></p>
		<p>Return to the <a <?php echo ("href=\"" .$baseURL. "/login.php")?>">login page</a>.</p>
    </body>
</html>
