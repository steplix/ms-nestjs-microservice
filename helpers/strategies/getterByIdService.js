"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetterByIdServiceStrategy = void 0;
const common_1 = require("@nestjs/common");
const query_1 = require("../query");
//
// constants
//
const defaultColumn = "id";
//
// source code
//
let GetterByIdServiceStrategy = class GetterByIdServiceStrategy {
    /**
     * Get by ID
     *
     * @param id {number|string} Unique model IDentifier
     * @param model {Model<?>} Model
     * @param options {object} Find options
     * @param options.field {string} ID column|field name. Default is "id"
     * @param options.query {FinderDto} Query options
     *
     * @return result {?} Result of get model by id
     */
    async getById(id, model, options = {}) {
        const opts = (0, query_1.queryParse)(options.query);
        this.resolveWhere(id, options.field || defaultColumn, opts);
        return model.findOne(opts);
    }
    /**
     * Resolver where condition for id field
     */
    resolveWhere(id, field, options) {
        options.where = options.where || {};
        options.where[field] = id;
    }
};
GetterByIdServiceStrategy = __decorate([
    (0, common_1.Injectable)()
], GetterByIdServiceStrategy);
exports.GetterByIdServiceStrategy = GetterByIdServiceStrategy;
