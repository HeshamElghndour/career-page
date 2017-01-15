/**
 *
 * clearing plugin
 *
 * @package
 * @author Christian Blank <christian.blank@newego.de>
 * @since 2014-01-23
 * @version 1.0.0
 * @requires jQuery
 * @requires responsive
 *
 *
 * set clearing on first-child-elements on breakpoint-change-event
 *
 *

initialize it:

$('.js_grid').clearing();

$('.js_grid').clearing({
		clearValue: "left"
});

$('.js_grid').clearing({
		breakpoints: {
			480:2,
			1024:4
		},
		clearValue: "left" // left/right/both
});


 */


/**
 *
 * @param {jQuery} $
 * @param {window} window
 * @param {document} document
 * @param {undefined} undefined
 * @returns {undefined}
 */
;(function ( $, window, document, undefined ) {


    var pluginName = 'clearing';

	var defaults = {

		breakpoints: {
			768: 3,
			480: 2,
			320: 1
		},
		clearValue: "both"
	};


//	 sort breakpoints (inner function for sort())
	function SortByName(a, b){
		a = parseInt(a);
		b = parseInt(b);
	  return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	}

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
		
        this.options = $.extend( {}, defaults, options) ;

		// sort the breakpoints to handle them easier
		this.options.breakpoints_sorted = [];
		for (var k in this.options.breakpoints){
			this.options.breakpoints_sorted[this.options.breakpoints_sorted.length] = k;
		}
		this.options.breakpoints_sorted.sort(SortByName);
				

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }


	Plugin.prototype.getValueForBreakpoint = function (breakpoint) {
		// find the actual breakpoint definition
		if(typeof(this.options.breakpoints[breakpoint]) !== 'undefined'){
			return this.options.breakpoints[breakpoint];
		}
		var ret = 0;
		for(var k in this.options.breakpoints_sorted){
			var checkPoint = this.options.breakpoints_sorted[k];
			if(breakpoint >= checkPoint){
				ret = this.options.breakpoints[checkPoint];
			}
		}
		return ret;
	};


    Plugin.prototype.updateFloatings = function () {
		// set it now
		$this = this;
		var $elem = $(this.element);

		// find my definition
		var breakpoint = $.responsive.getCurrentBreakpoint();
		var count = $this.getValueForBreakpoint(breakpoint);
		$elem.children().css('clear','');
		// find my elements and set clear value
		$elem.children().filter(function( index ) { return index % count === 0; }).css('clear',this.options.clearValue);
	};

    Plugin.prototype.init = function () {
		
		// initialize plugin
		var $this = this;

		$.responsive.breakpointChange(function(){
			$this.updateFloatings();
		});

    };



    // plugin wrapper around the constructor,
    // preventing against multiple instantiations
	// allows calling public methods from Plugin
    $.fn[pluginName] = function ( ) {
		// find the method to call
		var method = arguments[0];
		var arguments_ = arguments;
		if(typeof(method) === "undefined"){
			method=false;
		}
		// loop all jquery Objects
		return this.each(function () {

			var publicMethod = $(this).data()['plugin_' + pluginName];
			if(typeof(publicMethod) === "undefined"){
				publicMethod={};
			}
			if (publicMethod[method]) {
				// call a poblic method on object
				method = publicMethod[method];
				arguments = Array.prototype.slice.call(arguments_, 1);
			} else if (typeof(method) === 'object' || !method) {
				// initialize it

				if (!$.data(this, 'plugin_' + pluginName)) {
					var a =  new Plugin( this, arguments_[0] );
					$.data(this, 'plugin_' + pluginName,a);
				}
				return;
			} else if(typeof(method) === "function"){
				// try to call it plain
			}else{
				// method not found
				$.error('Method ' + method + ' does not exist on jQuery.'+pluginName);
				return this;
			}
			 method.apply(publicMethod, arguments);
		});
    };


	function l(msg){
		if(typeof(console) !== 'undefined'){
			if(typeof(console.log) !== 'undefined'){
				console.log(msg);
			}
		}
	};

})( jQuery, window, document );