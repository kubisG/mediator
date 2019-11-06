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
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var client_router_service_1 = require("@ra/web-ee-router/dist/client-router.service");
var HubClientRouterService = /** @class */ (function (_super) {
    __extends(HubClientRouterService, _super);
    function HubClientRouterService(logger) {
        var _this = _super.call(this, logger) || this;
        _this.logger = logger;
        return _this;
    }
    HubClientRouterService = __decorate([
        common_1.Injectable(),
        __param(0, common_1.Inject("logger"))
    ], HubClientRouterService);
    return HubClientRouterService;
}(client_router_service_1.ClientRouterService));
exports.HubClientRouterService = HubClientRouterService;
