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
var auth_module_1 = require("@ra/web-auth-be/dist/auth.module");
var system_channel_service_1 = require("./system-channel.service");
var system_channel_gateway_1 = require("./system-channel.gateway");
var environments_module_1 = require("@ra/web-env-be/dist/environments.module");
var passport_1 = require("@nestjs/passport");
var jwt_1 = require("@nestjs/jwt");
var environment_service_1 = require("@ra/web-env-be/dist/environment.service");
var SystemChannelModule = /** @class */ (function () {
    function SystemChannelModule() {
    }
    SystemChannelModule = __decorate([
        common_1.Module({
            imports: [
                core_module_1.CoreModule,
                auth_module_1.AuthModule,
                environments_module_1.EnvironmentsModule,
                passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
                jwt_1.JwtModule.register({
                    secret: environment_service_1.EnvironmentService.instance.auth.secretKey,
                    signOptions: {
                        expiresIn: environment_service_1.EnvironmentService.instance.auth.expiresIn
                    }
                }),
            ],
            controllers: [],
            providers: [
                system_channel_gateway_1.SystemChannelGateway,
                system_channel_service_1.SystemChannelService,
            ],
            exports: [
                system_channel_service_1.SystemChannelService,
            ]
        })
    ], SystemChannelModule);
    return SystemChannelModule;
}());
exports.SystemChannelModule = SystemChannelModule;
