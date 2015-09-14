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
        len: opt.videos.length
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
              $('<span></span>').text('Heatmap').appendTo($('<a></a>').data('id', opt.videos[i].id).attr('href', '#').click(function(e) {
                e.preventDefault();
                var $me = $(this);
                $('div.hm-video-map').slideUp(2000);
                $me.parents('div.hm-video-bar').next().slideDown(2000);
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
        }
      }
    };
    // call init function
    hm.func.init();
  };
})(jQuery);
