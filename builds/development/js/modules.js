var mobileCurrentIcon = 1;
var leftValue = 25;
var currentSliderMode = null;
var sliderLoop = false;
var slide_enabled = true;
var slidingSpeed = 150;
var fadingSpeed = 400;
var stageTeaserHeight = 0;
var arrPositions = {};
var currentPosition = 0;
var offsetHeightMilestones = 25;
var imageSliderMode = null;

$(document).ready(function() {

	if (typeof(eventTrackingEnabled) != 'undefined' && eventTrackingEnabled == true) {
		setEventTrackingBasePath();
	}

	$(window).load(function() {
		if ($('.company-story').length > 0 && !isMobile) {
			initMilestones();
		}

		setBoxHeight();

		if ($(window).width() > 600) {
			$('.js_feature-tabs').each(function() {
				setFeatureTabsHeight(this, true);
			});
		}
	});

	if ($('.js_partner-slide').length > 0) {
		$('.js_partner-slide').each(function() {
			setPartnerSliderSizes(this, true);
		});
	}

	if ($('.expanding-list').length > 0) {
		initExpandingList();
	}


	if ($('.tx-ne-casestudies').length > 0) {
		initCaseStudies();
	}

	if ($('.news-teaser').length > 0) {
		initNewsTeaser();
	}


	/*
	 * set the first dots on active
	 */
	$('.feature--slide__nav__pager li a').removeClass('act');
	$('.feature--slide__nav__pager li:first-child a').addClass('act');

	if ($('.js_image-text-slide').length > 0) {
		var numImageText = 1;
		$('.js_image-text-slide').each(function() {

			var i = 1;
			$(this).find('.slide').each(function() {
				$(this).addClass('js_slide-' + i);
				i++;
			});

			if ($(this).children('.iosSlider').children('.slider').children('.slide').length < 2) {
				$(this).children('.feature--slide__nav').hide();
				trackSliderCTAs($(this).children('.iosSlider').get(0), 'js_slide-');
			} else {

				$(this).children('.iosSlider').addClass('js_iosImageText_' + numImageText);
				$(this).children('.feature--slide__nav').addClass('js_imageTextNav_' + numImageText);

				var settings = getImageTextSliderSettings(numImageText);
				$('.js_iosImageText_' + numImageText).iosSlider(settings);
				numImageText++;
			}
		});
	}


	if ($('.js_stage-video-slide').length > 0) {
		var numStage = 1;
		$('.js_stage-video-slide').each(function() {
			if ($(this).find('.slider.video-modul').children('.js_vframe').length < 2) {
				$(this).children('.container').children('.feature--slide__nav').remove();
			} else {
				$(this).find('.stageVideoSlider').addClass('js_iosStageVideo_' + numStage);
				$(this).find('.feature--slide__nav').addClass('js_navi-' + numStage);

				$('.js_iosStageVideo_' + numStage).iosSlider(getStageVideoSettings(numStage));
				numStage++;
			}
		});
	}

	$(window).load(function() {
		if ($('.js_image-slider').length > 0) {

			var numImage = 1;
			var settings = {};
			$('.js_image-slider').each(function() {

				if ($(this).children('.js_imageSlider').children('.image_container').children('.img_slide').length < 2) {
					$(this).children('.feature--slide__nav').hide();
				} else {

					$(this).children('.js_imageSlider').addClass('js_iosImage_' + numImage);
					$(this).children('.feature--slide__nav').addClass('js_imageNav_' + numImage);
					$(this).children('.feature--slide__nav').find('a').css('z-index', 5);

					settings = {
						snapToChildren: true,
						desktopClickDrag: true,
						infiniteSlider: true,
						autoSlide: true,
						autoSlideTimer: 8000,
						autoSlideTransTimer: 300,
						navPrevSelector: $('.js_imageNav_' + numImage).children('.prev'),
						navNextSelector: $('.js_imageNav_' + numImage).children('.next'),
						navSlideSelector: '.js_imageNav_' + numImage + ' .dot',
						onSliderResize: onImageSliderResize,
						onSlideChange: imageSlideChange
					};

					if (currentBreakpoint == 'mobile') {
						settings.snapSlideCenter = true;
					} else {
						settings.snapSlideCenter = false;
					}

					imageSliderMode = currentBreakpoint;
					$('.js_iosImage_' + numImage).iosSlider(settings);


					if (currentBreakpoint == 'mobile') {
						var height = 0;
						$('.js_iosImage_' + numImage).find('.img_slide').each(function() {
							if ($(this).children('.img_slider').outerHeight() > height) {
								if (currentWindowWidth >= 582) {
									height = $(this).children('.img_slider').outerHeight();
								} else {
									height = $(this).outerHeight();
								}
							}
						});

						if (height > 0) {
							$('.js_iosImage_' + numImage).height(height);
						}
					}

					numImage++;
				}
			});
		}
	});

	if ($('.js_stage-image-slide').length > 0) {
		var numImage = 1;
		$('.js_stage-image-slide').each(function() {
			if ($(this).find('.slide').length < 2) {
				$(this).find('.feature--slide__nav').hide();
				trackSliderCTAs($(this).find('.stageImageSlider').get(0), 'elem-');
			} else {

				var sliderContainer = $(this).find('.stageImageSlider');
				setStageImageHeight(sliderContainer.get(0));

				sliderContainer.addClass('js_iosImage-' + numImage);
				$(this).find('.feature--slide__nav').addClass('js_imageNav-' + numImage);

				$('.js_iosImage-' + numImage).iosSlider(getStageImageSettings(numImage));
				numImageText++;
			}
		});
	}


	if ($('.js_partner-slide').length > 0) {

		var numPartnerSlider = 1;
		setCurrentPartnerSliderMode();

		$('.js_partner-slide').each(function() {

			$(this).find('.js_partnerSlider').addClass('js_iosPartnerSlide_' + numPartnerSlider);
			var settings = getPartnerSliderSettings(this, numPartnerSlider);
			$('.js_iosPartnerSlide_' + numPartnerSlider).iosSlider(settings);

			if (isMobile == true && settings.desktopClickDrag == false) {
				$('.js_iosPartnerSlide_' + numPartnerSlider).iosSlider('lock');
			}
			numPartnerSlider++;
		});
	}


	/*
	 * init stage fading teaser
	 */
	if ($('.js_stage-slide').length > 0) {

		if (currentBreakpoint != 'mobile') {
			$(window).load(function() {
				var i = 1;
				$('.js_stage-slide').each(function() {
					$(this).addClass('js_stageSlider-' + i);
					if (initStageSlider(this)) {
						bindStageSliderEvents(this);
					}
					trackFaderCTAs(this, 'js-item-');
					i++;
				});
			});

		} else {

			var i = 1;
			$('.js_stage-slide').each(function() {
				$(this).addClass('js_stageSlider-' + i);
				if (initStageSlider(this, true)) {
					setStageTeaserHeight(this, true);
					initStageSliderMobile(this);
				} else {
					trackFaderCTAs($(this).find('.slideStage_content').get(0), 'js-item-');
				}
				i++;
			});
		}
	}


	if ($('.js_stage-content-slide').length > 0) {
		var numStageContent = 1;
		$('.js_stage-content-slide').each(function() {

			var i = 1;
			$(this).find('.slide').each(function() {
				$(this).addClass('js_slide-' + i);
				i++;
			});

			if ($(this).find('.content_slider').children('.slide').length < 2) {
				$(this).find('.feature--slide__nav').hide();
				trackSliderCTAs($(this).find('.stageContentSlider').get(0), 'js_slide-');
			} else {
				$(this).find('.stageContentSlider').addClass('js_iosStageContent_' + numStageContent);
				$(this).find('.feature--slide__nav').addClass('js_naviContent-' + numStageContent);

				setStageContentSliderHeight($(this).find('.stageContentSlider').get(0));

				$('.js_iosStageContent_' + numStageContent).iosSlider(getStageContentSliderSettings(numStageContent));
				numStageContent++;
			}
		});
	}


	/*
	 * init feature tabs
	 */
	if ($('.js_feature-tabs').length > 0) {
		$('.js_feature-tabs').each(function() {
			$(this).children('li').children('div').hide();
			$(this).children('li:first').children('a').addClass('act').next("div").show();
//			$('.js_feature-tabs li:first a').addClass('act').next("div").show();
			featureTabsAccordion();
		});
	}


	if ($('.tab-box').length > 0) {
		$('.tab-box').each(function(){
			var i = 0;
			$(this).find('.js_tab-content').each(function() {
				if (i == 0) {
					i++;
					return true;
				}
				$(this).hide();
				i++;
			});
		});
	}


//	resetVMTracking();
});
/////////// end of document ready function /////////////

/*
 * set newsbox height
 */
function setNewsBoxesHeight(isMobile, parentClass) {

	if (typeof(isMobile) == 'undefined') {
		isMobile = false;
	}

	if (typeof parentClass == 'undefined') {
		parentClass = 'js_latest-news';
	}

	var news_elements = $('.' + parentClass + ' .js_box');
	news_elements.css('height', '');

	if (isMobile) {
		return;
	}

	var arrElementRows = new Array();
	var j = 0;
	news_elements.each(function() {

		var top = getTopPosition(this);
		if (top == 0) {
			return false;
		}

		if (typeof arrElementRows[top] == 'undefined') {
			arrElementRows[top] = {};
		}

		if (typeof arrElementRows[top]['height'] == 'undefined') {
			arrElementRows[top]['height'] = $(this).outerHeight();
		}

		arrElementRows[top][j] = {};
		arrElementRows[top][j] = this;
		if ($(this).outerHeight() > arrElementRows[top]['height']) {
			arrElementRows[top]['height'] = $(this).outerHeight();
		}
		j++;
	});

	for (var a in arrElementRows) {
		for (var i in arrElementRows[a]) {
			$(arrElementRows[a][i]).outerHeight(arrElementRows[a]['height']);
		}
	}
}


function setImageBoxesHeight(catID, mobile) {

	parentClass = 'js_image-finder';

	var news_elements = $('.' + parentClass + ' .images_cat_'+catID+' .js_box');
	news_elements.css('height', '');

	if (mobile) {
		return;
	}

	var arrElementRows = new Array();
	var j = 0;
	var index = 0;
	news_elements.each(function() {

		if (j%3 == 0) {
			index++;
		}

		if (typeof arrElementRows[index] == 'undefined') {
			arrElementRows[index] = {};
		}

		if (typeof arrElementRows[index]['height'] == 'undefined') {
			arrElementRows[index]['height'] = $(this).outerHeight();
		}

		arrElementRows[index][j] = {};
		arrElementRows[index][j] = this;
		if ($(this).outerHeight() > arrElementRows[index]['height']) {
			arrElementRows[index]['height'] = $(this).outerHeight();
		}
		j++;
	});

	for (var a in arrElementRows) {
		for (var i in arrElementRows[a]) {
			$(arrElementRows[a][i]).outerHeight(arrElementRows[a]['height']);
			$(arrElementRows[a][i]).height(arrElementRows[a]['height']);
		}
	}
}


/**
 * start: stage fading teaser
 */
function initStageSliderMobile(selector) {

	var className = NELibs.getClassBeginningWith($(selector), 'js_stageSlider');
	if (className == '' || className == null) {
		return;
	}

	container = $('.' + className).find('.slideStage_content');
	if (container.length == 0) {
		return;
	}

	var activeSlide = $(selector).find('a.act').text();
	container.iosSlider({
		snapToChildren: true,
		desktopClickDrag: true,
		infiniteSlider: true,
		autoSlideTransTimer: 300,
		autoSlide: true,
		autoSlideTimer: 8000,
		navPrevSelector: $('.' + className).find('.feature--slide__nav').children('.prev'),
		navNextSelector: $('.' + className).find('.feature--slide__nav').children('.next'),
		navSlideSelector: '.' + className + ' .feature--slide__nav__pager .dot',
		onSliderLoaded: onStageSlideLoaded,
		onSlideComplete: onStageSlideChange,
		onSliderResize: setStageTeaserHeight,
		startAtSlide: activeSlide
	});
}


function setStageTeaserHeight(selector, mobile) {

	if (selector != null && typeof(selector.sliderContainerObject) != 'undefined') {
		selector = $(selector.sliderContainerObject).closest('.js_stage-slide').get(0);
		mobile = true;
	}

	if (typeof(mobile) == 'undefined') {
		mobile = false;
	}

	stageTeaserHeight = 0;
	var container = $(selector).children('.container').children('article.feature').children('.slideStage_content').children('div');
	containerWidth = container.parent('.slideStage_content').width();

	var numVideos = container.find('.video-modul').length;
	container.children('.fading-item').each(function() {

		var jumpOver = false;

		if (mobile) {
			$(this).css('display', 'block');
		}

		var height = 0;
		if (numVideos > 0) {

			if ($(this).children('.video-modul').length > 0) {

				if (currentBreakpoint != 'mobile') {
					$(this).height('100%');
				} else {
					$(this).css('height', '');
				}

				$(this).children('.video-modul').height('100%');
				$(this).children('.video-modul').children('.js_vframe').children('.video__overlay').height('100%');

				if (isIE8()) {
					jumpOver = true;
				}
			}
		}


		if (!$(this).is(':visible')) {
			$(this).show();
			height = $(this).outerHeight();
			$(this).hide();
		} else {
			height = $(this).outerHeight();
		}

		if (height > stageTeaserHeight && !jumpOver) {
			stageTeaserHeight = height;
		}
	});

	$(selector).children('.container').find('.video-modul').height('100%');
	container.outerHeight(stageTeaserHeight);
}


function initStageSlider(selector, mobile) {

	if (typeof(mobile) == 'undefined') {
		mobile = false;
	}

	var fadingEnabled = true;
	if ($(selector).children('.container').children('article.feature').children('.slideStage_content').children('div').children('.fading-item').length < 2) {
		$(selector).children('.container').children('article.feature').children('.feature--slide__nav').hide();
		fadingEnabled = false;
	} else {
		if (!mobile) {
			resetFadeInterval(selector);
		}
	}

	var i = 1;
	$(selector).children('.container').children('article.feature').children('.slideStage_content').children('div').children('.fading-item').each(function() {

		$(this).addClass('js-item-' + i);
		if (!mobile) {
			var activeSlide = $(selector).find('a.act').text();
			if (activeSlide == i) {

				$(this).css('opacity', 1);
				if ($(this).closest('.js_stage-slide').children('.elem-' + i).children('.hero').children('img').length > 0) {
					$(this).closest('.js_stage-slide').children('.elem-' + i).children('.hero').children('img').css('opacity', 1);
				}
			} else {
				$(this).css('opacity', 0).hide();
				if ($(this).closest('.js_stage-slide').children('.elem-' + i).children('.hero').children('img').length > 0) {
					$(this).closest('.js_stage-slide').children('.elem-' + i).children('.hero').children('img').css('opacity', 0);
				}
			}
		} else {
			$(this).css('opacity', '').show();
		}
		i++;
	});

	$(selector).show();

	if (!mobile) {
		setStageTeaserHeight(selector, false);
	}

	if (!fadingEnabled) {
		return false;
	}

	return true;
}


function resetFadeInterval(selector, stop) {

	if (typeof(stop) == 'undefined') {
		stop = false;
	}

	if (typeof(selector.fadeInterval) != "undefined") {
		clearInterval(selector.fadeInterval);
	} else {
		selector.fadeInterval = null;
	}

	if (typeof(selector.fadeStageIndex) == "undefined") {
		selector.fadeStageIndex = 1;
		var activeSlide = $(selector).find('a.act').text();
		if (activeSlide > 1) {
			selector.fadeStageIndex = activeSlide;
		}
	}

	if (stop) {
		return;
	}

	selector.fadeInterval = setInterval(function() {
		var videoID = $(selector).find('.js-item-' + selector.fadeStageIndex).find('.js_yt-video').attr('id');
		if ((typeof(videoID) == 'undefined') || (players[videoID].getPlayerState() != 1 && players[videoID].getPlayerState() != 3)) {
			fadeStageTeaser(selector, 'auto');
		}
	}, 8000);
}


function fadeStageTeaser(selector, mode, pageNum) {

	if (typeof(selector.fadeStageIndex) == "undefined") {
		selector.fadeStageIndex = 1;
		var activeSlide = $(selector).find('a.act').text();
		if (activeSlide > 1) {
			selector.fadeStageIndex = activeSlide;
		}
	} else {
		selector.prevFadeStageIndex = selector.fadeStageIndex;
	}

	if (typeof(selector) == 'undefined') {
		selector = '.js_stage-slide';
	}

	var prev = false;
	if (typeof(mode) == 'undefined' || mode == 'prev') {
		prev = true;
	}

	// video handling: Stop interval when a video has startet
	var itemContainer = $(selector).children('.container').children('.feature--slide').children('.slideStage_content').children('.stage_slider');
	if (itemContainer.children('.js-item-' + selector.fadeStageIndex).children('.video-modul').length > 0) {
		var videoID = itemContainer.children('.js-item-' + selector.fadeStageIndex).find('iframe').attr('id');
		if ((typeof(videoID) != "undefined")) {
			pauseYouTubeVideo(videoID);
		}
	}

	itemContainer.children('.js-item-' + selector.fadeStageIndex).hide();
	itemContainer.children('.js-item-' + selector.fadeStageIndex).animate({
		opacity: 0
	}, fadingSpeed);

	if ($(selector).children('.elem-' + selector.fadeStageIndex).children('.hero').children('img').length > 0) {
		$(selector).children('.elem-' + selector.fadeStageIndex).children('.hero').children('img').animate({
			opacity: 0
		}, fadingSpeed);
	}

	if (mode == 'dot') {
		selector.fadeStageIndex = pageNum;
	} else if (!prev) {
		selector.fadeStageIndex++;
	} else {
		selector.fadeStageIndex--;
	}

	if (itemContainer.children('.js-item-' + selector.fadeStageIndex).length == 0) {
		if (!prev) {
			selector.fadeStageIndex = 1;
		} else {
			selector.fadeStageIndex = itemContainer.children('.fading-item').length;
		}
	}

	itemContainer.children('.js-item-' + selector.fadeStageIndex).show();
	itemContainer.children('.js-item-' + selector.fadeStageIndex).animate({
		opacity: 1
	}, fadingSpeed);


	if ($(selector).children('.elem-' + selector.fadeStageIndex).children('.hero').children('img').length > 0) {
		$(selector).children('.elem-' + selector.fadeStageIndex).children('.hero').children('img').animate({
			opacity: 1
		}, fadingSpeed);
	}

	var i = 1;
	$(selector).children('.container').children('article.feature').children('nav').children('.feature--slide__nav__pager').children('li').each(function() {
		$(this).children('a').removeClass('act');
		if (i == selector.fadeStageIndex) {
			$(this).children('a').addClass('act');
		}
		i++;
	});

//	resetVMTracking();
	if (mode != 'auto') {
		trackStageFader(selector, mode);
		resetFadeInterval(selector);
	}
}



function unbindStageSliderEvents(selector) {

	$(selector).find('.next').unbind('click');
	$(selector).find('.prev').unbind('click');
	$(selector).unbind('swipeleft');
	$(selector).unbind('swiperight');
	$(selector).unbind('movestart');
	$(selector).find('.feature--slide__nav__pager li a').unbind('click');
}


function bindStageSliderEvents(selector) {

	unbindStageSliderEvents(selector);
	$(selector).find('.next').click(function() {
		fadeStageTeaser($(this).closest('.js_stage-slide').get(0), 'next');
	});
	$(selector).find('.prev').click(function() {
		fadeStageTeaser($(this).closest('.js_stage-slide').get(0), 'prev');
	});

	$(selector).on('swipeleft', function(e) {
		fadeStageTeaser(this, 'next');
	}).on('swiperight', function(e) {
		fadeStageTeaser(this, 'prev');
	}).on('movestart', function(e) {
		// enable scrolling
		if ((e.distX > e.distY && e.distX < -e.distY) ||
				(e.distX < e.distY && e.distX > -e.distY)) {
			e.preventDefault();
			return;
		}
	});

	$(selector).find('.feature--slide__nav__pager li a').click(function() {
		var pageNum = $(this).text();
		fadeStageTeaser($(this).closest('.js_stage-slide').get(0), 'dot', pageNum);
	});
}

/////////// end of stage fader /////////////


/**
 * event callbacks
 */

function onStageSlideLoaded(params) {
	trackSliderCTAs(params, 'js-item-');
}


function onStageSlideChange(args) {

	var navi = $(args.sliderContainerObject).prev('.feature--slide__nav');
	navi.children('.feature--slide__nav__pager').find('a.act').removeClass('act');
	navi.children('.feature--slide__nav__pager').children('li:eq(' + (args.currentSlideNumber - 1) + ')').children('a').addClass('act');

	var prevSlide = $(args.sliderContainerObject).children('.stage_slider').children('.js-item-' + args.prevSlideNumber);
	if (prevSlide.find('.video__frame').children('iframe').length > 0) {
		var videoID = prevSlide.find('.video__frame').children('iframe').attr('id');
//		if (getVideoState(videoID)) {
		pauseYouTubeVideo(videoID);
		$(args.sliderContainerObject).iosSlider('autoSlidePlay');
//		}
	}

	execIosSlideTracking(args, false);
}


function onStageVideoSlideChange(args) {

	var selector = $(args.sliderContainerObject).closest('.container');
	selector.children('.feature--slide__nav').children('.feature--slide__nav__pager').find('a.act').removeClass('act');
	selector.children('.feature--slide__nav').children('.feature--slide__nav__pager').children('li:eq(' + (args.currentSlideNumber - 1) + ')').children('a').addClass('act');

	var prevSlide = $(args.sliderContainerObject).children('.slider').children('.frame-' + args.prevSlideNumber);

	if (prevSlide.find('.video__frame').children('iframe').length > 0) {
		var videoID = prevSlide.find('.video__frame').children('iframe').attr('id');
//		if (getYouTubeVideoState(videoID)) {
		pauseYouTubeVideo(videoID);
//		}
	}

	if (isSafari4()) {
		var height = $(args.sliderContainerObject).height();
		$(args.sliderContainerObject).css('height', 'auto');
		$(args.sliderContainerObject).height(height);
		$(args.sliderContainerObject).iosSlider('update');
	}

	execIosSlideTracking(args);
}


function onStageContentSlideChange(args) {

	var selector = $(args.sliderContainerObject).prev('.feature--slide__nav');
	selector.children('.feature--slide__nav__pager').find('a.act').removeClass('act');
	selector.children('.feature--slide__nav__pager').children('li:eq(' + (args.currentSlideNumber - 1) + ')').children('a').addClass('act');

	execIosSlideTracking(args);
}


function onPartnerSlideComplete(args) {
	execIosSlideTracking(args, false);
}


function onImageTextSlideChange(args) {

	var selector = $(args.sliderContainerObject).parent('.js_image-text-slide');
	selector.children('.feature--slide__nav').children('.feature--slide__nav__pager').find('a.act').removeClass('act');
	selector.children('.feature--slide__nav').children('.feature--slide__nav__pager').children('li:eq(' + (args.currentSlideNumber - 1) + ')').children('a').addClass('act');

	execIosSlideTracking(args);
}


function onStageImageSlideChange(args) {

	var selector = $(args.sliderContainerObject).prev('.feature--slide__nav');
	selector.children('.feature--slide__nav__pager').find('a.act').removeClass('act');
	selector.children('.feature--slide__nav__pager').children('li:eq(' + (args.currentSlideNumber - 1) + ')').children('a').addClass('act');

	execIosSlideTracking(args);
}


function imageSlideChange(args) {

	var selector = $(args.sliderContainerObject).parent('.js_image-slider');
	selector.children('.feature--slide__nav').children('.feature--slide__nav__pager').find('a.act').removeClass('act');
	selector.children('.feature--slide__nav').children('.feature--slide__nav__pager').children('li:eq(' + (args.currentSlideNumber - 1) + ')').children('a').addClass('act');

	execIosSlideTracking(args, false);
}


function onVideoSliderResize(args) {

	if (typeof(args.sliderContainerObject) == 'undefined') {
		return;
	}

	$(args.sliderContainerObject).iosSlider('update');
}


function onVideoSliderLoaded(args) {

	trackSliderCTAs(args, 'slide', 'frame-');

	if (typeof(args.sliderContainerObject) == 'undefined') {
		return;
	}

	if (isIE8()) {
		$(window).load(function() {
			$(args.sliderContainerObject).iosSlider('update');
		});
	}
}


function setImageTextSliderHeight(params) {

	trackSliderCTAs(params, 'js_slide-');

	if (typeof(params.sliderContainerObject) == 'undefined') {
		return;
	}

	var container = $(params.sliderContainerObject);

	var height = 0;
	var i = 0;
	container.children('.slider').children('.slide').each(function() {
		if ($(this).outerHeight() > height) {
			height = $(this).outerHeight();
		}
		i++;
	});
	container.outerHeight(height);
}


function getImageTextSliderSettings(numImageText) {

	if (typeof(numImageText) == 'undefined') {
		return false;
	}

	return {
		snapToChildren: true,
		desktopClickDrag: true,
		infiniteSlider: true,
		navPrevSelector: $('.js_imageTextNav_' + numImageText).children('.prev'),
		navNextSelector: $('.js_imageTextNav_' + numImageText).children('.next'),
		navSlideSelector: '.js_imageTextNav_' + numImageText + ' .slide',
		autoSlideTransTimer: 300,
		onSlideChange: onImageTextSlideChange,
		onSliderLoaded: setImageTextSliderHeight,
		onSliderResize: setImageTextSliderHeight
	};
}


function onImageSliderResize(params) {

	if (typeof(params.sliderContainerObject) == 'undefined') {
		return;
	}

	var snapSlideCenter = false;
	if (currentBreakpoint == 'mobile') {
		var snapSlideCenter = true;
	}

	var height = 0;
	$(params.sliderContainerObject).find('.img_slide').each(function() {
		if ($(this).children('.img_slider').outerHeight() > height) {

			if (currentWindowWidth >= 582) {
				height = $(this).children('.img_slider').outerHeight();
			} else {
				height = $(this).outerHeight();
			}
		}
	});

	if (height > 0) {
		$(params.sliderContainerObject).height(height);
	}

	// if (params.data.settings.snapSlideCenter != snapSlideCenter) {
		// $(params.sliderContainerObject).iosSlider('update');
		// $(params.sliderContainerObject).height(height);
	// }
	if (currentBreakpoint == 'mobile') {
		$(params.sliderContainerObject).children('div').css('height', height+'px');
		// $(params.sliderContainerObject).iosSlider('update');
	}

	imageSliderMode = currentBreakpoint;

}


function onStageContentSliderLoaded(params) {
	trackSliderCTAs(params, 'js_slide-');
}


function setStageContentSliderHeight(params) {

	var init = false;
	if (typeof(params.sliderContainerObject) != 'undefined') {
		var container = $(params.sliderContainerObject);
	} else {
		var container = $(params);
		init = true;
	}

	var height = 0;
	var i = 0;
	container.children('.content_slider').children('.slide').each(function() {
		if ($(this).outerHeight() > height) {
			height = $(this).outerHeight();
		}
		i++;
	});

	container.children('.content_slider').outerHeight(height);
}


function getStageContentSliderSettings(numStageContent) {

	if (typeof(numStageContent) == 'undefined') {
		return false;
	}

	return {
		snapToChildren: true,
		desktopClickDrag: true,
		infiniteSlider: true,
		navPrevSelector: $('.js_naviContent-' + numStageContent).children('.prev'),
		navNextSelector: $('.js_naviContent-' + numStageContent).children('.next'),
		navSlideSelector: '.js_naviContent-' + numStageContent + ' .dot',
		autoSlideTransTimer: 300,
		onSlideChange: onStageContentSlideChange,
		onSliderResize: setStageContentSliderHeight,
		onSliderLoaded: onStageContentSliderLoaded
	};
}



/**
 * partner/interview slider
 */
function setCurrentPartnerSliderMode() {

	var collapseLarge = 1024;
//	var collapseMiddle = 750;
	var collapseMiddle = 600;
	var currentWindowSize = $(window).innerWidth() + scrollbarWidth;

	if (currentWindowSize >= collapseLarge) {
		currentSliderMode = 'large';
	} else if (currentWindowSize < collapseLarge && currentWindowSize > (collapseMiddle + scrollbarWidth)) {
		currentSliderMode = 'middle';
	} else if (currentWindowSize <= collapseMiddle + scrollbarWidth) {
		currentSliderMode = 'small';
	}
}


function isEnabledPartnerSlider(selector) {

	var numElements = $(selector).find('.slide').length;
	if (numElements <= 4 && currentSliderMode == 'large') {
		return false;
	} else if (numElements <= 3 && currentSliderMode == 'middle') {
		return false;
	} else if (numElements == 1) {
		return false;
	} else {
		return true;
	}
}


function onFFSlideChange(params) {

	return;
	/**
	 * firefox bugfix:
	 * firefox doesn't display slide elements
	 * when slide in the right direction
	 */
	if (!navigator.userAgent.match(/Firefox/i)) {
		return;
	}

	if (typeof(params) == 'undefined' || typeof(params.sliderContainerObject) == 'undefined') {
		return;
	}

	var height = $(params.sliderContainerObject).height();
	$(params.sliderContainerObject).css('height', 'auto');
	$(params.sliderContainerObject).height(height);
}


function setPartnerSliderSizes(params, init) {

	if (typeof(init) != 'undefined' && init == true) {
		selector = params;
	} else {
		init = false;
		if ($(params.sliderContainerObject).closest('.js_partner-slide').length > 0) {
			var selector = params.sliderContainerObject.closest('.js_partner-slide');
		}
	}

	var prevSliderMode = currentSliderMode;

	setCurrentPartnerSliderMode();
	var desktopClickDrag = true;

	if (isEnabledPartnerSlider(selector)) {
		if (currentSliderMode == 'small') {
			$(selector).find('.next').hide();
			$(selector).find('.prev').hide();
		} else {
			$(selector).find('.next').show();
			$(selector).find('.prev').show();
		}
		desktopClickDrag = true;
	} else {
		$(selector).find('.next').hide();
		$(selector).find('.prev').hide();
		desktopClickDrag = false;
	}

	if($(selector).hasClass('partner_quote')){
		desktopClickDrag = true;
		$(selector).find('.next').show();
		$(selector).find('.prev').show();
	}

	if (init) {
		prevSliderMode = currentSliderMode;
	} else if (currentSliderMode != prevSliderMode) {
		if (currentSliderMode == 'small') {
			params.data.settings.snapSlideCenter = true;
		} else {
			params.data.settings.snapSlideCenter = false;
		}

		params.data.settings.desktopClickDrag = desktopClickDrag;
		$(params.sliderContainerObject).iosSlider('update');

		if (isMobile == true) {
			if (desktopClickDrag == false) {
				$(params.sliderContainerObject).iosSlider('lock');
			} else {
				$(params.sliderContainerObject).iosSlider('unlock');
			}
		}

	}

	var sliderHeight = 0;

	if (init) {
		$(window).on('load', function() {
			$(selector).find('.slide').each(function() {
				if ($(this).outerHeight() > sliderHeight) {
					sliderHeight = $(this).outerHeight();
				}
			});
			$(selector).find('.js_partnerSlider').children('.grid--slider').height(sliderHeight);
			$(selector).find('.js_partnerSlider').iosSlider('update');
		});
	} else {
		$(selector).find('.slide').each(function() {
			if ($(this).outerHeight() > sliderHeight) {
				sliderHeight = $(this).outerHeight();
			}
		});
		$(selector).find('.js_partnerSlider').children('.grid--slider').height(sliderHeight);
	}
}


function getPartnerSliderSettings(selector, numPartnerSlider) {

	if (typeof(numPartnerSlider) == 'undefined') {
		return false;
	}

	var settings = {
		snapToChildren: true,
		desktopClickDrag: true,
		infiniteSlider: true,
		snapSlideCenter: true,
		autoSlideTransTimer: 300,
		navPrevSelector: $('.js_iosPartnerSlide_' + numPartnerSlider).parent('.slider').children('.prev'),
		navNextSelector: $('.js_iosPartnerSlide_' + numPartnerSlider).parent('.slider').children('.next'),
		onSliderResize: setPartnerSliderSizes,
		onSliderLoaded: setPartnerSliderSizes,
		onSlideComplete: onPartnerSlideComplete
	};


	if($('.js_iosPartnerSlide_' + numPartnerSlider).parents('.js_partner-slide').hasClass('js_autoscroll')){
		settings.autoSlide = true;
		settings.autoSlideTimer = 3500;
	}


	if (currentSliderMode != 'small') {
		settings.snapSlideCenter = false;
	}

	var desktopClickDrag = true;
	if (isEnabledPartnerSlider($(selector).get(0))) {
		if (currentSliderMode == 'small') {
			$(selector).find('.next').hide();
			$(selector).find('.prev').hide();
		} else {
			$(selector).find('.next').show();
			$(selector).find('.prev').show();
		}
		desktopClickDrag = true;
	} else {
		$(selector).find('.next').hide();
		$(selector).find('.prev').hide();
		desktopClickDrag = false;
	}
	if($('.js_iosPartnerSlide_' + numPartnerSlider).parents('.js_partner-slide').hasClass('partner_quote')){
		desktopClickDrag = true;
		$(selector).find('.next').show();
		$(selector).find('.prev').show();
	}

	settings.desktopClickDrag = desktopClickDrag;
	return settings;
}

/////////// end of partner icon slider /////////////



function onStageImageSliderLoaded(args) {
	trackSliderCTAs(args, 'elem-');
}


function setStageImageHeight(args) {

	if (typeof(args.sliderContainerObject) == 'undefined') {
		var containerWidth = $(args).width();
		var container = $(args);
	} else {
		var containerWidth = $(args.sliderContainerObject).width();
		var container = $(args.sliderContainerObject);
	}

	var height = 0;
	container.children('.image_slider').children('.slide').each(function() {
		if (height < $(this).outerHeight()) {
			height = $(this).outerHeight();
		}
	});

	container.children('.image_slider').height(height);
	container.parent('article.feature').height('100%');
}


function getStageImageSettings(numImage) {

	if (typeof(numImage) == 'undefined') {
		return;
	}

	return {
		snapToChildren: true,
		desktopClickDrag: true,
		infiniteSlider: true,
		navPrevSelector: $('.js_imageNav-' + numImage).children('.prev'),
		navNextSelector: $('.js_imageNav-' + numImage).children('.next'),
		navSlideSelector: '.js_imageNav-' + numImage + ' .dot',
		autoSlideTransTimer: 300,
		onSlideChange: onStageImageSlideChange,
		onSliderResize: setStageImageHeight,
		onSliderLoaded: onStageImageSliderLoaded
	};
}


function getStageVideoSettings(numStage) {

	if (typeof(numStage) == 'undefined') {
		return;
	}

	return {
		snapToChildren: true,
		desktopClickDrag: true,
		infiniteSlider: true,
		navPrevSelector: $('.js_navi-' + numStage).children('.prev'),
		navNextSelector: $('.js_navi-' + numStage).children('.next'),
		unselectableSelector: '.unselectable',
		navSlideSelector: '.js_navi-' + numStage + ' .dot',
		autoSlideTransTimer: 300,
		onSlideComplete: onStageVideoSlideChange,
		onSliderResize: onVideoSliderResize,
		onSliderLoaded: onVideoSliderLoaded
	};
}


/*
 * feature tabs
 */
function setFeatureTabsHeight(featureTabsEl, init) {

	$(featureTabsEl).css('height', '');

	if (typeof init != 'undefined' && init == true) {
		var contentRightHeight = $(featureTabsEl).children('li').children('div').height();
	} else {
		var contentRightHeight = $(featureTabsEl).find('a.grid__unit.act').next('.feature-tabs__tabs--item').height();
	}

	var listLeftHeight = $(featureTabsEl).height();
	if (contentRightHeight > listLeftHeight) {
		$(featureTabsEl).height(contentRightHeight);
	} else {
		$(featureTabsEl).height(listLeftHeight);
	}
}


function featureTabsAccordion() {

	var clickElemClass = "js_feature-tabs";
	var slideDuration = 500;
	var activeClass = "act";
//	var lastActive = $('.js_feature-tabs li.act').get(0);
	var lastActive = null;

	/* count all elements*/
//	var countedElems = $("." + clickElemClass + " li").length;

	if ($(window).width() < 600) {
		/*unbind the click when resizing the window so that the animation can be changed*/
		$("." + clickElemClass + " li>a").unbind("click");

		/* by clicking the element, remove the activ class for all elements in the set, and set it on the clicked element.
		 * do the sliding animation for the next sibling element
		 */
		$("." + clickElemClass + " li>a").click(function() {

			/*
			 * if the element already has the active state, don't do an animation that is not visible.
			 */
			if ($(this).hasClass(activeClass)) {
				return;
			} else {

//				$('ul.js_feature-tabs').each(function(){
				$(this).parents('ul.js_feature-tabs').children('li').children('a').removeClass(activeClass);
				$(this).parents('ul.js_feature-tabs').children('li').children('div').hide();
//				});

//				$("." + clickElemClass + " li a").removeClass(activeClass);
				$(this).addClass(activeClass);
				$(this).parents('ul.js_feature-tabs').children("." + clickElemClass).children('li').children('a').not(activeClass).next("div").slideUp(slideDuration);
				$(this).next().slideDown(slideDuration);
			}

			if ((lastActive != null) &&
					(typeof(lastActive.time) != 'undefined') &&
					(typeof lastActive.time['start'] != 'undefined')) {

				lastActive.time['end'] = '';
				lastActive.time['end'] = new Date();
			}

			trackFeatureTabs(this, lastActive);

			lastActive = this;
			lastActive.time = [];
			lastActive.time['start'] = '';
			lastActive.time['start'] = new Date();

		});
	} else {

		/*unbind the click when resizing the window so that the animation can be changed*/
		$("." + clickElemClass + " li>a").unbind("click");
		$("." + clickElemClass + " li>a").click(function() {

			/*
			 * by clicking the element, remove the activ class for all elements in the set, and set it on the clicked element.
			 * do the animation for the next sibling element
			 */
			var tabsEl = $(this).closest('.' + clickElemClass);
			if (tabsEl.length > 0) {

				tabsEl.css("height", '');
				var listLeftHeight = $(this).closest('.' + clickElemClass).height();
				var contentRightHeight = $(this).next('div.feature-tabs__tabs--item').height();

				tabsEl.css("height", contentRightHeight);
				if (contentRightHeight < listLeftHeight) {
					tabsEl.css("height", listLeftHeight);
				} else {
					tabsEl.css("height", contentRightHeight);
				}
			}

			$(this).parents('ul.js_feature-tabs').children('li').each(function() {
				$(this).find('a.' + activeClass).removeClass(activeClass).next("div").hide();
			});
			$(this).addClass(activeClass).next().show();

			/*
			 * @type Number
			 */
			var i = 0;

			/**
			 * go through each element to find the position of the actual element and set it in var i.
			 */
			$("." + clickElemClass).children("li").each(function() {
				/* if the element width the active class is found, break out of the loop*/
				if ($(this).children("a").hasClass(activeClass)) {
					return false;
				} else {
					i++;
				}
			});

			/**
			 * set a negative margin for the element to simulate a absolute positioned element.
			 */
//			$(this).next("div").css("margin-top", "-" + clickElemHeight * i + "px");

			if ((lastActive != null) &&
					(typeof(lastActive.time) != 'undefined') &&
					(typeof lastActive.time['start'] != 'undefined')) {

				lastActive.time['end'] = '';
				lastActive.time['end'] = new Date();
			}

			trackFeatureTabs(this, lastActive);

			lastActive = this;
			lastActive.time = [];
			lastActive.time['start'] = '';
			lastActive.time['start'] = new Date();
		});
	}
}
/////////// end of feature tabs /////////////



/*
 * company milestones
 */

function getTopPosition(el) {
	var yPos = 0;
	while (el && !isNaN(el.offsetTop)) {
//        yPos += el.offsetTop - el.scrollTop;
		yPos += el.offsetTop;
		el = el.offsetParent;
	}
	return yPos;
}


function setMilestonePositions() {

	/**
	 * milestones: fixed images currently deactivated
	 */
	return;

	var i = 0;
	$('.company-story .grid--two-up-feature.grid--dbl-gutter').each(function() {

		var isFixed = false;
		if ($(arrPositions[i]['el']).parent('.grid__unit').hasClass('fixed')) {
			$(arrPositions[i]['el']).parent('.grid__unit').removeClass('fixed');
			isFixed = true;
		}
		var isBottom = false;
		if ($(arrPositions[i]['el']).parent('.grid__unit').hasClass('bottom')) {
			$(arrPositions[i]['el']).parent('.grid__unit').removeClass('bottom');
			isBottom = true;
		}

		arrPositions[i]['pos'] = {};
		arrPositions[i]['pos'] = getTopPosition($(this).children('.grid__unit:first-child').children('.year__chart').get(0));
		arrPositions[i]['pos'] -= $(this).children('.grid__unit:first-child').children('span').height();
		arrPositions[i]['pos'] -= offsetHeightMilestones;

		if (isFixed) {
			$(arrPositions[i]['el']).parent('.grid__unit').addClass('fixed');
		}
		if (isBottom) {
			$(arrPositions[i]['el']).parent('.grid__unit').addClass('fixed');
		}

		i++;
	});

	var positionBottom = getTopPosition($('.company-story .grid--two-up-feature.grid--dbl-gutter:last-child').get(0));
	positionBottom += $('.company-story .grid--two-up-feature.grid--dbl-gutter:last-child').height();
	positionBottom -= $('.company-story .grid--two-up-feature.grid--dbl-gutter:last-child .grid__unit').height();

	var numElements = i;
	for (var k in arrPositions) {
		if (k == 0) {
			continue;
		}

		arrPositions[k - 1]['end'] = {};
		arrPositions[k - 1]['end'] = arrPositions[k]['pos'];
	}

	arrPositions[k]['end'] = {};
	arrPositions[k]['end'] = positionBottom - $(arrPositions[k]['el']).parent('.grid__unit').children('span').height() - offsetHeightMilestones;

	var position = $(window).scrollTop();
	for (var k in arrPositions) {
		if (position < arrPositions[k]['pos']) {
			$(arrPositions[k]['el']).parent('.grid__unit').removeClass('fixed').removeClass('bottom');
//			if (k > 0) {
//				$(arrPositions[k-1]['el']).parent('.grid__unit').addClass('bottom');
//			}
		} else if (position >= arrPositions[k]['pos'] && position < arrPositions[k]['end']) {
			if (!$(arrPositions[k]['el']).parent('.grid__unit').hasClass('fixed')) {
				$(arrPositions[k]['el']).parent('.grid__unit').addClass('fixed');
				currentPosition++;
			}
		} else if (position > arrPositions[k]['end']) {
			$(arrPositions[k]['el']).parent('.grid__unit').removeClass('fixed').addClass('bottom');
		}
	}
}


function initMilestones() {

	/**
	 * milestones: fixed images currently deactivated
	 */
	return;

	var positionBottom = getTopPosition($('.company-story .grid--two-up-feature.grid--dbl-gutter:last-child').get(0));
	positionBottom += $('.company-story .grid--two-up-feature.grid--dbl-gutter:last-child').height();
	positionBottom -= $('.company-story .grid--two-up-feature.grid--dbl-gutter:last-child .grid__unit').height();

	var i = 0;
	$('.company-story .grid--two-up-feature.grid--dbl-gutter').each(function() {
		arrPositions[i] = {};
		arrPositions[i]['pos'] = {};
		arrPositions[i]['pos'] = getTopPosition($(this).children('.grid__unit:first-child').children('.year__chart').get(0));
		arrPositions[i]['pos'] -= $(this).children('.grid__unit:first-child').children('span').height();
		arrPositions[i]['pos'] -= offsetHeightMilestones;
		arrPositions[i]['el'] = {};
		arrPositions[i]['el'] = $(this).children('.grid__unit:first-child').children('.year__chart').get(0);
		i++;
	});

	var numElements = i;
	for (var k in arrPositions) {
		if (k == 0) {
			continue;
		}
		arrPositions[k - 1]['end'] = {};
		arrPositions[k - 1]['end'] = arrPositions[k]['pos'];
	}

	arrPositions[k]['end'] = {};
	arrPositions[k]['end'] = positionBottom - $(arrPositions[k]['el']).parent('.grid__unit').children('span').height() - offsetHeightMilestones;

	currentPosition = 0;
	$(window).scroll(function() {

		getWidthOfFixedElem();
		var position = $(window).scrollTop();

		if (typeof(arrPositions[currentPosition]) != "undefined") {
			if (position > arrPositions[currentPosition]['pos'] && position < arrPositions[currentPosition]['end'] && !$(arrPositions[currentPosition]['el']).parent('.grid__unit').hasClass('fixed')) {
				if (typeof(arrPositions[currentPosition - 1]) != "undefined") {
					$(arrPositions[currentPosition - 1]['el']).parent('.grid__unit').removeClass('fixed').addClass('bottom');
				}
				$(arrPositions[currentPosition]['el']).parent('.grid__unit').addClass('fixed').removeClass('bottom');
				currentPosition++;
			} else if (typeof(arrPositions[currentPosition - 1]) != "undefined" && position < arrPositions[currentPosition - 1]['pos'] && $(arrPositions[currentPosition - 1]['el']).parent('.grid__unit').hasClass('fixed')) {
				$(arrPositions[currentPosition - 1]['el']).parent('.grid__unit').removeClass('fixed');
				currentPosition--;
			} else {
				if (typeof(arrPositions[currentPosition - 1]) != 'undefined') {
					$(arrPositions[currentPosition - 1]['el']).parent('.grid__unit').removeClass('bottom').addClass('fixed');
				}
			}
		} else {

			if (typeof(arrPositions[currentPosition - 1]) == 'undefined' || typeof(arrPositions[currentPosition - 1]['end']) == 'undefined') {
				currentPosition--;
			}

			if (position >= arrPositions[currentPosition - 1]['end']) {
				$(arrPositions[currentPosition - 1]['el']).parent('.grid__unit').removeClass('fixed').addClass('bottom');
			} else if (position < arrPositions[currentPosition - 1]['end'] && position >= arrPositions[currentPosition - 1]['pos']) {
				$(arrPositions[currentPosition - 1]['el']).parent('.grid__unit').removeClass('bottom').addClass('fixed');
			}
			if (position < arrPositions[currentPosition - 1]['pos']) {
				$(arrPositions[currentPosition - 1]['el']).parent('.grid__unit').removeClass('fixed');
				currentPosition--;
			}
		}
	});

	$('.company-story .grid--two-up-feature .grid__unit+.grid__unit').css("float", "right");
}


function getWidthOfFixedElem() {
	var fixedWidth = $('.company-story .grid--two-up-feature').outerWidth();
	var fixedWidth2 = fixedWidth - 1;

	if ($(window).width() < 583) {
		$('.company-story .grid--two-up-feature').each(function() {
			$(this).children(".grid__unit:first").css("width", fixedWidth2);
		});
	} else {
		$('.company-story .grid--two-up-feature').each(function() {
			$(this).children(".grid__unit:first").css("width", fixedWidth2 / 2);
		});
	}
}
/////////// end of company milestones /////////////


/**
 * FAQ functions
 */
function initExpandingList() {
	$('.expanding-list--headline').click(function() {
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
			$(this).next('.expanding-list--text').slideDown(300);
		} else {
			$(this).removeClass('active');
			$(this).next('.expanding-list--text').slideUp(300);
		}
	});
}


function initCaseStudies() {
	var i = 0;
	$('.tx-ne-casestudies .grid--three-up>a').each(function() {
		if (i == 3) {
			$(this).children('.grid__unit').css('clear', 'left');
			i = 0;
			return true;
		}
		i++;
	});
}


function initNewsTeaser() {
	var i = 1;


	$('.tabs__content .content .news-teaser.js_latest-news .grid--two-up-feature').each(function() {
		var i =1;
		$(this).children('a').each(function() {


			if (i === 3) {
				$(this).children('.grid__unit').css('clear', 'left');
				i = 0;
				return true;
			}
			i++;
		});
	});
}


/*
 * set height of boxes: news/office/cases
 */
function setBoxHeight() {
	if (currentBreakpoint != 'mobile') {
		// set height of newsboxes
		if ($('.news-teaser').length > 0) {
			if (isIE8()) {
				setTimeout(function() {
					setNewsBoxesHeight();
				}, 200);
			} else {
				setNewsBoxesHeight();
			}
		}
		if ($('.js_case-studies').length > 0) {
			if (isIE8()) {
				setTimeout(function() {
					setNewsBoxesHeight(false, 'js_case-studies');
				}, 200);
			} else {
				setNewsBoxesHeight(false, 'js_case-studies');
			}
		}

	} else {
		if ($('.news-teaser').length > 0) {
			if (isIE8()) {
				setTimeout(function() {
					setNewsBoxesHeight(true);
				}, 200);
			} else {
				setNewsBoxesHeight(true);
			}
		}
		if ($('.js_case-studies').length > 0) {
			if (isIE8()) {
				setTimeout(function() {
					setNewsBoxesHeight(true, 'js_case-studies');
				}, 200);
			} else {
				setNewsBoxesHeight(true, 'js_case-studies');
			}
		}
//			if ($('.js_office-boxes').length > 0) {
//				if (isIE8()) {
//					setTimeout(function() {
//						setNewsBoxesHeight(true, 'js_office-boxes');
//					}, 200);
//				} else {
//					setNewsBoxesHeight(true, 'js_office-boxes');
//				}
//			}
	}

	if ($('.js_office-boxes').length > 0) {
		if (isIE8()) {
			setTimeout(function() {
				setNewsBoxesHeight(false, 'js_office-boxes');
			}, 200);
		} else {
			setNewsBoxesHeight(false, 'js_office-boxes');
		}
	}
}