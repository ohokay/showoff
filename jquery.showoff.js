/*
  Written by Jeff Mehlhoff (jeffmehlhoff@gmail.com) for Path.To on June 10th, 2011 - http://github.com/ohokay/showoff

*** Base styles...

  #showoff-overlay {
    background-color: rgba(0,0,0,0.5);
    position: absolute;
    top: 0;
    left: 0;
  }

  #showoff-overlay #showoff-container {
    margin: 0px auto;
    position: relative;
    width: 950px;
  }

  .showoff-bg {
    background-color : #ffffff;
    border: 0 solid yellow;
  }

*/

;(function($) {
  if ($ == null) {
    $ = jQuery;
  }
  return $.fn.showoff = function() {
    var create_background_for, create_overlay, defaults, disable_mouse, is_hover, obj, opts, scroll_window_resize, size_to_window;
    is_hover = false;
    obj = arguments[0] instanceof jQuery ? arguments[0] : void 0;
    opts = arguments[1] ? arguments[1] : !(arguments[0] instanceof jQuery) ? arguments[0] : void 0;
    defaults = {
      zIndex: 9000,
      bgPadding: '20px',
      bgOffset: '-20px',
      autoShow: true,
      clickToClose: false,
      disableMouse: true
    };
    if (!(opts instanceof jQuery)) {
      $.extend(defaults, opts || {});
    }
    size_to_window = function(obj) {
      $("#showoff-overlay").css({
        'width': $("body").width(),
        'height': $("body").height()
      });
      return $("#showoff-container").css({
        'height': $("body").height()
      });
    };
    scroll_window_resize = function(overlay) {
      return size_to_window(overlay);
    };
    disable_mouse = function(e) {
      return e.preventDefault();
    };
    create_overlay = function() {
      var container, overlay;
      if ($("#showoff-overlay").length) {
        return $("#showoff-overlay");
      } else {
        overlay = $("<div />").attr({
          'id': 'showoff-overlay'
        }).appendTo($("body"));
        container = $("<div />").attr({
          'id': 'showoff-container'
        }).appendTo(overlay);
        return overlay;
      }
    };
    create_background_for = function(self, zIndex) {
      var bg;
      return bg = $("<div />").appendTo($("#showoff-container")).addClass('showoff-bg').attr({
        'id': 'showoff-bg-for-' + (self.attr('id') === void 0 ? self[0].tagName : self.attr('id'))
      }).css({
        'width': self.outerWidth(),
        'height': self.outerHeight(),
        'position': 'relative',
        'padding': defaults.bgPadding,
        'z-index': zIndex
      }).position({
        'my': 'left top',
        'at': 'left top',
        'of': self,
        'offset': defaults.bgOffset
      });
    };
    if (!$("#showoff-overlay").length) {
      if (obj instanceof jQuery) {
        is_hover = true;
        $(this).mouseenter(function() {
          return obj.trigger('show.showoff');
        });
        $(this).mouseleave(function() {
          return obj.trigger('remove.showoff');
        });
        defaults.autoShow = false;
      } else {
        obj = this;
      }
      return $(obj).each(function(i, obj) {
        var self;
        self = $(obj);
        self.bind('show.showoff', function() {
          var background, overlay;
          overlay = size_to_window(create_overlay());
          background = create_background_for(self, defaults.zIndex + i);
          self.addClass('showoff-enabled').css({
            'position': self.css('position') !== 'absolute' ? 'relative' : 'absolute',
            'z-index': defaults.zIndex + i + 1
          });
          $(window).bind('resize', function() {
            return scroll_window_resize(overlay);
          });
          if (defaults.onShow != null) {
            defaults.onShow(self, background, overlay);
          }
          return self;
        });
        self.bind('remove.showoff', function(e) {
          var overlay;
          overlay = $("#showoff-overlay").remove();
          $(".showoff-enabled").removeClass('showoff-enabled');
          if (!is_hover) {
            self.unbind('show.showoff');
            self.unbind('remove.showoff');
          }
          if (defaults.onRemove != null) {
            return defaults.onRemove(overlay);
          }
        });
        if (defaults.autoShow) {
          self.trigger('show.showoff');
        }
        if (defaults.clickToClose) {
          $("#showoff-overlay").click(function(e) {
            return $(".showoff-enabled").trigger('remove.showoff');
          });
        }
        return this;
      });
    }
  };
})($);