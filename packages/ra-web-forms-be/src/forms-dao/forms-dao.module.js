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
var repository_provider_1 = require("./repository.provider");
var locates_update_subscriber_1 = require("./subscribers/locates-update.subscriber");
var environments_module_1 = require("@ra/web-env-be/dist/environments.module");
var FormsDaoModule = /** @class */ (function () {
    function FormsDaoModule() {
    }
    FormsDaoModule = __decorate([
        common_1.Module({
            imports: [
                core_module_1.CoreModule,
                environments_module_1.EnvironmentsModule,
            ],
            controllers: [],
            providers: repository_provider_1.entityProviders.concat([
                locates_update_subscriber_1.LocatesUpdateSubscriber,
            ]),
            exports: repository_provider_1.entityProviders.concat([
                locates_update_subscriber_1.LocatesUpdateSubscriber,
            ])
        })
    ], FormsDaoModule);
    return FormsDaoModule;
}());
exports.FormsDaoModule = FormsDaoModule;
