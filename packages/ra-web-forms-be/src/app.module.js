"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var users_module_1 = require("@ra/web-shared-be/dist/users/users.module");
var object_rights_module_1 = require("@ra/web-shared-be/dist/object-rights/object-rights.module");
var layout_module_1 = require("@ra/web-shared-be/dist/layout/layout.module");
var preferences_module_1 = require("@ra/web-shared-be/dist/preferences/preferences.module");
var auth_module_1 = require("@ra/web-auth-be/dist/auth.module");
var user_session_data_1 = require("@ra/web-shared-be/dist/users/user-session-data");
var user_auth_verify_1 = require("@ra/web-shared-be/dist/users/user-auth-verify");
var app_directory_module_1 = require("@ra/web-shared-be/dist/app-directory/app-directory.module");
var dao_module_1 = require("@ra/web-core-be/dist/dao/dao.module");
var forms_module_1 = require("./forms-data/forms.module");
var entities_1 = require("./forms-dao/entity/entities");
var forms_dao_module_1 = require("./forms-dao/forms-dao.module");
var forms_spec_module_1 = require("./forms-spec/forms-spec.module");
var companies_module_1 = require("@ra/web-shared-be/dist/companies/companies.module");
var locates_data_module_1 = require("./locates-data/locates-data.module");
var hub_channel_module_1 = require("./hub-channel/hub-channel.module");
var system_channel_module_1 = require("./system-channel/system-channel.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                auth_module_1.AuthModule.forRoot(user_session_data_1.UserSessionData, user_auth_verify_1.UserAuthVerify),
                object_rights_module_1.ObjectRightsModule,
                users_module_1.UsersModule,
                layout_module_1.LayoutModule,
                forms_module_1.FormsModule,
                locates_data_module_1.LocatesModule,
                hub_channel_module_1.HubChannelModule,
                system_channel_module_1.SystemChannelModule,
                dao_module_1.DaoModule.forRoot(entities_1.entities.slice()),
                forms_dao_module_1.FormsDaoModule,
                forms_spec_module_1.FormsSpecModule,
                preferences_module_1.PreferencesModule,
                companies_module_1.CompaniesModule,
                app_directory_module_1.AppDirectoryModule,
            ],
            providers: [],
            exports: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
