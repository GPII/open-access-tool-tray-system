
/**
 * Listens for the app restarting then re-creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 */
chrome.app.runtime.onRestarted.addListener(function() {
	runApp();
});


/**
 * Listens for the app restarting then re-creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  runApp();
  });
  
 
function runApp() {
	chrome.app.window.create( "main.html", {
		id: "mainwin",
		alwaysOnTop: false,
		frame: "none",
		outerBounds: { width: 800, height: 600, minWidth: 300, minHeight: 55 }
	});
}


