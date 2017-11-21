// JavaScript Document
$(function(){
  var script=document.createElement("script");  
  script.type="text/javascript";  
  script.src="js/jquery-1.5.1.js"; 
  $(document).ready(function(){
    var win_w = $(".cont-box").width();
    var cont_list = $(".main .cont-item-list");
    var cont_li = $(".main .cont-item-list li");
    var cont_pic = $(".main .cont-item-list li .pic");
    var n = cont_li.length;
    /*document.title = n;*/
    if(win_w > 1200){
       
      if(n==1){
         cont_pic.width(600 + "px"); 
         cont_pic.height(450+'px');
      }
      else if(n==2){
         cont_pic.width(445 + "px");
         cont_pic.height(300+'px');
      }
      else if(n==3){
         cont_pic.width(290 + "px"); 
         cont_pic.height(180+'px');
      }
      else if(n==4){
         cont_pic.width(445 + "px"); 
         cont_pic.height(300+'px');
      }
      else if(n==5){

            cont_li.eq(0).find(".pic").width(445 + "px");
            cont_li.eq(0).find(".pic").height(300+'px');
            cont_li.eq(1).find(".pic").width(445 + "px"); 
            cont_li.eq(1).find(".pic").height(300+'px');
            cont_li.eq(2).find(".pic").width(290 + "px"); 
            cont_li.eq(2).find(".pic").height(180+'px');
            cont_li.eq(3).find(".pic").width(290 + "px"); 
            cont_li.eq(3).find(".pic").height(180+'px');
            cont_li.eq(4).find(".pic").width(290 + "px"); 
            cont_li.eq(4).find(".pic").height(180+'px'); 

      }else{   
        cont_pic.width(290 + "px");
        cont_pic.height(180+'px'); 
      }
    }else{
      if(n==1){
         cont_pic.width(600 + "px"); 
         cont_pic.height(450+'px');
      }
      else if(n==2){
         cont_pic.width(295 + "px");
         cont_pic.height(200+'px');
      }
      else if(n==3){
         cont_pic.width(190 + "px"); 
         cont_pic.height(100+'px');
      }
      else if(n==4){
         cont_pic.width(295 + "px"); 
         cont_pic.height(200+'px');
      }
      else if(n==5){

            cont_li.eq(0).find(".pic").width(295 + "px");
            cont_li.eq(0).find(".pic").height(200+'px');
            cont_li.eq(1).find(".pic").width(295 + "px"); 
            cont_li.eq(1).find(".pic").height(200+'px');
            cont_li.eq(2).find(".pic").width(190 + "px"); 
            cont_li.eq(2).find(".pic").height(100+'px');
            cont_li.eq(3).find(".pic").width(190 + "px"); 
            cont_li.eq(3).find(".pic").height(100+'px');
            cont_li.eq(4).find(".pic").width(190 + "px"); 
            cont_li.eq(4).find(".pic").height(100+'px'); 

      }else{   
        cont_pic.width(190 + "px");
        cont_pic.height(100+'px'); 
      }
    }
  });
})