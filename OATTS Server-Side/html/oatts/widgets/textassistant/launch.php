<?Header('content-type: application/x-javascript'); ?>

// Need to change the line below to be your widget alias (the folder it resides in)
// This is case sensitive and must be correct for the widget to work both "in site" and "out of site" (popup).
var alias = 'textassistant';
var handle = 'BaseDiv'+alias;
MakeBase(handle,'Text Assistant Widget');

with(this[handle].style)
{
height="480px";
}


/*
MakeDiv('textassistWidgetWindow','','drsElement');
with(this.textassistWidgetWindow.style)
{
position="absolute";
top=h + 100+"px";
left="100px";
width="810px";
height="480px";
background="#FFE";
zIndex="100000";
boxShadow=MsBoxShadow=OBoxShadow=MozBoxShadow=WebkitBoxShadow="0 0 25px #000";
borderLeft=borderTop="2px ridge white";
borderBottom=borderRight="2px ridge black";
}
*/

MakeDiv('textassistWidgetWindowiFrame','<iframe src="http://spelling.ghotit.com/tst2.shtml?onPost=1" width="100%" height="100%"></iframe>','',handle,'1');
with(this.textassistWidgetWindowiFrame.style)
{
height="80%";
padding="20px";
}
