/**
 * @description: To create video heatmap dynamically
 * @dependency: jquery1.11.x, bootstrap
 * @verion: 0.1.1
 * @date: 14-Sept-2015
**/
(function($) {
  'use strict';
 	$.fn.extend({
 		videoHeatMap: function(options) {
 			options = $.extend({
        videos: []
      },options);
 			this.each(function() {
 				new $.createHeatMap(this, options);
 			});
 			return this;
 		}
 	});
 	$.createHeatMap = function (me, opt) {
 		var hm = {
      obj: {
        $me: $(me)
      },
      vr: {
        img: 'img/default.png',
        start: 0,
        limit: 5,
        len: opt.videos.length,
        openMapId: null
      },
      func: {
        init: function () {
          hm.func.createContainter();
        },
        createContainter: function () {
          var $videoDiv = $('<div></div>'),
          $optionDiv = $('<div></div>').addClass('hm-video-bar-option'),
          $row = $('<div></div>').addClass('row'),
          $col = $('<div></div>').addClass('col-md-12');
          $videoDiv.appendTo(hm.obj.$me);

          // add video option bar
          hm.obj.$next = $('<a></a>').attr('href', '#').click(function (e) {
            e.preventDefault();
            var $me = $(this);
            if (!$me.hasClass('disabled')) {
              hm.vr.start = hm.vr.start + hm.vr.limit;
              hm.func.createVideoBar($videoDiv, hm.vr.start, hm.vr.limit);
            }
          });
          $('<span></span>').addClass('glyphicon glyphicon-circle-arrow-right').appendTo(hm.obj.$next);
          hm.obj.$next.appendTo($optionDiv);

          hm.obj.$prev = $('<a></a>').attr('href', '#').click(function (e) {
            e.preventDefault();
            var $me = $(this);
            if (!$me.hasClass('disabled')) {
              hm.vr.start = hm.vr.start - hm.vr.limit;
              hm.func.createVideoBar($videoDiv, hm.vr.start, hm.vr.limit);
            }
          }).addClass('disabled');
          $('<span></span>').addClass('glyphicon glyphicon-circle-arrow-left').appendTo(hm.obj.$prev);
          hm.obj.$prev.appendTo($optionDiv);
          $optionDiv.appendTo(hm.obj.$me);

          // call create video bar first time
          hm.func.createVideoBar($videoDiv, hm.vr.start, hm.vr.limit);
        },
        createVideoBar: function ($container, start, limit) {
          var $row, $col, $div, $video, $details, $options, $sqrBtn, dt, i = start;
          $row = $('<div></div>').addClass('row');
          for (;i<start + limit;i++) {
            if (i >= hm.vr.len) {
              break;
            }
            $col = $('<div></div>').addClass('col-md-12');
            $div = $('<div></div>').addClass('hm-video-bar');

            // video image
            $video = $('<div></div>').addClass('hm-video');
            $('<img/>').attr('src', opt.videos[i].img && opt.videos[i].img || hm.vr.img).appendTo($video);
            $video.appendTo($div);

            // title and description
            $details = $('<div></div>').addClass('hm-details');
            $('<h4></h4>').text(opt.videos[i].title).appendTo($('<a></a>').attr({
              'href': opt.videos[i].url,
              'target': '_blank'
            }).appendTo($details));
            $('<em></em>').text(opt.videos[i].description).appendTo($details);
            $details.appendTo($div);

            // options
            $options = $('<div></div>').addClass('hm-options');

            // heatmap
            if (opt.videos[i].heatmap) {
              $sqrBtn = $('<div></div>').addClass('hm-sqr');
              $('<p></p>').text('View').appendTo($sqrBtn);
              $('<span></span>').text('Heatmap').appendTo($('<a></a>').data('id', opt.videos[i].id).click(function(e) {
                e.preventDefault();
                var $me = $(this), mapId = $me.data('id'), mapDiv;
                if (hm.vr.openMapId !== mapId) {
                  hm.vr.openMapId = mapId;
                  $('div.hm-video-map').slideUp(1000, function () {
                    $(this).empty();
                  });
                  mapDiv = $me.parents('div.hm-video-bar').next();
                  hm.func.loadMaps(mapDiv);
                }
                else {
                  hm.vr.openMapId = null;
                  $('div.hm-video-map').slideUp(1000);
                }
              }).appendTo($sqrBtn));
              $sqrBtn.appendTo($options);
            }

            // other info
            for (dt in opt.videos[i].info) {
              $sqrBtn = $('<div></div>').addClass('hm-sqr');
              $('<p></p>').text(opt.videos[i].info[dt]).appendTo($sqrBtn);
              $('<span></span>').text(dt).appendTo($sqrBtn);
              $sqrBtn.appendTo($options);
            }
            $options.appendTo($div);

            $div.appendTo($col);
            // add div for map
            $('<div></div>').addClass('hm-video-map').appendTo($col);

            $col.appendTo($row);
          }
          $row.appendTo($container.empty());

          // manage pagination
          if (start > 0) {
            hm.obj.$prev.removeClass('disabled');
          }
          else {
            hm.obj.$prev.addClass('disabled');
          }
          if (start + limit >= hm.vr.len) {
            hm.obj.$next.addClass('disabled');
          }
          else {
            hm.obj.$next.removeClass('disabled');
          }
          hm.vr.openMapId = null;
        },
        loadMaps: function ($container) {
          // create tabs
          var $div = $('<div></div>'), $ul = $('<ul></ul>').addClass('nav nav-tabs').attr('role','tablist'),
          $li, $engagement, $heatmap;

          $li = $('<li></li>').addClass('active').css('float', 'right');
          $('<a></a>').attr({'href': '#heatmap_day'}).attr({
            'role': 'tab',
            'data-toggle': 'tab'
          }).text('Heat Map').appendTo($li);
          $li.appendTo($ul);

          $ul.appendTo($div);

          $heatmap = $('<div></div>').attr({
            'id': 'heatmap_day'
          }).addClass('tab-pane fade in active').appendTo($div)

          $div.appendTo($container.empty());
          hm.func.loadHeatMap($heatmap);
          $container.slideDown(1000);
        },
        colorLuminance: function (hex, lum) {
          // validate hex string
          hex = String(hex).replace(/[^0-9a-f]/gi, '');
          if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
          }
          lum = lum || 0;

          // convert to decimal and change luminosity
          var rgb = "#", c, i;
          for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
          }

          return rgb;
        },
        loadHeatMap: function ($container) {
          var data = {
            start: 1,
            end: 120,
            size: 5, // in secs,
            data: [
              {
                date: 'Today',
                data: {1: 54, 2: 44, 3: 97, 4: 19, 5: 84, 6: 71, 7: 8, 8: 41, 9: 1, 10: 59, 11: 59, 12: 61, 13: 63, 14: 74, 15: 29, 16: 51, 17: 16, 18: 54, 19: 35, 20: 62, 21: 96, 22: 50, 23: 36, 24: 36, 25: 99, 26: 60, 27: 84, 28: 38, 29: 43, 30: 42, 31: 64, 32: 17, 33: 52, 34: 15, 35: 89, 36: 45, 37: 35, 38: 17, 39: 4, 40: 90, 41: 30, 42: 23, 43: 74, 44: 51, 45: 42, 46: 13, 47: 34, 48: 65, 49: 89, 50: 67, 51: 68, 52: 58, 53: 15, 54: 17, 55: 12, 56: 41, 57: 24, 58: 12, 59: 16, 60: 45, 61: 82, 62: 65, 63: 31, 64: 26, 65: 53, 66: 45, 67: 15, 68: 21, 69: 13, 70: 22, 71: 86, 72: 63, 73: 7, 74: 51, 75: 56, 76: 48, 77: 10, 78: 23, 79: 57, 80: 27, 81: 85, 82: 74, 83: 81, 84: 18, 85: 67, 86: 1, 87: 78, 88: 49, 89: 36, 90: 47, 91: 42, 92: 98, 93: 41, 94: 71, 95: 76, 96: 7, 97: 88, 98: 23, 99: 91, 100: 91, 101: 14, 102: 93, 103: 26, 104: 42, 105: 64, 106: 92, 107: 29, 108: 90, 109: 32, 110: 40, 111: 84, 112: 32, 113: 40, 114: 14, 115: 46, 116: 88, 117: 37, 118: 65, 119: 3, 120: 19}
              },
              {
                date: 'Yesterday',
                data: {1: 47, 2: 22, 3: 26, 4: 50, 5: 6, 6: 74, 7: 24, 8: 4, 9: 36, 10: 8, 11: 89, 12: 5, 13: 31, 14: 16, 15: 30, 16: 41, 17: 68, 18: 64, 19: 42, 20: 41, 21: 21, 22: 42, 23: 68, 24: 37, 25: 80, 26: 55, 27: 7, 28: 72, 29: 39, 30: 40, 31: 37, 32: 26, 33: 5, 34: 48, 35: 74, 36: 86, 37: 64, 38: 33, 39: 69, 40: 20, 41: 36, 42: 9, 43: 86, 44: 51, 45: 70, 46: 27, 47: 25, 48: 84, 49: 86, 50: 2, 51: 7, 52: 56, 53: 90, 54: 31, 55: 20, 56: 7, 57: 6, 58: 31, 59: 92, 60: 55, 61: 34, 62: 75, 63: 88, 64: 89, 65: 84, 66: 2, 67: 52, 68: 95, 69: 99, 70: 86, 71: 73, 72: 35, 73: 95, 74: 82, 75: 89, 76: 74, 77: 39, 78: 55, 79: 88, 80: 17, 81: 14, 82: 66, 83: 14, 84: 31, 85: 73, 86: 36, 87: 92, 88: 69, 89: 52, 90: 81, 91: 13, 92: 39, 93: 77, 94: 48, 95: 68, 96: 3, 97: 73, 98: 50, 99: 45, 100: 43, 101: 73, 102: 61, 103: 39, 104: 83, 105: 4, 106: 55, 107: 88, 108: 90, 109: 96, 110: 78, 111: 32, 112: 31, 113: 19, 114: 48, 115: 36, 116: 15, 117: 1, 118: 74, 119: 73, 120: 14}
              },
              {
                date: 'Sept 13',
                data: {1: 1, 2: 97, 3: 4, 4: 78, 5: 26, 6: 44, 7: 69, 8: 6, 9: 78, 10: 99, 11: 6, 12: 57, 13: 89, 14: 69, 15: 66, 16: 36, 17: 32, 18: 81, 19: 56, 20: 84, 21: 93, 22: 64, 23: 10, 24: 18, 25: 62, 26: 23, 27: 47, 28: 78, 29: 85, 30: 45, 31: 10, 32: 80, 33: 45, 34: 45, 35: 75, 36: 52, 37: 98, 38: 88, 39: 62, 40: 14, 41: 5, 42: 11, 43: 60, 44: 90, 45: 82, 46: 7, 47: 56, 48: 45, 49: 24, 50: 78, 51: 34, 52: 80, 53: 34, 54: 63, 55: 48, 56: 64, 57: 73, 58: 41, 59: 33, 60: 56, 61: 67, 62: 28, 63: 13, 64: 95, 65: 8, 66: 10, 67: 95, 68: 74, 69: 82, 70: 43, 71: 60, 72: 60, 73: 86, 74: 1, 75: 75, 76: 51, 77: 53, 78: 75, 79: 51, 80: 50, 81: 26, 82: 51, 83: 80, 84: 28, 85: 91, 86: 85, 87: 58, 88: 6, 89: 82, 90: 69, 91: 87, 92: 41, 93: 43, 94: 95, 95: 99, 96: 25, 97: 44, 98: 85, 99: 43, 100: 51, 101: 8, 102: 6, 103: 0, 104: 88, 105: 8, 106: 75, 107: 29, 108: 35, 109: 57, 110: 89, 111: 90, 112: 73, 113: 13, 114: 19, 115: 69, 116: 68, 117: 80, 118: 42, 119: 10, 120: 25}
              }
            ]
          }, $div, $row, $col, $date, i = 0, iln = data.data.length, j, jln = data.end, width, point, k, kln;
          $div = $('<div></div>').addClass('heat-map');
          for (;i<iln;i++) {
            $row = $('<div></div>').addClass('heat-map-row');
            $col = $('<div></div>').addClass('cols');
            $('<div><div>').addClass('date').text(data.data[i].date).appendTo($row);
            j = data.start;
            width = 100.0/jln;
            for (;j<jln+1;j++) {
              $('<div></div>').addClass('col').css({
                'background-color': hm.func.colorLuminance('#F27364', data.data[i].data[j]/100.0),
                'width': width + '%'
              }).attr('val', data.data[i].data[j]).appendTo($col);
            }
            // add points
            k = 0, kln = 6, point = (data.end - data.start + 1.0)*data.size/5;
            for (;k<kln;k++) {
              $('<span></span>').text(hm.func.secToMin(k*point)).appendTo($('<div></div>').addClass('heat-map-points').css({
                'left':k*20 + '%'
              }).appendTo($col));
            }
            $('<span></span>').text(hm.func.secToMin(data.end*data.size)).appendTo($('<div></div>').addClass('heat-map-points right').css({
              'right':0
            }).appendTo($col));
            $col.appendTo($row);
            $row.appendTo($div);
          }
          $div.appendTo($container);
        },
        secToMin: function (sec) {
          var min = sec/60, mod = sec%60;
          return (min<10 ? '0' + min: min) + ':' + (mod<10 ? '0' + mod: mod);
        }
      }
    };
    // call init function
    hm.func.init();
  };
})(jQuery);
