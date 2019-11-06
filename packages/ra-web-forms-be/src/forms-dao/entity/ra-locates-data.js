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
var light_mapper_1 = require("light-mapper");
var a_entity_1 = require("@ra/web-core-be/dist/db/a-entity");
var ra_company_1 = require("@ra/web-core-be/dist/db/entity/ra-company");
var RaLocatesData = /** @class */ (function (_super) {
    __extends(RaLocatesData, _super);
    function RaLocatesData(id) {
        var _this = _super.call(this) || this;
        if (id) {
            _this.id = id;
        }
        return _this;
    }
    RaLocatesData.prototype.updateDates = function () {
        this.updatedDate = new Date();
    };
    RaLocatesData.prototype.insertDates = function () {
        this.createDate = new Date();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        typeorm_1.Index()
    ], RaLocatesData.prototype, "id");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ "default": "Notice" })
    ], RaLocatesData.prototype, "reqType");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.REQUIRED),
        typeorm_1.Column()
    ], RaLocatesData.prototype, "user");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.REQUIRED),
        typeorm_1.Column()
    ], RaLocatesData.prototype, "symbol");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.REQUIRED),
        typeorm_1.Column()
    ], RaLocatesData.prototype, "quantity");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.REQUIRED),
        typeorm_1.Column()
    ], RaLocatesData.prototype, "broker");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaLocatesData.prototype, "comment");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true, "default": 0 })
    ], RaLocatesData.prototype, "usedShares");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true, "default": 0 })
    ], RaLocatesData.prototype, "availableShares");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaLocatesData.prototype, "orderId");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaLocatesData.prototype, "repId");
    __decorate([
        typeorm_1.Column({ "default": "New" })
    ], RaLocatesData.prototype, "status");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ "default": "Firm" })
    ], RaLocatesData.prototype, "poolType");
    __decorate([
        typeorm_1.Column({ type: "jsonb", nullable: true })
    ], RaLocatesData.prototype, "wsResponse");
    __decorate([
        light_mapper_1.Mapping({
            requirement: light_mapper_1.MappingRequirement.REQUIRED,
            transformation: function (companyId) {
                return new ra_company_1.RaCompany(companyId);
            }
        }),
        typeorm_1.ManyToOne(function () { return ra_company_1.RaCompany; }, function (raCompany) { return raCompany.user; })
    ], RaLocatesData.prototype, "company");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaLocatesData.prototype, "clientId");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaLocatesData.prototype, "createdBy");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaLocatesData.prototype, "updatedBy");
    __decorate([
        typeorm_1.Column({ type: "timestamptz", nullable: true, "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], RaLocatesData.prototype, "createDate");
    __decorate([
        typeorm_1.Column({ type: "timestamptz", nullable: true, "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], RaLocatesData.prototype, "updatedDate");
    __decorate([
        typeorm_1.BeforeUpdate()
    ], RaLocatesData.prototype, "updateDates");
    __decorate([
        typeorm_1.BeforeInsert()
    ], RaLocatesData.prototype, "insertDates");
    RaLocatesData = __decorate([
        typeorm_1.Entity()
    ], RaLocatesData);
    return RaLocatesData;
}(a_entity_1.AEntity));
exports.RaLocatesData = RaLocatesData;
