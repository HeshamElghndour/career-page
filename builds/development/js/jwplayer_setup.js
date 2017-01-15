/**
 * setup for jwplayer
 */

var videos = {};

$(document).ready(function() {
	var videoID = null;
	var i = 1;
	
	$('.js_yt-video').each(function() {
		
		$(this).attr('id', 'yt-video-'+i);
		videoID = 'yt-video-'+i;
		
		var resolution = NELibs.getClassBeginningWith($(this), 'js_res-', true);
		if (resolution.length > 0) {
			resolution = resolution.replace('_',':');
		} else {
			resolution = '12:5';
		}
		var videoURL = $(this).text();
		
		jwplayer(videoID).setup({
			width: '100%',
			height: '100%',
			file: videoURL,
			stretching: 'exactfit',
			aspectratio: resolution,
			flashplayer: "/fileadmin/templates/js/vendor/jwplayer.swf"
		}).onBuffer(function() {
			onPlayVideo(this.id);
		}).onPlay(function() {
			onPlayVideo(this.id);
		}).onPause(function() {
			onStopVideo(this.id);
		}).onIdle(function() {
			onStopVideo(this.id);
		});
		
		videos[videoID] = false;
		i++;
	});
});




/**
 * Events
 */ 
function onPlayVideo(videoID) {
	
	if (videos[videoID] == true) {
		return;
	}
	
	videos[videoID] = true;
	
	var navi = null;
	if ($('#'+videoID).closest('.js_video-content').find('.feature--slide__nav').length > 0) {
		
		var container = $('#'+videoID).closest('.js_video-content');
		if (container.hasClass('js_stage-slide')) {
			if (currentBreakpoint != 'mobile') {
				resetFadeInterval(container.get(0), true);
			} else {
				container.find('.slideStage_content').iosSlider('autoSlidePause');
			}
		}
		
		navi = container.find('.feature--slide__nav');
		navi.hide();
		if (currentBreakpoint != 'mobile') {
			container.unbind('hover');
			container.hover(function() {
				navi.fadeIn('slow');
			}, function() {
				navi.fadeOut('slow');
			});
		}
	}
}


function onStopVideo(videoID) {

	if (typeof(videoID) == 'undefined') {
		return false;
	}
	
	var container = $('#'+videoID).closest('.js_video-content');
	
	container.find('.feature--slide__nav').show();
	container.unbind('hover');
	
	videos[videoID] = false;
}



/**
 * Methodes
 */
function playVideo(btnSelector) {
	
	if (typeof(btnSelector) == 'undefined') {
		return false;
	}
	
	btnSelector.closest('.js_vframe').find('.video__overlay').hide();
	
	if (btnSelector.closest('.js_vframe').find('object').length > 0) {
		var videoID = btnSelector.closest('.js_vframe').find('object').attr('id');
		
	} else if (btnSelector.closest('.js_vframe').children('div').children('div').children('embed').length > 0) {
		var videoID = btnSelector.closest('.js_vframe').children('div').children('div').attr('id');
	}
	
	jwplayer(videoID).play();
}


function pauseVideo(videoID) {
	jwplayer(videoID).pause();
}


function getVideoState(videoID) {
	
	if (videos[videoID] == true) {
		return true;
	}
	
	return false;
}
