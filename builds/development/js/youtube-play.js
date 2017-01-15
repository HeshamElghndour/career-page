
var players = {};
var previousState = -1;

$(document).ready(function() {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

function onYouTubeIframeAPIReady() {

	var iframeID = null;
	var i = 1;


	if (isSafari4()) {
		$(".video__overlay").hide();
	}
	if (isIpad()) {
		if ($(".slider .js_vframe").length > 1) {
			$(".js_vframe").addClass("smallPlayer");
		}
	}
//	if (isSafari4() || isSafari5() || isIOS()) {
//		return;
//	}

	$('.js_yt-video').each(function() {

		$(this).attr('id', 'yt-video-' + i);
		iframeID = 'yt-video-' + i;

		players[iframeID] = {};
		players[iframeID] = new YT.Player(iframeID, {
			events: {
				'onStateChange': onPlayerStateChange
			}
		});
		i++;
	});
}



function getVideoURL(selector, videoID) {

	if (typeof(videoID) == 'undefined') {
		return;
	}

	var html5Video = 1;
	if (isIE8() || isSafari4()) {
		html5Video = 0;
	}


	if ($(selector).attr('src') == '') {
		$(selector).attr('src', 'https://www.youtube.com/embed/' + videoID + '?enablejsapi=1&rel=0&html5=' + html5Video + '&wmode=opaque');
	}
}




/**
 * event: video state changed
 * 
 * -1 (unstarted)
 * 0 (ended)
 * 1 (playing)
 * 2 (paused)
 * 3 (buffering)
 * 5 (video cued)
 */
function onPlayerStateChange(newState) {

	if (typeof(newState.target.a) != "undefined" &&
			typeof(newState.target.a.id) != "undefined" &&
			typeof(players[newState.target.a.id]) != "undefined") {

		if ((newState.data == 1 || newState.data == 3)) {

			var videoID = newState.target.a.id;
			var navi = null;
			if ($('#' + videoID).closest('.js_video-content').find('.feature--slide__nav').length > 0) {

				var container = $('#' + videoID).closest('.js_video-content');
				if (container.hasClass('js_stage-slide')) {
					if (currentBreakpoint != 'mobile') {
						resetFadeInterval(container.get(0), true);
					} else {
						container.find('.slideStage_content').iosSlider('autoSlidePause');
					}
				}

				navi = container.find('.feature--slide__nav');
				naviEl = navi.get(0);
				naviEl.hovered = false;

				var hoverElem = $('#' + videoID).closest('.slide');
				hoverEl = hoverElem.get(0);
				hoverEl.hovered = false;

				if (!isMobile) {
					hoverElem.unbind('hover');
					hoverElem.hover(function() {
						hoverEl.hovered = true;
						navi.fadeIn('slow');
					}, function() {
						hoverEl.hovered = false;
						setTimeout(function() {
							if (!naviEl.hovered && !hoverEl.hovered) {
								navi.fadeOut('slow');
							}
						}, 1000);
					});

					navi.unbind('hover');
					navi.hover(function() {
						naviEl.hovered = true;
					}, function() {
						naviEl.hovered = false;
						setTimeout(function() {
							if (!naviEl.hovered && !hoverEl.hovered) {
								navi.fadeOut('slow');
							}
						}, 1000);
					});

				} else {
					navi.hide();
				}
			}
			
			// video start
			if (previousState == -1 && newState.data == 1) {
				
				if ($('#'+videoID).closest('.js_trackCat-slider-video').length > 0) {
//					trackVideoSliderVideo($('#'+videoID).closest('.js_trackCat-slider-video').data('args'), 'start');
					trackVideoSliderVideo($('#'+videoID).get(0), 'start');
					
				} else if ($('#'+videoID).closest('.js_stage-slide').length > 0) {
					if (currentBreakpoint != 'mobile') {
						trackStageFaderVideo($('#'+videoID).get(0), 'start');
					} else {
						trackVideoSliderVideo($('#'+videoID).get(0), 'start', true);
					}
					
				} else if ($('#'+videoID).parent('.js_film-module').length > 0) {
					trackSingleVideo($('#'+videoID).parent('.js_film-module').get(0), 'start');
				}
			
			// video continue after pause
			} else if (previousState == 2 && newState.data == 1) {
				
				/**
				 * @todo event:start hier nicht richtig für dauer-tracking
				 */
//				if ($('#'+videoID).closest('.js_trackCat-slider-video').length > 0) {
//					trackVideoSliderVideo($('#'+videoID).get(0), 'start');
//					
//				} else if ($('#'+videoID).closest('.js_stage-slide').length > 0) {
//					if (currentBreakpoint != 'mobile') {
//						trackStageFaderVideo($('#'+videoID).get(0), 'start');
//					} else {
//						trackVideoSliderVideo($('#'+videoID).get(0), 'start', true);
//					}
//					
//				} else if ($('#'+videoID).parent('.js_film-module').length > 0) {
//					trackSingleVideo($('#'+videoID).parent('.js_film-module').get(0), 'start');
//				}
			}
			
		} else if ((newState.data == 0 || newState.data == 2)) {

			var videoID = newState.target.a.id;
			if ($('#' + videoID).closest('.js_video-content').find('.feature--slide__nav').length > 0) {
				var container = $('#' + videoID).closest('.js_video-content');
				container.find('.feature--slide__nav').show();
				container.find('.feature--slide__nav').unbind('hover');
				$('#' + videoID).closest('.slide').unbind('hover');
				navi = container.find('.feature--slide__nav');
				if (isMobile) {
					navi.show();
				}
			}
			
			var event = 'stop';
			if (newState.data == 2) {
				event = 'pause';
			}
			var playTime = players[videoID].getCurrentTime();
			var duration = players[videoID].getDuration();
			if (event == 'pause' && playTime == duration) {
				return;
			}
			
//			if (event == 'pause') {
//				return;
//			}
			
			if ($('#'+videoID).closest('.js_trackCat-slider-video').length > 0) {
				trackVideoSliderVideo($('#'+videoID).get(0), event);
				
			} else if ($('#'+videoID).parent('.js_film-module').length > 0) {
				trackSingleVideo($('#'+videoID).parent('.js_film-module').get(0), event);
				
			} else if ($('#'+videoID).closest('.js_stage-slide').length > 0) {
				if (currentBreakpoint != 'mobile') {
					trackStageFaderVideo($('#'+videoID).get(0), event);
				} else {
					trackVideoSliderVideo($('#'+videoID).get(0), event, true);
				}
			}
		}
		
		/*
		 * don't remember the BUFFERING state
		 */
		if (newState.data != 3) {
			previousState = newState.data;
		}
	}

}


/**
 * functions
 */

function stopYouTubeVideo(videoID) {

	if (typeof(videoID) == 'undefined' && typeof(players[videoID]) == 'undefined') {
		return;
	}

	if ($('#' + videoID).closest('.js_video-content').find('.feature--slide__nav').length > 0) {
		var container = $('#' + videoID).closest('.js_video-content');
		container.find('.feature--slide__nav').show();
		container.unbind('hover');
	}

	if (isIOS() || isSafari4()) {
		return false;
	}

	players[videoID].stopVideo();
}


function pauseYouTubeVideo(videoID) {

	if (typeof(videoID) == 'undefined' && typeof(players[videoID]) == 'undefined') {
		return;
	}

	if ($('#' + videoID).closest('.js_video-content').find('.feature--slide__nav').length > 0) {
		var container = $('#' + videoID).closest('.js_video-content');
//		container.find('.feature--slide__nav').unbind('hover');
		container.find('.feature--slide__nav').show();
		$('#' + videoID).closest(".video__overlay").show();
		container.unbind('hover');
	}

	if (isIOS() || isSafari4()) {
		return false;
	}

	players[videoID].pauseVideo();
}


function playYouTubeVideo(btnSelector) {


	if (typeof(btnSelector) == 'undefined') {
		return false;
	}

	btnSelector.closest(".video__overlay").hide();
	var videoID = btnSelector.closest('.js_vframe').find('.js_yt-video').attr('id');

	if (typeof(players[videoID]) == 'undefined') {
		return false;
	}

	if (isIOS() || isSafari4()) {
		return false;
	}

	players[videoID].playVideo();
	return true;
}


/**
 * getVideoState()
 * 
 * @return
 * true		a video is played
 * false	no videos are played
 */
function getYouTubeVideoState(videoID) {

	var playStatus = false;

	if (typeof(videoID) == 'undefined') {
		for (var k in players) {
			if (players[k].getPlayerState() == 1 || players[k].getPlayerState() == 3) {
				playStatus = true;
			}
		}
	} else if (typeof(players[videoID]) != 'undefined') {
		if (players[videoID].getPlayerState() == 1 || players[videoID].getPlayerState() == 3) {
			playStatus = true;
		}
	}

	return playStatus;
}
