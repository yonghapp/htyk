// JavaScript Document
$(function(){
  $("#fb_no_style").click(function(){
    $(".cover-body").show();
    $(".enter-box").hide();
    $(".login-box").show();
    $(".password-back-win").hide();
    $(".password-modify-win").hide();
    $(".leave-word").hide();
  })
  $(".login").click(function(){
    $(".cover-body").show();
    $(".enter-box").show();
    $(".login-box").hide();
    $(".password-back-win").hide();
    $(".password-modify-win").hide();
    $(".leave-word").hide();
  })
  $(".cover-body-bg").click(function(){
    $(".cover-body").hide();
  })
  $(".login-link").click(function(){
    $(".enter-box").hide();
    $(".login-box").show();
    $(".leave-word").hide();
  })
  $(".password-back-link").click(function(){
    $(".enter-box").hide();
    $(".login-box").hide();
    $(".password-back-win").show();
    $(".leave-word").hide();
  })
  $(".emailWay").click(function(){
    $(".phoneWay").show();
    $(".phone-way input[name='myphone']").hide();
    $(".phone-way .phone-val").hide();
    $(".phone-way .icon").hide();
    $(this).hide();
    $("#yanzhenma").hide();
    $("#yanzhenlink").show();
    $(this).next("input").show();
    $(".email-way .icon").show();
    $(".phone-way").before($(".email-way"));
  })
  $(".phoneWay").click(function(){
    $(".emailWay").show();
    $(".email-way input").hide();
    $(".email-way .icon").hide();
    $(this).hide();
    $("#yanzhenma").show();
    $("#yanzhenlink").hide();
    $(this).next("input").show();
    $(".phone-way .phone-val").show();
    $(".phone-way .icon").show();
    $(".email-way").before($(".phone-way"));
  })
  $(".password-modify-link").click(function(){
    $(".cover-body").show();
    $(".enter-box").hide();
    $(".login-box").hide();
    $(".password-back-win").hide();
    $(".password-modify-win").show();
    $(".leave-word").hide();
  })
})