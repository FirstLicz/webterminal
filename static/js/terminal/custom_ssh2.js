/*
*  ssh2 页面 文件操作
*
* */

$(function () {
    var term = new Terminal({
        // cursorStyle: 'underline', //光标样式
        cursorBlink: true, // 光标闪烁
        convertEol: true, //启用时，光标将设置为下一行的开头
        disableStdin: false, //是否应禁用输入。
        theme: {
            foreground: 'yellow', //字体
            background: '#060101', //背景色
            cursor: 'help',//设置光标
            lineHeight: 20,
            fontSize: 18,
        },
    });
    var terminal = document.getElementById('terminal');
    console.log("height = " + window.innerHeight)
    console.log("width = " + window.innerWidth)
    term.resize(parseInt(left_div.width() / 9), parseInt(window.innerHeight / 17))
    // 初始化
    term._initialized = true;
    // 创建 websocket
    var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
    var url = ws_scheme + "://127.0.0.1:8000/ws/terminal/" + window.session_id + "/?room_id=" + room_id
    var ws = new WebSocket(url);
    var fitAddon = new FitAddon.FitAddon()
    var attachAddon = new AttachAddon.AttachAddon(ws)
    term.loadAddon(attachAddon)/**/
    term.loadAddon(fitAddon)
    term.open(terminal);
    term.focus()

    let zsentry = new Zmodem.Sentry({
        to_terminal: function (octets) {
        },  //i.e. send to the terminal

        on_detect: function (detection) {
            let zsession = detection.confirm();
            let promise;
            console.log("zsession.type = " + zsession.type)
            if (zsession.type === "receive") {
                promise = downloadFile(zsession);
            } else if (zsession.type === "send") {
                promise = uploadFile(zsession);
            }
            promise.catch(console.error.bind(console)).then(() => {
                //
            });
            console.log(promise)
        },

        on_retract: function () {
        },
        sender: function (octets) {
            console.log(octets)
            ws.send(new Uint8Array(octets))
        },
    });
    // 页面加载好，进行设定
    window.file_list_scroll.css({
        "height": $("#right_div").height() - window.file_list_scroll.position().top - 20
    })
    console.log(files_display.height())
    window.onresize = function () { // 窗口尺寸变化时，终端尺寸自适应
        // 发送 窗口 改变大小
        term.resize(parseInt(left_div.width() / 9), parseInt(window.innerHeight / 17))
        fitAddon.fit()
        console.log("window.innerHeight = " + window.innerHeight)
        // 改变滚动窗口的高度
        window.file_list_scroll.css({
            "height": window.innerHeight - window.file_list_scroll.position().top
        })
        ws.send(JSON.stringify(["resize", terminal.offsetWidth, terminal.offsetHeight])); // 将消息发出
    }
    // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    ws.onopen = function () {
        // 当 websocket 创建成功时，触发事件
        console.log("open websocket")
        ws.send(JSON.stringify(["onopen", terminal.offsetWidth, terminal.offsetHeight])); // 将消息发出
    }
    ws.onmessage = function (event) {
        console.log(event.data)
        if (window.load_flag) {
            // 获取文件列表
            window.file_list("/", "ls");
            window.load_flag = false;
        }
        if (typeof (event.data) === 'string') {
            // term.write(event.data)
        } else {
            zsentry.consume(event.data);
        }
    }
    ws.onclose = function (event) {
        console.log(event)
    }
    ws.onerror = function (event) {
        console.log(event)
    }


    function diskSize(num) {
        if (num === 0) return '0 B';
        var k = 1024; //设定基础容量大小
        var sizeStr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; //容量单位
        var i = 0; //单位下标和次幂
        for (var l = 0; l < 8; l++) {   //因为只有8个单位所以循环八次
            if (num / Math.pow(k, l) < 1) { //判断传入数值 除以 基础大小的次幂 是否小于1，这里小于1 就代表已经当前下标的单位已经不合适了所以跳出循环
                break; //小于1跳出循环
            }
            i = l; //不小于1的话这个单位就合适或者还要大于这个单位 接着循环
        }
        // 例： 900 / Math.pow(1024, 0)  1024的0 次幂 是1 所以只要输入的不小于1 这个最小单位就成立了；
        //     900 / Math.pow(1024, 1)  1024的1次幂 是1024  900/1024 < 1 所以跳出循环 下边的 i = l；就不会执行  所以 i = 0； sizeStr[0] = 'B';
        //     以此类推 直到循环结束 或 条件成立
        return (num / Math.pow(k, i)).toFixed(1) + ' ' + sizeStr[i];  //循环结束 或 条件成立 返回字符
    }

    function get_path(){
        let nav_path = $("#branding_nav")
        let node_list = nav_path.children();
        let path_list = []
        for (let i = 0; i < node_list.length; i++) {
            if (node_list[i].text === "/") {
                path_list.push("")
            } else {
                path_list.push(node_list[i].text)
            }
        }
        path_list.push("")
        console.log(path_list)
        return path_list.join("/")
}

    function command(cmd) {
        // 命令: 按钮执行方法 入口
        var path = get_path();
        if (cmd === "refresh") {
            refresh(path)
        } else if (cmd === "upload") {

        } else if (cmd === "download") {
            download()
        }
}

    function request_post() {
        // 获取文件对象


        $.ajax({
            url: window.global_url,

        })
}

    function request_get(path, name) {
        /*let second = 0
        let timerInterval
        Swal.fire({
            title: '正在下载中...',
            html: '用时<b></b>秒',
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    second += 1;
                    b.textContent = second
                }, 1000)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
            }
        })*/
        // 获取文件对象
        if (window.download_to_local) {
            // 可选地，上面的请求可以这样做
            /*var iframe = window.document.createElement("iframe");
            iframe.style.display = "none"; // 防止影响页面
            iframe.style.height = 0; // 防止影响页面
            iframe.src = window.global_url + "?" + jQuery.param({
                cmd: "download",
                path: path,
                name: name
            });
            iframe.onload = function () {
                this.parentNode.removeChild(this);
            }
            iframe.onloadstart = function (){
                console.log("onloadstart")
            }
            window.document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求 */
            window.open(window.global_url + "?" + jQuery.param({
                cmd: "download",
                path: path,
                name: name
            }))
        } else {
            $.ajax({
                url: window.global_url,
                data: {
                    cmd: "download",
                    path: path,
                    name: name
                },
                success: function () {

                }
            })
        }

    }


    function refresh(path) {
        // 刷新当前 目录
        window.file_list(path, "ls");
}

    function download() {
        // 支持批量下载
        var path = get_path();
        console.log("path = " + path)
        // 处理文件列表
        $(":checkbox[name='checkBoxFiles']:checked").each(function () {
            console.log("download filename = " + $(this).val())
            request_get(path, $(this).val())
        })
        // 处理目录 列表
        $(":checkbox[name='checkBoxDirs']:checked").each(function () {
            console.log("download filename = " + $(this).val())
            request_get(path, $(this).val())
        })
}

    function upload(path) {
        // 上传文件
        /*
    <div id="fine-uploader" style="width: 40vw; display: none;z-index: 3 !important; position: fixed; left: 30%; top: 15%"
         onblur="this.hide()">
    </div>
    */

        console.log("path = " + path)
        Swal.fire({
            position: "center",
            html:"<div id=\"fine-uploader\" style=\"width: 40vw; display: none;z-index: 3 !important; margin-left: " + window.innerWidth * 0.02 + "px;\"\n" +
                "     onblur=\"this.hide()\">\n" +
                "</div>",
            showConfirmButton: false,
            width: window.innerWidth * 0.5,
        })

        $('ul.qq-upload-list-selector').html("")
        // 删除多余div
        $("#fine-uploader").html("")
        $("#fine-uploader").show()
        let uploader = new qq.FineUploader({
            multiple: true,
            element: document.getElementById('fine-uploader'),
            request: {
                endpoint: window.global_url,
                params: {
                    cmd: "upload",
                    path: get_path(),
                    option: 'sftp',
                    csrfmiddlewaretoken: $(":input[name='csrfmiddlewaretoken']").val()
                }
            },
            deleteFile: {
                enabled: true,
                endpoint: '/uploads'
            },
            retry: {
                enableAuto: false
            },
            text: {
                formatProgress: "{percent}% of {total_size}",
                failUpload: "上传失败",
                waitingForResponse: "Processing...",
                paused: "暂停"
            },
            callbacks: {
                onComplete: function (id, fileName, responseJSON) {         //上传完成后
                    $('li[qq-file-id="' + id + '"]>span:last')[0].innerHTML = "成功"
                    console.log("responseJSON", responseJSON);
                    window.load_file_list(responseJSON.files, path)
                }
            },
        });
}

    /*
    * rz 命令
    * sz 命令
    * */

    function updateProgress(xfer) {
        let detail = xfer.get_details();
        let name = detail.name;
        let total = detail.size;
        let percent;
        if (total === 0) {
            percent = 100
        } else {
            percent = Math.round(xfer._file_offset / total * 100);
        }

        term.write("\r" + name + ": " + total + " " + xfer._file_offset + " " + percent + "%    ");
}

    function uploadFile(zsession) {
        let uploadHtml = "<div>" +
            "<label class='upload-area' style='width:100%;text-align:center;' for='fupload'>" +
            "<input id='fupload' name='fupload' type='file' style='display:none;' multiple='true'>" +
            "<i class='fa fa-cloud-upload fa-3x'></i>" +
            "<br />" +
            "点击选择文件" +
            "</label>" +
            "<br />" +
            "<span style='margin-left:5px !important;' id='fileList'></span>" +
            "</div><div class='clearfix'></div>";

        let upload_dialog = bootbox.dialog({
            message: uploadHtml,
            title: "上传文件",
            buttons: {
                cancel: {
                    label: '关闭',
                    className: 'btn-default',
                    callback: function (res) {
                        try {
                            // zsession 每 5s 发送一个 ZACK 包，5s 后会出现提示最后一个包是 ”ZACK“ 无法正常关闭
                            // 这里直接设置 _last_header_name 为 ZRINIT，就可以强制关闭了
                            zsession._last_header_name = "ZRINIT";
                            zsession.close();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                },
            },
            closeButton: false,
        });

        function hideModal() {
            upload_dialog.modal('hide');
        }

        let file_el = document.getElementById("fupload");
        console.log(file_el)
        return new Promise((res) => {
            file_el.onchange = function (e) {
                console.log("file onchange")
                let files_obj = file_el.files;
                hideModal();
                Zmodem.Browser.send_files(zsession, files_obj, {
                    on_offer_response(obj, xfer) {
                        console.log("obj = " + obj)
                        console.log("xfer = " + xfer)
                        if (xfer) {
                            // term.write("\r\n");
                        } else {
                            // term.write("\r\n" + obj.name + " was upload skipped");
                            term.write(obj.name + " was upload skipped\r\n");
                            //socket.send(JSON.stringify({ type: "ignore", data: utoa("\r\n" + obj.name + " was upload skipped\r\n") }));
                        }
                    },
                    on_progress(obj, xfer) {
                        updateProgress(xfer);
                    },
                    on_file_complete(obj) {
                        //socket.send(JSON.stringify({ type: "ignore", data: utoa("\r\n" + obj.name + " was upload success\r\n") }));
                        // console.log("COMPLETE", obj);
                        term.write("\r\n");
                    },
                }).then(zsession.close.bind(zsession), console.error.bind(console)).then(() => {
                    res();
                    // term.write("\r\n");
                });
            };
        });
}

    function downloadFile(zsession) {
        zsession.on("offer", function (xfer) {
            function on_form_submit() {
                let FILE_BUFFER = [];
                xfer.on("input", (payload) => {
                    updateProgress(xfer);
                    FILE_BUFFER.push(new Uint8Array(payload));
                });

                xfer.accept().then(
                    () => {
                        saveFile(xfer, FILE_BUFFER);
                        term.write("\r\n");
                        //socket.send(JSON.stringify({ type: "ignore", data: utoa("\r\n" + xfer.get_details().name + " was download success\r\n") }));
                    },
                    console.error.bind(console)
                );
            }

            on_form_submit();

        });

        let promise = new Promise((res) => {
            zsession.on("session_end", () => {
                res();
            });
        });

        zsession.start();
        return promise;
    }

})
