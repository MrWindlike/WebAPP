var ViewCtrl = 
{
	timer : null,
	play : function(){},

	seachCtrl : function()
	{
		$(document).on('touchstart', "#searchButton", function(){
			var $search = $("#search");
			if($search.css("transform") === "matrix(0, 0, 0, 1, 0, 0)")
				$search.css("transform", "scale(1,1)");
			else
			{
				if($search.val() != "")
					ModelCtrl.loadData({"type":"search","key":$search.val()});
				else
					$search.css("transform", "scale(0,1)");
			}
		})
	},

	carouselCtrl : function()
	{
		var $carousel = $("#Carousel");
		var index = 0;
		var canMove = true;
		var forward = true;
		var change = true;
		var translatePosition = function(){
			canMove = true;
			if(index === 0)
			{
				$("#Carousel>div:eq(0)").css("transform", "translate3d(0,0,0)");
				$("#Carousel>div:eq(3)").css("transform", "translate3d(-400%,0,0)");
				$carousel.css("transition-duration", "0s").css("transform","translate3d(0, 0, 0)");
			}
			else if(index === 3)
			{
				$("#Carousel>div:eq(3)").css("transform", "translate3d(0,0,0)");
				$("#Carousel>div:eq(0)").css("transform", "translate3d(400%,0,0)");
				$carousel.css("transition-duration", "0s").css("transform","translate3d(-75%, 0, 0)");
			}
			else
			{
				$("#Carousel>div:eq(0)").css("transform", "translate3d(0,0,0)");
				$("#Carousel>div:eq(3)").css("transform", "translate3d(0,0,0)");
			}
		};
		ViewCtrl.play = function(){
				$("#indexContainer>div:eq("+index+")").removeClass().addClass("index");
				if(forward)
					index++;
				else
					index--;
				
				// requestAnimationFrame(function(){
						$carousel.css("transition", "transform ease .55s")
						.css("transform", "translate3d(" + index*-25 + "%,0,0)");
					// });
				if(index === -1)
					index = 3;
				else if(index === 4)
					index = 0;
				$("#indexContainer>div:eq("+index+")").removeClass().addClass("indexSelected");
			};

		ViewCtrl.timer = setInterval(ViewCtrl.play,3000);
		$carousel.on("transitionend", function(){
			translatePosition();
		});
		$carousel.slide({
			direction : "horizontal",
			horizontal : "both",
			startEvent : function(){
				clearInterval(ViewCtrl.timer);
				if(index === 0)
						$("#Carousel>div:eq(3)").css("transform", "translate3d(-400%,0,0)");
				else if(index === 0)
						$("#Carousel>div:eq(0)").css("transform", "translate3d(400%,0,0)");
				translatePosition();
			},
			endEvent_Horizontal : function(){
				//向左滑动
				if(this.endX - this.originX < 0 && (canMove || index != 3) && change)
				{
					if(this.translateX/$("#Carousel").width() > index*0.25 + 0.075 || this.allTime < 200)
					{
						forward = true;
						canMove = false;
						ViewCtrl.play();
					}
					else
						$carousel.css("transition", "transform ease .55s")
					.css("transform", "translate3d(-" + index*25 + "%,0,0)");
		
				}
				//向右滑动
				else if(this.endX - this.originX > 0 && (canMove || index != 0) && change)
				{
					if(this.translateX/$("#Carousel").width() < index*0.25 - 0.075 || this.allTime < 300)
					{
						forward = false;
						canMove = false;
						ViewCtrl.play();
					}
					else
						// requestAnimationFrame(function(){
							$carousel.css("transition", "transform ease .55s")
							.css("transform", "translate3d(-" + index*25 + "%,0,0)");
						// });
				}

				forward = true;
				ViewCtrl.timer = setInterval(ViewCtrl.play,3000);
			}
		});
	},

	pageCtrl : function()
	{
		var index = 0;
		var isChangePage = true;
		var changePage = function(i)
		{
			var pageWidth = $("#mainPage").width();
			index = i;
			if(i === 0)
				i = 1;
			else
				i = 0;
			$(".menuTextNotChoice").removeClass("menuTextNotChoice");
			$(".menuText:eq("+i+")").addClass("menuTextNotChoice");
			$("#mainPage, #classifyPage").css("transition","transform ease .55s").css("transform", "translate3d(-"+100*index+"%, 0, 0)");
			$("#textBorder").css("transition","transform ease .55s").css("transform", "translate3d(" + pageWidth*0.24*index + "px,0,0)");
		};

		$(document).on("touchstart", ".menuText", function(event){
			// event.preventDefault();
			changePage($(".menuText").index(this));

		});

		$("#mainPage .container>.videoBox, #classifyPage").on("loadDataEnd", function(){
			$("#mainPage .container>.videoBox, #classifyPage").slide({
				direction : "horizontal",
				horizontal : "left",
				moveElement : $("#mainPage, #classifyPage"),
				startEvent : function(){
					if(this.element.attr("id") === "classifyPage"){
						this.direction = "all";
						this.horizontal = "right";
					}
				},
				moveEvent_Horizontal : function(){
					$("#textBorder").css("transition-duration","0s").css("transform", "translate3d(" + Math.abs(this.translateX)*0.24 + "px,0,0)");
				},
				endEvent_Horizontal : function(){
					var pageWidth = $("#mainPage").width();

					if(Math.abs(this.endX - this.originX) >= 40 
						&& (Math.abs(this.endX - this.originX)/pageWidth > 0.5 || this.allTime < 300))
					{
						if(index === 0 && this.endX - this.originX < 0)
						{
							index = 1;
							changePage(index);
						}
						else if(index === 1 && this.endX - this.originX > 0)
						{
							index = 0;
							changePage(index);
						}
					}
					//切换失败，返回原页面
					else
					{
						if(index === 0)
						{
							$("#mainPage, #classifyPage").css("transition","transform ease .55s").css("transform", "translate3d(0, 0, 0)");
							$("#textBorder").css("transition","transform ease .55s").css("transform", "translate3d(0,0,0)");
						}
						else
						{
							$("#mainPage, #classifyPage").css("transition","transform ease .55s").css("transform", "translate3d(-100%, 0, 0)");
							$("#textBorder").css("transition","transform ease .55s").css("transform", "translate3d(" + pageWidth*0.24 + "px,0,0)");
						}
					}
				},
			});
		});
	},

	addCtrl : function()
	{
		var clicked = false;

		var hideAddPage = function()
		{
			clicked = false;
			$("#addButton").css("transform", "rotate(0deg)");
			$("#addPage").css("transform", "translate3d(0,0,0)");
			$(".inputBox:eq(0)>input:eq(0)").val("");
			$(".inputBox:eq(0)>input:eq(1)").val("");
			$(".inputBox:eq(0)>input:eq(2)").val("");
			$("#typeSelect>.selection").html("独立游戏");
			$("#typeSelect").selection("closeSelect");
		};

		$(document).on('touchmove', "#addPage", function(event){
			event.preventDefault();
		});

		$(document).on('touchstart', "#addButton", function(){
			if(!ModelCtrl.isLog){
				ViewCtrl.messageBoxCtrl("未登录或没有权限！");		
				return ;
			}
			if(clicked === false)
			{
				clicked = true;
				$("#addButton").css("transform", "rotate(135deg)");
				$("#addPage").css("transform", "translate3d(0,-100%,0)");
			}
			else
			{
				hideAddPage();
			}
		});

		$(document).on('touchstart', "#submitButton", function(){
			if($(".inputBox:eq(0)>input:eq(0)").val() === "")
			{
				ViewCtrl.messageBoxCtrl("请输入标题！");
				return ;
			}
			else if($(".inputBox:eq(0)>input:eq(1)").val() === "")
			{
				ViewCtrl.messageBoxCtrl("请输入链接！");
				return ;
			}
			ModelCtrl.submitData();
			hideAddPage();
		});
	},

	messageBoxCtrl : function(message)
	{
		if($("#messageBox").css("display") === "none")
		{
			$("#messageBox").html(message).fadeIn('fast').css("transition", "transform ease .3s").css("transform", "translate3d(0,-50px,0)");
			setTimeout(function(){
				$("#messageBox").fadeOut(500, function(){
					$("#messageBox").css("transition-duration", "0s").css("transform", "translate3d(0,0,0)");
				});
			}, 1000);
		}
	},

	resultsPageCtrl : function()
	{
		$(document).on("touchend", ".icon", function(){
			var $this = $(this);
			var key = $this.attr("data-type");
			ModelCtrl.loadData({"type":"classify", "key":key});
			$("#resultsPage").css("transition-duration","0s").css("transform", "translate3d(0,0,0)");
			$("#resultsPage").css("transition","transform ease .3s").css("transform", "translate3d(-100%,0,0)");
			$(".resultsheader").css("transition","transform ease .3s").css("transform", "translate3d(0,0,0)");
		})

		$(document).on("touchend", "#backButton", function(){
			var translate = $("#resultsPage").css("transform");
			var array = translate.substring(7);
			var temp = array.split(",");
			translateY = parseInt(temp[5]);
			$("#resultsPage").css("transition","transform ease .3s").css("transform", "translate3d(0,"+translateY+"px,0)");
			$(".resultsheader").css("transition","transform ease .3s").css("transform", "translate3d(100%,0,0)");
		});

		$("#resultsPage").slide({
			startEvent : function(){
				this.contentHeight = ($("#resultsPage>.container").height() + 160);
				this.originTranslateX = parseInt($("#resultsPage").css("transform").substring(7).split(",")[4]);
			},
			moveEvent_Horizontal : function(){
				$(".resultsheader").css("transition-duration", "0s")
				.css("transform", "translate3d("+(this.moveX - this.originTranslateX)+"px,0,0)");
			},
			endEvent_Horizontal : function(){
				if((this.endX - this.originX)/$("#resultsPage").width() > 0.5 || ((this.allTime < 300) && (this.endX - this.originX > 0)))
				{
					$("#resultsPage").css("transition","transform ease .3s")
						.css("transform", "translate3d(0,"+this.translateY+"px,0)");
					$(".resultsheader").css("transition","transform ease .3s").css("transform", "translate3d(100%,0,0)");
				}
				else
				{
					$("#resultsPage").css("transition","transform ease .3s")
						.css("transform", "translate3d(-100%,"+this.translateY+"px,0)");
					$(".resultsheader").css("transition","transform ease .3s").css("transform", "translate3d(0,0,0)");
				}
			}
		});

		$("#resultsPage").on("transitionend", function(){
			if($(this).css("transform") === "matrix(1, 0, 0, 1, 0, 0)")
				$("#resultsPage .videoBox").remove();
		});

		$("#resultsPage").on("transitionend", function(){
			var translate = $("#resultsPage").css("transform");
			var array = translate.substring(7);
			var temp = array.split(",");
			translateX = parseInt(temp[4]);
			if(translateX === 0)
				$("#resultsPage").css("transition-duration","0s")
		 		.css("transform", "translate3d(0,0,0)");
		});
	},

	settingPageCtrl : function(){
		$(".header>.settingButton").on("touchend", function(){
			$("#pageBG").css("display", "block");
			$("#settingPage").css("transform", "translate3d(0,0,0)");
		});

		$("#pageBG").on("touchstart touchmove", function(event){
			event.preventDefault();
		});

		$("#pageBG").on("touchend", function(){
			$("#pageBG").removeAttr("style");
			$("#settingPage").removeAttr("style");
		});

		$("#settingPage").on("touchmove", function(event){
			event.preventDefault();
		});

		$(".userPicture").on("touchend", function(){
			if(ModelCtrl.isLog === false)
				$("#logPage").fadeIn(300);
		});
	},

	logCtrl : function(){
		$("#logPage>.closeButton").on("touchend", function(){
			$("#logPage").fadeOut(300);
		});

		$("#logPage .logButton").on("touchend", function(){
			if($(".logInput:eq(0)").val() === "")
			{
				ViewCtrl.messageBoxCtrl("请输入用户名");
				return ;
			}
			else if($(".logInput:eq(0)").val().length < 4)
			{
				ViewCtrl.messageBoxCtrl("用户名最少包含四个字符");
				return ;
			}
			if($(".logInput:eq(1)").val() === "")
			{
				ViewCtrl.messageBoxCtrl("请输入密码");
				return ;
			}
			else if($(".logInput:eq(1)").val().length < 6)
			{
				ViewCtrl.messageBoxCtrl("密码最少包含六个字符");
				return ;
			}

			if($(this).index() == 0)
				ModelCtrl.log($(".logInput:eq(0)").val(), $(".logInput:eq(1)").val());
			else
				ModelCtrl.register();
		});
	},
}