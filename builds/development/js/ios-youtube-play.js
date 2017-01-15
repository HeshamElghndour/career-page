var player = {};
var playerState = 0;


$(document).ready(function() {
	var i = 1;
//var width = $(".js_video-container").width();
var height = parseInt($(".js_video-container").height());

	$("video").each(function() {


//		alert("yeah! Video-Tag gefunden!!!");

		var playerID = $(this).attr("id");
		getVideoURL($('#' + playerID).get(0), $('#' + playerID).text());

		player[i] = {};
		player[i] = new MediaElementPlayer('#' + playerID, {
//			defaultVideoWidth: '100%',
//			defaultVideoHeight: '100%',
//			pluginWidth: "500",
//			pluginHeight: ,
//			videoWidth: "500",
			videoHeight: 200,
			success: function(media, domNode) {
				
				
				toggleNavElem(playerState, media);
				// add HTML5 events to the YouTube API media object
				media.addEventListener('play', function() {
					playerState = 1;
					toggleNavElem(playerState, media);
				}, false);
				media.addEventListener('pause', function() {
					playerState = 2;
					toggleNavElem(playerState, media);
				}, false);
				media.addEventListener('ended', function() {
					playerState = 3;
					toggleNavElem(playerState, media);
				}, false);
				media.addEventListener('loaded', function() {
					playerState = 1;
					toggleNavElem(playerState, media);
				}, false);
				
//				media.setPlayerSize(width, height);
			}
		});
		i++;
	});

	centerBulletPoints();




	$(window).resize(function() {
//		var width = $(".js_video-container").width();
//		var height = $(".js_video-container").height();
//		player[1].setPlayerSize(width, height);
//
//		var videoWidth = $(".mejs-fullscreen-hover").width();
//		var videoHeight = $(".mejs-fullscreen-hover").height();
//
//		player[1].setVideoSize(videoWidth, videoHeight);

	});


});



function centerBulletPoints() {
	var countedBullets = $(".js_video-container .feature--slide__nav__pager li").length;
	var bulletWidth = $(".js_video-container .feature--slide__nav__pager li").first().css("marginLeft", "0.3em").outerWidth(true);
	var wholeWidth = countedBullets * Math.ceil(bulletWidth);


	$(".js_video-container .feature--slide__nav__pager li").css({
		display: "block",
		float: "left",
		marginBottom: "0.5em"
	});
	$(".js_video-container .feature--slide__nav__pager").css({
		width: wholeWidth + "px",
		left: "50%",
		marginLeft: "-" + wholeWidth / 2 + "px"
	});

}




function toggleNavElem(playerState, media) {
	if (playerState == 0 || playerState == 2 || playerState == 3) {
		$(".js_video-container").off("hover");
		$(".js_video-container").hover(function() {
			$(".feature--slide__nav.slider").show();
		}, function() {
			$(".feature--slide__nav.slider").show();
		});
		$(".feature--slide__nav.slider").show();
	} else if (playerState == 1) {
		$(".js_video-container").off("hover");
		$(".js_video-container").hover(function() {
			$(".feature--slide__nav.slider").show();
		}, function() {
			$(".feature--slide__nav.slider").hide();
		});
	}
}

function playYouTubeVideo(btnSelector) {
	if (typeof(btnSelector) == 'undefined') {
		return false;
	}

	btnSelector.closest(".video__overlay").hide();
	var playerID = btnSelector.closest('.js_vframe').find('.js_yt-video').attr('id').split("_");
	var realID = parseInt(playerID[1]) + 1;

	if (typeof(player[realID]) == 'undefined') {
		return false;
	}
	player[realID].play();
	return true;
}








//function onPlayerStateChange(newState) {
//
////	console.log("stateChange");
//
//
//	if (typeof(newState.target.a) != "undefined" &&
//			typeof(newState.target.a.id) != "undefined" &&
//			typeof(player[newState.target.a.id]) != "undefined") {
//
//		if ((newState.data == 1 || newState.data == 3)) {
//
//			var videoID = newState.target.a.id;
//			var navi = null;
//			if ($('#' + videoID).closest('.js_video-content').find('.feature--slide__nav').length > 0) {
//
//				var container = $('#' + videoID).closest('.js_video-content');
//				if (container.hasClass('js_stage-slide')) {
//					if (currentBreakpoint != 'mobile') {
//						resetFadeInterval(container.get(0), true);
//					} else {
//						container.find('.slideStage_content').iosSlider('autoSlidePause');
//					}
//				}
//
//				navi = container.find('.feature--slide__nav');
//				naviEl = navi.get(0);
//				naviEl.hovered = false;
//
//				var hoverElem = $('#' + videoID).closest('.slide');
//				hoverEl = hoverElem.get(0);
//				hoverEl.hovered = false;
//
//				if (!isMobile) {
//					hoverElem.unbind('hover');
//					hoverElem.hover(function() {
//						hoverEl.hovered = true;
//						navi.fadeIn('slow');
//					}, function() {
//						hoverEl.hovered = false;
//						setTimeout(function() {
//							if (!naviEl.hovered && !hoverEl.hovered) {
//								navi.fadeOut('slow');
//							}
//						}, 1000);
//					});
//
//					navi.unbind('hover');
//					navi.hover(function() {
//						naviEl.hovered = true;
//					}, function() {
//						naviEl.hovered = false;
//						setTimeout(function() {
//							if (!naviEl.hovered && !hoverEl.hovered) {
//								navi.fadeOut('slow');
//							}
//						}, 1000);
//					});
//
//				} else {
//					navi.hide();
//				}
//			}
//
//		} else if ((newState.data == 0 || newState.data == 2)) {
//
//			var videoID = newState.target.a.id;
//			if ($('#' + videoID).closest('.js_video-content').find('.feature--slide__nav').length > 0) {
//
//				var container = $('#' + videoID).closest('.js_video-content');
//				container.find('.feature--slide__nav').show();
//				container.find('.feature--slide__nav').unbind('hover');
//				$('#' + videoID).closest('.slide').unbind('hover');
//				navi = container.find('.feature--slide__nav');
//				if (isMobile) {
//					navi.show();
//				}
//			}
//		}
//	}
//
//}
//
//
//function stopYouTubeVideo(videoID) {
//
//
//	if (typeof(videoID) == 'undefined' && typeof(player[videoID]) == 'undefined') {
//		return;
//	}
//
//	if ($('#' + videoID).closest('.js_video-content').find('.feature--slide__nav').length > 0) {
//		var container = $('#' + videoID).closest('.js_video-content');
//		container.find('.feature--slide__nav').show();
//		container.unbind('hover');
//	}
//
//
//	player[videoID].pause();
//}
//
//
//function pauseYouTubeVideo(videoID) {
//
//
//	if (typeof(videoID) == 'undefined' && typeof(player[videoID]) == 'undefined') {
//		return;
//	}
//
//	if ($('#' + videoID).closest('.js_video-content').find('.feature--slide__nav').length > 0) {
//		var container = $('#' + videoID).closest('.js_video-content');
////		container.find('.feature--slide__nav').unbind('hover');
//		container.find('.feature--slide__nav').show();
//		$('#' + videoID).closest(".video__overlay").show();
//		container.unbind('hover');
//	}
//
//	player[videoID].pause();
//}
//
//
//
//
///**
// * getVideoState()
// * 
// * @return
// * true		a video is played
// * false	no videos are played
// */
//function getYouTubeVideoState(videoID) {
//
//	var playStatus = false;
//
//	if (typeof(videoID) == 'undefined') {
//		for (var k in player) {
//			if (player[k].getPlayerState() == 1 || player[k].getPlayerState() == 3) {
//				playStatus = true;
//			}
//		}
//	} else if (typeof(player[videoID]) != 'undefined') {
//		if (player[videoID].getPlayerState() == 1 || player[videoID].getPlayerState() == 3) {
//			playStatus = true;
//		}
//	}
//
//	return playStatus;
//
//}




