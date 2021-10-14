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
        console.log(path_list)
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
    var nav_path = $("#branding_nav")
    nav_path.children()
}

function command(cmd) {
    // 命令: 按钮执行方法 入口
    var path = "";
    if (cmd === "refresh") {
        refresh(path)
    } else if (cmd === "upload") {

    } else if (cmd === "download") {

    }
}

function request_post() {
    // 获取文件对象

    $.ajax({
        url: window.global_url,

    })
}


function refresh(path) {
    // 刷新当前 目录
    window.file_list(path, "ls");
}

function download(path, names) {
    // 支持批量下载
}

function upload(path) {
    // 上传文件
}