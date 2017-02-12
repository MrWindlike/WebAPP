var ViewCtrl = 
{
	seachCtrl : function()
	{
		$(document).on('touchstart', "#searchButton", function(){
			var $search = $("#search");
			if($search.css("transform") == "matrix(0, 0, 0, 1, 0, 0)")
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
		var startX, endX, originX, startY, endY;
		var startTime, endTime;
		var index = 0;
		var canMove = true;
		var forward = true;
		var change = true;

		var play = function(){
				$("#indexContainer>div:eq("+index+")").removeClass().addClass("index");
				if(forward)
					index++;
				else
					index--;
				
				// requestAnimationFrame(function(){
						$carousel.css("transition", "transform ease .55s").css("transform", "translate3d(" + index*-25 + "%,0,0)");
					// });
				if(index == -1)
					index = 3;
				else if(index == 4)
					index = 0;
				$("#indexContainer>div:eq("+index+")").removeClass().addClass("indexSelected");

				setTimeout(function(){
					canMove = true;
					if(index == 0)
					{
						$("#Carousel>div:eq(0)").css("transform", "translate3d(0,0,0)");
						$("#Carousel>div:eq(3)").css("transform", "translate3d(-400%,0,0)");
						$carousel.css("transition-duration", "0s").css("transform","translate3d(0, 0, 0)");
					}
					else if(index == 3)
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
				}, 510);
			};
		var timer = setInterval(play,3000);

		$(document).on("touchstart", "#Carousel", function(event){
			startTime = new Date().getTime();
			clearInterval(timer);
			originX = startX = event.changedTouches[0].pageX;
			startY = event.changedTouches[0].pageY;
			if(index == 0)
					$("#Carousel>div:eq(3)").css("transform", "translate3d(-400%,0,0)");
			else if(index == 0)
					$("#Carousel>div:eq(0)").css("transform", "translate3d(400%,0,0)");
		});
		$(document).on("touchmove", "#Carousel", function(event){
			endX = event.changedTouches[0].pageX;
			endY = event.changedTouches[0].pageY;

			/*MoveX*/
			var translate = $carousel.css("transform");
			var array = translate.substring(7);
			var temp = array.split(",");
			var translateX = parseInt(temp[4]);
			var moveX = translateX + (endX - startX);
			/*MoveY*/
			translate = $carousel.css("transform");
			array = translate.substring(7);
			temp = array.split(",");
			var translateY = parseInt(temp[5]);
			var moveY = translateY + (endY - startY);
			// requestAnimationFrame(function(){
				if(canMove && (Math.abs(moveX) > Math.abs(moveY)))
				{
					change = true;
					$carousel.css("transition-duration", "0s").css("transform","translate3d(" + moveX + "px, 0, 0)");
					event.preventDefault();
				}
				else if(canMove == false)
					event.preventDefault();
				else if(canMove == false || (Math.abs(moveX) <= Math.abs(moveY)))
					change = false;
			// });
			startX = endX;
		});
		$(document).on("touchend", "#Carousel", function(){
			var translate = $carousel.css("transform");
			var array = translate.substring(7);
			var temp = array.split(",");
			var translateX = Math.abs(parseInt(temp[4]));
			endTime = new Date().getTime();
			//向左滑动
			if(endX - originX < 0 && (canMove || index != 3) && change)
			{
				if(translateX/$("#Carousel").width() > index*0.25 + 0.075 || endTime - startTime < 200)
				{
					forward = true;
					canMove = false;
					play();
				}
				else
					$carousel.css("transition", "transform ease .55s").css("transform", "translate3d(-" + index*25 + "%,0,0)");
	
			}
			//向右滑动
			else if(endX - originX > 0 && (canMove || index != 0) && change)
			{
				if(translateX/$("#Carousel").width() < index*0.25 - 0.075 || endTime - startTime < 300)
				{
					forward = false;
					canMove = false;
					play();
				}
				else
					// requestAnimationFrame(function(){
						$carousel.css("transition", "transform ease .55s").css("transform", "translate3d(-" + index*25 + "%,0,0)");
					// });
			}

			forward = true;
			timer = setInterval(play,3000);
		})
	},

	pageCtrl : function()
	{
		var startX, endX, originX, startY, endY, originY;
		var startScroll, endScroll;
		var startTime, endTime;
		var index = 0;
		var isChangePage = true;
		var changePage = function(i)
		{
			var pageWidth = $("#mainPage").width();
			index = i;
			if(i == 0)
				i = 1;
			else
				i = 0;
			$(".menuTextNotChoice").removeClass("menuTextNotChoice");
			$(".menuText:eq("+i+")").addClass("menuTextNotChoice");
			$("#mainPage, #classifyPage").css("transition","transform ease .55s").css("transform", "translate3d(-"+100*index+"%, 0, 0)");
			$("#textBorder").css("transition","transform ease .55s").css("transform", "translate3d(" + pageWidth*0.24*index + "px,0,0)");
		};

		$(document).on("touchstart", "#mainPage .container>.videoBox, #classifyPage, .menuText", function(event){
			// event.preventDefault();
			var $this = $(this);
			originX = startX = event.changedTouches[0].pageX;
			originY = startY = event.changedTouches[0].pageY;
			startScroll = $(window).scrollTop();
			startTime = new Date().getTime();
			if($this.hasClass("menuText"))
				changePage($(".menuText").index(this));

		});

		$(document).on("touchmove", "#mainPage .container>.videoBox, #classifyPage", function(event){
			endX = event.changedTouches[0].pageX;
			endY = event.changedTouches[0].pageY;
			endScroll = $(window).scrollTop();
			var $this = $(this);
			/*MoveX*/
			var translate = $("#mainPage").css("transform");
			var array = translate.substring(7);
			var temp = array.split(",");
			var translateX = parseInt(temp[4]), translateY = parseInt(temp[5]);
			var moveX = translateX + (endX - startX);
			/*MoveY*/
			/*moveY = translateY + (endY - startY);
			var mainPageHeight = $("#mainPage").height();*/
			if($this.attr("id") == "classifyPage")
				event.preventDefault();

			if((Math.abs(endY - originY)*3 < Math.abs(endX - originX)) && (startScroll - endScroll == 0) )
			{
				isChangePage = true;
				if((index == 0 && endX - originX < 0) || (index == 1 && endX - originX > 0))
				{
					$("#mainPage, #classifyPage").css("transition-duration","0s").css("transform", "translate3d(" + moveX + "px, 0, 0)");
					$("#textBorder").css("transition-duration","0s").css("transform", "translate3d(" + Math.abs(translateX)*0.24 + "px,0,0)");
				}
				else
					event.preventDefault();

			}
			else
				isChangePage = false;
			/*else if(Math.abs(moveY) > Math.abs(moveX))
			{
				if(Math.abs(translateY) < mainPageHeight - screen.height)
					$("#classifyPage").css("transform", "translate3d(0," + -moveY + "px, 0)");
					// $("#mainPage").css("transform", "translate3d(0, -436px, 0)");
			}*/
			startX = endX;
			/*startY = endY;*/
		});
		$(document).on("touchend", "#mainPage .container>.videoBox, #classifyPage", function(event){
			endX = event.changedTouches[0].pageX;
			endScroll = $(window).scrollTop();
			var pageWidth = $("#mainPage").width();
			endTime = new Date().getTime();

			//滑动切换页
			if(Math.abs(endX - originX) >= 40 && (Math.abs(endX - originX)/pageWidth > 0.5 || endTime - startTime < 300) && isChangePage)
			{
				if(index == 0 && endX - originX < 0)
				{
					index = 1;
					changePage(index);
				}
				else if(index == 1 && endX - originX > 0)
				{
					index = 0;
					changePage(index);
				}
			}
			//切换失败，返回原页面
			else
			{
				if(index == 0)
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
		})
	},

	addCtrl : function()
	{
		var clicked = false;

		var hideAddPage = function()
		{
			clicked = false;
			$("#addButton").css("transform", "rotate(0deg)");
			$("#addPage").css("transform", "translate3d(0,0,0)");
			$("#inputBox>input:eq(0)").val("");
			$("#inputBox>input:eq(1)").val("");
			$("#inputBox>input:eq(2)").val("");
			$("#typeSelect>.selection").html("独立游戏");
			$("#typeSelect").selection("closeSelect");
		};

		$(document).on('touchmove', "#addPage", function(event){
			event.preventDefault();
		});

		$(document).on('touchstart', "#addButton", function(){
			if(clicked == false)
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
			if($("#inputBox>input:eq(0)").val() == "")
			{
				ViewCtrl.messageBoxCtrl("请输入标题！");
				return ;
			}
			else if($("#inputBox>input:eq(1)").val() == "")
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
		$("#messageBox").html(message).fadeIn('fast').css("transition", "transform ease .3s").css("transform", "translate3d(0,-50px,0)");
		setTimeout(function(){
			$("#messageBox").fadeOut(500, function(){
				$("#messageBox").css("transition-duration", "0s").css("transform", "translate3d(0,0,0)");
			});
		}, 1000);
	},

	resultsPageCtrl : function()
	{
		var startY, endY, originY, startX, endX, originX;
		var startTime, endTime;
		var translateY, moveY, transformX, moveX, headerTranslateX, originTranslateX;
		var direction = 0;		//0 is none, 1 is vertical, 2 is horizontal.
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

		$(document).on("touchstart", "#resultsPage", function(event){
			originY = startY = event.changedTouches[0].pageY;
			originX = startX = event.changedTouches[0].pageX;
			startTime = new Date().getTime();
			var translate = $("#resultsPage").css("transform");
			var array = translate.substring(7);
			var temp = array.split(",");
			originTranslateX = parseInt(temp[4]);
		});
		$(document).on("touchmove", "#resultsPage", function(event){
			event.preventDefault();
			endY = event.changedTouches[0].pageY;
			endX = event.changedTouches[0].pageX;
			var translate = $("#resultsPage").css("transform");
			var array = translate.substring(7);
			var temp = array.split(",");
			translateY = parseInt(temp[5]);
			translateX = parseInt(temp[4]);
			translate = $(".resultsheader").css("transform");
			array = translate.substring(7);
			temp = array.split(",");
			headerTranslateX = parseInt(temp[4]);
			moveY = translateY + (endY - startY);
			moveX = translateX + (endX - startX);
			// console.log(translateX);
			// console.log(headerTranslateX);
			if(direction == 0 && (Math.abs(endX - startX) > Math.abs(endY - startY)) )
				direction = 2;
			else if(direction == 0 && (Math.abs(endX - startX) < Math.abs(endY - startY)))
				direction = 1;
			if(direction == 1 && 
				(moveY < 0 && moveY > (document.documentElement.clientHeight - $("#resultsPage>.container").height() - 160)))
				$("#resultsPage").css("transition-duration", "0s").css("transform", "translate3d(-100%,"+moveY+"px,0)");
			else if(direction == 2 && (endX - originX) > 0)
			{

				$("#resultsPage").css("transition-duration", "0s").css("transform", "translate3d("+moveX+"px,"+translateY+"px,0)");
				$(".resultsheader").css("transition-duration", "0s")
				.css("transform", "translate3d("+(moveX - originTranslateX)+"px,0,0)");
			}

			startX = endX;
			startY = endY;

		});
		$(document).on("touchend", "#resultsPage", function(event){
			endTime = new Date().getTime();
			var allTime = endTime - startTime;
			var lastmove = moveY + ((endY - originY)/allTime*500);

			//vertical
			if(direction == 1)
			{
				if(lastmove < 0 && lastmove > (document.documentElement.clientHeight - $("#resultsPage>.container").height() - 160))
					$("#resultsPage").css("transition","transform cubic-bezier(0.22, 0.61, 0.36, 1) .3s")
				.css("transform", "translate3d(-100%,"+lastmove+"px,0)");
				else
				{
					if(lastmove >= 0)
						$("#resultsPage").css("transition","transform cubic-bezier(0.22, 0.61, 0.36, 1) .3s")
					.css("transform", "translate3d(-100%,0,0)");
					else if(document.documentElement.clientHeight <= $("#resultsPage>.container").height() - 160)
					{
						lastmove = document.documentElement.clientHeight - $("#resultsPage>.container").height() - 160;
						$("#resultsPage").css("transition","transform cubic-bezier(0.22, 0.61, 0.36, 1) .3s")
						.css("transform", "translate3d(-100%,"+lastmove+"px,0)");
					}
				}
			}
			//horizontal
			else if(direction == 2)
			{
				if((endX - originX)/$("#resultsPage").width() > 0.5 || ((allTime < 300) && (endX - originX > 0)))
				{
					$("#resultsPage").css("transition","transform ease .3s")
						.css("transform", "translate3d(0,"+translateY+"px,0)");
					$(".resultsheader").css("transition","transform ease .3s").css("transform", "translate3d(100%,0,0)");
				}
				else
				{
					$("#resultsPage").css("transition","transform ease .3s")
						.css("transform", "translate3d(-100%,"+translateY+"px,0)");
					$(".resultsheader").css("transition","transform ease .3s").css("transform", "translate3d(0,0,0)");
				}
			}
			direction = 0;
		});

		$(document).on("transitionend", "#resultsPage", function(){
			var translate = $("#resultsPage").css("transform");
			var array = translate.substring(7);
			var temp = array.split(",");
			translateX = parseInt(temp[4]);
			if(translateX == 0)
				$("#resultsPage").css("transition-duration","0s")
		 		.css("transform", "translate3d(0,0,0)");
		});
	},
}