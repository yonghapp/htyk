// JavaScript Document
$(function(){
  //$(".dialogue-part").first().show();
  $(".one-friend").click(function(){
    // var n = $(this).index();
    // var part_n = $(".dialogue-part").eq(n);
    // var part_length = part_n.length;
    //document.title = part_n;
    $(".one-friend").removeClass("active");
    $(this).addClass("active");
    // if(part_length < 1){
    //   $(".dialogue-part").hide().eq(n-1).show();
    // }else{
    //   var part_num = part_n.index(this);
    //   $(".dialogue-part").hide().eq(part_num).show();
    // }
  })
})

$(function(){
	var width_11 = $(".messageBoxMobile .dialogue-in").width();
    var width_22 = width_11-72;
    var height_11 = $(".messageBoxMobile .dialogue-area").height();
    var height_22 = height_11-154;
    //alert(width_11)
	$(".messageBoxMobile .dialogue-in input").width(width_22);
    $(".messageBoxMobile .dialogue-area .dialogue-win").height(height_22);
    $(".messageBoxMobile .dialogue-area .systemMsgBox").height(height_22);
    $("input[type='text']").focus(function(){
      var height_11 = $(".messageBoxMobile .dialogue-area").height();
      var height_22 = height_11-154;
      $(".messageBoxMobile .dialogue-area .dialogue-win").height(height_22);
      $(".messageBoxMobile .dialogue-area .systemMsgBox").height(height_22);
    })

    $(document).click(function(){
      if($(".systemMsg").hasClass("active")){          
        $(".messageBoxMobile .dialogue-in input").hide();
        $(".messageBoxMobile .dialogue-in button").hide();
      }else{
        $(".messageBoxMobile .dialogue-in input").show();
        $(".messageBoxMobile .dialogue-in button").show();
      }
    })
})

$(function(){

  $(".messageBoxMobile .one-friend").click(function(){
    $(".messageBoxMobile").animate({marginLeft:-100+"%"});
  })
  
  $(".messageBoxMobile .dialogue-in .back").click(function(){
    $(".messageBoxMobile").animate({marginLeft:0});
  })
  
  $(".back-close").click(function(){
    self.location=document.referrer;
  })
  
})
