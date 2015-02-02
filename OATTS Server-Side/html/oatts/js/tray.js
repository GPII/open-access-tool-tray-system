////// debugger;

var pendingAjaxCall = false;
var heartBeatID;
var minTrayHeight = 32;
var thisAppId = "<<##NotYetSet##>>";
var webviewHeight = minTrayHeight;
var webviewWidth = 0;

var prevWidgetName = "";

var textZoomSettingsArray = [ 65, 80, 100, 125, 160, 200, 250, 320, 400 ];   // text panels zoom settings, in percents
var widgetZoomSettingsArray = [ 25, 32, 40, 50, 65, 80, 100, 125, 160, 200 ];   // widget panels zoom settings, in percents
var defaultZoomSetting = 100;   // default & initial zoom setting, in percent

var userSettingsObj = { };
var windowSettingsObj = { };


initZoomSelectBox("text-panels-zoom", textZoomSettingsArray);
initZoomSelectBox("widget-panels-zoom", widgetZoomSettingsArray);


/* //---###//---###//---###//---###//---###//---###//---###//---###//---###
// Initialize the zoom select box settings in the DOM
(function () {
	// remove any existing zoom setting option elements from the zoom select box
	var aChild;
	var providerListZoomSelect = document.getElementById("text-panels-zoom");
	while ((aChild = providerListZoomSelect.firstChild) != null) {
		providerListZoomSelect.removeChild(aChild);
	}
	var widgetIconZoomSelect = document.getElementById("widget-panels-zoom");
	while ((aChild = widgetIconZoomSelect.firstChild) != null) {
		widgetIconZoomSelect.removeChild(aChild);
	}
	
	// add the zoom setting array values to the zoom select box
	for (var n = 0; n < zoomSettingsArray.length; n++) {
		var option = document.createElement("option");
		var zoomSetting = zoomSettingsArray[n];
		option.value = zoomSetting;
		option.text = zoomSetting + "%";
		if (zoomSetting <= 200) {
			widgetIconZoomSelect.add(option.cloneNode(true));
		}
		providerListZoomSelect.add(option);
	}
})();
*/ //---###//---###//---###//---###//---###//---###//---###//---###//---###


$('<div id="widgetgrp">\
	<div id="tray-widgets-picker" style="display: none;">\
		<div id="tray-widgets-picker-titlebar" style="display: block;">\
			<button type="button" id="close-picker-bt" class="closepopupbutton" onclick="closeWidgetPicker()" title="Close Panel" tabindex="0">\
				Close<img src="images/down_arrow.png" class="closepopupbuttonicon">\
			</button>\
			<div id="widget-picker-title">Add or Change Tool Widgets</div>   <!-- ///---###///---### added -->   \
			<div id="picker-top-line"></div>\
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


//========================================//
//========================================//
/* //---###//---###//---###//---###
function showBookmarkOnTray(w) {
	$('<div class="tray-widget" name="'+w.id+'" bookmark="true" folder="'+w.folder+'">\
	<button class="remove-btn add-remove-btn" title="Edit Bookmark" tabindex="0">Edit</button>\
	<a href="'+w.url+ '" target="_blank" name="'+w.name+'" title="'+w.name+'" class="tray-widget-link" tabindex="0">\
	<img src="'+widgetsPath+w.folder+'/bookmark.png"/>\
	<div class="tray-widget-bookmark">' + w.name + '</div></a>\
	</div>').appendTo('#tray-widgets-container');
}
//---###//---###//---###//---###
function showBookmarkOnTray(w) {
	$('<div class="tray-widget" name="' + w.id + '" bookmark="true" folder="' + w.folder + '">\
	<button class="remove-btn add-remove-btn" title="Edit Bookmark" tabindex="0">Edit</button>\
	<a href="' + w.url + '" target="_blank" title="' + w.name + '" class="tray-widget-link" tabindex="0">\
	<img src="'+widgetsPath+w.folder+'/bookmark.png"/>\
	<div class="tray-widget-bookmark">' + w.name + '</div></a>\
	</div>').appendTo('#tray-widgets-container');
}
*/ //---###//---###//---###//---###
function showBookmarkOnTray(w) {
	if (!("icon" in w)) {
		w.icon = widgetsPath + w.folder + "/trayicon.png";
	}
	$('<div class="tray-widget" name="' + w.id + '" bookmark="true" folder="' + w.folder + '">\
	<button class="remove-btn add-remove-btn" title="Edit Bookmark" tabindex="0">Edit</button>\
	<a href="' + w.url + '" target="_blank" title="' + w.name + '" class="tray-widget-link" tabindex="0">\
	<img src="' + w.icon + '" class="tray-bookmark-icon"/>\
	<img src="images/to_tray.png" class="tray-shortcut-icon"/>\
	<div class="tray-widget-bookmark">' + w.name + '</div></a>\
	</div>').appendTo('#tray-widgets-container');
}
//---###//---###//---###//---###


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
	
	if (favoritesDirty || trayDirty || settingsDirty) {
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
			settingsVar = JSON.stringify({ user_settings: userSettingsObj });
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
						if (loggedInFlag) {
							//transition to logout - send alert
							prepToOpenAlertDialog(sessionClosedDialog);
							sendLoginState("loggedOut", loggedInUser + " Offline");
						} else {
							sendLoginState("loggedOut", "");
						}
						loggedInFlag = false;
						retrigger = false;
					}
				} else if ("message" in i) {
					prepToOpenAlertDialog(errorAlertDialog, i.message + "<br><br><b>Your changes have <i>NOT</i> been saved.</b>", "Data Save Error");   //---###
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


// jQuery ready function
// Private jQuery functions
$(function() {
	
	//========================================//
	//========================================//
	// Widget tray resizing handlers
	$( "#tray-container" ).resizable({ handles: { "n": "#tray-divider"}});
	
	$( "#tray-container" ).on( "resizestart", function( event, ui ) {
		$( "#tray-container" ).resizable( "option", "minHeight", minTrayHeight );
		$( "#tray-container" ).resizable( "option", "maxHeight", webviewHeight );
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
	// initialize tooltips
	$( document ).tooltip();
	$( document ).tooltip( "option", "track", true );
	$( document ).tooltip( "option", "show", { delay: 750, duration: 100 } );
	$( document ).tooltip( "option", "hide", { duration: 100 } );
	$( document ).tooltip({ position: { my: "left+8 top+28", at: "center", collision: "flipfit" } });
	$( document ).tooltip( "enable" );
	
	
	$('#thin-titlebar-btn').on('change', function() {
		userSettingsObj.thin_titlebar = (this.checked == true);
		sendUserSettings();
	});
	
	
	$('#show-widget-names-btn').on('change', function() {
		userSettingsObj.show_widget_names = (this.checked == true);
		updateWidgetNameVisibility(userSettingsObj.show_widget_names);
		sendUserSettings();
	});
	
	
	$('#show-tooltips-btn').on('change', function() {
		userSettingsObj.show_tooltips = (this.checked == true);
		updateTooltipVisibility(userSettingsObj.show_tooltips);
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
		href = (w.link != "" && w.id != "oatts_settings") ? ('href="' + w.link + '" target="_blank" ') : ('href="javascript:;"');
		widgetHtml = '<div class="tray-window-widget" name="'+w.id+'" folder="'+w.folder+'"><button class="widget-add-button add-remove-btn" title="Move Widget down to Tray">Move to Tray</button><a '+href+'title="'+w.name+'" class="tray-window-widget-link"><img src="'+widgetsPath+w.folder+'/trayicon.png" class="widget-picker-icon"/><div class="widget-name">'+w.name+'</div></a></div>';
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
	// show/hide "add widget to tray" button in widget picker
	$('.tray-window-widget a').on('mouseenter', function() {
		////// $(this).parent().find('.widget-add-button').css("display", "block");
		////// $(this).parent().addClass('hover');
		$(this).parent().find('.widget-add-button').addClass('showflag');
	});
	
	$('.tray-window-widget').on('mouseleave', function() {
		////// $(this).find('.widget-add-button').css("display", "none");
		////// $(this).removeClass('hover');
		var focusNode = document.activeElement;
		if (this.firstChild != focusNode && this.lastChild != focusNode) {
			$(this).find('.widget-add-button').removeClass('showflag');
		}
	});
	
	$('.tray-window-widget a, .widget-add-button').on('focusin', function() {
		$(this).parent().find('.widget-add-button').addClass('showflag');
	});
	
	$('.tray-window-widget').on('focusout', function() {
		$(this).find('.widget-add-button').removeClass('showflag');
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
		if ($(this).parents('.tray-widget').attr('bookmark') != null) {
			// must be a bookmark
			// openRemoveConfirmDialog($(this).parents('.tray-widget'));
		} else {
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
		
		var href = (w.link != "" && w.id != "tool_changer" && w.id != "oatts_settings") ? ('href="' + w.link + '" target="_blank" ') : ('href="javascript:;"');
		var editBtnHtml = '<button class="remove-btn add-remove-btn" title="Move Widget up out of Tray" tabindex="0">Move Up</button>';
		if (w.id == "tool_changer") {
			editBtnHtml = "";
		}
		
		
		$('<div class="tray-widget" name="'+w.id+'">' + editBtnHtml + '<a '+href+'title="'+w.name+'" class="tray-widget-link" tabindex="0"><img src="'+widgetsPath+w.folder+'/trayicon.png" class="tray-widget-icon"/>\
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
	function load_js(src)
	{
		var script = document.createElement('script');
		script.src = src;
		$(document.body).append(script);
	}
	

	/* //---###//---###//---###//---###//---###//---###//---###//---###
	//========================================//
	//========================================//
	//click on widget in widget-picker; should display info about
	$('.tray-window-widget a').on('click', function()
	{
		var folder = $(this).parents('.tray-window-widget').attr('folder');
		var title = $(this).parents('.tray-window-widget').find('.widget-name').html();
		var w = new traySystem.window({ 
			info: 1,
			title: title,
			width: 300,
			height: 300,
			backgroundColor: '#000',
			url: widgetsPath+folder+'/launch.php',
			content: '<iframe src="'+baseURL+'/data.php?widget='+folder+'" width="100%" height="100%"></iframe>'
		});
	});
	*/ //---###//---###//---###//---###//---###//---###//---###//---###

	
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
		}
		if (name == 'oatts_settings') {
			// clicked on OATTS Settings widget
			toggleSettingsPage();
			return;
		}
		if ($(item).attr('href') != 'javascript:;') {
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
	
	heartBeatID = setTimeout('heartbeat()', 4000);   // initial heartbeat setting
	
	
	// Initialize user settings from the server database data (if available)
	(function() {
		if ("user_settings" in settingsData) {
			userSettingsObj = settingsData.user_settings;
			applyUserSettings();
		}
	})();
	
	
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
	return document.getElementById("top-line").offsetTop + document.getElementById("top-line").offsetHeight;
}


function pickerTopLineBottom() {
	return document.getElementById("picker-top-line").offsetTop + document.getElementById("picker-top-line").offsetHeight;
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
	$('#providerIframe').scrollTop(0);
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


function toggleSettingsPage() {
	if (document.getElementById("iframe-container").style.display == "none" || document.getElementById("settingsIframe").style.display == "none") {
		openSettingsPage();
	} else {
		closeSettingsPage();
	}
}


function openSettingsPage() {
	if (document.getElementById("tray-widgets-picker").style.display == "block") {
		hideWidgetPicker();
	}
	$('#providerIframe').css("display", "none");
	updateSettingsPage();
	$('#settingsIframe').css("display", "block");
	$('#iframe-container').css("display", "block");
	document.getElementById("settingsIframe").style.top = topLineBottom() + "px";
	$('#settingsIframe').scrollTop(0);
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
	//---### var newHeightText = ((showWidgetNames == true) ? "128px" : "80px");
	var newHeightText = ((showWidgetNames == true) ? "8.00em" : "5.00em");
	for (var i = 0; i < styleElem.cssRules.length; i++) {
		if (styleElem.cssRules[i].selectorText == ".tray-widget") {
			styleElem.cssRules[i].style.height = newHeightText;
		} else if (styleElem.cssRules[i].selectorText == ".tray-widget-link") {
			styleElem.cssRules[i].style.maxHeight = newHeightText;
		} else if (styleElem.cssRules[i].selectorText == ".tray-widget-name") {
			styleElem.cssRules[i].style.display = ((showWidgetNames == true) ? "block" : "none");
		}
	}
}


function updateTooltipVisibility(showTooltips) {
	var wasDisabled = $( document ).tooltip( "option", "disabled");
	if (showTooltips == true && wasDisabled == true) {
		$( document ).tooltip( "enable" );
	} else if (showTooltips == false && wasDisabled == false) {
		$( document ).tooltip( "disable" );
	}
}


function clearTooltips() {
	var wasDisabled = $( document ).tooltip( "option", "disabled");
	if ($( document ).tooltip( "option", "disabled") == false) {
		$( document ).tooltip( "disable" );
		$( document ).tooltip( "enable" );
	}
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
		var newZoomSettingText = newZoomSetting + "%";
		if (newZoomSetting < 40) {
			newZoomSettingText = (16 * (newZoomSetting / 100)) + "px";
		}
		document.getElementById('tray-widgets-container').style.fontSize = newZoomSettingText;
		document.getElementById('tray-widgets-window-container').style.fontSize = newZoomSettingText;
		document.getElementById("tray-widgets-picker-titlebar").style.fontSize = (60 + 0.5 * newZoomSetting) + "%";
		document.getElementById("tray-widgets-window").style.top = pickerTopLineBottom() + "px";

		document.getElementById("widget-panels-zoom").value = newZoomSetting;
		if (newZoomSetting != userSettingsObj.widgets_zoom_setting) {
			userSettingsObj.widgets_zoom_setting = newZoomSetting;
			sendUserSettings();
		}
		
	} else {
		
		document.getElementById('providerIframe').style.fontSize = newZoomSetting + "%";
		document.getElementById('settingsIframe').style.fontSize = newZoomSetting + "%";
		document.getElementById("iframe-container-titlebar").style.fontSize = (60 + 0.5 * newZoomSetting) + "%";
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
		
		document.getElementById("text-panels-zoom").value = newZoomSetting;
		if (newZoomSetting != userSettingsObj.zoom_setting) {
			userSettingsObj.zoom_setting = newZoomSetting;
			sendUserSettings();
		}
		
		var styleElem = document.getElementById("traystyles").sheet;
		for (var i = 0; i < styleElem.cssRules.length; i++) {
			if (styleElem.cssRules[i].selectorText == ".ui-tooltip") {
				styleElem.cssRules[i].style.fontSize = (30 + 0.7 * newZoomSetting) + "%";   //---###
			}
		}
		
		if (deselectFlag == true) {
			window.getSelection().removeAllRanges();
		}
		
	}
	
}


function applyUserSettings() {
	updateWidgetNameVisibility(userSettingsObj.show_widget_names);
	updateTooltipVisibility(userSettingsObj.show_tooltips);
	updateZoomSetting(userSettingsObj.zoom_setting, false);
	updateZoomSetting(userSettingsObj.widgets_zoom_setting, true);
	if (document.getElementById("settingsIframe").style.display != "none") {
		updateSettingsPage();
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


// Mousewheel event listener for adjusting zoom settings (with the ctrl key down)
function MouseWheelHandler(e) {
	var clickTargets = $( e.target ).parents();
	////// var widgetsZoomFlag = (clickTargets.is( "#tray-widgets-container, #tray-widgets-window-container" ));
	var widgetsZoomFlag = (clickTargets.is( "#widgetgrp" ));
	
	var delta = Math.max(-1, Math.min(1, e.wheelDelta));
	if (e.ctrlKey == false) {
		return true;
	}
	if (delta < 0) {
		zoomSmaller(widgetsZoomFlag);
	} else if (delta > 0) {
		zoomBigger(widgetsZoomFlag);
	}
	return false;
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
	
	// window settings have changed
	if ("window_settings" in eventData) {
		windowSettingsObj = eventData.window_settings;
	}
	
	// window height has changed
	if ("window_height_info" in eventData) {
		var windowHeightInfo = eventData.window_height_info;
		if ("webview_height" in windowHeightInfo && "tray_height" in windowHeightInfo && "is_maximized" in windowHeightInfo) {
			webviewHeight = windowHeightInfo.webview_height;
			var trayHeight = document.getElementById("tray-container").offsetHeight;
			if (windowHeightInfo.is_maximized == false) {
				if (document.getElementById("iframe-container").style.display == "none" && document.getElementById("tray-widgets-picker").style.display == "none") {
					trayHeight = webviewHeight;
				} else {
					trayHeight = Math.min(webviewHeight, document.getElementById("tray-container").offsetHeight);
				}
			} else {
				trayHeight = windowHeightInfo.tray_height;
			}
			document.getElementById("tray-container").style.top = (webviewHeight - trayHeight) + "px";
			document.getElementById("tray-container").style.height = trayHeight + "px";
			document.getElementById("iframe-container").style.bottom = trayHeight + "px";
			document.getElementById("tray-widgets-picker").style.bottom = trayHeight + "px";
		}
	}
	
	// user wants to open the widget picker panel
	if ("open_widget_picker" in eventData && eventData.open_widget_picker == true) {
		openWidgetPicker();
	}
	
	// user wants to open the settings panel
	if ("open_settings_page" in eventData && eventData.open_settings_page == true) {
		openSettingsPage();
	}
	
	// user wants to zoom the icon picker smaller
	if ("widget_zoom_smaller" in eventData && eventData.widget_zoom_smaller == true) {
		zoomSmaller(true);
	}
	
	// user wants to zoom the icon picker bigger
	if ("widget_zoom_bigger" in eventData && eventData.widget_zoom_bigger == true) {
		zoomBigger(true);
	}
	
	// user has changed thin titlebar setting
	if ("changed_thin_titlebar" in eventData) {
		userSettingsObj.thin_titlebar = eventData.changed_thin_titlebar;
		document.getElementById("thin-titlebar-btn").checked = (userSettingsObj.thin_titlebar == true);
		saveSettingsDataWriteNow();
	}
	
	// initialize user settings from titlebar iff not already initialized
	if ("user_settings" in eventData) {
		titlebarUserSettingsObj = eventData.user_settings;
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
		chrome.runtime.sendMessage(thisAppId, { user_settings: userSettingsObj });
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
		if (loggedInFlag) {
			sendDirtyDataToServer();   // save data first
			// already logged in so nothing more to do
		} else {
			sendLoginRequest();
		}
	}
	
	// user wants to log out
	if ("ask_logout" in eventData) {
		if (loggedInFlag) {
			sendDirtyDataToServer();   // save data first
			prepToOpenAlertDialog(openLogoutDialog);
		} else {
			sendLogoutRequest();
		}
	}
	
	// user wants to quit
	if ("close_window" in eventData) {
		if (loggedInFlag) {
			sendDirtyDataToServer();   // save data first
			prepToOpenAlertDialog(openHowToQuitDialog);
		} else {
			prepToOpenAlertDialog(openQuitDialog);
		}
	}
	
});


//******************//
function openHowToQuitDialog() {
	$( "#dialog-alert" ).dialog( "option", "title", "Quit OATTS" );
	
	var myButtons = {
		///---### "Quit (Keep login credentials)" : function () {
		"Quit (Stay Logged In)" : function () {
			//post messsge to quit
			sendCloseState('loggedIn');
			$( this ).dialog( "close" );
		},
		"Quit (Log Out)" : function () {
			//post messsge to quit
			sendCloseState('loggedOut');
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
		"Quit": function () {
			//post messsge to quit
			sendCloseState('loggedOut');
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
		"Log Out" : function () {
			//post messsge to quit
			sendLogoutRequest();
			$( this ).dialog( "close" );
		},
		Cancel: function() {
			$( this ).dialog( "close" );
		}
	}
	$( "#dialog-alert-message" ).text("Do you want to logout from OATTS?");
	$( "#dialog-alert" ).dialog( "option", "buttons", myButtons );
	$( "#dialog-alert" ).dialog( "open" );
}


//******************//
function openRemoveConfirmDialog(item) {
	$( "#dialog-alert" ).dialog( "option", "title", "Remove Shortcut Widget" );
	
	var myButtons = {
		"Remove" : function () {
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
		"Ok" : function () {
			//post messsge to quit
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
		"Ok" : function () {
			//post messsge to quit
			$( this ).dialog( "close" );
		}
	}
	$( "#dialog-alert-message" ).html(messageText);
	$( "#dialog-alert" ).dialog( "option", "buttons", myButtons );
	$( "#dialog-alert" ).dialog( "open" );
}


//******************//
function imagePickerDialog(url) {
	$( "#dialog-alert" ).dialog( "option", "title", "ImagePicker" );
	
	var myButtons = {
		"Ok" : function () {
			//post messsge to quit
			$( this ).dialog( "close" );
		},
		Cancel: function() {
			$( this ).dialog( "close" );
		}
	}
	$( "#dialog-alert-message" ).text("");
	$( "#dialog-alert" ).dialog( "option", "buttons", myButtons );
	$( "#dialog-alert" ).dialog( "open" );
}


$(function() {
	$( "#dialog-alert" ).dialog({
		autoOpen: false,
		height: "auto",
		width: "auto",
		position: "center",
		draggable : true,
		resizable: true,
		//minWidth: 280,
		//minHeight: 150,
		modal: true,
		closeOnEscape: true,
		open: function() {
			$( "#dialog-alert" ).dialog( "option", "width", "auto" );
			$( "#dialog-alert" ).dialog( "option", "height", "auto" );
			$( "#dialog-alert" ).dialog( "option", "position", "center" );
		},
		close: function() {
			if ($( "#dialog-form" ).dialog( "isOpen" ) == false) {
				chrome.runtime.sendMessage(thisAppId, { min_dialog_window_height: 0 });
			}
		}
	});
});


function prepToOpenAlertDialog(dialogFunctionName, param1, param2) {
	prepToOpenDialog(dialogFunctionName, param1, param2, 250);
}


function prepToOpenDialog(dialogFunctionName, param1, param2, minDialogWindowHeight) {
	chrome.runtime.sendMessage(thisAppId, { min_dialog_window_height: minDialogWindowHeight });   // set minDialogWindowHeight to 0 when closing dialog
	delayedOpenDialog(dialogFunctionName, param1, param2, minDialogWindowHeight, 0);   // wait for the main window to be resized, and then open the dialog.
}


// This function waits (up to 10 * 20 = 200 milliseconds) for titlebar.js to resize the main window
// and then notify tray.js that the window has been resized.  Since the messages are asynchronous,
// this script must terminate periodically to allow the message processes to run. 
function delayedOpenDialog(dialogFunctionName, param1, param2, minDialogWindowHeight, StateNum) {
	if (webviewHeight < minDialogWindowHeight && StateNum < 10) {
		setTimeout(function() { delayedOpenDialog(dialogFunctionName, param1, param2, minDialogWindowHeight, StateNum + 1); }, 20);
	} else {
		dialogFunctionName(param1, param2);
		chrome.runtime.sendMessage(thisAppId, { request_focus: true });
	}
}

