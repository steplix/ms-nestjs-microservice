"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetterOneServiceStrategy = void 0;
const common_1 = require("@nestjs/common");
const finderService_1 = require("./finderService");
//
// source code
//
let GetterOneServiceStrategy = class GetterOneServiceStrategy extends finderService_1.FinderServiceStrategy {
    /**
     * Get one
     *
     * @param model {Model<?>} Model
     * @param options {object} Find options
     * @param options.query {FinderDto} Query options
     *
     * @return result {?} First result of filtering models by query
     */
    async getOne(model, options = {}) {
        const [result] = (await this.find(model, options)) || [];
        return result;
    }
};
GetterOneServiceStrategy = __decorate([
    (0, common_1.Injectable)()
], GetterOneServiceStrategy);
exports.GetterOneServiceStrategy = GetterOneServiceStrategy;
