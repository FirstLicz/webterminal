/*
*  ssh2 页面 文件操作
*
* */

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

function init_nav(path) {
    // 字符串截取
    var nav_node = $("#branding_nav");
    nav_node.html("")   // 情况 html
    if (path.length === 1 && path === "/") {
        nav_node.append(
            '<a class="custom-breadcrumb-item" href="javascript:window.file_list(\''+ path + '\', \'ls\');">' + path + '</a>'
        )
    } else {
        if (path.endsWith("/")) {
            path = path.slice(0, path.length - 1)
        }
        var path_list = path.split("/")
        for (var i = 0; i < path_list.length; i++) {
            if (i === 0 && path_list[i] === "") {
                nav_node.append(
                    '<a class="custom-breadcrumb-item" href="javascript:window.file_list(\'/\', \'ls\');">' + '/' + '</a>'
                )
            } else {
                nav_node.append(
                    '<a class="custom-breadcrumb-item" href="javascript:window.file_list(\''+ path_list.slice(0, i+1).join("/") + '/\', \'ls\');">' + path_list[i] + '</a>'
                )
            }
        }
    }

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
    // 获取文件对象
    if (window.download_to_local) {
        // 可选地，上面的请求可以这样做
        var iframe = window.document.createElement("iframe");
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
        window.document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
    } else {
        $.ajax({
            url: window.global_url,
            data: {
                cmd: "upload",
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
    console.log("path = " + path)
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
            }
        },
    });
}