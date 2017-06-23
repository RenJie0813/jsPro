var server = require("../admin/httpServer");
var route = require("../admin/route");
var hanlder = require("../admin/handler");

var hanlders = {};
hanlders['/'] = hanlder.index;
hanlders['/index'] = hanlder.index;
hanlders['/upload'] = hanlder.upload;
server.serverStart(route.route, hanlders);