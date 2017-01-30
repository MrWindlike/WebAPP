var ModelCtrl = 
{
	loadData : function()
	{
		$(".videoBox").remove();
		Bmob.initialize("84121d59c2a97a1f8a922763a7a19bfc", "190059def574c736f869932b0bb3a623");
		var video = Bmob.Object.extend("video");
		var query = new Bmob.Query(video);
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
					if(i > results.length - 5)
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
					if(i > results.length - 5)
						$(tempate).appendTo($("#Carousel"));
					else
						$(tempate).appendTo($(".container:first"));
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
			type = "indiegame";
		else if($("#inputBox>select").val() == "HTML")
			type = "html";
		else if($("#inputBox>select").val() == "CSS")
			type = "css";
		else if($("#inputBox>select").val() == "JavaScript")
			type = "javascript";
		else if($("#inputBox>select").val() == "PHP")
			type = "php";
		else if($("#inputBox>select").val() == "MYSQL")
			type = "mysql";

		Bmob.initialize("84121d59c2a97a1f8a922763a7a19bfc", "190059def574c736f869932b0bb3a623");
		var Video = Bmob.Object.extend("video");
		var video = new Video();
		video.set("title", title);
		video.set("url", url);
		video.set("author", author);
		video.set("type", type);

		video.save(null,{
			success : function(){
				ModelCtrl.loadData();
				ViewCtrl.messageBoxCtrl("添加成功！");
				return true;
			},
			error : function(error){
				ViewCtrl.messageBoxCtrl("添加失败:" + error);
				return false;
			}
		});
	},
}