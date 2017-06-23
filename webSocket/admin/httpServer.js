var http = require('http');
var url = require('url');

function start(route, handle) {
    http.createServer(onRequest).listen(88);
    console.log("Server Running!");

    function onRequest(req, res) {
        var pname = url.parse(req.url).pathname;
        console.log("request from " + pname);
        route(pname, handle, res);
    }
}

exports.serverStart = start;