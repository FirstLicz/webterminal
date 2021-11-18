$(function () {
    let term = new Terminal({
        // cursorStyle: 'underline', //光标样式
        cursorBlink: true, // 光标闪烁
        convertEol: true, //启用时，光标将设置为下一行的开头
        disableStdin: false, //是否应禁用输入。
        theme: {
            foreground: 'yellow', //字体
            background: '#060101', //背景色
            cursor: 'help',//设置光标
            lineHeight: 22,
            fontSize: 18,
        }
    });
    term._initialized = true;
    term.resize(parseInt(window.innerWidth / 9), parseInt(window.innerHeight / 17))
    let terminal = document.getElementById('terminal');
    // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
    let url = ws_scheme + "://127.0.0.1:8000/ws/telnet/" + window.session_id + "/"
    var ws = new WebSocket(url);
    var fitAddon = new FitAddon.FitAddon()
    var attachAddon = new AttachAddon.AttachAddon(ws)
    term.loadAddon(attachAddon)
    term.loadAddon(fitAddon)
    term.open(terminal);
    term.focus()
    
    // term.onKey(function (e) {
    //     ws.send(e.key)
    // })
    
    ws.onopen = function () {
        // 当 websocket 创建成功时，触发事件
        console.log("open websocket")
        ws.send(JSON.stringify(["onopen", parseInt(window.innerWidth / 9), parseInt(window.innerHeight / 17)])); // 将消息发出
    }
    ws.onmessage = function (event) {
        console.log(event.data)
        if (event.data === "\r"){
            console.log("换行")
            term.write("\n")
        }else if (event.data === ""){
            console.log("backspace")
            term.write("\b \b")
        } else{
            // term.write(event.data)
        }

    }
    ws.onclose = function (event) {
        console.log(event.data)
    }
    ws.onerror = function (event) {
        console.log(event.data)
    }
    $(window).resize(function () {
        term.resize(parseInt(window.innerWidth / 9), parseInt(window.innerHeight / 17))
    })
})