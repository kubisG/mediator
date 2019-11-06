"use strict";
exports.__esModule = true;
var out_middleware_1 = require("./middlewares/out.middleware");
var in_middleware_1 = require("./middlewares/in.middleware");
exports.inMessageMiddlewares = [
    in_middleware_1.InMiddleware,
];
exports.outMessageMiddlewares = [
    out_middleware_1.OutMiddleware,
];
exports.inMiddlewaresProvider = {
    provide: "inMiddlewares",
    useFactory: function () {
        var inMiddlewares = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inMiddlewares[_i] = arguments[_i];
        }
        return inMiddlewares;
    },
    inject: exports.inMessageMiddlewares.slice()
};
exports.outMiddlewaresProvider = {
    provide: "outMiddlewares",
    useFactory: function () {
        var outMiddlewares = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            outMiddlewares[_i] = arguments[_i];
        }
        return outMiddlewares;
    },
    inject: exports.outMessageMiddlewares.slice()
};
