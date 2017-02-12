(function($){
	var slide = function(element, options){
		this.element = element;
		this.userOptions = options;
		this.defaultOptions = slide.default;
		this.options = $.extend({}, this.defaultOptions, this.userOptions);

		this.init();
	};

	slide.default = {
		viewportHeight : document.documentElement.clientHeight,
		contentHeight : 0,
		direction : "all",
		endEvent_Vertical : function(){},
		endEvent_Horizontal : function(){}
	};

	slide.prototype = {
		init : function(){
			this.element.css("transform", "translate(0,0,0)");
			this._initEvent();
		},

		_initEvent : function(){
			var _this = this;
			var startY, endY, originY, startX, endX, originX;
			var startTime, endTime;
			var translateY, moveY, transformX, moveX;
			var direction = 0;		//0 is none, 1 is vertical, 2 is horizontal.

			_this.element.on("touchstart", function(event){
				startX = originX = event.changedTouches[0].pageX;
				startY = originY = event.changedTouches[0].pageY;
				startTime = new Date().getTime();
			});

			_this.element.on("touchmove", function(event){
				endX = event.changedTouches[0].pageX;
				endY = event.changedTouches[0].pageY;
				translateX = parseInt(_this.element.css("transform").substring(7).split(',')[4]);
				translateY = parseInt(_this.element.css("transform").substring(7).split(',')[5]);
				moveY = translateY + (endY - startY);
				moveX = translateX + (endX - startX);

				if(direction == 0 && ( Math.abs(endX - startX) > Math.abs(endY - startY)) )
					direction = 2;
				else if(direction == 0 && ( Math.abs(endX - startX) < Math.abs(endY - startY)) )
					direction = 1;

				if((_this.options.direction == "all" || _this.options.direction == "vertical") && direction == 1 && 
					(moveY < 0 && moveY > (_this.options.viewportHeight - _this.options.contentHeight))){
					event.preventDefault();
					_this.element.css("transition-duration", "0s").css("transform", "translate3d("+translateX+","+moveY+"px,0)");
				}
				else if((_this.options.direction == "all" || _this.options.direction == "horizontal") && direction == 2 && 
					(endX - originX) > 0){
					event.preventDefault();
					_this.element.css("transition-duration", "0s").css("transform", "translate3d("+moveX+"px,"+translateY+"px,0)");
				}
				
				startX = endX;
				startY = endY;
			});

			_this.element.on("touchend", function(){
				endTime = new Date().getTime();
				var allTime = endTime - startTime;
				var lastmove = moveY + ((endY - originY)/allTime*500);

				//vertical
				if(direction == 1)
				{
					_this.options.endEvent_Vertical();
					if(lastmove < 0 && lastmove > (_this.options.viewportHeight - _this.options.contentHeight))
						_this.element.css("transition","transform cubic-bezier(0.22, 0.61, 0.36, 1) .3s")
					.css("transform", "translate3d("+translateX+","+lastmove+"px,0)");
					else
					{
						if(lastmove >= 0)
							_this.element.css("transition","transform cubic-bezier(0.22, 0.61, 0.36, 1) .3s")
						.css("transform", "translate3d("+translateX+",0,0)");
						else if(_this.options.viewportHeight <= _this.options.contentHeight)
						{
							lastmove = _this.options.viewportHeight - _this.options.contentHeight;
							_this.element.css("transition","transform cubic-bezier(0.22, 0.61, 0.36, 1) .3s")
							.css("transform", "translate3d("+translateX+","+lastmove+"px,0)");
						}
					}
				}
				//horizontal
				else if(direction == 2)
				{
					_this.options.endEvent_Horizontal();
				}
				direction = 0;
			});
		}
	};

	$.fn.slide = function(options){
		return this.each(function(){
			if(!$(this).data("slide"))
				$(this).data("slide", new slide($(this), options));
		});
	};
})(jQuery);