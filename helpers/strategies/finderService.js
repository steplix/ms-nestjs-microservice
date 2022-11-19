"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinderServiceStrategy = void 0;
const common_1 = require("@nestjs/common");
const query_1 = require("../query");
//
// source code
//
let FinderServiceStrategy = class FinderServiceStrategy {
    /**
     * Find
     *
     * @param model {Model<?>} Model
     * @param options {object} Find options
     * @param options.query {FinderDto} Query options
     *
     * @return result {array<?>} Result of filtering models by query
     */
    async find(model, options = {}) {
        const opts = (0, query_1.queryParse)(options.query);
        return await model.findAll(opts);
    }
};
FinderServiceStrategy = __decorate([
    (0, common_1.Injectable)()
], FinderServiceStrategy);
exports.FinderServiceStrategy = FinderServiceStrategy;
