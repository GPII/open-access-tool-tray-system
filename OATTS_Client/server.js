
// var PROTOCOL = "http://";
var PROTOCOL = "https://";


//---### include only *ONE* of the following MAIN_IP definitions
// var MAIN_IP = "oattssandbox.trace.wisc.edu";   // for CAE OattsSandbox server
// var MAIN_IP = "oatts.trace.wisc.edu";   // for CAE Oatts "Public" server
var MAIN_IP = "oatts.raisingthefloor.org";   // for Oatts RtF server
//---### END of MAIN_IP definitions


//---### include only *ONE* of the following MAIN_PATH definitions
// var MAIN_PATH = PROTOCOL + MAIN_IP + "/oatts/";   // for both CAE Oatts servers
var MAIN_PATH = PROTOCOL + MAIN_IP + "/";   // for Oatts RtF servers
//---### END of MAIN_PATH definitions


var MAIN_URL = MAIN_PATH + "login.php";
var LOGOUT_URL = MAIN_PATH + "includes/process_logout.php";
