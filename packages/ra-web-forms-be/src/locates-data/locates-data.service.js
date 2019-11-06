"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
var common_1 = require("@nestjs/common");
var light_mapper_1 = require("light-mapper");
var ra_locates_data_1 = require("../forms-dao/entity/ra-locates-data");
var locates_status_enum_1 = require("./locates-status.enum");
var LocatesService = /** @class */ (function () {
    function LocatesService(authService, systemService, logger, locatesDataRep, auditTrailRep, exchangeDataRep, dataService) {
        this.authService = authService;
        this.systemService = systemService;
        this.logger = logger;
        this.locatesDataRep = locatesDataRep;
        this.auditTrailRep = auditTrailRep;
        this.exchangeDataRep = exchangeDataRep;
        this.dataService = dataService;
    }
    /**
     * TODO : split & validace
     * @param data
     * @param token
     */
    LocatesService.prototype.findMany = function (token, dates, typ) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, datesArr, dateFrom, dateTo, results, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getUserData(token)];
                    case 1:
                        userData = _a.sent();
                        datesArr = dates.split("~");
                        dateFrom = datesArr[0];
                        if (datesArr.length < 2) {
                            dateTo = datesArr[0];
                        }
                        else {
                            dateTo = datesArr[1];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.locatesDataRep.getData(dateFrom, dateTo, userData.compId, typ)];
                    case 3:
                        results = _a.sent();
                        return [2 /*return*/, results];
                    case 4:
                        ex_1 = _a.sent();
                        ex_1.userId = userData.userId;
                        this.systemService.sendException(ex_1);
                        this.logger.error(ex_1);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LocatesService.prototype.getRules = function (token, typ) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, results, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getUserData(token)];
                    case 1:
                        userData = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.locatesDataRep.find({ dataType: typ, subType: "SUB", company: userData.compId })];
                    case 3:
                        results = _a.sent();
                        return [2 /*return*/, results];
                    case 4:
                        ex_2 = _a.sent();
                        ex_2.userId = userData.userId;
                        this.systemService.sendException(ex_2);
                        this.logger.error(ex_2);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LocatesService.prototype.findOne = function (token, id) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, ex_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getUserData(token)];
                    case 1:
                        userData = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.locatesDataRep.findOne({ id: id, company: userData.compId })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        ex_3 = _a.sent();
                        ex_3.userId = userData.userId;
                        this.systemService.sendException(ex_3);
                        this.logger.error(ex_3);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LocatesService.prototype["delete"] = function (token, id) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, previous, ex_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getUserData(token)];
                    case 1:
                        userData = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.locatesDataRep.findOne({ id: id, company: userData.compId })];
                    case 3:
                        previous = _a.sent();
                        return [4 /*yield*/, this.exchangeDataRep.saveRecord(id, "ra_locates_data", "D", previous)];
                    case 4:
                        _a.sent();
                        this.auditTrailRep.beforeDelete(id, "", "ra_locates_data", userData.nickName, userData.compId);
                        return [4 /*yield*/, this.locatesDataRep["delete"]({ id: id, company: userData.compId, status: locates_status_enum_1.LocatesStatus.New })];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        ex_4 = _a.sent();
                        ex_4.userId = userData.userId;
                        this.systemService.sendException(ex_4);
                        this.logger.error(ex_4);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param company
     */
    LocatesService.prototype.saveData = function (token, data) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, mapper, newData, previous, savedData, ex_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getUserData(token)];
                    case 1:
                        userData = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        data.company = userData.compId;
                        data.user = userData.nickName;
                        mapper = new light_mapper_1.LightMapper();
                        newData = mapper.map(ra_locates_data_1.RaLocatesData, data);
                        previous = void 0;
                        if (!(data.type === "N")) return [3 /*break*/, 3];
                        delete newData.id;
                        newData.clientId = userData.clientId;
                        newData.status = locates_status_enum_1.LocatesStatus.New;
                        newData.createdBy = userData.nickName;
                        newData.availableShares = data.quantity;
                        return [3 /*break*/, 5];
                    case 3:
                        newData.id = data.id;
                        newData.clientId = userData.clientId;
                        newData.updatedBy = userData.nickName;
                        // we dont want to update this, only quantity
                        delete newData.symbol;
                        delete newData.status;
                        delete newData.broker;
                        return [4 /*yield*/, this.locatesDataRep.findOne({
                                select: ["id", "reqType", "symbol", "broker", "quantity", "clientId"],
                                where: { id: newData.id, company: userData.compId }
                            })];
                    case 4:
                        previous = _a.sent();
                        newData.availableShares = newData.availableShares + (data.quantity - previous.quantity);
                        previous.broker = previous.broker ? JSON.parse(previous.broker) : previous.broker;
                        previous.symbol = previous.symbol ? JSON.parse(previous.symbol) : previous.symbol;
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.locatesDataRep.save(newData)];
                    case 6:
                        savedData = _a.sent();
                        if (data.type !== "N") {
                            delete savedData.createDate;
                        }
                        return [4 /*yield*/, this.exchangeDataRep.saveRecord(savedData.id, "ra_locates_data", data.type === "N" ? "I" : "U", previous ? previous : null)];
                    case 7:
                        _a.sent();
                        if (data.type === "N") {
                            this.auditTrailRep.afterInsert(savedData.id, savedData, "ra_locates_data", userData.nickName, userData.compId);
                        }
                        else {
                            this.auditTrailRep.afterUpdate(savedData.id, savedData, "ra_locates_data", userData.nickName, userData.compId);
                        }
                        return [2 /*return*/, savedData];
                    case 8:
                        ex_5 = _a.sent();
                        ex_5.userId = userData.userId;
                        this.systemService.sendException(ex_5);
                        this.logger.error(ex_5);
                        return [2 /*return*/, null];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    LocatesService.prototype.getExternalData = function (token, data) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, res, ex_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getUserData(token)];
                    case 1:
                        userData = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.dataService.getExternalData(data)];
                    case 3:
                        res = _a.sent();
                        if (!res.data) {
                            this.logger.error(res);
                            this.systemService.sendException({ message: res.statusText, userId: userData.userId });
                            return [2 /*return*/, null];
                        }
                        else if (!Array.isArray(res.data)) {
                            this.logger.error("Bad array!", res.data);
                            this.systemService.sendException({ message: "Bad array!", userId: userData.userId });
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, res.data];
                    case 4:
                        ex_6 = _a.sent();
                        ex_6.userId = userData.userId;
                        this.logger.error(ex_6);
                        ex_6.message = ex_6.message + " - " + ex_6.config.url;
                        this.systemService.sendException(ex_6);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LocatesService = __decorate([
        common_1.Injectable(),
        __param(2, common_1.Inject("logger")),
        __param(3, common_1.Inject("locatesDataRepository")),
        __param(4, common_1.Inject("auditTrailRepository")),
        __param(5, common_1.Inject("exchangeDataRepository"))
    ], LocatesService);
    return LocatesService;
}());
exports.LocatesService = LocatesService;
