/**
 *
 * imageblur plugin
 *
 * @package
 * @author Christian Blank <christian.blank@newego.de>
 * @since 2014-02-05
 * @version 1.0.0
 * @requires jQuery
 * @requires nelibs script
 * @requires loads StackBlur
 *
 *
 * blur an image
 *
 *

initialize it:
$('#srcimg').imageblur({
	srcimg: 'srcimg',  
	canvas: 'canvas',
	blurRadius: 3
});

blur again:
$('#srcimg').imageblur('blur',{
	blurRadius: 10
});




HTML:
	<div style="position:absolute;left:20px; top:20px;">
		<img class="blur" id="srcimg" src="img/canvas.png"><br>
	</div>
	<div style="position:absolute;left:20px; top:20px;">
		<canvas height="375" width="500" style="width: 500px; height: 375px;" id="canvas">
		</canvas>
	</div>


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


    var pluginName = 'imageblur';

	var defaults = {

		srcimg: "srcimg",
		canvas: "canvas",
		blurRadius: 10

	};


    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }


    Plugin.prototype.init = function () {
		var $this = this;

		if(NELibs.browser.isIElte(8)){
			$this.blur($this.options);
		}else{
//			NELibs.loadJs("StackBlur.js",function(){
				$this.blur($this.options);
//			});
		}
    };

    Plugin.prototype.blur = function (options) {
		this.options = $.extend( {}, this.options, options) ;
		
		var $this = this;
		
		if(NELibs.browser.isIElte(8)){
			$('#'+$this.options.srcimg).css('filter',"progid:DXImageTransform.Microsoft.Blur(PixelRadius='"+$this.options.blurRadius+"')");
		}else{
			$('#'+$this.options.srcimg).hide();
			stackBlurImage( $this.options.srcimg, $this.options.canvas, $this.options.blurRadius, false );
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