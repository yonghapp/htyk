// JavaScript Document
$(function(){
   var a = $(".d-j .num_data").html();
   var n = $(".f-w-f .num_data_hidden").html();
   var m = $(".s-l .num_data_hidden").html();
   var b = (Number(n*20/100)).toFixed(2);
   $(".f-w-f .num_data").html(b);
   // $("[name='service']").val()=b;//服务费
   // $("[name='all']").val()=(Number(b))+(Number(c))+(Number(z))-(Number(d));//总计
   var c = 0;
   // (Number(m*4/100)).toFixed(2);
   $(".s-l .num_data").html(c);
   // $("[name='taxrate']").val()=c;//税率
   var e = $(".yu-e .num_data").html();//余额
   var d = 0;
   var z = (Number(a)).toFixed(2)-(Number(e)).toFixed(2);
   $(".z-j .num_data").html((Number(b))+(Number(c))+(Number(z))-(Number(d)));
  $(".pay-msg .money-list .envelope .win").click(function(){
    $(".pay-msg .money-list .envelope .list").show();
  })
  $(".pay-msg .money-list .envelope .elem").click(function(){
     var hb_html = $(this).children(".num_data").html();
     var d = (Number(hb_html)).toFixed(2);
     // $("[name='red']").val()=d;
     //alert((Number(d)));
     $(".pay-msg .money-list .envelope .win span").html(hb_html);
     $(".pay-msg .money-list .envelope .list").hide();
     $(".z-j .num_data").html((Number(b))+(Number(c))+(Number(z))-d);
  })
})

/*$(function(){
  var a = $(".d-j").html();
  var b = 1000*20/100;
  var c = 1000*4/100;
  var d = $(".envelope .win").html();
  var e = $(".yu-e").html();
  var z = a.replace(/[^0-9]/ig,"")-d.replace(/[^0-9]/ig,"")-e.replace(/[^0-9]/ig,"");
  $(".z-j").children("span").html(b+c+z+'￥');
})*/