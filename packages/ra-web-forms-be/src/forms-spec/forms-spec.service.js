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
var ra_forms_specification_1 = require("../forms-dao/entity/ra-forms-specification");
var FormsSpecService = /** @class */ (function () {
    function FormsSpecService(authService, systemService, logger, formsSpecRep) {
        this.authService = authService;
        this.systemService = systemService;
        this.logger = logger;
        this.formsSpecRep = formsSpecRep;
    }
    /**
     * Find many
     * @param token
     */
    FormsSpecService.prototype.findMany = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getUserData(token)];
                    case 1:
                        userData = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.formsSpecRep.find({
                                relations: ["company"], order: { id: "ASC" }
                            })];
                    case 3: return [2 /*return*/, _a.sent()];
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
    FormsSpecService.prototype.findOne = function (token, id) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getUserData(token)];
                    case 1:
                        userData = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.formsSpecRep.findOne({ id: id, company: userData.compId })];
                    case 3: return [2 /*return*/, _a.sent()];
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
    FormsSpecService.prototype["delete"] = function (token, id) {
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
                        return [4 /*yield*/, this.formsSpecRep["delete"]({ id: id, company: userData.compId })];
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
    /**
     *
     * @param company
     */
    FormsSpecService.prototype.saveData = function (token, data) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, mapper, newData, res, ex_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getUserData(token)];
                    case 1:
                        userData = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        data.company = data.company ? data.company.id : userData.compId;
                        mapper = new light_mapper_1.LightMapper();
                        newData = mapper.map(ra_forms_specification_1.RaFormsSpec, data);
                        if (data.type === "N") {
                            delete newData.id;
                            newData.createdBy = userData.nickName;
                        }
                        else {
                            newData.id = data.id;
                            newData.updatedBy = userData.nickName;
                        }
                        return [4 /*yield*/, this.formsSpecRep.save(newData)];
                    case 3:
                        res = _a.sent();
                        return [4 /*yield*/, this.formsSpecRep.findOne({ where: { id: res.id }, relations: ["company"] })];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        ex_4 = _a.sent();
                        ex_4.userId = userData.userId;
                        this.systemService.sendException(ex_4);
                        this.logger.error(ex_4);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FormsSpecService = __decorate([
        common_1.Injectable(),
        __param(2, common_1.Inject("logger")),
        __param(3, common_1.Inject("formsSpecRepository"))
    ], FormsSpecService);
    return FormsSpecService;
}());
exports.FormsSpecService = FormsSpecService;
