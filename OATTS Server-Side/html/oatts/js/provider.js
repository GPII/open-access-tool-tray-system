
//---### Moved to here from picker.php
////// var globalID = "";
var widgetExtrnData = "";
var loadedWidgetName = "";
var myHash="";
var myFolder="";
var myName="";
var iframe = true;


//********************************************************//
function favBuild1(idStr, urlStr, provStr) {

	var str = "" + 
		"<div class=\"flexcontainer\">" +
			
			"<span class=\"favinfo\" id=\"info" + idStr + "\">" +
				"<img class=\"listicon\" alt=\"\" src=\"images/up_down_arrow.png\">" +
				"<a id=\"link" + idStr + "\" href=\"" + urlStr + "\" target=\"_blank\" class=\"favlink closeonaction\" title=\"" + urlStr + "\">" + 
					"<span id=\"label" + idStr + "\">" + provStr + "</span>" +
				"</a>" +
			"</span>" +
			
			"<button type=\"button\" onclick=\"openAction('" + idStr + "')\" id=\"aOpenAction" + idStr + 
				"\" tabindex=\"0\" class=\"openfavactions provbutton\" title=\"More or Less Edit Options\">" +
			"More...</button>" +
			
		"</div>" +
		
		"<div class=\"favactionbar\" idstr=\"" + idStr + "\" style=\"display:none;\">" +
		
			"<div class=\"favurldiv\">" +
				"<span class=\"favurl\" id=\"url" + idStr + "\">" + urlStr + "</span>" +
			"</div>" +
			
			"<div class=\"flexAction5\">" +
				
				"<div class=\"flexAction1\">" +
					"<button type=\"button\" onclick=\"moveUp('" + idStr + "')\" tabindex=\"0\" class=\"favactions provbutton\" title=\"Move up in list\">" + 
						"<img src=\"images/up_arrow.png\" alt=\"\" class=\"provbuttonicon\" />" +
					"Move Up</button>" +
				"</div>" +
				
				"<div class=\"flexAction2\">" +
					"<button type=\"button\" onclick=\"moveDown('" + idStr + "')\" tabindex=\"0\" class=\"favactions provbutton\" title=\"Move down in list\">" + 
						"<img src=\"images/down_arrow.png\" alt=\"\" class=\"provbuttonicon\" />" +
					"Move Down</button>" + 
				"</div>" +
				
			"</div>" +
			
			"<div class=\"flexAction5\">" +
				
				"<div class=\"flexAction3\">" +
					"<button type=\"button\"  idstr=\"" + idStr + "\" tabindex=\"0\" class=\"favactions provbutton editentry\" title=\"Edit\">" +
						"<img src=\"images/pencil.png\" alt=\"\" class=\"provbuttonicon\" />" +
					"Edit</button>"+ 
				"</div>" +
				
				"<div class=\"flexAction3\">" +
					"<button type=\"button\"  onclick=\"duplicate('" + idStr + "')\" tabindex=\"0\" class=\"favactions provbutton\" title=\"Make a copy\">" + 
						"<img src=\"images/copy_favorite.png\" alt=\"\" class=\"provbuttonicon\" />" +
					"Copy</button>" + 
				"</div>" +
				
				"<div class=\"flexAction3\">" +
					"<button type=\"button\"  onclick=\"bookmark('" + idStr + "')\" tabindex=\"0\" class=\"favactions provbutton\" title=\"Add to tray\">" + 
						"<img src=\"images/to_tray.png\" alt=\"\" class=\"provbuttonicon\" />" +
					"Tray</button>" +
				"</div>" +
				
				"<div class=\"flexAction3\">" +
					"<button type=\"button\"  onclick=\"deleteProvider('" + idStr + "')\" tabindex=\"0\" class=\"favactions provbutton\" title=\"Delete\">" + 
						"<img src=\"images/trash_can.png\" alt=\"\" class=\"provbuttonicon\" />" +
					"Delete</button>" +
				"</div>" +
				
			"</div>" +
			
		"</div>" +

			"";
	return str;
}


//********************************************************//
function providersBuild1(idStr, urlStr, provStr) {

	var str = "" + 
		"<div class=\"flexcontainer\">" +
			"<span class=\"providerinfo\" id=\"info" + idStr + "\">" +
				"<a id=\"link" + idStr + "\" href=\"" + urlStr + "\" target=\"_blank\" class=\"providerlink closeonaction\" title=\"" + urlStr + "\">" + 
					"<span id=\"label" + idStr + "\">" + provStr + "</span></a>" + 
					
				
			"</span>" +
			"<span class=\"provideractions\">" +
			
				"<button type=\"button\" onclick=\"promote('" + idStr + "')\" tabindex=\"0\" class=\"providersaction provbutton\" title=\"Add to Favorites\">" + 
					"<img src=\"images/favorites.png\" alt=\"\" class=\"provbuttonicon\" />" +
				"Favorite</button>" +
				"<button type=\"button\" onclick=\"bookmark('" + idStr + "')\" tabindex=\"0\" class=\"providersaction provbutton\" title=\"Add to tray\">" + 
					"<img src=\"images/to_tray.png\" alt=\"\" class=\"provbuttonicon\" />" +
				"Tray</button>" +
				
			"</span>"+
		"</div>" +
		
		"<div class=\"providersurldiv\">" +		
		"<span class=\"providersurl\" id=\"url" + idStr + "\">" + urlStr + "</span>" +
		"</div>" +
			"";
	return str;
}


//********************************************************//
function duplicate(idStr) {

	//add new list element after this one
	buildList(idStr, 1);

	//save data to user db
	saveUserDataWriteNow();
}


//********************************************************//
function promote(idStr) {

	//add new list element to end of list
	buildList(idStr, 0);

	//save data to user db
	saveUserDataWriteNow();
}


//********************************************************//
function getUniqueId() {

var alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    
	var rand = alpha[Math.floor(Math.random() * alpha.length)];
	var tmp = Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
	var tmp3 = Date.now().toString();
	return rand + tmp + tmp3;
}


//********************************************************//
function bookmark(idStr) {

	var nameStr;
	var urlStr;
	var idStr;
	var dataArray = [];
	
	if (iframe == true) {
		urlStr = document.getElementById("link" + idStr).getAttribute("href");
		nameStr = document.getElementById("label" + idStr).textContent;
		dataArray.push({"id" : getUniqueId(), "folder" : myFolder, "name": nameStr, "url": urlStr});

	/*	//call routine to display it
		window.parent.showBookmarkOnTray(dataArray[0]);
		//now save tray
		window.parent.save_widgets();
	*/	
		//call routine to display it
		showBookmarkOnTray(dataArray[0]);
		//now save tray
		saveTrayDataWriteNow();
	}
}


//********************************************************//
function deleteProvider(idStr) {
	clearTooltips();   //---### to prevent stuck tooltip for deleted DOM element
	var tmp = document.getElementById(idStr);
	tmp.parentNode.removeChild(tmp);
	saveUserDataWriteNow();
}


//********************************************************//
function buildList (idStr, mode) {
// mode 0 - promote - add to end of list
// mode 1 - duplicate an entry after current item


// mode 3 - save as a new entry before current one
// mode 4 - update entry with new edit info
// mode 5 - save as a new provider at beginning of list

	var srcElem;
	var tmpID;
	var urlStr;
	var provStr;

	//get info from normal li fields
	urlStr = document.getElementById("link" + idStr).getAttribute("href");
	provStr = document.getElementById("label" + idStr).textContent;

	/*
	// clean up
	if (urlStr != null) {
		urlStr = urlStr.replace(/^\s+|\s+$/g,'');
	} else {
		urlStr = "";
	}
	if (provStr != null) {
		provStr = provStr.replace(/^\s+|\s+$/g,'');
	} else {
		provStr = "";
	}
	*/
	
	if ((mode == 0) || (mode == 1)) {
		//make new <li> element
		//get new id
		tmpID = getUniqueId();
		srcElem = document.createElement('li');
		srcElem.id = tmpID;
		srcElem.innerHTML = favBuild1(tmpID, urlStr, provStr);
		//document.getElementById("favlist").appendChild(srcElem);
		if (mode == 1) {
			//insert after idStr
			$(srcElem).insertAfter("#" + idStr);
			
		} else if (mode == 0) {
			//append to end
			$("#favlist").append(srcElem);
		}
		
		$("#favlist").sortable("refresh");
		
	} 
}


//********************************************************//
function moveUp(idStr) {
	var srcElem = document.getElementById(idStr);
	var prevSib = srcElem.previousSibling;
	if (prevSib != null) {
		document.getElementById("favlist").insertBefore(srcElem,prevSib);
	}
	//document.getElementById("aActionup" + idStr).focus();
	saveUserData();
}


//********************************************************//
function moveDown(idStr) {
	var srcElem = document.getElementById(idStr);
	var nextSib = srcElem.nextSibling;
	if (nextSib != null) {
		document.getElementById("favlist").insertBefore(nextSib,srcElem);
	}
	//document.getElementById("aActiondown" + idStr).focus();
	saveUserData();
}


//********************************************************//
function openAction(id) {
//go through list of "actionbar" items and hide all except the one clicked on.  Toggle the one clicked on
	var liveNodeList = document.getElementsByClassName('favactionbar');
	var clickedButton = this;
	for (var i = 0; i < liveNodeList.length; i++) {
		var tempId;
		var elem = liveNodeList[i];
		//check if tray hidden
		if (((tempId = elem.getAttribute("idstr")) == id) && (elem.style.display == "none")) {
			//show it
			elem.style.display = "";
			//change text and title in controller
			document.getElementById("aOpenAction" + id).innerHTML = "Less...";
			//hide other items
			//document.getElementById("delete" + id).style.display = "none";
		} else {
			//hide it
			elem.style.display = "none";
			//change text and title in controller
			document.getElementById("aOpenAction" + tempId).innerHTML = "More...";
			//show other items
			//document.getElementById("delete" + tempId).style.display = "";
		}

	}

}


//********************************************************//
function initLists() {
	var tmp;
	var idStr;;
	var urlStr;
	var provStr;
	var parent;
	var empty = true;

	
	//set page title
	var title = getProviderTitle();
	if (title == "") title = "Service Providers";
	
	document.getElementById('providerTitle').textContent = title;
		//$('#providerTitle').text(title);
	
	
	//delete old content and start fresh
	parent = document.getElementById("favlist");
	while (parent.hasChildNodes()) {
		parent.removeChild(parent.lastChild);
	}
	
	//build user list
	
	var provArray = getUserDataArray();
	for (var i=0; i < provArray.length; i++) {
		//get name and url
		idStr = getUniqueId();
		urlStr = provArray[i].url;
		provStr = provArray[i].name;

		if ((srcElem = document.getElementById(idStr)) == null) {
			srcElem = document.createElement("li");
			srcElem.setAttribute("id",idStr); 
		}
		srcElem.innerHTML = favBuild1(idStr, urlStr, provStr);
		parent.appendChild(srcElem);
		empty = false;
		
		//$("#favlist").append(srcElem);

	}
	$("#favlist").sortable("refresh");

			
	//delete old content and start fresh
	parent = document.getElementById("providerlist");
	while (parent.hasChildNodes()) {
		parent.removeChild(parent.lastChild);
	}
	
	//get default list
	//check if anything to display
	provArray = getDefaultDataArray();
	for (var i=0; i < provArray.length; i++) {
		//get name and url
		idStr = getUniqueId();
		urlStr = provArray[i].url;
		provStr = provArray[i].name;

		if ((srcElem = document.getElementById(idStr)) == null) {
			srcElem = document.createElement("li");
			srcElem.setAttribute("id",idStr); 
		}
		srcElem.innerHTML = providersBuild1(idStr, urlStr, provStr);
		parent.appendChild(srcElem);
		empty = false;
	}
	/*
	if (!empty) {
		initNewProviderState();
		document.getElementById('providerwin').style.display = '';
	} else {
		document.getElementById('providerwin').style.display = "none";
	}
	*/
}


//********************************************************//
function saveUserDataWriteNow() {
	saveUserData();
	sendDataToServer();
}


//********************************************************//
function saveUserData() {
// need to make sure there is room to save the changes in the database.  If not, ...how to handle?

	var data = {"widgetName": loadedWidgetName,
				"provider":[]};

	var nameStr;
	var urlStr;
	var idStr;
	var done = false;
	var dataArray = [];
	
	var list = document.getElementById("favlist");
	var tmpItem = list.firstChild;
	while (!done && tmpItem != null) {
		idStr = tmpItem.id;
		urlStr = document.getElementById("link" + idStr).getAttribute("href");
		nameStr = document.getElementById("label" + idStr).textContent;

		dataArray.push({"id" : tmpItem.id, "name": nameStr, "url": urlStr});
		tmpItem = tmpItem.nextSibling;
	}
	data.provider = dataArray;
	
	saveUserDataToDb(data);
}


//********************************************************//
function saveUserDataToDb(data) {

	var found = false;
	var userData = widgetExtrnData.favorites;
	var userArrayLength = userData.length;
	
	//seach user data for this widget name
	for (var i = 0; i < userArrayLength; i++) {
		if (userData[i].widgetName == data.widgetName) {
			//found it - replace
			userData[i] = data;
			found = true;
			continue;
		}
	}
	if (!found) {
		//append
		userData.push(data);
	}

	//SAVE NOW
	
	providersData.favorites = userData;
	favoritesDirty = true;
	/*
	//var myData = "userdata=" + JSON.stringify(widgetExtrnData.userData) + "&hash=" + myHash;
	var myData = JSON.stringify(widgetExtrnData.userData);

	// debugger;
	$.ajax({
		url:  baseURL+"/includes/datasave.php",
		type: "POST",
		data: {'providerdata': myData, 'hash': myHash},
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
//********************************************************//
function getUserDataArray() {

	var result = new Array();
	var userArray = widgetExtrnData.favorites;
	var userArrayLength = userArray.length;
	
	for (var i=0; i < userArrayLength; i++) {
		if (userArray[i].widgetName == loadedWidgetName) {
			//found it
			result = userArray[i].provider;
			continue;
		}
	}
	return result;
}


//********************************************************//
//********************************************************//
function getProviderTitle() {

	var result = "";
	//check if anything to display
	if (!(typeof (widgetExtrnData.providers[loadedWidgetName].pageHeader) === "undefined")) {
		result = widgetExtrnData.providers[loadedWidgetName].pageHeader;
	}
	return result;
}


//********************************************************//
//********************************************************//
function getDefaultDataArray() {

	var result = new Array();
	//check if anything to display
	if ((typeof (widgetExtrnData.providers[loadedWidgetName].provider) === "undefined") || 
		(widgetExtrnData.providers[loadedWidgetName].provider.length == 0) ){
		//nothing to do
	} else {
		result = widgetExtrnData.providers[loadedWidgetName].provider;
		result.sort(function (a,b) {
			var nameA = a.name.toLowerCase();
			var nameB = b.name.toLowerCase();
			if (nameA < nameB) //sort string ascending
				return -1
			if (nameA > nameB)
				return 1
			return 0 //default return value (no sorting)
		});
	}
	return result;
}


//********************************************************//
//********************************************************//
function initNewProviderState() {
/*
	//see if client app running
	if (webviewHeight == 0) {
		//no client app so make fixed to providerIframe stylesheet
	
		var styleElem = document.getElementById('traystyles').sheet;
		for (var i = 0; i < styleElem.cssRules.length; i++) {
			if (styleElem.cssRules[i].selectorText == "#providerIframe") {
				styleElem.cssRules[i].style.bottom = "";
				continue;
			}
		}
		
	}
	*/
}


//********************************************************//
//********************************************************//
function initProviderPage() {

	initLists();
	initNewProviderState();
}


//********************************************************//
function loadProviderIframe(uHash, wName, wFolder, pData) {
	myHash = uHash;
	myFolder = wFolder;

	//widgetExtrnData = $.parseJSON(pData);
	widgetExtrnData = pData;
	//load new widget
	loadedWidgetName = wName;
	initProviderPage();
}


//********************************************************//
function updateListItem(idStr, label, link) {
	$("#link" + idStr).attr("href", link);
	$("#link" + idStr).attr("title", link);
	$("#label" + idStr).text(label);
	$("#url" + idStr).text(link);
	//document.getElementById("label" + idStr).textContent;
}


////access jQuery loaded in parent
//// debugger;
//if (typeof(jQuery) == "undefined") {
//	var $ = jQuery = window.parent.$;
//}
//on page load
//********************************************************//
//********************************************************//
//********************************************************//


document.addEventListener('DOMContentLoaded', function() {
	if (iframe == false) {
		loadProviderPage(myHash, myName, myFolder);
	}

});


$(function() {
	
	//***********************//
	$( "#favlist" ).sortable(
	{
		//try to prevent unwanted drags instead of clicks
		delay: 150,
		
		//modified to only save if the widget changed position
		start: function(event, ui) {
			var startPos = ui.item.index();
			ui.item.data('start_pos', startPos);
		},
		
		deactivate: function(event, ui) {
			var startPos = ui.item.data('start_pos');
			var currentPos = ui.item.index();
			if (startPos != currentPos) {
				saveUserData();
			}
		}
	});
	
	
	//***********************//
	$("ul#favlist,ul#providerlist").on("click",".closeonaction", function() {
		//window.parent.closeIframe();
		closeIframe();
	});
	
}); 
	

$(function() {
	var idStr;
	
	var name = $( "#editname" );
	var url = $( "#editurl" );
	
	//---### var img = $( "#editicon" );
	//---### var allFields = $( [] ).add( name ).add( url ).add( img );
	var allFields = $( [] ).add( name ).add( url );
	
	var tips = $( ".validateTips" );
	var editBookmarkDialogOpen = false;

	function updateTips( t ) {
		/*
		tips.text( t ).addClass( "ui-state-highlight" );
		setTimeout(function() {
			tips.removeClass( "ui-state-highlight", 1500 );
		}, 500 );
		*/
		tips.text( t );
		
	}
	
	
	function checkLength( field, fieldName, min, max ) {
		if ( field.val().length < min && min <= 1 ) {
			field.addClass( "ui-state-error" );
			updateTips( ">>> " + fieldName + " must not be blank." );
			return false;
		} else if (field.val().length < min ) {
			field.addClass( "ui-state-error" );
			updateTips( ">>> " + fieldName + " must be at least " + min + " characters." );
			return false;
		} else if ( field.val().length > max ) {
			field.addClass( "ui-state-error" );
			updateTips( ">>> " + fieldName + " must be no more than " + max + " characters." );
			return false;
			
		/*
		} else if ( field.val().length > max || field.val().length < min ) {
			field.addClass( "ui-state-error" );
			updateTips( "Length of " + fieldName + " must be between " + min + " and " + max + "." );
			return false;
		*/
			
		} else {
			return true;
		}
	}
	
	
	function checkTextHtmlSafe(field, fieldName) {
		if (field.val().search("[\"'<>]") >= 0) {
			updateTips( ">>> " + fieldName + " field cannot contain any of the following characters: \" ' < >" );
			return false;
		}
		return true;
	}
	
	
	function checkUrlHtmlSafe(field, fieldName) {
		if (checkTextHtmlSafe(field, fieldName) == false) {
			return false;
		}
		if (field.val().search(" ") >= 0) {
			updateTips( ">>> " + fieldName + " field cannot contain any space characters." );
			return false;
		}
		return true;
	}
	
	
	function checkRegexp( field, regexp, msg ) {
		if ( !( regexp.test( field.val() ) ) ) {
			field.addClass( "ui-state-error" );
			updateTips( msg );
			return false;
		} else {
			return true;
		}
	}
	
	
	function checkProtocol( field, fieldName ) {
		searchTarget = "/:\/\//"
		if ( field.val().length > max || field.val().length < min ) {
			field.addClass( "ui-state-error" );
			updateTips( "Length of " + fieldName + " must be between " + min + " and " + max + "." );
			return false;
		} else {
			return true;
		}
	}
	
	
	function fieldsValidated() {
		var bValid = true;
		allFields.removeClass( "ui-state-error" );
		bValid = bValid && checkLength( name, "The Provider Name", 1, 50);
		bValid = bValid && checkLength( url, "The Address", 1, 150);
		bValid = bValid && checkTextHtmlSafe(name, "The Provider Name", "\"'<>");
		bValid = bValid && checkUrlHtmlSafe(url, "The Address");
		//---### if (document.getElementById("editiconDiv").style.display != "none") {
		//---###	bValid = bValid && checkUrlHtmlSafe(img, "The Icon URL");
		//---### }
		return bValid;
	}
	
	
	//******************//
	$( "#insbutton" ).on("click", function() {
		addNewFavoriteDialog(this);
	});
	
	/* //---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	function addNewFavorite() {
		addNewFavoriteDialog(this);
	}
	*/ //---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###//---###
	
	
	function addNewFavoriteDialog(item) {
		$( "#dialog-form" ).dialog( "option", "title", "Add New Provider To List" );
		
		//build edit element
		name.val("");
		url.val("");
		document.getElementById("editiconDiv").style.display = "none";
		
		var myButtons = {
			"Save": function() {
				if ( fieldsValidated() ) {
					//fix url if no protocol specified
					if (!checkRegexp( url, /:\/\//, "Adding http prefix" )) {
						url.val("http://" + url.val());
					}
					//create a new entry and insert it at beginning
					var tmpID = getUniqueId();
					$("#favlist").prepend("<li id='" + tmpID + "'>" + favBuild1(tmpID, url.val(), name.val()) + "</li>");

					$("#favlist").sortable("refresh");
					saveUserDataWriteNow();
					$( this ).dialog( "close" );
				} else {
					centerDialog("dialog-form");
				}
			},
			
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		}
		$( "#dialog-form" ).dialog( "option", "buttons", myButtons );
		$( "#dialog-form" ).dialog( "open" );
	}
	
	
	//******************//
	$( "#imgpicker" ).on("click",function() {
		chrome.runtime.sendMessage(thisAppId, { open_icon_picker: baseURL + "/icon_picker.php" });
	});
	
	
	//******************//
	$('#tray-widgets-container').on('click', '.tray-widget[bookmark|="true"] .remove-btn', function() {
		// if not a bookmark...must be a widget
		if ($(this).parents('.tray-widget').attr('bookmark') != null) {
			// must be a bookmark
			editBookmarkDialog($(this).parents('.tray-widget'));
		}
	});
	
	
	//******************//
	function editBookmarkDialog(item) {
		$( "#dialog-form" ).dialog( "option", "title", "Edit Bookmark" );

		//build edit element
		//debugger;
		//show url
		
		document.getElementById("editiconDiv").style.display = "";
		
		var linkNode = $(item).children("a").last();
		var nameDiv = $(linkNode).children("div").last();
		var urlStr = $(linkNode).attr("href");
		var provStr = $(nameDiv).text();
		var iconPath = $(linkNode).children("img").first().attr("src");
		name.val(provStr);
		url.val(urlStr);
		//---### img.val(iconPath);
		document.getElementById("iconpathtext").textContent = iconPath;
		document.getElementById("bookmark-dialog-icon").src = iconPath;
		document.getElementById("bookmark-dialog-widget").title = iconImageLabel(iconPath);
		
		var myButtons = {
			"Save": function() {
				if ( fieldsValidated() ) {
					//fix url if no protocol specified
					//if (!checkRegexp( url, /:\/\//, "Adding http prefix" )) {
					//	url.val("http://" + url.val());
					//}
					//update list element with new values
					//$("#" + idStr).html(favBuild1(idStr, url.val(), name.val()))
					
					$(linkNode).attr("href", url.val());
					$(linkNode).attr("title", name.val());
					
					//---### $(linkNode).children("img").first().attr("src", img.val());
					$(linkNode).children("img").first().attr("src", document.getElementById("iconpathtext").textContent);
					
					$(nameDiv).text(name.val());
					saveTrayDataWriteNow();
					$( this ).dialog( "close" );
				} else {
					centerDialog("dialog-form");
				}
			},
			
			"Remove": function() {
				// post warning message
				document.getElementById("editiconDiv").style.display = "block";   // "flag" for close function to *not* restore window size
				$( this ).dialog( "close" );
				openRemoveConfirmDialog(item);
			},
			
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		}
		$( "#dialog-form" ).dialog( "option", "buttons", myButtons );
		$( "#dialog-form" ).dialog( "open" );
		editBookmarkDialogOpen = true;
	}
	
	
	//******************//
	$("ul#favlist").on("click", ".editentry", function() {
		editFavoriteDialog(this);
	});
	
	
	function editFavoriteDialog(item) {
		$( "#dialog-form" ).dialog( "option", "title", "Edit Provider Information" );
		idStr = $( item ).attr("idstr");
		
		//build edit element
		name.val(document.getElementById("label" + idStr).textContent);
		url.val(document.getElementById("link" + idStr).getAttribute("href"));
		document.getElementById("editiconDiv").style.display = "none";
		
		var myButtons = {
			"Save": function() {
				if ( fieldsValidated() ) {
					//fix url if no protocol specified
					if (!checkRegexp( url, /:\/\//, "Adding http prefix" )) {
						url.val("http://" + url.val());
					}
					//update list element with new values
					//$("#" + idStr).html(favBuild1(idStr, url.val(), name.val()))
					updateListItem(idStr,  name.val(), url.val());
					
					$("#favlist").sortable("refresh");
					saveUserDataWriteNow();
					$( this ).dialog( "close" );
				} else {
					centerDialog("dialog-form");
				}
			},
			
			"Save As New Entry": function() {
				if ( fieldsValidated() ) {
					//fix url if no protocol specified
					if (!checkRegexp( url, /:\/\//, "Adding http prefix" )) {
						url.val("http://" + url.val());
					}
					//create a new entry and insert it before the one being edited
					var tmpID = getUniqueId();
					$("<li id='" + tmpID + "'>" + favBuild1(tmpID, url.val(), name.val()) + "</li>").insertBefore("#" + idStr);

					$("#favlist").sortable("refresh");
					saveUserDataWriteNow();
					$( this ).dialog( "close" );
				}
			},
			
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		}
		$( "#dialog-form" ).dialog( "option", "buttons", myButtons );
		$( "#dialog-form" ).dialog( "open" );
	}
	
	
	$( "#dialog-form" ).dialog({
		autoOpen: false,
		height: "auto",
		width: "auto",
		position: "center",
		draggable: false,   //---### was set to true
		resizable: false,   //---### was set to true
		//minHeight: 290,
		//minWidth: 380,
		modal: true,
		closeOnEscape: true,
		
		open: function() {
			clearTooltips();   //---### to prevent mis-located tooltip after dialog opens
			tips.text( "" );
			
			var dialogNode = document.getElementById("dialog-form").parentNode;
			dialogNode.style.fontSize = dialogZoomSetting() + "%";
			
			$( "#dialog-form" ).dialog( "option", "width", dialogWidth() );
			$( "#dialog-form" ).dialog( "option", "height", "auto" );
			$( "#dialog-form" ).dialog( "option", "position", "center" );
			editBookmarkDialogOpen = false;
			
			chrome.runtime.sendMessage(thisAppId, { min_dialog_window_height: dialogNode.offsetHeight + 20 + Math.round(4.5 * 16 * dialogZoomSetting() / 100) });   // set min_dialog_window_height to 0 when closing dialog		
		},
		
		close: function() {
			allFields.val( "" ).removeClass( "ui-state-error" );
			tips.text( "" );
			if (document.getElementById("editiconDiv").style.display != "block") {
				chrome.runtime.sendMessage(thisAppId, { min_dialog_window_height: 0 });
			}
			if (document.getElementById("editiconDiv").style.display != "none") {
				chrome.runtime.sendMessage(thisAppId, { close_icon_picker: true });
			}
			document.getElementById("editiconDiv").style.display = "none";
			clearTooltips();   //---### to prevent mis-located tooltip after dialog closes
		}
	});
	
	
	// Listen for messages from titlebar
	window.addEventListener('message', function(event) {
		if ("new_bookmark_icon" in event.data) {
			if (editBookmarkDialogOpen == true) {
				var iconPath = bookmarkIconsPath + event.data.new_bookmark_icon;
				//---### img.val(iconPath);
				document.getElementById("iconpathtext").textContent = iconPath;
				document.getElementById("bookmark-dialog-icon").src = iconPath;
				document.getElementById("bookmark-dialog-widget").title = iconImageLabel(iconPath);
			}
		}
	});
	
	
	function iconImageLabel(iconPath) {
		var tempArray = iconPath.split('/');
		var tempString = tempArray[tempArray.length - 1];
		return tempString.substr(0, tempString.lastIndexOf('.'))  + " icon selected";
	}

	
	//******************//
	///---###//---### $("ul#favlist,ul#providerlist").on("mouseenter","li", function() {
	$("ul#favlist").on("mouseenter","li", function() {
		$(this).css("background-color", "#EEEAE2");
		$(this).css("border-color", "#DEDAD2");
	}).on("mouseleave","li", function() {
		////// $(this).css("background-color", "#F6F4F0");
		////// $(this).css("border-color", "#F6F4F0");
		$(this).css("background-color", "#F2EFEC");
		$(this).css("border-color", "#F2EFEC");
		
	});
	
	
}); 
