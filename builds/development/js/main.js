$(document).ready(function() {
	$("body").removeClass('noscript');


	if ($('.js_blurred_effect').length > 0) {

		$('.js_blurred_effect:first').find('.js_hero').find('img').attr('id', 'js_blurred_effect_img_id');
		$('.js_blurred_effect:first').find('.js_hero').append('<div style=""><canvas id="canvas"></canvas></div>');

		$('.js_main').addClass('fixed');
		$('.js_header').addClass('fixed');
		$('.js_blurred_effect:first').addClass('fixed');

		var isBlurred = false;
		$('.js_blurred_effect:first').find('.js_hero').imageWait({
			callback: function() {
				$('#js_blurred_effect_img_id').imageblur({
					srcimg: 'js_blurred_effect_img_id',
					canvas: 'canvas',
					blurRadius: 20
				});
				isBlurred = true;
			}
		});




		var lastB = 20;
		$(window).scroll(function() {
			var offset = $(window).scrollTop();
			var blur = Math.round(Math.max(0, 20 - (offset / 10)) / 5, 0) * 5;

			if (offset > 200) {

				if (offset > 410) {
					$('.js_blurred_padding').next().css('padding-top', '50px');
					$('.js_hero').hide();
					$('.js_main').removeClass('fixed');
					$('.js_blurred_effect:first').removeClass('fixed');
					$('.js_bg_color').addClass('bg-light').removeClass('bg-dark');
					$('.js_header').removeClass('fixed');
					$('.js_header').removeClass('bg-light');
				} else {
					$('.js_header').addClass('bg-light');
					$('.js_header').addClass('fixed');
					$('.js_hero').hide();
					$('.js_main').removeClass('fixed');
					$('.js_blurred_effect:first').removeClass('fixed');
					$('.js_bg_color').addClass('bg-light').removeClass('bg-dark');
					$('.js_blurred_padding').next().css('padding-top', '130px');
				}


			} else {
				$('.js_header').removeClass('bg-light');
				$('.js_header').addClass('fixed');
				$('.js_blurred_padding').next().css('padding-top', '0px');
				$('.js_hero').show();
				$('.js_main').addClass('fixed');

				$('.js_blurred_effect:first').addClass('fixed');
				$('.js_bg_color').addClass('bg-dark').removeClass('bg-light');
			}

			if (lastB === blur) {
				return;
			}
			lastB = blur;
			if (isBlurred) {
				$('#js_blurred_effect_img_id').imageblur('blur', {
					blurRadius: blur
				});
			}
		});
	}
	;

	$('.btn-filter').click(function() {
		if ($(this).hasClass('js_disabled')) {
			return false;
		}
		var sel = '.' + $(this).children('.fader').html();
		var el = $(this).parents('.filter-table-container').find(sel);
		if (el.length) {
			if ($(this).hasClass('open')) {
				el.hide();
				$(this).removeClass('open');
			} else {
				el.show();
				$(this).addClass('open');
			}
		}
	});

// landingpage contact fce
	$(".landing-contact-box .btn-filter, .landing-contact-box a.js_filter_button").click(function() {
		if ($(this).hasClass('js_disabled')) {
			return false;
		}
		var filter_elem = $(this).parents('.top').next('.inner');
		if (filter_elem.length) {
			if ($(this).hasClass('open')) {
				filter_elem.hide();
				$(this).removeClass('open');
			} else {
				filter_elem.show();
				$(this).addClass('open');
			}
		}
	});

// landingpage tab box fce
//	$('.tab-box .tabs__list__item').each(function(){
//		$(this).click(function() {
//			var elemId = $(this).attr('class').match('(tabs__list__item--)?+[0-9]+');
//			console.log(elemId);
//		});
//	});


//
	//responsive table with filter
	var idprefix_all = "id_pref_table_";
	var counter = 0;
	$(".table_with_filter").each(function() {
		var idprefix = idprefix_all + counter + "_";
		counter = counter + 1;
		$(this).responsive_table({
			persist: "persist",
			idprefix: idprefix,
			checkContainer: $(this).parent('.filter-table-container').find('.table_filter_checkboxes')
		});
	});


	// extended responsive table with filter
	// $(".filter-ext-table-container").extendedConfigTable({
	// 	filterTriggerToggleElem: ".basic-table__filter a",
	// 	filterToggleElem: ".table_filter_checkboxes"
	// });

	// check if lang select or searchbox is set
	if ($('.search a.language').length > 0 && $('.search form').length < 1) {
		$('.search').addClass('only_lang');
	} else if ($('.search form').length > 0 && $('.search a.language').length < 1) {
		$('.search').addClass('only_search');
	}

});
