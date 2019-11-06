"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var hub_channel_service_1 = require("./hub-channel.service");
var connection_module_1 = require("../connection/connection.module");
var hub_channel_message_router_service_1 = require("./hub-channel-message-router.service");
var environments_module_1 = require("@ra/web-env-be/dist/environments.module");
var hub_channel_providers_1 = require("./hub-channel.providers");
var ee_router_module_1 = require("@ra/web-ee-router/dist/ee-router.module");
var core_module_1 = require("@ra/web-core-be/dist/core.module");
var auth_module_1 = require("@ra/web-auth-be/dist/auth.module");
var jwt_1 = require("@nestjs/jwt");
var environment_service_1 = require("@ra/web-env-be/dist/environment.service");
var passport_1 = require("@nestjs/passport");
var forms_dao_module_1 = require("../forms-dao/forms-dao.module");
var hub_channel_controller_1 = require("./hub-channel.controller");
var hub_client_router_service_1 = require("./hub-client-router.service");
var hub_channel_gateway_1 = require("./hub-channel.gateway");
var HubChannelModule = /** @class */ (function () {
    function HubChannelModule() {
    }
    HubChannelModule = __decorate([
        common_1.Module({
            imports: [
                auth_module_1.AuthModule,
                core_module_1.CoreModule,
                forms_dao_module_1.FormsDaoModule,
                ee_router_module_1.EERouterModule,
                connection_module_1.ConnectionModule,
                environments_module_1.EnvironmentsModule,
                passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
                jwt_1.JwtModule.register({
                    secret: environment_service_1.EnvironmentService.instance.auth.secretKey,
                    signOptions: {
                        expiresIn: environment_service_1.EnvironmentService.instance.auth.expiresIn
                    }
                }),
            ],
            controllers: [
                hub_channel_controller_1.HubChannelController,
            ],
            providers: hub_channel_providers_1.inMessageMiddlewares.concat(hub_channel_providers_1.outMessageMiddlewares, [
                hub_channel_providers_1.inMiddlewaresProvider,
                hub_channel_providers_1.outMiddlewaresProvider,
                hub_channel_service_1.HubChannelService,
                hub_channel_message_router_service_1.HubMessageRouterService,
                hub_client_router_service_1.HubClientRouterService,
                hub_channel_gateway_1.HubChannelGateWay,
            ])
        })
    ], HubChannelModule);
    return HubChannelModule;
}());
exports.HubChannelModule = HubChannelModule;
