(function($) {
	$.widget("newego.responsive_table", {
		options: {
			idprefix: null,
			persist: null,
			checkContainer: null
		},
		_create: function() {
			var self = this,
					o = self.options,
					tableOuter = self.element,
					tableHeader = tableOuter.find(".thead"),
					tableContent = tableOuter.find(".tbody"),
					headers = tableHeader.find(".cell"),
					rows = tableContent.find(".row"),
					menuContainer = o.checkContainer ? $(o.checkContainer) : $('<div class="table-filter-nav"><ul></ul></div>');
			tableOuter.addClass("enhanced");

			headers.each(function(i) {
				var th = $(this),
						id = th.attr("id"),
						classes = th.attr("class");

				if (!id) {
					id = (o.idprefix ? o.idprefix : "column-") + i;
					th.attr("id", id);
				}
				;
				var toggle_cls_prefix = o.idprefix + "_toggler";

				rows.each(function() {
					var cell = $(this).find(".cell").eq(i);
					cell.attr("headers", id);
					if (classes) {
						cell.addClass(classes);
					}
					;
				});

				if (!th.is("." + o.persist)) {
					var toggle = $('<li><input type="checkbox" name="toggle-cols" id="' + toggle_cls_prefix + i + '" value="' + id + '" /> <label for="' + toggle_cls_prefix + i + '">' + th.text() + '</label></li>');

					menuContainer.find("ul").append(toggle);

					toggle.find("input")
							.change(function() {
						var input = $(this),
								val = input.val(),
								cols = $("#" + val + ", [headers=" + val + "]");

						if (input.is(":checked")) {
//							cols.show();
							cols.css("display", "table-cell");
						}
						else {
							cols.hide();
						}
						;
					})
							.bind("updateCheck", function() {
						if (th.css("display") == "table-cell" || th.css("display") == "inline") {
							$(this).attr("checked", true);
						}
						else {
							$(this).attr("checked", false);
						}
					})
							.trigger("updateCheck");
				}
				;
			});



			$(".filter-table-container").each(function() {
				var $this = $(this);
				$this.find(".btn-filter").on("clickoutside", function(e) {
					if ($(e.target).is(".table_filter_checkboxes") || $(e.target).parents(".table_filter_checkboxes").length) {
						return false;
					} else {
						$(this).removeClass("open");
						$(this).next().hide();

					}
				});



			});

			$(window).bind("orientationchange resize", function() {
				menuContainer.find("input").trigger("updateCheck");
			});

			if (!o.checkContainer) {
				var menuWrapper = $('<div class="table-menu-outer" />'),
						menuBtn = $('<a href="#" class="tableMenuToggler">Show</a>');

				menuBtn.click(function() {
					menuContainer.toggleClass("tableMenu-hidden");
					return false;
				});

				menuWrapper.append(menuBtn).append(menuContainer);
				tableOuter.before(menuWrapper);

				$(document).click(function(e) {
					if (!$(e.target).is(menuContainer) && !$(e.target).is(menuContainer.find("*"))) {
						menuContainer.addClass("tableMenu-hidden");
					}
				});
			}
			;
		},
		disable: function() {
			// nothing to do here
		},
		enable: function() {
			// nothing to do here
		}
	});
}(jQuery));



