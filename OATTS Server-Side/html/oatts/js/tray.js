////// debugger;

var pendingAjaxCall = false;
var heartBeatID;
var minTrayHeight = 27;
var thisAppId = "<<##NotYetSet##>>";
var versionInfo = null;
var webviewHeight = minTrayHeight;
var webviewWidth = 0;

var prevWidgetName = "";
var tooltipsLoaded = false;


//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
var testDemoMode = (loggedInUser == "Test123");   //---###//---###//---###//---### test hack - may be temporary
//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###


////// var textZoomSettingsArray = [ 65, 80, 100, 125, 160, 200, 250, 320, 400 ];   // text panels zoom settings, in percents
var textZoomSettingsArray = [ 65, 80, 100, 125, 160, 200, 250, 300 ];   // text panels zoom settings, in percents

var widgetZoomSettingsArray = [ 25, 32, 40, 50, 65, 80, 100, 125, 160, 200 ];   // widget panels zoom settings, in percents
var defaultZoomSetting = 100;   // default & initial zoom setting, in percent

var userSettingsObj = { };
var windowSettingsObj = { };

initZoomSelectBox("text-panels-zoom", textZoomSettingsArray);
initZoomSelectBox("widget-panels-zoom", widgetZoomSettingsArray);


$('<div id="widgetgrp">\
	<div id="tray-widgets-picker" style="display: none;">\
		<div id="tray-widgets-picker-titlebar">\
			<div id="picker-titlebar-buttons">\
				<button type="button" class="zoom-glass-button" title="Zoom Smaller (Ctrl -)" onclick="zoomSmaller(true);" tabindex="0">\
					<img src="images/zoom_out.png" alt="" class="zoom-glass-icon" onmouseover="updateImage(this, \'images/zoom_out_hover.png\');" onmouseout="updateImage(this, \'images/zoom_out.png\');">\
				</button>\
				<button type="button" class="zoom-glass-button" title="Zoom Bigger (Ctrl +)" onclick="zoomBigger(true);" tabindex="0">\
					<img src="images/zoom_in.png" alt="" class="zoom-glass-icon" onmouseover="updateImage(this, \'images/zoom_in_hover.png\');" onmouseout="updateImage(this, \'images/zoom_in.png\');">\
				</button>\
				<button type="button" class="closepopupbutton" onclick="closeWidgetPicker()" title="Close Panel" tabindex="0">\
					Close<img src="images/down_arrow.png" alt="" class="closepopupbuttonicon">\
				</button>\
			</div>\
			<div id="widget-picker-title">Add or Change Tool Widgets</div>   <!-- ///---###///---### added -->   \
			<div id="picker-top-line"></div>\
			<div id="picker-top-line-bottom"></div>\
		</div>\
		<div id="tray-widgets-window" style="display: block;">\
			<div id="tray-widgets-window-container"></div>\
		</div>\
	</div>\
	<div id="tray-container" style="top: 0px;">\
		<div id="tray-divider" class="ui-resizable-handle ui-resizable-n"></div>\
		<div id="tray-widgets-container"></div>\
	</div>\
	</div>').appendTo(document.body);


function updateImage(imageNode, imageUrl) {
	imageNode.src = imageUrl;
}


//========================================//
//========================================//
function showBookmarkOnTray(w) {
	if (!("icon" in w)) {
		w.icon = widgetsPath + w.folder + "/trayicon.png";
	}
	//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	////// <button class="remove-btn add-remove-btn" title="Edit Bookmark" tabindex="0">Edit</button>\
	//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	$('<div class="tray-widget" name="' + w.id + '" bookmark="true" folder="' + w.folder + '">\
	<div class="remove-btn-container"><button class="remove-btn add-remove-btn" title="Edit Bookmark" tabindex="0">Edit</button></div>\
	<a href="' + w.url + '" target="_blank" title="' + w.name + '" class="tray-widget-link" tabindex="0">\
	<img src="' + w.icon + '" alt="" class="tray-bookmark-icon"/>\
	<img src="images/to_tray.png" alt="" class="tray-shortcut-icon"/>\
	<div class="tray-widget-bookmark">' + w.name + '</div></a>\
	</div>').appendTo('#tray-widgets-container');
}


//========================================//
//========================================//

function saveTrayDataWriteNow() {
	save_widgets();
	sendDataToServer();
}


function saveSettingsDataWriteNow() {
	settingsDirty = true;
	sendDataToServer();
}


function sendDirtyDataToServer() {
	if (favoritesDirty || trayDirty || settingsDirty) {
		sendDataToServer();
	}
}


function sendDataToServer() {
	if (pendingAjaxCall) {
		//wait for it
		return;
	}
	
	//clear any heartbeat trigger(if one) - for manual requests to save data - we'll reset if after this request
	clearTimeout(heartBeatID);
	
	var retrigger = true;
	var dsURL;
	var favVar = "NONE";
	var trayVar = "NONE";
	var settingsVar = "NONE";
	
	////// if (favoritesDirty || trayDirty || settingsDirty) {
	if ((favoritesDirty || trayDirty || settingsDirty) && testDemoMode == false) {   //---###//---###//---###//---###
		// going to save data
		dsURL = baseURL+"/includes/datasave.php";
		
		if (favoritesDirty) {
			favVar = JSON.stringify(providersData.favorites);
			//---### favVar = ((window.btoa(favVar)).replace(/=/g, "_")).replace(/\//g, "!");   //---### encode data to avoid tripping server-side ModSecurity
			favVar = window.btoa(favVar);   //---### encode data to avoid tripping server-side ModSecurity
			favoritesDirty = false;
		}
		if (trayDirty) {
			trayVar = JSON.stringify(widgetsData.tray);
			//---### trayVar = ((window.btoa(trayVar)).replace(/=/g, "_")).replace(/\//g, "!");   //---### encode data to avoid tripping server-side ModSecurity
			trayVar = window.btoa(trayVar);   //---### encode data to avoid tripping server-side ModSecurity
			trayDirty = false;
		}
		if (settingsDirty) {
			settingsVar = JSON.stringify({ user_settings: userSettingsObj, window_settings: windowSettingsObj });
			//---### settingsVar = ((window.btoa(settingsVar)).replace(/=/g, "_")).replace(/\//g, "!");   //---### encode data to avoid tripping server-side ModSecurity
			settingsVar = window.btoa(settingsVar);   //---### encode data to avoid tripping server-side ModSecurity
			settingsDirty = false;
		}
	} else {
		//just do heartbeat
		dsURL = baseURL+"/includes/heartbeat.php";
	}
	
	pendingAjaxCall = true;
	$.ajax({
		url:  dsURL,
		type: "POST",
		data: {'favorites': favVar, 'tray': trayVar, 'settings': settingsVar, 'hash': widgetsData.hash},
		dataType: "text",
		success: function (data) {
			try {
				var i = $.parseJSON(data);
				if (i.error == '0') {
					if (i.reason == 'Logged In') {
						loggedInFlag = true;
						loggedInUser = i.user;
						sendLoginState("loggedIn", i.user);
					} else if (i.reason == 'Not Logged In') {
						if (loggedInFlag == true) {
							//transition to logout - send alert
							sessionClosedDialog();
							sendLoginState("loggedOut", loggedInUser + " Offline");
						} else {
							sendLoginState("loggedOut", "");
						}
						loggedInFlag = false;
						retrigger = false;
					}
				} else if ("message" in i) {
					errorAlertDialog(i.message + "<br><br><b>Your changes have <i>NOT</i> been saved.</b>", "Data Save Error");
				}
			} catch (e) {
				//alert("Error: " + data);
				//console.log("Error: " + e);
				//console.log("Data=: " + data);
			}
			//if (retrigger) {
			//	setTimeout('heartbeat()', HEART_BEAT_RATE);
			//}
		},
		error: function (jqXHR, textStatus, errorThrown){
			var i = textStatus;
			//console.log(textStatus);
			//console.log("not success");
		},
		complete: function (jqXHR, textStatus){
			var i = textStatus;
			//console.log(textStatus);
			pendingAjaxCall = false;
			if (retrigger) {
				//see if we need to updata data
				if (favoritesDirty || trayDirty || settingsDirty) {
					heartBeatID = setTimeout('heartbeat()', 100);
				} else {
					heartBeatID = setTimeout('heartbeat()', HEART_BEAT_RATE);
				}
			}
		}
	});
}


//========================================//
//========================================//
function save_widgets() {
		//debugger;
		var tray = [];
		$('.tray-widget[name]').each(function() {
			if ($(this).attr('bookmark') != null) {
				//---### tray.push({"type" : "bookmark", "id": $(this).attr('name'), "folder": $(this).attr('folder'), "name": $(this).children('a').last().attr('name'), "url": $(this).children('a').last().attr('href')});
				var linkNode = $(this).children('a').last();   //---###
				tray.push({"type" : "bookmark", "id": $(this).attr('name'), "folder": $(this).attr('folder'), "name": $(linkNode).children('div').last().text(), "url": $(linkNode).attr('href'), "icon": $(linkNode).children('img').first().attr('src')});   //---###
			} else {
				tray.push({"type" : "widget", "id": $(this).attr('name')});
			}
		});
		widgetsData.tray = tray;
		trayDirty = true;
		
		/*
		$.ajax({
			url: baseURL+"/includes/datasave.php",
			type: "POST",
			data: {'traydata': JSON.stringify(tray), 'hash': widgetsData.hash},
			dataType: "text",
				success: function (data) {
					var i = $.parseJSON(data);
					if (i.error == 0) {
						if (i.reason == 'not logged in') {
							if (loggedInFlag) {
								//transition to logout - send alert
								sessionClosedDialog();
							}
							loggedInFlag = false;
							sendLoginState("loggedOut","");
						} else {
							sendLoginState("loggedOut","");
							loggedInFlag = false;
						}
					}
				}
		});
		*/

}


//********************************************************//
//check login status periodically.  Also look for updated data **future**
//write data
function heartbeat() {
	sendDataToServer();
}


/*
	var retrigger = true;
	//see if we should call heartbeat or save data
	if (favoritesDirty || trayDirty || settingsDirty) {
		sendDataToServer();
	} else {
		//normal heartbeat
	
		$.ajax({
			url: baseURL+"/includes/heartbeat.php",
			type: "POST",
			data: {'stuff': 'testing'},
			dataType: "text",
			success: function (data) {
				try {
					var i = $.parseJSON(data);
					if (i.status == '0') {
						if (i.reason == 'Logged In') {
							loggedInFlag = true;
							loggedInUser = i.user;
							sendLoginState("loggedIn", i.user);
						} else if (i.reason == 'Not Logged In') {
							if (loggedInFlag) {
								//transition to logout - send alert
								sessionClosedDialog();
								sendLoginState("loggedOut",loggedInUser + " Offline");
							} else {
								sendLoginState("loggedOut","");
							}
							loggedInFlag = false;
							retrigger = false;
						} //else do nothing
					}
				} catch (e) {
					//alert("Error: " + data);
					console.log("Error: " + e);
					console.log("Data=: " + data);
				}
				if (retrigger) {
					setTimeout('heartbeat()', HEART_BEAT_RATE);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				var i = textStatus;
				console.log(textStatus);
				console.log("not success");
			},
			complete: function (jqXHR, textStatus) {
				var i = textStatus;
				console.log(textStatus);
				console.log("not success");
			}
		});
	}
}
*/


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


function destroyTooltips() {
	if (tooltipsLoaded == true) {
		$( document.body ).tooltip( "destroy" );
	}
	tooltipsLoaded = false;
}


// jQuery ready function
// Private jQuery functions
$(function() {
	
	//========================================//
	//========================================//
	// Tooltip handlers
	initTooltips();
	
	var tooltipTargets = "a, :button, .oatts-setting-line";
	
	////// $( document.body ).on( "focusin", "a, :button, #zoomFontSize > span, .oatts-setting-line", function() {
	$( document.body ).on( "focusin", tooltipTargets, function() {
		if ($( ".ui-tooltip" ).length > 0) {
			clearTooltips();
		}
	////// }).on( "mouseenter", "a, :button, #zoomFontSize > span, .oatts-setting-line", function() {
	}).on( "mouseenter", tooltipTargets, function() {
		if ($( ".ui-tooltip" ).length > 0) {
			clearTooltips();
		}
	////// }).on( "mousemove", "a, :button, #zoomFontSize > span, .oatts-setting-line", function() {
	}).on( "mousemove", tooltipTargets, function() {
		if (tooltipsLoaded == true) {
			var titleVal = $( this ).attr( "title" );
			if (titleVal != undefined && titleVal != "") {
				////// console.log("restart tooltip: " + titleVal);
				$( this ).trigger( "mouseenter" );
			}
		}
	});
	
	
	//========================================//
	//========================================//
	// Widget tray resizing handlers
	$( "#tray-container" ).resizable({ handles: { "n": "#tray-divider"}});
	
	$( "#tray-container" ).on( "resizestart", function( event, ui ) {
		$( "#tray-container" ).resizable( "option", "minHeight", minTrayHeight );
		$( "#tray-container" ).resizable( "option", "maxHeight", maxAllowedTrayHeight() );
	});
	
	$( "#tray-container" ).on( "resize", function( event, ui ) {
		updatePopupBottom();
		sendHeightInfo();
	});
	
	$( "#tray-container" ).on( "resizestop", function( event, ui ) {
		updatePopupBottom();
		sendHeightInfo();
	});
	
	
	
	//========================================//
	//========================================//
	// Event handlers for mousewheel and keydown
	// Used for adjusting zoom settings (with the ctrl key down)
	$( "#widgetgrp" ).on( "mousewheel", function( event ) {
		return zoomMousewheel( event, true );
	});
	
	
	$( "#iframe-container" ).on( "mousewheel", function( event ) {
		return zoomMousewheel( event, false );
	});
	
	
	function zoomMousewheel(event, widgetsZoomFlag) {
		if (event.ctrlKey == false) {
			return true;
		}
		var zoomDelta = Math.max(-1, Math.min(1, event.originalEvent.wheelDelta));
		if (zoomDelta > 0) {
			zoomBigger(widgetsZoomFlag);
		} else if (zoomDelta < 0) {
			zoomSmaller(widgetsZoomFlag);
		}
		event.preventDefault();
		return false;
	}
	
	
	$( document.body ).keydown( function(event) {
		if (event.ctrlKey == false) {
			return true;
		}
		if ($( ".ui-widget-overlay" ).length > 0) {
			return true;
		}
		var widgetsZoomFlag = (document.getElementById("iframe-container").style.display == "none");
		if (event.which == 107 || event.which == 187) {   // "plus" key(s)
			zoomBigger(widgetsZoomFlag);
		} else if (event.which == 109 || event.which == 189) {   // "minus" key(s)
			zoomSmaller(widgetsZoomFlag);
		} else if (event.which == 48) {   // "0" key
			zoomDefault(widgetsZoomFlag);
		} else {
			return true;
		}
		event.preventDefault();
		return false;
	});
	
	
	//========================================//
	//========================================//
	// Event handlers for Settings page changes
	$('#thin-titlebar-btn').on('change', function() {
		userSettingsObj.thin_titlebar = (this.checked == true);
		updateSettingsPageTooltips();
		sendUserSettings();
	});
	
	
	$('#show-widget-names-btn').on('change', function() {
		userSettingsObj.show_widget_names = (this.checked == true);
		updateWidgetNameVisibility(userSettingsObj.show_widget_names);
		updateSettingsPageTooltips();
		sendUserSettings();
	});
	
	
	$('#show-tooltips-btn').on('change', function() {
		userSettingsObj.show_tooltips = (this.checked == true);
		updateTooltipVisibility(userSettingsObj.show_tooltips);
		updateSettingsPageTooltips();
		sendUserSettings();
	});
	
	
	$('#text-panels-zoom').on('change', function() {
		updateZoomSetting(this.value, false);
	});
	
	
	$('#widget-panels-zoom').on('change', function() {
		updateZoomSetting(this.value, true);
	});
	
	
	//========================================//
	//========================================//
	//show initial widgets and bookmarks on tray
	if (widgetsData.tray.length == 0) {
		showWidgetOnTray(widgetsData.widgets.tool_changer);
	} else {
		for (var i = 0; i < widgetsData.tray.length; i++) {
			if (widgetsData.tray[i].id == '') continue;

			if (widgetsData.tray[i].type == "bookmark") {
				showBookmarkOnTray(widgetsData.tray[i]);
			} else {
				showWidgetOnTray(widgetsData.widgets[widgetsData.tray[i].id]);
			}
		}
	}
	
	
	//========================================//
	//========================================//
	// show all widgets in widgets window
	var w;
	var href;
	var widgetHtml;
	var aboutWidgetHtml = null;
	for (var i in widgetsData.widgets) {
		w = widgetsData.widgets[i];
		href = (w.link != "" && w.id != "oatts_settings" && w.id != "about_oatts") ? ('href="' + w.link + '" target="_blank" ') : ('href="javascript:;"');
		widgetHtml = '<div class="tray-window-widget" name="'+w.id+'" folder="'+w.folder+'">\
						<div class="widget-add-button-container"><button class="widget-add-button add-remove-btn" title="Move Widget down to Tray">Move to Tray</button></div>\
						<a '+href+'title="'+w.name+'" class="tray-window-widget-link"><img src="'+widgetsPath+w.folder+'/trayicon.png" alt="" class="widget-picker-icon"/><div class="widget-name">'+w.name+'</div></a>\
						</div>';
		if (w.id == "about_oatts") {
			aboutWidgetHtml = widgetHtml;   // add "About OATTS" widget *last*
		} else if (w.id == "oatts_settings") {
			// add "OATTS Settings" widget *first*
			$( widgetHtml ).prependTo('#tray-widgets-window-container');
		} else {
			$( widgetHtml ).appendTo('#tray-widgets-window-container');
		}
	}
	// add "About OATTS" widget *last*
	if (aboutWidgetHtml != null) {
		$( aboutWidgetHtml ).appendTo('#tray-widgets-window-container');
	}
	
	//???
	//---### $('<div style="clear:both; height:0; font-size:0;"></div>').appendTo('#tray-widgets-window-container');   //---### ???
	
	// make sure visibility synched
	sync_widgets_and_tray();
	
	
	//========================================//
	//========================================//
	// show/hide "add widget to tray" buttons in widget picker
	////// $('.tray-window-widget a').on('mouseenter', function() {
	$('.tray-window-widget > *').on('mouseenter', function() {
		$(this).parent().find('.widget-add-button').addClass('showflag');
		////// $(this).parent().find('.widget-add-button').css("display", "block");
	});
	
	/* //---###//---###//---###//---###
	$('.tray-window-widget').on('mouseleave', function() {
		var focusNode = document.activeElement;
		if (this.firstChild != focusNode && this.lastChild != focusNode) {
			$(this).find('.widget-add-button').removeClass('showflag');
		}
	});
	*/ //---###//---###//---###//---###
	$('.tray-window-widget > *').on('mouseleave', function() {
		$(this).parent().find('.widget-add-button').removeClass('showflag');
		////// $(this).parent().find('.widget-add-button').css("display", "none");
	});
	
	
	$('.tray-window-widget a, .widget-add-button').on('focusin', function() {
		$(this).parent().find('.widget-add-button').addClass('showflag');
		////// $(this).parent().find('.widget-add-button').css("display", "block");
	});
	
	$('.tray-window-widget').on('focusout', function() {
		$(this).find('.widget-add-button').removeClass('showflag');
		////// $(this).parent().find('.widget-add-button').css("display", "none");
	});
	
	
	//========================================//
	//========================================//
	// add a new widget to tray
	$('.tray-window-widget .widget-add-button').on('click', function() {
		var id = $(this).parents('.tray-window-widget').attr('name');
		showWidgetOnTray(widgetsData.widgets[id]);
		// hide in widget picker
		$(this).parents('.tray-window-widget').hide();
		// update db
		save_widgets();
	});
	
	
	//========================================//
	//========================================//
	// remove an item from tray
	$('#tray-widgets-container').on('click', '.tray-widget .remove-btn', function() {
		//if not a bookmark...must be a widget
		if ($(this).parents('.tray-widget').attr('bookmark') == null) {
			// restore widget in widget-picker
			var id = $(this).parents('.tray-widget').attr('name');
			$('.tray-window-widget[name='+id+']').show();
		
			// remove item from tray
			$(this).parents('.tray-widget').remove();
			// update db
			save_widgets();
		}
	});
	
	
	//========================================//
	//========================================//
	function showWidgetOnTray(w) {
		if (w == null) return;   ///---###
		
		//distinguish between provider widget and direct launcher widget ///---### and also the special "Tool Changer" widget
		//	var wname = w.wdir.replace('widgets/','').replace(/\//g,'');
		//var href = w.path.match(/\/EXE/i) ? widgetsData.baseURL+'java/launch.php?w='+wname : 'javascript:;';
		
		/*
		var isToolChanger = (w.id == "tool_changer");
		var href = (isToolChanger == true) ? ("") : ((w.link != "") ? 'href="' + w.link + '" target="_blank" '  :  'href="javascript:;"');
		*/
		
		var href = (w.link != "" && w.id != "tool_changer" && w.id != "oatts_settings" && w.id != "about_oatts") ? ('href="' + w.link + '" target="_blank" ') : ('href="javascript:;"');
		
		//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
		////// var editBtnHtml = '<button class="remove-btn add-remove-btn" title="Move Widget up out of Tray" tabindex="0">Move Up</button>';
		var editBtnHtml = '<div class="remove-btn-container"><button class="remove-btn add-remove-btn" title="Move Widget up out of Tray" tabindex="0">Move Up</button></div>';
		//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
		
		if (w.id == "tool_changer") {
			editBtnHtml = "";
		}
		
		
		$('<div class="tray-widget" name="'+w.id+'">' + editBtnHtml + '<a '+href+'title="'+w.name+'" class="tray-widget-link" tabindex="0"><img src="'+widgetsPath+w.folder+'/trayicon.png" alt="" class="tray-widget-icon"/>\
		<div class="tray-widget-name">' + w.name + '</div></a></div>').appendTo('#tray-widgets-container');   ///---###///---###
		
		
	}
	
	
	//========================================//
	//========================================//
	function sync_widgets_and_tray() {
		$('.tray-widget[name]').each(function() {
			// if not a bookmark...must be a widget
			if ($(this).attr('bookmark') == null) {
				$('.tray-window-widget[name='+ $(this).attr('name') +']').hide();
			}
		});
	}


	//========================================//
	//========================================//
	//function TRAY_INIT_LAYOUT()
	//{
	//
	//}

	
	//========================================//
	//========================================//
	//function load_js(src)
	//{
	//	var script = document.createElement('script');
	//	script.src = src;
	//	$(document.body).append(script);
	//}
	
	
	//========================================//
	//========================================//
	// set focus at mouse-down on widget in tray
	$('.tray-window-widget a').on('mousedown', function() {
		this.focus();
	});
	
	
	// set focus at mouse-down on widget in widget-picker
	$('#tray-widgets-container').on('mousedown', '.tray-widget a', function() {
		this.focus();
	});
	
	
	// click on widget in tray
	$('.tray-window-widget a').on('click', function() {
		clickedOnWidget(this);
	});
	
	
	// click on widget in widget-picker
	$('#tray-widgets-container').on('click', '.tray-widget a', function() {
		clickedOnWidget(this);
	});
	
	
	// press enter or space with focus on widget in tray
	$('.tray-window-widget a').on('keydown', function() {
		if (event.keyCode != 13 && event.keyCode != 32) {
			return true;
		}
		clickedOnWidget(this);
		return false;
	});
	
	
	// press enter or space with focus on widget in widget-picker
	$('#tray-widgets-container').on('keydown', '.tray-widget a', function() {
		if (event.keyCode != 13 && event.keyCode != 32) {
			return true;
		}
		clickedOnWidget(this);
		return false;
	});
	
	
	// process click or keyboard activation on widget in tray or widget in widget-picker
	function clickedOnWidget(item) {
		var name = $(item).parent().attr('name');
		if (name == 'tool_changer') {
			// clicked on Tool Changer
			toggleWidgetPicker();
			return;
		} else if (name == 'oatts_settings') {
			// clicked on OATTS Settings widget
			toggleSettingsPage("settingscontent");
			return;
		} else if (name == 'about_oatts') {
			// clicked on About OATTS widget
			toggleSettingsPage("aboutcontent");
			return;
		} else if ($(item).attr('href') != 'javascript:;') {
			// clicked on bookmark or direct launch
			closePopup();
			return;
		} else {
			// clicked on widget
			var widgetPickerShowing = (document.getElementById("tray-widgets-picker").style.display == "block");
			var settingsPageShowing = (document.getElementById("settingsIframe").style.display == "block");
			if (widgetPickerShowing) hideWidgetPicker();
			if (settingsPageShowing) hideSettingsPage();
			loadProviderPage(widgetsData.hash, name, widgetsData.widgets[name].folder, !widgetPickerShowing && !settingsPageShowing);
		}
	}
	
	
	//********************************************************//
	function loadProviderPage(uHash, wName, wFolder, hideableFlag) {
		if (prevWidgetName == wName) {
			// toggle off/on
			if ($('#iframe-container').is(":visible") && hideableFlag == true) {
				$('#iframe-container').css("display", "none");
			} else {
				showProviderIframe();
			}
			sendHeightInfo();
		} else {
			// get base data
			// debugger;
			loadProviderIframe(uHash, wName, wFolder, providersData);
			prevWidgetName = wName;
			showProviderIframe();
			sendHeightInfo();
			
			/*
			$.ajax({
				url: baseURL+"/includes/provider.php",
				type: "POST",
				data: {'widget': wFolder, 'hash': uHash},
				dataType: "text",
				success: function (data) {
					try {
						var i = $.parseJSON(data);
						if ((i.login != null) && (i.login == 'not logged in')) {
							if (loggedInFlag) {
								//transition to logout - send alert
								sessionClosedDialog();
							}
							loggedInFlag = false;
							sendLoginState("loggedOut","");
						}
						loadProviderIframe(uHash, wName, wFolder, data);
						prevWidgetName = wName;
						showProviderIframe();
						sendHeightInfo();
					} catch (e) {
						//alert("Error: " + data);
						console.log("Error: " + e);
						console.log("Data=: " + data);
					}
				}
			});
			*/
			
		}
	}
	
	
	//========================================//
	//========================================//
	// make tray sortable
	$('#tray-widgets-container').sortable( 
	{
		// try to prevent unwanted drags instead of clicks
		delay: 150,
		//distance: 10,
		
		// modified to only save if the widget changed position
		start: function(event, ui) {
            var startPos = ui.item.index();
            ui.item.data('start_pos', startPos);
        },
        
		deactivate: function(event, ui) {
            var startPos = ui.item.data('start_pos');
            var currentPos = ui.item.index();
            if (startPos != currentPos) {
				save_widgets();
			}
		}
	});
	
	
	//========================================//
	//========================================//
	// initialize stuff
	
	
	//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	//---###//---###//---###//---###   TEST   TEST   TEST   //---###//---###//---###
	/*
	////// $( "#tray-widgets-picker a").draggable({
	$( "#widgetgrp #tray-widgets-window a").draggable({
	
		helper: "clone",
		////// containment: $('#tray-widgets-picker').parent(),
		////// containment: $('#tray-widgets-window'),
		containment: "window",
		////// containment: $('#tray-widgets-picker'),
		////// containment: [-1000, -1000, 2000, 2000],
		connectToSortable: "#tray-widgets-container",
		opacity: 0.75,
		zindex: 999
	});
	*/
	//---###//---###//---###//---###   end   TEST   //---###//---###//---###//---###
	//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	
	
	heartBeatID = setTimeout('heartbeat()', 4000);   // initial heartbeat setting
	
	
	// Initialize user settings from the server database data (if available)
	////// if ("user_settings" in settingsData) {
	if ("user_settings" in settingsData && testDemoMode == false) {   //---###//---###//---###//---###
		userSettingsObj = settingsData.user_settings;
		if (Object.keys(windowSettingsObj).length == 0 && "window_settings" in settingsData) {
			windowSettingsObj = settingsData.window_settings;
		}
		applyUserSettings();
	}
	
});   // end of jquery ready function


function sendHeightInfo() {
	chrome.runtime.sendMessage(thisAppId, {
		popup_panel_showing: (document.getElementById("iframe-container").style.display != "none" || document.getElementById("tray-widgets-picker").style.display != "none"),
		tray_height: document.getElementById("tray-container").offsetHeight,
	});
}


// user confirmed they want to quit with this (newState) login status  
function sendCloseState(newState) {
	chrome.runtime.sendMessage(thisAppId, { close_program: newState });
}


// user confirmed they want to log out
function sendLogoutRequest() {
	chrome.runtime.sendMessage(thisAppId, { logout_program: true });
}


// user wants to log in
function sendLoginRequest() {
	chrome.runtime.sendMessage(thisAppId, { login_program: true });
}


// send login state along with user name if logged in
function sendLoginState(newState, user) {
	chrome.runtime.sendMessage(thisAppId, { login_state: newState, username: user });
}


function topLineBottom() {
	return document.getElementById("iframe-top-line-bottom").offsetTop;
}


function pickerTopLineBottom() {
	return document.getElementById("picker-top-line-bottom").offsetTop;
}


function maxAllowedTrayHeight() {
	return Math.max(minTrayHeight, webviewHeight - 110)
}


function updatePopupBottom() {
	var trayHeight = Math.min(webviewHeight, document.getElementById("tray-container").offsetHeight);
	document.getElementById("iframe-container").style.bottom = trayHeight + "px";
	document.getElementById("tray-widgets-picker").style.bottom = trayHeight + "px";
}


function closePopup() {
	if (document.getElementById("tray-widgets-picker").style.display == "block") {
		$('#iframe-container').css("display", "none");
		closeWidgetPicker();
	} else if (document.getElementById("iframe-container").style.display == "block") {
		closeIframe();
	}
}


function showProviderIframe() {
	hideSettingsPage();
	$('#providerIframe').css("display", "block");
	$('#iframe-container').css("display", "block");
	document.getElementById("providerIframe").style.top = topLineBottom() + "px";
	$('#providercontent').scrollTop(0);
}


function closeIframe() {
	$('#iframe-container').css("display", "none");
	hideSettingsPage();
	sendHeightInfo();
}


function toggleWidgetPicker() {
	if (document.getElementById("tray-widgets-picker").style.display == "none") {
		openWidgetPicker();
	} else {
		closeWidgetPicker();
	}
}


function openWidgetPicker() {
	$('#iframe-container').css("display", "none");
	hideSettingsPage();
	$('#tray-widgets-picker').css("display", "block");
	document.getElementById("tray-widgets-window").style.top = pickerTopLineBottom() + "px";
	updateWidgetButtonVisibility(true);
	sendHeightInfo();
}


function hideWidgetPicker() {
	$('#tray-widgets-picker').css("display", "none");
	updateWidgetButtonVisibility(false);
}


function closeWidgetPicker() {
	hideWidgetPicker();
	sendHeightInfo();
}


function toggleSettingsPage(contentID) {
	var iframeNode = document.getElementById("iframe-container");
	if (document.getElementById("settingsIframe").style.display == "none" || iframeNode.style.display == "none") {
		openSettingsPage(contentID);
	} else if (document.getElementById(contentID).style.display == "none") {
		$('#settingscontent').css("display", "none");
		$('#aboutcontent').css("display", "none");
		document.getElementById(contentID).style.display = "block";
		document.getElementById(contentID).scrollTop = 0;
	} else {
		closeSettingsPage();
	}
}


function openSettingsPage(contentID) {
	if (document.getElementById("tray-widgets-picker").style.display == "block") {
		hideWidgetPicker();
	}
	$('#providerIframe').css("display", "none");
	updateSettingsPage();
	$('#settingscontent').css("display", "none");
	$('#aboutcontent').css("display", "none");
	document.getElementById(contentID).style.display = "block";
	$('#settingsIframe').css("display", "block");
	$('#iframe-container').css("display", "block");
	updateSettingsPageTooltips();
	document.getElementById("settingsIframe").style.top = topLineBottom() + "px";
	document.getElementById(contentID).scrollTop = 0;+
	sendHeightInfo();
}


function hideSettingsPage() {
	$('#settingsIframe').css("display", "none");
}


function closeSettingsPage() {
	$('#iframe-container').css("display", "none");
	hideSettingsPage();
	sendHeightInfo();
}


function updateSettingsPage() {
	document.getElementById("thin-titlebar-btn").checked = (userSettingsObj.thin_titlebar == true);
	document.getElementById("show-widget-names-btn").checked = (userSettingsObj.show_widget_names == true);
	document.getElementById("show-tooltips-btn").checked = (userSettingsObj.show_tooltips == true);
	document.getElementById("text-panels-zoom").value = userSettingsObj.zoom_setting;
	document.getElementById("widget-panels-zoom").value = userSettingsObj.widgets_zoom_setting;
	
	//---###//---###//---###//---###//---###//---###
	var versionText = "";
	if (versionInfo != null) {
		versionText = "OATTS Version: " + versionInfo;
	}
	document.getElementById("version-info").textContent = versionText;
	//---###//---###//---###//---###//---###//---###
}


function updateSettingsPageTooltips() {
	if (document.getElementById("settingsIframe").style.display == "block") {
		if ($( document.body ).tooltip( "option", "disabled") == true) {
			$( document.body ).tooltip( "enable" );
		}
		destroyTooltips();
		
		document.getElementById("thin-titlebar-btn").parentNode.title = "\"Thin Titlebar\" is " + ((userSettingsObj.thin_titlebar == true) ? "checked" : "not checked");
		document.getElementById("show-widget-names-btn").parentNode.title = "\"Show Widget Names\" is " + ((userSettingsObj.show_widget_names == true) ? "checked" : "not checked");
		document.getElementById("show-tooltips-btn").parentNode.title = "\"Show Tooltips\" is " + ((userSettingsObj.show_tooltips == true) ? "checked" : "not checked");
		document.getElementById("text-panels-zoom").parentNode.title = "Zoom for Text Panels is set to " + userSettingsObj.zoom_setting + "%";
		document.getElementById("widget-panels-zoom").parentNode.title = "Zoom for Tray and Widget Panels is set to " + userSettingsObj.widgets_zoom_setting + "%";
		
		initTooltips();
		if (userSettingsObj.show_tooltips == true) {
			$( document.body ).tooltip( "enable" );
		}
	}
}


function sendUserSettings() {
	chrome.runtime.sendMessage(thisAppId, { user_settings: userSettingsObj });
	saveSettingsDataWriteNow();
}


// show/hide "remove" buttons in tray
function updateWidgetButtonVisibility(showWidgetButtons) {
	var styleElem = document.getElementById("traystyles").sheet;
	for (var i = 0; i < styleElem.cssRules.length; i++) {
		if (styleElem.cssRules[i].selectorText == ".remove-btn") {
			styleElem.cssRules[i].style.display = ((showWidgetButtons == true) ? "block" : "none");
			break;
		}
	}
}


// show/hide widget names in tray
function updateWidgetNameVisibility(showWidgetNames) {
	var styleElem = document.getElementById("traystyles").sheet;
	var newHeightText = ((showWidgetNames == true) ? "8.00em" : "5.00em");
	for (var i = 0; i < styleElem.cssRules.length; i++) {
		var theSelectorText = styleElem.cssRules[i].selectorText;
		if (theSelectorText == ".tray-widget") {
			styleElem.cssRules[i].style.height = newHeightText;
		} else if (theSelectorText == ".tray-widget-link") {
			styleElem.cssRules[i].style.maxHeight = newHeightText;
		} else if (theSelectorText == ".tray-widget-name") {
			styleElem.cssRules[i].style.display = ((showWidgetNames == true) ? "block" : "none");
		}
	}
}


function updateTooltipVisibility(showTooltips) {
	var wasDisabled = $( document.body ).tooltip( "option", "disabled");
	if (showTooltips == true && wasDisabled == true) {
		$( document.body ).tooltip( "enable" );
	} else if (showTooltips == false && wasDisabled == false) {
		$( document.body ).tooltip( "disable" );
	}
	updateTooltipZoom();
}


function zoomTextSmaller(deselectFlag) {
	zoomSmaller(false, deselectFlag);
}


function zoomSmaller(widgetsZoomFlag, deselectFlag) {
	var currentZoomSetting = userSettingsObj.zoom_setting;
	var zoomSettingsArray = textZoomSettingsArray;
	if (widgetsZoomFlag == true) {
		currentZoomSetting = userSettingsObj.widgets_zoom_setting;
		zoomSettingsArray = widgetZoomSettingsArray;
	}
	for (var i = zoomSettingsArray.length - 1; i > 0; i--) {
		if (currentZoomSetting > zoomSettingsArray[i]) {
			break;
		}
	}
	updateZoomSetting(zoomSettingsArray[i], widgetsZoomFlag, deselectFlag);
}


function zoomTextDefault(deselectFlag) {
	zoomDefault(false, deselectFlag);
}


function zoomDefault(widgetsZoomFlag, deselectFlag) {
	updateZoomSetting(defaultZoomSetting, widgetsZoomFlag, deselectFlag);
}


function zoomTextBigger(deselectFlag) {
	zoomBigger(false, deselectFlag);
}


function zoomBigger(widgetsZoomFlag, deselectFlag) {
	var currentZoomSetting = userSettingsObj.zoom_setting;
	var zoomSettingsArray = textZoomSettingsArray;
	if (widgetsZoomFlag == true) {
		currentZoomSetting = userSettingsObj.widgets_zoom_setting;
		zoomSettingsArray = widgetZoomSettingsArray;
	}
	for (var i = 0; i < zoomSettingsArray.length - 1; i++) {
		if (currentZoomSetting < zoomSettingsArray[i]) {
			break;
		}
	}
	updateZoomSetting(zoomSettingsArray[i], widgetsZoomFlag, deselectFlag);
}


function updateZoomSetting(newZoomSetting, widgetsZoomFlag, deselectFlag) {
	var zoomSettingsArray = textZoomSettingsArray;
	if (widgetsZoomFlag == true) {
		zoomSettingsArray = widgetZoomSettingsArray;
	}
	
	// If new zoom setting not in zoom settings array, force new zoom setting to nearest larger valid choice
	for (var i = 0; i < zoomSettingsArray.length - 1; i++) {
		if (newZoomSetting <= zoomSettingsArray[i]) {
			break;
		}
	}
	newZoomSetting = zoomSettingsArray[i];
	
	if (widgetsZoomFlag == true) {
		document.getElementById("widgetgrp").style.fontSize = (16 * (newZoomSetting / 100)) + "px";
		document.getElementById("tray-widgets-window").style.top = pickerTopLineBottom() + "px";
		
		document.getElementById("widget-panels-zoom").value = newZoomSetting;
		if (newZoomSetting != userSettingsObj.widgets_zoom_setting) {
			userSettingsObj.widgets_zoom_setting = newZoomSetting;
			updateSettingsPageTooltips();
			sendUserSettings();
		}
		
	} else {
		document.getElementById("iframe-container").style.fontSize = newZoomSetting + "%";
		document.getElementById("providerIframe").style.top = topLineBottom() + "px";
		document.getElementById("settingsIframe").style.top = topLineBottom() + "px";
		
		if (newZoomSetting <= zoomSettingsArray[0]) {
			$( "#zoomout" ).addClass('disabledZoomSetting');
		} else {
			$( "#zoomout" ).removeClass('disabledZoomSetting');
		}
		if (newZoomSetting >= zoomSettingsArray[zoomSettingsArray.length - 1]) {
			$( "#zoomin" ).addClass('disabledZoomSetting');
		} else {
			$( "#zoomin" ).removeClass('disabledZoomSetting');
		}
		if (newZoomSetting == defaultZoomSetting) {
			$( "#zoomdefault" ).addClass('disabledZoomSetting');
		} else {
			$( "#zoomdefault" ).removeClass('disabledZoomSetting');
		}
		
		document.getElementById("text-panels-zoom").value = newZoomSetting;
		if (newZoomSetting != userSettingsObj.zoom_setting) {
			userSettingsObj.zoom_setting = newZoomSetting;
			updateSettingsPageTooltips();
			sendUserSettings();
		}
		
		/*
		var styleElem = document.getElementById("traystyles").sheet;
		for (var i = 0; i < styleElem.cssRules.length; i++) {
			if (styleElem.cssRules[i].selectorText == ".ui-tooltip") {
				styleElem.cssRules[i].style.fontSize = (18 + 0.75 * newZoomSetting) + "%";   //---###
				break;
			}
		}
		*/
		updateTooltipZoom();
		
		if (deselectFlag == true) {
			//---###//---###//---###//---###//---###//---### window.getSelection().removeAllRanges();
		}
		
	}
	
}


function updateTooltipZoom() {
	var styleElem = document.getElementById("traystyles").sheet;
	for (var i = 0; i < styleElem.cssRules.length; i++) {
		if (styleElem.cssRules[i].selectorText == ".ui-tooltip") {
			styleElem.cssRules[i].style.fontSize = (18 + 0.75 * userSettingsObj.zoom_setting) + "%";   //---###
			break;
		}
	}
}


function applyUserSettings() {
	updateWidgetNameVisibility(userSettingsObj.show_widget_names);
	updateTooltipVisibility(userSettingsObj.show_tooltips);
	updateZoomSetting(userSettingsObj.zoom_setting, false);
	updateZoomSetting(userSettingsObj.widgets_zoom_setting, true);
	if (document.getElementById("settingsIframe").style.display == "block") {
		updateSettingsPage();
		updateSettingsPageTooltips();
	}
}


// Initialize the settings for a zoom select box
function initZoomSelectBox(zoomSelectId, zoomSettingsArray) {
	// remove any existing zoom setting option elements from the zoom select box
	var aChild;
	var zoomSelectNode = document.getElementById(zoomSelectId);
	while ((aChild = zoomSelectNode.firstChild) != null) {
		zoomSelectNode.removeChild(aChild);
	}
	// add the zoom setting array values to the zoom select box
	for (var n = 0; n < zoomSettingsArray.length; n++) {
		var option = document.createElement("option");
		var zoomSetting = zoomSettingsArray[n];
		option.value = zoomSetting;
		option.text = zoomSetting + "%";
		zoomSelectNode.add(option);
	}
}


window.addEventListener('resize', function(event) {
	if (webviewWidth != window.innerWidth) {
		webviewWidth = window.innerWidth;
		document.getElementById("providerIframe").style.top = topLineBottom() + "px";
		document.getElementById("settingsIframe").style.top = topLineBottom() + "px";
		document.getElementById("tray-widgets-window").style.top = pickerTopLineBottom() + "px";
	}
});


// Listen for messages from titlebar
window.addEventListener('message', function(event) {
	var eventData = event.data;
	
	if ("app_id" in eventData) {
		thisAppId = eventData.app_id;
	}
	
	if ("version_info" in eventData) {
		versionInfo = eventData.version_info;
	}
	
	// window settings have changed
	if ("window_settings" in eventData) {
		windowSettingsObj = eventData.window_settings;
	}
	
	// window height has changed
	if ("window_height_info" in eventData) {
		var windowHeightInfo = eventData.window_height_info;
		if ("webview_height" in windowHeightInfo && "tray_height" in windowHeightInfo && "show_empty_popup" in windowHeightInfo) {
		
		
			//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
			//---###   Hack-Patch to fix Google Chrome change to *not* apply the Chrome "Page Zoom" to the contents of webviews
			//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
			////// webviewHeight = windowHeightInfo.webview_height;
			////// webviewHeight = window.outerHeight;
			//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
			webviewHeight = windowHeightInfo.webview_height
			
			
			var trayHeight = document.getElementById("tray-container").offsetHeight;
			if (windowHeightInfo.show_empty_popup == false) {
				if (document.getElementById("iframe-container").style.display == "none" && document.getElementById("tray-widgets-picker").style.display == "none") {
					trayHeight = webviewHeight;
				} else {
					trayHeight = Math.round(Math.min(maxAllowedTrayHeight(), Math.max(windowHeightInfo.tray_height, minTrayHeight)));
				}
			} else {
				trayHeight = windowHeightInfo.tray_height;
			}
			document.getElementById("tray-container").style.top = (webviewHeight - trayHeight) + "px";
			document.getElementById("tray-container").style.height = trayHeight + "px";
			document.getElementById("iframe-container").style.bottom = trayHeight + "px";
			document.getElementById("tray-widgets-picker").style.bottom = trayHeight + "px";
			if (trayHeight != windowHeightInfo.tray_height) {
				sendHeightInfo();
			}
			
			centerDialog("dialog-alert");
			centerDialog("dialog-form");
		}
	}
	
	// user wants to open the widget picker panel
	if ("open_widget_picker" in eventData && eventData.open_widget_picker == true) {
		openWidgetPicker();
	}
	
	// user wants to open the settings panel
	if ("open_settings_page" in eventData && eventData.open_settings_page == true) {
		openSettingsPage("settingscontent");
	}
	
	// user wants to zoom the icon picker bigger
	if ("widget_zoom_bigger" in eventData && eventData.widget_zoom_bigger == true) {
		zoomBigger(true);
	}
	
	// user wants to zoom the icon picker smaller
	if ("widget_zoom_smaller" in eventData && eventData.widget_zoom_smaller == true) {
		zoomSmaller(true);
	}
	
	// user wants to zoom the icon picker to 100%
	if ("widget_zoom_default" in eventData && eventData.widget_zoom_default == true) {
		zoomDefault(true);
	}
	
	// user has changed thin titlebar setting
	if ("changed_thin_titlebar" in eventData) {
		userSettingsObj.thin_titlebar = eventData.changed_thin_titlebar;
		document.getElementById("thin-titlebar-btn").checked = (userSettingsObj.thin_titlebar == true);
		updateSettingsPageTooltips();
		saveSettingsDataWriteNow();
	}
	
	// initialize user settings from titlebar iff not already initialized
	if ("user_settings" in eventData) {
		var titlebarUserSettingsObj = eventData.user_settings;
		if ("thin_titlebar" in titlebarUserSettingsObj && !("thin_titlebar" in userSettingsObj)) {
			userSettingsObj.thin_titlebar = titlebarUserSettingsObj.thin_titlebar;
		}
		if ("show_widget_names" in titlebarUserSettingsObj && !("show_widget_names" in userSettingsObj)) {
			userSettingsObj.show_widget_names = titlebarUserSettingsObj.show_widget_names;
		}
		if ("show_tooltips" in titlebarUserSettingsObj && !("show_tooltips" in userSettingsObj)) {
			userSettingsObj.show_tooltips = titlebarUserSettingsObj.show_tooltips;
		}
		if ("zoom_setting" in titlebarUserSettingsObj && !("zoom_setting" in userSettingsObj)) {
			userSettingsObj.zoom_setting = titlebarUserSettingsObj.zoom_setting;
		}
		if ("widgets_zoom_setting" in titlebarUserSettingsObj && !("widgets_zoom_setting" in userSettingsObj)) {
			userSettingsObj.widgets_zoom_setting = titlebarUserSettingsObj.widgets_zoom_setting;
		}
		applyUserSettings();
		sendUserSettings();   //---###//---###//---###//---###
	}
	
	// initialize login state
	if ("login_status" in eventData ) {
		if (loggedInFlag == true)
			sendLoginState("loggedIn", loggedInUser);
		else
			sendLoginState("loggedOut", "");
	}
	
	// user wants to log in
	if ("ask_login" in eventData) {
		if (loggedInFlag == true) {
			sendDirtyDataToServer();   // save data first
			// already logged in so nothing more to do
		} else {
			sendLoginRequest();
		}
	}
	
	// user wants to log out
	if ("ask_logout" in eventData) {
		if (loggedInFlag == true) {
			sendDirtyDataToServer();   // save data first
			openLogoutDialog();
		} else {
			sendLogoutRequest();
		}
	}
	
	// user wants to quit
	if ("close_window" in eventData) {
		if (loggedInFlag == true) {
			sendDirtyDataToServer();   // save data first
			openHowToQuitDialog();
		} else {
			openQuitDialog();
		}
	}
	
});


//******************//
function openHowToQuitDialog() {
	$( "#dialog-alert" ).dialog( "option", "title", "Quit OATTS" );
	
	var myButtons = {
		///---### "Quit (Keep login credentials)" : function() {
		"Quit (Stay Logged In)" : function() {
			sendCloseState('loggedIn');
			$( "#dialog-alert-message" ).text(">>>");   // dummy value to tell .dialog( "close" ) to *not* restore the window size
			$( this ).dialog( "close" );
		},
		"Quit (Log Out)" : function() {
			sendCloseState('loggedOut');
			$( "#dialog-alert-message" ).text(">>>");   // dummy value to tell .dialog( "close" ) to *not* restore the window size
			$( this ).dialog( "close" );
		},
		Cancel: function() {
			$( this ).dialog( "close" );
		}
	}
	$( "#dialog-alert-message" ).text("Do you want to quit OATTS?");
	$( "#dialog-alert" ).dialog( "option", "buttons", myButtons );
	$( "#dialog-alert" ).dialog( "open" );
}


//******************//
function openQuitDialog() {
	$( "#dialog-alert" ).dialog( "option", "title", "Quit OATTS" );
	
	var myButtons = {
		"Quit": function() {
			sendCloseState('loggedOut');
			$( "#dialog-alert-message" ).text(">>>");   // dummy value to tell .dialog( "close" ) to *not* restore the window size
			$( this ).dialog( "close" );
		},
		Cancel: function() {
			$( this ).dialog( "close" );
		}
	}
	$( "#dialog-alert-message" ).text("Are you sure you want to quit?");
	$( "#dialog-alert" ).dialog( "option", "buttons", myButtons );
	$( "#dialog-alert" ).dialog( "open" );
}


//******************//
function openLogoutDialog() {
	$( "#dialog-alert" ).dialog( "option", "title", "Log out from OATTS" );
	
	var myButtons = {
		"Log Out" : function() {
			sendLogoutRequest();
			$( "#dialog-alert-message" ).text(">>>");   // dummy value to tell .dialog( "close" ) to *not* restore the window size
			$( this ).dialog( "close" );
		},
		Cancel: function() {
			$( this ).dialog( "close" );
		}
	}
	$( "#dialog-alert-message" ).text("Do you want to log out from OATTS?");
	$( "#dialog-alert" ).dialog( "option", "buttons", myButtons );
	$( "#dialog-alert" ).dialog( "open" );
}


//******************//
function openRemoveConfirmDialog(item) {
	$( "#dialog-alert" ).dialog( "option", "title", "Remove Shortcut Widget" );
	
	var myButtons = {
		"Remove" : function() {
			item.remove();
			saveTrayDataWriteNow();
			$( this ).dialog( "close" );
		},
		Cancel: function() {
			$( this ).dialog( "close" );
		}
	}
	$( "#dialog-alert-message" ).text("Removing this shortcut will delete it from OATTS.");
	$( "#dialog-alert" ).dialog( "option", "buttons", myButtons );
	$( "#dialog-alert" ).dialog( "open" );
}


//******************//
function sessionClosedDialog() {
	$( "#dialog-alert" ).dialog( "option", "title", "OATTS Session Closed" );
	
	var myButtons = {
		"Ok" : function() {
			$( this ).dialog( "close" );
		}
	}
	$( "#dialog-alert-message" ).text("Your session has expired. You need to log in again before any changes will be saved.  Switching to Off-line mode.");
	$( "#dialog-alert" ).dialog( "option", "buttons", myButtons );
	$( "#dialog-alert" ).dialog( "open" );
}


//******************//
function errorAlertDialog(messageText, titleText) {
	$( "#dialog-alert" ).dialog( "option", "title", titleText );
	
	var myButtons = {
		"Ok" : function() {
			$( this ).dialog( "close" );
		}
	}
	$( "#dialog-alert-message" ).html(messageText);
	$( "#dialog-alert" ).dialog( "option", "buttons", myButtons );
	$( "#dialog-alert" ).dialog( "open" );
}


$(function() {
	$( "#dialog-alert" ).dialog({
		autoOpen: false,
		height: "auto",
		width: "auto",
		position: "center",
		draggable: false,   //---### was set to true
		resizable: false,   //---### was set to true
		//minWidth: 280,
		//minHeight: 150,
		modal: true,
		closeOnEscape: true,
		
		open: function() {
			clearTooltips();   //---### to prevent mis-located tooltip after dialog opens
			
			var dialogNode = document.getElementById("dialog-alert").parentNode;
			dialogNode.style.fontSize = dialogZoomSetting() + "%";
			
			$( "#dialog-alert" ).dialog( "option", "width", dialogWidth() );
			$( "#dialog-alert" ).dialog( "option", "height", "auto" );
			$( "#dialog-alert" ).dialog( "option", "position", "center" );
			
			chrome.runtime.sendMessage(thisAppId, { min_dialog_window_height: dialogNode.offsetHeight + 20 + Math.round(2 * 16 * dialogZoomSetting() / 100) });   // set min_dialog_window_height to 0 when closing dialog	
			chrome.runtime.sendMessage(thisAppId, { request_focus: true });
		},
		
		close: function() {
			chrome.runtime.sendMessage(thisAppId, { min_dialog_window_height: 0 });
			clearTooltips();   //---### to prevent mis-located tooltip after dialog closes
		}
	});
});


function dialogZoomSetting() {
	return (50 + 0.5 * userSettingsObj.zoom_setting);
}


function dialogWidth() {
	return Math.min(550 * dialogZoomSetting() / 100,  Math.round(window.innerWidth * 0.98 - (0.2 * 16 * 2) * dialogZoomSetting() / 100) - 25);
}


function centerDialog(dialogID) {
	var dialogNode = document.getElementById(dialogID).parentNode;
	if (dialogNode.style.display == "block" ) {
		$( "#" + dialogID ).dialog( "option", "width", dialogWidth() );
		dialogNode.style.top = Math.max(5, Math.round((webviewHeight - dialogNode.offsetHeight) / 2)) + "px";
		dialogNode.style.left = Math.round((window.innerWidth - ((dialogNode.offsetTop + dialogNode.offsetHeight > webviewHeight) ? 20 : 0) - dialogNode.offsetWidth) / 2) + "px";
	}
}

