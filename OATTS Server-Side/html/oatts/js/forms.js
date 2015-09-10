
var thisAppId = "<<##NotYetSet##>>";

////// var zoomSettingsArray = [ 80, 100, 125, 160, 200, 250, 320, 400 ];   // zoom settings, in percents
var zoomSettingsArray = [ 80, 100, 125, 160, 200, 250, 300 ];   // zoom settings, in percents

var defaultZoomSetting = 160;   // default & initial zoom setting, in percent
var currentZoomSetting = defaultZoomSetting;

var tooltipsLoaded = false;


// Listen for messages from titlebar
window.addEventListener('message', function(event) {
	var eventData = event.data;
	
	if ("app_id" in eventData) {
		thisAppId = eventData.app_id;
	}
	
	if ("signin_zoom_setting" in eventData) {
		updateZoomSetting(eventData.signin_zoom_setting);
		document.body.style.display = "block";
	}
	
});


// Load mousewheel event listener for adjusting the zoom setting, iff the ctrl key is down
document.addEventListener("wheel", function(event) {
	if (event.ctrlKey == false) {
		return true;
	}
	var delta = Math.max(-1, Math.min(1, event.wheelDelta));
	if (delta > 0) {
		zoomBigger();
	} else if (delta < 0) {
		zoomSmaller();
	}
	return false;
});


// Load keydown event listener for adjusting zoom setting,
// using the "+" key(s) and the "-" key(s), iff the ctrl key is down
document.addEventListener("keydown", function(event) {
	if (event.ctrlKey == false) {
		return true;
	}
	if (event.keyCode == 107 || event.keyCode == 187) {   // "plus" key(s)
		zoomBigger();
		return false;
	} else if (event.keyCode == 109 || event.keyCode == 189) {   // "minus" key(s)
		zoomSmaller();
		return false;
	} else if (event.which == 48) {   // "0" key
		zoomDefault();
		return false;
	}
	return true;
});


function zoomBigger() {
	for (var i = 0; i < zoomSettingsArray.length - 1; i++) {
		if (currentZoomSetting < zoomSettingsArray[i]) {
			break;
		}
	}
	updateZoomSetting(zoomSettingsArray[i]);
}


function zoomSmaller() {
	for (var i = zoomSettingsArray.length - 1; i > 0; i--) {
		if (currentZoomSetting > zoomSettingsArray[i]) {
			break;
		}
	}
	updateZoomSetting(zoomSettingsArray[i]);
}


function zoomDefault() {
	updateZoomSetting(defaultZoomSetting);
}


function updateZoomSetting(newZoomSetting) {
	currentZoomSetting = newZoomSetting;
	chrome.runtime.sendMessage(thisAppId, { signin_zoom_setting: currentZoomSetting });
	document.body.style.fontSize = currentZoomSetting + "%";
	
	if (currentZoomSetting <= zoomSettingsArray[0]) {
		document.getElementById("zoomout").className = "zoom-letter disabledZoomSetting";
	} else {
		document.getElementById("zoomout").className = "zoom-letter";
	}
	if (currentZoomSetting >= zoomSettingsArray[zoomSettingsArray.length - 1]) {
		document.getElementById("zoomin").className = "zoom-letter disabledZoomSetting";
	} else {
		document.getElementById("zoomin").className = "zoom-letter";
	}
	if (currentZoomSetting == defaultZoomSetting) {
		document.getElementById("zoomdefault").className = "zoom-letter disabledZoomSetting";
	} else {
		document.getElementById("zoomdefault").className = "zoom-letter";
	}
	
	/*
	var styleElem = document.getElementById("traystyles").sheet;
	for (var i = 0; i < styleElem.cssRules.length; i++) {
		if (styleElem.cssRules[i].selectorText == ".ui-tooltip") {
			styleElem.cssRules[i].style.fontSize = (18 + 0.75 * currentZoomSetting) + "%";
			break;
		}
	}
	*/
	
}


// jQuery ready function - used for tooltips
$(function() {
	
	function initTooltips() {
		if (tooltipsLoaded != true) {
			$( document.body ).tooltip();
			$( document.body ).tooltip( "option", "track", true );
			$( document.body ).tooltip( "option", "show", { delay: 750, duration: 200 } );
			$( document.body ).tooltip( "option", "hide", { duration: 200 } );
			$( document.body ).tooltip({ position: { my: "left+8 top+28", at: "center", collision: "flipfit" } });
			$( document.body ).tooltip( "option", "disabled", true );
		}
		tooltipsLoaded = true;
		$( document.body ).tooltip( "enable" );
	}
	
	function clearTooltips() {
		if (tooltipsLoaded == true) {
			if ($( document.body ).tooltip( "option", "disabled") == false) {
				$( document.body ).tooltip( "disable" );
				$( document.body ).tooltip( "enable" );
			}
		}
	}
	
	initTooltips();
	
	var tooltipTargets = "a, :button, input";
	
	$( document.body ).on( "focusin", tooltipTargets, function() {
		if ($( ".ui-tooltip" ).length > 0) {
			clearTooltips();
		}
	}).on( "mouseenter", tooltipTargets, function() {
		if ($( ".ui-tooltip" ).length > 0) {
			clearTooltips();
		}
	}).on( "mousemove", tooltipTargets, function() {
		if (tooltipsLoaded == true) {
			var titleVal = $( this ).attr( "title" );
			if (titleVal != undefined && titleVal != "") {
				$( this ).trigger( "mouseenter" );
			}
		}
	});
	
});   // end of jquery ready function


/* 
 reference: http://www.wikihow.com/Create-a-Secure-Login-Script-in-PHP-and-MySQL 
*/
function validateForm(form) {
	
	var regEx;
	var msg = "";
	document.getElementById('user').innerHTML = msg;
	document.getElementById('userEmail').innerHTML = msg;
	document.getElementById('userPass1').innerHTML = msg;
	document.getElementById('userPass2').innerHTML = msg;

	// Check each field has a value
	if (form.username.value == '' || form.email.value == '' || form.password.value == '' || form.confirmpwd.value == '') {
		msg = 'You must provide all the requested details.';
		document.getElementById('user').innerHTML = msg;
		return false;
	}
	
	// Check the username
	regEx = /^\w+$/; 
	if(!regEx.test(form.username.value)) { 
		msg = "Username must contain only letters, digits and underscores.";
		document.getElementById('user').innerHTML = msg;
		form.username.focus();
		return false; 
	}
	
	//check email. should get ~99% of all of them
	regEx = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
	if(!regEx.test(form.email.value)) { 
		msg = "Not a recognized email address syntax.";
		document.getElementById('userEmail').innerHTML = msg;
		form.email.focus();
		return false; 
	}

	// Check that the password is sufficiently long (min 6 chars)
	if (form.password.value.length < 6) {
		msg = 'Passwords must be at least 6 characters long.';
		document.getElementById('userPass1').innerHTML = msg;
		form.password.focus();
		return false;
	}
	
	// At least one digit, one lowercase and one uppercase letter 
	regEx = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; 
	if (!regEx.test(form.password.value)) {
		msg = 'Passwords must contain at least one lowercase letter, one uppercase letter, and one digit.';
		document.getElementById('userPass1').innerHTML = msg;
		form.password.focus();
		return false;
	}
	
	// Check password and confirmation are the same
	if (form.password.value != form.confirmpwd.value) {
		msg = 'Your password and confirmation do not match.';
		document.getElementById('userPass2').innerHTML = msg;
		form.password.focus();
		return false;
	}
	
	form.submit();
	return true;
}

