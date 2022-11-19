"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHealthIndicator = void 0;
const terminus_1 = require("@nestjs/terminus");
const common_1 = require("@nestjs/common");
const service_1 = require("./service");
const helpers_1 = require("../helpers");
let ServiceHealthIndicator = class ServiceHealthIndicator extends terminus_1.HealthIndicator {
    async isHealthy(key) {
        const service = service_1.Service.get(key);
        if (!service) {
            throw new terminus_1.HealthCheckError(`Service ${key} not found`, {});
        }
        let isHealthy = true;
        const data = {
            alive: true,
            url: service.options.baseURL,
        };
        try {
            const status = await service.health();
            isHealthy = !!status;
            data.status = status;
        }
        catch (e) {
            helpers_1.logger.warn(`Service ${key} failed`, e);
            isHealthy = false;
            data.status = "error";
            data.error = `Service ${key} failed. ${e}`;
        }
        data.alive = isHealthy;
        return this.getStatus(key, isHealthy, data);
    }
};
ServiceHealthIndicator = __decorate([
    (0, common_1.Injectable)()
], ServiceHealthIndicator);
exports.ServiceHealthIndicator = ServiceHealthIndicator;
