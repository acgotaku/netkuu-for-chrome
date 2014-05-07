$( "#head" ).load("header.html");
$(function(){
	var index={
		init:function(){
			$("input[type=text]").focus();
			$("#click").click(function(){
				var key=$("input[type=text]").val();
				var json=index.searchResource(key);
				if(json){
				$("#result .list-group li:not(:first)").remove();
				$.each(json,function(n,e){
					window.setTimeout(function(){
						$("#result .list-group").append($("<li>").addClass("list-group-item a-fadein").append($("<a>").addClass("item-name").attr("href","list.html?code="+e.code).attr("target","_blank").text(e.name)).append(
							$("<div>").addClass("item-desc").append($("<span>").text(e.desc[6]))
							).append(
							$("<div>").addClass("item-type").append($("<span>").text(e.desc[4]))
							).append(
							$("<div>").addClass("item-time").append($("<span>").text(e.desc[7]))
							));
					},Math.min(n*100,2000));
					
				});
				}

			});
			$("input[type=text]").keydown(function(e){
				var curKey=e.which;
				if(curKey==13){
					$("#click").trigger("click");
				}
			});
		},
		getResourceTotal:function(){
			var server=header.getCookie("server");
			if(server!=""){
				var url=server+'mov/xml/Total.xml';
			}else{
				var url='http://movie.zzti.edu.cn/mov/xml/Total.xml';
			}
			$.ajax({'url':url,'dataType':'xml'})
			.done(function(xml, textStatus, jqXHR ){
				var root=xml.childNodes[0];
				var length=root.children.length;
				var obj=[];
				 for(var i=0;i<length;i++){
				 	var item=root.children[i];
				 	var film = new Object();
				 	var desc =[];
				 	film["name"]=item.children[0].firstChild.nodeValue;
				 	film["code"]=item.children[1].firstChild.nodeValue;
				 	for(var j=2;j<8;j++){
				 		if(item.children[j].firstChild){
				 			desc.push(item.children[j].firstChild.nodeValue);
				 		}else{
				 			desc.push("");
				 		}
				 	}
				 	desc.push(item.children[9].firstChild.nodeValue);
				 	desc.push(item.children[10].firstChild.nodeValue);
				 	film["desc"]=desc;
				 	obj.push(film);
				 }
				 if(typeof(Storage)!=="undefined") {
				 	localStorage.setItem("Total", JSON.stringify(obj));
				 	var time =new Date();
				 	localStorage.setItem("UpdateTotal",time.getTime());
				 }
			})
			.fail(function(jqXHR, textStatus, errorThrown){

			});
		},
		searchResource:function(key){
			var time =new Date();
			var updateTime=localStorage.getItem("UpdateTotal");
			if(time - updateTime < 5184000){
				var json=jQuery.parseJSON(localStorage.getItem("Total"));
			}
			if(!json){
				index.getResourceTotal();
				$('#Msg').modal('show');
				return;
			}
			var obj=[];
			var length=json.length;
			for (var i=0;i<length;i++){
				var film=json[i];
				if(film.name.indexOf(key)!=-1){
					obj.push(film);
					continue;
				}else if(film.code.indexOf(key)!=-1){
					obj.push(film);
					continue;
				}
				for(var j=0;j<film.desc.length;j++){
					var item=film.desc[j];
					if(item){
						if(item.indexOf(key)!=-1){
							obj.push(film);
							break;
						}
					}
				}
			}
			return obj;

		}
	};
index.init();
});

