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


/* //---###//---###//---###//---###//---###
$zoom_setting = 100;
if (isset($_GET['zoomsetting'])) {
	$tmp = filter_input(INPUT_GET, 'zoomsetting', FILTER_SANITIZE_NUMBER_INT);
	if (filter_var($tmp, FILTER_VALIDATE_INT)) $zoom_setting = $tmp;
}
*/ //---###//---###//---###//---###//---###


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
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="0" />

	<link rel="stylesheet" type="text/css" <?php echo "href=\"styles/normalize.css?v=" . time() ?><?php echo "href=\"styles/normalize.css?v=" . time() ?>" />
	<link rel="stylesheet" type="text/css" id="traystyles" <?php echo "href=\"styles/style.css?v=" . time() ?>" />
	<link rel="stylesheet" type="text/css" id="providerstyles" <?php echo "href=\"styles/provider.css?v=" . time() ?>" />
	
	</head>
	<body>
	
	<div id="iconpicker" style="display: block;">
		<div id="iconpicker-titlebar" style="display: block; font-size: 100%;" >
			<button type="button" id="close-iconpicker" class="closepopupbutton" onclick="closeIconPicker()" title="Close Icon Picker" tabindex="0">
				Close
			</button>
			<div id="iconpicker-title">Click to Choose a New Bookmark Icon</div>
			<div id="picker-top-line"></div>
		</div>
		<!-- TEST //---###//---###//---###//---###//---### -->
		<!--
		<div id="iconpicker-window" 
			<?php
			// echo 'style="display: block; font-size: ' . $zoom_setting . '%;"' 
			?> >
		-->
		<!-- END TEST //---###//---###//---###//---###//---### -->
		
		<div id="iconpicker-window" style="display: none; font-size: 100%;" >
		
			<div id="iconpicker-window-container">
				
		
		
<!-- TESTING   ***   TESTING   ***   TESTING   -->
<!--
<div style="background-color: white; color: black; font-weight: normal; font-size: 100%;">
<li></li>
<li style="font-family: Arial">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Arial)</li>
<li style="font-family: Arial">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Arial)</li>
<li style="font-family: Arial"></li>
<li style="font-family: Arial; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Arial-90%)</li>
<li style="font-family: Arial; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Arial-90%)</li>
<li style="font-family: Arial; font-size: 90%;"></li>
<li style="font-family: Arial; font-size: 85%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Arial-85%)</li>
<li style="font-family: Arial; font-size: 85%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Arial-85%)</li>
<li style="font-family: Arial; font-size: 85%;"></li>
<li style="font-family: Calibri">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Calibri)</li>
<li style="font-family: Calibri">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Calibri)</li>
<li style="font-family: Calibri"></li>
<li style="font-family: Calibri; font-size: 115%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Calibri-115%)</li>
<li style="font-family: Calibri; font-size: 115%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Calibri-115%)</li>
<li style="font-family: Calibri; font-size: 115%;"></li>
<li style="font-family: Verdana">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Verdana)</li>
<li style="font-family: Verdana">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Verdana)</li>
<li style="font-family: Verdana"></li>
<li style="font-family: Verdana; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Verdana-90%)</li>
<li style="font-family: Verdana; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Verdana-90%)</li>
<li style="font-family: Verdana; font-size: 90%;"></li>
<li style="font-family: Verdana; font-size: 80%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Verdana-80%)</li>
<li style="font-family: Verdana; font-size: 80%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Verdana-80%)</li>
<li style="font-family: Verdana; font-size: 80%;"></li>
<li style="font-family: Lucida Sans">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Lucida Sans)</li>
<li style="font-family: Lucida Sans">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Lucida Sans)</li>
<li style="font-family: Lucida Sans"></li>
<li style="font-family: Lucida Sans Unicode">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Lucida Sans Unicode)</li>
<li style="font-family: Lucida Sans Unicode">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Lucida Sans Unicode)</li>
<li style="font-family: Lucida Sans Unicode"></li>
<li style="font-family: Lucida Sans Unicode; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Lucida Sans Unicode-90%)</li>
<li style="font-family: Lucida Sans Unicode; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Lucida Sans Unicode-90%)</li>
<li style="font-family: Lucida Sans Unicode; font-size: 90%;"></li>
<li style="font-family: Lucida Sans Unicode; font-size: 80%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Lucida Sans Unicode-80%)</li>
<li style="font-family: Lucida Sans Unicode; font-size: 80%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Lucida Sans Unicode-80%)</li>
<li style="font-family: Lucida Sans Unicode; font-size: 80%;"></li>
<li style="font-family: Tahoma">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Tahoma)</li>
<li style="font-family: Tahoma">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Tahoma)</li>
<li style="font-family: Tahoma"></li>
<li style="font-family: Tahoma; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Tahoma-90%)</li>
<li style="font-family: Tahoma; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Tahoma-90%)</li>
<li style="font-family: Tahoma; font-size: 90%;"></li>
<li style="font-family: Trebuchet MS">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Trebuchet MS)</li>
<li style="font-family: Trebuchet MS">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Trebuchet MS)</li>
<li style="font-family: Trebuchet MS"></li>
<li style="font-family: Trebuchet MS; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Trebuchet MS-90%)</li>
<li style="font-family: Trebuchet MS; font-size: 90%;">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Trebuchet MS-90%)</li>
<li style="font-family: Trebuchet MS; font-size: 90%;"></li>
<li style="font-family: Calibri">OATTS Settings   Tool Changer   <b>OATTS Settings   Tool Changer</b>    (Calibri)</li>
<li></li>
</div>
-->
<!-- END of TESTING   ***   TESTING   ***   TESTING   -->


		
		
				<?php
				foreach($fileNameArray as $fileName) {
					
					//---### echo "<p>" . $fileName . "</p>\n";
					
					echo '<div class="iconpicker-widget">';
					echo '<a href="javascript:;" title="' . $fileName . '" class="iconpicker-link" onclick="pickThisIcon(\'' . $fileName . '\')" tabindex="0">';
					echo '<img src="' . "/" . BASEDIR . "/" . BOOKMARKICONSDIR . "/" . $fileName . '" class="iconpicker-bookmark-icon"/>';
					echo '<img src="/oatts/images/to_tray.png" class="iconpicker-shortcut-icon"/>';
					echo '<div class="iconpicker-filename">' .  basename($fileName, ".png") . '</div></a>';
					echo '</a>';
					echo '</div>';
					
				}
				?>
				
			</div>
		</div>
	</div>
	
	<script <?php echo 'src="js/iconpicker.js?v=' . time() ?> "></script>
	
	</body>
	
	</html>
