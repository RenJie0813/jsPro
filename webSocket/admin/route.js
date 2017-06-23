function route(pname, handle, res) {
    console.log("route a request for " + pname);
    if (Object.prototype.toString.call(handle[pname]) == "[object Function]") {
        handle[pname](res);
    } else {
        console.log("can't find: " + pname);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write("Not Found");
        res.end();
    }
}

exports.route = route;