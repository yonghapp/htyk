messageApp
    .controller('messageController', ['$scope', '$http', '$q', 'util', 'initData', function ($scope, $http, $q, util, initData) {

        // 初始化默认聊天对象窗口相关信息
        $scope.currentDialogueID = initData.currentDialogueID;
        $scope.currentToUserID = initData.currentToUserID;
        $scope.currentDialogueList = [];
        $scope.currentMessageList = [];
        $scope.messageWillSend = '';

        // 初始化 IM 窗口当前所处的环境(内嵌/独立页)
        $scope.isInFrame = window.top === window;
        /*$scope.isMobile = util.isMobile();*/
        $scope.isPageFirstLoad = true;

        // 初始化 显示/查看更多 历史消息记录所需相关信息
        $scope.needScroll = true;
        $scope.isLoading = false;
        $scope.oldestRecordID = '';

        // IM 操作行为预定义
        $scope.ACTION_DIALOGUE_INIT = 'ACTION_DIALOGUE_INIT'; // 页面加载时, 对话框第一次初始化 (每次页面刷新前只会执行一次)
        $scope.ACTION_DIALOGUE_SWITCH = 'ACTION_DIALOGUE_SWITCH'; // 切换对话框
        $scope.ACTION_NEW_DIALOGUE = 'ACTION_NEW_DIALOGUE'; // 新建空对话
        $scope.ACTION_SEND_MESSAGE_SUCCESS = 'ACTION_SEND_MESSAGE_SUCCESS'; // 发送单条消息成功
        $scope.ACTION_SHOW_HISTORY = 'ACTION_SHOW_HISTORY'; // 在消息窗口中, 向上滚动到顶部, 触发显示更多历史消息的事件
        $scope.STATUS_UNREAD = 2; // 用来表示当前对话的未读状态
        $scope.STATUS_HASREAD = 1; // 用来表示当前对话已读

        // 移动端动画等交互
        $scope.dialogueView = true;
        $scope.messageView = false;

        // 移动端 - 从 url 上接收数据
        $scope.objURL = util.parseURL(location.href);
        $scope.parentWindowMessage = $scope.objURL.params['parentWindowMessage'];
        if (typeof $scope.parentWindowMessage !== 'undefined') {
            $scope.parentWindowMessage = JSON.parse(decodeURIComponent($scope.parentWindowMessage));
        }

        $scope.newDialogue = function (messageData) {
            // 查询对话列表是否已经存在与此人的对话框
            var hasCurrentDialogue = false,
                currentDialogue = {},
                currentDialogueIndex = 0;
            angular.forEach($scope.currentDialogueList, function (item, index) {
                if (item.userid === messageData.userInfo.userid) {
                    hasCurrentDialogue = true;
                    currentDialogue = item;
                    currentDialogueIndex = index;
                    return false;
                }
            });

            // 如果已经存在当前对话框, 则切换过去
            if (hasCurrentDialogue) {
                $scope.switchTo(currentDialogueIndex, currentDialogue);
            } else {
                // 如果不存在, 则根据传递过来的信息, 创建一个 "离线的" 新的对话框实例 (离线意味着: 如果没有在此对话框里发送消息, 则此对话框并不会在云端保存)
                var currentDialogueItem = messageData.userInfo;
                currentDialogueItem.status = $scope.STATUS_HASREAD; // 默认总是已读, 因为当打开IM时, 会自动切换到当前的对话框
                /*var currentDialogueItem = {
                 id: '',
                 userid: messageData.userInfo.userid,
                 headpic: messageData.userInfo.headpic,
                 uname: messageData.userInfo.uname,
                 sex: messageData.userInfo.sex,
                 career: messageData.userInfo.career,
                 status: $scope.STATUS_HASREAD // 默认总是已读, 因为当打开IM时, 会自动切换到当前的对话框
                 };*/
                $scope.currentDialogueList.unshift(currentDialogueItem);
                $scope.switchTo(0, currentDialogueItem)
            }
            $scope.$apply();
        };

        $scope.loadCurrentDialogueData = function (actionName) {
            var deferred = $q.defer();
            if (!$scope.isLoading) {
                $scope.isLoading = true;

                // 如果是本地新建的空对话, 还没有发送任何消息, 则暂时不做任何请求
                if (!$scope.currentDialogueID) {

                    if ($scope.parentWindowMessage) {
                        setTimeout(function () {
                            $scope.newDialogue($scope.parentWindowMessage);
                            $scope.parentWindowMessage = '';
                        }, 0);
                    }

                    $scope.currentMessageList = [];
                    $scope.currentToUserName = $scope.currentDialogueList[$scope.currentDialogueIndex].uname;

                    if (!$scope.isInFrame) {
                        setTimeout(function () {
                            document.getElementById('message-will-send').focus()
                        }, 0);
                    }

                    $scope.isLoading = false;
                    deferred.resolve();
                } else {
                    // 如果当前操作行为是显示历史消息, 则更新最老那条消息的边界 ID
                    if (typeof actionName === 'undefined') {
                        actionName = $scope.ACTION_SHOW_HISTORY;
                        if ($scope.currentMessageList[0]) {
                            $scope.oldestRecordID = $scope.currentMessageList[0].id || '';
                        }
                    }

                    util.awesomePost('/index.php/Home/Message/getMsgRecord', {
                        dialogueid: $scope.currentDialogueID,
                        id: $scope.oldestRecordID
                    }, {
                        /*sendByFormData: true,*/
                        successCallback: function (response) {

                            switch (actionName) {
                                case $scope.ACTION_DIALOGUE_INIT:
                                    // 初始化新的对话框: 重置整个消息体
                                    $scope.currentMessageList = [];
                                    $scope.currentMessageList = response.data.reverse();
                                    $scope.currentDialogueList[0].status = $scope.STATUS_HASREAD; // 将当前切换到的对话框已读状态设置为已读
                                    break;
                                case $scope.ACTION_DIALOGUE_SWITCH:
                                    // 切换了新的对话框: 重置整个消息体
                                    $scope.currentMessageList = [];
                                    $scope.currentMessageList = response.data.reverse();
                                    $scope.currentDialogueList[$scope.currentDialogueIndex].status = $scope.STATUS_HASREAD; // 将当前切换到的对话框已读状态设置为已读
                                    break;
                                case $scope.ACTION_SHOW_HISTORY:
                                    // 显示历史聊天记录: 将新的消息体拼接在前面
                                    $scope.currentMessageList = response.data.reverse().concat($scope.currentMessageList);
                                    break;
                                case $scope.ACTION_SEND_MESSAGE_SUCCESS:
                                    // 发送消息成功时, 发送消息接口会返回最近发送成功的这条消息对象, 已经在发送成功的回调函数里直接拼上了, 所以不需要再额外做一次 load 请求
                                    /*$scope.currentMessageList.push(response.data[0]);*/
                                    break;
                                default:
                                    console.error('没有匹配到 action, 请检查.');
                                    break;
                            }

                            /*// 初始化当前对话中消息的已读状态
                             angular.forEach($scope.currentMessageList, function (item, context) {
                             if ($scope.currentToUserID === item.userid) { // TODO: 一个对话框中如果对方没有回复一句话, 那么将无法拿到这个人的 昵称&头像 之类的所有信息, 显示会出现问题. - 已解决: 从对话列表上拿 currentDialogueList[currentDialogueList]
                             $scope.currentToUserName = item.uname;
                             return false;
                             }
                             });*/

                            $scope.currentToUserName = $scope.currentDialogueList[$scope.currentDialogueIndex].uname;

                            // 自动滚动到底部的最新消息处
                            if ($scope.needScroll) {
                                setTimeout(function () {
                                    angular.element('.message-panel').scrollTop(100000);
                                }, 0)
                            }

                            if (!$scope.isInFrame) {
                                setTimeout(function () {
                                    document.getElementById('message-will-send').focus()
                                }, 0);
                            }

                            $scope.isLoading = false;
                            deferred.resolve();
                        },
                        errorCallback: function (err) {
                            $scope.isLoading = false;
                        }
                    })

                    ;
                }

            } else {
                deferred.reject();
            }
            return deferred.promise;
        };

        /**
         * 加载当前对话框的聊天数据
         * @param actionName 当前的操作行为来源: init=对话框内容初始化 / switch=切换到新对话 / send=发送消息成功后
         */
        $scope.loadCurrentPageData = function (actionName) {

            if ($scope.isPageFirstLoad) {
                // 页面加载时, 初始化对话框列表(默认初始化第一个对话框)
                util.awesomePost('/index.php/Home/Message/getDialogueList', {}, {
                    successCallback: function (response) {
                        $scope.isPageFirstLoad = false;

                        // 初始化对话框列表
                        $scope.currentDialogueList = response.data;

                        if ($scope.parentWindowMessage) {
                            setTimeout(function () {
                                $scope.newDialogue($scope.parentWindowMessage);
                                $scope.parentWindowMessage = '';
                            }, 0);
                        }

                        // 由于后端的 "消息未读/已读逻辑" 是: 只要请求相关对话的消息记录列表成功, 则默认标记对应对话框的消息为已读
                        // 所以, 父窗口首次加载时, 默认不加载具体对话框里的消息列表,
                        // 只有当需要展示对话框(点击头部的聊天窗口按钮)时, 再去加载默认的第一个对话框里的消息数据
                    }
                });
            } else {
                $scope.loadCurrentDialogueData(actionName); // 如果没有提供 actionName 则默认为是 scroll 插件触发的
            }

        };

        // 页面首次加载时, 自动加载当前页数据
        $scope.loadCurrentPageData($scope.ACTION_DIALOGUE_INIT);

        $scope.switchTo = function (index, currentDialogue) {
            // 更新当前对话的 ID 以及对方用户的 ID
            $scope.currentDialogueID = currentDialogue.id;
            $scope.currentToUserID = currentDialogue.userid;
            $scope.currentDialogueIndex = index;
            $scope.needShowProfile = currentDialogue.flag1;

            // 初始化聊天列表数据
            $scope.oldestRecordID = '';
            $scope.messageWillSend = '';
            /*$scope.currentMessageList = [];*/

            // 加载新数据
            $scope.loadCurrentPageData($scope.ACTION_DIALOGUE_SWITCH);

            // 如果是移动端, 则显示消息列表窗口
            if ($scope.isInFrame) {
                $scope.changeToMessageView();
            }

        };

        $scope.onPressEnter = function (e) {
            if (e.keyCode == 13) {
                $scope.sendMessage();
            }
        };

        $scope.sendMessage = function () {

            if ($scope.messageWillSend.length <= 0) {
                return false
            }

            util.awesomePost('/index.php/Home/Message/sendMsg', {
                content: $scope.messageWillSend.toString(),
                touserid: $scope.currentToUserID
            }, {
                /*sendByFormData: true,*/
                successCallback: function (response) {
                    $scope.needScroll = true;

                    // 发送消息成功时, response 里会返回最后一条发送成功的消息对象, 用于直接 push 到消息体尾部.
                    $scope.currentMessageList.push(response.data);

                    // 如果发送消息成功时, 当前的对话 ID 为空, 则认为这次操作创建的新的会话, 将返回的会话 ID 赋值给新创建的这段会话对象.
                    if (typeof $scope.currentDialogueID === 'undefined') {
                        var currentDialogueItem = {};
                        angular.forEach($scope.currentDialogueList, function (item) {
                            if (item.userid === response.data.touserid) {
                                item.id = response.data.dialogueid;
                                $scope.currentDialogueID = item.id;
                                currentDialogueItem = item;
                                return false;
                            }
                        });
                        //$scope.loadCurrentPageData($scope.ACTION_SEND_MESSAGE_SUCCESS);
                    } else {
                        // 否则就按正常的发送消息逻辑
                        //$scope.loadCurrentPageData($scope.ACTION_SEND_MESSAGE_SUCCESS);
                    }

                    // 自动滚动到底部的最新消息处
                    if ($scope.needScroll) {
                        setTimeout(function () {
                            angular.element('.message-panel').scrollTop(100000);
                        }, 0)
                    }

                    if (!$scope.isInFrame) {
                        setTimeout(function () {
                            document.getElementById('message-will-send').focus()
                        }, 0);
                    }

                }
            });
            $scope.messageWillSend = '';
        };

        window.addEventListener('message', function (event) {
            var messageData = JSON.parse(event.data);
            if (messageData.action === 'newDialogue') {
                $scope.newDialogue(messageData);
            }
        });

        $scope.deleteDialogue = function (currentIndex) {
            // delDialogue  dialogueid

            // 如果是临时创建的对话框, 则不需要向后端请求
            if (typeof $scope.currentDialogueList[currentIndex].id === 'undefined') {
                if ($scope.currentDialogueIndex === currentIndex) {
                    $scope.currentMessageList = [];
                    $scope.currentToUserName = '';
                    $scope.needShowProfile = false;
                }
                $scope.currentDialogueList.splice(currentIndex, 1);
            } else {
                util.awesomePost('/index.php/Home/Message/delDialogue', {
                    dialogueid: $scope.currentDialogueList[currentIndex].id
                }, {
                    /*sendByFormData: true,*/
                    successCallback: function (response) {

                        debugger

                        if ($scope.currentDialogueIndex === currentIndex) {
                            $scope.currentDialogueIndex = 0;
                        } else if ($scope.currentDialogueIndex > currentIndex) {
                            if($scope.currentDialogueIndex !== 0){
                                $scope.currentDialogueIndex--;
                            }
                        }

                        console.info('当前要移除的 index => ', currentIndex);
                        console.info('当前要改变的 $scope.currentDialogueIndex => ', $scope.currentDialogueIndex);

                        $scope.currentDialogueList.splice(currentIndex, 1);

                        // 如果对话框数量为2个或2个以上, 则可以直接切换
                        if ($scope.currentDialogueList.length >= 1) {
                            debugger
                            setTimeout(function () {
                                $scope.switchTo($scope.currentDialogueIndex, $scope.currentDialogueList[$scope.currentDialogueIndex]);
                            }, 0);
                        } else {
                            debugger
                            // 重置右侧
                            $scope.currentMessageList = [];
                            $scope.currentToUserName = '';
                            $scope.needShowProfile = false;
                        }
                    }
                })
            }
        };

        $scope.hideMessageWindow = function () {
            window.parent.hideMessageWindow();
        };

        $scope.changeToDialogueView = function () {
            $scope.dialogueView = true;
            $scope.messageView = false;
        };

        $scope.changeToMessageView = function () {
            $scope.dialogueView = false;
            $scope.messageView = true;
        };

    }])
    .factory('util', ['$http', '$rootScope', '$compile', '$location', '$httpParamSerializerJQLike', 'dialog', function ($http, $rootScope, $compile, $location, $httpParamSerializerJQLike, dialog) {

        var util = this;

        util.baseDomain = ''; // http://admin.inviteapp.cn';

        /**
         * 判断给出的 path 前缀是否等于当前 url 上的 path 前缀, 如: 当前页面为 operation-user, isCurrentPrefix('operation-') 应返回 true
         * @param path 要进行判断的地址
         * @returns {boolean} true 为等于当前 path 地址, false 为不等于当前 path 地址
         */
        util.isCurrentPrefix = function (path) {
            return $location.path().indexOf(path) !== -1;
        };

        /**
         * 判断给出的 path 是否等于当前 path 地址(域名 http://xxx.com/# 后面的 /foo/bar 以及 ?a=1&b=2#xxx 之前的部分)
         * @param path 要进行判断的地址
         * @returns {boolean} true 为等于当前 path 地址, false 为不等于当前 path 地址
         */
        util.isCurrentPage = function (path) {
            return path === $location.path();
        };

        /**
         * 判断给出的 url 是否等于当前 url 地址(域名 http://xxx.com/# 后面的 /foo/bar?a=1&b=2#xxx 部分)
         * @param url 要进行判断的地址
         * @returns {boolean} true 为等于当前 url 地址, false 为不等于当前 url 地址
         */
        util.isCurrentURL = function (url) {
            return url === $location.$$url;
        };

        /**
         * angular 动态添加 DOM
         * @param strDOMFragment {string} 要添加的 DOM 字符串
         */
        util.generateNGDOM = function (strDOMFragment) {
            return $compile(angular.element(strDOMFragment))($rootScope);
        };

        /**
         * 整合了大部分基础交互的 ajax 通信工具库
         * @param url {string} 接口地址
         * @param data {object=} 要向接口发送的数据
         * @param options {object=} 一些不常用的可扩展配置项都在这里:
         *          sendByFormData {boolean=} 是否修改为 form-data 的方式, eg. 在 PHP 下通过 $POST['xxx'] 接收数据的话, 需要使用这种方式
         *          successCallback {function=} 成功回调
         *          errorCallback {function=} 错误回调
         */
        util.awesomePost = function (url, data, options) {

            // 如果是本地调试, 则自动加上线上环境的 base domain
            if (/0\.0\.0\.0|localhost|127\.0\.0\.1|10\..*/.test(location.hostname) === true && !/http(|s)/.test(url)) {
                url = util.baseDomain + url;
            }

            // loading提示层
            var dialogLoading = dialog.showLoading();

            // 通过 formData 的形式发送数据
            if (options && options.sendByFormData) {

                $http({
                    url: url,
                    method: 'POST',
                    data: $httpParamSerializerJQLike(data || {}),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                // 后端返回数据
                    .success(function (response) {
                        dialogLoading.close();

                        if (response.ret !== true) {
                            dialog.showHint(response.msg);
                            /*alert(response.msg);*/
                            return false;
                        }

                        options && options.successCallback(response);

                    })
                    // 后端返回异常 不关闭手机号对话框
                    .error(function (responseError) {
                        dialogLoading.close();

                        if (options && options.errorCallback) {
                            options.errorCallback(responseError);
                        } else {
                            dialogLoading.close();

                            dialog.showHint('<p>啊哦~ 服务器好像有点忙, 请稍后再试...</p>');
                            /*alert('啊哦~ 服务器好像有点忙, 请稍后再试...');*/
                            console.error(responseError);
                        }
                    });
            }

            // 如果没有特别声明 - 则默认以 JSON 形式发送 data
            else {

                $http.post(url, data || {})
                // 后端返回数据
                    .success(function (response) {
                        dialogLoading.close();

                        if (response.ret !== true) {
                            dialog.showHint(response.msg);
                            /*alert(response.msg);*/
                            return false;
                        }

                        options && options.successCallback(response);
                    })
                    // 后端返回异常
                    .error(function (responseError) {
                        dialogLoading.close();

                        if (options && options.errorCallback) {
                            options.errorCallback(responseError);
                        } else {
                            dialog.showHint('<p>啊哦~ 服务器好像有点忙, 请稍后再试...</p>');
                            /*alert('啊哦~ 服务器好像有点忙, 请稍后再试...');*/
                            console.error(responseError);
                        }
                    });

            }

        };

        /**
         * 判断是否是移动端, 如果是则返回 true, 反之 false
         * @param ua= 可选
         * @returns {boolean}
         */
        util.isMobile = function (ua) {
            if (!ua && typeof navigator != 'undefined') ua = navigator.userAgent;
            if (ua && ua.headers && typeof ua.headers['user-agent'] == 'string') {
                ua = ua.headers['user-agent'];
            }
            if (typeof ua != 'string') return false;

            return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
        };

        /**
         * 获取url中的各个部分
         * @param  {[type]} url [url地址]
         * @return {[type]}     [返回url各部分的对象]
         */
        util.parseURL = function (url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        };

        return util;

    }])
    .factory('dialog', ['$http', function ($http) {

        var inviteDialog = this;

        /**
         * 弹窗 loading
         * @param content [可选]弹窗中要显示的提示文本, 如: 加载中..., 如果没有定义, 则显示默认的loading图标
         * @returns {*} 返回当前弹窗的实例, 一般用于加载完成后 .close()
         */
        inviteDialog.showLoading = function (content) {
            var loadingDialog = dialog({
                fixed: true
            });
            if (content) {
                loadingDialog.options.content = content
            }
            loadingDialog.showModal();
            return loadingDialog;
        };

        /**
         * 弹窗 提示框
         * @param content [可选] 弹窗中要显示的提示文本, 如: 操作成功!, 如果没有定义, 则显示默认的loading图标
         * @param time [可选] 弹窗停留的时间, 默认为3秒
         * @param allowQuickClose [可选] 弹窗是否可以通过点击背景层来关闭
         */
        inviteDialog.showHint = function (content, time, allowQuickClose) {
            var hintDialog = dialog({
                content: content,
                quickClose: typeof allowQuickClose == 'undefined',
                fixed: true
            });
            hintDialog.showModal();
            setTimeout(function () {
                hintDialog.close().remove();
            }, time || 3000);
        };

        /**
         * 气泡 提示框
         * @param content 气泡弹窗中要显示的提示文本, 如: 操作成功!, 如果没有定义, 则显示默认的loading图标
         * @param trigger 气泡显示依据哪个DOM元素
         * @param onshow [可选] 显示气泡弹窗时的回调函数
         * @param onclose [可选] 显示气泡弹窗时的回调函数
         */
        inviteDialog.showBubble = function (content, trigger, onshow, onclose) {
            var d = dialog({
                content: content,
                align: 'bottom',
                quickClose: true
            });
            if (onshow) {
                d.onshow = onshow;
            }
            if (onclose) {
                d.onclose = onclose;
            }
            d.show(trigger[0]);
        };

        /**
         * 确认取消提示框
         * @param title {string=} 弹窗标题
         * @param content {string=} 弹窗中要显示的提示文本, 如: 操作成功!, 如果没有定义, 则显示默认的loading图标
         * @param callback {function=} 回调函数
         */
        inviteDialog.showConfirm = function (title, content, callback) {
            var d = dialog({
                title: title || '提示',
                content: content || '',
                okValue: '确定',
                ok: callback || function () {
                },
                cancelValue: '取消',
                cancel: function () {
                }
            });
            d.showModal();
            return d;
        };

        /**
         * 弹窗 单按钮模态提示框
         */
        inviteDialog.showAlert = function (content, title, buttonValue, callback) {

            var dialogConfig = {
                quickClose: true,
                fixed: true,
                content: content,
                title: title || ' ',
                okValue: buttonValue || '知道了',
                ok: callback || function () {

                }
            };

            dialog(dialogConfig).showModal();
        };

        return inviteDialog;
    }]);
