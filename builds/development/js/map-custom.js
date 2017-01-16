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
      initial: { fill: '#E8E9E9' },
      selected: { fill: '#B0013A' }
    },
    hover: {
      hoverColor: '#0071A4',
      cursor: 'pointer'
    },

    markerStyle: {
      initial: {
        fill: '#EF4023',
        stroke: '#F69180',
        "stroke-width": 5
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
      customTip.show();
      customTipRegion.append(map.getRegionName(code));

    },
    onRegionTipShow: function (e, tip, code) {
        e.preventDefault();

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

  var left,top;
  $('#vmap').vectorMap('get', 'mapObject').container.mousemove(function(e){
    left = e.clientX-220;
    top = e.clientY-200;

  });

  var swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    nextButton: false,
    prevButton: false,

  });

});
