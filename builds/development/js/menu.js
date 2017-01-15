var primaryNavTimeout = null;
var widthDesktop = 1024;
var widthTablet = 650;
var widthMobile = 320;
var scrollbarWidth = 0;
var currentBreakpoint = 'desktop';
var activeMenuSelector = null;
var isMobile = false;
var tabMenu = false;
var previousMenuSelector = null;
var menuItemIsHovered = false;
var subMenuItemIsHovered = false;

var currentWindowWidth = 0;
var currentWindowHeight = 0;

$(document).ready(function() {
	
	/**
	 * disabled
	 * @ticket https://ticket.newego.de/issues/12371
	 */
//	countjobs();

	if (navigator.userAgent.match(/Android/i) ||
			navigator.userAgent.match(/webOS/i) ||
			navigator.userAgent.match(/iPhone/i) ||
			navigator.userAgent.match(/iPad/i) ||
			navigator.userAgent.match(/iPod/i) ||
			navigator.userAgent.match(/BlackBerry/) ||
			navigator.userAgent.match(/Windows Phone/i) ||
			navigator.userAgent.match(/ZuneWP7/i)) {

		isMobile = true;
	}

	$(".navigation").prepend('<button class="navigation__trigger act"><span class="navicon"></span></button>');

	/*
	 * primary navigation events
	 */
	// init primary menu
	scrollbarWidth = getScrollbarWidth();
	setBreakpoint(true);

	initPrimaryMenuClick();
	if ($(window).width() < 600) {
		bindMobileNavigationTrigger();
	}

	// tab menu
	if ($('.tabs__list').length > 0) {

		var activeTab = null;
		initTabMenu();

		$('.tabs__list').each(function() {

			var isTabBox = false;
			if ($(this).parent('.tabs__nav').parent('.tabs').parent('.tab-box').length > 0) {
				isTabBox = true;
			}

			$(this).children('li.tabs__list__item').click(function(e) {

				if ($('li.tabs__list__item.act').length > 0 && !$('li.tabs__list__item.act').hasClass('tabs__list__item--more')) {
					activeTab = $('li.tabs__list__item.act');
				}

//				$('.tabs__list li.tabs__list__item').removeClass('act');
//				$(this).parent().children('li.tabs__list__item').removeClass('act');
//				$(this).addClass('act');

				if (isTabBox) {
					var numTab = NELibs.getClassBeginningWith($(this), 'tabs__list__item--', true);
					var tabBox = $(this).closest('.tab-box');
					if (numTab != 'more') {
						tabBox.find('.js_tab-content').hide();
						tabBox.find('#content-' + numTab).show();
					}
				}

				if ($(this).hasClass('tabs__list__item--more')) {
					if (!$(this).children('ul.nav.cf').is(':visible')) {
						$(this).children('ul.nav.cf').show();
						if (activeTab != null) {
							activeTab.removeClass('act');
						}
					} else {
						$(this).children('ul.nav.cf').hide();
						if (!isTabBox) {
							$(this).removeClass('act');
							if (activeTab != null) {
								activeTab.addClass('act');
							}
						}
					}
				}
			});

			if (isTabBox) {
				$(this).children('li.tabs__list__item--more').children('.nav').children('li').click(function() {
					var numTab = NELibs.getClassBeginningWith($(this), 'sub__list__item--', true);
					
					var tabBox = $(this).closest('.tab-box');
					tabBox.find('.js_tab-content').hide();
					tabBox.find('#content-' + numTab).show();
					
					$(this).find('li.act').removeClass('act');
					$(this).children('li.tabs__list__item--more').addClass('act');
				});
			}
		});
		tabMenu = true;
	}


//	// Slider Parent Height
//	var objHeight = $('.grid--slider').children().first().height();
//	$('.grid--slider').height(objHeight);

	currentWindowWidth = $(window).width();
	window.onresize = function() {
		onWindowResize();
	};

	// service navigation events
	$('.navigation__tertiary li').click(function(e) {

		// click outsude the item: hide menu
		$('html').one('click', function() {
			$('.navigation__tertiary li div.navigation__secondary').hide();
			$('.navigation__tertiary li span,a').removeClass('act').removeClass('over');
		});
		e.stopPropagation();

		if ($(this).children('span,a').hasClass('act')) {
			$('.navigation__tertiary li div.navigation__secondary').hide();
			$('.navigation__tertiary li span,a').removeClass('act').removeClass('over');
			return;
		}

		$('.navigation__tertiary li div.navigation__secondary').hide();
		$('.navigation__tertiary li span,a').removeClass('act').removeClass('over');

		$(this).children('span,a').addClass('act').addClass('over');
		$(this).children('div.navigation__secondary').show();
	});
});
// ----- END OF DOCUMENT READY ----- \\


/**
 * Callback functions
 */
function onWindowResize() {

	if ($(window).width() != currentWindowWidth) {

		setBreakpoint();
		if (tabMenu) {
			collapseTabMenu();
		}

		if ($('.js_stage-slide').length > 0 && currentBreakpoint != 'mobile') {
			$('.js_stage-slide').each(function() {
				setStageTeaserHeight(this, false);
			});
		}

		if ($('.company-story').length > 0 && !isMobile) {
			getWidthOfFixedElem();
			setMilestonePositions();
		}

		if ($('.js_feature-tabs').length > 0) {
			if ($(window).width() > 600) {
				$('.js_feature-tabs').each(function() {
					setFeatureTabsHeight(this);
				});
			}
			featureTabsAccordion();
		}

		setBoxHeight();

		/**
		 * bugfix for android orientation change
		 */
		if (isAndroid() || isIE8()) {
			if ($('.js_stage-video-slide').length > 0) {
				$('.js_stage-video-slide').each(function() {
					var el = $(this).find('.stageVideoSlider');
					el.iosSlider('update');
				});
			}
			if ($('.js_stage-image-slide').length > 0) {
				var i = 1;
				$('.js_stage-image-slide').each(function() {
					var el = $(this).find('.stageImageSlider');

					if (isAndroid()) {
						el.iosSlider('destroy');
						setTimeout(function() {
							el.iosSlider(getStageImageSettings(i));
							setStageImageHeight(el.get(0));
							el.iosSlider('update');
						}, 200);
					} else if (isIE8()) {
						setTimeout(function() {
							el.iosSlider('update');
						}, 200);
					}
					i++;
				});
			}
			if ($('.js_stage-content-slide').length > 0) {
				var i = 1;
				$('.js_stage-content-slide').each(function() {
					var el = $(this).find('.stageContentSlider');
					el.iosSlider('destroy');
					el.iosSlider(getStageContentSliderSettings(i));
					setStageContentSliderHeight(el.get(0));
					el.iosSlider('update');
					i++;
				});
			}
			if ($('.js_partner-slide').length > 0) {
				var i = 1;
				$('.js_partner-slide').each(function() {
					var el = $(this).find('.js_partnerSlider');
					el.iosSlider('destroy');
					var settings = getPartnerSliderSettings(this, i);
					el.iosSlider(settings);
					if (isMobile == true && settings.desktopClickDrag == false) {
						$('.js_iosPartnerSlide_' + numPartnerSlider).iosSlider('lock');
					}
					setTimeout(function() {
						el.iosSlider('update');
						setPartnerSliderSizes(this);
					}, 500);
					i++;
				});
			}
			if ($('.js_stage-slide').length > 0) {
				var i = 1;
				$('.js_stage-slide').each(function() {
					var el = $(this).find('.slideStage_content');
					el.iosSlider('destroy');
					if (initStageSlider(this, true)) {
						setStageTeaserHeight(this, true);

						if (currentBreakpoint == 'mobile') {
							initStageSliderMobile(this);
						} else {
							initStageSlider(this, false);
						}
					}
					i++;
				});
			}
			if ($('.js_image-text-slide').length > 0) {
				$('.js_image-text-slide').each(function() {
					var el = $(this).find('.iosSlider');
					el.iosSlider('update');
				});
			}
			if ($('.js_image-slider').length > 0) {
				$('.js_image-slider').each(function() {
					var el = $(this).find('.js_imageSlider');
					setTimeout(function() {
						el.iosSlider('update');
					}, 200);
				});
			}
		}

		currentWindowWidth = $(window).width();
	}
}


function onBreakpointChanged(init) {

	if (currentBreakpoint != 'mobile') {
		$('ul.nav.navigation__list.navigation__primary').children('li').each(function() {
			var hasSubnav = false;
			var secondaryNav = null;
			$(this).find('li.grid__unit').each(function() {
				if (secondaryNav == null) {
					secondaryNav = $(this).parent('ul');
				}
				if ($(this).children('ul').length > 0) {
					hasSubnav = true;
				}
			});
			if (!hasSubnav && secondaryNav != null) {
				secondaryNav.removeClass('grid--nav');
			}
		});
		
		$('.js_image-finder .images_cat').each(function() {
			var catID = NELibs.getClassBeginningWith($(this), 'images_cat_', true);
			setImageBoxesHeight(catID, false);
		});
		
	} else {
		
		bindMobileNavigationTrigger();
		
		$('ul.nav.navigation__list.navigation__primary').find('ul.grid').each(function() {
			if (!$(this).hasClass('grid--nav')) {
				$(this).addClass('grid--nav');
			}
		});
		
		$('.js_image-finder .images_cat').each(function() {
			var catID = NELibs.getClassBeginningWith($(this), 'images_cat_', true);
			setImageBoxesHeight(catID, true);
		});
	}
	
	if (typeof init == 'undefined' || init != true) {
		resetVMTracking();
	}
	
	if (typeof et_pagename != 'undefined') {
		et_pagename = getPageName();
	}
}




/**
 * Browser detection
 */

function isIE8() {
	if (navigator.userAgent.indexOf('MSIE 8') > -1) {
		return true;
	}
	return false;
}


function isSafari4() {
	if (navigator.userAgent.match(/Safari/i) && navigator.userAgent.match(/Version\/4/i)) {
		return true;
	}
	return false;
}

function isSafari5() {
	if (navigator.userAgent.match(/Safari/i) && navigator.userAgent.match(/Version\/5/i)) {
		return true;
	}
	return false;
}

function isAndroid() {
	if (navigator.userAgent.match(/Android/i)) {
		return true;
	}
	return false;
}


function isIOS() {

	if (navigator.userAgent.match(/iPhone/i) ||
			navigator.userAgent.match(/iPad/i) ||
			navigator.userAgent.match(/iPod/i)) {
		return true;
	}
	return false;
}

function isIpad() {
	if (navigator.userAgent.match(/iPad/i)) {
		return true;
	}
	return false;

}
///////////////////////////////



function getScrollbarWidth() {
	var a, b, c;
	if (c === undefined) {
		a = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
		b = a.children();
		c = b.innerWidth() - b.height(99).innerWidth();
		a.remove();
	}
	return c;
}



function bindMobileNavigationTrigger() {
	$('button.navigation__trigger').unbind('click');
	$('button.navigation__trigger').click(function() {
		
		var btnShowHideMenu = $(this);
		var selector = $(this).next('.navigation__toggle').children('ul.navigation__primary');
		if (selector.is(':visible')) {
			selector.slideUp('fast', function() {
				btnShowHideMenu.removeClass('act');
			});
		} else {
			$(this).addClass('act');
			selector.slideDown('fast');
		}

		resetVMTracking();
	});
}



function initPrimaryMenuClick() {

	var urlParams = new Array();
	if (window.location.pathname.length > 1) {
		urlParams = window.location.pathname.split('/');
	}


	var activeMenuItem = null;
	if (typeof(urlParams[1]) != "undefined" && urlParams[1].length > 0) {
		if (urlParams[1] == NELibs.getLangKey().replace('-', ' ')) {
			if (typeof(urlParams[2]) != "undefined" && urlParams[1].length > 0) {
				activeMenuItem = urlParams[2].replace('-', ' ');
			}
		} else {
			if ($(".navigation__primary").hasClass('nav_lp')) {
				activeMenuItem = urlParams[2].replace(/-/g, " ");
			} else {
				activeMenuItem = urlParams[1].replace('-', ' ');
			}
		}
	}
	
	if (activeMenuItem != null) {
		var currentLocation = window.location.pathname;
		if (currentLocation.indexOf('/') > -1) {
			currentLocation = currentLocation.replace(/\//g, '');
		}
//		if (currentLocation != 'de') {
//			$('.navigation__list.navigation__primary').addClass('nav1__sub');
//		}
	}
	
//	$('.navigation__primary>li>a').each(function() {
//		
//		var itemText = $(this).text().toLowerCase().replace(/[\u00fc\u00fb\u00f9\u00fa]/g,'ue').replace(/[\u00e4]/g,'ae').replace(/[\u00f6]/g,'oe').replace(/[\u00df]/g,'ss');
//		if (activeMenuItem != null && itemText == activeMenuItem) {
////			if (!$(this).hasClass('act') && currentBreakpoint != 'mobile') {
////				$(this).addClass('act');
////			}
//			activeMenuSelector = this;
//			return true;
//		}
////		$(this).removeClass('act');
//	});



	$('.navigation__primary>li>a').unbind('click');
	$('.navigation__primary>li>a').unbind('hover');

	if (currentBreakpoint == 'desktop' || currentBreakpoint == 'tablet') {

		if (!isMobile) {

			if (!isIE8()) {
				$('.navigation__primary>li>a').hoverIntent(function(e) {
					
					menuItemIsHovered = true;
					setPrimaryNavEvent($(this).parent('li').get(0));
					
					/**
					 * click outside the navigation__secondary: hide menu
					 */
					$('html').click(function(e) {
						if ($(e.target).closest('.navigation__secondary').length == 0) {
							$('ul.navigation__primary>li>div.navigation__secondary').hide();
							$('ul.navigation__primary>li>a').removeClass('over');

							$('html').unbind('click');
							previousMenuSelector = null;
						}
					});
					e.stopPropagation();

				}, function() {
					menuItemIsHovered = false;
					var selector = $(this).parent('li');
					primaryNavTimeout = setTimeout(function() {
						if (!subMenuItemIsHovered && !menuItemIsHovered) {
							selector.children('a').removeClass('over');
							selector.children('div.navigation__secondary').hide();
							previousMenuSelector = null;
						}
					}, 1000);
					
					resetVMTracking();
				}, 1000);
			} else {
				$('.navigation__primary>li>a').hover(function(e) {
					
					menuItemIsHovered = true;
					setPrimaryNavEvent($(this).parent('li').get(0));

					/**
					 * click outside the navigation__secondary: hide menu
					 */
					$('html').click(function(e) {
						if ($(e.target).closest('.navigation__secondary').length == 0) {
							$('ul.navigation__primary>li>div.navigation__secondary').hide();
							$('ul.navigation__primary>li>a').removeClass('over');

							$('html').unbind('click');
							previousMenuSelector = null;
						}
					});
					e.stopPropagation();

					resetVMTracking();
				}, function() {
					menuItemIsHovered = false;
					var selector = $(this).parent('li');
					primaryNavTimeout = setTimeout(function() {
						if (!subMenuItemIsHovered && !menuItemIsHovered) {
							selector.children('a').removeClass('over');
							selector.children('div.navigation__secondary').hide();
							previousMenuSelector = null;
						}
					}, 1000);
				});
			}
		} else {

			$('.navigation__primary>li>a').click(function(e) {

				var retVal = false;
				if ($(this).next('.navigation__list.navigation__secondary').is(':visible')) {
					retVal = true;
				}

				setPrimaryNavEvent($(this).parent('li').get(0));
				resetVMTracking();
				return retVal;
			});
		}
	} else if (currentBreakpoint == 'mobile') {
		
		$('.navigation__primary>li>a').unbind('click');
		$('.navigation__primary>li>a').unbind('hover');
		$('.navigation__primary>li>a').click(function() {
			
			var selector = $(this).next('div.navigation__secondary');
			$('div.navigation__secondary').each(function() {
				if ($(this).is(':visible')) {
					if ($(this).get(0) != selector.get(0)) {
						$(this).slideUp('fast');
						$(this).prev('span').removeClass('act');
					}
				}
			});

			if (!$(this).next('div.navigation__secondary').is(':visible')) {
				$(this).next('div.navigation__secondary').slideDown('fast');
				$('.navigation__list.navigation__primary li a').removeClass('act');
				if (!$(this).hasClass('act')) {
					$(this).addClass('act');
				}
			} else {
				$(this).next('div.navigation__secondary').slideUp('fast');
				if ($(this).hasClass('act')) {
					$(this).removeClass('act');
				}
			}

			resetVMTracking();

			// stop request: return false
			if ($(this).next('div.navigation__secondary').length > 0) {
				return false;
			}
		});
	}
}


function setPrimaryNavEvent(selector) {

	$('.navigation__primary>li>a').unbind('click');
	$('.navigation__primary>li>a').click(function() {

		var langKey = NELibs.getLangKey();
		var uri = window.location.pathname.replace(/\//g, '');
		if (uri == '' || uri == langKey) {
			$(this).addClass('act_home');
		} else {
			$(this).addClass('act');
		}

		$(activeMenuSelector).removeClass('act').removeClass('act_home');
	});

	var menuDisplayTime = 500;

	if (typeof(selector) == "undefined" || selector == null || selector == previousMenuSelector) {
		return;
	}

	var closeMenu = false;
	if ($(selector).children('div.navigation__secondary').is(':visible')) {
		closeMenu = true;
	}

	clearTimeout(primaryNavTimeout);
	$('.navigation__primary li div.navigation__secondary').each(function() {
		$(this).prev('a').removeClass('over');
		$(this).hide();
	});

	if (closeMenu) {
		return;
	}

	if ($(selector).children('div.navigation__secondary').length > 0) {
		$(selector).children('a').addClass('over');
		$(selector).children('div.navigation__secondary').show();
	}

//	primaryNavTimeout = setTimeout(function() {
//		if (!menuItemIsHovered) {
//			$(selector).children('a').removeClass('over');
//			$(selector).children('div.navigation__secondary').hide();
//			previousMenuSelector = null;
//		}
//	}, menuDisplayTime);
	
	$(selector).children('div.navigation__secondary').unbind('hover');
	$(selector).children('div.navigation__secondary').hover(function() {
//		clearTimeout(primaryNavTimeout);
		subMenuItemIsHovered = true;
	}, function() {
		
		subMenuItemIsHovered = false;
		primaryNavTimeout = setTimeout(function() {
			if (currentBreakpoint != 'mobile' && menuItemIsHovered == false && subMenuItemIsHovered == false) {
				$(selector).children('a').removeClass('over');
				$(selector).children('div.navigation__secondary').hide();
				previousMenuSelector = null;
			}
		}, menuDisplayTime);
	});
	
	previousMenuSelector = selector;
}



function setBreakpoint(init) {

	if (typeof(init) == "undefined") {
		init = false;
	}

	var prevBreakpoint = currentBreakpoint;

	var w = $(window).innerWidth();
	if (!navigator.userAgent.match(/AppleWebKit/i)) {
		w += scrollbarWidth;
	}

	if (w >= widthDesktop) {
		if (currentBreakpoint == 'mobile') {
			$('.navigation__list.navigation__primary').show();
			$('.navigation__list.navigation__primary li div.navigation__secondary').hide();
			$('.navigation__list.navigation__primary>li>a').removeClass('act').removeClass('over');
			if (!$(activeMenuSelector).hasClass('act')) {
				$(activeMenuSelector).addClass('act');
			}

			if ($('.js_stage-slide').length > 0) {
				$('.js_stage-slide').each(function() {
					$(this).find('.slideStage_content').iosSlider('destroy', true);
					if (initStageSlider(this)) {
						bindStageSliderEvents(this);
					}
				});
			}
		}

		currentBreakpoint = 'desktop';
		if (prevBreakpoint != currentBreakpoint) {
			initPrimaryMenuClick();
		}
	} else if (w >= widthTablet && w < widthDesktop) {
		if (currentBreakpoint == 'mobile') {
			$('.navigation__list.navigation__primary').show();
			$('.navigation__list.navigation__primary li div.navigation__secondary').hide();
			$('.navigation__list.navigation__primary>li>a').removeClass('act').removeClass('over');
			if (!$(activeMenuSelector).hasClass('act')) {
				$(activeMenuSelector).addClass('act');
			}

			if ($('.js_stage-slide').length > 0) {
				$('.js_stage-slide').each(function() {
					$(this).find('.slideStage_content').iosSlider('destroy', true);
					if (initStageSlider(this)) {
						bindStageSliderEvents(this);
					}
				});
			}
		}

		currentBreakpoint = 'tablet';
		if (prevBreakpoint != currentBreakpoint) {
			initPrimaryMenuClick();
		}

	} else if (w < widthTablet) {

		if (currentBreakpoint != 'mobile') {
			clearTimeout(primaryNavTimeout);
			$('.navigation__list.navigation__primary div.navigation__secondary').each(function() {
				$(this).hide();
				$(this).prev('a').removeClass('over').removeClass('act');
				$(activeMenuSelector).removeClass('act');
			});
			$('button.navigation__trigger').removeClass('act');
			$('.nav.navigation__list.navigation__primary').hide();

			if ($('.js_stage-slide').length > 0 && init == false) {
				$('.js_stage-slide').each(function() {
					unbindStageSliderEvents(this);
					if (initStageSlider(this, true)) {
						resetFadeInterval(this, true);
						setStageTeaserHeight(this, true);
						initStageSliderMobile(this);
					}
				});
			}
		}
		
		currentBreakpoint = 'mobile';
		if (prevBreakpoint != currentBreakpoint) {
			initPrimaryMenuClick();
		}
	}

	/*
	 * case: breakpoint has changed
	 */
	if (prevBreakpoint != currentBreakpoint || init == true) {
		onBreakpointChanged(init);
	}
}


function initTabMenu() {

	var location = '';
	if (window.location.pathname.charAt(0) == '/') {
		location = window.location.pathname.substr(1);
	}

	$('.tabs__list').each(function() {

		var isTabBox = false;
		if ($(this).parent('.tabs__nav').parent('.tabs').parent('.tab-box').length > 0) {
			isTabBox = true;
		}

		$(this).children('li.tabs__list__item--more').append('<ul class="nav cf"></ul>');
		$(this).children('li.tabs__list__item').each(function() {

			if (!$(this).hasClass('tabs__list__item--more') && !isTabBox) {
				$(this).attr('onclick', 'window.location.href="/' + $(this).children('a').attr('href') + '"');
			}
			
//			if ($(this).children('a').attr('href') == location) {
//				$(this).addClass('act');
//			}

			if ($(this).hasClass('tabs__list li.tabs__list__item--more')) {
				return true;
			}

			var num = NELibs.getClassBeginningWith($(this), 'tabs__list__item--', true);
			if (num == "more") {
				return true;
			}
			$(this).parent().children('li.tabs__list__item--more').children('ul.nav.cf').append('<li class="sub__list__item--' + num + '">' + $('.tabs__list li.tabs__list__item--' + num).html() + '</li>');
		});

		$(this).children('li.tabs__list__item--more').children('ul.nav.cf').hide();
	});
	collapseTabMenu();
}


function collapseTabMenu() {

	var collapseLarge = 1024 - scrollbarWidth;
	var collapseMiddle = 600;
	var collapseSmall = 500;

	var windowWidth = $(window).innerWidth();
	var allowedElements = 0;
	if (windowWidth >= collapseLarge) {
		allowedElements = 6;
	} else if (windowWidth >= collapseMiddle && windowWidth < collapseLarge) {
		allowedElements = 4;
	} else if (windowWidth >= collapseSmall && windowWidth < collapseMiddle) {
		allowedElements = 3;
	} else {
		allowedElements = 2;
	}

	$('.tabs__list').each(function() {

		var moreActive = false;
		var i = 1;
		var tabsList = $(this);
		var tabsListEl = this;

		if (!$(this).children('li.tabs__list__item--more').hasClass('act') && typeof tabsListEl.activeTab == 'undefined') {
			tabsListEl.activeTab = $(this).children('li.tabs__list__item.act').get(0);
		}

		tabsList.children('li.tabs__list__item').each(function() {
			if ($(this).hasClass('tabs__list__item--more')) {
				return true;
			}

			if (i <= allowedElements) {
				tabsList.children('li.tabs__list__item--' + i).show();
				if (tabsList.children('li.tabs__list__item--more').children('ul.nav.cf').children('li.sub__list__item--' + i).length > 0) {
					tabsList.children('li.tabs__list__item--more').children('ul.nav.cf').children('li.sub__list__item--' + i).hide();
				}
			} else {
				tabsList.children('li.tabs__list__item--' + i).hide();
				if (tabsList.children('li.tabs__list__item--' + i).hasClass('act')) {
					tabsList.children('li.tabs__list__item--' + i).removeClass('act');
					moreActive = true;
				}
				if (tabsList.children('li.tabs__list__item--more').children('ul.nav.cf').children('li.sub__list__item--' + i).length > 0) {
					tabsList.children('li.tabs__list__item--more').children('ul.nav.cf').children('li.sub__list__item--' + i).show();
				}
			}
			i++;
		});

		if (i - 1 > allowedElements) {
			tabsList.children('li.tabs__list__item--more').show();

			if (moreActive) {
				tabsList.children('li.tabs__list__item--more').addClass('act');
			}
		} else {
			tabsList.children('li.tabs__list__item--more').hide();

			tabsList.children('li.tabs__list__item.act').removeClass('act');
			$(tabsListEl.activeTab).addClass('act');
		}

		tabsList.attr('class', 'nav tabs__list tabs__list--dropdown cf tabs__list--' + tabsList.children('.tabs__list__item:visible').length);

		if ($(this).parent('.tabs__nav').parent('.tabs').parent('.tab-box').length > 0) {
			return;
		}
		var fullWidth = tabsList.closest('.container').width();
		var tmpWidth = fullWidth;

		var numTabs = tabsList.children('li.tabs__list__item:visible').length;
		var i = 1;
		var lastTab = null;
		tabsList.children('li.tabs__list__item:visible').each(function() {
			if (i == numTabs) {
				lastTab = $(this);
				lastTab.css('width', '');
				return true;
			}
			tmpWidth -= $(this).width();
			i++;
		});

		lastTab.width(tmpWidth);
		tabsList.css('display', 'block');
	});
}


function countjobs() {
	$('.tabs__nav li a').each(function() {
		var pid = NELibs.getClassBeginningWith($(this), 'pid_', true);

		var obj = $(this);
		var u = '';
		u += NELibs.getBaseUrl();
		u += "?L=" + NELibs.getLangId();
		u += "&id=" + pid;
		u += "&countjobs=" + 1;

		$.ajax({
			url: u,
			success: function(data) {
				if (data.substr(0, 5) == "JOBS:") {
					var jobCount = data.substr(5);
					obj.append(" (" + jobCount + ")");
				}
			}
		})

	});
}

