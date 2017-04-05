$(function(){
  $('#vmap').vectorMap({
    map: 'world_mill',
    scaleColors: ['#C8EEFF', '#0071A4'],
    normalizeFunction: 'polynomial',
    // hoverOpacity: 1,
    hoverColor: false,
    zoomOnScroll: false,
    zoomButtons : false,
    backgroundColor: '#fff',

    regionStyle: {
      initial: {
        fill: '#E8E9E9',
        "stroke-width" : 0.0,
        "fill-opacity": 1,
        stroke: "#E8E9E9",
        "stroke-width": 0.2,
        "stroke-opacity": 1
      },
      selected: {
        fill: '#B0013A'
      },

    },
    hover: {
      cursor: 'pointer'
    },

    markerStyle: {
      initial: {
        fill: '#EF4023',
        stroke: '#F69180',
        r: 8,
        "stroke-width": 5
      },
      hover: {
        fill: '#EF4023',
        stroke: '#F69180',
        "stroke-width": 8
      }

    },
    onMarkerClick: function(e, code) {
      var map = $('#vmap').vectorMap('get', 'mapObject');
      var customTip = $('#customTip');
      var customTipRegion = $('#customTip h4')
      customTip.css({
        left: left,
        top: top
      })

      customTipRegion.html(map.tip.text());
      // animate customtip
      customTip.show().addClass('animated fadeInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        function(){
          $(this).removeClass('animated fadeInDown');
        });
      customTipRegion.append(map.getRegionName(code));

    },
    onRegionTipShow: function (e, tip, code) {
        e.preventDefault();
        // console.log(e);

    },
    onRegionClick: function (e, code){
      $('#customTip').hide();
    },
    markers: [
      {latLng: [53.41291,	-8.24389], name: 'IRELAND'},
      {latLng: [55.378051,	-3.435973	], name: 'UNITED KINGDOM'},
      {latLng: [51.165691,	10.451526], name: 'GERMANY'},
      {latLng: [47.516231,	14.550072], name: 'AUSTRIA'},
      {latLng: [38.963745,	35.243322], name: 'TURKEY'},
      {latLng: [23.424076,	53.847818], name: 'UAE'},
      {latLng: [-30.559482,	22.937506], name: 'SOUTH AFRICA'},
      {latLng: [21.913965,	95.956223	], name: 'MYANMAR'},
      {latLng: [19.85627,	102.495496	], name: 'LAOS'},
      {latLng: [14.058324,	108.277199	], name: 'VIETNAM'},
      {latLng: [4.210484,	101.975766	], name: 'MALAYSIA'},
      {latLng: [1.352083,	103.819836	], name: 'SINGAPORE'},
      {latLng: [-0.789275,	113.921327	], name: 'INDONESIA'},
      {latLng: [-25.274398,	133.775136	], name: 'AUSTRALIA'},
      {latLng: [-40.900557,	174.885971	], name: 'NEW ZEALAND'}
    ]
  });
  $(document).click(function(e){
    if ($(e.target).not(':has(#customTip)').length == 0) {
        // current click target is not the tooltip and a tip is open
        $('#customTip').hide();
      }
  }); 



  var left,top;
  $('#vmap').vectorMap('get', 'mapObject').container.mousemove(function(e){
    // console.log(e);
    var $div = $('.map-wrapper');
    var offset = $div.offset();
    if( ($(window).width() < 1500) && (e.clientX > 930) ){
      left = e.offsetX-447;
    }else{

      left = (e.clientX - offset.left) - 230;
    }
    top = e.offsetY - 192;
    console.log(e.clientX)
  });


  var swiperMap = new Swiper('.swiper-map', {
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 1,
    paginationClickable: true,
    spaceBetween: 30,
    loop: true,

  });

  var swiperEvents = new Swiper('.swiper-events', {
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 3,
    paginationClickable: true,
    // spaceBetween: 30,
    loop: true,
    breakpoints: {

       992: {
           slidesPerView: 2,
           spaceBetween: 30
       },
       640: {
           slidesPerView: 2,
           spaceBetween: 20
       },
       480: {
           slidesPerView: 1,
           spaceBetween: 10
       }
    }

  });

  var swiperEvents = new Swiper('.swiper-hr', {
     nextButton: '.swiper-button-next',
     prevButton: '.swiper-button-prev',
     slidesPerView: 4,
     paginationClickable: true,
     spaceBetween: 30,
     loop: true,
     breakpoints: {
        1024: {
            slidesPerView: 4,
            spaceBetween: 40
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 30
        },
        640: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        480: {
            slidesPerView: 1,
            spaceBetween: 10
        }
     }


  });

});
