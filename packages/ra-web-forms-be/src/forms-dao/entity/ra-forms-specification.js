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
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var a_entity_1 = require("@ra/web-core-be/dist/db/a-entity");
var ra_company_1 = require("@ra/web-core-be/dist/db/entity/ra-company");
var light_mapper_1 = require("light-mapper");
var RaFormsSpec = /** @class */ (function (_super) {
    __extends(RaFormsSpec, _super);
    function RaFormsSpec(id) {
        var _this = _super.call(this) || this;
        if (id) {
            _this.id = id;
        }
        return _this;
    }
    RaFormsSpec.prototype.updateDates = function () {
        this.updatedDate = new Date();
    };
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.PrimaryGeneratedColumn(),
        typeorm_1.Index()
    ], RaFormsSpec.prototype, "id");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.REQUIRED),
        typeorm_1.Column()
    ], RaFormsSpec.prototype, "dataType");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ "default": "MAIN" })
    ], RaFormsSpec.prototype, "subType");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.REQUIRED),
        typeorm_1.Column()
    ], RaFormsSpec.prototype, "name");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ type: "jsonb", nullable: true })
    ], RaFormsSpec.prototype, "spec");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaFormsSpec.prototype, "createdBy");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaFormsSpec.prototype, "updatedBy");
    __decorate([
        light_mapper_1.Mapping({
            requirement: light_mapper_1.MappingRequirement.REQUIRED,
            transformation: function (companyId) {
                return new ra_company_1.RaCompany(companyId);
            }
        }),
        typeorm_1.ManyToOne(function () { return ra_company_1.RaCompany; }, function (raCompany) { return raCompany.user; })
    ], RaFormsSpec.prototype, "company");
    __decorate([
        typeorm_1.Column({ type: "timestamptz", nullable: true, "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], RaFormsSpec.prototype, "createDate");
    __decorate([
        typeorm_1.Column({ type: "timestamptz", "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], RaFormsSpec.prototype, "updatedDate");
    __decorate([
        typeorm_1.BeforeUpdate()
    ], RaFormsSpec.prototype, "updateDates");
    RaFormsSpec = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["dataType"])
    ], RaFormsSpec);
    return RaFormsSpec;
}(a_entity_1.AEntity));
exports.RaFormsSpec = RaFormsSpec;
