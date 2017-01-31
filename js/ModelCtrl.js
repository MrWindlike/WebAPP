var ModelCtrl = 
{
	loadData : function(data)
	{
		Bmob.initialize("84121d59c2a97a1f8a922763a7a19bfc", "190059def574c736f869932b0bb3a623");
		var video = Bmob.Object.extend("video");
		var query = new Bmob.Query(video);
		if(data.type == "classify")
		{
			$("#resultsPage .videoBox").remove();
			query.equalTo("type", data.key);
			$("#resultsPage>.header").html(data.key);
		}
		else if(data.type == "search")
		{
			$("#resultsPage .videoBox").remove();
			$("#resultsPage>.header").html();
		}
		else
			$(".videoBox").remove();
		query.find({
			success : function(results)
			{
				for(var i = results.length - 1; i >= 0;i--)
				{
					var title = results[i].get('title');
					var url = results[i].get('url');
					var author = results[i].get('author');
					var type = results[i].get('type');
					var cover;
					if(i > results.length - 5 && data.type == "get")
						cover = "cover";
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
						if(data.type == "search" && str.isMate(title, data.key))
							$(tempate).appendTo($("#resultsPage>.container"));
						else if(data.type == "classify")
							$(tempate).appendTo($("#resultsPage>.container"));
					}
					else
					{
						if(i > results.length - 5)
							$(tempate).appendTo($("#Carousel"));
						else
							$(tempate).appendTo($(".container:first"));
					}
				}
			},
			error : function(error)
			{
				alert("获取数据失败:" + error);
			}
		})
	},

	submitData : function()
	{

		var title = $("#inputBox>input:eq(0)").val();
		var url = $("#inputBox>input:eq(1)").val();
		var author;
		if($("#inputBox>input:eq(2)").val() == "")
			author = "佚名";
		else
			author = $("#inputBox>input:eq(2)").val();
		var type;
		if($("#inputBox>select").val() == "独立游戏")
			type = "IndieGame";
		else if($("#inputBox>select").val() == "HTML")
			type = "HTML";
		else if($("#inputBox>select").val() == "CSS")
			type = "CSS";
		else if($("#inputBox>select").val() == "JavaScript")
			type = "JavaScript";
		else if($("#inputBox>select").val() == "PHP")
			type = "PHP";
		else if($("#inputBox>select").val() == "MYSQL")
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
				ModelCtrl.loadData({"type":"get", "key":""});
				ViewCtrl.messageBoxCtrl("添加成功！");
				return true;
			},
			error : function(error){
				ViewCtrl.messageBoxCtrl("添加失败:" + error);
				return false;
			}
		});
	},
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