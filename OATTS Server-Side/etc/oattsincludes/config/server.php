<?php
include_once 'server_config.php';

define('WIDGETS_BASE_PATH', BASEDIR . '/' . 'widgets/');   // include trailing slash
define('WIDGET_ABS_PATH', $_SERVER['DOCUMENT_ROOT'] . WIDGETS_BASE_PATH);   // includes trailing slash
define('BOOKMARKICONS_BASE_PATH', BASEDIR . '/' . 'bookmark_icons/');   // include trailing slash
define('BOOKMARKICONS_ABS_PATH', $_SERVER['DOCUMENT_ROOT'] . BOOKMARKICONS_BASE_PATH);   // includes trailing slash

if (SECURE === false) {
	define('PROTOCOL', 'http');
} else {
	define('PROTOCOL', 'https');
}

$baseURL = PROTOCOL . '://' . BASEIP . BASEDIR;
define('REGISTERED', 10);
define('DATA_SIZE_LIMIT', 40000);
define('MAX_SESSION_IDLETIME', 3600 * 15);   //seconds-> hours
define('MAX_COOKIE_LIFETIME', 3600 * 16);   //seconds-> hours
define('HEART_BEAT_RATE', 1000 * 60);   //milliseconds-> seconds

define('DEFAULT_USER_AGENT', 'OATTS_CLIENT_v2_0');   //until we come up with something better

define('MAX_LOGIN_ATTEMPTS', 5);
define('MIN_LOGIN_WAIT', 60 * 2);
