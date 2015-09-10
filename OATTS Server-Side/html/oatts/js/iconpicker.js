
var thisAppId = "<<##NotYetSet##>>";
var webviewWidth = 0;

var tooltipsLoaded = false;

// Listen for messages from titlebar
window.addEventListener('message', function(event) {
	var eventData = event.data;
	
	if ("app_id" in eventData) {
		thisAppId = eventData.app_id;
	}
	
	if ("widgets_zoom_setting" in eventData) {
		document.getElementById("iconpicker").style.fontSize = (16 * (eventData.widgets_zoom_setting / 100)) + "px";
		document.getElementById("iconpicker").style.display = "block";
		setPickerWindowTop();
	}
	
	if ("user_settings" in eventData) {
		var userSettingsObj = eventData.user_settings;
		if ("show_tooltips" in userSettingsObj) {
			if (userSettingsObj.show_tooltips == true && tooltipsLoaded) {
				$( document.body ).tooltip( "enable" );
			}
		}
		if ("zoom_setting" in userSettingsObj) {
			var styleElem = document.getElementById("traystyles").sheet;
			for (var i = 0; i < styleElem.cssRules.length; i++) {
				if (styleElem.cssRules[i].selectorText == ".ui-tooltip") {
					styleElem.cssRules[i].style.fontSize = (18 + 0.75 * userSettingsObj.zoom_setting) + "%";
					break;
				}
			}
		}
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
		chrome.runtime.sendMessage(thisAppId, { widget_zoom_default: true });
		return false;
	}
	return true;
});


// Load resize event listener for updating iconpicker-titlebar height when
// changes in the width of the window cause changes in the page title word-wrap
window.addEventListener('resize', function(event) {
	if (webviewWidth != window.innerWidth) {
		setPickerWindowTop();
	}
});


function setPickerWindowTop() {
	webviewWidth = window.innerWidth;
	document.getElementById("iconpicker-window").style.top = document.getElementById("picker-top-line-bottom").offsetTop + "px";
}


function zoomBigger() {
	chrome.runtime.sendMessage(thisAppId, { widget_zoom_bigger: true });
}


function zoomSmaller() {
	chrome.runtime.sendMessage(thisAppId, { widget_zoom_smaller: true });
}


function closeIconPicker(newState) {
	chrome.runtime.sendMessage(thisAppId, { close_icon_picker: true });
}


function pickThisIcon(iconPath) {
	chrome.runtime.sendMessage(thisAppId, { new_bookmark_icon: iconPath });
}


function updateImage(imageNode, imageUrl) {
	imageNode.src = imageUrl;
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
	
	var tooltipTargets = "a, :button";
	
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

