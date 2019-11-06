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
var passport_1 = require("@nestjs/passport");
var swagger_1 = require("@nestjs/swagger");
var bearer_decorator_1 = require("@ra/web-auth-be/dist/decorators/bearer.decorator");
var FormsController = /** @class */ (function () {
    function FormsController(formsService) {
        this.formsService = formsService;
    }
    FormsController.prototype.getMany = function (typ, dates, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService.findMany(token, dates, typ)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FormsController.prototype.insert = function (token, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService.saveData(token, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FormsController.prototype.findOne = function (token, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService.findOne(token, id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FormsController.prototype.deleteOne = function (token, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService["delete"](token, id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FormsController.prototype.getLists = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService.findLists(token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FormsController.prototype.getOne = function (token, key) {
        return __awaiter(this, void 0, void 0, function () {
            var record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService.findList(token, key)];
                    case 1:
                        record = _a.sent();
                        if (record) {
                            return [2 /*return*/, record.spec];
                        }
                        else {
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FormsController.prototype.getExternalData = function (token, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService.getExternalData(token, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FormsController.prototype.getTableData = function (token, table) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService.getTableData(token, table)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FormsController.prototype.getRulesData = function (token, typ) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService.getRules(token, typ)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FormsController.prototype.getRecordHistory = function (token, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formsService.findHistory(token, id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        common_1.Get("/all/:typ/:dates/"),
        swagger_1.ApiImplicitParam({ name: "dates" }),
        swagger_1.ApiImplicitParam({ name: "typ" }),
        __param(0, common_1.Param("typ")), __param(1, common_1.Param("dates")), __param(2, bearer_decorator_1.Bearer())
    ], FormsController.prototype, "getMany");
    __decorate([
        common_1.Post(),
        __param(0, bearer_decorator_1.Bearer()), __param(1, common_1.Body())
    ], FormsController.prototype, "insert");
    __decorate([
        common_1.Get(":id"),
        swagger_1.ApiImplicitParam({ name: "id" }),
        __param(0, bearer_decorator_1.Bearer()), __param(1, common_1.Param("id"))
    ], FormsController.prototype, "findOne");
    __decorate([
        common_1.Delete(":id"),
        swagger_1.ApiImplicitParam({ name: "id" }),
        __param(0, bearer_decorator_1.Bearer()), __param(1, common_1.Param("id"))
    ], FormsController.prototype, "deleteOne");
    __decorate([
        common_1.Get("/lists/"),
        __param(0, bearer_decorator_1.Bearer())
    ], FormsController.prototype, "getLists");
    __decorate([
        common_1.Get("/lists/:id"),
        swagger_1.ApiImplicitParam({ name: "id" }),
        __param(0, bearer_decorator_1.Bearer()), __param(1, common_1.Param("id"))
    ], FormsController.prototype, "getOne");
    __decorate([
        common_1.Post("/external"),
        __param(0, bearer_decorator_1.Bearer()), __param(1, common_1.Body())
    ], FormsController.prototype, "getExternalData");
    __decorate([
        common_1.Get("/internal/:table"),
        swagger_1.ApiImplicitParam({ name: "table" }),
        __param(0, bearer_decorator_1.Bearer()), __param(1, common_1.Param("table"))
    ], FormsController.prototype, "getTableData");
    __decorate([
        common_1.Get("/subrules/:typ"),
        swagger_1.ApiImplicitParam({ name: "typ" }),
        __param(0, bearer_decorator_1.Bearer()), __param(1, common_1.Param("typ"))
    ], FormsController.prototype, "getRulesData");
    __decorate([
        common_1.Get("/history/:id"),
        swagger_1.ApiImplicitParam({ name: "id" }),
        __param(0, bearer_decorator_1.Bearer()), __param(1, common_1.Param("id"))
    ], FormsController.prototype, "getRecordHistory");
    FormsController = __decorate([
        common_1.Controller("forms"),
        common_1.UseGuards(passport_1.AuthGuard()),
        swagger_1.ApiBearerAuth()
    ], FormsController);
    return FormsController;
}());
exports.FormsController = FormsController;
