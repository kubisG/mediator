"use strict";
exports.__esModule = true;
var forms_data_repository_1 = require("./repositories/forms-data.repository");
var forms_spec_repository_1 = require("./repositories/forms-spec.repository");
var ra_forms_specification_1 = require("./entity/ra-forms-specification");
var ra_forms_data_1 = require("./entity/ra-forms-data");
var db_provider_1 = require("@ra/web-core-be/dist/db/db.provider");
var ra_locates_data_1 = require("./entity/ra-locates-data");
var locates_data_repository_1 = require("./repositories/locates-data.repository");
var ra_exhange_data_1 = require("./entity/ra-exhange-data");
var exchange_data_repository_1 = require("./repositories/exchange-data.repository");
var ra_rules_data_1 = require("./entity/ra-rules-data");
var rules_data_repository_1 = require("./repositories/rules-data.repository");
var ra_locates_update_1 = require("./entity/ra-locates-update");
var locates_update_repository_1 = require("./repositories/locates-update.repository");
exports.entityProviders = [
    {
        provide: "formsDataRepository",
        useFactory: function (connection) {
            var repo = connection().getRepository(ra_forms_data_1.RaFormsData);
            var form = new forms_data_repository_1.FormsDataRepository(repo);
            return db_provider_1.databaseRepos(form, repo);
        },
        inject: ["DbConnection"]
    },
    {
        provide: "formsSpecRepository",
        useFactory: function (connection) {
            var repo = connection().getRepository(ra_forms_specification_1.RaFormsSpec);
            var form = new forms_spec_repository_1.FormsSpecRepository(repo);
            return db_provider_1.databaseRepos(form, repo);
        },
        inject: ["DbConnection"]
    },
    {
        provide: "locatesDataRepository",
        useFactory: function (connection) {
            var repo = connection().getRepository(ra_locates_data_1.RaLocatesData);
            var form = new locates_data_repository_1.LocatesDataRepository(repo);
            return db_provider_1.databaseRepos(form, repo);
        },
        inject: ["DbConnection"]
    },
    {
        provide: "exchangeDataRepository",
        useFactory: function (connection) {
            var repo = connection().getRepository(ra_exhange_data_1.RaExchangeData);
            var form = new exchange_data_repository_1.ExchangeDataRepository(repo);
            return db_provider_1.databaseRepos(form, repo);
        },
        inject: ["DbConnection"]
    },
    {
        provide: "rulesDataRepository",
        useFactory: function (connection) {
            var repo = connection().getRepository(ra_rules_data_1.RaRulesData);
            var form = new rules_data_repository_1.RulesDataRepository(repo);
            return db_provider_1.databaseRepos(form, repo);
        },
        inject: ["DbConnection"]
    },
    {
        provide: "locatesUpdateRepository",
        useFactory: function (connection) {
            var repo = connection().getRepository(ra_locates_update_1.RaLocatesUpdate);
            var form = new locates_update_repository_1.LocatesUpdateRepository(repo);
            return db_provider_1.databaseRepos(form, repo);
        },
        inject: ["DbConnection"]
    },
];
