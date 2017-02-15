(function($){

	var slide = function(element, options){
		this.element = element;
		this.userOptions = options;
		this.defaultOptions = slide.default;
		this.options = $.extend({}, this.defaultOptions, this.userOptions);
		if(!this.userOptions.moveElement)
			this.options.moveElement = this.element;
		this.options.element = this.element;
		this.init();
	};

	slide.default = {
		stopPropagetion : false,
		viewportHeight : document.documentElement.clientHeight,
		contentHeight : 0,
		direction : "all",
		horizontal : "right",
		moveDirection : 0,
		startEvent : function(){},
		moveEvent_Vertical : function(){},
		moveEvent_Horizontal : function(){},
		endEvent_Vertical : function(){},
		endEvent_Horizontal : function(){}
	};

	slide.prototype = {
		init : function(){
			if(!this.options.moveElement.css("transform"))
				this.options.moveElement.css("transform", "translate(0,0,0)");
			this._initEvent();
		},

		_initEvent : function(){
			var _this = this;
			var viewPortisClient = 
			_this.element.on("touchstart", function(event){
				if(_this.options.stopPropagetion)
					event.stopPropagetion();
				_this.options.startScroll = $(window).scrollTop();
				_this.options.startX = _this.options.originX = event.changedTouches[0].pageX;
				_this.options.startY = _this.options.originY = event.changedTouches[0].pageY;
				_this.options.startTime = new Date().getTime();
				_this.options.startEvent();
			});

			_this.element.on("touchmove", function(event){
				if(_this.options.stopPropagetion)
					event.stopPropagetion();
				var horizontalMove = true;
				if(_this.options.direction == "all" || _this.options.direction == "vertical")
					event.preventDefault();
				_this.options.endScroll = $(window).scrollTop();
				_this.options.endX = event.changedTouches[0].pageX;
				_this.options.endY = event.changedTouches[0].pageY;
				_this.options.translateX = parseInt(_this.options.moveElement.css("transform").substring(7).split(',')[4]);
				_this.options.translateY = parseInt(_this.options.moveElement.css("transform").substring(7).split(',')[5]);
				_this.options.moveY = _this.options.translateY + (_this.options.endY - _this.options.startY);
				_this.options.moveX = _this.options.translateX + (_this.options.endX - _this.options.startX);

				if(_this.options.moveDirection == 0 && ( Math.abs(_this.options.endX - _this.options.startX) > Math.abs(_this.options.endY - _this.options.startY))
					&& (_this.options.direction == "all" || _this.options.direction == "horizontal")
					&& (_this.options.endScroll == _this.options.startScroll)){
					_this.options.moveDirection = 2;
				}
				else if(_this.options.moveDirection == 0 && ( Math.abs(_this.options.endX - _this.options.startX) < Math.abs(_this.options.endY - _this.options.startY)) 
					&& (_this.options.direction == "all" || _this.options.direction == "vertical")){
					_this.options.moveDirection = 1;
				}

				if(_this.options.horizontal == "right")
					horizontalMove = (_this.options.endX - _this.options.originX) > 0;
				else if(_this.options.horizontal == "left")
					horizontalMove = (_this.options.endX - _this.options.originX) < 0;

				if(_this.options.moveDirection == 1 && 
					(_this.options.moveY < 0 && _this.options.moveY > (_this.options.viewportHeight - _this.options.contentHeight))){
					_this.options.moveEvent_Vertical();
					_this.options.moveElement.css("transition-duration", "0s")
					.css("transform", "translate3d("+_this.options.translateX+"px,"+_this.options.moveY+"px,0)");
				}
				else if(_this.options.moveDirection == 2 && horizontalMove){
					_this.options.moveEvent_Horizontal();
					if(_this.options.direction == "all")
						_this.options.moveElement.css("transition-duration", "0s")
						.css("transform", "translate3d("+_this.options.moveX+"px,"+_this.options.translateY+"px,0)");
					else
						_this.options.moveElement.css("transition-duration", "0s")
						.css("transform", "translate3d("+_this.options.moveX+"px,0px,0)");
				}
				else
					_this.options.moveEvent_Vertical();
				
				_this.options.startX = _this.options.endX;
				_this.options.startY = _this.options.endY;
			});

			_this.element.on("touchend", function(event){
				if(_this.options.stopPropagetion)
					event.stopPropagetion();
				_this.options.endScroll = $(window).scrollTop();
				_this.options.endTime = new Date().getTime();
				_this.options.allTime = _this.options.endTime - _this.options.startTime;
				var lastmove = _this.options.moveY + ((_this.options.endY - _this.options.originY)/_this.options.allTime*500);

				//vertical
				if(_this.options.moveDirection == 1)
				{
					event.preventDefault();
					_this.options.endEvent_Vertical();
					if(lastmove < 0 && lastmove > (_this.options.viewportHeight - _this.options.contentHeight))
						_this.options.moveElement.css("transition","transform cubic-bezier(0.22, 0.61, 0.36, 1) .3s")
					.css("transform", "translate3d("+_this.options.translateX+"px,"+lastmove+"px,0)");
					else
					{
						if(lastmove >= 0)
							_this.options.moveElement.css("transition","transform cubic-bezier(0.22, 0.61, 0.36, 1) .3s")
						.css("transform", "translate3d("+_this.options.translateX+"px,0,0)");
						else if(_this.options.viewportHeight <= _this.options.contentHeight)
						{
							lastmove = _this.options.viewportHeight - _this.options.contentHeight;
							_this.options.moveElement.css("transition","transform cubic-bezier(0.22, 0.61, 0.36, 1) .3s")
							.css("transform", "translate3d("+_this.options.translateX+"px,"+lastmove+"px,0)");
						}
					}
				}
				//horizontal
				else if(_this.options.moveDirection == 2)
				{
					event.preventDefault();
					_this.options.endEvent_Horizontal();
				}
				else
					_this.options.endEvent_Vertical();
				_this.options.moveDirection = 0;
			});
		}
	};

	$.fn.slide = function(options){
		return this.each(function(){
			var instance = null;
			if(!(instance = $(this).data("slide")))
				$(this).data("slide",(instance = new slide($(this), options)));
			if($.type(options) === "string") return instance[options]();
		});
	};
})(jQuery);