var exec = require('child_process').exec;

function index(res) {
    console.log('handler index was call');
    exec("ls -lah", function(error, stdout, stderr) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(stdout);
        res.end();
    });
}

function upload(res) {
    console.log('handler upload was call');
    return 'hello upload'
}

exports.index = index;
exports.upload = upload;