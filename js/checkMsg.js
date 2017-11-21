// 初始化新消息提醒, 用来判断是否显示新消息气泡提示 (new)
bShowHide();

/**
 * 头部 - "聊天窗口" 按钮点击事件监听
 */
$(".chatWindown").click(function () {
    $(".nav-pc .message .msg-list").hide();
    $(this).children("em").remove();
    bShowHide();
    var uid = $(".head-name").attr("userid");
    if (uid == "") {
        $(".login").click();
    } else {
        if ($(window).width() > 1200) {
            $.cookie('isMobile', 0, {expires: 1, path: '/'});
            //letwechat();
        } else {
            $.cookie('isMobile', 1, {expires: 1, path: '/'});
        }
        letwechat();
    }
});

/**
 * 弹窗展示 "聊天窗口"
 */
function letwechat() {
    var url = "/index.php/Home/Message/index.html";
    if ($.cookie('isMobile') == 1) {
        location.href = url + '?deviceType=mobile';
        return 0;
    }
    /*$.post('/index.php/home/Wellceechat.html', {param: '1'}, function (data) {
     })
     layer.open({
     type: 2,
     title: ' ',
     area: ['855px', '530px'],
     fixed: true, //可拖动
     shade: false,
     content: url,
     end: function () {
     $.post('/index.php/home/Wellceechat/out_line.html', {param: '1'})
     }
     });*/
    showMessageWindow(true);
}

/**
 * 头部 - "系统消息" 按钮点击事件监听
 */
$(".systemMsg").click(function () {
    $(this).children("em").remove();
    $(".nav-pc .message .msg-list").hide();
    bShowHide();
    var uid = $(".head-name").attr("userid");
    if (uid == "") {
        $(".login").click();
    } else {
        if ($(window).width() > 1200) {
            $.cookie('isMobile', 0, {expires: 1, path: '/'});
            //letwechat();
        } else {
            $.cookie('isMobile', 1, {expires: 1, path: '/'});
        }
        letwechat1();
    }
})

/**
 * 弹窗展示 "系统消息"
 */
function letwechat1() {
    var url = "/index.php/Home/User/systemMsgBox.html";
    if ($.cookie('isMobile') == 1) {
        location.href = url;
        return 0;
    }
    $.post('/index.php/home/Wellceechat.html', {param: '1'}, function (data) {
    })
    layer.open({
        type: 2,
        title: ' ',
        area: ['585px', '530px'],
        fixed: true, //可拖动
        shade: false,
        content: url,
        end: function () {
            $.post('/index.php/home/Wellceechat/out_line.html', {param: '1'})
        }
    });
}

/**
 * 初始化新消息提醒, 用来判断是否显示新消息气泡提示 (new)
 */
function bShowHide() {
    var em_l = $(".nav-pc .message .msg-list .msg-li em").length;
    if (em_l > 0) {
        $(".nav-pc .message .tit b").show();
    } else {
        $(".nav-pc .message .tit b").hide();
    }
}

//function mobileMsgBox(){

//location.href = "/index.php/Home/User/messageBoxMobile.html?is";
//}