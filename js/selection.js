(function($){
	var selection = function(element, options){
		this.element = element;
		this.userOptions = options;
		this.defaultOptions = selection.default;
		this.options = $.extend({}, this.defaultOptions, this.userOptions);

		this.options.optionElements = this.element.find(".option");
		this.options.selection = $(this.element.find(this.options.selection)[0]);
		this.options.selectIcon = $(this.element.find(this.options.icon)[0]);
		this.options.optionNum = this.options.optionElements.length;
		this.options.selectWidth = this.element.width();
		this.options.selectHeight = this.element.height();
		if(this.options.optionNum < this.options.showNum)
			this.options.selectFullHeight = this.options.selectHeight * this.options.optionNum;
		else
			this.options.selectFullHeight = this.options.selectHeight * this.options.showNum;
		this.options.optionHeight = this.element.find(".option").height();
		if(this.options.platform == "PC")
			this.options.click = "click";
		else
			this.options.click = "touchend";
		this.init();
	};

	selection.default = {
		selection : ".selection",
		icon : ".selectIcon",
		showNum : 5,
		platform : "PC",
		options :　".options",
	};

	selection.prototype = {
		init : function(){
			$(this.options.options).css("height", this.options.selectHeight*this.options.optionNum);
			for(var i = 0; i < this.options.optionNum; i++){
				var top = i * this.options.selectHeight + (this.options.selectHeight - this.options.optionHeight)/2;
				$(this.options.optionElements[i]).css("top", top + "px");
			}

			this._initEvent();
		},

		closeSelect : function(text){
			var me = this;
			$(me.options.options).css("transform", "translate3d(0,0,0)");
			me.options.selection.html(text);
			for(var i = 0; i < me.options.optionNum; i++){
				if(i == me.options.optionNum - 1)
					$(me.options.optionElements[i]).fadeOut(200, function(){
						me.element.removeAttr("style");
						$(this).css("transform", "translateX(100px)");
					});
				else
					$(me.options.optionElements[i]).fadeOut(200, function(){
						$(this).css("transform", "translateX(100px)");
					});
			}
		},

		_initEvent : function(){
			var me = this;
			var isMove = false;
			me.element.on(this.options.click, function(){
				me.options.selection.css("transform", "translate3d(-" + me.options.selectWidth + "px,0,0)").fadeOut(200);
				me.options.selectIcon.css("transform", "translate3d(-" + me.options.selectWidth + "px,0,0)").fadeOut(200, function(){
					me.element.css("height", me.options.selectFullHeight + "px");
				});
				if(me.options.showNum < me.options.optionNum && me.options.platform != "PC")
					$(me.options.options).slide({
						direction : "vertical",
						viewportHeight : me.options.selectFullHeight,
						contentHeight : me.options.selectFullHeight/me.options.showNum*me.options.optionNum});
			});

			me.element.on("transitionend", function(event){

				if(me.element.height() == me.options.selectFullHeight){
					for(var i = 0; i < me.options.optionNum; i++){
						$(me.options.optionElements[i]).fadeIn(i*10 + 300)
						.css({"transform" : "translateX(0px)", "transition-delay" : i*0.05+"s"});
					}
				}
				else{
					me.options.selection.fadeIn(200).removeAttr("style");
					me.options.selectIcon.fadeIn(200).removeAttr("style");
					$(me.options.options).css("transform", "translate3d(0,0,0)");
				}
			});

			me.element.find("*").on("transitionend", function(event){
				event.stopPropagation();
			});

			if(me.options.platform != "PC")
				me.element.find(".option").on("touchmove", function(){
					isMove = true;
				});

			me.element.find(".option").on(this.options.click, function(){
				if(isMove){
					isMove = false;
					return false;
				}

				me.closeSelect($(this).html());
			});
		}
	};

	$.fn.selection = function(options){
		return this.each(function(){
			var instance = null;
			if(!(instance = $(this).data("selection")))
				$(this).data("selection",(instance = new selection($(this), options)));
			if($.type(options) === "string") return instance[options]();
		});
	};
})(jQuery);