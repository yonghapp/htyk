// JavaScript Document

$(function(){     
    $("#select-lang-f .lang").toggle(
      function(){
        $(this).next(".lang-list").show();
      },
      function(){
        $(this).next(".lang-list").hide();
      }
    );
})

$(function(){
    $(".option-win").click(function(){
        $(this).next(".option-list").toggle();
    });       
    $(".option-list li").click(function(){
      $(this).siblings().removeClass("selected");
      $(".option-list").hide();
      $(this).addClass("selected");
      var option_text = $(this).text();
      $(this).parents(".select-c").find(".option-win span").text(option_text);
      
      //区域传值方法
      postArea();
    });    
});

$(function(){   
    $(".phone-win").click(function(){
        $(this).next(".phone-list").toggle();
    });       
    $(".phone-list li").click(function(){
      $(this).siblings().removeClass("selected");
      $(".phone-list").hide();
      $(this).addClass("selected");
      var option_text_span = $(this).children().text();
      $(this).parents(".phone-val").find(".phone-win input").val(option_text_span);
      
    });
    $(".shoudong").click(function(){
      $(".phone-win input[type='text']").focus();
      $(".phone-list").hide();
      $(this).parents(".phone-val").find(".phone-win input").val("");
    })    
});

$(function(){
  $(".nav-pc .message .tit").click(function(){
    $(".nav-pc .message .msg-list").toggle();
  })
})

