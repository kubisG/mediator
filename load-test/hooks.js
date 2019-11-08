const axios = require("axios");
const io = require("socket.io-client");
const SDC = require("statsd-client");
const sdcClient = new SDC({
    host: process.env.STATSD_HOST,
    port: 8125,
    prefix: `web_${process.env.PROJECT_FOLDER}`
});
var client;

var eventsListenerInitialized = false;
var itr = 0;

function unsubscribeAll() {
    getNewConnection(`${process.env.TARGET_HOST}/monitor`, process.env.AUTH_TOKEN, function (client) {
        client.emit("request", {
            type: "unsubscribeAll",
            id: 0
        });
    });
}

function lengthInUtf8Bytes(str) {
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}

function closeClient(client) {
    if (client) {
        client.close();
        client = undefined;
    }
}

function createNewIoConnection(target, token) {
    return io(target, { query: { token }, transports: ["websocket", "polling"], });
}

function getSocketClient(target, token, onConnect) {
    if (client) {
        onConnect(client);
        return;
    }
    client = createNewIoConnection(target, token);
    client.on("connect", function () {
        onConnect(client);
    });
    client.on("exception", function (err) {
        throw Error(err);
    });
    client.on("connection", function (connection) {
        onConnect(client);
    });
    client.on("disconnect", function (disconnect) {
        client = undefined;
    });
}

function getNewConnection(target, token, onConnect) {
    var client = createNewIoConnection(target, token);
    client.on("connect", function () {
        onConnect(client);
    });
    client.on("exception", function (err) {
        throw Error(err);
    });
    client.on("connection", function (connection) {
        onConnect(client);
    });
    client.on("disconnect", function (disconnect) {
        // client = undefined;
    });
}

const attachEventListeners = function (events) {
    if (eventsListenerInitialized) {
        return;
    }
    events.on("counter", function (a, b, c) { });
    events.on("histogram", function (a, b, c) { });
    events.on("customStat", function (a, b, c) { });
    events.on("started", function (a, b, c) { });
    events.on("error", function (a, b, c) { });
    events.on("request", function (a, b, c) { });
    events.on("match", function (a, b, c) { });
    events.on("response", function (a, b, c) { });
    eventsListenerInitialized = true;
}

const testSocketInit = function (context, events, done) {
    getSocketClient(context.vars.target, context.vars.$processEnvironment.AUTH_TOKEN, function (client) {
        client.emit("response", {});
        client.emit("request", {
            type: "init"
        });
        client.on("initOk", function (data) {
            closeClient(client);
            done();
        });
    });
    attachEventListeners(events);
}

const testSocketQuery = function (context, events, done) {
    var channel = `testChannel_${itr}`;
    itr++;
    getSocketClient(context.vars.target, context.vars.$processEnvironment.AUTH_TOKEN, function (client) {
        client.emit("response", {});
        client.emit("request", {
            query: "OS.*",
            channelId: channel,
            type: "subscribe",
            page: 0,
        });
        client.on("data", function (data) {
            client.emit("request", {
                channelId: channel,
                type: "unsubscribe",
            });
            done();
        });
    });
    attachEventListeners(events);
}

const testSocketQueryTimeOut = function (context, events, done) {
    var channel = `testChannel_${itr}`;
    itr++;
    getNewConnection(context.vars.target, context.vars.$processEnvironment.AUTH_TOKEN, function (client) {
        var msgCnt = 0;
        client.emit("response", {});
        client.emit("request", {
            query: "OS.*",
            channelId: channel,
            type: "subscribe",
            page: 0,
        });

        client.on("data", function (data) {
            msgCnt++;
            sdcClient.counter('ws.msg.size.counter', lengthInUtf8Bytes(JSON.stringify(data)));
            sdcClient.gauge('ws.msg.size.gauge', lengthInUtf8Bytes(JSON.stringify(data)));
        });

        setTimeout(function (args) {
            args.client.emit("request", {
                channelId: args.channel,
                type: "unsubscribe",
            });
            args.sdcClient.counter('ws.msg.count.counter', msgCnt);
            args.sdcClient.gauge('ws.msg.count.gauge', msgCnt);
            closeClient(args.client);
            done();
        }, 600000, {
            client,
            channel,
            sdcClient,
        });
    });
    attachEventListeners(events);
}

unsubscribeAll();

module.exports = {
    testSocketInit,
    testSocketQuery,
    testSocketQueryTimeOut
};
