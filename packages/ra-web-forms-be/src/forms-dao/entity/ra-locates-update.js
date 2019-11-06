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
var RaLocatesUpdate = /** @class */ (function (_super) {
    __extends(RaLocatesUpdate, _super);
    function RaLocatesUpdate(id) {
        var _this = _super.call(this) || this;
        if (id) {
            _this.id = id;
        }
        return _this;
    }
    RaLocatesUpdate.prototype.insertDates = function () {
        this.createDate = new Date();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        typeorm_1.Index()
    ], RaLocatesUpdate.prototype, "id");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.REQUIRED),
        typeorm_1.Column()
    ], RaLocatesUpdate.prototype, "recordId");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaLocatesUpdate.prototype, "symbol");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaLocatesUpdate.prototype, "clientId");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.OPTIONAL),
        typeorm_1.Column({ nullable: true })
    ], RaLocatesUpdate.prototype, "broker");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.REQUIRED),
        typeorm_1.Column()
    ], RaLocatesUpdate.prototype, "usedQuantity");
    __decorate([
        light_mapper_1.Mapping(light_mapper_1.MappingRequirement.REQUIRED),
        typeorm_1.Column()
    ], RaLocatesUpdate.prototype, "type");
    __decorate([
        typeorm_1.Column({ type: "timestamptz", nullable: true, "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], RaLocatesUpdate.prototype, "createDate");
    __decorate([
        typeorm_1.Column({ type: "timestamptz", nullable: true, "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], RaLocatesUpdate.prototype, "updatedDate");
    __decorate([
        typeorm_1.BeforeInsert()
    ], RaLocatesUpdate.prototype, "insertDates");
    RaLocatesUpdate = __decorate([
        typeorm_1.Entity()
    ], RaLocatesUpdate);
    return RaLocatesUpdate;
}(a_entity_1.AEntity));
exports.RaLocatesUpdate = RaLocatesUpdate;
