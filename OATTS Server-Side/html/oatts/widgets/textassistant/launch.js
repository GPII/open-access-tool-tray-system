// Need to change the line below to be your widget alias (the folder it resides in)
// This is case sensitive and must be correct for the widget to work both "in site" and "out of site" (popup).

new traySystem.window(
{ 
	title:'Text Assistent',
	width:500,
	height:400,
	content: '<div style="height:80%;padding:20px;"><iframe src="http://spelling.ghotit.com/tst2.shtml?onPost=1" width="100%" height="100%"></iframe></div>'
});
