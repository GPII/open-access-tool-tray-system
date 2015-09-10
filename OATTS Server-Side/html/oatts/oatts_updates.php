<?php
include './includes/path.php';
include_once ROOT_PATH . '/lib.php';

//---### NOTE: $fileName, $appId, and $versionNumber must be up-to-date for the relevant App version & server instance(s) of OATTS
$newestVersionNumber = '2.51';
$fileName = "OATTS_Client(" . SERVER_CONTEXT_LABEL . ").crx";

if (SERVER_CONTEXT_LABEL === 'CAE-Sandbox') {   // for CAE OattsSandbox server
	$appId = 'mdladekdidpafbbniknhiekjnagoihng';
	$versionNumber = $newestVersionNumber;
} else if (SERVER_CONTEXT_LABEL === 'CAE') {   // for CAE Oatts "Public" server
	$appId = 'miopgnjdnckglimiocfdkohhjfnbpbhg';
	$versionNumber = $newestVersionNumber;
} else {   // for Oatts RtF Public server
	$appId = 'opgbpbnjnekjjbonfgnfchlmbenlmmgi';
	$versionNumber = $newestVersionNumber;
}

print "<?xml version='1.0' encoding='UTF-8'?>";
print "<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>";
print "<app appid='" . $appId . "'><updatecheck codebase='" . $baseURL . "/" . $fileName . "' version='" . $versionNumber . "' /></app>";
print "</gupdate>";
