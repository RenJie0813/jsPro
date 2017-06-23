(function() {
    var socaket = {
        wsURI: null,
        socaket: null,
        chatPannel: null,
        // OnInit
        init: function(uri) {
            //检查浏览器是否支持WebSocket
            if (window.WebSocket) {
                console.log('This browser supports WebSocket');
            } else {
                console.log('This browser does not supports WebSocket');
                return;
            }
            this.chatPannel = document.getElementById('chat');

            this.wsURI = uri ? uri : 'ws://localhost:8888/test/webSocket/server.js';
            this.socaket = new WebSocket(this.wsURI);

            this.socaket.onopen = function(evt) {
                this.onOpen(evt)
            }.bind(this);
            this.socaket.onclose = function(evt) {
                this.onClose(evt)
            }.bind(this);
            this.socaket.onmessage = function(evt) {
                this.onMessage(evt)
            }.bind(this);
            this.socaket.onerror = function(evt) {
                this.onError(evt)
            }.bind(this);

            var btn = document.getElementById("send");
            btn.addEventListener('click', function() {
                var text = document.getElementById('msg').value;
                socaket.sendMsg(text);
            }, true);
        },

        // onOpen
        onOpen: function(evt) {
            console.log('WebSocket Connected');
            this.showInScreen('Connected');
        },

        // onClose
        onClose: function(evt) {
            console.log('WebSocket Closed');
            this.showInScreen('Closed');
        },

        // onMsg
        onMessage: function(evt) {
            var msg = JSON.parse(evt.data);
            var m = msg.message + '---' + new Date(msg.time).format('yyyy-MM-dd hh:mm:ss');
            console.log('Response: ' + m);
            this.showInScreen('Response: ' + m);
        },

        // sendMsg
        sendMsg: function(msg) {
            console.log('Send: ' + msg);
            this.socaket.send(msg);
        },

        // onerror
        onError: function(evt) {
            console.log('Error: ' + evt);
            this.showInScreen('Error: ' + evt);
        },

        // showInScreen
        showInScreen: function(msg) {
            var pre = document.createElement("p");
            pre.style.wordWrap = "break-word";
            pre.innerHTML = msg;
            this.chatPannel.appendChild(pre);
        }
    }
    window.addEventListener('load', function() {
        socaket.init();
    });
})()