	
// 二维码下拉/收缩
	$(".er").children("p").children("a").on("mouseenter",function(){
		$(".s1").slideDown("slow");
	})
	$(".er").on("mouseleave",function(){
		$(".s1").slideUp("slow");
	})
// nav 导航栏
	$(".nav").on("mouseenter",".n-list",function(){
		$(this).find("li").stop(true,true).slideDown("slow");
		
	})
	$(".nav").on("mouseleave",".n-list",function(){
		$(this).find("li").fadeOut(400);
	})
	// 	清除页面所有空白节点
	
	Element.prototype.del= function() {
		var nodeall=this.childNodes;
		for(var i=0;i<nodeall.length;i++){
			if(nodeall[i].nodeType==3&&!/\S/.test(nodeall[i].nodeValue)){
				this.removeChild(nodeall[i])
			}
		}
	}
	function Cler(){
		var $clear=document.getElementsByTagName('*');
		for(var i=0;i<$clear.length;i++){
			$clear[i].del();
		}
	}
	Cler();

	//DOM二级事件
	Element.prototype.addHandler=function(type,fct){
		if(this.addEventListener){
			this.addEventListener(type,fct,false)
		}else{
			this.attachEvent("on"+type,fct)
		}
	}
	//索引值
	Element.prototype.index=function(){
		var All=this.parentNode.childNodes;
		for(var i=0;i<All.length;i++){
			if(All[i]==this){
				return i;
			}
		}
	}
	//轮播图
	var $ul=document.querySelector(".Cir");
	var $con=document.querySelector(".con");
	var $ulchild=$ul.childNodes;
	var $conchild=$con.childNodes;
	var oldindex=0;
	var newindex=0;
	var start=setInterval(run,3000);
	$ul.addHandler("mouseover",function(){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		if(target.tagName=="LI"){
			newindex=target.index();
			change(oldindex,target.index())
			clearInterval(start)
		}
	})
	$ul.addHandler("mouseout",function(){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		if(target.tagName=="LI"){
			start=setInterval(run,3000);
		}
	})
	$con.addHandler("mouseover",function(){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		if(target.tagName=="IMG"){
			clearInterval(start)
		}
	})
	$con.addHandler("mouseout",function(){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		if(target.tagName=="IMG"){
			start=setInterval(run,3000);
		}
	})
	function change(_old,_now){
		if(_old!=_now){
			oldindex=_now;
		
				$conchild[_now].removeAttribute("class");
				$ulchild[_now].setAttribute("class","indet")
				$conchild[_old].setAttribute("class","none");
				$ulchild[_old].removeAttribute("class")
			}
		}
	function run(){
			if(newindex<$ulchild.length-1){
				newindex++;
			}else{
				newindex=0;
			}

	//轮播图左右键

	// 	$(".lunbo").children(".left").on("click",function(){
	// 	if(newindex>$ulchild.length-1){
	// 		newindex=$ulchild.length;
	// 	}else{
	// 		newindex--;
	// 		}

	// 	// alert("asf")
	// })
		change(oldindex,newindex)

	}
	
	$(".lunbo").children(".left").on("hover",function(){
		$(".l_img").fadeToggle("slow")
	
	})

	$(".lunbo").children(".right").on("hover",function(){
		$(".r_img").fadeToggle("slow")
		
	})

//选项卡
var tab_ul=document.querySelector(".tab_ul1");
var Cont=document.querySelector(".Con")
function tabchange(_ul,_con,type,act){
	var tab_ulchild=_ul.childNodes;
	var Contchild=_con.childNodes;

	_ul.addHandler(type,function(){
	var e=e||window.event;
	var target=e.target||e.srcElement;
	if(target.tagName==act){
		// console.log(target.index());
		show(target.index())
	}
})
	function show(_now){
		for(var i=0;i<tab_ulchild.length;i++){
			if(i==_now){
				tab_ulchild[_now].setAttribute("class","Li");
				Contchild[_now].removeAttribute("id","no");
			}else{
				tab_ulchild[i].removeAttribute("class","Li");
				Contchild[i].setAttribute("id","no");
			}
		}
	}
}
var tab_ul=document.querySelector(".tab_ul1");
var Cont=document.querySelector(".Con")
tabchange(tab_ul,Cont,"mouseover","LI")

var tab_ul2=document.querySelector(".tab_ul2");
var Cont2=document.querySelector(".Con2")
tabchange(tab_ul2,Cont2,"mouseover","LI")

var tab_ul3=document.querySelector(".tab_ul3");
var Cont3=document.querySelector(".Con3")
tabchange(tab_ul3,Cont3,"click","LI")


var tab_ul4=document.querySelector(".tab_ul4");
var Cont4=document.querySelector(".Con4")
tabchange(tab_ul4,Cont4,"click","LI")


//评价
var X=document.querySelector(".x");
var Xchild=X.childNodes;

	X.addHandler("click",function(){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		if(target.tagName=="IMG"){
			ss(target.index())
			clear(target.index())

		}
	})
	function ss(_now){
		for(var i=0;i<Xchild.length;i++){
			if(i<=_now){
				Xchild[i].setAttribute("src","images/r.png")	
			}	
		}
		
	}
	function clear(_del){
		for(var i=0;i<Xchild.length;i++){
			if(Xchild[i].getAttribute("src")=="images/r.png"){
				if(_del<i){
				Xchild[i].setAttribute("src","images/g.png")
				}
	}
}
			}
//  产生随即颜色
	function cnn(){
		var str="";
		for(var j=0;j<6;j++){
				var ttab=Math.round(Math.random()*15).toString(16);
				str=str+ttab;	
			}
			var _str="#"+str;
			return _str;
	}
	
	var Color=document.querySelector(".C_bg").childNodes;
	for(var i=0;i<Color.length;i++){
		Color[i].style.background=cnn();

	}		
		
		// 返回顶层
		
	var otop=window.innerHeight
	$(document).on("scroll",function(){
		var btop=$("body").scrollTop();
		console.log(otop,btop)
		if(btop>=otop){
			$(".oget").fadeIn("slow");
		}else
		if(btop<otop){
			$(".oget").fadeOut("slow");
		}
		var Top=document.querySelector(".oget");
		

		Top.onclick=function(){
			var t=setInterval(Click,50)
			function Click(){
			var h=parseInt(document.body.scrollTop||
				document.documentElement.scrollTop)
			if(h<1){
				clearInterval(t)
			}else{
				scrollTo(0,h/2)
				}
			}
	
		}	

	})
	

	


	var Img_top=$(".mid-right").offset().top;
		$(document).on("scroll",function(){
			var Top=$("body").scrollTop();	
			if(Top>=Img_top){
				$(".mid-right").css({
					position:"fixed",
					top:"0px",
					right:"74px",
				});
				
				
			}else
				if(Top<Img_top){
					$(".mid-right").css("position","");
				}
		})	
		//点击登录




		$(".denglu").on("click",function(){
			if($(".denglu").text()=="登录"){
			$(".box").css("display","block")
			$(".bgall").css("display","block");
			}
		})
		$(".bgall").on("click",function(){
			$(".box").css("display","none")
			$(this).css("display","none");

		})
		$(".del").on("click",function(){
			$(".box").css("display","none")
			$(".bgall").css("display","none");

		})
		
		$(".form").on("submit",function(){

			var u_name=$(".ur_name").val(),
			    u_pass=$(".pass").val(),
			    txt=$(".text");

			    

			  if(u_name==""){
			  	alert("请输入姓名");
			  	return false;
			  }
			  if(u_pass==""){
			  	alert("请输入密码");
			  	return false;
			  }
			  txt.text("正在登录，请稍后......");
			  $.ajax({
			  	type:"get",
			  	url:"http://www.hulupiao.com/index.php?r=api/login",
			  	data:{
			  		"user_name":u_name,
					"password":u_pass
			  	},
			  	dataType:"jsonp",
			  	success:function(data){
			  		console.log(data.success);
			  		if(data.success==1){
			  			txt.text("恭喜你,登录成功！")
			  			$(".box").css("display","none")
			  			$(".denglu").html(u_name+"你已登录！");
						$(".bgall").css("display","none");
						$(".back").show();
						$(".back").html("退出登录");
						$(".tot").show();
						$(".tot").html("登录成功");
						$.cookie("user_name",u_name,{"expires":dt})
						setTimeout(function(){$(".tot").hide()},1000)
			  		}if(data.success==0){
			  			txt.text("登录失败！请重新登录")
			  			$(".form")[0].reset();
			  			}
			  		}

			  	});
			return false;
		})
		var dt=new Date();
		dt.setTime(dt.getTime()+(3*60*1000))
		var acc=$.cookie("user_name");
		console.log(acc)
		if(acc!=undefined){
			$(".denglu").html(acc+"您好");
			$(".box").hide();
		}
		
		//点击退出登录
		$(".back").on("click",function(){
			$.removeCookie("user_name");
			if(acc==undefined){
					  	$(".denglu").html(acc+",您好！");
					}
			$(this).hide();
			$(".form")[0].reset();
			$(".denglu").html("登录");
			$(".text").text("")
			$(".tot").show();
			$(".tot").html("退出登录成功");
			setTimeout(function(){$(".tot").hide()},1000)
			
		})
	//点击注册
		$(".zhuce").on("click",function(){
			$(".box1").css("display","block")
			$(".bgall").css("display","block");
			
		})
		$(".del").on("click",function(){
			$(".box1").css("display","none")
			$(".bgall").css("display","none");

		})
		$(".bgall").on("click",function(){
			$(".box1").css("display","none")
			$(this).css("display","none");

		})
		$(".form1").on("submit",function(){
			var u_name=$(".ure_name").val(),
			    u_pass=$(".passs").val(),
			    u_spass=$(".spasss").val(),
			    u_age=$(".age").val(),
			    u_sex=$(".ur_sex:checked"),
			    txt=$(".Text");

			  if(u_name==""){
			  	alert("请输入姓名");
			  	return false;
			  }
			  if(u_pass==""||u_pass!=u_spass){
			  	alert("两次密码输入不一致，请重新输入");
			  	return false;
			  }
			   if(u_age==""){
			  	alert("请输入你的年龄");
			  	return false;
			  }
			  if(u_sex.length!=1){
			  	alert("请选择性别");
			  	return false;
			  }
			  txt.text("正在注册，请稍后......");
			  $.ajax({
			  	type:"get",
			  	url:"http://www.hulupiao.com/index.php?r=api/reg",
			  	data:{
			  		"user_name":u_name,
					"password":u_pass,
					"re_password":u_spass,
					"age":u_age,
					"sex":u_sex.val()
			  	},
			  	dataType:"jsonp",
			  	success:function(data){
			  		if(data.success==1){
			  			txt.text("恭喜你,注册成功！")
			  			$(".tot").show();
						$(".tot").html("注册成功");
						$(".bgall").css("display","none");
						$(".box1").hide();
						setTimeout(function(){$(".tot").hide()},1000)
						
						

			  		}if(data.success==0){
			  			txt.text("很抱歉,注册失败！请重新注册")
			  			$(".form1")[0].reset();

			  			}
			  		}

			  	});

			return false;
			
		})
	
