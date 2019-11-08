const axios = require("axios");
const io = require("socket.io-client");
var client;

var eventsListenerInitialized = false;
var itr = 0;

function closeClient(client) {
    if (client) {
        client.close();
        client = undefined;
    }
}

function getSocketClient(target, token, onConnect) {
    if (client) {
        onConnect(client);
        return;
    }
    client = io(target, { query: { token } });
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
            console.log("data", data);
            client.emit("request", {
                channelId: channel,
                type: "unsubscribe",
            });
            // closeClient(client);
            done();
        });
    });
    attachEventListeners(events);
}

const testSocketQueryTimeOut = function (context, events, done) {

}

module.exports = {
    testSocketInit,
    testSocketQuery
};
