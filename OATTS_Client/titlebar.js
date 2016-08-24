//---### debugger;

////// var titlebarFocusColor = "#98b8d8";
////// var titlebarNotFocusColor = "#a0a0a0";
var loginStartWidth = 800;
var loginStartHeight = 600;
var NameOfProgram = "OATTS";

var frame2WebviewPixelRatio = 1;

var windowSettingsObj = {
	window_width: loginStartWidth,
	popup_window_width: loginStartWidth,
	screen_left_x: Math.round(window.screen.availLeft + (screen.availWidth - loginStartWidth) / 2),
	screen_bottom_y: Math.round(window.screen.availTop + (screen.availHeight + loginStartHeight) / 2),
	is_maximized: false,
	tray_height: 150,
	popup_height: 450,
	signin_zoom_setting: 160
};

var userSettingsObj = { thin_titlebar: false, show_widget_names: true, show_tooltips: true, zoom_setting: 100, widgets_zoom_setting: 100 };

var mainWebviewLoaded = false;
var trayWebviewLoaded = false;
var popupPanelShowing = false;
var isMinimized = false;   // used only in the onBoundsChanged event listener
var dialogIsShowing = false;
var menuIsShowing = false;

var onBoundsChangedTimer = null;


function log(message) {
	//document.getElementById('log').textContent += message + '\n';
}


function convertToScreenPixels(sizeInCssPixels) {
	return Math.round(sizeInCssPixels * frame2WebviewPixelRatio);
}


/* //---###//---###//---###//---###//---###//---###//---###//---###
chrome.contextMenus.onClicked.addListener(function(info) {
	var tmp;
	if (((tmp = document.body.getAttribute("data-window-type")) != null) && (tmp === "main_window")) {
	//if (document.hasFocus()) {

		if (info.menuItemId == 'logout') {
			askLogOut();
		} else if (info.menuItemId == 'refresh') {
			refreshPage();
		}
	}

});
*/ //---###//---###//---###//---###//---###//---###//---###//---###


//---###chrome.contextMenus.removeAll( function() {
//---###	chrome.contextMenus.create({
//---###		title: "Log out",
//---###		contexts: ["image"],
//---###		id: 'logout',
//---###		documentUrlPatterns: ["chrome-extension://*/main.html"],
//---###		targetUrlPatterns: ["chrome-extension://*/images/button_icon_hover.png"]
//---###		//contexts: ["page", "selection", "image", "link"]
//---###	});
  
//---###	chrome.contextMenus.create({
//---###		title: "Refresh",
//---###		contexts: ["image"],
//---###		id: 'refresh',
//---###		documentUrlPatterns: ["chrome-extension://*/main.html"],
//---###		targetUrlPatterns: ["chrome-extension://*/images/button_icon_hover.png"]
//---###	//contexts: ["page", "selection", "image", "link"]
//---###	});
//---###


/*
function isDevMode() {
    if (__devMode == null) {
        var mUrl = chrome.runtime.getURL('manifest.json');
        var xhr = new XMLHttpRequest();
        xhr.open("GET", mUrl, false);
        xhr.onload = function() {
            var json = JSON.parse(this.responseText);
            __devMode = !('update_url' in json);
            console.log("__devMode: " + __devMode);
        };
        xhr.send();
    }
    return __devMode
}
*/


function menuEvent(e) {
	var elem = document.getElementById("menu");
	if (!e) var e = window.event;
	var src = (window.event) ? e.srcElement : e.target;
	//if (src.nodeName != 'DIV') return;
	var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
	//while (reltg != src && reltg.nodeName != 'BODY')
	while (reltg != elem && reltg.nodeName != 'BODY')
		reltg= reltg.parentNode
	if (reltg == elem) return;
	//if (reltg == src) return;
	// Mouseout took place when mouse actually left layer
	// Handle event
	
	/*
	elem.onmouseout = null;
	elem.style.display = "none";
	*/
	hideMenu();   //---###//---###
	
}


function hideMenuCheck(e) {
	if (!e) var e = window.event;
	var elem = document.getElementById("menu");
	var src = (window.event) ? e.srcElement : e.target;
	if (src == document.getElementById("full-titlebar-settings-button-img")) return;
	if (src == document.getElementById("mini-titlebar-settings-button-img")) return;
	if (src == document.getElementById("full-titlebar-settings-button")) return;
	if (src == document.getElementById("mini-titlebar-settings-button")) return;
	while (src != elem && src.nodeName != 'BODY')
		src = src.parentNode
	if (src == elem) return;
	hideMenu();
}


function displayMenu(ev) {
	var elem = document.getElementById("menu");
	if (elem.style.display == "") {
		//was visible. now hide
		hideMenu();
	} else {
		elem.style.display = "";
		if (mainWebviewLoaded && trayWebviewLoaded) {
			menuIsShowing = true;
			resizeMainWindow(Math.round(elem.offsetHeight * frame2WebviewPixelRatio));
		}
		elem.onmouseout = menuEvent;
		document.onmouseup = hideMenuCheck;
	}
}


function hideMenu(dontResizeMainWindowFlag) {
	var elem = document.getElementById("menu");
	if (elem.style.display == "") {
		elem.onmouseout = null;
		elem.style.display = "none";
		if (mainWebviewLoaded && trayWebviewLoaded) {
			menuIsShowing = false;
			if (dontResizeMainWindowFlag != true) {
				resizeMainWindow(0);
			}
		}
	}
}


function createMenuItem(item_num, item_name, image_url, click_func) {
	var item_id = "menu-item" + item_num;
	var menuItem = document.createElement("li");
	menuItem.setAttribute("id", item_id);
	var menuLink = document.createElement("a");
	menuLink.setAttribute("href", "#");
	menuLink.setAttribute("tabindex", item_num + 2);
	
	var menuImage = document.createElement("img");
	menuImage.setAttribute("id", item_id + "-image");
	
	menuImage.setAttribute("class", "menuicon");
	menuImage.src = image_url;
	if (image_url == "images/menu/menu_checked.png") {
		menuImage.style.visibility = "hidden";
	}
	menuLink.appendChild(menuImage);
	
	var menuSpan = document.createElement("span");
	menuSpan.setAttribute("id", "menutext-" + item_id);
	menuSpan.appendChild(document.createTextNode(item_name));
	menuLink.appendChild(menuSpan);
	
	menuLink.onclick = click_func;
	menuLink.onkeydown = function(event) {
		if (event.keyCode != 13 && event.keyCode != 32) {
			return true;
		}
		click_func.call();
		return false;
	}
	
	menuItem.appendChild(menuLink);
	return menuItem;
}


function addMenuItems(menu_id) {
	var menuNode = document.getElementById(menu_id);
	if (menuNode != null) {
		var itemNode;
		while ((itemNode = menuNode.lastChild) != null) {
			menuNode.removeChild(itemNode);
		}
		if (document.body.getAttribute("data-window-type") == "main_window") {
			if (trayWebviewLoaded == true) {
				menuNode.appendChild(createMenuItem(1, "Settings...", "images/menu/menu_blank_icon.png", menuTest1));
				menuNode.appendChild(createMenuItem(2, "Tool Changer...", "images/menu/menu_blank_icon.png", menuTest2));
			}
			menuNode.appendChild(createMenuItem(3, "Thin Titlebar", "images/menu/menu_checked.png", menuTest3));
			updateThinTitlebarMenuCheck();
			
			//---###//---###
			////// menuNode.appendChild(createMenuItem(4, "Refresh", "images/menu/menu_blank_icon.png", menuTest4));
			//---###//---###
			
			menuNode.appendChild(createMenuItem(5, "Log Out", "images/menu/menu_blank_icon.png", menuTest5));
			if (trayWebviewLoaded == false) {
				menuNode.appendChild(createMenuItem(6, "Log In", "images/menu/menu_blank_icon.png", menuTest6));
			}
			
		} else {   // provider window menu
			menuNode.appendChild(createMenuItem(3, "Thin Titlebar", "images/menu/menu_checked.png", menuTest3));	
			updateThinTitlebarMenuCheck();
			
		}
	}
}


// Show Setting Page
function menuTest1() {
	sendSettingsToWebview({ open_settings_page: true });
	hideMenu(true);
}


// Show Tool Changer
function menuTest2() {
	sendSettingsToWebview({ open_widget_picker: true });
	hideMenu(true);
}


// Show Thin Titlebar - toggles check-mark
function menuTest3() {
	var checkImageNode = document.getElementById("menu-item3-image");
	if (checkImageNode != null) {
		userSettingsObj.thin_titlebar = (checkImageNode.style.visibility == "hidden");
		updateThinTitlebarMenuCheck();
		updateTitlebarVisibility();
		if (document.body.getAttribute("data-window-type") == "main_window") {
			saveUserSettings();
			sendSettingsToWebview({ changed_thin_titlebar: userSettingsObj.thin_titlebar });
		}
	}
	hideMenu();
}


// Update check-mark for Thin Titlebar menu item
function updateThinTitlebarMenuCheck() {
	var checkImageNode = document.getElementById("menu-item3-image");
	if (checkImageNode != null) {
		checkImageNode.style.visibility = (userSettingsObj.thin_titlebar == true ? "" : "hidden");
	}
}


// Refresh Page
/* //---###//---###//---###//---###
function menuTest4() {
	refreshPage();
	hideMenu();
}
*/ //---###//---###//---###//---###


// Log Out
function menuTest5() {
	askLogOut();
	hideMenu(true);
}


// Log In
function menuTest6() {
	askLogIn();
	hideMenu(true);
}


function refreshPage() {
	////// dialogIsShowing = false;
	var tmp = document.getElementById("web-page-frame");
	if (tmp != null) {
		tmp.reload();
	}
}


function askLogOut() {
	// if logged in, verify you want to logout
	if ((document.body.getAttribute("data-window-type") == "main_window") && (trayWebviewLoaded)) {
		sendSettingsToWebview({ ask_logout: true });
	} else {
		logOut();
	}
}


function logOut() {
	var tmp = document.getElementById("web-page-frame");
	if (tmp != null) {
		tmp.src = LOGOUT_URL;
	}
	hideLogStatus();
}


function askLogIn() {
	//if logged in already, don't reload
	if ((document.body.getAttribute("data-window-type") == "main_window") && (trayWebviewLoaded)) {
		sendSettingsToWebview({ ask_login: true });
	} else {
		logIn();
	}
}


function logIn() {
	var tmp = document.getElementById("web-page-frame");
	if (tmp != null) {
		tmp.src = MAIN_URL;
	}
	hideLogStatus();
}


function setToIsOnTop() {
	if (chrome.app.window.current().isMaximized()) return;
	
	document.getElementById("full-titlebar-not-on-top-button").style.display = "none";
	document.getElementById("full-titlebar-is-on-top-button").style.display = "";
	document.getElementById("mini-titlebar-not-on-top-button").style.display = "none";
	document.getElementById("mini-titlebar-is-on-top-button").style.display = "";
	chrome.app.window.current().setAlwaysOnTop(true);
	if (document.getElementById("full-titlebar").style.display == "none") {
		document.getElementById("mini-titlebar-is-on-top-button").focus();
	} else {
		document.getElementById("full-titlebar-is-on-top-button").focus();
	}
}


function setToNotOnTop(noFocusFlag) {
	document.getElementById("full-titlebar-is-on-top-button").style.display = "none";
	document.getElementById("full-titlebar-not-on-top-button").style.display = "";
	document.getElementById("mini-titlebar-is-on-top-button").style.display = "none";
	document.getElementById("mini-titlebar-not-on-top-button").style.display = "";
	chrome.app.window.current().setAlwaysOnTop(false);
	if (noFocusFlag != true) {
		if (document.getElementById("full-titlebar").style.display == "none") {
			document.getElementById("mini-titlebar-not-on-top-button").focus();
		} else {
			document.getElementById("full-titlebar-not-on-top-button").focus();
		}
	}
}


function minimizeWindow() {
	chrome.app.window.current().minimize();
}


function maximizeWindow() {
	chrome.app.window.current().maximize();
}


function demaximizeWindow() {
	chrome.app.window.current().restore();
}


function closeWindow() {
	if ((document.body.getAttribute("data-window-type") == "main_window") && (trayWebviewLoaded)) {
		if (document.getElementById("web-page-frame") != null) {
			sendSettingsToWebview({ close_window: true });
		} else {
			terminateProgram();
		}
	} else {
		terminateProgram();
	}
}


function terminateProgram() {
	window.close();
}


function backBrowser() {
	document.getElementById("web-page-frame").back();
}


function forwardBrowser() {
	document.getElementById("web-page-frame").forward();
}


function refreshBrowser() {
	document.getElementById("web-page-frame").reload();
}


function launchPicker() {
	//
}


function doNothing() {
}


function updateImageUrl(image_id, new_image_url) {
	var image = document.getElementById(image_id);
	if (image) {
		image.src = new_image_url;
	}
}


function createImage(image_id, image_url) {
	var image = document.createElement("img");
	image.setAttribute("id", image_id);
	image.src = image_url;
	return image;
}


function createButton(button_id, button_class_name, normal_image_url,
                       hover_image_url, title_text, click_func) {
	var button = document.createElement("div");
	var imageId = button_id + "-img";
	button.setAttribute("id", button_id);
	button.setAttribute("class", button_class_name);
	button.setAttribute("tabindex", "0");	//##JOE
	if (title_text != null) {
		button.setAttribute("title", title_text);
	}
	var button_img = createImage(imageId, normal_image_url);
	button.appendChild(button_img);
	if (hover_image_url != null) {
		button.onmouseover = function() { updateImageUrl(imageId, hover_image_url); };
		button.onmouseout = function() { updateImageUrl(imageId, normal_image_url); };
	}
	button.onclick = click_func;
	
	button.onkeydown = function(event) {
		if (event.keyCode != 13 && event.keyCode != 32) {
			return true;
		}
		click_func.call();
		return false;
	}
	
	return button;
}


function addTitlebar(titlebar_name, titlebar_text) {
	var buttonClassName = titlebar_name + "-buttons";
	var buttonPathLeader = "images/";
	var isMiniTitlebar = (titlebar_name == "mini-titlebar");
	if (isMiniTitlebar == true) {
		buttonPathLeader = "images/mini_";
	}
	
	// outer div
	var titlebar = document.createElement("div");
	titlebar.setAttribute("id", titlebar_name);
	////// titlebar.setAttribute("class", titlebar_name);
	
	// icon button
	var iconButton = createButton(titlebar_name + "-icon-button",
								buttonClassName,
								buttonPathLeader + "button_icon.png",
								null,
								null,
								doNothing);
	iconButton.setAttribute("tabindex", "1");   //---###//---###
	titlebar.appendChild(iconButton);
	
	// settings button
	var settingsButton = createButton(titlebar_name + "-settings-button",
								buttonClassName,
								buttonPathLeader + "button_settings.png",
								buttonPathLeader + "button_settings_hover.png",
								"Menu",
								displayMenu);
	settingsButton.setAttribute("tabindex", "2");   //---###//---###
	titlebar.appendChild(settingsButton);
	
	if (document.body.getAttribute("data-window-type") == "main_window") {
		var loggedInButton = createButton(titlebar_name + "-loggedIn-button",
										buttonClassName,
										"images/button_loggedIn.png",
										null,
										titlebar_text,
										doNothing);
		titlebar.appendChild(loggedInButton);
		
		var loggedOutButton = createButton(titlebar_name + "-loggedOut-button",
										buttonClassName,
										"images/button_loggedOut.png",
										null,
										titlebar_text,
										doNothing);
		titlebar.appendChild(loggedOutButton);
		
		if (isMiniTitlebar == false) {
			// text - program name & connection status
			var title = document.createElement("div");
			title.setAttribute("id", titlebar_name + "-text1");
			title.textContent = titlebar_text;
			titlebar.appendChild(title);
		}
		
	} else {
		// back button
		var backButton = createButton(titlebar_name + "-back-button",
										buttonClassName,
										buttonPathLeader + "button_back.png",
										buttonPathLeader + "button_back_hover.png",
										"Back",
										backBrowser);
		titlebar.appendChild(backButton);

		// forward button
		var forwardButton = createButton(titlebar_name + "-forward-button",
										buttonClassName,
										buttonPathLeader + "button_forward.png",
										buttonPathLeader + "button_forward_hover.png",
										"Forward",
										forwardBrowser);
		titlebar.appendChild(forwardButton);
		
		// refresh button
		var refreshButton = createButton(titlebar_name + "-refresh-button",
										buttonClassName,
										buttonPathLeader + "button_refresh.png",
										buttonPathLeader + "button_refresh_hover.png",
										"Refresh",
										refreshBrowser);
		titlebar.appendChild(refreshButton);
		
		if (isMiniTitlebar == false) {
			// text - url
			var title = document.createElement("div");
			title.setAttribute("id", titlebar_name + "-text");
			title.textContent = titlebar_text;
			titlebar.appendChild(title);
		}
	}
	
	// not on top button
	var notOnTopButton = createButton(titlebar_name + "-not-on-top-button",
								buttonClassName,
								buttonPathLeader + "button_not_on_top.png",
								buttonPathLeader + "button_not_on_top_hover.png",
								"Pinned on top is Off",
								setToIsOnTop);
	titlebar.appendChild(notOnTopButton);
	
	// is on top button
	var isOnTopButton = createButton(titlebar_name + "-is-on-top-button",
								buttonClassName,
								buttonPathLeader + "button_is_on_top.png",
								buttonPathLeader + "button_is_on_top_hover.png",
								"Pinned on top is On",
								setToNotOnTop);
	titlebar.appendChild(isOnTopButton);
	
	// minimize button
	var minimizeButton = createButton(titlebar_name + "-minimize-button",
								buttonClassName,
								buttonPathLeader + "button_minimize.png",
								buttonPathLeader + "button_minimize_hover.png",
								"Minimize",
								minimizeWindow);
	titlebar.appendChild(minimizeButton);
	
	// maximize button
	var maximizeButton = createButton(titlebar_name + "-maximize-button",
								buttonClassName,
								buttonPathLeader + "button_maximize.png",
								buttonPathLeader + "button_maximize_hover.png",
								"Maximize",
								maximizeWindow);
	titlebar.appendChild(maximizeButton);
	
	// demaximize button
	var demaximizeButton = createButton(titlebar_name + "-demaximize-button",
								buttonClassName,
								buttonPathLeader + "button_demaximize.png",
								buttonPathLeader + "button_demaximize_hover.png",
								"Restore Normal",
								demaximizeWindow);
	titlebar.appendChild(demaximizeButton);
	
	// close button
	var closeButton = createButton(titlebar_name + "-close-button",
								buttonClassName,
								buttonPathLeader + "button_close.png",
								buttonPathLeader + "button_close_hover.png",
								"Close " + NameOfProgram,
								closeWindow);
	titlebar.appendChild(closeButton);
	
	// screen overlay div
	var titlebarScreen = document.createElement("div");
	titlebarScreen.setAttribute("id", titlebar_name + "-screen");
	titlebar.appendChild(titlebarScreen);
	
	document.body.insertBefore(titlebar, document.getElementById("menu"));
}


function updateTitleBars() {
	focusTitlebars(true);
	
	var maxBtn = document.getElementById("full-titlebar-maximize-button");
	var demaxBtn = document.getElementById("full-titlebar-demaximize-button");
	var miniMaxBtn = document.getElementById("mini-titlebar-maximize-button");
	var miniDemaxBtn = document.getElementById("mini-titlebar-demaximize-button");
	var showingMini = (document.getElementById("full-titlebar").style.display == "none")
	
	if (chrome.app.window.current().isMaximized() == true) {
		var prevTargetNode = (showingMini == true ? miniMaxBtn : maxBtn);
		var newTargetNode = (showingMini == true ? miniDemaxBtn : demaxBtn);
		var hasFocus = (document.activeElement == prevTargetNode);
		demaxBtn.style.display = "";
		miniDemaxBtn.style.display = "";
		maxBtn.style.display = "none";
		miniMaxBtn.style.display = "none";
		if (hasFocus == true) {
			newTargetNode.focus();
		}
	} else {
		var prevTargetNode = (showingMini == true ? miniDemaxBtn : demaxBtn);
		var newTargetNode = (showingMini == true ? miniMaxBtn : maxBtn);
		var hasFocus = (document.activeElement == prevTargetNode);
		maxBtn.style.display = "";
		miniMaxBtn.style.display = "";
		demaxBtn.style.display = "none";
		miniDemaxBtn.style.display = "none";
		if (hasFocus == true) {
			newTargetNode.focus();
		}
	}
	
	if (dialogIsShowing	== true) {
		document.getElementById("full-titlebar-screen").style.display = "";
		document.getElementById("mini-titlebar-screen").style.display = "";
	} else {
		document.getElementById("full-titlebar-screen").style.display = "none";
		document.getElementById("mini-titlebar-screen").style.display = "none";
	}	
}


function updateTitlebarVisibility() {
	var titlebarHeight;
	var deltaH;
	if (userSettingsObj.thin_titlebar == true && document.getElementById("full-titlebar").style.display == "") {
		// Hide full titlebar and show mini titlebar
		document.getElementById("mini-titlebar").style.display = "";
		titlebarHeight = document.getElementById("mini-titlebar").offsetHeight;
		deltaH = convertToScreenPixels(titlebarHeight - document.getElementById("full-titlebar").offsetHeight);   //---### added viewportScaling factor
		document.getElementById("full-titlebar").style.display = "none";
	} else if (userSettingsObj.thin_titlebar != true && document.getElementById("full-titlebar").style.display == "none") {
		// Hide mini titlebar and show full titlebar
		document.getElementById("full-titlebar").style.display = "";
		titlebarHeight = document.getElementById("full-titlebar").offsetHeight;
		deltaH = convertToScreenPixels(titlebarHeight - document.getElementById("mini-titlebar").offsetHeight);   //---### added viewportScaling factor
		document.getElementById("mini-titlebar").style.display = "none";
	} else {
		return;
	}
	
	document.getElementById("menu").style.top = titlebarHeight + "px";
	document.getElementById("content").style.top = titlebarHeight + "px";
	
	var currWin = chrome.app.window.current();
	if (document.body.getAttribute("data-window-type") == "main_window" && trayWebviewLoaded == true && currWin.isMaximized() == false) {
		/*
		var newBounds = currWin.outerBounds;
		newBounds.height = newWindowHeight;
		newBounds.top = newTopY;
		currWin.outerBounds.newBounds;
		*/
		currWin.outerBounds.setSize(undefined, window.outerHeight + deltaH);
		currWin.outerBounds.setPosition(undefined, window.screenY - deltaH);
	}
	
}


function hideLogStatus() {
	if (document.body.getAttribute("data-window-type") == "main_window") {
		document.getElementById("full-titlebar-loggedIn-button").style.display = "none";
		document.getElementById("full-titlebar-loggedOut-button").style.display = "none";
		document.getElementById("mini-titlebar-loggedIn-button").style.display = "none";
		document.getElementById("mini-titlebar-loggedOut-button").style.display = "none";
		
		document.getElementById("full-titlebar-text1").textContent = NameOfProgram;
		////// document.getElementById("full-titlebar-text1").textContent = NameOfProgram + " \xA0 (version " + chrome.runtime.getManifest().version + ")";
	}
}


function setToLoggedIn(user) {
	if ((document.body.getAttribute("data-window-type") == "main_window") && (trayWebviewLoaded)) {
		var statusText = NameOfProgram + " - " + user + " is signed in";
		document.getElementById("full-titlebar-text1").textContent = statusText;
		document.getElementById("full-titlebar-loggedIn-button").title = statusText;
		document.getElementById("mini-titlebar-loggedIn-button").title = statusText;
		
		document.getElementById("full-titlebar-loggedIn-button").style.display = "";
		document.getElementById("full-titlebar-loggedOut-button").style.display = "none";
		document.getElementById("mini-titlebar-loggedIn-button").style.display = "";
		document.getElementById("mini-titlebar-loggedOut-button").style.display = "none";
		
	} else {
		hideLogStatus();   // not in main-window, or Tray isn't loaded yet, so don't show any log status
	}
}


function setToLoggedOut(msg) {
	if ((document.body.getAttribute("data-window-type") == "main_window") && (trayWebviewLoaded)) {
		// must be running as Demo or expired user
		var tmpMsg = msg;
		if (msg == '') {
			tmpMsg = "Running in DEMO mode";
		}
		var statusText = NameOfProgram + " - " + tmpMsg;
		document.getElementById("full-titlebar-text1").textContent = statusText;
		document.getElementById("full-titlebar-loggedOut-button").title = statusText;
		document.getElementById("mini-titlebar-loggedOut-button").title = statusText;
		
		document.getElementById("full-titlebar-loggedOut-button").style.display = "";
		document.getElementById("full-titlebar-loggedIn-button").style.display = "none";
		document.getElementById("mini-titlebar-loggedOut-button").style.display = "";
		document.getElementById("mini-titlebar-loggedIn-button").style.display = "none";
	} else {
		hideLogStatus();   // not in main-window, or Tray isn't loaded yet, so don't show any log status
	}
}


function focusTitlebars(focus) {
	/*
	var bg_color = focus ? titlebarFocusColor : titlebarNotFocusColor;
	document.getElementById("full-titlebar").style.backgroundColor = bg_color;
	document.getElementById("mini-titlebar").style.backgroundColor = bg_color;
	document.getElementById("content").style.borderColor = bg_color;
	*/
	document.body.setAttribute("class", (focus ? "oatts-has-focus" : "oatts-not-focus"));
}


window.onfocus = function() {
	focusTitlebars(true);
	document.getElementById("web-page-frame").focus();   //---###//---###//---### added 6 May 2015
}


window.onblur = function() {
	focusTitlebars(false);
}


function titlebarFrameHeight() {
	var titlebarHeight = document.getElementById("full-titlebar").offsetHeight;
	if (document.getElementById("full-titlebar").style.display == "none") {
		titlebarHeight = document.getElementById("mini-titlebar").offsetHeight;
	}
	//// return convertToScreenPixels(titlebarHeight + document.getElementById("content").offsetLeft);
	return convertToScreenPixels(window.innerHeight - document.getElementById("content").offsetHeight);   //---###   TEST   TEST		
	
}


function resizeMainWindow(minDialogWindowHeight) {
	if (chrome.app.window.current().isMaximized() == true || chrome.app.window.current().isMinimized() == true) {
		return;
	}
	
	var newWindowWidth = windowSettingsObj.window_width;
	var newWindowHeight = titlebarFrameHeight() + windowSettingsObj.tray_height;
	if (popupPanelShowing == true) {
		newWindowWidth = windowSettingsObj.popup_window_width;
		newWindowHeight = newWindowHeight + windowSettingsObj.popup_height;
	}
	if ((dialogIsShowing == true || menuIsShowing == true) && minDialogWindowHeight > 0) {
		newWindowHeight = titlebarFrameHeight() + minDialogWindowHeight + 2;
	}
	
	setSizeMainWindow(windowSettingsObj.screen_left_x, windowSettingsObj.screen_bottom_y, newWindowWidth, newWindowHeight);
}


function setSizeMainWindow(leftX, bottomY, newWindowWidth, newWindowHeight) {
	var currWin = chrome.app.window.current();
	if (currWin.isMaximized() == true || currWin.isMinimized() == true) {
		return;
	}
	
	var newMinHeight = titlebarFrameHeight() + Math.round(Math.max(27, 15 * frame2WebviewPixelRatio));
	if (popupPanelShowing == true || trayWebviewLoaded == false) {
		newMinHeight = titlebarFrameHeight() + 250;
	}
	
	newMinHeight = Math.min(newMinHeight, Math.round(0.95 * screen.availHeight));
	if (newMinHeight > newWindowHeight) {
		newWindowHeight = newMinHeight;
	}
	
	if (newMinHeight < currWin.outerBounds.minHeight) {
		currWin.outerBounds.setMinimumSize(undefined, newMinHeight);
	}
	
	newWindowHeight = Math.min(newWindowHeight, window.screen.availHeight);
	newWindowWidth = Math.min(newWindowWidth, window.screen.availWidth);
	if ((dialogIsShowing == false && menuIsShowing == false) || window.outerHeight < newWindowHeight || window.outerWidth < newWindowWidth) {
		var newWindowTop = Math.max(Math.min(bottomY, window.screen.availTop + window.screen.availHeight) - newWindowHeight, window.screen.availTop);
		var newWindowLeft = Math.max(Math.min(leftX, window.screen.availLeft + window.screen.availWidth - newWindowWidth), window.screen.availLeft);
		currWin.outerBounds.setSize(newWindowWidth, newWindowHeight);
		currWin.outerBounds.setPosition(newWindowLeft, newWindowTop);
	}
	
	if (newMinHeight != currWin.outerBounds.minHeight) {
		currWin.outerBounds.setMinimumSize(undefined, newMinHeight);
	}
}


function processBoundsChanged(isAndWasNormalWindow) {
	if (chrome.app.window.current().isMinimized() == false) {
		saveMainWindowSettings(isAndWasNormalWindow);
		sendWindowHeightInfoToWebview();
	}
}


function saveMainWindowSettings(isAndWasNormalWindow) {
	if (mainWebviewLoaded == true && dialogIsShowing == false && menuIsShowing == false) {
		if (isAndWasNormalWindow) {
			if (trayWebviewLoaded) {
				var webviewHeight = Math.round(document.getElementById("web-page-frame").offsetHeight * frame2WebviewPixelRatio);
				
				if (popupPanelShowing == true) {
					var newPopupHeight = webviewHeight - windowSettingsObj.tray_height;
					if (newPopupHeight >= 50) {
						windowSettingsObj.popup_height = newPopupHeight;
					}
					windowSettingsObj.popup_window_width = Math.max(window.outerWidth, windowSettingsObj.window_width);
				} else {
					////// windowSettingsObj.tray_height = webviewHeight;   //---###//---###//---###   DISABLED TEST   TEST   TEST
					windowSettingsObj.window_width = window.outerWidth;
					windowSettingsObj.screen_left_x = window.screenX;
					windowSettingsObj.screen_bottom_y = window.screenY + window.outerHeight;
					windowSettingsObj.popup_window_width = Math.max(window.outerWidth, windowSettingsObj.popup_window_width);
				}
			}
			saveWindowSettings();
		} else if (chrome.app.window.current().isMinimized() == false) {
			saveWindowSettings();
		}
	}
}


function saveWindowSettings() {
	chrome.storage.local.set({ window_settings: windowSettingsObj });
	sendSettingsToWebview({ window_settings: windowSettingsObj });
}


function saveUserSettings() {
	chrome.storage.local.set({ user_settings: userSettingsObj });
}


function sendWindowHeightInfoToWebview() {
	sendSettingsToWebview({
		window_height_info: {
			tray_height: windowSettingsObj.tray_height,
			show_empty_popup: (chrome.app.window.current().isMaximized() || dialogIsShowing == true || menuIsShowing == true)
		}
	});
}


function sendSettingsToWebview(newSettings) {
	var webviewNode = document.getElementById("web-page-frame");
	if (webviewNode != null) {
		webviewNode.contentWindow.postMessage(newSettings, '*');
	}
}


document.addEventListener('DOMContentLoaded', function() {
	mainWebviewLoaded = false;
	trayWebviewLoaded = false;
	
	var query = NameOfProgram;
	var windowType = document.body.getAttribute("data-window-type");
	
	//---###//---###//---###//---###//---###//---###//---###//---###
	console.log("Manifest version & window_type: " + chrome.runtime.getManifest().version + "  " + windowType);   //////
	//---###//---###//---###//---###//---###//---###//---###//---###
	
	if (windowType == "provider_window" || windowType == "icon_picker_window") {
		var windowId = chrome.app.window.current().id;
		var _Offset = windowId.indexOf("_");
		if (_Offset >= 0) {
			//---### query = decodeURI(windowId.substring(_Offset + 1));
			query = windowId.substring(_Offset + 1);
		}
		
		//---###//---###
		if (windowType == "icon_picker_window") {
			query = query + "?v=" + Math.random();
		}
		//---###//---###
		
		document.getElementById("web-page-frame").src = query;
	}
	var windowTitle = query;
	if (windowType == "icon_picker_window") {
		windowTitle = "Bookmark Icon Picker";
	}
	
	addTitlebar("mini-titlebar", null);
	addTitlebar("full-titlebar", windowTitle);
	document.getElementById("mini-titlebar").style.display = "none";
	
	updateTitleBars();
	setToNotOnTop(true);
	setToLoggedOut('');
	document.getElementById("full-titlebar-not-on-top-button").blur();
	
	if (windowType == "main_window") {   // running in the main window.
		var webviewNode = document.getElementById("web-page-frame");
		
// /* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		// Add a message listener for launch of provider windows - listen for 'newwindow' event
		webviewNode.addEventListener('newwindow', function(e) {
			
			//---###//---###
			// var newUrl = "provider_window.html?ilink=" + e.targetUrl;
			// chrome.app.window.create(newUrl, {
			// 	id: "templateWinID" + Math.random(),
			// 	frame: "none",
			// 	alwaysOnTop: false,
			// 	outerBounds: { width: 800, height: 600, minWidth: 300, minHeight: 100 }
			// });
			//---###//---###
			chrome.app.window.create("provider_window.html", {
				id: "templateWinID" + Math.random() + "_" + encodeURI(e.targetUrl),
				frame: "none",
				alwaysOnTop: false,
				outerBounds: { width: 800, height: 600, minWidth: 300, minHeight: 100 }
			});
			// ---###//---###
			
		});
		
		// Add a message listener function that receives and processes messages from all webviews in the app.
		chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
			if ("inner_dpr" in message) {
				if (frame2WebviewPixelRatio != window.devicePixelRatio / message.inner_dpr) {
				
					var newWindowHeight = window.outerHeight + Math.round(titlebarFrameHeight() * (window.devicePixelRatio / message.inner_dpr - frame2WebviewPixelRatio));   //---###//---###//---###//---###//---###//---###
					
					frame2WebviewPixelRatio = window.devicePixelRatio / message.inner_dpr;
					
					setSizeMainWindow(window.screenX, window.screenY + window.outerHeight, window.outerWidth, newWindowHeight);   //---###//---###//---###//---###//---###//---###
					sendWindowHeightInfoToWebview();
					
					//---###//---###//---###//---###//---###//---###//---###//---###
					////// console.log("inner_dpr & frame2WebviewPixelRatio: " + message.inner_dpr + " & " + frame2WebviewPixelRatio);
					//---###//---###//---###//---###//---###//---###//---###//---###
					
				}
			}
			
			if ("tray_height" in message && "popup_panel_showing" in message) {
				windowSettingsObj.tray_height = message.tray_height;
				var popupPanelWasShowing = popupPanelShowing;
				popupPanelShowing = message.popup_panel_showing;
				var isNormalWindow = (chrome.app.window.current().isMaximized() == false && chrome.app.window.current().isMinimized() == false);
				if (popupPanelShowing != popupPanelWasShowing) {
					updateTitleBars();
					if (isNormalWindow) { 
						resizeMainWindow(0);
					}
				}
				saveMainWindowSettings(isNormalWindow);
			}
			
			if ("min_dialog_window_height" in message) {
				var minDialogWindowHeight = message.min_dialog_window_height;
				dialogIsShowing = (minDialogWindowHeight > 0);
				updateTitleBars();
				resizeMainWindow(minDialogWindowHeight);
				
				//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
				////// sendResponse({ response: "done" });   //---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
				//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
				
			}
			
			if ("user_settings" in message) {
				var prevUserSettingsObj = userSettingsObj
				userSettingsObj = message.user_settings;
				saveUserSettings();
				updateThinTitlebarMenuCheck();
				updateTitlebarVisibility();
			}
			
			if ("open_icon_picker" in message) {
				chrome.app.window.create("icon_picker_window.html", {
					//---### id: "templateWinID" + Math.random() + "_" + encodeURI(message.open_icon_picker),
					id: "iconPickerID" + "_" + encodeURI(message.open_icon_picker),
					frame: "none",
					alwaysOnTop: false,
					outerBounds: { width: 600, height: 600, minWidth: 300, minHeight: 300 }
				});
			}
			
			if ("widget_zoom_bigger" in message) {
				sendSettingsToWebview({ widget_zoom_bigger: message.widget_zoom_bigger });
			}
			
			if ("widget_zoom_smaller" in message) {
				sendSettingsToWebview({ widget_zoom_smaller: message.widget_zoom_smaller });
			}
			
			if ("widget_zoom_default" in message) {
				sendSettingsToWebview({ widget_zoom_default: message.widget_zoom_default });
			}
			
			if ("signin_zoom_setting" in message) {
				windowSettingsObj.signin_zoom_setting = message.signin_zoom_setting;
				saveWindowSettings();
			}
			
			if ("new_bookmark_icon" in message) {
				sendSettingsToWebview({ new_bookmark_icon: message.new_bookmark_icon });
			}
			
			if ("request_focus" in message) {
				if (message.request_focus == true && document.activeElement != document.getElementById("web-page-frame")) {
					document.getElementById("web-page-frame").focus();
				}
			}
			
			// keep status updated on titlebar
			if ("login_state" in message) {
				if (message.login_state == "loggedIn") {
					setToLoggedIn(message.username);
				} else {
					setToLoggedOut(message.username);
				}
			}
			
			// request to quit. Check HOW user requested to quit.
			if ("close_program" in message) {
				if (message.close_program == "loggedIn") {
					// quit without logging out (stay logged in)
					terminateProgram();
				} else if (message.close_program == "loggedOut") {
					// log out, then quit
					logOut();
					terminateProgram();
				}
			}
			
			// user confirmed they want to logout
			if ("logout_program" in message) {
				logOut();
			}
			
			//user confirmed they want to login
			if ("login_program" in message) {
				logIn();
			}

		});
		
		// Add an event listener that runs once when the webview finishes loading in the main window.
		// It sets the initial size and position of the window to the saved settings,
		// and establishes two-way communication with the webview.
		webviewNode.addEventListener("loadstop", function(event) {
			mainWebviewLoaded = false;
			trayWebviewLoaded = false;
			popupPanelShowing = false;
			dialogIsShowing = false;
			menuIsShowing = false;
			
			//---###//---###//---###//---###//---###//---###//---###//---###
			////// console.log("'loadstop' EventListener triggered with " + event + " at " + (new Date()).getTime());
			//---###//---###//---###//---###//---###//---###//---###//---###
			
			// Load saved window and pane parameters from chrome storage
			// NOTE: chrome.storage.local.get() runs asynchronously
			chrome.storage.local.get(null, function(localData) {
				if ("window_settings" in localData) {
					windowSettingsObj = localData.window_settings;
				}
				if ("user_settings" in localData) {
					userSettingsObj = localData.user_settings;
				}
				
				// Test for tray/picker page vs login/out page by checking for the existence of element "tray-container",
				// and get the initial value of the webview's window.devicePixelRatio to set frame2WebviewPixelRatio
				// NOTE: webview.executeScript() also runs asynchronously
				var codeToRun = "tmp = { tray_loaded: (document.getElementById('tray-container') != null), inner_dpr: window.devicePixelRatio }"
				document.getElementById("web-page-frame").executeScript({ code: codeToRun }, function(runResult) {
					updateTitlebarVisibility();
					trayWebviewLoaded = (runResult[0].tray_loaded == true);   // test for tray/picker page vs login page
					frame2WebviewPixelRatio = window.devicePixelRatio / runResult[0].inner_dpr;
					
					var currWin = chrome.app.window.current();
					if (currWin.isMaximized() == false) {
						if (trayWebviewLoaded == true) {
							setSizeMainWindow(windowSettingsObj.screen_left_x, windowSettingsObj.screen_bottom_y,
								windowSettingsObj.window_width, titlebarFrameHeight() + windowSettingsObj.tray_height);
						} else {
							var windowScale = 0.35 + windowSettingsObj.signin_zoom_setting / 300;
							setSizeMainWindow(windowSettingsObj.screen_left_x, windowSettingsObj.screen_bottom_y, Math.round(loginStartWidth * windowScale), Math.round(loginStartHeight * windowScale));
						}
						
						if (windowSettingsObj.is_maximized == true) {
							currWin.maximize();
						}
					}
					
					updateThinTitlebarMenuCheck();
					updateTitleBars();
					
					var versionInfo = { version_name: chrome.runtime.getManifest().name, version_num: chrome.runtime.getManifest().version };
					sendSettingsToWebview({ app_id: chrome.runtime.id, version_info: versionInfo, window_settings: windowSettingsObj, login_status: false });
					////// sendSettingsToWebview({ user_settings: userSettingsObj });
					sendSettingsToWebview({ guest_mode_override: (chrome.runtime.getManifest().name.indexOf("{MakesGuests}") >= 0), user_settings: userSettingsObj });
					
					sendWindowHeightInfoToWebview();
					if (trayWebviewLoaded == false) {
						sendSettingsToWebview({ signin_zoom_setting: windowSettingsObj.signin_zoom_setting });
					}
					
					// Add onBoundsChanged event listener here, after all window and page loading and configuring has been competed.
					chrome.app.window.current().onBoundsChanged.addListener(function() {
						var wasMinimized = isMinimized;
						isMinimized = chrome.app.window.current().isMinimized();   // isMinimized is global variable used *only* in this event listener
						var wasMaximized = windowSettingsObj.is_maximized;
						var isMaximized = chrome.app.window.current().isMaximized();
						windowSettingsObj.is_maximized = isMaximized;
						var isAndWasNormalWindow = (wasMaximized == false && isMaximized == false && wasMinimized == false && isMinimized == false);
						processBoundsChanged(isAndWasNormalWindow);
						
						if (isAndWasNormalWindow) {
							// The onBoundsChanged event listener doesn't seem to get triggered a last time *after* the resizing has finished.
							// This causes the Widget Tray position to get out of whack if the app window is resized rapidly (in the vertical direction).
							// The following timer-delay code is meant to insure that the onBoundsChanged processing code
							// will be executed a final time after the window bounds have finished changing,
							// even though the onBoundsChanged listener is *not* (re)triggered at that time.
							if (onBoundsChangedTimer != null) {
								clearTimeout(onBoundsChangedTimer);
								onBoundsChangedTimer = null;
							}
							onBoundsChangedTimer = setTimeout(function() {
								processBoundsChanged(chrome.app.window.current().isMaximized() == false && chrome.app.window.current().isMinimized() == false);
							}, 100);
						} else {
							if (wasMaximized == false && isMaximized == true) {
								setToNotOnTop(true);
							}
							updateTitleBars();
							
							////// if (wasMaximized == true && isMaximized == false && isMinimized == false) {
							if (wasMaximized == true && isMaximized == false && isMinimized == false &&  trayWebviewLoaded == true) { //---###//---###//---###
							
								resizeMainWindow(0);
							}
						}
						
					});   // end of chrome.app.window.current().onBoundsChanged.addListener(function() { ...
					
					mainWebviewLoaded = (windowType == "main_window");
					addMenuItems("menulist");
					
				});   // end of document.getElementById("web-page-frame").executeScript({ ... }, function( ... ) { ...
				
			});   // end of chrome.storage.local.get(null, function( ... ) { ...
			
			document.getElementById("web-page-frame").blur();
			document.getElementById("web-page-frame").focus();
			
		});   // end of webviewNode.addEventListener("loadstop", function( ... ) { ...
		
		// Set webview source to load main page now that all the listeners are setup and things initialized
		webviewNode.src = MAIN_URL;   //##JOE
		//---### webviewNode.src = MAIN_PATH + "test.html"  //---###//---###//---###//---###   TEMP TEST !!!!   //---###//---###//---###//---###
		
// */ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	//---### } else if (windowType == "provider_window") {   // running in the provider window.
	} else if (windowType == "provider_window" || windowType == "icon_picker_window") {
		
		if (windowType == "icon_picker_window") {
			// Running in the icon picker window, so establish two-way communication
			// between the icon picker window webview and the main window instance of titlebar.
			
			// Add a message listener function that receives and processes messages from all webviews in the app.
			chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
				if ("close_icon_picker" in message) {
					if (message.close_icon_picker == true) {
						window.close();
					}
				}
				if ("user_settings" in message) {
					var userSettingsObj = message.user_settings;
					if ("widgets_zoom_setting" in userSettingsObj) {
						sendSettingsToWebview({ widgets_zoom_setting: userSettingsObj.widgets_zoom_setting });
					}
				}
			});
			
			document.getElementById("web-page-frame").addEventListener("loadstop", function(event) {
				chrome.storage.local.get(null, function(localData) {
					var iconPickerZoom = 100;
					if ("user_settings" in localData) {
						
						////// var userSettingsObj = localData.user_settings;
						userSettingsObj = localData.user_settings;    //---###//---###//---###
						
						if ("widgets_zoom_setting" in userSettingsObj) {
							iconPickerZoom = userSettingsObj.widgets_zoom_setting;
						}
						updateThinTitlebarMenuCheck();
						updateTitlebarVisibility();
					}
					sendSettingsToWebview({ app_id: chrome.runtime.id, user_settings: userSettingsObj, widgets_zoom_setting: iconPickerZoom });
					
					//---###//---###//---###//---###
					if (document.getElementById("loading-background") != null) {
						document.getElementById("loading-background").style.display = "none"
					}
					//---###//---###//---###//---###
					
					document.getElementById("web-page-frame").blur();
					document.getElementById("web-page-frame").focus();
				});
			});
		}
		
		// Add onBoundsChanged event listener for provider window or icon picker window.
		chrome.app.window.current().onBoundsChanged.addListener(function() {
			if (chrome.app.window.current().isMaximized()) {
				setToNotOnTop(true);
			}
			updateTitleBars();
		});
		
		// Add menu for provider window or icon picker window
		addMenuItems("menulist");
		
	}   // end of if (windowType == "main_window")
	
});   // end of document.addEventListener('DOMContentLoaded', function() { ...
