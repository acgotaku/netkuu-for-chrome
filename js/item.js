$( "#head" ).load("header.html");
$(function(){
	 item={
		url:"http://movie.zzti.edu.cn/",
		init:function(){
			var server=header.getCookie("server");
			var query=window.location.search.substring(1);
			var vars = query.split("&");
			var num,code;
			for (var i=0;i<vars.length;i++){
				var pair = vars[i].split("=");
				if(pair[0]=="code"){
					code=pair[1]
				}else if(pair[0]=="num"){
					num=pair[1]
				}
			}
			if(server!=""){
				var url=server+'xy_path.asp?a='+num+'&b='+code;
			}else{
				var url='http://movie.zzti.edu.cn/'+'xy_path.asp?a='+num+'&b='+code;
			}
			$.ajax({'url':url,'dataType':'text'})
			.done(function(text, textStatus, jqXHR ){
					var data=text.split("|||")[1];
					var server=header.getCookie("server")
					var down_url=data;
					if(server!=""){
						down_url=data.replace(/^http:\/\/.+?\//gi,server);
					}
					var array=data.split(".");
					var file_type=array[array.length-1];
					var num=header.getCookie("num");
					var file_name="视频."+file_type;
					if(num!=""){
						file_name=header.getCookie("fname")+"第"+header.getCookie("num")+"集"+"."+file_type;
					}
					$(".middle a").text(file_name).attr("href",down_url).attr("download",file_name);
			})
			.fail(function(jqXHR, textStatus, errorThrown){

			});
			setTimeout(function(){
				$(".middle a").trigger("click");
			},3000);
		}
	
	};
item.init();
});

