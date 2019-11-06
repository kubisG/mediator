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
var forms_service_1 = require("./forms.service");
var forms_controller_1 = require("./forms.controller");
var forms_dao_module_1 = require("../forms-dao/forms-dao.module");
var system_channel_module_1 = require("../system-channel/system-channel.module");
var FormsModule = /** @class */ (function () {
    function FormsModule() {
    }
    FormsModule = __decorate([
        common_1.Module({
            imports: [
                core_module_1.CoreModule,
                auth_module_1.AuthModule,
                system_channel_module_1.SystemChannelModule,
                forms_dao_module_1.FormsDaoModule,
            ],
            controllers: [
                forms_controller_1.FormsController,
            ],
            providers: [
                forms_service_1.FormsService,
            ]
        })
    ], FormsModule);
    return FormsModule;
}());
exports.FormsModule = FormsModule;
