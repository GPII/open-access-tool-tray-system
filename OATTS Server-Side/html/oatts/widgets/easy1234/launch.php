<?Header('content-type: application/x-javascript'); ?>

new traySystem.window(
{ 
	title:'Tlkio',
	url: 'http://tlk.io/tracetray',
	width:300,
	height:350,
	content: '<div style="height:95%;padding:10px"><iframe src="http://tlk.io/tracetray" width="100%" height="100%" style="z-index:1"></iframe></div>'
});

