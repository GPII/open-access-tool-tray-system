////// debugger;

var thisAppId = "<<##NotYetSet##>>";
var webviewWidth = 0;


setPickerWindowTop();


function setPickerWindowTop() {
	webviewWidth = window.innerWidth;
	var topLine = document.getElementById("picker-top-line");
	document.getElementById("iconpicker-window").style.top = (topLine.offsetTop + topLine.offsetHeight) + "px";
}


// Initialize the mousewheel event listener
// Used for adjusting zoom settings (with the ctrl key down)
(function() {
	// add a mousewheel event listener for adjusting zoom settings (with the ctrl key down)
	if (document.addEventListener) {
		// IE9, Chrome, Safari, Opera
		document.addEventListener("mousewheel", MouseWheelHandler, false);
		// Firefox
		document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
})();


// Mousewheel event listener for adjusting zoom settings (with the ctrl key down)
function MouseWheelHandler(e) {
	var delta = Math.max(-1, Math.min(1, e.wheelDelta));
	if (e.ctrlKey == false) {
		return true;
	}
	if (delta < 0) {
		chrome.runtime.sendMessage(thisAppId, { widget_zoom_smaller: true });
	} else if (delta > 0) {
		chrome.runtime.sendMessage(thisAppId, { widget_zoom_bigger: true });
	}
	return false;
}


window.addEventListener('resize', function(event) {
	if (webviewWidth != window.innerWidth) {
		setPickerWindowTop();
	}
});


// Listen for messages from titlebar
window.addEventListener('message', function(event) {
	var eventData = event.data;
	
	if ("app_id" in eventData) {
		thisAppId = eventData.app_id;
	}
	
	if ("widgets_zoom_setting" in eventData) {
		var newZoomSetting = eventData.widgets_zoom_setting;
		var newZoomSettingText = newZoomSetting + "%";
		if (newZoomSetting < 40) {
			newZoomSettingText = (16 * (newZoomSetting / 100)) + "px";
		}
		document.getElementById("iconpicker-window").style.fontSize = newZoomSettingText;
		document.getElementById("iconpicker-titlebar").style.fontSize = (60 + 0.5 * newZoomSetting) + "%";
		setPickerWindowTop();
		document.getElementById("iconpicker-window").style.display = "block";
	}
	
});


function closeIconPicker(newState) {
	chrome.runtime.sendMessage(thisAppId, { close_icon_picker: true });
}


function pickThisIcon(fileName) {
	chrome.runtime.sendMessage(thisAppId, { new_bookmark_icon: fileName });
}
