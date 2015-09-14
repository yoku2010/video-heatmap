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
          $col = $('<div></div>').addClass('col-md-12'), $prev, $next;
          $videoDiv.appendTo(hm.obj.$me);

          // add video option bar
          $next = $('<a></a>').attr('href', '#').click(function (e) {
            e.preventDefault();
            alert('next');
          }).addClass('disabled');
          $('<span></span>').addClass('glyphicon glyphicon-circle-arrow-right').appendTo($next);
          $next.appendTo($optionDiv);

          $prev = $('<a></a>').attr('href', '#').click(function (e) {
            e.preventDefault();
            alert('prev');
          }).addClass('disabled');
          $('<span></span>').addClass('glyphicon glyphicon-circle-arrow-left').appendTo($prev);
          $prev.appendTo($optionDiv);
          $optionDiv.appendTo(hm.obj.$me);
          //hm.func.hm.createVideoBar($videoDiv, )
        },
        createVideoBar: function ($container, start, limit) {
          var $row, $col, $div, $video, $details, $options, $sqrBtn, dt;
          $row = $('<div></div>').addClass('row');
          for (;i<limit;i++) {
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
                alert('View Heatmap');
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
            $col.appendTo($row);
          }
          $row.appendTo($container);
        }
      }
    };
    // call init function
    hm.func.init();
  };
})(jQuery);
