<?php

if (isset($globalDebug)) {
	define('DEBUG_TRAY',$globalDebug);
} else {
	define('DEBUG_TRAY',true);
}

if (DEBUG_TRAY) error_log("In dataget.php");
 
if (DEBUG_TRAY) error_log("Tray Widget path - " . WIDGET_ABS_PATH);

$trayData = '[]';
$widgetData = "";
$favoritesData = "[]";
$providerData = "";
$settingsData = "{}";

$loggedInFlag = "false";
$loggedInUser = "";

// first check if logged in...
if (login_check($mysqli) != true) {
	if (DEBUG_TRAY) error_log('not logged in - dataget.php');
	//header("Location: " . $baseURL . '/login.php?err=Not logged in');
	//exit();
} else {
	if (DEBUG_TRAY) error_log('Logged in - dataget.php');
	$loggedInFlag = "true";
	$loggedInUser = $_SESSION['username'];
}

//get widget data
if (($h = opendir(WIDGET_ABS_PATH)) != false) {
	while( ($f = readdir($h)) !== false) {
		if (DEBUG_TRAY) error_log('file =  '.$f);
		if ($f == '.' || $f == '..') continue;
		$filepath = WIDGET_ABS_PATH . "/" . $f;
		if (!is_dir($filepath)) continue;
		//okay got a directory
		$filepathW = $filepath.'/default.xml';
		if (DEBUG_TRAY) error_log("widget directory = " . $filepathW, 0);
		if (file_exists($filepathW)) {
			$xml = simpleXML_load_file($filepathW,"SimpleXMLElement",LIBXML_NOCDATA);
			if ($widgetData != "") $widgetData .= ",";
			$widgetData .= "\"" .to_name($xml->name) . "\": " . json_encode(array("name"=>$xml->name.'',"type"=>$xml->type.'',"id"=>to_name($xml->name).'',"folder"=>$f.'',"link"=>$xml->hyperlink.''));
			
			//now get provider data if a provider widget
			if ($xml->type == "provider") {
				$filepathP = $filepath.'/provider.json';
				if (file_exists($filepathP)) {
					if ($providerData != "") $providerData .= ",";
					$providerData .= "\"" .to_name($xml->name) . "\": " . file_get_contents($filepathP);
				} else {
					error_log("provider.json not found in ".$filepathP);
					//$returnStr .=  '{"error":"4","reason":"provider.json not found"},';
				}
			}
		}
	}
	closedir($h);
} else {
	if (DEBUG_TRAY) error_log("Can't find widget directory for reading default.xml files " . WIDGET_ABS_PATH);
}
$widgetData = "{" . $widgetData . "}";
$providerData = "{" . $providerData . "}";

if (DEBUG_TRAY) error_log("Widget data: ".$widgetData);
$providerData = preg_replace("/[\r\n]+/", "", $providerData);
if (DEBUG_TRAY) error_log("Provider data: ".$providerData);
//strip \n and \t from providerData

if (isset( $_SESSION['user_id'])) {
	$tmpId = $_SESSION['user_id'];
	//get OATTS tray info from database
	if ($stmt = $mysqli->prepare("SELECT tray, providers, settings
								FROM oatts 
								WHERE userId = ?
								LIMIT 1")) {
		$stmt->bind_param('s', $tmpId);
		$stmt->execute();    // Execute the prepared query.
		$stmt->store_result();
		if ($stmt->num_rows == 1) {
			// get variables from result.
			$stmt->bind_result($trayData, $favoritesData, $settingsData);
			$stmt->fetch();
		} else {
			// No matches in table
			if (DEBUG_TRAY) error_log("no entry in OATTS for user id " . $tmpId);
		}
	} else {
		// Could not create a prepared statement
		if (DEBUG_TRAY) error_log('error no: '.$mysqli->errno." :error=: ".$mysqli->error);
		header("Location: " . $baseURL . '/error.php?err=Database error: cannot prepare statement in dataget.php');
		exit();
		//$trayData = "[]";
	}
} else {
	if (DEBUG_TRAY) error_log("session user_id not set");
}
if ($settingsData == "") $settingsData = "{}";

if (DEBUG_TRAY) error_log("Tray data =[".$trayData."]");
if (DEBUG_TRAY) error_log("Favorites data =[".$favoritesData."]");
if (DEBUG_TRAY) error_log("Settings data =[".$settingsData."]");

echo "\n";
echo "var widgetsData = {\n";
echo '"widgets" : ' . $widgetData . ",\n";
echo '"tray": ' . $trayData . ",\n";
echo '"hash": ""' . "\n";
echo '};' . "\n";

echo "var providersData = {\n";
echo '"providers" : ' . $providerData . ",\n";
echo '"favorites": ' . $favoritesData . ",\n";
echo '"hash": ""' . "\n";
echo '};' . "\n";

echo "var settingsData = " . $settingsData . ";\n";
echo "\n";

echo "var baseURL='".$baseURL . "';\n";
echo "var widgetsPath='/". BASEDIR . WIDGETSDIR . "/';\n";
echo "var bookmarkIconsPath='/". BASEDIR . BOOKMARKICONSDIR . "/';\n";
echo "\n";

echo "var loggedInFlag = ".$loggedInFlag.";\n";
echo "var loggedInUser = \"".$loggedInUser."\";\n";
echo "var FIELD_MAX_SIZE = ".DATA_SIZE_LIMIT.";\n";
echo "var HEART_BEAT_RATE = ".HEART_BEAT_RATE.";\n";
echo "\n";

echo "var favoritesDirty=false;\n";
echo "var trayDirty=false;\n";
echo "var settingsDirty=false;\n";

function to_name($n) {
	return str_replace(' ','_',strtolower($n));
}

?>

//load .js files

/* //---### Moved to end of <body> in main.php, and done in-line
(function() {
	var d = document;
	
	if (!d.getElementById('tray-container')) {
		//var scripts = ['js/jquery-1.11.1.js','js/ui/jquery-ui-1.10.4.custom.js','tray.js','provider.js'];
		var scripts = ['/js/jquery.js','/js/ui/jquery-ui.js','/js/tray.js','/js/provider.js'];
		var current = 0;
		function loadNext() {
			if (scripts[current]) {
				var script = d.createElement('script');
				script.onload = loadNext;
				script.src = baseURL + scripts[current] + '?v=<?php echo time(); ?>';
				d.head.appendChild(script);
			} else {
			}
			current++;
		}
		loadNext();
	} else {
		document.getElementById('tray-container').style.display = '';
		document.getElementById('tray-widgets-window').style.display = '';
	}
})();
*/ //---###

