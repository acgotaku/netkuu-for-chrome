$( "#head" ).load("header.html");
$(function(){
	var list={
		url:"http://movie.zzti.edu.cn/",
		init:function(){
			var str=window.location.search;
			var code=str.match(/code=([a-zA-Z0-9].*[a-zA-Z0-9])/i);
			code=code[1];
			$(".cover").attr("src",this.url+"mov/"+code+"/1.jpg").attr("width","300px").attr("height","400px");
			list.get_info(code,list.set_info);
			list.get_item(code);
			},
		num:function(code){
			if(code.length>9){
				var tempstr="";
				for(i=0;i<code.length-1;i++){
					tempstr = tempstr+"%"+code.substr(i,2);
					i=i+1;
				}
				var url=decodeURIComponent(tempstr);
			}else{
				return 0;
			}
			num=url.match(/\#\#(\d+)/i);
			if (num){
				return num[1];
			}
			else
				return 0;
		},
		printf:function(num){
			if(num<10){
				return ("00"+num)
			}
			else if(num>=10&&num<100){
				return ("0"+num)
			}
			else if(num>=100){
				return (num)
			}
		},
		get_item:function(code){
			var server=header.getCookie("server");
			if(server!=""){
				var url=server+'mov/'+code+'/url.xml';
			}else{
				var url='http://movie.zzti.edu.cn/'+'mov/'+code+'/url.xml';
			}			
			$.ajax({'url':url,'dataType':'xml'})
			.done(function(xml, textStatus, jqXHR ){
				var item=xml.childNodes[0];
				var obj={};
				var num=[];
				obj["name"]=item.children[0].firstChild.nodeValue;
				obj["code"]=item.children[1].firstChild.nodeValue;
				obj["code"]=obj["code"].replace(/\n/g, "");
				num=obj.code.split(",");
				num.length=num.length-1;
				obj["code"]=num;
				if (obj.length==0){
					$(".tiny").append($("<h2>").text("服务器没有资源"));
					return
				}
				var num=list.num(code);
				if (num==0){
					num=1;
				}
				$.each(obj.code,function(n,e){
				 	var item=$("<a>").attr("href","item.html?code="+code+"&num="+n).attr("target","_blank").text(list.printf(parseInt(num)+n));
				 	if (e==""){
				 		item.attr("disabled","disabled");
				 	}
				 	item.click(function(){
				 		console.log("Hello");
				 		header.setCookie("num",$(this).text(),1);
				 		header.setCookie("fname",$(".item-name h2").text(),1);
				 	});
				 	$(".tiny").append(item.clone().addClass("btn btn-default"));
				 	$("<li>").addClass("list-group-item").append($("<i>").addClass("select-box")).append(item.clone().addClass("btn btn-default").text($(".item-name").text()+"第"+item.clone().text()+"集")).appendTo($(".list .list-group"));
				 	
				 });
				list.select_click();
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				$(".tiny").append($("<h2>").text("服务器没有资源"));
			});


		},
		select_click:function(){
			$("i").each(function(){
				var val=$(this).next().attr("disabled");
				if(val=="disabled"){
					$(this).attr("disabled","disabled");
				}
			});
			$("i").click(function(){
				if($(this).attr("data-click")=="all"){
					if($(this).html()==""){
						$("i").each(function(){
							if($(this).attr("disabled")!="disabled"){
								$(this).html($("<span>").addClass("glyphicon glyphicon-ok"));
							}
						});
					}else{
						$("i").empty();
					}				
				}else{
					list.add_ok($(this));
				}	
			});
			list.download_click();
		},
		add_ok:function(item){
			if(item.attr("disabled")!="disabled"){
				if(item.html()==""){
					item.html($("<span>").addClass("glyphicon glyphicon-ok"));
				}else{
					item.empty();
				}				
			}
		},
		download_click:function(){
			$("a[data-click=download]").click(function(){
				$("i").each(function(){
					if($(this).html()!="" &&$(this).attr("data-click")!="all"){
						var title=$(this).next().text();
						var url=$(this).next().attr("href");
						var query=url.split("?")[1];
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
						var server=header.getCookie("server");
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
								var date=new Date();
								var json=[ { "id" : date.getTime(),
										    "jsonrpc" : "2.0",
										    "method" : "aria2.addUri",
										    "params" : [ [ down_url ],
										        { "header" : [ "User-Agent: Novasoft NetPlayer/4.0"
										            ],
										          "out" : title+"."+file_type
										        }
										      ]
										  } ];
								list.add_aria2(json);
								})
						.fail(function(jqXHR, textStatus, errorThrown){
							console.log(textStatus);
						});

					}
				});
			});
		},
		add_aria2:function(json){
			var url='http://localhost:6800/jsonrpc';
			$.ajax({'url':url,'dataType':'json',type:'POST',data:JSON.stringify(json)})
			.done(function(text, textStatus, jqXHR ){
				$('#Msg_content').text("下载成功");
				$('#Msg').modal('show');	
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				$('#Msg_content').text("下载失败,请检查RPC设置");
				$('#Msg').modal('show');
			});

		},
		get_info:function(code,func){
			var server=header.getCookie("server");
			if(server!=""){
				var url=server+'mov/'+code+'/film.xml';
			}else{
				var url='http://movie.zzti.edu.cn/'+'mov/'+code+'/film.xml';
			}
			var info = new Object();
			$.ajax({'url':url,'dataType':'xml'})
			.done(function(xml, textStatus, jqXHR ){
				 var item=xml.childNodes[0];
				 info["name"]=item.children[0].firstChild.nodeValue;
				 info["director"]=item.children[1].firstChild.nodeValue;
				 info["actor"]=item.children[2].firstChild.nodeValue;
				 info["region"]=item.children[3].firstChild.nodeValue;
				 info["type"]=item.children[4].firstChild.nodeValue;
				 info["publishTime"]=item.children[6].firstChild.nodeValue;
				 info["adddate"]=item.children[9].firstChild.nodeValue;
				 info["brief"]=item.children[12].firstChild.nodeValue.replace(/(\#+)([a-zA-Z0-9]{3,5});/g,"");
				 func(info);
			})
			.fail(function(jqXHR, textStatus, errorThrown){

			});

		},
		set_info:function(data){
			document.title=data.name;
			$(".item-name").append($("<h2>").text(data.name));
			$(".item-director").append($("<span>").text(data.director));
			$(".item-actor").append($("<span>").text(data.actor));
			$(".item-type").append($("<span>").text(data.type));
			$(".item-region").append($("<span>").text(data.region));
			$(".item-publishTime").append($("<span>").text(data.publishTime));
			$(".item-adddate").append($("<span>").text(data.adddate));
			$(".item-brief").append($("<span>").text(data.brief));
		}
	};
list.init();
});

