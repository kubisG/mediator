"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var response_type_enum_1 = require("./dto/response/response-type.enum");
var base_message_router_1 = require("@ra/web-ee-router/dist/base-message-router");
var locates_data_dto_1 = require("./dto/locates-data.dto");
var locates_status_enum_1 = require("../locates-data/locates-status.enum");
var light_mapper_1 = require("light-mapper");
var ra_locates_data_1 = require("../forms-dao/entity/ra-locates-data");
var HubMessageRouterService = /** @class */ (function (_super) {
    __extends(HubMessageRouterService, _super);
    function HubMessageRouterService(env, hubClientRouterService, locatesUpdate, emailsService, queue, logger, inMiddlewares, outMiddlewares, fastRandom, locatesUpdateDataRep, locatesDataRep, companyRep, auditTrailRep) {
        var _this = _super.call(this, queue, null, logger, inMiddlewares, outMiddlewares) || this;
        _this.env = env;
        _this.hubClientRouterService = hubClientRouterService;
        _this.locatesUpdate = locatesUpdate;
        _this.emailsService = emailsService;
        _this.fastRandom = fastRandom;
        _this.locatesUpdateDataRep = locatesUpdateDataRep;
        _this.locatesDataRep = locatesDataRep;
        _this.companyRep = companyRep;
        _this.auditTrailRep = auditTrailRep;
        _this.init();
        _this.dbListener();
        return _this;
    }
    HubMessageRouterService.prototype.init = function () {
        this.consumeMessages(this.env.queue.opt.nats.dataQueue());
        this.setRequestQueue(this.env.queue.opt.nats.requestQueue());
        // for testing
        // this.setRequestQueue(this.env.queue.opt.nats.dataQueue);
    };
    HubMessageRouterService.prototype.updateLocates = function (myLoc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.locatesDataRep.update({
                            id: myLoc.id
                        }, {
                            usedShares: myLoc.usedShares,
                            availableShares: myLoc.availableShares,
                            status: myLoc.status
                        })];
                    case 1:
                        _a.sent();
                        // need to send messages to all connected clients from company
                        this.hubClientRouterService.pushToAccount("COMP" + myLoc.companyId, new locates_data_dto_1.LocatesDataDto({ type: "single", data: myLoc }));
                        return [2 /*return*/];
                }
            });
        });
    };
    HubMessageRouterService.prototype.processOldLocates = function (locates) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, results_1, myLoc, company;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.locatesDataRep.getLocates(locates.clientId, locates.symbol, locates.broker, false)];
                    case 1:
                        results = _a.sent();
                        if (!((results) && (results.length > 0))) return [3 /*break*/, 6];
                        _i = 0, results_1 = results;
                        _a.label = 2;
                    case 2:
                        if (!(_i < results_1.length)) return [3 /*break*/, 6];
                        myLoc = results_1[_i];
                        myLoc.usedShares = myLoc.usedShares + locates.usedQuantity;
                        myLoc.availableShares = myLoc.quantity - myLoc.usedShares;
                        locates.usedQuantity = 0;
                        return [4 /*yield*/, this.updateLocates(myLoc)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.companyRep.findOne({
                                select: ["id", "companyMail"],
                                where: { id: myLoc.companyId }
                            })];
                    case 4:
                        company = _a.sent();
                        this.emailsService.send("admin@rapidaddition.com", company.companyMail, "Locates problem", "Used more locates (" + locates.symbol + ", " + locates.broker + ", " + locates.usedQuantity + ") than allocated!");
                        this.logger.warn(company.companyMail + " - used more locates (" + locates.symbol + ", " + locates.broker + ", " + locates.usedQuantity + ") than allocated!");
                        if (locates.usedQuantity === 0) {
                            return [3 /*break*/, 6];
                        }
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    HubMessageRouterService.prototype.processEdgeLocates = function (locates) {
        return __awaiter(this, void 0, void 0, function () {
            var mail, company, mapper, newData, savedData, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.companyRep.findOne({
                                select: ["id", "companyMail"],
                                where: { clientId: locates.clientId }
                            })];
                    case 1:
                        company = _a.sent();
                        mail = company.companyMail;
                        locates.company = company.id;
                        locates.user = "APP";
                        locates.quantity = 0;
                        mapper = new light_mapper_1.LightMapper();
                        newData = mapper.map(ra_locates_data_1.RaLocatesData, locates);
                        newData.clientId = locates.clientId;
                        newData.broker = locates.broker;
                        newData.symbol = locates.symbol;
                        newData.status = locates_status_enum_1.LocatesStatus.Done;
                        newData.createdBy = "APP";
                        newData.usedShares = locates.usedQuantity;
                        newData.availableShares = (-1 * locates.usedQuantity);
                        newData.quantity = 0;
                        return [4 /*yield*/, this.locatesDataRep.save(newData)];
                    case 2:
                        savedData = _a.sent();
                        // need to send messages to all connected clients from company
                        this.hubClientRouterService.pushToAccount("COMP" + company.id, new locates_data_dto_1.LocatesDataDto({ type: "single", data: savedData }));
                        this.emailsService.send("admin@rapidaddition.com", mail, "Locates problem", "Used more locates (" + newData.symbol + ", " + newData.broker + ", " + locates.usedQuantity + ") than allocated!");
                        this.logger.warn(mail + " " + newData.clientId + " - used more locates (" + newData.symbol + ", " + newData.broker + ", " + locates.usedQuantity + ") than allocated!");
                        this.auditTrailRep.afterInsert(savedData.id, savedData, "ra_locates_data", "APP", locates.company);
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        this.logger.error(ex_1);
                        this.emailsService.send("admin@rapidaddition.com", mail, "Locates problem", ex_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HubMessageRouterService.prototype.processLocates = function (data, fromDB) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, data_1, locates, results, i, myLoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(data && data.length > 0)) return [3 /*break*/, 13];
                        _i = 0, data_1 = data;
                        _a.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 12];
                        locates = data_1[_i];
                        return [4 /*yield*/, this.locatesDataRep.getLocates(locates.clientId, locates.symbol, locates.broker)];
                    case 2:
                        results = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < results.length)) return [3 /*break*/, 6];
                        myLoc = results[i];
                        if (locates.usedQuantity < myLoc.availableShares) {
                            myLoc.usedShares = myLoc.usedShares + locates.usedQuantity;
                            myLoc.availableShares = myLoc.quantity - myLoc.usedShares;
                            myLoc.status = locates_status_enum_1.LocatesStatus.Used;
                            locates.usedQuantity = 0;
                        }
                        else if ((locates.usedQuantity === myLoc.availableShares) || (i === (results.length - 1))) {
                            myLoc.usedShares = myLoc.usedShares + locates.usedQuantity;
                            myLoc.availableShares = myLoc.quantity - myLoc.usedShares;
                            myLoc.status = locates_status_enum_1.LocatesStatus.Done;
                            locates.usedQuantity = 0;
                        }
                        else if (locates.usedQuantity > myLoc.availableShares) {
                            locates.usedQuantity = locates.usedQuantity - myLoc.availableShares;
                            myLoc.usedShares = myLoc.quantity;
                            myLoc.availableShares = myLoc.quantity - myLoc.usedShares;
                            myLoc.status = locates_status_enum_1.LocatesStatus.Done;
                        }
                        return [4 /*yield*/, this.updateLocates(myLoc)];
                    case 4:
                        _a.sent();
                        if (locates.usedQuantity === 0) {
                            return [3 /*break*/, 6];
                        }
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!(locates.usedQuantity > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.processOldLocates(locates)];
                    case 7:
                        _a.sent();
                        if (!(locates.usedQuantity > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.processEdgeLocates(locates)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        if (!fromDB) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.locatesUpdateDataRep["delete"]({ id: locates.id })];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 1];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        this.logger.error("response has no data");
                        _a.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    HubMessageRouterService.prototype.clearLocates = function (fromDBid) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, results_2, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.locatesDataRep.setExpiredLocates()];
                    case 1:
                        results = _a.sent();
                        if (!results) return [3 /*break*/, 4];
                        if (!fromDBid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.locatesUpdateDataRep["delete"]({ id: fromDBid })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        for (_i = 0, results_2 = results; _i < results_2.length; _i++) {
                            result = results_2[_i];
                            this.hubClientRouterService.pushToAccount("COMP" + result.comp, new locates_data_dto_1.LocatesDataDto({ type: "all" }));
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HubMessageRouterService.prototype.processMsg = function (clientId, msg, fromDB) {
        if (clientId === this.env.queue.opt.nats.locatesId) {
            switch (msg.type) {
                case response_type_enum_1.ResponseType.locates: {
                    this.processLocates(msg.data, fromDB);
                    break;
                }
                case response_type_enum_1.ResponseType.clearLocates: {
                    if (fromDB) {
                        this.clearLocates(msg.data.id);
                    }
                    else {
                        this.clearLocates();
                    }
                    break;
                }
                default: {
                    this.logger.error("response is not locates type \"" + msg.type + "\"");
                    break;
                }
            }
        }
        else {
            this.logger.error("response is not from this nodejs id \"" + this.env.queue.opt.nats.locatesId + "\"");
        }
    };
    HubMessageRouterService.prototype.routeMessage = function (msg) {
        if (msg.clientId) {
            this.processMsg(msg.clientId, msg);
        }
        else {
            this.logger.error("unknown message format");
        }
    };
    HubMessageRouterService.prototype.dbListener = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var unprocessed, _i, unprocessed_1, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.locatesUpdateDataRep.find()];
                    case 1:
                        unprocessed = _a.sent();
                        if (unprocessed && unprocessed.length > 0) {
                            for (_i = 0, unprocessed_1 = unprocessed; _i < unprocessed_1.length; _i++) {
                                data = unprocessed_1[_i];
                                this.processMsg(this.env.queue.opt.nats.locatesId, { id: "1", type: response_type_enum_1.ResponseType.locates, data: [data] }, true);
                            }
                        }
                        // we subscribe to changes NOTIFY from postgres
                        this.sub = this.locatesUpdate.updateSubject$.subscribe(function (data) {
                            if (data && data.type === response_type_enum_1.ResponseType.locates) {
                                if (data instanceof Array) {
                                    _this.processMsg(_this.env.queue.opt.nats.locatesId, { id: "1", type: response_type_enum_1.ResponseType.locates, data: data }, true);
                                }
                                else {
                                    _this.processMsg(_this.env.queue.opt.nats.locatesId, { id: "1", type: response_type_enum_1.ResponseType.locates, data: [data] }, true);
                                }
                            }
                            else if (data && data.type === response_type_enum_1.ResponseType.clearLocates) {
                                _this.processMsg(_this.env.queue.opt.nats.locatesId, { id: "2", type: response_type_enum_1.ResponseType.clearLocates, data: data }, true);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    HubMessageRouterService = __decorate([
        common_1.Injectable(),
        __param(3, common_1.Inject("mailer")),
        __param(4, common_1.Inject("queue")),
        __param(5, common_1.Inject("logger")),
        __param(6, common_1.Inject("inMiddlewares")),
        __param(7, common_1.Inject("outMiddlewares")),
        __param(8, common_1.Inject("fastRandom")),
        __param(9, common_1.Inject("locatesUpdateRepository")),
        __param(10, common_1.Inject("locatesDataRepository")),
        __param(11, common_1.Inject("companyRepository")),
        __param(12, common_1.Inject("auditTrailRepository"))
    ], HubMessageRouterService);
    return HubMessageRouterService;
}(base_message_router_1.BaseMessageRouter));
exports.HubMessageRouterService = HubMessageRouterService;
