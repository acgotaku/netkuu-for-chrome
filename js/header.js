	var header={
		init:function(){
			var schoolName=header.getCookie("name");
			if (schoolName!=""){
				$("#schoolName").text(schoolName);
			}
			$(".glyphicon").click(function(){
				header.getServerList();
			});
		},
		getXmlList:function(){
			$.ajax({'url':'http://www.icehoney.me/server_list.ahnu','dataType':'xml'})
			.done(function(xml, textStatus, jqXHR ){
				 var root=xml.childNodes[0];
				 var length=root.children.length;
				 var obj=[];
				 for(var i=0;i<length;i++){
				 	var item=root.children[i];
				 	var server = new Object();
				 	server[item.children[0].nodeName]=item.children[0].firstChild.nodeValue;
				 	server[item.children[1].nodeName]=item.children[1].firstChild.nodeValue;
				 	obj.push(server);
				 }
				 if(typeof(Storage)!=="undefined") {
				 	localStorage.setItem("ServerList", JSON.stringify(obj));
				 	var time =new Date();
				 	localStorage.setItem("UpdateList",time.getTime());
				 }
			})
			.fail(function(jqXHR, textStatus, errorThrown){

			});
		},
		getServerList:function(){
			var time =new Date();
			var updateTime=localStorage.getItem("UpdateList");
			if(time - updateTime < 5184000){
				var json=jQuery.parseJSON(localStorage.getItem("ServerList"));
			}
			if(!json){
				header.getXmlList();
				$('#Msg').modal('show');
				$('#ServerList').modal('hide');
				return ;
			}
			$.each(json,function(n,e){
				$(".modal-body .list-group").append($("<a>").addClass("list-group-item a-fadein").text(e.name).attr("url",e.url).attr("href","javascript:void(0);").click(function(){
					header.setCookie("server",$(this).attr("url"),360);
					$("#schoolName").text($(this).text());
					header.setCookie("name",$(this).text(),360);
					$('#ServerList').modal('hide');
				}));
			});
		},
		setCookie:function(name,value,days){
			if(typeof(Storage)!=="undefined") {
				localStorage.setItem(name,value);
			}
		},
		getCookie:function(cname){
			var value=localStorage.getItem(cname);
			if(value){
				return value;
			}else{
				return "";
			}
		}
	};
	header.init();

