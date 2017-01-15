/**
 * responsive.js
 *
 * @since 2014-02-01
 * @version 1.0.3
 * @author Christian Blank <christian.blank@newego.de>
 * breakpoint is now >= (was >)
 * ==> eg. 768px is now bp_768 (was bp_640)
 *
 *
 * @since 2014-01-20
 * @version 1.0.2
 * @author Christian Blank <christian.blank@newego.de>
 * callbacks are now called when they're added
 * - to get a callback-call it page was resized BEFORE the callback was added
 *
 *
 * @since 2014-01-20
 * @version 1.0.1
 * @author Christian Blank <christian.blank@newego.de>
 * fixed onload body-classes
 *
 *
 * @package general
 * @author Christian Blank <christian.blank@newego.de>
 * @since 2014-01-16
 * @version 1.0.0
 * @requires jQuery
 *
 *
 * determines current Breakpoint on window-resize-events and adds Classes to <body>
 * callbacks for js
 * getCurrentBreakpoint();
 * getNextBreakpoint();
 * getPrevBreakpoint();
 * enableDebug(true); -> a console.log on breakpoint-change
 *


try it out:

$.responsive.breakpointChange(function(breakpoint){
	console.log(breakpoint);
	$.responsive.enableDebug(true);
	console.log("current: "+$.responsive.getCurrentBreakpoint());
	console.log("next: "+$.responsive.getNextBreakpoint());
	console.log("prev: "+$.responsive.getPrevBreakpoint());
});

 */

/**
 *
 * @param {jQuery} $
 * @param {window-obj} window
 * @returns {undefined}
 */
(function ($, window) {
	// some nice vars to use
	var responsive = 'responsive';
	var breakpointChangeCallbacks = [];
	var breakpoints = [320,480,600,640,768,840,900,1000,1024,1050,1100,1200,1300];
	var currBreakpoint=-1;
	var debug=false;


	var init  = function(){
		// initialize me
		breakpoints.sort(SortByName);
		$(window).resize(function(){
			resize();
		});
		resize();
	};

	// called on resize() and init
	var resize = function(){
		var currentWindowWidth = $(window).innerWidth();
//		var currentWindowH = $(window).innerHeight();
//alert(currentWindowWidth);
//alert(currentWindowH);
		var newBreakpoint = 0;
		// check breakpoints
		for(var k in breakpoints){
			if(currentWindowWidth >= breakpoints[k]){
				if(breakpoints[k] >= newBreakpoint){
					newBreakpoint = breakpoints[k];
				}
			}
		}

		// changed
		if(newBreakpoint !== currBreakpoint){
			currBreakpoint = newBreakpoint;

			// set Classes to <body>
			for(var k in breakpoints){
				if(newBreakpoint >= breakpoints[k]){
					$("body").addClass("bp_"+breakpoints[k]);
				}else{
					$("body").removeClass("bp_"+breakpoints[k]);
				}
			}
			_debug("NEW Breakpoint "+newBreakpoint);
			// call callbacks
			for(var k in breakpointChangeCallbacks){
				breakpointChangeCallbacks[k](newBreakpoint);
			}
		}
	};

	// sort breakpoints (inner function for sort())
	function SortByName(a, b){
	  return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	}
	// sort breakpoints (inner function for sort())
	function _debug(msg){
		if(debug){
			console.log(msg);
		}
	}

	// init public methods
	var publicMethod = $.fn[responsive] = $[responsive] = function () {
		var $this = this;
		init();
		return $this;
	};

	// enable/disable debug
	publicMethod.enableDebug = function (enabled) {
		debug=enabled;
	};
	// register callbacks
	publicMethod.breakpointChange = function (callback) {
		breakpointChangeCallbacks[breakpointChangeCallbacks.length] = callback;
		/**
		 * @since 1.0.2
		 */
		callback(currBreakpoint);
	};

	// return the current breakpoint (in px)
	publicMethod.getCurrentBreakpoint = function () {
		return currBreakpoint;
	};

	// return the next breakpoint (or current, if it is the last)
	publicMethod.getNextBreakpoint = function () {
		for(var k in breakpoints){
			if(breakpoints[k] > currBreakpoint){
				return breakpoints[k];
			}
		}
		return currBreakpoint;
	};

	// return the previous breakpoint (or current, if none)
	publicMethod.getPrevBreakpoint = function () {
		for(var k in breakpoints){
			if(breakpoints[k] > currBreakpoint){
				if(typeof(breakpoints[k-2]) !== "undefined"){
					return breakpoints[k-2];
				}else{
					return currBreakpoint;
				}
			}
		}
		return currBreakpoint;
	};

	$(document).ready(function(){
		// start it up
		$.responsive();
	});

}(jQuery, window));



