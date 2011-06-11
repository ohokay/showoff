`/*
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

`
do ($ = jQuery) ->
	$.fn.showoff = ->	
		
		is_hover = false
		obj = if arguments[0] instanceof jQuery then arguments[0]
		opts = if arguments[1] then arguments[1] else arguments[0] unless arguments[0] instanceof jQuery
		
		defaults = 
			zIndex : 9000
			bgPadding : '20px'
			bgOffset : '-20px'
			autoShow : true
			clickToClose : false
			disableMouse : true
				
		$.extend(defaults, opts || {}) unless opts instanceof jQuery
				
		size_to_window = (obj) ->
			$("#showoff-overlay").css
				'width'   : $("body").width()
				'height' 	: $("body").height()
			$("#showoff-container").css
				'height'  : $("body").height()
		
		scroll_window_resize = (overlay) ->
			size_to_window(overlay)
		
		disable_mouse = (e) ->
			e.preventDefault()
		
		create_overlay = ->
			if $("#showoff-overlay").length
				$("#showoff-overlay")
			else
				overlay = $("<div />")
					.attr
						'id' : 'showoff-overlay'
					.appendTo($("body"))
				container = $("<div />")
					.attr
						'id' : 'showoff-container'
					.appendTo(overlay)
				# return the overlay
				overlay
			
		create_background_for = (self, zIndex) ->
			bg = $("<div />")
				.appendTo($("#showoff-container"))
				.addClass('showoff-bg')
				.attr
					'id' : 'showoff-bg-for-' + if self.attr('id') == undefined then self[0].tagName else self.attr('id')
				.css
					'width' : self.outerWidth()
					'height' : self.outerHeight()
					'position' : 'relative'
					'padding' : defaults.bgPadding
					'z-index' : zIndex
				.position
					'my' : 'left top'
					'at' : 'left top'
					'of' : self
					'offset' : defaults.bgOffset
		
		unless $("#showoff-overlay").length		
			if obj instanceof jQuery
				is_hover = true
				$(@).mouseenter ->
						obj.trigger('show.showoff')
				$(@).mouseleave ->
						obj.trigger('remove.showoff')
				defaults.autoShow = false
			else
				obj = @
		
			$(obj).each (i, obj) ->
				self = $(obj)
				self.bind 'show.showoff', ->
					overlay = size_to_window(create_overlay())
					background = create_background_for(self, (defaults.zIndex + i))
					# position actual element
					self
						.addClass('showoff-enabled')
						.css
							'position' : if self.css('position') != 'absolute' then 'relative' else 'absolute'
							'z-index' : (defaults.zIndex + i+1)
				
					$(window).bind 'resize', ->
						scroll_window_resize(overlay)
									
					defaults.onShow(self, background, overlay) if defaults.onShow?
					self

				self.bind 'remove.showoff', (e) ->
					overlay = $("#showoff-overlay").remove()
					$(".showoff-enabled").removeClass('showoff-enabled')
					unless is_hover
						self.unbind('show.showoff')
						self.unbind('remove.showoff')
					defaults.onRemove(overlay) if defaults.onRemove?
			
				# Initialize
				self.trigger('show.showoff') if defaults.autoShow
				
				if defaults.clickToClose
					$("#showoff-overlay").click (e) ->
						$(".showoff-enabled").trigger('remove.showoff')
				
				@