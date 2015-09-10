<!DOCTYPE html>
<html>
	
	<head>
		<title>OATTS Logged Out Page</title>
		
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		
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
		
		<h1 class="signin-header">OATTS - Logged Out</h1>
		
		<p>Thank you for using OATTS.</p>
		
		<a title="Go to login screen" href="login.php">Log into OATTS</a>
		
		<script src="js/jquery.js" ></script>
		<script src="js/ui/jquery-ui.js" ></script>
		<script type="text/JavaScript" src="js/forms.js?v=<?php echo time(); ?>"></script>
		
	</body>

</html>
