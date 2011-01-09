/*!
* JavaScript Debug - v0.4 - 6/22/2010
* http://benalman.com/projects/javascript-debug-console-log/
* 
* Copyright (c) 2010 "Cowboy" Ben Alman
* Dual licensed under the MIT and GPL licenses.
* http://benalman.com/about/license/
* 
* With lots of help from Paul Irish!
* http://paulirish.com/
*/

// Script: JavaScript Debug: A simple wrapper for console.log
//
// *Version: 0.4, Last Updated: 6/22/2010*
// 
// Tested with Internet Explorer 6-8, Firefox 3-3.6, Safari 3-4, Chrome 3-8, Opera 9.6-11
// 
// Home       - http://benalman.com/projects/javascript-debug-console-log/
// GitHub     - http://github.com/cowboy/javascript-debug/
// Source     - http://github.com/cowboy/javascript-debug/raw/master/ba-debug.js
// (Minified) - http://github.com/cowboy/javascript-debug/raw/master/ba-debug.min.js (1.1kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// Examples - http://benalman.com/code/projects/javascript-debug/examples/debug/
// 
// About: Revision History
// 
// 0.4 - (6/22/2010) Added missing passthrough methods: exception, groupCollapsed, table
// 0.3 - (6/8/2009) Initial release
// 
// Topic: Pass-through console methods
// 
// assert, clear, count, dir, dirxml, exception, group, groupCollapsed,
// groupEnd, profile, profileEnd, table, time, timeEnd, trace
// 
// These console methods are passed through (but only if both the console and
// the method exists), so use them without fear of reprisal. Note that these
// methods will not be passed through if the logging level is set to 0 via
// <debug.setLevel>.

window.debug = (function ()
{
	var window = this,
	document = window.document,

	// Some convenient shortcuts.
	aps = Array.prototype.slice,
	con = window.console,

	// Public object to be returned.
	that = {},

	callback_func,
	callback_force,

	// Default logging level, show everything.
	log_level = 9,

	// Logging methods, in "priority order". Not all console implementations
	// will utilize these, but they will be used in the callback passed to
	// setCallback.
	log_methods = ['error', 'warn', 'info', 'debug', 'log'],

	// Pass these methods through to the console if they exist, otherwise just
	// fail gracefully. These methods are provided for convenience.
	pass_methods = 'assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace'.split(' '),
	idx = pass_methods.length,

	domInsertion = false,
	domWriter = document.createElement('div'),

	// Logs are stored here so that they can be recalled as necessary.
	logs = [];

	while (--idx >= 0)
	{
		(function (method)
		{

			// Generate pass-through methods. These methods will be called, if they
			// exist, as long as the logging level is non-zero.
			that[method] = function ()
			{
				con = window.console; // A console might appears anytime
				
				if(log_level !== 0 && con)
				{
					if(con[method] && typeof(con[method].apply) != 'undefined')
						con[method].apply(con, arguments);
					else
					{
						var args = aps.call(arguments);
						if(method.indexOf('group') != -1)
						{
							args.unshift('['+method+']');
							that['log'](args.join(' '));
						}
					}
				}
			}

		})(pass_methods[idx]);
	}

	idx = log_methods.length;
	while (--idx >= 0)
	{
		(function (idx, level)
		{

			// Method: debug.log
			// 
			// Call the console.log method if available. Adds an entry into the logs
			// array for a callback specified via <debug.setCallback>.
			// 
			// Usage:
			// 
			//  debug.log( object [, object, ...] );
			// 
			// Arguments:
			// 
			//  object - (Object) Any valid JavaScript object.

			// Method: debug.debug
			// 
			// Call the console.debug method if available, otherwise call console.log.
			// Adds an entry into the logs array for a callback specified via
			// <debug.setCallback>.
			// 
			// Usage:
			// 
			//  debug.debug( object [, object, ...] );
			// 
			// Arguments:
			// 
			//  object - (Object) Any valid JavaScript object.

			// Method: debug.info
			// 
			// Call the console.info method if available, otherwise call console.log.
			// Adds an entry into the logs array for a callback specified via
			// <debug.setCallback>.
			// 
			// Usage:
			// 
			//  debug.info( object [, object, ...] );
			// 
			// Arguments:
			// 
			//  object - (Object) Any valid JavaScript object.

			// Method: debug.warn
			// 
			// Call the console.warn method if available, otherwise call console.log.
			// Adds an entry into the logs array for a callback specified via
			// <debug.setCallback>.
			// 
			// Usage:
			// 
			//  debug.warn( object [, object, ...] );
			// 
			// Arguments:
			// 
			//  object - (Object) Any valid JavaScript object.

			// Method: debug.error
			// 
			// Call the console.error method if available, otherwise call console.log.
			// Adds an entry into the logs array for a callback specified via
			// <debug.setCallback>.
			// 
			// Usage:
			// 
			//  debug.error( object [, object, ...] );
			// 
			// Arguments:
			// 
			//  object - (Object) Any valid JavaScript object.

			that[level] = function ()
			{
				var args = aps.call(arguments),
				log_arr = [level].concat(args);

				logs.push(log_arr);
				if (domInsertion)
				{
					var txtNode = document.createTextNode(log_arr);
					domWriter.appendChild(txtNode);
					domWriter.appendChild(document.createElement('br'));
				}
				exec_callback(log_arr);

				con = window.console; // A console might appears anytime

				if (!is_level(idx))
					return;

				if (!con && !domInsertion)
				{
					//alert('Meh! You have no console :-( You should use debug.setDomInsertion(true); or debug.exportLogs();');
					return;
				}

				con[level] ? trace(level, args) : trace('log', args); // Degradation path
			};

		})(idx, log_methods[idx]);
	}
	
	// Call the browser console logger
	function trace(level, args)
	{
		if (typeof (con[level].apply) != 'undefined')
		{
			con[level].apply(con, args); // FireFox || Firebug Lite || Opera || Chrome
		}
		else
		{
			con[level](args.join(' ')); // IE 8 (at least)
		}
	}

	// Execute the callback function if set.
	function exec_callback(args)
	{
		if (callback_func && (callback_force || !con || !con.log))
		{
			callback_func.apply(window, args);
		}
	};

	// Method: debug.setLevel
	// 
	// Set a minimum or maximum logging level for the console. Doesn't affect
	// the <debug.setCallback> callback function, but if set to 0 to disable
	// logging, <Pass-through console methods> will be disabled as well.
	// 
	// Usage:
	// 
	//  debug.setLevel( [ level ] )
	// 
	// Arguments:
	// 
	//  level - (Number) If 0, disables logging. If negative, shows N lowest
	//    priority levels of log messages. If positive, shows N highest priority
	//    levels of log messages.
	//
	// Priority levels:
	// 
	//   log (1) < debug (2) < info (3) < warn (4) < error (5)

	that.setLevel = function (level)
	{
		log_level = typeof level === 'number' ? level : 9;
	};

	// Determine if the level is visible given the current log_level.
	function is_level(level)
	{
		return log_level > 0 ? log_level > level : log_methods.length + log_level <= level;
	};

	// Method: debug.setCallback
	// 
	// Set a callback to be used if logging isn't possible due to console.log
	// not existing. If unlogged logs exist when callback is set, they will all
	// be logged immediately unless a limit is specified.
	// 
	// Usage:
	// 
	//  debug.setCallback( callback [, force ] [, limit ] )
	// 
	// Arguments:
	// 
	//  callback - (Function) The aforementioned callback function. The first
	//    argument is the logging level, and all subsequent arguments are those
	//    passed to the initial debug logging method.
	//  force - (Boolean) If false, log to console.log if available, otherwise
	//    callback. If true, log to both console.log and callback.
	//  limit - (Number) If specified, number of lines to limit initial scrollback
	//    to.

	that.setCallback = function ()
	{
		var args = aps.call(arguments),
		max = logs.length,
		i = max;

		callback_func = args.shift() || null;
		callback_force = typeof args[0] === 'boolean' ? args.shift() : false;

		i -= typeof args[0] === 'number' ? args.shift() : max;

		while (i < max)
		{
			exec_callback(logs[i++]);
		}
	};

	that.setDomInsertion = function (active, className)
	{
		domInsertion = active;
		if (active && document.body)
		{
			document.body.appendChild(domWriter);
			var c = 'debug';
			if (typeof (className) == 'string')
				c = className;
			domWriter.className = c;
		}
		else
			domWriter.parentNode.removeChild(domWriter);
	};

	function isElement(obj)
	{
		try
		{
			// Using W3 DOM2 (works for FF, Opera and Chrom)
			return obj instanceof HTMLElement;
		}
		catch (e)
		{
			// Browsers not supporting W3 DOM2 don't have HTMLElement.
			// Testing some properties that all elements have.
			return (typeof obj === 'object') && (obj.nodeType === 1) && (typeof obj.style === 'object') && (typeof obj.ownerDocument === 'object');
		}
	}

	that.exportLogs = function (elem)
	{
		if (isElement(elem))
		{
			elem.innerHTML = logs.join('<br />');
		}
	};

	return that;
})();
