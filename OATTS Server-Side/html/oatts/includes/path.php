<?php
//---### For Docker container implementations, this file can be rewritten
//---### in start.sh to define the following constants appropriately.


//---### include only *ONE* of the following SERVER_CONTEXT_LABEL defines.
//---### NOTE: also used as part of an OATTS App version / variant text suffix
defined('SERVER_CONTEXT_LABEL') or define('SERVER_CONTEXT_LABEL', 'CAE-Sandbox');   // for CAE OattsSandbox server
// defined('SERVER_CONTEXT_LABEL') or define('SERVER_CONTEXT_LABEL', 'CAE');   // for CAE Oatts "Public" server
// defined('SERVER_CONTEXT_LABEL') or define('SERVER_CONTEXT_LABEL', 'RtF');   // for Oatts RtF Public server
//---### END of SERVER_CONTEXT_LABEL defines


if (SERVER_CONTEXT_LABEL === 'CAE-Sandbox') {   // for CAE OattsSandbox server
	defined('ROOT_PATH') or define('ROOT_PATH', '/home/vhosts/oattssandbox.trace.wisc.edu/etc/oattsincludes');
	
} else if (SERVER_CONTEXT_LABEL === 'CAE') {   // for CAE Oatts 'Public' server
	defined('ROOT_PATH') or define('ROOT_PATH', '/home/vhosts/oatts.trace.wisc.edu/etc/oattsincludes');
	
} else {   // for Oatts RtF Public server
	defined('ROOT_PATH') or define('ROOT_PATH', '/var/www/etc/oattsincludes');
}
