// JavaScript Document
$(function(){

  var bannerLength = $(".banner_wrap .item").length;
  var n = 0;
  
  function lightCreat() {
   
    var liAdd = '<span></span>';
    if(n<bannerLength-1){
          n = n + 1;
        }else{
          n = 0;
        }
    var lightLength = $(".indexBanner_num span").length;
    do{
        
      $(".indexBanner_num").append(liAdd);
      var lightLength = $(".indexBanner_num span").length;
    }
    while(lightLength < bannerLength);
    /*Run();*/
  }
  lightCreat();
  
  $(".indexBanner_num span").eq(0).addClass("on");
  $("#banner_index li").eq(1).css({"left":100+'%'});
 $(".prev").click(function(){
    if(bannerLength > 1){ 
        $("#banner_index li:last").css({"left":-100+'%'});
        $(".banner_wrap").animate({left: 100+'%'},600,function(){
          if(n>0){
            n = n - 1;
          }else{
            n = bannerLength-1;
          }
          $(".indexBanner_num span").removeClass("on");
          $(".indexBanner_num span").eq(n).addClass("on");
          $("#banner_index").css({left:0});
          $("#banner_index li").css({left:0});
          $("#banner_index li:first").before($("#banner_index li:last"));
          
        })
    }
    
  })
  
  $(".next").click(function(){
    if(bannerLength > 1){ 
        $("#banner_index li").eq(1).css({"left":100+'%'});
        $(".banner_wrap").animate({left: -100+'%'},600,function(){
          if(n<bannerLength-1){
            n = n + 1;
          }else{
            n = 0;
          }
          $(".indexBanner_num span").removeClass("on");
          $(".indexBanner_num span").eq(n).addClass("on");
          $("#banner_index").css({left:0});
          $("#banner_index li").css({left:0});
          $("#banner_index li:last").after($("#banner_index li:first"));
          
        })
    }
    
  })
  
  function Run(){
    if(bannerLength > 1){ 
        $("#banner_index li").eq(1).css({"left":100+'%'});
        $(".banner_wrap").animate({left: -100+'%'},600,function(){
          if(n<bannerLength-1){
            n = n + 1;
          }else{
            n = 0;
          }
          $(".indexBanner_num span").removeClass("on");
          $(".indexBanner_num span").eq(n).addClass("on");
          $("#banner_index").css({left:0});
          $("#banner_index li").css({left:0});
          $("#banner_index li:last").after($("#banner_index li:first"));
          
        })
    }
  }
  
  var bannerMove = setInterval(Run,5000);
  $("#slider").mouseover(function(){
      clearInterval(bannerMove)
   })
  $("#slider").mouseout(function(){
      bannerMove = setInterval(Run,5000);
  })
})