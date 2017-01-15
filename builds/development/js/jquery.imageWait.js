/**
 *
 * imageWait plugin
 *
 * @package 
 * @author Christian Blank <christian.blank@newego.de>
 * @since 2014-02-07
 * @version 1.0.0
 * @requires jQuery
 *
 *
 * Waits for images to be loaded (or failed)
 *
 *

use it:

$("body").imageWait({
	callback: function(){
		alert("all img done");
	}
});

or

$(".slider").imageWait({
	callback: function(){
		alert("all img done");
	}
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



    var pluginName = 'imageWait';
	
	var defaults = {
		callback: undefined
	};


    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;
		this.options.pendingImages = [];
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }


    Plugin.prototype.init = function () {
		
		var $this = this;
		
		
		$(this.element).find('img').each(function(){
			$this.checkImage($(this));
		});
		
		$this.checkPendings();

    };



	Plugin.prototype.checkPendings = function(){
		var $this = this;

		var pendingTmp = $this.options.pendingImages;
		$this.options.pendingImages = [];
		for(var k in pendingTmp){
			$this.checkImage(pendingTmp[k]);
		}
		if($this.options.pendingImages.length === 0){
			// call callback
			if(typeof($this.options.callback === "function")){
				$this.options.callback();
			}

			return true;;
		}
		window.setTimeout(function(){
			$this.checkPendings();
		},100);
	};

	Plugin.prototype.checkImage = function($img){
		var $this = this;
		if((!$img[0].complete && ($img[0].width === 0 || $img[0].naturalWidth === 0))  && document.readyState !== "complete"){
			// img not yet loaded
			$this.options.pendingImages[$this.options.pendingImages.length] = $img;
			return -1;
		}else{
			if($img[0].readyState === "uninitialized" || ($img[0].complete && $img[0].naturalWidth === 0)){
				// failed to load
				return -3;
			}else{
				// OK
				return 1;
			}
		}
	};




    // plugin wrapper around the constructor,
    // preventing against multiple instantiations
	// allows calling public methods from Plugin
    $.fn[pluginName] = $[pluginName] = function ( ) {
		// find the method to call
		var method = arguments[0];
		var pluginInstance  = undefined;
		var arguments_ = arguments;
		if(typeof(method) === "undefined"){
			method=false;
		}
		$this = this;
		if(typeof($this) === 'function'){
			$this = $(document);
		}
		var count =0;
		// loop all jquery Objects
		$this.each(function () {
			count = count +1;
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
					pluginInstance =  new Plugin( this, arguments_[0] );
					$.data(this, 'plugin_' + pluginName,pluginInstance);
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
		return pluginInstance;
    };


	function l(msg){
		if(typeof(console) !== 'undefined'){
			if(typeof(console.log) !== 'undefined'){
				console.log(msg);
			}
		}
	};
	
})( jQuery, window, document );