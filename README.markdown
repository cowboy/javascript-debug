# JavaScript Debug: A simple wrapper for console.log #
[http://benalman.com/projects/javascript-debug-console-log/](http://benalman.com/projects/javascript-debug-console-log/)

Version: 0.4, Last updated: 6/22/2010

This code provides a simple wrapper for the console's logging methods, and was created to allow a very easy-to-use, cross-browser logging solution, without requiring excessive or unwieldy object detection. If a console object is not detected, all logged messages will be stored internally until a logging callback is added. If a console object is detected, but doesn't have any of the `debug`, `info`, `warn`, and `error` logging methods, `log` will be used in their place. For convenience, some of the less common console methods will be passed through to the console object if they are detected, otherwise they will simply fail gracefully.

Visit the [project page](http://benalman.com/projects/javascript-debug-console-log/) for more information and usage examples!


## Documentation ##
[http://benalman.com/code/projects/javascript-debug/docs/](http://benalman.com/code/projects/javascript-debug/docs/)


## Examples ##
[http://benalman.com/code/projects/javascript-debug/examples/debug/](http://benalman.com/code/projects/javascript-debug/examples/debug/)


## Support and Testing ##

### Browsers Tested ###
Internet Explorer 6-8, Firefox 3-3.6, Safari 3-4, Chrome 3-5, Opera 9.6-10.5


## License ##
Copyright (c) 2010 "Cowboy" Ben Alman  
Dual licensed under the MIT and GPL licenses.  
[http://benalman.com/about/license/](http://benalman.com/about/license/)
