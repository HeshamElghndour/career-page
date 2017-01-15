//var trackingEnabled = true;
var searchResultsTrackingEnabled = true;
var eventTrackingEnabled = true;
var videoTrackingEnabled = true;
var socialBtnTrackingEnabled = true;
var contactTrackingEnabled = true;
var downloadTrackingEnabled = true;
var trackingCode = '';


var eventTrackingBasePath = '';
var tok = ':';

var ET_Event = {
	eventStart: function() { }
};

$(document).ready(function() {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	trackingCode = getTrackingCode();
	
	$('#vmpmFrame').parent('div').hide();

	if (socialBtnTrackingEnabled) {
		$('.js_track-social a').click(function() {
			trackSocialBtn($(this).parent('li').get(0));
		});
	}

	if (downloadTrackingEnabled) {
		$('a').click(function(e) {
			trackDownload(this, e);
		});
	}
	
	if (contactTrackingEnabled) {
		$('.contact_item .email a').click(function() {
			setTimeout(function() {
				trackEmailClick();
			}, 1000);
		});
	}
	
	/**
	 * link tracking:
	 * set class "etrack_link" for activating tracking
	 * set class "etrack_name-[IDENTIFIER]" for namimg
	 */
	$('.etrack_link').click(function() {
		trackLink(this);
	});
	
	/**
	 * tracking internal search as campain
	 */
	if (typeof NELibs.pageid != 'undefined') {
		if (getLPageParam().length > 0) {
			setTimeout(function() {
				et_eC_Wrapper(getTrackingCode(), getPageName(), '', 0, '', '', 0, 0, 0, 0, 0, getLPageParam(), 0, getSegments(), getSubParam());
			}, 1000);
		}
	}
});




/**
 * get resolution code for segmentation and object name
 */
function getCurrentResolution() {
	var w = $(window).innerWidth();
	if (!navigator.userAgent.match(/AppleWebKit/i)) {
		w += getScrollbarWidth();
	}
	if (w >= widthDesktop) {
		return 'desktop';
	} else if (w >= widthTablet && w < widthDesktop) {
		return 'tablet';
	} else if (w < widthTablet) {
		return 'mobile';
	}
	return false;
}



/**
 * generates the page name
 * for the default tracking
 * Domain\Resolution\Page
 */
function getPageName() {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return '';
	}
	
	var sanitizedPageName = '';
	var path = window.location.pathname;
//	var domain = window.location.hostname;
	var breakpoint = getCurrentResolution();
	if (breakpoint == 'desktop') {
		breakpoint = 'D';
	} else if (breakpoint == 'tablet') {
		breakpoint = 'T';
	} else if (breakpoint == 'mobile') {
		breakpoint = 'M';
	}

	if (path == '/') {
		sanitizedPageName = '__INDEX__' + breakpoint + tok + 'home';
	} else {

		if (path.length == 0) {
			sanitizedPageName = '__INDEX__' + breakpoint + tok + 'home';
			return sanitizedPageName;
		}
		path = path.replace(/\/\//g, '/');
		path = path.replace(/\/nc\//g, '/');
		// old object name
//		sanitizedPageName = domain + tok + breakpoint + tok + path;
		sanitizedPageName = breakpoint + tok + path;
	}
	return sanitizedPageName;
}


function getTrackingCode() {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return '';
	}
	
	if (typeof trackingCode != 'undefined' && trackingCode.length > 0) {
		return trackingCode;
	}
	
	return '';
//	var langID = NELibs.getLangId();
//	if (langID == 0) {
//		return 'JSVdLs';
//	} else if (langID == 1) {
//		return 'JSVd09';
//	}
}



function getArea() {
	var path = window.location.pathname.replace(/\/\//g, '/').split('/');
	if (typeof path[1] == 'undefined') {
		return '';
	} else {
		if (typeof path[2] == 'undefined') {
			return path[1];
		} else {
			return path[1]+'/'+path[2];
		}
	}
}



function getSegments() {
	var resolution = getCurrentResolution();
	if (!resolution) {
		return '';
	}
	return 'resolution=' + resolution;
}


function getLPageParam() {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return '';
	}
	
	if (typeof searchResultsPageID == 'undefined' || searchResultsPageID.length == 0) {
		return "";
	}
	
	if (searchResultsTrackingEnabled && NELibs.pageid == searchResultsPageID) {
		
		if (typeof lpageParam == 'undefined' || lpageParam.length == 0) {
			return '';
		}
		
		return lpageParam;
	}
	
	return '';
	
//	if (searchResultsTrackingEnabled && NELibs.pageid == searchResultsPageID) {
//		
//		if (searchResultsPageID == 22) {
//			if (lang_uid == 0) {
//				return '3';
//			} else if (lang_uid == 1) {
//				return "1";
//			} else {
//				return '';
//			}
//		} else if (searchResultsPageID == 252) {
//			return '2';
//		} else if (searchResultsPageID == 250) {
//			return '1';
//		} else if (searchResultsPageID == 390) {
//			return '1';
//		} else if (searchResultsPageID == 493) {
//			return '1';
//		} else if (searchResultsPageID == 436) {
//			return '1';
//		} else if (searchResultsPageID == 518) {
//			return '1';
//		}
//		
//	} else {
//		return "";
//	}
}


function getSubParam() {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return '';
	}
        
	if (typeof NELibs.pageid == 'undefined' || typeof searchResultsPageID == 'undefined') {
		return "";
	}
	
	if (searchResultsTrackingEnabled && NELibs.pageid == searchResultsPageID) {
		return $('#search_query').val();
	} else {
		return "";
	}
}


function trackLink(link) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	var trackCat = 'link';
	var name = NELibs.getClassBeginningWith($(link), 'etrack_name-', true);
	if (name.length == 0) {
		name = $(link).text();
		name = name.replace(/ /g, '_');
	}

	var trackingIdentifier = eventTrackingBasePath + 'link' + tok + name;
	ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_CLICK', getSegments());
}


function setEventTrackingBasePath() {
	eventTrackingBasePath = getPageName() + tok;
}


function resetVMTracking() {
	if (typeof et_vm_reload == 'function') {
		et_vm_reload();
	}
}


function trackFormSubmit(formEl, formIdentifier) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (!contactTrackingEnabled) {
		return;
	}
	
	if (typeof formIdentifier == 'undefined') {
		formIdentifier = 'form';
		var nameAttr = formEl.attr('name');
		if (nameAttr && nameAttr.length > 0) {
			formIdentifier = formEl.attr('name');
			var pos = formIdentifier.indexOf('_');
			formIdentifier = formIdentifier.substring(0, pos);
		}
	}
	
	var trackCat = 'contact';
	var trackingIdentifier = eventTrackingBasePath + 'form' + tok + formIdentifier;
	ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_CLICK', getSegments());
}


function trackEmailClick() {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (!contactTrackingEnabled) {
		return;
	}
	
	var formIdentifier = 'email_click';
	
	var trackCat = 'contact';
	var trackingIdentifier = eventTrackingBasePath + 'mailto' + tok + formIdentifier;
	ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_CLICK', getSegments());
}


function trackStageFader(faderObject, mode) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (typeof faderObject == 'undefined') {
		return false;
	}

	var sliderEl = $(faderObject).find('.slideStage_content');

	if (typeof mode == 'undefined' || mode != 'dot') {

		var direction = 'right';
		var offset = faderObject.fadeStageIndex - faderObject.prevFadeStageIndex;
		if (offset == -1) {
			direction = 'left';
		} else if (offset < -1) {
			direction = 'left';
		}
	} else {
		direction = 'dot_' + faderObject.fadeStageIndex;
	}

	var sliderClass = NELibs.getClassBeginningWith(sliderEl, 'js_etrack_', true);
	var trackCat = NELibs.getClassBeginningWith(sliderEl, 'js_trackCat-', true);
	if (sliderClass.length == 0) {
		sliderClass = trackCat;
	}

	var identifier = sliderClass;
	var prevSlide = 'slide_' + faderObject.prevFadeStageIndex;
	var trackingIdentifier = eventTrackingBasePath + identifier + tok + prevSlide + tok + direction;

	ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_CLICK', getSegments());
}


function execIosSlideTracking(sliderParams, trackTime) {
	
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (typeof sliderParams == 'undefined' ||
		typeof sliderParams.slideChanged == 'undefined' ||
		sliderParams.slideChanged == false) {
		
		return false;
	}
	
	if (typeof eventTrackingEnabled == 'undefined' || eventTrackingEnabled == false) {
		return false;
	}
	
	var direction = 'right';
	if (typeof sliderParams.eventType != 'undefined') {

		if (sliderParams.eventType == 'auto') {
			return false;
		} else if (sliderParams.eventType == 'touch') {

			var offset = sliderParams.targetSlideNumber - sliderParams.prevSlideNumber;
			if (offset < 0) {
				direction = 'left';
			} else {
				direction = 'right';
			}
		} else if (sliderParams.eventType == 'prev') {
			direction = 'left';
		} else if (sliderParams.eventType == 'dot') {
			direction = 'dot_' + sliderParams.targetSlideNumber;
		}
	}
	
	var sliderClass = NELibs.getClassBeginningWith($(sliderParams.sliderContainerObject), 'js_etrack_', true);
	var trackCat = NELibs.getClassBeginningWith($(sliderParams.sliderContainerObject), 'js_trackCat-', true);
	if (sliderClass.length == 0) {
		sliderClass = trackCat;
	}

	var identifier = sliderClass;
	var prevSlide = 'slide_' + sliderParams.prevSlideNumber;
	var trackingIdentifier = eventTrackingBasePath + identifier + tok + prevSlide + tok + direction;
	ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_CLICK', getSegments());

	if (typeof trackTime != 'undefined' && trackTime == false) {
		return true;
	}

	/*
	 * slide time messuring
	 */

	var activeSlide = 'slide_' + sliderParams.targetSlideNumber;
	var elSlider = $(sliderParams.sliderContainerObject).get(0);
	if (typeof elSlider.slides == 'undefined') {
		elSlider.slides = [];
	}

	if (typeof elSlider.slides[activeSlide] == 'undefined') {
		elSlider.slides[activeSlide] = [];
		elSlider.slides[activeSlide]['start'] = new Date();
	}
	if (typeof elSlider.slides[activeSlide]['start'] == 'undefined') {
		elSlider.slides[activeSlide]['start'] = 0;
		elSlider.slides[activeSlide]['start'] = new Date();
	} else {
		elSlider.slides[activeSlide]['start'] = new Date();
	}

	if (typeof elSlider.slides[prevSlide] != 'undefined' && typeof elSlider.slides[prevSlide]['start'] != 'undefined') {
		var currentTime = new Date();
		var displayTime = Math.floor((currentTime - elSlider.slides[prevSlide]['start']) / 1000);
		if (displayTime > 0) {
			var trackTime = eventTrackingBasePath + identifier + tok + prevSlide + tok + 'time' + tok + displayTime;
			ET_Event.eventStart(trackCat, trackTime, 'display_time', getSegments());
		}
	}

	return true;
}


function trackStageFaderVideo(videoObject, event) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (!videoTrackingEnabled) {
		return null;
	}
	if (typeof videoObject == 'undefined') {
		return false;
	}
	if (typeof event == 'undefined') {
		event = 'start';
	}

	var sliderEl = $(videoObject).closest('.slideStage_content');
	var sliderClass = NELibs.getClassBeginningWith(sliderEl, 'js_etrack_', true);
	var trackCat = NELibs.getClassBeginningWith(sliderEl, 'js_trackCat-', true);
	if (sliderClass.length == 0) {
		sliderClass = trackCat;
	}

	var activeSlideEl = $(videoObject).closest('.fading-item');
	var videoIdentifier = NELibs.getClassBeginningWith(activeSlideEl, 'js_etrack_video_', true);
	var activeSlide = 'slide_' + NELibs.getClassBeginningWith(activeSlideEl, 'js-item-', true);
	if (videoIdentifier.length == 0) {
		var iframeID = $(videoObject).attr('id');
		var videoData = players[iframeID].getVideoData();
		if (typeof videoData.video_id != 'undefined') {
			videoIdentifier = 'vid_' + videoData.video_id;
		} else {
			videoIdentifier = activeSlide + '_vid';
		}
	}

	var btnType = '';
	if (sliderEl.find('.js_btn--play').length > 0) {
		if (sliderEl.find('.js_btn--play').hasClass('btn')) {
			btnType = 'btn:red';
		} else if (sliderEl.find('.js_btn--play').hasClass('btn--play')) {
			btnType = 'btn:arrow';
		}
	}
	
	var trackingIdentifier = eventTrackingBasePath + sliderClass + tok + activeSlide + tok;
	var eventBtn = trackingIdentifier+btnType;
	var eventVideo = trackingIdentifier+videoIdentifier;
	
//	var trackingIdentifier = eventTrackingBasePath + sliderClass + tok + activeSlide + tok + btnType + videoIdentifier;
	if (event == 'stop') {
		ET_Event.videoStop(eventVideo);
	} else if (event == 'pause') {
		ET_Event.videoPause(eventVideo);
	} else if (event == 'start') {
		ET_Event.videoStart(eventVideo);
		ET_Event.eventStart('button', eventBtn, 'ET_EVENT_CLICK', getSegments());
	} else {
		return false;
	}

	return true;
}


function trackVideoSliderVideo(videoObject, event, isStageSlider) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (!videoTrackingEnabled) {
		return null;
	}

	if (!isStageSlider) {
		var sliderParams = $(videoObject).closest('.js_trackCat-slider-video').data('args');
	} else {
		var sliderParams = $(videoObject).closest('.js_trackCat-slider-stage').data('args');
	}
	
	if (typeof event == 'undefined') {
		event = 'start';
	}

	if (typeof sliderParams == 'undefined' || sliderParams.sliderContainerObject == 'undefined') {
		var sliderClass = NELibs.getClassBeginningWith($(videoObject).closest('.js_trackCat-slider-video'), 'js_etrack_', true);
		var trackCat = NELibs.getClassBeginningWith($(videoObject).closest('.js_trackCat-slider-video'), 'js_trackCat-', true);
	} else {
		var sliderClass = NELibs.getClassBeginningWith($(sliderParams.sliderContainerObject), 'js_etrack_', true);
		var trackCat = NELibs.getClassBeginningWith($(sliderParams.sliderContainerObject), 'js_trackCat-', true);
	}
	if (sliderClass.length == 0) {
		sliderClass = trackCat;
	}

	var identifier = sliderClass;
	if (!isStageSlider) {
		var activeSlideNum = NELibs.getClassBeginningWith($(videoObject).parent('.video__frame').parent('.js_vframe'), 'frame-', true);
	} else {
		var activeSlideNum = NELibs.getClassBeginningWith($(videoObject).closest('.fading-item'), 'js-item-', true);
	}
	
	var activeSlide = 'slide_' + activeSlideNum;
	if (typeof isStageSlider == 'undefined') {
		isStageSlider = false;
		slideNumPrefix = '.js_vframe.frame-';
	} else {
		slideNumPrefix = '.fading-item.js-item-';
	}
	
	if (typeof sliderParams == 'undefined' || sliderParams.sliderContainerObject == 'undefined') {
		var activeSlideEl = $(videoObject).closest('.js_trackCat-slider-video').find(slideNumPrefix + activeSlideNum);
	} else {
		var activeSlideEl = $(sliderParams.sliderContainerObject).find(slideNumPrefix + activeSlideNum);
	}
	var videoIdentifier = NELibs.getClassBeginningWith(activeSlideEl, 'js_etrack_video_', true);
	if (videoIdentifier.length == 0) {

		var iframeID = activeSlideEl.find('iframe').attr('id');
		var videoData = players[iframeID].getVideoData();
		if (typeof videoData.video_id != 'undefined') {
			videoIdentifier = 'vid_' + videoData.video_id;
		} else {
			videoIdentifier = activeSlide + '_vid';
		}
	}
	
	if (typeof sliderParams == 'undefined' || sliderParams.sliderContainerObject == 'undefined') {
		var elBtn = $(videoObject).closest('.js_trackCat-slider-video').find('.js_btn--play');
	} else {
		var elBtn = $(sliderParams.sliderContainerObject).find('.js_btn--play');
	}
	var btnType = '';
	if (elBtn.length > 0) {
		if (elBtn.hasClass('btn')) {
			btnType = 'btn:red';
		} else if (elBtn.hasClass('btn--play')) {
			btnType = 'btn:arrow';
		}
	}

	var trackingIdentifier = eventTrackingBasePath + identifier + tok + activeSlide + tok;
	var eventBtn = trackingIdentifier+btnType;
	var eventVideo = trackingIdentifier+videoIdentifier;
	
	if (event == 'stop') {
		ET_Event.videoStop(eventVideo);
	} else if (event == 'pause') {
		ET_Event.videoPause(eventVideo);
	} else if (event == 'start') {
		ET_Event.videoStart(eventVideo);
		ET_Event.eventStart('button', eventBtn, 'ET_EVENT_CLICK', getSegments());
	} else {
		return false;
	}

	return true;
}


function trackSingleVideo(selector, event, namePrefix) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (!videoTrackingEnabled) {
		return null;
	}
	if (typeof event == 'undefined') {
		return false;
	}
	if (typeof selector == 'undefined' || $(selector).length == 0) {
		return false;
	}
	
	if (typeof namePrefix != 'undefined') {
		var videoIdentifier = NELibs.getClassBeginningWith($(selector), namePrefix, true);
	} else {
		var videoIdentifier = NELibs.getClassBeginningWith($(selector), 'js_etrack_video_', true);
	}
	if (videoIdentifier.length == 0) {
		var iframeID = $(selector).find('iframe').attr('id');
		var videoData = players[iframeID].getVideoData();
		if (typeof videoData.video_id != 'undefined') {
			videoIdentifier = 'vid_' + videoData.video_id;
		} else {
			videoIdentifier = 'film';
		}
	}
	
	var elBtn = $(selector).find('.js_btn--play');
	var btnType = '';
	if (elBtn.length > 0) {
		if (elBtn.hasClass('btn')) {
			btnType = 'btn:red';
		} else if (elBtn.hasClass('btn--play')) {
			btnType = 'btn:arrow';
		}
	}
	
	var trackCat = 'button';
	var eventBtn = eventTrackingBasePath+btnType;
	var eventVideo = eventTrackingBasePath+videoIdentifier;
	if (event == 'stop') {
		ET_Event.videoStop(eventVideo);
	} else if (event == 'pause') {
		ET_Event.videoPause(eventVideo);
	} else if (event == 'start') {
		ET_Event.videoStart(eventVideo);
		ET_Event.eventStart(trackCat, eventBtn, 'ET_EVENT_CLICK', getSegments());
	} else {
		return false;
	}

	return true;
}


function trackFeatureTabs(tab, lastTab) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (!eventTrackingEnabled) {
		return null;
	}
	if (typeof tab == 'undefined') {
		return false;
	}
	if (typeof lastTab == 'undefined') {
		lastTab = null;
	}
	
	if ($(tab).parent('li').length == 0) {
		return false;
	}
	
	var tabName = parseInt($(tab).parent('li').index())+1;
	tabName = 'tab_'+tabName;
	var trackCat = 'feature_tabs';

	var identifier = '';
	if ($(tab).parent('li').parent('ul').length > 0) {
		identifier = NELibs.getClassBeginningWith($(tab).parent('li').parent('ul'), 'js_etrack_tabs_', true);
	}
	
	if ($(tab).parent('li').parent('ul').length == 0 || identifier.length == 0) {
		identifier = 'feature_tabs';
	}
	
	var trackingIdentifier = eventTrackingBasePath + identifier + tok + tabName;
	ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_CLICK', getSegments());

	/*
	 * time tracking
	 */
	if (lastTab == null) {
		return true;
	}

	if ((typeof lastTab.time != 'undefined') &&
		(typeof lastTab.time['start'] != 'undefined') &&
		(typeof lastTab.time['end'] != 'undefined')) {

		var displayTime = Math.floor((lastTab.time['end'] - lastTab.time['start']) / 1000);
	} else {
		return;
	}
	
	var tabName = parseInt($(lastTab).parent('li').index())+1;
	tabName = 'tab_'+tabName;
	
	var trackingIdentifier = eventTrackingBasePath + identifier + tok + tabName + tok + 'time' + tok + displayTime;
	ET_Event.eventStart(trackCat, trackingIdentifier, 'display_time', getSegments());
	
	return true;
}


function trackSocialBtn(selector) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (typeof(selector) == 'undefined') {
		return;
	}
	
	var trackCat = 'social-button';
	var type = NELibs.getClassBeginningWith($(selector), 'js_track_btn-', true);
	var trackingIdentifier = eventTrackingBasePath + type;
	ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_CLICK', getSegments());
//	et_eC_Wrapper(getTrackingCode(), trackingIdentifier, "", "", trackingIdentifier, "", "", "", "", "", "", "", "", getSegments(), "");
	
	return;
}


function trackDownload(selector, event) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (typeof(selector) == 'undefined') {
		return;
	}

	if (typeof $(selector).attr('href') == 'undefined' || !$(selector).attr('href')) {
		return;
	}

	var target = $(selector).attr('href');

	if (target.length <= NELibs.getBaseUrl().length + 4) {
		return;
	}

	var file = target.replace(NELibs.getBaseUrl(), '');
	var fileExt = file.substr(file.length - 3, file.length - 1).toLowerCase();
	if (fileExt != 'pdf' &&
		fileExt != 'zip' &&
		fileExt != 'jpg' &&
		fileExt != 'jpeg' &&
		fileExt != 'png' &&
		fileExt != 'gif') {

		return;
	}

	var href = $(selector).attr('href');
	if (href.indexOf('javascript:') > -1 || href.length == 0) {
		return true;
	}

	var targetBlank = false;
	if (typeof $(selector).attr('target') != 'undefined' && $(selector).attr('target') == '_blank') {
		targetBlank = true;
	}

	if (!targetBlank) {
		event.preventDefault();
	}

	var posFileNmae = file.lastIndexOf('/') + 1;
	var fileName = file.substring(posFileNmae);
	var trackCat = 'ET_EVENT_DOWNLOAD';
	var trackingIdentifier = eventTrackingBasePath + fileName;
	
	ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_DOWNLOAD', getSegments());
	et_eC_Wrapper(getTrackingCode(), trackingIdentifier, "", "", trackingIdentifier, "", "", "", "", "", "", "", "", getSegments(), "");

	setTimeout(function() {
		if (targetBlank) {
			return true;
		} else {
			if (href.substr(0,4) != 'http') {
				if (href.substr(0,1) == '/') {
					href = href.substr(1);
				}
				href = NELibs.getBaseUrl()+href;
			}
			location.href = href;
		}
	}, 1000);

	return;
}


function trackSliderCTAs(sliderParams, slideClsPrefix) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (typeof sliderParams == 'undefined') {
		return;
	}
	
	var sliderObject = sliderParams;
	if (typeof sliderParams.sliderContainerObject != 'undefined') {
		sliderObject = sliderParams.sliderContainerObject;
	}
	
	var sliderClass = NELibs.getClassBeginningWith($(sliderObject), 'js_etrack_', true);
	var trackCat = NELibs.getClassBeginningWith($(sliderObject), 'js_trackCat-', true);
	
	if (sliderClass.length == 0) {
		sliderClass = trackCat;
	}
	
//	var activeSlideNum = '';
	$(sliderObject).find('.slide').each(function() {

		$(this).find('a').each(function() {
			
			var target = '';
			if (typeof $(this).attr('href') != 'undefined') {
				target = $(this).attr('href');
			}
			
//			if (target.length <= NELibs.getBaseUrl().length + 4) {
//				return true;
//			}

			var file = target.replace(NELibs.getBaseUrl(), '');
			var fileExt = file.substr(file.length - 3, file.length - 1).toLowerCase();
			if (fileExt == 'pdf' ||
				fileExt == 'zip' ||
				fileExt == 'jpg' ||
				fileExt == 'jpeg' ||
				fileExt == 'png' ||
				fileExt == 'gif') {

				return true;
			}
			
			$(this).unbind('click');
//			var target = '';
//			if (typeof $(this).attr('href') != 'undefined') {
//				target = $(this).attr('href');
//			}

			var targetBlank = false;
			if (typeof $(this).attr('target') != 'undefined' && $(this).attr('target') == '_blank') {
				targetBlank = true;
			}
			
			if (target.length > 0 && target.indexOf('javascript:') == -1 && targetBlank == false) {
				if (typeof $(this).attr('onclick') == 'undefined') {
					$(this).attr('onclick', 'return false');
				} else {
					var onclick = $(this).attr('onclick') + ' return false;';
					$(this).attr('onclick', onclick);
				}
			}
		});

		$(this).find('a').click(function() {
			
			var href = $(this).attr('href');
			if (!href) {
				return true;
			}
			if (href.indexOf('javascript:') > -1 || href.length == 0) {
				return true;
			}
			
			var linkText = $(this).text();
			var activeSlideEl = $(this).closest('.slide');
			var activeSlideNum = NELibs.getClassBeginningWith(activeSlideEl, slideClsPrefix, true);
			if (activeSlideNum.length == 0) {
				activeSlideNum = '';
			} else {
				activeSlideNum = 'slide_' + activeSlideNum + tok;
			}

			linkText = linkText.replace(/ /g, '_').toLowerCase();
			var trackingIdentifier = eventTrackingBasePath + sliderClass + tok + activeSlideNum + 'link' + tok + linkText;

			var targetBlank = false;
			if (typeof $(this).attr('target') != 'undefined' && $(this).attr('target') == '_blank') {
				targetBlank = true;
			}
			
			ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_CLICK', getSegments());
			setTimeout(function() {
				if (targetBlank) {
					return true;
				} else {
					if (href.substr(0,4) != 'http') {
						if (href.substr(0,1) == '/') {
							href = href.substr(1);
						}
						href = NELibs.getBaseUrl()+href;
					}
					location.href = href;
				}
			}, 1000);
		});
	});
	
	return false;
}


function trackFaderCTAs(faderObject, slideClsPrefix) {
	
	if (typeof trackingEnabled == 'undefined' || !trackingEnabled) {
		return;
	}
	
	if (typeof faderObject == 'undefined') {
		return;
	}

	var sliderEl = $(faderObject).find('.slideStage_content');

	var sliderClass = NELibs.getClassBeginningWith(sliderEl, 'js_etrack_', true);
	var trackCat = NELibs.getClassBeginningWith(sliderEl, 'js_trackCat-', true);
	if (sliderClass.length == 0) {
		sliderClass = trackCat;
	}
	
//	var activeSlideNum = '';
	sliderEl.find('.slide').each(function() {

		$(this).find('a').each(function() {

			$(this).unbind('click');

			var target = '';
			if (typeof $(this).attr('href') != 'undefined') {
				target = $(this).attr('href');
			}
			if (target.length > 0 && target.indexOf('javascript:') == -1) {
				if (typeof $(this).attr('onclick') == 'undefined') {
					$(this).attr('onclick', 'return false');
				} else {
					var onclick = $(this).attr('onclick') + ' return false;';
					$(this).attr('onclick', onclick);
				}
			}
		});
		$(this).find('a').click(function() {

			if (!$(this).attr('href')) {
				return true;
			}
			var href = $(this).attr('href');
			if (href.indexOf('javascript:') > -1 || href.length == 0) {
				return true;
			}

			var linkText = $(this).text();
			var activeSlideEl = $(this).closest('.slide');
			var activeSlideNum = NELibs.getClassBeginningWith(activeSlideEl, slideClsPrefix, true);
			if (activeSlideNum.length == 0) {
				activeSlideNum = '';
			} else {
				activeSlideNum = 'slide_' + activeSlideNum + tok;
			}

			linkText = linkText.replace(/ /g, '_').toLowerCase();
			var trackingIdentifier = eventTrackingBasePath + sliderClass + tok + activeSlideNum + 'link' + tok + linkText;

			var targetBlank = false;
			if (typeof $(this).attr('target') != 'undefined' && $(this).attr('target') == '_blank') {
				targetBlank = true;
			}

			ET_Event.eventStart(trackCat, trackingIdentifier, 'ET_EVENT_CLICK', getSegments());
			setTimeout(function() {
				if (targetBlank) {
					return true;
				} else {
					location.href = href;
				}
			}, 1000);
		});
	});
	return false;
}

