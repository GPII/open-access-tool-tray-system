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
		<title>OATTS</title>
		
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		
		<link rel="stylesheet" type="text/css" href="styles/normalize.css?v=<?php echo time(); ?>" />
		<link rel="stylesheet" type="text/css" href="js/ui/jquery-ui.css?v=<?php echo time(); ?>" />
		<link rel="stylesheet" type="text/css" id="traystyles" href="styles/style.css?v=<?php echo time(); ?>" />
		<link rel="stylesheet" type="text/css" id="providerstyles" href="styles/provider.css?v=<?php echo time(); ?>" />
	</head>
	
	<body>

		<div id="iframe-container" style="display: none;">
			
			<div id="iframe-container-titlebar">
				<button type="button" class="closepopupbutton" onclick="closeIframe()" title="Close Panel" tabindex="0">
					Close<img src="images/down_arrow.png" alt="" class="closepopupbuttonicon">
				</button>
				<div id="zoomFontSize">
					<span id="zoom-buttons">
						<button type="button" id="zoomout" class="zoom-letter" title="Zoom Smaller (Ctrl -)" onclick="zoomTextSmaller(true);">A<sup>-</sup></button>
						<button type="button" id="zoomdefault" class="zoom-letter" title="Zoom to 100% (Ctrl 0)" onclick="zoomTextDefault(true);">A</button>
						<button type="button" id="zoomin" class="zoom-letter" title="Zoom Bigger (Ctrl +)" onclick="zoomTextBigger(true);">A<sup>+</sup></button>
					</span>
				</div>
				<div id="iframe-top-line"></div>
				<div id="iframe-top-line-bottom"></div>
			</div>
			
			<!-- provider window -->
			<div id="providerIframe" style="display: none;">
				<div id="providercontent">
					
					<h1 id="providerTitle" class="providerTitle">Service Provider Menu</h1>
					
					<div id="favhead">
						<h2 class="favhead">Favorites List<img id="fspicon" src="images/favorites.png" alt=""> </h2>
					</div>
					
					<button type="button" id="insbutton" tabindex="0" class="provbutton" title="Add New Entry to Favorites">Add New Entry to Favorites</button>
					
					<ul id="favlist" class="favlist"></ul>
					
					<hr id="favlist-end-line">
					
					<div id="providershead">
						<h2 class="providershead">Service Providers</h2>
					</div>
					
					<ul id="providerlist" class="providerlist"></ul>
					
				</div>
			</div>
			<!-- END provider window -->
			
			<!-- settings & about OATTS window -->
			<div id="settingsIframe">
				
				<div id="settingscontent">
					<h1 id="settingsTitle">OATTS Settings</h1>
					
					<div id="oatts-settings">
						<p><label class="oatts-setting-line"><input type="checkbox" id="thin-titlebar-btn" class="settingsCheckbox" name="ShowThinTitlebar" value="true"> Thin Titlebar</label></p>
						<p><label class="oatts-setting-line"><input type="checkbox" id="show-widget-names-btn" class="settingsCheckbox" name="ShowWidgetNames" value="true"> Show Widget Names</label></p>
						<p><label class="oatts-setting-line"><input type="checkbox" id="show-tooltips-btn" class="settingsCheckbox" name="ShowTooltips" value="true"> Show Tooltips</label></p>
						<p><label class="oatts-setting-line">Text Panels Zoom: <select id="text-panels-zoom" class="selectBox" datatype="double"></select></label></p>
						<p><label class="oatts-setting-line">Widget Panels Zoom: <select id="widget-panels-zoom" class="selectBox" datatype="double"></select></label></p>
					</div>
				</div>

				<div id="aboutcontent">
					<h1 id="aboutTitle">About OATTS</h1>
					<div id="oatts-info">
						<p id="version-info"></p>
						<p>Copyright &copy; 2013-2016<br>Trace Center</p>
					</div>
				</div>
				
			</div>
			<!-- END settings & about OATTS window -->
			
			
			
		</div>
		
		<!-- dialog box elements -->
		<div id="dialog-form" title="" style="display: none;">
			<p class="validateTips"></p>
			<form>
				<fieldset>
					<label for="editname">Name of Provider<span class="requiredfield">(this field required)</span></label>
					<input type="text" name="editname" id="editname" value="" class="text ui-widget-content ui-corner-all">
					<label for="editurl">Address to launch service</label>
					<input type="text" name="editurl" id="editurl" value="" class="text ui-widget-content ui-corner-all" style="display: inline-block">
					<div id="editiconDiv" style="display:none">
						<!-- <input type="text" name="editicon" id="editicon" value="" class="text ui-widget-content ui-corner-all" style="display: inline-block"> -->
						
						<div id="bookmark-dialog-widget">
							<img id="bookmark-dialog-icon" alt="" class="tray-bookmark-icon"/>
							<img src="images/to_tray.png" alt="" class="tray-shortcut-icon"/>
						</div>
						
						<button type="button" id="imgpicker" class="provbutton" title="Change bookmark icon">Change Icon</button>
						
						<div id="iconpathlabel">Icon:<span id="iconpathtext">Icon:</span></div>
					</div>
				</fieldset>
			</form>
		</div>
		
		<div id="dialog-alert" title="Quit OATTS?" style="display: none;">
			<p id="dialog-alert-message"></p>
		</div>
		<!-- END dialog box elements -->
		
		<script>
			<?php
			include_once ROOT_PATH . '/dataget.php';
			//include_once ROOT_PATH . '/picker.php';
			?>
		</script>
		
		<!-- //---### The following script loads were moved here from dataget.php -->
		<script src="js/jquery.js" ></script>
		<script src="js/ui/jquery-ui.js" ></script>
		<script src="js/tray.js?v=<?php echo time(); ?>" ></script>
		<script src="js/provider.js?v=<?php echo time(); ?>" ></script>
		<!-- //---### END moved script loads -->
	
	</body>
	
</html>

<?php
//	}	//match previous else - logged in
?>