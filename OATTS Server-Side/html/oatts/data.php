<?php

$widgets = array();
$h = opendir('widgets');
while( ($f = readdir($h)) !== false)
{
	if ($f == '.' || $f == '..') continue;
	if (!is_dir('widgets/'.$f)) continue;
	$filepath = 'widgets/'.$f.'/default.xml';
	if (file_exists($filepath))
	{
		$xml = simpleXML_load_file($filepath,"SimpleXMLElement",LIBXML_NOCDATA);
		$widgets[] = array(
			"name"=>$xml->name.'',
			"tooltip"=>$xml->tool_tip.'',
			"path"=>'widgets/'.$f.'/',
			"desc"=>$xml->full_description.'',
			"developer"=>$xml->developer.'',
			"license"=>$xml->license.'',
			"hyperlink"=>$xml->hyperlink.'',
			"requirements"=>$xml->requirements);
	}
}
closedir($h);

echo 'var widgetsData = '.json_encode($widgets).';';