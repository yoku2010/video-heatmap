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
          }).addClass('tab-pane fade in active').appendTo($div);

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
            end: 60,
            size: 5, // in secs,
            data: [
              {
                date: 'Today',
                data: {1: 54, 2: 44, 3: 97, 4: 19, 5: 84, 6: 71, 7: 8, 8: 41, 9: 1, 10: 59, 11: 59, 12: 61, 13: 63, 14: 74, 15: 29, 16: 51, 17: 16, 18: 54, 19: 35, 20: 62, 21: 96, 22: 50, 23: 36, 24: 36, 25: 99, 26: 60, 27: 84, 28: 38, 29: 43, 30: 42, 31: 64, 32: 17, 33: 52, 34: 15, 35: 89, 36: 45, 37: 35, 38: 17, 39: 4, 40: 90, 41: 30, 42: 23, 43: 74, 44: 51, 45: 42, 46: 13, 47: 34, 48: 65, 49: 89, 50: 67, 51: 68, 52: 58, 53: 15, 54: 17, 55: 12, 56: 41, 57: 24, 58: 12, 59: 16, 60: 45}
              },
              {
                date: 'Yesterday',
                data: {1: 47, 2: 48, 3: 56, 4: 50, 5: 56, 6: 74, 7: 74, 8: 84, 9: 66, 10: 78, 11: 79, 12: 77, 13: 77, 14: 59, 15: 60, 16: 61, 17: 68, 18: 64, 19: 62, 20: 41, 21: 21, 22: 42, 23: 68, 24: 37, 25: 80, 26: 55, 27: 7, 28: 72, 29: 39, 30: 40, 31: 100, 32: 100, 33: 100, 34: 99, 35: 98, 36: 97, 37: 98, 38: 95, 39: 100, 40: 20, 41: 36, 42: 9, 43: 86, 44: 51, 45: 70, 46: 27, 47: 25, 48: 84, 49: 86, 50: 2, 51: 7, 52: 56, 53: 90, 54: 31, 55: 20, 56: 7, 57: 6, 58: 31, 59: 92, 60: 55}
              },
              {
                date: 'Sept 13',
                data: {1: 1, 2: 97, 3: 4, 4: 78, 5: 26, 6: 44, 7: 69, 8: 6, 9: 78, 10: 99, 11: 6, 12: 57, 13: 89, 14: 69, 15: 66, 16: 36, 17: 32, 18: 81, 19: 56, 20: 84, 21: 93, 22: 64, 23: 10, 24: 18, 25: 62, 26: 23, 27: 47, 28: 78, 29: 85, 30: 45, 31: 10, 32: 80, 33: 45, 34: 45, 35: 75, 36: 52, 37: 98, 38: 88, 39: 62, 40: 14, 41: 5, 42: 11, 43: 60, 44: 90, 45: 82, 46: 7, 47: 56, 48: 45, 49: 24, 50: 78, 51: 34, 52: 80, 53: 34, 54: 63, 55: 48, 56: 64, 57: 73, 58: 41, 59: 33, 60: 56}
              }
            ]
          }, $div, $row, $col, $date, i = 0, iln = data.data.length, j, jln = data.end, width, point, k, kln, sagment = 0, color = '#F27364', gradient = '';
          $div = $('<div></div>').addClass('heat-map');
          for (;i<iln;i++) {
            $row = $('<div></div>').addClass('heat-map-row');
            $col = $('<div></div>').addClass('cols');
            $('<div><div>').addClass('date').text(data.data[i].date).appendTo($row);
            j = data.start;
            gradient = '';
            width = 100.0/jln;
            for (;j<jln+1;j++) {
              sagment = data.data[i].data[j] && data.data[i].data[j] || 0;
              if (sagment>85 && sagment<=100) {
                color = '#FF1D00';
              }
              else if (sagment>70 && sagment<=85) {
                color = '#FF9100'
              }
              else if (sagment>55 && sagment<=70) {
                color = '#FFEA00'
              }
              else if (sagment>40 && sagment<=55) {
                color = '#FFEA00'
              }
              else if (sagment>25 && sagment<=40) {
                color = '#90FF6C'
              }
              else if (sagment>10 && sagment<=25) {
                color = '#00D7FF'
              }
              else if (sagment >= 0 && sagment<=10) {
                color = '#0021FF';
              }

              $('<div></div>').addClass('col').css({
                'background-color': 'background:rgba(0,0,0,0);',
                'width': width + '%'
              }).attr({
                'title': sagment + ' at ' + hm.func.secToMin(j*data.size) + ' min',
                'data-toggle':'tooltip',
                'data-placement':'top'
              }).tooltip().appendTo($col);
              if ('' !== gradient) {
                gradient += ',';
              }
              gradient += color;
            }
            $col.css('background','linear-gradient(to right,' + gradient + ')');
            // add points
            k = 0, kln = 5, point = (data.end - data.start + 1.0)*data.size/5;
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
          var min = parseInt(sec/60), mod = sec%60;
          return (min<10 ? '0' + min: min) + ':' + (mod<10 ? '0' + mod: mod);
        }
      }
    };
    // call init function
    hm.func.init();
  };
})(jQuery);
