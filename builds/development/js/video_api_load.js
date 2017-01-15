/**
 * decide which api is loaded
 */
//$(window).load(function() {
$(document).ready(function() {
	if (!isSafari4() && !isSafari5() && !isIOS()) {
		loadVideoApiFiles(false);
	} else {
		loadVideoApiFiles(true);
	}
});



function getVideoURL(selector, videoID) {

	if (typeof(videoID) == 'undefined') {
		return;
	}

	var html5Video = 1;
	if (isIE8() || isSafari4()) {
		html5Video = 0;
	}


	if (!isSafari4() && !isSafari5() && !isIOS()) {
		if ($(selector).attr('src') == '') {
			$(selector).attr('src', 'http://www.youtube.com/embed/' + videoID + '?enablejsapi=1&html5=' + html5Video + '&wmode=opaque');
		}
	} else {
		if ($(selector).attr('src') == '') {
			$(selector).attr('src', 'http://www.youtube.com/watch?v=' + videoID);
		}
	}
}



function loadVideoApiFiles(ios, callbackFunc) {

	if (typeof ios == 'undefined') {
		ios = false;
	}

	var videoAPI = new Array();
	var basePath = NELibs.getBaseUrl() + '/fileadmin/templates/js/';
	if (!ios) {
		videoAPI[0] = '';
		videoAPI[0] = basePath + 'youtube-play.js';
	} else {
		videoAPI[0] = '';
		videoAPI[1] = '';
		videoAPI[0] = basePath + 'vendor/mediaelements/mediaelement-and-player.js';
		videoAPI[1] = basePath + 'ios-youtube-play.js';

		var css = basePath + 'vendor/mediaelements/mediaelementplayer.min.css'
		if (!NELibs.checkFileIsLoaded(css)) {
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", css);
			$(fileref).load();

			document.getElementsByTagName("head")[0].appendChild(fileref);
		}

	}

	for (var k in videoAPI) {
		if (NELibs.checkFileIsLoaded(videoAPI[k])) {
			// already loaded
			// => only call callback
			if (typeof(callbackFunc) === 'function' && k == (videoAPI.length - 1)) {
				chkFile = function() {
					if (NELibs.currentLoadingFiles[videoAPI[k]] === 1) {
						window.setTimeout(chkFile, 1);
					} else {
						callbackFunc();
					}
				};
				chkFile();
			}
		}

		NELibs.currentLoadingFiles[videoAPI[k]] = 1;

		var fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", videoAPI[k]);

		$(fileref).load(function() {
			NELibs.currentLoadingFiles[videoAPI[k]] = 0;
			if (typeof(callbackFunc) === 'function') {
				callbackFunc();
			}
		});
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}
}
