var httpProxy = require('http-proxy');
var http = require('http');
var url = require('url');

var proxy = httpProxy.createServer();

http.createServer(function (req, res) {
    console.log(`REQUEST: ${req.url}`)
    if (`${req.url}`.startsWith("/api/") || `${req.url}`.startsWith("/socket.io/")) {
        proxy.web(req, res, { target: 'http://localhost:3000' });
    } else {
        proxy.web(req, res, { target: 'http://localhost:4200' });
    }
}).listen(8080);
