"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
class HealthEntity {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: "Indicate if micro service is alive.",
    }),
    __metadata("design:type", Boolean)
], HealthEntity.prototype, "alive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: "Micro service name." }),
    __metadata("design:type", String)
], HealthEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: "Micro service version." }),
    __metadata("design:type", String)
], HealthEntity.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Environment where it is running.",
    }),
    __metadata("design:type", String)
], HealthEntity.prototype, "environment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: "Indicate micro service status" }),
    __metadata("design:type", String)
], HealthEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, description: "Includes information" }),
    __metadata("design:type", Object)
], HealthEntity.prototype, "info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: "Includes more details information",
    }),
    __metadata("design:type", Object)
], HealthEntity.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, description: "Error information" }),
    __metadata("design:type", Object)
], HealthEntity.prototype, "error", void 0);
exports.HealthEntity = HealthEntity;
