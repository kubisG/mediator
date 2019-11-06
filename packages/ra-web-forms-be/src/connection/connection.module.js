"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var core_module_1 = require("@ra/web-core-be/dist/core.module");
var queue_module_1 = require("@ra/web-queue/dist/queue.module");
var auth_module_1 = require("@ra/web-auth-be/dist/auth.module");
var connection_provider_1 = require("./connection.provider");
var environments_module_1 = require("@ra/web-env-be/dist/environments.module");
var ConnectionModule = /** @class */ (function () {
    function ConnectionModule() {
    }
    ConnectionModule = __decorate([
        common_1.Module({
            imports: [
                environments_module_1.EnvironmentsModule,
                core_module_1.CoreModule,
                auth_module_1.AuthModule,
                queue_module_1.QueueModule,
            ],
            controllers: [],
            providers: [
                connection_provider_1.queueFactory,
            ],
            exports: [
                connection_provider_1.queueFactory,
            ]
        })
    ], ConnectionModule);
    return ConnectionModule;
}());
exports.ConnectionModule = ConnectionModule;
