const axios = require("axios");
const io = require("socket.io-client");

var eventsListenerInitialized = false;
var itr = 0;

function closeClient(client) {
    if (client) {
        client.close();
        client = undefined;
    }
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
    var client = io(context.vars.target, { query: { token: context.vars.$processEnvironment.AUTH_TOKEN } });
    client.on("connect", function (data) {
        client.emit("response", {});
        client.emit("request", {
            type: "init"
        });
    });
    client.on("initOk", function (data) {
        closeClient(client);
        done();
    });
    attachEventListeners(events);
}

const testSocketQuery = function (context, events, done) {
    var channel;
    var client = io(context.vars.target, { query: { token: context.vars.$processEnvironment.AUTH_TOKEN } });
    client.on("connect", function (data) {
        channel = `testChannel_${itr}`;
        itr++;
        client.emit("response", {});
        client.emit("request", {
            query: "OS.*",
            channelId: channel,
            type: "subscribe",
            page: 0,
        });
    });
    client.on("data", function (data) {
        client.emit("request", {
            channelId: channel,
            type: "unsubscribe",
        });
        closeClient(client);
        done();
    });
    attachEventListeners(events);
}

const testSocketQueryTimeOut = function (context, events, done) {

}

module.exports = {
    testSocketInit,
    testSocketQuery
};
