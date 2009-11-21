<?PHP

include "../index.php";

$shell['title3'] = "JavaScript Debug";

$shell['h2'] = 'A simple wrapper for console.log.';

// ========================================================================== //
// SCRIPT
// ========================================================================== //

ob_start();
?>
// What log_stuff() is actually doing:

var a = 0,
  b = 'two',
  c = { foo: 1, bar: 2, baz: 'three' },
  d = false,
  e = [ 3, 4, 5, 6, 7, 8 ];

function log_stuff() {
  a++;
  d = !d;
  
  debug.group( 'start of group' );
  debug.log( a );
  debug.debug( b );
  debug.info( c );
  debug.warn( d );
  debug.error( e );
  debug.groupEnd();
  
  debug.time( 'test' );
  
  debug.log( a, b, c, d, e );
  debug.log([ a, b, c, d, e ]);
  
  (function() { debug.log( arguments ); })( a, b, c, d, e );
  
  debug.timeEnd( 'test' );
};
<?
$shell['script'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// HTML HEAD ADDITIONAL
// ========================================================================== //

ob_start();
?>
<script type="text/javascript" src="../../shared/jquery.ba-bbq.js"></script>
<script type="text/javascript" language="javascript">

var qs = $.deparam.querystring( true );
if ( qs.level !== undefined ) {
  debug.setLevel( qs.level );
}

<?= $shell['script']; ?>

log_stuff();


$(function(){
  
  var nav = $('#nav ul');
  
  if ( qs.level !== undefined ) {
    $('#setLevel').querystring( {}, 2 );
  }
  
  $('<li/>')
    .appendTo( nav )
    .append('Don\'t have a console? Debug output will be stored until you: <ul/>')
    .find( 'ul' )
      .append('<li><a href="#"><code>debug.setCallback<\/code> using Firebug lite<\/a><\/li>')
      .find('a:last')
        .click(function(){
          init_callback_firebuglite();
          return false;
        })
        .end()
      .append('<li><a href="#"><code>debug.setCallback<\/code> using basic inline logging code<\/a><\/li>')
      .find('a:last')
        .click(function(){
          init_callback_inpage();
          return false;
        });
  
  $('<li/>')
    .appendTo( nav )
    .append('On this page <a href="#"><code>log_stuff();<\/code><\/a> is executed once when the page loads, and yes, the console error is intentional. Click this link again for more log output.')
    .find('a:last')
      .click(function(){
        log_stuff();
        return false;
      });
  
  SyntaxHighlighter.highlight();
});

function init_callback_inpage() {
  function debug_callback( level ) { 
    var args = Array.prototype.slice.call( arguments, 1 ); 
    $('#debug').length || $('<div id="debug"><h2>debug output<\/h2><\/div>').appendTo( 'body' ); 
    $('<div/>') 
      .addClass( 'debug-' + level ) 
      .html( '[' + level + '] ' + args ) 
      .appendTo( '#debug' ); 
  };
  debug.setCallback( debug_callback, true );
}

function init_callback_firebuglite() {
  if ( !window.firebug ) {
    
    // from firebug lite bookmarklet
    window.firebug = document.createElement('script');
    firebug.setAttribute( 'src', 'http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js' );
    document.body.appendChild( firebug );
    (function(){
      if ( window.firebug.version ) {
        firebug.init();
      } else {
        setTimeout( arguments.callee );
      }
    })();
    void( firebug );
    
    if ( window.debug && debug.setCallback ) {
      (function(){
        if ( window.firebug && window.firebug.version ) {
          debug.setCallback(function( level ) {
            var args = Array.prototype.slice.call( arguments, 1 );
            firebug.d.console.cmd[level].apply( window, args );
          }, true);
        } else {
          setTimeout( arguments.callee, 100);
        }
      })();
    }
  }
}

</script>
<style type="text/css" title="text/css">

/*
bg: #FDEBDC
bg1: #FFD6AF
bg2: #FFAB59
orange: #FF7F00
brown: #913D00
lt. brown: #C4884F
*/

#page {
  width: 700px;
}

.deparam {
  width: 343px;
}

.deparam-1 {
  float: left;
}

.deparam-2 {
  float: right;
}

.current {
  color: #FF7F00;
  text-decoration: none;
}

</style>
<?
$shell['html_head'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// HTML BODY
// ========================================================================== //

ob_start();
?>
<?= $shell['donate'] ?>

<h3>Examples</h3>

<div id="nav">
  <ul>
    <li>Using WebKit or Firefox + Firebug? View the console, it's all in there!</li>
    <li>Toggle console logging with <a id="setLevel" href="?level=0"><code>debug.setLevel(0)</code></a> (this will reload the page).</li>
  </ul>
</div>

<h3>Bookmarklet</h3>
<p><a href="javascript:if(!window.firebug){window.firebug=document.createElement(&quot;script&quot;);firebug.setAttribute(&quot;src&quot;,&quot;http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js&quot;);document.body.appendChild(firebug);(function(){if(window.firebug.version){firebug.init()}else{setTimeout(arguments.callee)}})();void (firebug);if(window.debug&&debug.setCallback){(function(){if(window.firebug&&window.firebug.version){debug.setCallback(function(b){var a=Array.prototype.slice.call(arguments,1);firebug.d.console.cmd[b].apply(window,a)},true)}else{setTimeout(arguments.callee,100)}})()}};">Debug + Firebug Lite</a>
- if the page doesn't use debug.js, this bookmarklet will just open Firebug Lite. If the page does use debug.js, the bookmarklet will open Firebug Lite and pre-populate it with any already-logged items.
</p>

<h3>The code</h3>

<pre class="brush:js">
<?= htmlspecialchars( $shell['script'] ); ?>
</pre>

<?
$shell['html_body'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// DRAW SHELL
// ========================================================================== //

draw_shell();

?>
