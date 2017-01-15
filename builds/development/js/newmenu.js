$(document).ready(function(){

	/*///////////////////////////////////
	MOBILE NAVIGATION
	///////////////////////////////////*/

	$('.navbar-toggle').click(function(){
		$(this).toggleClass('open');
		$('#nav-mobile').toggleClass('open');
		$('#nav-mobile .wd-nav-01').animate({
			'left':'0'
		}, 'slow');
		$('body').toggleClass('overflow-hidden');
	});

	$('.nav-icon-close.mobile').click(function(){
		$('#nav-mobile').toggleClass('open');
		$('#nav-mobile .wd-nav-01').animate({
			'left':'0'
		}, 'slow');
		$('body').toggleClass('overflow-hidden');
	});

	$('#nav-mobile li.sub > a').click(function(e){
		e.preventDefault();
		$('#nav-mobile .wd-nav-01').animate({
			'left':'-=100%'
		}, 'fast');
		$(this).next('ul').show();
	});

	docHeight = $('html').height();
	$('#nav-mobile').height(docHeight-80);	
	
	$(window).on('resize', function(){
		docHeight = $('body').height();
		$('#nav-mobile').height(docHeight-80);	
	});

	$('#nav-mobile span.back').click(function(){
		$('#nav-mobile .wd-nav-01').animate({
			'left':'+=100%'
		}, 'fast');
		$(this).parent('ul').fadeOut();
	});

	/*///////////////////////////////////
	DESKTOP NAVIGATION
	///////////////////////////////////*/

	function openSubNav() {
		$(this).children('.wd-nav, span.arrow').addClass('visible');
		$('#nav-desktop').addClass('in');
	}

	function closeSubNav() {
		$(this).children('.wd-nav, span.arrow').removeClass('visible');
		$('#nav-desktop').removeClass('in');
	}
	
	// Open dropdown on first level menu item click
	$('#nav-desktop .wd-nav-01 li.sub').hoverIntent({
		over: openSubNav,
		out: closeSubNav,
		timeout: 400
	});

	var timeout = null;
	$(document).on('mousemove', function() {
	    clearTimeout(timeout);

	    timeout = setTimeout(function() {
	  		//$('.wd-nav-02 > li, .wd-nav-03 > li, .wd-nav-01 > li.sub').removeClass('visible');
			//$('.wd-nav-bg, .nav-icon-close.desktop').fadeOut(400);
			/*$('.wd__SearchAndLang.desktop').animate({
				'right': '0'
			}, 'fast');*/
			//$('.bg-none .logo').removeClass('nav');
			//$('#nav-desktop').removeClass('in');
			// console.log('mousemove timeout');
	    }, 10000);
	});

});
