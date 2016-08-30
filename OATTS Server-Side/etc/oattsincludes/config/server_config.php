<?php
//---### For Docker container implementations, this file can be rewritten
//---### in start.sh to define the following constants and variables appropriately.


if (SERVER_CONTEXT_LABEL === 'CAE-Sandbox') {
	$globalDebug = false;   // if set, setting will override local settings
	define('SECURE', true);   // for HTTP/HTTPS
	define('SQL_SECURE',true);   // for mysql over ssl
	define('BASEIP', '');
	define('BASEDIR', '/oatts');   // what goes after BASEIP - include leading slash if not empty
	define('HOST', '');   // the host you want to connect to
	define('USER', '');   // the database username
	define('PASSWORD', '');   // the database password
	define('DATABASE', '');   // the database name
	
} else if (SERVER_CONTEXT_LABEL === 'CAE') {
	$globalDebug = false;   // if set, setting will override local settings
	define('SECURE', true);   // for HTTP/HTTPS
	define('SQL_SECURE',true);   // for mysql over ssl
	define('BASEIP', '');
	define('BASEDIR', '/oatts');   // what goes after BASEIP - include leading slash if not empty
	define('HOST', '');   // the host you want to connect to
	define('USER', '');   // the database username
	define('PASSWORD', '');   // the database password
	define('DATABASE', '');   // the database name
	
} else {
	//---### Sample code for including in a start.sh file in a Docker container implementation  
	//---### Will (probably) not run unmodified in this .php file
	$globalDebug = false;   // if set, setting will override local settings
	define("SECURE", $HTTP_SECURE);   // for HTTP/HTTPS
	define("SQL_SECURE", $SQL_SECURE);   // for mysql over ssl
	define("BASEIP", '$BASEIP');
	define('BASEDIR', '$BASEDIR');   // what goes after BASEIP - include leading slash if not empty
	define("HOST", "$DBHOST");   // the host you want to connect to
	define("USER", "$DBUSER");   // the database username
	define("PASSWORD", '$DBPASSWORD');   // the database password
	define("DATABASE", "$DBDB");   // the database name
}
?>
