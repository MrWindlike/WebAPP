var ModelCtrl = 
{
	times : -2,
	first : true,
	loadFinish : false,
	isLog : false,
	loadData : function(data)
	{
		if(!ModelCtrl.isLog){
			ViewCtrl.messageBoxCtrl("请先登录账号！");		
			return ;
		}
		Bmob.initialize("84121d59c2a97a1f8a922763a7a19bfc", "190059def574c736f869932b0bb3a623");
		var video = Bmob.Object.extend("video");
		var query = new Bmob.Query(video);
		var limit = 8;
		query.count({
		  success: function(count) {
		  	if(data.type == "update")
		  	{
		  		ModelCtrl.times = -2;
				$(".videoBox").remove();
		  	}
			if(data.type == "classify")
			{
				$("#resultsPage .videoBox").remove();
				query.equalTo("type", data.key);
				$(".resultsheader>i").html(data.key);
			}
			else if(data.type == "search")
			{
				$("#resultsPage .videoBox").remove();
			}
			else
			{
				if(ModelCtrl.times == 0)
				{
					query.skip(0);
					query.limit(count%limit);
				}
				else
				{
					if(ModelCtrl.times == -2)
						ModelCtrl.times = Math.floor(count/limit);
					else if(ModelCtrl.times == -1)
						return ;
					query.skip((ModelCtrl.times-1)*limit + count%limit);
					query.limit(limit);
				}
			}
			query.find({
				success : function(results)
				{
					var searchFlag = false;
					for(var i = results.length - 1; i >= 0;i--)
					{
						var title = results[i].get('title');
						var url = results[i].get('url');
						var author = results[i].get('author');
						var type = results[i].get('type');
						var cover;
						if(ModelCtrl.first)
						{
							if(i > results.length - 5 && data.type == "get")
								cover = "cover";
							else
								cover = "overlay";
						}
						else
							cover = "overlay";
						var tempate = '<div class="videoBox" style="background: #525252 url(img/'+type+'.jpg) no-repeat;">' +
									'<a href=\"' + url + '\">' +
										'<div class=\"'+ cover + '\"></div>' +
										'<div class="title">' + title + '</div>' +
										'<div class="information">作者 / ' + author + '</div>' +
									'</a>' +
								'</div>';
						if(data.type == "classify" || data.type == "search")
						{
							if(data.type == "search" && str.isMate(title.toUpperCase(), data.key.toUpperCase()))
							{
								searchFlag = true;
								$("#search").css("transform", "scale(0,1)").val("");
								$(".resultsheader>i").html(data.key.toUpperCase());
								$(tempate).appendTo($("#resultsPage>.container"));
								$("#resultsPage").css("transition","transform ease .3s").css("transform", "translate3d(-100%,0,0)");
								$(".resultsheader").css("transition","transform ease .3s").css("transform", "translate3d(0,0,0)");
							}
							else if(data.type == "classify")
								$(tempate).appendTo($("#resultsPage>.container"));
							else if(searchFlag == false && i == 0)
								ViewCtrl.messageBoxCtrl("搜索失败！");
						}
						else
						{
							if(ModelCtrl.first)
							{
								if(i > results.length - 5)
									$(tempate).appendTo($("#Carousel"));
								else
									$(tempate).appendTo($(".container:first"));
							}
							else
								$(tempate).appendTo($(".container:first"));
						}
					}
					$("#mainPage .container>.videoBox, #classifyPage").trigger("loadDataEnd");
					ModelCtrl.first = false;
					ModelCtrl.loadFinish = true;
					
				},
				error : function(error)
				{
					alert("获取数据失败:" + error);
				}
			});
		}
	});
	},

	preLoad : function()
	{
		$(window).on("scroll", function(){
			if(!ModelCtrl.isLog){
				ViewCtrl.messageBoxCtrl("请先登录账号！");		
				return ;
			}
			var scrollTop = $(window).scrollTop();
			if($(document).height() - $(window).height() - scrollTop - 160
			 <= $(".videoBox").innerHeight()*2 + $("#footer").innerHeight()
			 && ModelCtrl.times >= 0 && ModelCtrl.loadFinish)
			{
				ModelCtrl.loadFinish = false;
				ModelCtrl.loadData({"type":"get", "key":""});
				console.log(ModelCtrl.times);
				ModelCtrl.times--;
			}
		});
	},

	submitData : function()
	{

		var title = $(".inputBox>input:eq(0)").val();
		var url = $(".inputBox>input:eq(1)").val();
		var author;
		if($(".inputBox>input:eq(2)").val() == "")
			author = "佚名";
		else
			author = $(".inputBox>input:eq(2)").val();
		var type;
		if($("#typeSelect>.selection").html() == "独立游戏")
			type = "IndieGame";
		else if($("#typeSelect>.selection").html() == "HTML")
			type = "HTML";
		else if($("#typeSelect>.selection").html() == "CSS")
			type = "CSS";
		else if($("#typeSelect>.selection").html() == "JavaScript")
			type = "JavaScript";
		else if($("#typeSelect>.selection").html() == "PHP")
			type = "PHP";
		else if($("#typeSelect>.selection").html() == "MYSQL")
			type = "MYSQL";

		Bmob.initialize("84121d59c2a97a1f8a922763a7a19bfc", "190059def574c736f869932b0bb3a623");
		var Video = Bmob.Object.extend("video");
		var video = new Video();
		video.set("title", title);
		video.set("url", url);
		video.set("author", author);
		video.set("type", type);

		video.save(null,{
			success : function(){
				ModelCtrl.first = true;
				ModelCtrl.loadData({"type":"update", "key":""});
				ViewCtrl.messageBoxCtrl("添加成功！");
				return true;
			},
			error : function(error){
				ViewCtrl.messageBoxCtrl("添加失败:" + error);
				return false;
			}
		});
	},

	log : function(username, password)
	{
		Bmob.initialize("84121d59c2a97a1f8a922763a7a19bfc", "190059def574c736f869932b0bb3a623");
		var user = Bmob.Object.extend("_User");
		var query = new Bmob.Query(user);
		var flag = false;

		query.equalTo("username", username);
		query.equalTo("password", password);

		query.find({
			success : function(results){
				if(results.length){
					ModelCtrl.isLog = true;
					ModelCtrl.loadData({"type":"get", "key":""});
					ViewCtrl.messageBoxCtrl("登录成功！");
					flag = true;
					$("#logPage").fadeOut(300);
					$(".logInput:eq(0)").val("");
					$(".logInput:eq(1)").val("");
					$("#settingPage .username").html(username);
					Cookies.set("username", username, new Date().setDate(new Date().getDate() + 30));
					Cookies.set("password", password, new Date().setDate(new Date().getDate() + 30));
				}
				else
					ViewCtrl.messageBoxCtrl("用户名或密码错误！");
			},
			error : function(error){
				ViewCtrl.messageBoxCtrl(error);
			}
		});

		return flag;
	},

	register : function()
	{
		Bmob.initialize("84121d59c2a97a1f8a922763a7a19bfc", "190059def574c736f869932b0bb3a623");
		var User = Bmob.Object.extend("_User");
		var user = new User();

		user.set("username", $(".logInput:eq(0)").val());
		user.set("password", $(".logInput:eq(1)").val());

		user.save(null, {
			success : function(){
				ViewCtrl.messageBoxCtrl("申请注册成功，请等待审核。");
				$(".logInput:eq(0)").val("");
				$(".logInput:eq(1)").val("");
			},
			error : function(error){
				ViewCtrl.messageBoxCtrl("该用户已存在!" + error);
			}
		});
	},

	autoLog : function()
	{
		/*Cookies.unset("username");
		Cookies.unset("password");*/
		var username = Cookies.get("username"),
			password = Cookies.get("password");
		if(username && password)
			ModelCtrl.log(username, password);
		else
			ViewCtrl.messageBoxCtrl("请先登录账号！");
	}
};

var str = 
{
	isMate : function(s, t)
	{
		var nextval = new Array(t.length);
		str.getNextval(t, nextval);
		var i = 0, j = 0;

		while(i < s.length && j < t.length)
		{
			if(s.charAt(i) == t.charAt(j) || j == -1)
			{
				i++;
				j++;
			}
			else
				j = nextval[j];
		}

		if(j == t.length)
			return true;
		else
			return false;
	},

	getNextval : function(t, nextval)
	{
		var i = 1, j = 0;

		nextval[0] = -1;

		while(i < t.length)
		{
			if(t.charAt(i) == t.charAt(j) || j == -1)
			{
				if(t.charAt(i) != t.charAt(nextval[i]))
					nextval[++i] = j++;
				else
					nextval[++i] = nextval[i];
			}
			else
				j = nextval[j];
		}

	},
};