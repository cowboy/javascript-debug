<?PHP

$shell['title1'] = "JavaScript Debug";
$shell['link1']  = "http://benalman.com/projects/javascript-debug-console-log/";

ob_start();
?>
  <a href="http://benalman.com/projects/javascript-debug-console-log/">Project Home</a>,
  <a href="http://benalman.com/code/projects/javascript-debug/docs/">Documentation</a>,
  <a href="http://github.com/cowboy/javascript-debug/">Source</a>
<?
$shell['h3'] = ob_get_contents();
ob_end_clean();

$shell['jquery'] = 'jquery-1.4.2.js';

$shell['shBrush'] = array( 'JScript' );

?>
