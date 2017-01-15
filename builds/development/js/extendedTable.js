function in_array(item, arr) {
	for (p = 0; p < arr.length; p++)
		if (item === arr[p])
			return true;
	return false;
}

(function($) {

	var keyFiguresBreakpoint = '';

	var extendedConfigTableMethods = {
		init: function(options) {

			String.prototype.trim = function() {
				return this.replace(/^\s+|\s+$/g, "");
			}
			String.prototype.ltrim = function() {
				return this.replace(/^\s+/, "");
			}
			String.prototype.rtrim = function() {
				return this.replace(/\s+$/, "");
			}

			var countFunctionCall = 1;
			// Repeat over each element in selector
			return this.each(function() {
				var $this = $(this);
				// Attempt to grab saved settings, if they don't exist we'll get "undefined".
				var settings = $this.data('extendedConfigTable');
				// If we could't grab settings, create them from defaults and passed options
				if (typeof(settings) === 'undefined') {
					var defaults = {
						filterTriggerToggleElem: ".table-filter",
						filterToggleElem: ".table-filter ul",
						onSomeEvent: function() {
						}
					};
					settings = $.extend({}, defaults, options);
					// Save our newly created settings
					$this.data('extendedConfigTable', settings);
				} else {
					// We got settings, merge our passed options in with them (optional)
					settings = $.extend({}, settings, options);
					// If you wish to save options passed each time, add:
					// $this.data('stylingDropdown', settings);
				}
				var toggle_cls_prefix = "tf" + countFunctionCall + "_";

				$this.find(settings.filterTriggerToggleElem).click(function() {
					$(this).toggleClass("open");
					$(this).parent().find(settings.filterToggleElem).toggle();
				});

				$this.find(settings.filterTriggerToggleElem).on("clickoutside", function(e) {
					if ($(e.target).is(".table_filter_checkboxes") || $(e.target).parents(".table_filter_checkboxes").length) {
						return false;
					} else {
						$(this).removeClass("open");
						$(this).parent().find(settings.filterToggleElem).hide();
						return true;
					}
				});



				var id = "";
				var idcounter = 0;
				var id_prefix = "id" + countFunctionCall + "_";

				var y = 0;
				var tableHeaderYearArray = [];
				$this.children().find(".years .cell").not(":first-child").each(function() {
					if ($(this).children().length <= 0 && $(this).text().trim() !== "") {
						var thisText = $(this).text();
						if (!in_array(thisText, tableHeaderYearArray)) {
							tableHeaderYearArray[y] = $(this).text();
							$this.find(settings.filterToggleElem + " ul").append('<li><input type="checkbox" name="toggle-cols" value="' + id + '" class="' + toggle_cls_prefix + y + ' year " id="' + id_prefix + idcounter + '"/> <label for="' + id_prefix + idcounter + '">' + $(this).text() + '</label></li>');
							idcounter++;
						}
						$(this).attr("data-year", toggle_cls_prefix + y);
					}
					y++;
				});

				var yearsHeaderCounter = 0;
				var tableHeaderQuaterArray = [];
				$this.children().find(".quaters>.cell").not(":first-child").each(function() {
					var i = 0;
					$(this).find(".table .cell").each(function() {
						if ($(this).children().length <= 0 && $(this).text().trim() !== "") {
							var thisText = $(this).text();
							if (!in_array(thisText, tableHeaderQuaterArray)) {
								tableHeaderQuaterArray[i] = $(this).text();
								$this.find(settings.filterToggleElem + " ul").append('<li><input type="checkbox" name="toggle-cols"  value="' + id + '" class="' + toggle_cls_prefix + i + ' quater" id="' + id_prefix + idcounter + '"/> <label for="' + id_prefix + idcounter + '">' + $(this).text() + '</label></li>');
								idcounter++;
							}
							$(this).attr("data-quater", toggle_cls_prefix + i);
						}
						i++;
					});
					$(this).attr("data-year", toggle_cls_prefix + yearsHeaderCounter);
					yearsHeaderCounter++;
				});
				$(this).find(".tbody").children(".row").each(function() {
					var yearsCounter = 0;
					$(this).children(".cell").not(":first-child").each(function() {
						var tb = 0;
						$(this).find(".table .cell").each(function() {
							$(this).attr("data-quater", toggle_cls_prefix + tb);
							tb++;
						});
						$(this).attr("data-year", toggle_cls_prefix + yearsCounter);
						yearsCounter++;
					});
				});

				$this.bind("updateCheck", function() {

					if (keyFiguresBreakpoint == currentBreakpoint) {
						return;
					}

					$this.find(".cell").each(function() {

						if ($(this).css("display") === "table-cell" || $(this).css("display") === "inline" || $(this).css("display") === "block") {
							if ($(this).attr("data-year")) {
								var dataId = $(this).attr("data-year").split("_");
								$this.find(".year." + toggle_cls_prefix + dataId[1]).attr("checked", true).removeClass("unchecked").addClass("checked");
							}
							if ($(this).attr("data-quater")) {
								var dataId = $(this).attr("data-quater").split("_");
								$this.find(".quater." + toggle_cls_prefix + dataId[1]).attr("checked", true).removeClass("unchecked").addClass("checked");
							}
						} else {
							if ($(this).attr("data-year")) {
								var dataId = $(this).attr("data-year").split("_");
								$this.find(".year." + toggle_cls_prefix + dataId[1]).attr("checked", false).removeClass("checked").addClass("unchecked");
							}
							if ($(this).attr("data-quater")) {
								var dataId = $(this).attr("data-quater").split("_");
								$this.find(".quater." + toggle_cls_prefix + dataId[1]).attr("checked", false).removeClass("checked").addClass("unchecked");
							}
						}
					});

					keyFiguresBreakpoint = currentBreakpoint;

				}).trigger("updateCheck");

				$(window).bind("orientationchange resize", function() {
					$this.find("input").trigger("updateCheck");
				});

//				$(this).find(settings.filterToggleElem + " input").show();
				$(this).find(settings.filterToggleElem + " input:checked").each(function() {
					if ($(this).prop("checked")) {
						$(this).addClass("checked");
					}
				});
//											$(this).find(settings.filterToggleElem + " input:checked").addClass("checked");
//											$(this).find(settings.filterToggleElem + " input").hide();
				$(this).find(settings.filterToggleElem + " input").change(function() {
					if ($(this).prop("checked")) {
						$(this).removeClass("unchecked").addClass("checked").prop("checked");
					} else {
						$(this).removeClass("checked").addClass("unchecked").removeProp("checked");

					}
					//								$(this).toggleClass("unchecked", true);
					var inputClasses = $(this).attr("class").split(" ");
					var inputId = inputClasses[0].split("_");
					if ($(this).hasClass("year")) {
//						$("div[data-year='" + toggle_cls_prefix + inputId[1] + "']").toggle(function(){
						if ($("div[data-year='" + toggle_cls_prefix + inputId[1] + "']").is(":visible")) {
							$("div[data-year='" + toggle_cls_prefix + inputId[1] + "']").hide();
						} else {
//								$("div[data-year='" + toggle_cls_prefix + inputId[1] + "']").show();
							$("div[data-year='" + toggle_cls_prefix + inputId[1] + "']").css("display", "table-cell");
//							$(this).css("display", "table-cell");
						}
//						});
					} else {
//						$("div[data-quater='" + toggle_cls_prefix + inputId[1] + "']").toggle(function(){
						if ($("div[data-quater='" + toggle_cls_prefix + inputId[1] + "']").is(":visible")) {
							$("div[data-quater='" + toggle_cls_prefix + inputId[1] + "']").hide();
						} else {
//								$("div[data-quater='" + toggle_cls_prefix + inputId[1] + "']").show();
							$("div[data-quater='" + toggle_cls_prefix + inputId[1] + "']").css("display", "table-cell");
//							$(this).css("display", "table-cell");
						}
//						});
					}
				});






				countFunctionCall++;
			});
		},
		destroy: function(options) {
			// Repeat over each element in selector
			return $(this).each(function() {
				//				var $this = $(this);
			});
		}
	};

	$.fn.extendedConfigTable = function() {
		var method = arguments[0];

		if (extendedConfigTableMethods[method]) {
			method = extendedConfigTableMethods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if (typeof(method) === 'object' || !method) {
			method = extendedConfigTableMethods.init;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.stylingDropdown');
			return this;
		}

		return method.apply(this, arguments);
	};
})(jQuery);
