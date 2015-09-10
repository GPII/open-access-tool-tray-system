<?php
include './includes/path.php';
include_once ROOT_PATH . '/lib.php';

/***********************/
if (isset($globalDebug)) {
	define('DEBUG_PICKER', $globalDebug);
} else {
	define('DEBUG_PICKER', true);
}
if (DEBUG_PICKER) error_log("In icon_picker.php");
/***********************/

sec_session_start(false, true); // don't update session id; do update timestamp

$fileNameArray = array();

if (($h = opendir(BOOKMARKICONS_ABS_PATH)) != false) {
	while( ($f = readdir($h)) !== false) {
		if (DEBUG_PICKER) error_log('file =  '.$f);
		if ($f == '.' || $f == '..') continue;
		$filepath = BOOKMARKICONS_ABS_PATH . "/" . $f;
		if (!is_file($filepath)) continue;
		
		//okay got a file
		if (pathinfo($filepath)['extension'] == "png") {
			array_push($fileNameArray, basename($filepath));
		}
	}
	closedir($h);
} else {
	if (DEBUG_PICKER) error_log("Can't find bookmark icons directory " . BOOKMARKICONS_ABS_PATH);
}

sort($fileNameArray);
?>


<!DOCTYPE html>
<html>
	
	<head>
		<title>OATTS Bookmark Icon Chooser</title>
		
		<!-- //---### Is this either needed or wanted here ???
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		-->
		
		<link rel="stylesheet" type="text/css" href="styles/normalize.css?v=<?php echo time(); ?>" />
		<link rel="stylesheet" type="text/css" href="js/ui/jquery-ui.css" />
		<link rel="stylesheet" type="text/css" id="traystyles" href="styles/style.css?v=<?php echo time(); ?>" />
	</head>
	
	<body style="background-color: #202020;">
		
		<div id="iconpicker" style="display: none;">
			<div id="iconpicker-titlebar">
				
				<div id="picker-titlebar-buttons">
					<button type="button" class="zoom-glass-button" title="Zoom Smaller (Ctrl -)" onclick="zoomSmaller();" tabindex="0">
						<img src="images/zoom_out.png" alt="" class="zoom-glass-icon" onmouseover="updateImage(this, 'images/zoom_out_hover.png');" onmouseout="updateImage(this, 'images/zoom_out.png');">
					</button>
					<button type="button" class="zoom-glass-button" title="Zoom Bigger (Ctrl +)" onclick="zoomBigger();" tabindex="0">
						<img src="images/zoom_in.png" alt="" class="zoom-glass-icon" onmouseover="updateImage(this, 'images/zoom_in_hover.png');" onmouseout="updateImage(this, 'images/zoom_in.png');">
					</button>
					<button type="button" id="close-iconpicker" alt="" class="closepopupbutton" onclick="closeIconPicker()" title="Close Icon Picker" tabindex="0">
						Close
					</button>
				</div>
				
				<div id="iconpicker-title">Click to Choose a New Bookmark Icon</div>
				<div id="picker-top-line"></div>
				<div id="picker-top-line-bottom"></div>
			</div>
			
			<div id="iconpicker-window">
				<div id="iconpicker-window-container">
					
					<?php
					foreach($fileNameArray as $fileName) {
						echo '<div class="iconpicker-widget">';
						echo '<a href="javascript:;" title="' . basename($fileName, ".png") . ' icon" class="iconpicker-link" onclick="pickThisIcon(\'' . $fileName . '\')" tabindex="0">';
						echo '<img src="' . "/" . BASEDIR . BOOKMARKICONSDIR . "/" . $fileName . '" alt="" class="iconpicker-bookmark-icon"/>';
						echo '<img src="/oatts/images/to_tray.png" alt="" class="iconpicker-shortcut-icon"/>';
						echo '<div class="iconpicker-filename">' .  basename($fileName, ".png") . '</div></a>';
						echo '</a>';
						echo '</div>';
					}
					?>
					
				</div>
			</div>
		</div>
		
		<script src="js/jquery.js" ></script>
		<script src="js/ui/jquery-ui.js" ></script>
		<script src="js/iconpicker.js?v=<?php echo time(); ?>" ></script>
		
	</body>
	
</html>
