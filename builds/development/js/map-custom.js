$(function(){
  $('#vmap').vectorMap({
    map: 'world_mill',
    scaleColors: ['#C8EEFF', '#0071A4'],
    normalizeFunction: 'polynomial',
    hoverOpacity: 0.7,
    hoverColor: false,
    zoomOnScroll: false,
    zoomButtons : false,
    backgroundColor: '#fff',
    regionStyle: {
      initial: { fill: '#E8E9E9' },
      selected: { fill: '#B0013A' }
    },
    markerStyle: {
      initial: {
        fill: '#EF4023',
        stroke: '#F69180',
        "stroke-width": 3
      }
    },
    onRegionClick: function(e, code) {
      var map = $('#vmap').vectorMap('get', 'mapObject');
      var customTip = $('#customTip');

      customTip.css({
        left: left,
        top: top
      })

      // customTip.html(map.tip.text());
      customTip.show();
      // customTip.children("p").click(function() {
      //   map.clearSelectedRegions();
      //   customTip.hide();
      // })

    },
    onRegionTipShow: function (e, tip, code) {
        e.preventDefault();
    },
    markers: [
      {latLng: [-0.52, 166.93], name: 'Nauru'},
      {latLng: [-8.51, 179.21], name: 'Tuvalu'},
      {latLng: [43.93, 12.46], name: 'San Marino'}
    ]
  });

  var left,top;
  $('#vmap').vectorMap('get', 'mapObject').container.mousemove(function(e){
    left = e.clientX-40;
    top = e.clientY-40;

  });

  var swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    nextButton: false,
    prevButton: false,

  });

});
