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
exports.FinderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FinderDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Filters condition",
        example: "categoryId eq 1,description li *cerveza*",
        required: false,
        default: null,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FinderDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order registers",
        example: "createdOnUtc-DESC",
        required: false,
        default: null,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FinderDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Group registers",
        example: "id",
        required: false,
        default: null,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FinderDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Fields",
        example: "*",
        required: false,
        default: null,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FinderDto.prototype, "fields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Include relationships (Format, relation)",
        example: "status",
        required: false,
        default: null,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FinderDto.prototype, "include", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Remote relationships (Format, relation)",
        example: "product",
        required: false,
        default: null,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FinderDto.prototype, "remotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Indicate page size length",
        example: "10",
        required: false,
        default: 25,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)({}, { message: "Invalid page size" }),
    __metadata("design:type", String)
], FinderDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Indicate current page",
        example: "1",
        required: false,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)({}, { message: "Invalid page" }),
    __metadata("design:type", String)
], FinderDto.prototype, "page", void 0);
exports.FinderDto = FinderDto;
