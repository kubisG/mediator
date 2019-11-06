"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("reflect-metadata");
var dotenv = require("dotenv");
var fs = require("fs");
var app_module_1 = require("./app.module");
var environment_service_1 = require("@ra/web-env-be/dist/environment.service");
var install_utils_1 = require("@ra/web-core-be/dist/install/install-utils");
dotenv.config();
function exitErr(err) {
    console.log("ERR", err);
    process.exit(1);
}
function exitOk() {
    process.exit(0);
}
function install(connection, enviroment) {
    return __awaiter(this, void 0, void 0, function () {
        var app, newConnection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.close()];
                case 1:
                    _a.sent();
                    process.env.DB_SYNCH = "true";
                    process.env.DB_LOGGING = "true";
                    return [4 /*yield*/, install_utils_1.InstallUtils.initDbFromModule(app_module_1.AppModule)];
                case 2:
                    app = _a.sent();
                    newConnection = app.get("DbConnection");
                    return [4 /*yield*/, updateToDB(newConnection(), enviroment)];
                case 3:
                    _a.sent();
                    app.close();
                    return [2 /*return*/];
            }
        });
    });
}
function updateToDB(connection, enviroment) {
    return __awaiter(this, void 0, void 0, function () {
        var sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = fs.readFileSync("./db/" + enviroment.appVersion + "_postgres.sql").toString();
                    if (!sql) return [3 /*break*/, 2];
                    return [4 /*yield*/, connection.manager.query(sql)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
var env = new environment_service_1.EnvironmentService();
install_utils_1.InstallUtils.tryCreateDbConnection(env, 10).then(function (connection) {
    install(connection, env).then(function () {
        exitOk();
    })["catch"](function (err) {
        exitErr(err);
    });
})["catch"](function (err) {
    exitErr(err);
});
