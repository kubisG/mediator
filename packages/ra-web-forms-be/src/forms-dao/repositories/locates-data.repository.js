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
var ra_locates_data_1 = require("../entity/ra-locates-data");
var locates_status_enum_1 = require("../../locates-data/locates-status.enum");
var LocatesDataRepository = /** @class */ (function () {
    function LocatesDataRepository(repo) {
        this.repo = repo;
    }
    LocatesDataRepository.prototype.getLocates = function (clientId, symbol, broker, status) {
        if (status === void 0) { status = true; }
        return __awaiter(this, void 0, void 0, function () {
            var selectBuilder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repo.createQueryBuilder("ord")];
                    case 1:
                        selectBuilder = _a.sent();
                        selectBuilder
                            .select("ord.*")
                            .where("ord.symbol like '%'||:symbol||'%'", {
                            symbol: symbol
                        })
                            .andWhere("ord.broker like '%'||:broker||'%'", {
                            broker: broker
                        })
                            .andWhere("ord.clientId = :clientId", {
                            clientId: clientId
                        });
                        if (status) {
                            selectBuilder
                                .andWhere("ord.status in ('New','Used')");
                        }
                        else {
                            selectBuilder
                                .andWhere("ord.status not in ('Expired')");
                        }
                        selectBuilder
                            .orderBy("ord.id");
                        return [2 /*return*/, selectBuilder.getRawMany()];
                }
            });
        });
    };
    LocatesDataRepository.prototype.getData = function (dateFrom, dateTo, compId, status) {
        return __awaiter(this, void 0, void 0, function () {
            var ddateFrom, ddateTo, queryBuilder, selectBuilder;
            return __generator(this, function (_a) {
                ddateFrom = new Date();
                ddateFrom.setHours(0, 0, 0, 0);
                ddateTo = new Date();
                ddateTo.setHours(23, 59, 59, 99);
                queryBuilder = this.repo.createQueryBuilder("ord");
                selectBuilder = queryBuilder;
                selectBuilder
                    .andWhere("ord.company = :compId", { compId: compId })
                    .andWhere("ord.\"createDate\" >= :dateFrom and ord.\"createDate\" <= :dateTo", {
                    dateFrom: dateFrom ? dateFrom : ddateFrom,
                    dateTo: dateTo ? dateTo : ddateTo
                })
                    .orderBy("ord.id", "ASC");
                return [2 /*return*/, selectBuilder.getMany()];
            });
        });
    };
    LocatesDataRepository.prototype.setExpiredLocates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var today, queryBuilder, selectBuilder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = new Date();
                        return [4 /*yield*/, this.repo.createQueryBuilder("ord")];
                    case 1:
                        queryBuilder = _a.sent();
                        queryBuilder
                            .update(ra_locates_data_1.RaLocatesData)
                            .set({
                            status: locates_status_enum_1.LocatesStatus.Expired,
                            availableShares: 0,
                            updatedDate: today
                        })
                            .where("status <> :expired and \"availableShares\">0", { expired: locates_status_enum_1.LocatesStatus.Expired })
                            .andWhere("createDate < :today", { today: today })
                            .execute();
                        selectBuilder = this.repo.createQueryBuilder("ord");
                        selectBuilder
                            .select("DISTINCT(ord.company) comp")
                            .where("ord.\"updatedDate\" >= :dateFrom", {
                            dateFrom: today
                        })
                            .andWhere("ord.status = :expired", { expired: locates_status_enum_1.LocatesStatus.Expired });
                        return [2 /*return*/, selectBuilder.getRawMany()];
                }
            });
        });
    };
    return LocatesDataRepository;
}());
exports.LocatesDataRepository = LocatesDataRepository;
