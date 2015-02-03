<?php
include './includes/path.php';
include_once ROOT_PATH . '/lib.php';

/***********************/
if (isset($globalDebug)) {
	define('DEBUG_MAIN',$globalDebug);
} else {
	define('DEBUG_MAIN',true);
}
if (DEBUG_MAIN) error_log("In main.php");
/***********************/

sec_session_start(false,true); // don't update session id; do update timestamp

if (login_check($mysqli) != true) {
	error_log('not logged in - main.php');
	//header("Location: " . $baseURL . '/login.php?err=Not logged in');
	//exit();
} 
//else {
	error_log('Logged in - main.php');
?>

	<!DOCTYPE html>
	<html>
	<head>
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="0" />

	<link rel="stylesheet" type="text/css" <?php echo "href=\"styles/normalize.css?v=" . time() ?>" />
	<link rel="stylesheet" type="text/css" <?php echo "href=\"js/ui/jquery-ui.css?v=" . time() ?>" />
	<link rel="stylesheet" type="text/css" id="traystyles" <?php echo "href=\"styles/style.css?v=" . time() ?>" />
	<link rel="stylesheet" type="text/css" id="providerstyles" <?php echo "href=\"styles/provider.css?v=" . time() ?>" />

	</head>
	<body>

	<!-- START new code here -->
	<div id="iframe-container" style="display: none;">
		
		<div id="iframe-container-titlebar">
			<button type="button" id="closeprovider" class="closepopupbutton" onclick="closeIframe()" title="Close Panel" tabindex="0">
				Close<img src="images/down_arrow.png" class="closepopupbuttonicon">
			</button>
			<div class="provFontSize">
				<span id="zoomout" class="zoomout" tabindex="0" title="Zoom Smaller" onclick="zoomTextSmaller(true);" style="font-size:110%">A<sup>-</sup></span>
				<span id="zoomdefault" class="zoomdefault" tabindex="0" title="Zoom to 100%" onclick="zoomTextDefault(true);" style="font-size:130%; margin-right:4px;">A</span>
				<span id="zoomin" class="zoomin" tabindex="0" title="Zoom Bigger" onclick="zoomTextBigger(true);" style="font-size:150%">A<sup>+</sup></span>
			</div>
			<div id="top-line"></div>
		</div>
		
		<div id="providerIframe" style="overflow: auto;" style="display: none;">

			<!-- provider picker content template -->
			<div id="providercontent">

				<h1 id="providerTitle" class="providerTitle">Service Provider Menu</h1>
			
				<div id="favhead">
					<h2 class="favhead">Favorites List<img id="fspicon" src="images/favorites.png"> </h2>
				</div>
				
				<!-- superceded below ///---###///---###///---###
				<button id="insbutton" href="javascript:;" title="Add New Entry to Favorites">Add New Entry to Favorites</button>
				<span id="insbutton" onclick="addNewFavorite()" title="Add New Entry to Favorites">Add New Entry to Favorites</span>
				<span id="insbutton" tabindex="0" title="Add New Entry to Favorites">Add New Entry to Favorites</span>
				///---###///---###///---### -->
				<button type="button" id="insbutton" tabindex="0" class="provbutton" title="Add New Entry to Favorites">Add New Entry to Favorites</button>
				
				<ul id="favlist" class="favlist"></ul>
				
				<hr style="margin-right: 20px;">
				
				<div id="providershead">
					<h2 class="providershead">
					Service Providers</h2>
				</div>
				<ul id="providerlist" class="providerlist"></ul>
			</div>
		
		</div>
		
		
		<!-- settings window elements ///---###///---###///---### -->
		<div id="settingsIframe" style="overflow: auto;">
			
			<div id="settingscontent">
				<h1 id="settingsTitle" class="settingsTitle">OATTS Settings</h1>
				
				<div id="oatts-settings">
					<p><input id="thin-titlebar-btn" class="settingsCheckbox" type="checkbox" name="ShowThinTitlebar" value="true"> Thin Titlebar</p>
					<p><input id="show-widget-names-btn" class="settingsCheckbox" type="checkbox" name="ShowWidgetNames" value="true"> Show Widget Names</p>
					<p><input id="show-tooltips-btn" class="settingsCheckbox" type="checkbox" name="ShowTooltips" value="true"> Show Tooltips</p>
					<p class="settingsValue">
						<span>Text Panels Zoom: </span>
						<select id="text-panels-zoom" class="selectBox" datatype="double">
						</select>
					</p>
					<p class="settingsValue">
						<span>Widget Panels Zoom: </span>
						<select id="widget-panels-zoom" class="selectBox" datatype="double">
						</select>
					</p>
				</div>
			</div>
			
		</div>
		<!-- END settings window elements ///---###///---###///---### -->
		
		
		
	</div>

	<!-- dialog box elements -->
	<div id="dialog-form" title="" style="display: none;">
		<p class="validateTips"></p>
		<form>
			<fieldset>
				<label for="editname">Name of Provider<span class="requiredfield">*This field required.</span></label>
				<input type="text" name="editname" id="editname" value="" class="text ui-widget-content ui-corner-all">
				<label for="editurl">Address to launch service</label>
				<input type="text" name="editurl" id="editurl" value="" class="text ui-widget-content ui-corner-all" style="display: inline-block">
				<div id="editiconDiv" style="display:none">
					<!-- <input type="text" name="editicon" id="editicon" value="" class="text ui-widget-content ui-corner-all" style="display: inline-block"> -->
					
					<div id="bookmark-dialog-widget">
					<img id="bookmark-dialog-icon" class="tray-bookmark-icon"/>
					<img src="images/to_tray.png" class="tray-shortcut-icon"/>
					</div>
					
					<button type="button" id="imgpicker" class="provbutton">Change Icon</button>
					
					<div id="iconpathlabel">Icon:<span id="iconpathtext">Icon:</span></div>
				</div>
			</fieldset>
		</form>
	</div>
	<div id="dialog-alert" title="Quit OATTS?" style="display: none;">
		<p id="dialog-alert-message"></p>
	</div>

	</body>
	
	<script>
	<?php
	//include_once ROOT_PATH . '/tray.php';
	include_once ROOT_PATH . '/dataget.php';
	include_once ROOT_PATH . '/picker.php';
	?>
	
	</script>
	</html>

<?php
//	}	//match previous else - logged in
?>