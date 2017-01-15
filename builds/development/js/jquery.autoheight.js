/**
 *
 * AutoHeight PlugIn
 *
 * @package
 * @author RS
 * @since 2014-11-28
 * @version 1.0.0
 * @requires jQuery
 *
 * Usage:
 *	$('...').autoHeight();
 *
 */


/**
 * @param {Object} NEWEGO
 * @param {jQuery} $
 * @param {window} window
 * @param {document} document
 * @param {undefined} undefined
 * @returns {undefined}
 */
;
(function ($) {
	var pluginName = 'autoHeight';

	/**
	 * Register as plugin with jQuery
	 */
	$.fn[pluginName] = $[pluginName] = function (mode) {
		var $elements = this;

		switch (mode) {
			case 'pump':
				// reset height inline style
				$elements.find('.js_auto_height_inner').css({height: ''});

				// compute height of heighest element
				var maxHeight = Math.max.apply(null, $elements.map(function () {
					return Math.ceil($(this).height());
				}).get());

				$elements.each(function () {
					var diff = maxHeight - $(this).height();
					var $pump = $(this).find('.js_auto_height_inner');
					var pumpBaseHeight = $pump.height();
					$pump.height(Math.ceil(pumpBaseHeight + diff));
				});
				break;

			default:
			case 'simple':
				// reset height inline style
				$elements.css('height', '');

				// compute height of heighest element
				var maxHeight = Math.max.apply(null, $elements.map(function () {
					return Math.ceil($(this).height());
				}).get());

				// apply height to all elements
				$elements.height(maxHeight);
				break;
		}

	};

})(jQuery);