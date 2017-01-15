/**
 * @fileOverview Function for styling the different form elements like dropdowns, checkboxen and radiobuttons
 * @author Moritz Jäger <jaeger.moritz@newego.de>
 * @since 2013-04-22
 *
 *
 */

/**
 * @returns {undefined}
 * @description check if jQuery is loaded on this site, else include it.
 */
(function($) {
	var methods = {
		init: function(options) {

			var countFunctionCall = 1;
			// Repeat over each element in selector
			return this.each(function() {
				var $this = $(this);
				// Attempt to grab saved settings, if they don't exist we'll get "undefined".
				var settings = $this.data('stylingDropdown');
				// If we could't grab settings, create them from defaults and passed options
				if (typeof(settings) === 'undefined') {
					var defaults = {
						optList: "optionList",
						actOption: "select",
						optListElem: "optionListElem",
						onSomeEvent: function() {
						}
					};
					settings = $.extend({}, defaults, options);
					// Save our newly created settings
					$this.data('stylingDropdown', settings);
				} else {
					// We got settings, merge our passed options in with them (optional)
					settings = $.extend({}, settings, options);
					// If you wish to save options passed each time, add:
					// $this.data('stylingDropdown', settings);
				}


				/* optValue is used to save the current option text*/
				var optValue;

				/* init text variable */
				var text;
				/* array with the text of the option elements*/
				var optionList = new Array();
				/**
				 * @todo: UNUSED
				 * array with the value of the option elements*/
				var optionList_value = new Array();

				/* counted options */
				var optionListLength = $(this).children().length;

				/* counter for "optionList" and "optionList_value" Array */
				var i = 0;


				/* get the text of the first/selected element to show at initial calling */
				if ($('option:selected', this).val() !== '') {
					text = $('option:selected', this).text();
				} else {
					text = $('option:first', this).text();
				}

				/* if text isn't empty create a span to show current selected option. And create a div as option container.*/
				if ($.trim(text) !== '') {
					$this.after('<span class="' + settings.actOption + '"><span class="' + settings.actOption + '-inner">' + text + '</span></span>');
					$this.next().after("<div class='" + settings.optList + "'></div>");


					$this.children('option').each(function() {
						optionList[i] = $(this).text();
						optionList_value[i] = $this.attr('value');
						i++;
					});

					/* fill the option container in a loop. */
					for (var x = 0; x < optionListLength; x++) {
						$this.next().next("." + settings.optList).append('<div id="opt_' + countFunctionCall + '-' + +x + '" class=' + settings.optListElem + '>' + optionList[x] + '</div>');
					}

					/*hide first element - special case*/
//						$('.' + settings.optList + ' .' + settings.optListElem + ':first-child').hide();

					/*hide the generated option list*/
					$this.next().next("." + settings.optList).hide();


					/* show/hide the option generated option container on click event */
					$this.next("span." + settings.actOption).click(function() {
//						$(this).next("." + settings.optList).slideToggle(20);
						if (!$(this).next("." + settings.optList).is(':visible')) {
							$(this).next("." + settings.optList).show();
						} else {
							$(this).next("." + settings.optList).hide();
						}
					});

					/*set the option text into the generated span by clicking on a generated option element.*/
					$this.next('span').next("." + settings.optList).children('.' + settings.optListElem).click(function() {
						optValue = $(this).text();
						$(this).parent("." + settings.optList).prev("." + settings.actOption).children().text(optValue);
						/* slideUp the option container*/
//						$(this).parent("." + settings.optList).slideUp(20);
						$(this).parent("." + settings.optList).hide();
						/*unset the selected attribute on all option*/
						$this.children('option').removeAttr("selected", "selected");
						/*set the real option in the select field as selected, so the right option will be transmitted by submitting the form*/

						/*This fails for ex. for "Mr" and "Mrs".*/
//						$this.children("option:contains('" + optValue + "')").attr("selected", "selected");
						$this.children("option").each(function(){
							if($(this).text() === optValue) {
								$(this).attr("selected", "selected");
							}
						});

						$this.blur();
					});
				}


				/**
				 * @todo add new option for open more than one optionlist at the same time
				 */
				/*close optionlist clicking somewhere else */
				$(document).bind('click', function(e) {
					if (
							$(e.target).is($this) ||
							$(e.target).is($this.next("span." + settings.actOption)) ||
							$(e.target).is($this.next("span." + settings.actOption).children("span." + settings.actOption + "-inner"))
							) {

					} else {
//						$this.next("span." + settings.actOption).next("." + settings.optList).slideUp(20);
						$this.next("span." + settings.actOption).next("." + settings.optList).hide();

					}
				});

				/* count the function calls to prevent dublicated id's */
				countFunctionCall++;
			});
		},
		destroy: function(options) {
			// Repeat over each element in selector
			return $(this).each(function() {
				var $this = $(this);
				// Remove settings data when deallocating our plugin
				$this.removeData('stylingDropdown');
			});
		}
	};

	$.fn.stylingDropdown = function() {
		var method = arguments[0];

		if (methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if (typeof(method) === 'object' || !method) {
			method = methods.init;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.stylingDropdown');
			return this;
		}

		return method.apply(this, arguments);

	};

})(jQuery);



$(document).ready(function() {


	/**
	 * @param {string} optList set a classname for your option list
	 * @param {string} actOption set a classname for the shown option element
	 * @param {string} optListElem set a classname for the option list elements
	 */
	$("select.select").stylingDropdown({
		optList: "optionList",
		actOption: "select",
		optListElem: "selectOption"
	});
});
