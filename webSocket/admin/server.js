var webServer = require('ws').Server;
var wss = new webServer({ port: 8888 });
wss.on('connection', function(ws) {
    console.log("connectioned !");
    ws.on('message', function(msg) {
        console.log('Client: ' + msg);
        ws.send(JSON.stringify({
            time: Date.now(),
            message: 'come on,continue'
        }));
    });
});